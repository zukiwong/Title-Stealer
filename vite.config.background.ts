import { defineConfig } from 'vite';
import { resolve } from 'path';

// Background script 独立配置
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/background/index.ts'),
      formats: ['iife'],
      name: 'BackgroundScript',
      fileName: () => 'background.js',
    },
    rollupOptions: {
      output: {
        extend: true,
      },
    },
  },
});