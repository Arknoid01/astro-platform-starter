import { defineConfig } from 'vite';

export default defineConfig({
  // Relative paths — required for Capacitor, GitHub Pages, and static hosting.
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    host: true,
    open: true,
  },
  preview: {
    host: true,
    open: true,
  },
});
