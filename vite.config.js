import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~': resolve(__dirname, 'src')
    }
  },

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'FlowToolkit',
      fileName: (format) => {
        if (format === 'cjs') return 'flowtoolkit.cjs.js';
        return `flowtoolkit.${format}.js`;
      },
      formats: ['es', 'umd', 'cjs']
    },

    rollupOptions: {
      // 外部依赖，不打包到库中
      external: ['jquery', 'oa', 'jQuery'],

      // 高级优化选项
      treeshake: {
        moduleSideEffects: false
      },

      output: {
        // UMD / CJS 全局变量名
        name: 'FlowToolkit',
        exports: 'named',

        // 全局变量映射
        globals: {
          jquery: '$',
          jQuery: '$',
          oa: 'OA'
        },

        // 输出文件名前缀
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'flowtoolkit.css';
          }
          return assetInfo.name;
        }
      }
    },

    // 压缩配置
    minify: false,
    sourcemap: true,

    // 打包后清理旧文件
    emptyOutDir: true,

    // 目标环境
    target: 'es2015',

    // CSS 代码分割
    cssCodeSplit: false
  },

  // 开发服务器配置
  server: {
    port: 3000,
    open: false
  },

  // 预览配置
  preview: {
    port: 4173
  }
});
