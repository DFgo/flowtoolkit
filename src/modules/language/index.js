/**
 * Language (i18n) 模块入口
 * @module language
 * @description 国际化工具包，支持多语言切换、模板变量替换、页面文本自动替换
 */

import {
  I18nClass,
  init,
  changeLang,
  refresh,
  replaceElement,
  t,
  extendMessages,
  loadMessagesAsync,
  setOnLangChange,
  getCurrentLang,
  getLoadedLangs,
  reset
} from './I18n.js';

import { DEFAULT_MESSAGES, DEFAULT_DATA_ATTR_SELECTOR } from './defaultMessages.js';

// 创建 i18n 对象，整合所有方法
const i18n = {
  // 初始化
  init,
  // 切换语言
  changeLang,
  // 手动刷新
  refresh,
  // 手动替换单个元素
  replaceElement,
  // 获取翻译
  t,
  // 扩展语言包
  extendMessages,
  // 异步加载语言包
  loadMessagesAsync,
  // 设置语言切换钩子
  setOnLangChange,
  // 获取当前语言
  getCurrentLang,
  // 获取已加载语言列表
  getLoadedLangs,
  // 重置配置
  reset,
  // 类
  I18nClass,
  // 常量
  DEFAULT_MESSAGES,
  DEFAULT_DATA_ATTR_SELECTOR
};

/**
 * 使用方法：
 *
 * import { i18n } from 'flowtoolkit';
 *
 * // 初始化
 * i18n.init({
 *   defaultLang: 'zh-CN',
 *   currentLang: 'zh-CN',
 *   customMessages: {
 *     'en': { 'hello': 'Hello' },
 *     'zh-CN': { 'hello': '你好' }
 *   }
 * });
 *
 * // 获取翻译
 * i18n.t('hello'); // '你好'
 *
 * // 切换语言
 * i18n.changeLang('en');
 * i18n.t('hello'); // 'Hello'
 *
 * // 扩展语言包
 * i18n.extendMessages('zh-CN', { 'world': '世界' });
 *
 * // 获取当前语言
 * i18n.getCurrentLang(); // 'en'
 *
 * // 刷新页面翻译
 * i18n.refresh();
 *
 * // 重置
 * i18n.reset();
 */

export { i18n, I18nClass, DEFAULT_MESSAGES, DEFAULT_DATA_ATTR_SELECTOR };
export default i18n;
