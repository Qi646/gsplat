import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/exports': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    exclude: ['@mkkellogg/gaussian-splats-3d'],
  },
  build: {
    outDir: '../server/public',
    emptyOutDir: true,
  },
});
