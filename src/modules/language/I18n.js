/**
 * I18n 国际化类
 * @module language/I18n
 */

import { DEFAULT_MESSAGES, DEFAULT_DATA_ATTR_SELECTOR } from './defaultMessages.js';

/**
 * I18n 国际化类
 * @class
 */
class I18nClass {
  /** @type {Object} */
  #config;

  /** @type {Object} */
  #mergedMessages = {};

  /** @type {Array} */
  #dataAttrSelector = [];

  /** @type {Function|null} */
  #debouncedReplaceAll = null;

  /** @type {MutationObserver|null} */
  #mutationObserver = null;

  /** @type {Set<HTMLElement>} */
  #cachedElements = new Set();

  /** @type {Map<HTMLElement, string>} */
  #elementKeyMap = new Map();

  /**
   * @param {Object} [options={}]
   */
  constructor(options = {}) {
    this.#config = {
      defaultLang: 'zh-CN',
      currentLang: 'zh-CN',
      customMessages: {},
      missingPlaceholder: (key) => `{{${key}}}`,
      debug: false,
      debounceDelay: 200,
      watchDynamicElements: true,
      onLangChange: null,
      replace: {
        attr: 'data-i18n',
        propTypes: ['text', 'html', 'input', 'title', 'placeholder', 'alt'],
        varPrefix: 'data-i18n-'
      }
    };

    if (options) {
      this.#config = { ...this.#config, ...options };
    }
  }

  /**
   * 防抖函数
   * @param {Function} fn
   * @param {number} delay
   * @returns {Function}
   */
  #debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /**
   * 合并默认语言包和自定义语言包
   * @param {Object} defaultMsgs
   * @param {Object} customMsgs
   * @returns {Object}
   */
  #mergeMessages(defaultMsgs, customMsgs) {
    const result = { ...defaultMsgs };
    Object.keys(customMsgs).forEach((lang) => {
      result[lang] = { ...(result[lang] || {}), ...customMsgs[lang] };
    });
    return result;
  }

  /**
   * 验证语言标识格式
   * @param {string} lang
   * @returns {boolean}
   */
  #validateLangFormat(lang) {
    const langReg = /^[a-z]{2}(-[A-Z]{2})?$/;
    return langReg.test(lang);
  }

  /**
   * 获取翻译文案
   * @param {string} key
   * @returns {string}
   */
  #getMessage(key) {
    const currentMsgs = this.#mergedMessages[this.#config.currentLang] || {};
    const message = currentMsgs[key];

    if (message) return message;

    const placeholder = this.#config.missingPlaceholder(key);
    this.#config.debug &&
      console.warn(
        `[I18n] 缺失词条：key=${key}, lang=${this.#config.currentLang}`
      );
    return placeholder;
  }

  /**
   * 替换文案中的模板变量
   * @param {string} message
   * @param {Object} [variables={}]
   * @returns {string}
   */
  #replaceVariables(message, variables = {}) {
    if (typeof message !== 'string' || Object.keys(variables).length === 0) {
      return message;
    }
    return message.replace(/\{([^}]+)\}/g, (match, key) => {
      return Object.prototype.hasOwnProperty.call(variables, key)
        ? variables[key]
        : match;
    });
  }

  /**
   * 从 DOM 元素提取模板变量
   * @param {HTMLElement} el
   * @returns {Object}
   */
  #extractVariables(el) {
    const variables = {};
    const varPrefix = this.#config.replace.varPrefix;

    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.startsWith(varPrefix)) {
        const varName = attr.name.slice(varPrefix.length);
        variables[varName] = attr.value;
      }
    });
    return variables;
  }

  /**
   * HTML 转义（防止 XSS）
   * @param {string} text
   * @returns {string}
   */
  #escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * 替换单个 DOM 元素的文本/属性
   * @param {HTMLElement} el
   */
  #replaceElementText(el) {
    const i18nKey = el.getAttribute(this.#config.replace.attr);
    if (!i18nKey) return;

    const variables = this.#extractVariables(el);
    const rawText = this.#getMessage(i18nKey);
    const translatedText = this.#replaceVariables(rawText, variables);

    const targetProp = el.getAttribute('data-i18n-prop') || 'text';
    if (!this.#config.replace.propTypes.includes(targetProp)) {
      this.#config.debug &&
        console.warn(`[I18n] 不支持的替换类型：${targetProp}，元素：`, el);
      return;
    }

    switch (targetProp) {
      case 'text':
        el.textContent = translatedText;
        break;
      case 'html':
        el.innerHTML = this.#escapeHtml(translatedText);
        break;
      case 'input':
        el.value = translatedText;
        break;
      case 'title':
      case 'placeholder':
      case 'alt':
        el.setAttribute(targetProp, translatedText);
        break;
    }

    this.#cachedElements.add(el);
    this.#elementKeyMap.set(el, i18nKey);
  }

  /**
   * 批量替换页面中所有带 i18n 标记的元素
   */
  #replaceAllElements() {
    const attr = this.#config.replace.attr;
    const elements = document.querySelectorAll(`[${attr}]`);
    elements.forEach((el) => this.#replaceElementText(el));
    this.#config.debug && console.log(`[I18n] 已替换 ${elements.length} 个元素的文本`);
  }

  /**
   * 初始化 MutationObserver 监听动态元素
   */
  #initMutationObserver() {
    if (!this.#config.watchDynamicElements) return;

    this.#stopMutationObserver();

    const attr = this.#config.replace.attr;
    this.#mutationObserver = new MutationObserver((mutations) => {
      const newElements = [];
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.hasAttribute && node.hasAttribute(attr)) {
              newElements.push(node);
            }
            const childElements = node.querySelectorAll && node.querySelectorAll(`[${attr}]`);
            if (childElements) {
              childElements.forEach((el) => newElements.push(el));
            }
          }
        });
      });

      if (newElements.length > 0) {
        newElements.forEach((el) => {
          if (!this.#cachedElements.has(el)) {
            this.#replaceElementText(el);
          }
        });
        this.#config.debug &&
          console.log(`[I18n] 已处理 ${newElements.length} 个动态新增元素`);
      }
    });

    this.#mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * 停止 MutationObserver
   */
  #stopMutationObserver() {
    if (this.#mutationObserver) {
      this.#mutationObserver.disconnect();
      this.#mutationObserver = null;
    }
  }

  /**
   * 添加 i18n 数据属性
   * @param {Array} config
   * @param {Object} options
   * @returns {Object}
   */
  #addI18nDataAttributes(config, options = {}) {
    const { verbose = false, overwrite = false } = options;

    if (!Array.isArray(config)) {
      console.error('配置参数必须是一个数组');
      return { success: 0, failed: 0, total: 0 };
    }

    let successCount = 0;
    let failedCount = 0;

    config.forEach((item, index) => {
      try {
        const { selector, data } = item;

        if (!selector || !data) {
          console.warn(`配置项 ${index} 缺少 selector 或 data 属性`);
          failedCount++;
          return;
        }

        const elements = document.querySelectorAll(selector);

        if (elements.length === 0) {
          if (verbose) {
            console.warn(`未找到匹配的元素: ${selector}`);
          }
          failedCount++;
          return;
        }

        elements.forEach((element) => {
          if (data.i18n && (overwrite || !element.hasAttribute('data-i18n'))) {
            element.setAttribute('data-i18n', data.i18n);
          }

          if (data.prop && (overwrite || !element.hasAttribute('data-i18n-prop'))) {
            element.setAttribute('data-i18n-prop', data.prop);
          }
        });

        successCount++;
        if (verbose) {
          console.log(`✓ 为 ${elements.length} 个元素添加属性: ${selector}`);
        }
      } catch (error) {
        console.error(`处理选择器 ${item.selector} 时出错:`, error);
        failedCount++;
      }
    });

    return {
      success: successCount,
      failed: failedCount,
      total: config.length
    };
  }

  /**
   * 初始化
   * @param {Object} [options={}]
   */
  init(options = {}) {
    this.#config = { ...this.#config, ...options };

    if (!this.#validateLangFormat(this.#config.defaultLang)) {
      console.error(
        `[I18n] 无效默认语言：${this.#config.defaultLang}，已切换为 zh-CN`
      );
      this.#config.defaultLang = 'zh-CN';
    }

    if (!this.#validateLangFormat(this.#config.currentLang)) {
      console.error(
        `[I18n] 无效当前语言：${this.#config.currentLang}，已切换为默认语言`
      );
      this.#config.currentLang = this.#config.defaultLang;
    }

    this.#mergedMessages = this.#mergeMessages(
      DEFAULT_MESSAGES,
      this.#config.customMessages
    );

    this.#dataAttrSelector = [
      ...DEFAULT_DATA_ATTR_SELECTOR,
      ...(this.#config.dataAttrSelector || [])
    ];

    this.#debouncedReplaceAll = this.#debounce(
      () => this.#replaceAllElements(),
      this.#config.debounceDelay
    );

    this.#addI18nDataAttributes(this.#dataAttrSelector);

    this.#replaceAllElements();

    this.#initMutationObserver();

    this.#config.debug &&
      console.log(`[I18n] 初始化完成，当前语言：${this.#config.currentLang}`);
  }

  /**
   * 切换语言
   * @param {string} lang
   * @returns {boolean}
   */
  changeLang(lang) {
    if (!this.#validateLangFormat(lang)) {
      console.error(`[I18n] 无效语言格式：${lang}`);
      return false;
    }

    if (!this.#mergedMessages[lang]) {
      console.warn(`[I18n] 语言包 ${lang} 不存在，已切换为默认语言`);
      this.#config.currentLang = this.#config.defaultLang;
      this.#debouncedReplaceAll();
      return false;
    }

    const oldLang = this.#config.currentLang;
    this.#config.currentLang = lang;
    this.#debouncedReplaceAll();

    if (this.#config.onLangChange && typeof this.#config.onLangChange === 'function') {
      this.#config.onLangChange({
        oldLang,
        newLang: lang
      });
    }

    this.#config.debug && console.log(`[I18n] 语言切换成功：${lang}`);
    return true;
  }

  /**
   * 手动刷新
   */
  refresh() {
    this.#debouncedReplaceAll();
    this.#config.debug && console.log('[I18n] 手动刷新页面文本完成');
  }

  /**
   * 手动替换单个元素
   * @param {string|HTMLElement} target
   */
  replaceElement(target) {
    let el;
    if (typeof target === 'string') {
      el = document.querySelector(target);
    } else if (target instanceof HTMLElement) {
      el = target;
    }

    if (el) {
      this.#replaceElementText(el);
    } else {
      this.#config.debug && console.warn('[I18n] 未找到目标元素：', target);
    }
  }

  /**
   * 获取翻译
   * @param {string} key
   * @param {Object} [variables]
   * @returns {string}
   */
  t(key, variables) {
    if (typeof key !== 'string' || !key.trim()) {
      console.error('[I18n] 词条key不能为空');
      return '';
    }
    const message = this.#getMessage(key);
    return this.#replaceVariables(message, variables);
  }

  /**
   * 扩展语言包
   * @param {string} lang
   * @param {Object} messages
   */
  extendMessages(lang, messages) {
    if (!this.#validateLangFormat(lang)) {
      console.error(`[I18n] 无效语言格式：${lang}`);
      return;
    }

    if (typeof messages !== 'object' || messages === null) {
      console.error('[I18n] 语言包必须是对象');
      return;
    }

    this.#mergedMessages[lang] = {
      ...(this.#mergedMessages[lang] || {}),
      ...messages
    };

    this.#config.debug &&
      console.log(`[I18n] 扩展语言包：${lang}`, messages);
  }

  /**
   * 异步加载语言包
   * @param {string} lang
   * @param {Function|string} loader - 加载函数或URL
   * @returns {Promise<boolean>}
   */
  async loadMessagesAsync(lang, loader) {
    if (!this.#validateLangFormat(lang)) {
      console.error(`[I18n] 无效语言格式：${lang}`);
      return false;
    }

    try {
      let messages;
      if (typeof loader === 'function') {
        messages = await loader(lang);
      } else if (typeof loader === 'string') {
        const response = await fetch(loader);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        messages = await response.json();
      } else {
        throw new Error('loader must be a function or string URL');
      }

      this.extendMessages(lang, messages);
      this.#config.debug &&
        console.log(`[I18n] 异步加载语言包成功：${lang}`);
      return true;
    } catch (error) {
      console.error(`[I18n] 异步加载语言包失败：${lang}`, error);
      return false;
    }
  }

  /**
   * 设置语言切换钩子
   * @param {Function|null} callback
   */
  setOnLangChange(callback) {
    if (callback === null || typeof callback === 'function') {
      this.#config.onLangChange = callback;
    } else {
      console.error('[I18n] onLangChange 必须是函数或 null');
    }
  }

  /**
   * 获取当前语言
   * @returns {string}
   */
  getCurrentLang() {
    return this.#config.currentLang;
  }

  /**
   * 获取已加载语言列表
   * @returns {string[]}
   */
  getLoadedLangs() {
    return Object.keys(this.#mergedMessages);
  }

  /**
   * 重置配置
   */
  reset() {
    this.#stopMutationObserver();

    this.#config = {
      defaultLang: 'zh-CN',
      currentLang: 'zh-CN',
      customMessages: {},
      missingPlaceholder: (key) => `{{${key}}}`,
      debug: false,
      debounceDelay: 200,
      watchDynamicElements: true,
      onLangChange: null,
      replace: {
        attr: 'data-i18n',
        propTypes: ['text', 'html', 'input', 'title', 'placeholder', 'alt'],
        varPrefix: 'data-i18n-'
      }
    };

    this.#mergedMessages = this.#mergeMessages(
      DEFAULT_MESSAGES,
      this.#config.customMessages
    );

    this.#dataAttrSelector = [...DEFAULT_DATA_ATTR_SELECTOR];
    this.#cachedElements.clear();
    this.#elementKeyMap.clear();

    this.#replaceAllElements();
    this.#config.debug && console.log('[I18n] 已重置为默认配置');
  }
}

let instance = null;

export const getInstance = () => {
  if (!instance) {
    instance = new I18nClass();
  }
  return instance;
};

export const init = (options) => {
  const i18n = getInstance();
  i18n.init(options);
  return i18n;
};

export const changeLang = (lang) => getInstance().changeLang(lang);

export const refresh = () => getInstance().refresh();

export const replaceElement = (target) => getInstance().replaceElement(target);

export const t = (key, variables) => getInstance().t(key, variables);

export const extendMessages = (lang, messages) =>
  getInstance().extendMessages(lang, messages);

export const loadMessagesAsync = (lang, loader) =>
  getInstance().loadMessagesAsync(lang, loader);

export const setOnLangChange = (callback) =>
  getInstance().setOnLangChange(callback);

export const getCurrentLang = () => getInstance().getCurrentLang();

export const getLoadedLangs = () => getInstance().getLoadedLangs();

export const reset = () => getInstance().reset();

export { I18nClass };
export default I18nClass;
