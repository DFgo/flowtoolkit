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
        // 安全改进：默认使用转义，特殊标记才允许 HTML
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
    // 合并用户配置
    this.#config = { ...this.#config, ...options };

    // 验证默认语言格式
    if (!this.#validateLangFormat(this.#config.defaultLang)) {
      console.error(
        `[I18n] 无效默认语言：${this.#config.defaultLang}，已切换为 zh-CN`
      );
      this.#config.defaultLang = 'zh-CN';
    }

    // 验证当前语言格式
    if (!this.#validateLangFormat(this.#config.currentLang)) {
      console.error(
        `[I18n] 无效当前语言：${this.#config.currentLang}，已切换为默认语言`
      );
      this.#config.currentLang = this.#config.defaultLang;
    }

    // 合并语言包
    this.#mergedMessages = this.#mergeMessages(
      DEFAULT_MESSAGES,
      this.#config.customMessages
    );

    // 合并选择器配置
    this.#dataAttrSelector = [
      ...DEFAULT_DATA_ATTR_SELECTOR,
      ...(this.#config.dataAttrSelector || [])
    ];

    // 添加 i18n 属性
    this.#addI18nDataAttributes(this.#dataAttrSelector);

    // 批量替换页面元素
    this.#replaceAllElements();

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
      this.#replaceAllElements();
      return false;
    }

    this.#config.currentLang = lang;
    this.#replaceAllElements();

    this.#config.debug && console.log(`[I18n] 语言切换成功：${lang}`);
    return true;
  }

  /**
   * 手动刷新
   */
  refresh() {
    this.#replaceAllElements();
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
    this.#config = {
      defaultLang: 'zh-CN',
      currentLang: 'zh-CN',
      customMessages: {},
      missingPlaceholder: (key) => `{{${key}}}`,
      debug: false,
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

    this.#replaceAllElements();
    this.#config.debug && console.log('[I18n] 已重置为默认配置');
  }
}

// 单例实例
let instance = null;

/**
 * 获取 I18n 实例（单例）
 * @returns {I18nClass}
 */
export const getInstance = () => {
  if (!instance) {
    instance = new I18nClass();
  }
  return instance;
};

/**
 * 初始化 I18n
 * @param {Object} [options]
 */
export const init = (options) => {
  const i18n = getInstance();
  i18n.init(options);
  return i18n;
};

/**
 * 切换语言
 * @param {string} lang
 * @returns {boolean}
 */
export const changeLang = (lang) => getInstance().changeLang(lang);

/**
 * 手动刷新
 */
export const refresh = () => getInstance().refresh();

/**
 * 手动替换单个元素
 * @param {string|HTMLElement} target
 */
export const replaceElement = (target) => getInstance().replaceElement(target);

/**
 * 获取翻译
 * @param {string} key
 * @param {Object} [variables]
 * @returns {string}
 */
export const t = (key, variables) => getInstance().t(key, variables);

/**
 * 扩展语言包
 * @param {string} lang
 * @param {Object} messages
 */
export const extendMessages = (lang, messages) =>
  getInstance().extendMessages(lang, messages);

/**
 * 获取当前语言
 * @returns {string}
 */
export const getCurrentLang = () => getInstance().getCurrentLang();

/**
 * 获取已加载语言列表
 * @returns {string[]}
 */
export const getLoadedLangs = () => getInstance().getLoadedLangs();

/**
 * 重置配置
 */
export const reset = () => getInstance().reset();

export { I18nClass };
export default I18nClass;
