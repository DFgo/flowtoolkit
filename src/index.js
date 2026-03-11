/**
 * FlowToolkit 主入口
 * @module flowtoolkit
 * @description OA系统前端工具库
 * @version 2.0.0
 */

// Watermark 模块
import { Watermark } from './modules/watermark/index.js';

// Language (i18n) 模块
import { i18n } from './modules/language/index.js';

// Utils 模块
import * as utils from './modules/utils/index.js';
import * as dom from './modules/utils/dom.js';
import * as date from './modules/utils/date.js';

/**
 * FlowToolkit 主对象
 * @namespace FlowToolkit
 */
const FlowToolkit = {
  // 版本
  version: '2.0.1',

  // Watermark 水印
  Watermark,

  // I18n 国际化
  i18n,

  // Utils 工具
  utils,
  dom,
  date
};

// 挂载到 window (UMD 模式)
if (typeof window !== 'undefined') {
  window.FlowToolkit = FlowToolkit;
  window.FT = FlowToolkit;
}

// 导出
export { FlowToolkit };
export {
  Watermark,
  i18n,
  utils,
  dom,
  date
};

export default FlowToolkit;
