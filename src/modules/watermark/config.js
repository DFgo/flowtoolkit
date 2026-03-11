/**
 * Watermark 默认配置
 * @module watermark/config
 */

/** @type {WatermarkOptions} */
const DEFAULT_CONFIG = {
  // 水印基础配置
  width: 300,
  height: 300,
  content: 'Watermark',
  contentType: 'text',
  textRowMaxWidth: 300,
  lineHeight: 30,
  fontColor: '#000000',
  fontSize: '16px',
  fontFamily: 'sans-serif',
  fontWeight: 'normal',
  fontStyle: '',
  fontVariant: '',
  globalAlpha: 0.5,
  rotate: 0,
  textAlign: 'center',
  textBaseline: 'middle',
  zIndex: 9999,
  parent: null, // 会在构造函数中设置为 document.body
  mode: 'single',
  protect: true,
  updateOnResize: true,

  // 密码验证相关配置
  passwordVerifyUrl: 'assd.t_00.ft_watermark',
  modalTitle: '取消水印验证',
  modalWidth: 350,
  modalHeight: 220,

  // 打印相关
  isCheckPrint: false
};

export { DEFAULT_CONFIG };
