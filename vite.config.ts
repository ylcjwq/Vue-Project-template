import vue from '@vitejs/plugin-vue';
import unocss from 'unocss/vite';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), unocss()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
  },
});
