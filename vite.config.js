import { defineConfig } from 'vite';

export default defineConfig({
  base: '/tower-eater/',
  root: 'src',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
  server: {
    port: 3000
  }
});