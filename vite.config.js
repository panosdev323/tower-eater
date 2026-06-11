import { defineConfig } from 'vite';

export default defineConfig({
  base: '/tower-eater/',
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000
  }
});