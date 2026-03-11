/**
 * Watermark 工具函数
 * @module watermark/utils
 */

/**
 * 检查是否为函数
 * @param {*} v - 待检查值
 * @returns {boolean} 是否为函数
 */
export const isFunction = (v) => typeof v === 'function';

/**
 * 检查是否为字符串
 * @param {*} v - 待检查值
 * @returns {boolean} 是否为字符串
 */
export const isString = (v) => typeof v === 'string';

/**
 * 检查是否为 undefined
 * @param {*} v - 待检查值
 * @returns {boolean} 是否为 undefined
 */
export const isUndefined = (v) => v === undefined;

/**
 * 检查是否为 DOM 元素
 * @param {*} v - 待检查值
 * @returns {boolean} 是否为 DOM 元素
 */
export const isElement = (v) => v instanceof Element;

/**
 * 深合并对象
 * @param {Object} target - 目标对象
 * @param {Object} source - 源对象
 * @returns {Object} 合并后的对象
 */
export const deepMerge = (target, source) => {
  if (!source) return target;
  const merged = { ...target };
  Object.keys(source).forEach((key) => {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      !(source[key] instanceof Date) &&
      !(source[key] instanceof RegExp)
    ) {
      merged[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      merged[key] = source[key];
    }
  });
  return merged;
};

/**
 * 创建高清 Canvas（适配高分屏）
 * @param {number} width - 画布宽度
 * @param {number} height - 画布高度
 * @returns {HTMLCanvasElement} 创建的 Canvas 元素
 */
export const createHDCanvas = (width, height) => {
  const ratio = window.devicePixelRatio || 1;
  const canvas = document.createElement('canvas');
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.scale(ratio, ratio);
  return canvas;
};

/**
 * 清空 Canvas 内容
 * @param {HTMLCanvasElement} canvas - 要清空的 Canvas 元素
 */
export const clearCanvas = (canvas) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

/**
 * 将 Canvas 转换为图片 URL
 * @param {HTMLCanvasElement} canvas - 源 Canvas 元素
 * @returns {string} 图片的 dataURL
 */
export const canvasToImage = (canvas) => canvas.toDataURL('image/png', 1.0);

/**
 * 将文本按最大宽度拆分为多行
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 * @param {string} text - 要拆分的文本
 * @param {number} maxWidth - 最大宽度
 * @returns {string[]} 拆分后的行数组
 */
export const splitMultiLineText = (ctx, text, maxWidth) => {
  const lines = [];
  let currentLine = '';
  const paragraphs = text.split('\n');

  for (const paragraph of paragraphs) {
    if (paragraph === '') {
      lines.push('');
      continue;
    }
    currentLine = '';
    for (let i = 0; i < paragraph.length; i++) {
      const testLine = currentLine + paragraph[i];
      if (ctx.measureText(testLine).width > maxWidth) {
        lines.push(currentLine);
        currentLine = paragraph[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
  }
  return lines;
};

/**
 * 防抖函数
 * @param {Function} fn - 要防抖的函数
 * @param {number} delay - 延迟时间(ms)
 * @returns {Function} 防抖后的函数
 */
export const debounce = (fn, delay) => {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

/**
 * 验证密码（调用后端接口）
 * @param {string} password - 待验证的密码
 * @param {string} url - 验证接口地址
 * @returns {Promise<Object>} 验证结果
 */
export const verifyPassword = async (password, url) => {
  // 安全改进：密码应该通过 HTTPS 传输，并在后端进行哈希验证
  // 这里使用 oa.runSql 调用后端接口（假设后端会处理密码安全）
  try {
    // 检查 oa 对象是否存在
    if (typeof oa === 'undefined' || !oa.runSql) {
      console.error('OA 对象不可用');
      return {
        success: false,
        message: '系统错误'
      };
    }

    const result = oa.runSql(url, { password });
    const isSuccess =
      typeof result === 'object' && result.length > 0
        ? result[0].Column1 === 1
        : false;
    return {
      success: isSuccess,
      message: isSuccess ? '密码验证成功' : '密码验证失败'
    };
  } catch (error) {
    console.error('密码验证请求失败:', error);
    return {
      success: false,
      message: '网络错误，验证失败'
    };
  }
};

/**
 * 创建弹窗遮罩层
 * @returns {HTMLDivElement} 创建的遮罩层元素
 */
export const createOverlay = () => {
  const overlay = document.createElement('div');
  overlay.className = 'watermark-modal-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.style.opacity = '1';
  }, 10);

  return overlay;
};

/**
 * 移除遮罩层（带动画）
 * @param {HTMLDivElement} overlay - 要移除的遮罩层
 */
export const removeOverlay = (overlay) => {
  if (overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.remove();
    }, 300);
  }
};
