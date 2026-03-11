/**
 * Watermark 模块入口
 * @module watermark
 * @description 页面文本水印模块，支持高清屏适配、防篡改保护、密码验证
 */

export { Watermark } from './Watermark.js';
export { DEFAULT_CONFIG } from './config.js';
export * from './types.js';

export default Watermark;

/**
 * 使用方法：
 *
 * import { Watermark } from 'flowtoolkit';
 *
 * // 创建水印实例
 * const wm = new Watermark({
 *   // 水印内容
 *   content: 'OA系统 机密文件',
 *   // 水印颜色
 *   color: 'rgba(0, 0, 0, 0.3)',
 *   // 水印字号
 *   fontSize: 14,
 *   // 水印角度
 *   angle: -30,
 *   // 高清屏适配
 *   scale: 2,
 *   // 防篡改
 *   protect: true,
 *   // 密码验证（开启保护时有效）
 *   password: '123456',
 *   // 回调
 *   onSuccess: () => console.log('水印创建成功'),
 *   onCancel: () => console.log('用户取消')
 * });
 *
 * // 创建水印
 * wm.create();
 *
 * // 更新水印内容
 * wm.update({ content: '新水印内容' });
 *
 * // 销毁水印
 * wm.destroy();
 *
 * // 恢复水印
 * wm.recover();
 *
 * // 获取当前配置
 * wm.getOptions();
 *
 * // 检查是否已创建
 * wm.isCreated();
 *
 * // 检查是否已验证密码
 * wm.isVerified();
 */
