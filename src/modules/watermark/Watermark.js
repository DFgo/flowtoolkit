/**
 * Watermark 水印类
 * @module watermark/Watermark
 */

import { DEFAULT_CONFIG } from './config.js';
import * as utils from './utils.js';

/**
 * Watermark 水印类
 * @class
 */
export class Watermark {
  /** @type {WatermarkOptions} */
  #options;

  /** @type {HTMLElement|null} */
  #watermarkElement = null;

  /** @type {MutationObserver|null} */
  #observer = null;

  /** @type {MutationObserver|null} */
  #selfObserver = null;

  /** @type {Function|null} */
  #resizeHandler = null;

  /** @type {boolean} */
  #isCreated = false;

  /** @type {Function|null} */
  #drawFn = null;

  /** @type {Function|null} */
  #recoverFn = null;

  /** @type {boolean} */
  #isVerified = false;

  /** @type {HTMLElement|null} */
  #modalElement = null;

  /** @type {Function|null} */
  #beforePrintFn = null;

  /** @type {Function|null} */
  #afterPrintFn = null;

  /**
   * @param {Partial<WatermarkOptions>} [options={}]
   */
  constructor(options = {}) {
    this.#options = utils.deepMerge(DEFAULT_CONFIG, options);
    this.#options.parent = options.parent || document.body;
  }

  /**
   * 创建水印绘制函数
   * @returns {Function} 绘制函数
   */
  #createWatermarkCanvas() {
    const options = this.#options;
    const canvas = utils.createHDCanvas(options.width || 300, options.height || 300);

    return () => {
      return new Promise((resolve) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(canvas);
          return;
        }

        utils.clearCanvas(canvas);

        const opts = options;
        // 设置字体样式（过滤空值）
        ctx.font = [
          opts.fontStyle || '',
          opts.fontVariant || '',
          opts.fontWeight || 'normal',
          opts.fontSize || '16px',
          opts.fontFamily || 'sans-serif'
        ]
          .filter(Boolean)
          .join(' ');

        ctx.fillStyle = opts.fontColor || '#000000';
        ctx.globalAlpha = opts.globalAlpha ?? 0.5;
        ctx.textAlign = opts.textAlign || 'center';
        ctx.textBaseline = opts.textBaseline || 'middle';

        const content = opts.content || '';
        const contentType = opts.contentType || 'text';
        const w = opts.width || 300;
        const h = opts.height || 300;
        const rotate = ((opts.rotate || 0) * Math.PI) / 180;
        const x = w / 2;
        const y = h / 2;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotate);

        if (contentType === 'text') {
          ctx.fillText(content, 0, 0);
        } else if (contentType === 'multi-line-text') {
          const maxW = opts.textRowMaxWidth || w;
          const lines = utils.splitMultiLineText(ctx, content, maxW);
          const lineHeight = opts.lineHeight || 30;
          const total = lines.length;
          const startY = (-(total - 1) * lineHeight) / 2;
          for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], 0, startY + i * lineHeight);
          }
        }

        ctx.restore();
        resolve(canvas);
      });
    };
  }

  /**
   * 创建水印 DOM 元素
   * @param {string} dataURL - 水印图片的 dataURL
   * @returns {HTMLDivElement} 创建的水印元素
   */
  #createWatermarkDOM(dataURL) {
    const opts = this.#options;

    // 单例模式下先移除已存在的水印
    if (opts.mode === 'single' && this.#watermarkElement) {
      this.#watermarkElement.remove();
      this.#watermarkElement = null; // 修复：清空引用
    }

    const div = document.createElement('div');
    div.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: ${opts.zIndex};
      background-image: url("${dataURL}");
      background-repeat: repeat;
      background-size: ${opts.width}px ${opts.height}px;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    `;

    div.setAttribute('data-watermark-guard', 'true');
    div.setAttribute('data-watermark-id', Date.now().toString(36));

    // 处理父节点
    let parent;
    if (utils.isString(opts.parent)) {
      parent = document.querySelector(opts.parent);
    } else if (utils.isElement(opts.parent)) {
      parent = opts.parent;
    }
    parent = parent || document.body;

    if (parent !== document.body) {
      const parentPosition = getComputedStyle(parent).position;
      if (!parentPosition || parentPosition === 'static') {
        parent.style.position = 'relative';
      }
      div.style.position = 'absolute';
      div.style.width = '100%';
      div.style.height = '100%';
    }

    parent.appendChild(div);
    return div;
  }

  /**
   * 启动水印防篡改保护
   */
  #startMutationProtection() {
    if (!this.#options.protect || this.#isVerified || !this.#watermarkElement || !this.#recoverFn) return;

    this.#stopMutationProtection();

    const parent = this.#watermarkElement.parentNode;
    if (parent) {
      this.#observer = new MutationObserver((mutations) => {
        const removed = mutations.some(
          (m) =>
            m.type === 'childList' && [...m.removedNodes].includes(this.#watermarkElement)
        );
        if (removed) {
          console.warn('[Watermark] 检测到水印被移除，正在恢复...');
          this.#recoverFn();
        }
      });

      this.#observer.observe(parent, {
        childList: true,
        subtree: false
      });
    }

    this.#selfObserver = new MutationObserver((mutations) => {
      const attrChanged = mutations.some((m) => m.type === 'attributes');
      if (attrChanged) {
        console.warn('[Watermark] 检测到水印属性被修改，正在恢复...');
        this.#recoverFn();
      }
    });

    this.#selfObserver.observe(this.#watermarkElement, {
      attributes: true,
      attributeFilter: ['style', 'class', 'data-watermark-guard']
    });
  }

  /**
   * 停止水印防篡改保护
   */
  #stopMutationProtection() {
    if (this.#observer) {
      this.#observer.disconnect();
      this.#observer = null;
    }
    if (this.#selfObserver) {
      this.#selfObserver.disconnect();
      this.#selfObserver = null;
    }
  }

  /**
   * 启动窗口大小变化监听
   */
  #startResizeListening() {
    if (!this.#options.updateOnResize || this.#isVerified || this.#resizeHandler) return;

    this.#resizeHandler = utils.debounce(() => {
      this.update().then(() => {
        console.log('[Watermark] 已根据窗口大小更新');
      });
    }, 200);

    window.addEventListener('resize', this.#resizeHandler);
  }

  /**
   * 停止窗口大小变化监听
   */
  #stopResizeListening() {
    if (this.#resizeHandler) {
      window.removeEventListener('resize', this.#resizeHandler);
      this.#resizeHandler = null;
    }
  }

  /**
   * 创建密码弹窗
   * @param {Function} onSuccess - 验证成功后的回调
   */
  #createPasswordModal(onSuccess) {
    // 移除已存在的弹窗
    if (this.#modalElement) {
      this.#modalElement.remove();
    }

    const { modalWidth, modalTitle } = this.#options;
    const overlay = utils.createOverlay();

    const modal = document.createElement('div');
    modal.className = 'watermark-password-modal';
    modal.style.cssText = `
      width: ${modalWidth}px;
      background: #fff;
      border-radius: 6px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.3s ease;
    `;

    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
      padding: 15px 20px;
      border-bottom: 1px solid #eee;
      font-size: 16px;
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    titleBar.innerHTML = `
      <span>${modalTitle}</span>
      <button class="modal-close" style="border: none; background: none; cursor: pointer; font-size: 18px; color: #999;">×</button>
    `;

    const content = document.createElement('div');
    content.style.cssText = 'padding: 20px;';
    content.innerHTML = `
      <p style="margin-bottom: 15px; color: #666; font-size: 14px;">请输入取消水印的密码：</p>
      <div style="margin-bottom: 10px;">
        <input type="password" id="watermarkPassword"
               placeholder="请输入密码"
               style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
      </div>
      <div id="errorMsg" style="color: #ff4d4f; margin-top: 10px; height: 20px; font-size: 12px;"></div>
    `;

    const footer = document.createElement('div');
    footer.style.cssText = `
      padding: 10px 20px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    `;
    footer.innerHTML = `
      <button class="modal-cancel" style="
        padding: 6px 16px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: #fff;
        cursor: pointer;
        font-size: 14px;
      ">取消</button>
      <button class="modal-confirm" style="
        padding: 6px 16px;
        border: none;
        border-radius: 4px;
        background: #1890ff;
        color: #fff;
        cursor: pointer;
        font-size: 14px;
      ">确认</button>
    `;

    modal.appendChild(titleBar);
    modal.appendChild(content);
    modal.appendChild(footer);
    overlay.appendChild(modal);

    setTimeout(() => {
      modal.style.transform = 'translateY(0)';
      modal.style.opacity = '1';
    }, 10);

    this.#modalElement = overlay;

    const passwordInput = content.querySelector('#watermarkPassword');
    const errorMsg = content.querySelector('#errorMsg');
    const closeBtn = titleBar.querySelector('.modal-close');
    const cancelBtn = footer.querySelector('.modal-cancel');
    const confirmBtn = footer.querySelector('.modal-confirm');

    const closeModal = () => {
      if (this.#modalElement) {
        utils.removeOverlay(this.#modalElement);
        this.#modalElement = null;
      }
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });

    confirmBtn.addEventListener('click', async () => {
      const password = passwordInput.value.trim();

      if (!password) {
        errorMsg.textContent = '请输入密码';
        passwordInput.focus();
        return;
      }

      confirmBtn.disabled = true;
      confirmBtn.textContent = '验证中...';

      const result = await utils.verifyPassword(password, this.#options.passwordVerifyUrl);

      confirmBtn.disabled = false;
      confirmBtn.textContent = '确认';

      if (result.success) {
        closeModal();
        onSuccess();
      } else {
        errorMsg.textContent = result.message;
        passwordInput.style.animation = 'shake 0.5s';
        setTimeout(() => {
          passwordInput.style.animation = '';
        }, 500);
      }
    });

    // 添加抖动动画样式
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(style);

    passwordInput.focus();
  }

  /**
   * 打印前处理
   */
  #beforePrint() {
    const watermarkEl = this.#watermarkElement;
    if (watermarkEl) {
      watermarkEl.dataset.originalOpacity = watermarkEl.style.opacity;
      watermarkEl.style.opacity = '0.5'; // 修复：使用合理值
      watermarkEl.style.zIndex = '2';
    }

    // 添加签名
    const container = document.querySelector('#rf_print_form_contents');
    if (container) {
      const instanceId = typeof oa !== 'undefined' && oa.flow ? oa.flow.instanceid : '';
      const userName = typeof oa !== 'undefined' && oa.user ? oa.user.name : '';
      container.insertAdjacentHTML('afterbegin', `<div>ID:${instanceId} Name:${userName}</div>`);
    }
  }

  /**
   * 打印后恢复
   */
  #afterPrint() {
    const watermarkEl = this.#watermarkElement;
    if (watermarkEl && watermarkEl.dataset.originalOpacity) {
      watermarkEl.style.opacity = watermarkEl.dataset.originalOpacity;
      watermarkEl.style.zIndex = this.#options.zIndex;
      delete watermarkEl.dataset.originalOpacity;
    }
  }

  /**
   * 更新水印
   * @returns {Promise}
   */
  update() {
    if (!this.#isCreated || !this.#watermarkElement || this.#isVerified) {
      return Promise.resolve();
    }

    return this.#drawFn().then((canvas) => {
      const dataURL = utils.canvasToImage(canvas);
      this.#watermarkElement.style.backgroundImage = `url("${dataURL}")`;
      return Promise.resolve();
    });
  }

  /**
   * 创建水印
   * @returns {Promise}
   */
  create() {
    const { isCheckPrint } = this.#options;

    // 检查打印表单元素
    if (isCheckPrint) {
      const targetElement = document.getElementById('rf_print_form_contents');
      if (targetElement) {
        console.log('检测到 #rf_print_form_contents 元素存在，取消水印创建');
        return Promise.resolve();
      }
    }

    if (this.#isCreated || this.#isVerified) return Promise.resolve();

    this.#drawFn = this.#createWatermarkCanvas();

    return this.#drawFn().then((canvas) => {
      const dataURL = utils.canvasToImage(canvas);
      this.#watermarkElement = this.#createWatermarkDOM(dataURL);

      // 设置恢复函数
      this.#recoverFn = () => this.recover();

      // 启动保护和监听
      this.#startMutationProtection();
      this.#startResizeListening();

      // 注册打印事件
      this.#beforePrintFn = () => this.#beforePrint();
      this.#afterPrintFn = () => this.#afterPrint();
      window.addEventListener('beforeprint', this.#beforePrintFn);
      window.addEventListener('afterprint', this.#afterPrintFn);

      this.#isCreated = true;
      return Promise.resolve();
    });
  }

  /**
   * 销毁水印
   */
  destroy() {
    if (this.#isCreated) {
      // 停止保护和监听
      this.#stopMutationProtection();
      this.#stopResizeListening();

      // 移除打印事件监听（修复：内存泄漏）
      if (this.#beforePrintFn) {
        window.removeEventListener('beforeprint', this.#beforePrintFn);
        this.#beforePrintFn = null;
      }
      if (this.#afterPrintFn) {
        window.removeEventListener('afterprint', this.#afterPrintFn);
        this.#afterPrintFn = null;
      }

      // 移除水印元素
      if (this.#watermarkElement && this.#watermarkElement.parentNode) {
        this.#watermarkElement.parentNode.removeChild(this.#watermarkElement);
      }

      // 重置状态
      this.#watermarkElement = null;
      this.#isCreated = false;
    }
  }

  /**
   * 恢复被篡改的水印
   */
  recover() {
    if (!this.#isVerified) {
      this.destroy();
      this.create().then(() => console.log('[Watermark] 已自动恢复'));
    }
  }

  /**
   * 重新配置水印
   * @param {Partial<WatermarkOptions>} newOptions
   * @returns {Promise}
   */
  reconfigure(newOptions) {
    if (this.#isVerified) return Promise.resolve();

    this.#options = utils.deepMerge(this.#options, newOptions);
    this.#drawFn = this.#createWatermarkCanvas();

    if (this.#isCreated) {
      return this.update().then(() => {
        this.#startMutationProtection();
        this.#startResizeListening();
        return Promise.resolve();
      });
    }

    return Promise.resolve();
  }

  /**
   * 带密码验证的取消水印
   * @returns {Promise<boolean>}
   */
  cancelWithPassword() {
    return new Promise((resolve) => {
      this.#createPasswordModal(() => {
        this.#isVerified = true;
        this.destroy();
        console.log('[Watermark] 密码验证通过，水印已取消');
        resolve(true);
      });
    });
  }

  /**
   * 恢复水印
   */
  restore() {
    if (this.#isVerified) {
      this.#isVerified = false;
      this.create().then(() => {
        console.log('[Watermark] 水印已恢复');
      });
    }
  }

  /**
   * 获取当前选项
   * @returns {WatermarkOptions}
   */
  getOptions() {
    return { ...this.#options };
  }

  /**
   * 检查是否已创建
   * @returns {boolean}
   */
  isCreated() {
    return this.#isCreated;
  }

  /**
   * 检查是否已验证
   * @returns {boolean}
   */
  isVerified() {
    return this.#isVerified;
  }
}

export default Watermark;
