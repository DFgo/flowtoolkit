/**
 * Watermark 类型定义
 * @module watermark/types
 */

/**
 * @typedef {Object} WatermarkOptions
 * @property {number} [width=300] - 单个水印宽度(px)
 * @property {number} [height=300] - 单个水印高度(px)
 * @property {string} [content='Watermark'] - 水印文本内容
 * @property {'text'|'multi-line-text'} [contentType='text'] - 内容类型
 * @property {number} [textRowMaxWidth=300] - 文本最大宽度(px)
 * @property {number} [lineHeight=30] - 行高(px)
 * @property {string} [fontColor='#000000'] - 字体颜色
 * @property {string} [fontSize='16px'] - 字体大小
 * @property {string} [fontFamily='sans-serif'] - 字体
 * @property {string} [fontWeight='normal'] - 字体粗细
 * @property {string} [fontStyle=''] - 字体样式
 * @property {string} [fontVariant=''] - 字体变体
 * @property {number} [globalAlpha=0.5] - 透明度(0-1)
 * @property {number} [rotate=0] - 旋转角度(度)
 * @property {string} [textAlign='center'] - 文本水平对齐
 * @property {string} [textBaseline='middle'] - 文本垂直对齐
 * @property {number} [zIndex=9999] - 层级
 * @property {string|HTMLElement|null} [parent=document.body] - 父容器
 * @property {'single'|'multiple'} [mode='single'] - 模式
 * @property {boolean} [protect=true] - 启用防篡改保护
 * @property {boolean} [updateOnResize=true] - 窗口变化时更新
 * @property {string} [passwordVerifyUrl='assd.t_00.ft_watermark'] - 密码验证接口
 * @property {string} [modalTitle='取消水印验证'] - 弹窗标题
 * @property {number} [modalWidth=350] - 弹窗宽度
 * @property {number} [modalHeight=220] - 弹窗高度
 * @property {boolean} [isCheckPrint=false] - 是否检测打印
 */

export {};
