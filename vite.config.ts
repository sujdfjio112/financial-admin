import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  base: '/financial-admin/', // <- 如果你的 repo 是 sujdfjio112/financial-admin
  plugins: [vue()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
});
