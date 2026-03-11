/**
 * 日期工具函数
 * @module utils/date
 */

/**
 * 格式化日期
 * @param {Date|number|string} date - 日期
 * @param {string} format - 格式
 * @returns {string}
 * @example
 * format(new Date(), 'YYYY-MM-DD HH:mm:ss')
 * format('2024-01-01', 'YYYY年MM月DD日')
 */
export const format = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return '';

  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('YY', String(year).slice(-2))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * 解析日期字符串
 * @param {string} str - 日期字符串
 * @returns {Date}
 */
export const parse = (str) => {
  if (!str) return null;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

/**
 * 增加天数
 * @param {Date|number|string} date - 日期
 * @param {number} days - 天数
 * @returns {Date}
 */
export const addDays = (date, days) => {
  const d = date instanceof Date ? new Date(date) : new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * 增加月份
 * @param {Date|number|string} date - 日期
 * @param {number}
 * @returns months - 月数 {Date}
 */
export const addMonths = (date, months) => {
  const d = date instanceof Date ? new Date(date) : new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

/**
 * 增加年份
 * @param {Date|number|string} date - 日期
 * @param {number} years - 年数
 * @returns {Date}
 */
export const addYears = (date, years) => {
  const d = date instanceof Date ? new Date(date) : new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
};

/**
 * 计算两个日期相差天数
 * @param {Date|number|string} date1 - 日期1
 * @param {Date|number|string} date2 - 日期2
 * @returns {number}
 */
export const diffDays = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * 计算两个日期相差月数
 * @param {Date|number|string} date1 - 日期1
 * @param {Date|number|string} date2 - 日期2
 * @returns {number}
 */
export const diffMonths = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    (d2.getFullYear() - d1.getFullYear()) * 12 +
    (d2.getMonth() - d1.getMonth())
  );
};

/**
 * 获取日期的开始时间（00:00:00）
 * @param {Date|number|string} date - 日期
 * @returns {Date}
 */
export const startOfDay = (date) => {
  const d = date instanceof Date ? new Date(date) : new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * 获取日期的结束时间（23:59:59）
 * @param {Date|number|string} date - 日期
 * @returns {Date}
 */
export const endOfDay = (date) => {
  const d = date instanceof Date ? new Date(date) : new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * 获取星期几
 * @param {Date|number|string} date - 日期
 * @returns {number} 0-6
 */
export const getDay = (date) => {
  return new Date(date).getDay();
};

/**
 * 获取星期几名称
 * @param {Date|number|string} date - 日期
 * @param {string[]} [names]
 * @returns {string}
 */
export const getDayName = (date, names = ['日', '一', '二', '三', '四', '五', '六']) => {
  return names[getDay(date)];
};

/**
 * 判断是否今天
 * @param {Date|number|string} date - 日期
 * @returns {boolean}
 */
export const isToday = (date) => {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * 判断是否昨天
 * @param {Date|number|string} date - 日期
 * @returns {boolean}
 */
export const isYesterday = (date) => {
  const d = new Date(date);
  const yesterday = addDays(new Date(), -1);
  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * 判断是否明天
 * @param {Date|number|string} date - 日期
 * @returns {boolean}
 */
export const isTomorrow = (date) => {
  const d = new Date(date);
  const tomorrow = addDays(new Date(), 1);
  return (
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear()
  );
};

/**
 * 相对时间描述
 * @param {Date|number|string} date - 日期
 * @returns {string}
 */
export const relative = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return format(d, 'YYYY-MM-DD');
  } else if (days > 0) {
    return `${days}天前`;
  } else if (hours > 0) {
    return `${hours}小时前`;
  } else if (minutes > 0) {
    return `${minutes}分钟前`;
  } else {
    return '刚刚';
  }
};

/**
 * 时间戳转日期
 * @param {number} timestamp - 时间戳（毫秒）
 * @returns {Date}
 */
export const fromTimestamp = (timestamp) => {
  return new Date(timestamp);
};

/**
 * 日期转时间戳
 * @param {Date|number|string} date - 日期
 * @returns {number}
 */
export const toTimestamp = (date) => {
  return new Date(date).getTime();
};

export default {
  format,
  parse,
  addDays,
  addMonths,
  addYears,
  diffDays,
  diffMonths,
  startOfDay,
  endOfDay,
  getDay,
  getDayName,
  isToday,
  isYesterday,
  isTomorrow,
  relative,
  fromTimestamp,
  toTimestamp
};
