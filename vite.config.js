import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const standalone = process.env.STANDALONE === '1';

export default defineConfig({
  plugins: standalone ? [viteSingleFile()] : [],
  base: './',
  build: {
    outDir: standalone ? 'standalone' : 'dist',
    assetsDir: 'assets',
    assetsInlineLimit: standalone ? 100_000_000 : 4096,
    rollupOptions: {
      output: {
        inlineDynamicImports: standalone,
      },
    },
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
