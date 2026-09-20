import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
    host: true,
    watch: {
      ignored: ['**/public/**', '**/SIH-ML/**'],
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/new-case': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/demo-cases': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/demo-case': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/active-case': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
});
