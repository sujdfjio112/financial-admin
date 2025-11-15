import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import critical from 'rollup-plugin-critical';

export default defineConfig({
  base: './financial-admin/', // 保持你原来的路径
  plugins: [
    vue(),
    critical({
      criticalUrl: 'http://localhost:4173', // 开发时用本地地址，构建后可改为生产地址
      criticalBase: 'dist', // 构建输出目录
      inline: true, // 将首页关键 CSS 内联到 HTML
      minify: true, // 压缩 CSS
      extract: false, // 不生成单独文件
      dimensions: [{ width: 1440, height: 900 }], // 可以增加多尺寸
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // 关闭生产 sourcemap，减少体积
    target: 'es2015', // 浏览器兼容
    minify: 'esbuild', // esbuild 压缩速度快
    cssCodeSplit: true, // CSS 按需拆分，首页只加载关键 CSS
    rollupOptions: {
      output: {
        // 拆分 node_modules 到 vendor.js，便于浏览器缓存
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
  server: {
    hmr: true, // 开发环境 HMR
  },
  optimizeDeps: {
    // 预打包依赖，提高冷启动速度
    include: ['vue', 'vue-router', 'pinia'],
  },
});
