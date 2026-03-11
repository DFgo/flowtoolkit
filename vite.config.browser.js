/**
 * 浏览器版本构建配置
 * 生成可独立在浏览器中使用的版本
 */
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    // 输出目录
    outDir: 'dist-browser',

    // 清空输出目录
    emptyOutDir: true,

    // 目标浏览器
    target: 'es2015',

    // 压缩
    minify: false,

    // 生成 sourcemap
    sourcemap: false,

    // CSS 代码分割
    cssCodeSplit: false,

    // rollup 选项
    rollupOptions: {
      // 入口文件
      input: resolve(__dirname, 'src/index.js'),

      // 输出多个文件
      output: {
        // 入口文件
        entryFileNames: 'flowtoolkit.js',

        // 资产文件
        assetFileNames: 'flowtoolkit.[ext]'
      }
    },

    // 打包报告
    reportCompressedSize: true
  },

  // 定义全局变量（用于条件编译）
  define: {
    __BROWSER__: true,
    __VERSION__: JSON.stringify('2.0.0')
  }
});
