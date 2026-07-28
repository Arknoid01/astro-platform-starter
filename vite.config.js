import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    // Classic script bundle — works in browser (file://), GitHub Pages, and Capacitor.
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        format: 'iife',
        name: 'AstroRPG',
        entryFileNames: 'game.js',
        inlineDynamicImports: true,
      },
    },
  },
  // Dev server optional — only needed while editing source code.
  server: {
    host: true,
  },
});
