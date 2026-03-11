/**
 * Utils 工具模块入口
 * @module utils
 * @description 常用工具函数集合
 */

import * as dom from './dom.js';
import * as date from './date.js';

/**
 * @namespace utils
 */
export const utils = {
  dom,
  date
};

// 导出子模块
export { dom };
export { date };

// 兼容旧写法
export const $ = dom.$;
export const $$ = dom.$$;
export const create = dom.create;
export const addClass = dom.addClass;
export const removeClass = dom.removeClass;
export const toggleClass = dom.toggleClass;
export const hasClass = dom.hasClass;
export const on = dom.on;
export const off = dom.off;
export const one = dom.one;

export const format = date.format;
export const parse = date.parse;
export const addDays = date.addDays;
export const addMonths = date.addMonths;
export const addYears = date.addYears;
export const diffDays = date.diffDays;
export const diffMonths = date.diffMonths;
export const startOfDay = date.startOfDay;
export const endOfDay = date.endOfDay;
export const getDay = date.getDay;
export const getDayName = date.getDayName;
export const isToday = date.isToday;
export const isYesterday = date.isYesterday;
export const isTomorrow = date.isTomorrow;
export const relative = date.relative;
export const fromTimestamp = date.fromTimestamp;
export const toTimestamp = date.toTimestamp;

export default utils;

/**
 * 使用方法：
 *
 * import { utils, dom, date } from 'flowtoolkit';
 *
 * // DOM 工具
 * utils.dom.$('#id');                    // querySelector
 * utils.dom.$$('.class');                // querySelectorAll
 * utils.dom.create('div');               // 创建元素
 * utils.dom.addClass(el, 'active');     // 添加类名
 * utils.dom.removeClass(el, 'active');  // 移除类名
 * utils.dom.toggleClass(el, 'active');  // 切换类名
 * utils.dom.hasClass(el, 'active');     // 检查类名
 * utils.dom.on(el, 'click', fn);        // 绑定事件
 * utils.dom.off(el, 'click', fn);       // 解绑事件
 * utils.dom.one(el, 'click', fn);       // 一次性事件
 *
 * // 日期工具
 * utils.date.format(new Date(), 'YYYY-MM-DD');         // 格式化
 * utils.date.parse('2024-01-01');                      // 解析
 * utils.date.addDays(date, 5);                         // 加天数
 * utils.date.addMonths(date, 1);                       // 加月数
 * utils.date.addYears(date, 1);                         // 加年数
 * utils.date.diffDays(date1, date2);                    // 天数差
 * utils.date.diffMonths(date1, date2);                  // 月数差
 * utils.date.startOfDay(date);                          // 当天开始
 * utils.date.endOfDay(date);                            // 当天结束
 * utils.date.isToday(date);                              // 是否今天
 * utils.date.isYesterday(date);                          // 是否昨天
 * utils.date.isTomorrow(date);                           // 是否明天
 * utils.date.relative(date);                             // 相对时间
 *
 * // 或直接导入
 * import { $, $$, format } from 'flowtoolkit';
 * $('#id');
 * format(new Date(), 'YYYY-MM-DD');
 */
