/**
 * DOM 工具函数
 * @module utils/dom
 */

/**
 * 选择单个元素
 * @param {string|Element} selector - 选择器或元素
 * @param {Element} [context=document]
 * @returns {Element|null}
 */
export const $ = (selector, context = document) => {
  if (selector instanceof Element) return selector;
  return context.querySelector(selector);
};

/**
 * 选择多个元素
 * @param {string} selector - 选择器
 * @param {Element} [context=document]
 * @returns {Element[]}
 */
export const $$ = (selector, context = document) => {
  return Array.from(context.querySelectorAll(selector));
};

/**
 * 创建元素
 * @param {string} html - HTML 字符串
 * @returns {Element}
 */
export const create = (html) => {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
};

/**
 * 添加类名
 * @param {Element} el - 元素
 * @param {...string} classes - 类名
 * @returns {Element}
 */
export const addClass = (el, ...classes) => {
  if (el) {
    el.classList.add(...classes.filter(Boolean));
  }
  return el;
};

/**
 * 移除类名
 * @param {Element} el - 元素
 * @param {...string} classes - 类名
 * @returns {Element}
 */
export const removeClass = (el, ...classes) => {
  if (el) {
    el.classList.remove(...classes.filter(Boolean));
  }
  return el;
};

/**
 * 切换类名
 * @param {Element} el - 元素
 * @param {string} className - 类名
 * @param {boolean} [force]
 * @returns {Element}
 */
export const toggleClass = (el, className, force) => {
  if (el) {
    el.classList.toggle(className, force);
  }
  return el;
};

/**
 * 是否有类名
 * @param {Element} el - 元素
 * @param {string} className - 类名
 * @returns {boolean}
 */
export const hasClass = (el, className) => {
  return el ? el.classList.contains(className) : false;
};

/**
 * 绑定事件
 * @param {Element} el - 元素
 * @param {string} event - 事件类型
 * @param {Function} handler - 处理函数
 * @param {Object} [options]
 * @returns {Element}
 */
export const on = (el, event, handler, options) => {
  if (el) {
    el.addEventListener(event, handler, options);
  }
  return el;
};

/**
 * 解绑事件
 * @param {Element} el - 元素
 * @param {string} event - 事件类型
 * @param {Function} handler - 处理函数
 * @param {Object} [options]
 * @returns {Element}
 */
export const off = (el, event, handler, options) => {
  if (el) {
    el.removeEventListener(event, handler, options);
  }
  return el;
};

/**
 * 一次性事件
 * @param {Element} el - 元素
 * @param {string} event - 事件类型
 * @param {Function} handler - 处理函数
 * @returns {Element}
 */
export const one = (el, event, handler) => {
  if (el) {
    const wrapper = (...args) => {
      handler.apply(this, args);
      el.removeEventListener(event, wrapper);
    };
    el.addEventListener(event, wrapper);
  }
  return el;
};

/**
 * 获取/设置属性
 * @param {Element} el - 元素
 * @param {string} name - 属性名
 * @param {string} [value]
 * @returns {string|Element}
 */
export const attr = (el, name, value) => {
  if (el) {
    if (value === undefined) {
      return el.getAttribute(name);
    }
    el.setAttribute(name, value);
  }
  return el;
};

/**
 * 移除属性
 * @param {Element} el - 元素
 * @param {...string} names - 属性名
 * @returns {Element}
 */
export const removeAttr = (el, ...names) => {
  if (el) {
    names.forEach((name) => el.removeAttribute(name));
  }
  return el;
};

/**
 * 获取/设置数据属性
 * @param {Element} el - 元素
 * @param {string} key - 键名
 * @param {*} [value]
 * @returns {*|Element}
 */
export const data = (el, key, value) => {
  if (el) {
    const dataKey = `data-${key}`;
    if (value === undefined) {
      return el.dataset[key] || el.getAttribute(dataKey);
    }
    el.dataset[key] = value;
  }
  return el;
};

/**
 * 获取/设置样式
 * @param {Element} el - 元素
 * @param {string|Object} key - 样式属性或对象
 * @param {string} [value]
 * @returns {string|Element}
 */
export const css = (el, key, value) => {
  if (!el) return el;

  if (typeof key === 'object') {
    Object.assign(el.style, key);
    return el;
  }

  if (value === undefined) {
    return getComputedStyle(el)[key];
  }

  el.style[key] = value;
  return el;
};

/**
 * 显示元素
 * @param {Element} el - 元素
 * @returns {Element}
 */
export const show = (el) => {
  if (el) {
    el.style.display = '';
  }
  return el;
};

/**
 * 隐藏元素
 * @param {Element} el - 元素
 * @returns {Element}
 */
export const hide = (el) => {
  if (el) {
    el.style.display = 'none';
  }
  return el;
};

/**
 * 元素是否存在
 * @param {Element} el - 元素
 * @returns {boolean}
 */
export const isVisible = (el) => {
  if (!el) return false;
  const style = getComputedStyle(el);
  return style.display !== 'none' && style.visibility !== 'hidden';
};

/**
 * 获取元素在文档中的位置
 * @param {Element} el - 元素
 * @returns {Object}
 */
export const offset = (el) => {
  if (!el) return { top: 0, left: 0 };
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX
  };
};

/**
 * 获取/设置元素宽度
 * @param {Element} el - 元素
 * @param {number} [value]
 * @returns {number|Element}
 */
export const width = (el, value) => {
  if (!el) return 0;
  if (value === undefined) {
    return el.offsetWidth;
  }
  el.style.width = `${value}px`;
  return el;
};

/**
 * 获取/设置元素高度
 * @param {Element} el - 元素
 * @param {number} [value]
 * @returns {number|Element}
 */
export const height = (el, value) => {
  if (!el) return 0;
  if (value === undefined) {
    return el.offsetHeight;
  }
  el.style.height = `${value}px`;
  return el;
};

/**
 * 插入 HTML
 * @param {Element} el - 元素
 * @param {string} position - 位置 (beforebegin, afterbegin, beforeend, afterend)
 * @param {string} html - HTML 字符串
 * @returns {Element}
 */
export const insert = (el, position, html) => {
  if (el) {
    el.insertAdjacentHTML(position, html);
  }
  return el;
};

/**
 * 移除元素
 * @param {Element} el - 元素
 * @returns {Element}
 */
export const remove = (el) => {
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
  return el;
};

/**
 * 清空元素内容
 * @param {Element} el - 元素
 * @returns {Element}
 */
export const empty = (el) => {
  if (el) {
    el.innerHTML = '';
  }
  return el;
};

/**
 * 克隆元素
 * @param {Element} el - 元素
 * @param {boolean} [deep=false]
 * @returns {Element}
 */
export const clone = (el, deep = false) => {
  return el ? el.cloneNode(deep) : null;
};

export default {
  $,
  $$,
  create,
  addClass,
  removeClass,
  toggleClass,
  hasClass,
  on,
  off,
  one,
  attr,
  removeAttr,
  data,
  css,
  show,
  hide,
  isVisible,
  offset,
  width,
  height,
  insert,
  remove,
  empty,
  clone
};
