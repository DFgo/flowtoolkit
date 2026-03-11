/**
 * 默认语言包
 * @module language/messages
 */

/** @type {Object} */
const DEFAULT_MESSAGES = {
  'zh-CN': {
    'btn.page.att': '附件',
    'btn.page.org': '选择',
    'btn.top.save': '保存草稿',
    'btn.top.send': '提交',
    'btn.top.chart': '流程图',
    'btn.top.print': '打印',
    'btn.top.end': '作废',
    'btn.top.delete': '删除',
    'form.appr.title': '审批步骤',
    'form.appr.step': '处理步骤',
    'form.appr.name': '签名(岗位)',
    'form.appr.action': '操作',
    'form.appr.time': '操作时间',
    'form.appr.note': '备注'
  },
  'zh-TW': {
    'btn.page.att': '附件',
    'btn.page.org': '選擇',
    'btn.top.save': '儲存草稿',
    'btn.top.send': '提交',
    'btn.top.chart': '流程圖',
    'btn.top.print': '列印',
    'btn.top.end': '作廢',
    'btn.top.delete': '刪除',
    'form.appr.title': '審批步驟',
    'form.appr.step': '處理步驟',
    'form.appr.name': '簽名(職位)',
    'form.appr.action': '操作',
    'form.appr.time': '操作時間',
    'form.appr.note': '備註'
  },
  'en-US': {
    'btn.page.att': 'Upload',
    'btn.page.org': 'Select',
    'btn.top.save': 'Save',
    'btn.top.send': 'Send',
    'btn.top.chart': 'Flow Chart',
    'btn.top.print': 'Print',
    'btn.top.end': 'End',
    'btn.top.delete': 'Delete',
    'form.appr.title': 'Approval Steps',
    'form.appr.step': 'Processing Step',
    'form.appr.name': 'Signature (Position)',
    'form.appr.action': 'Action',
    'form.appr.time': 'Operation Time',
    'form.appr.note': 'Remarks'
  }
};

/** @type {Object} */
const DEFAULT_DATA_ATTR_SELECTOR = [
  {
    selector: 'td:has(input[data-type="files"]) input[type="button"]',
    data: { i18n: 'btn.page.att', prop: 'input' }
  },
  {
    selector: 'td:has(input[data-type="organize"]) input[type="button"]',
    data: { i18n: 'btn.page.org', prop: 'input' }
  },
  {
    selector: 'div.toolbar a[data-name="保存草稿"] label',
    data: { i18n: 'btn.top.save', prop: 'text' }
  },
  {
    selector: 'div.toolbar a[data-name="提交"] label',
    data: { i18n: 'btn.top.send', prop: 'text' }
  },
  {
    selector: 'div.toolbar a[data-name="流程图"] label',
    data: { i18n: 'btn.top.chart', prop: 'text' }
  },
  {
    selector: 'div.toolbar a[data-name="Process"] label',
    data: { i18n: 'btn.top.chart', prop: 'text' }
  },
  {
    selector: 'div.toolbar a[data-name="打印"] label',
    data: { i18n: 'btn.top.print', prop: 'text' }
  },
  {
    selector: 'div.toolbar a[data-name="Print"] label',
    data: { i18n: 'btn.top.print', prop: 'text' }
  },
  {
    selector: 'div.toolbar a[data-name="作废"] label',
    data: { i18n: 'btn.top.end', prop: 'text' }
  },
  {
    selector: 'div.toolbar a[data-name="删除"] label',
    data: { i18n: 'btn.top.delete', prop: 'text' }
  },
  {
    selector: '#form_commentlist_div table.oa-table thead tr:first-child th',
    data: { i18n: 'form.appr.title', prop: 'text' }
  },
  {
    selector: '#form_commentlist_div table.oa-table thead tr:nth-child(2) th:nth-child(2)',
    data: { i18n: 'form.appr.step', prop: 'text' }
  },
  {
    selector: '#form_commentlist_div table.oa-table thead tr:nth-child(2) th:nth-child(3)',
    data: { i18n: 'form.appr.name', prop: 'text' }
  },
  {
    selector: '#form_commentlist_div table.oa-table thead tr:nth-child(2) th:nth-child(4)',
    data: { i18n: 'form.appr.action', prop: 'text' }
  },
  {
    selector: '#form_commentlist_div table.oa-table thead tr:nth-child(2) th:nth-child(5)',
    data: { i18n: 'form.appr.time', prop: 'text' }
  },
  {
    selector: '#form_commentlist_div table.oa-table thead tr:nth-child(2) th:nth-child(6)',
    data: { i18n: 'form.appr.note', prop: 'text' }
  }
];

export { DEFAULT_MESSAGES, DEFAULT_DATA_ATTR_SELECTOR };
