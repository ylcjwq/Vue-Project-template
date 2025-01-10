import vue from '@vitejs/plugin-vue';
import unocss from 'unocss/vite';
import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import path from 'node:path';
import { removeConsolePlugin } from '@packages/plugin';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@images': path.resolve(__dirname, './src/assets/images'),
    },
  },
  plugins: [
    vue(),
    unocss(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
      // 声明文件生成位置
      dts: path.resolve(process.cwd(), './types/auto-imports.d.ts'),
      resolvers: [ElementPlusResolver()], // elementplus 自动导入
    }),
    Components({
      // 声明文件生成位置
      dts: path.resolve(process.cwd(), './types/components.d.ts'),
      resolvers: [ElementPlusResolver()], // elementplus 自动导入
    }),
    process.env.NODE_ENV === 'development' && removeConsolePlugin(),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  esbuild: {
    // 生产包将 console.log 与 debugger 清除
    drop: process.env.NODE_ENV === 'production' ? ['debugger'] : [],
    pure: process.env.NODE_ENV === 'production' ? ['console.log'] : [],
  },
  build: {
    target: 'modules',
    minify: 'esbuild',
    reportCompressedSize: false,
    assetsInlineLimit: 10 * 1024,
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const names = assetInfo.names ?? [];
          const fileName = names[0] ?? '';
          if (fileName.endsWith('.css')) {
            return 'css/[name]-[hash].[ext]';
          }
          if (/\.(?:jpe?g|png|gif|svg|webp)$/i.test(fileName)) {
            return 'images/[name]-[hash].[ext]';
          }
          if (/\.(?:woff|woff2|eot|ttf|otf)$/i.test(fileName)) {
            return 'fonts/[name]-[hash].[ext]';
          }
          return 'assets/[name]-[hash].[ext]';
        },
        manualChunks: (id) => {
          // 将 Vue 相关库打包在一起
          if (
            id.includes('node_modules/vue') ||
            id.includes('node_modules/pinia') ||
            id.includes('node_modules/@vue')
          ) {
            return 'vue-vendor';
          }
          // 其他所有 node_modules 中的第三方库打包在一起
          if (id.includes('node_modules')) {
            return 'vendors';
          }
          // 将 utils 和 hooks 单独打包
          if (id.includes('/src/utils/') || id.includes('/src/hooks/')) {
            return 'utils-hooks';
          }
        },
      },
    },
  },
});
