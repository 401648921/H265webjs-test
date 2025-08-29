import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import { resolve } from 'path';
import { copyFileSync, existsSync, mkdirSync } from 'fs';

export default defineConfig({
  plugins: [
    createVuePlugin(),
    {
      name: 'copy-dist-files',
      writeBundle() {
        const distDir = resolve(__dirname, 'dist');
        const outputDir = resolve(__dirname, 'docs');
        
        if (existsSync(distDir)) {
          const files = ['missile.js', 'h265webjs-v20221106.js', 'missile-v20221120.wasm'];
          files.forEach(file => {
            const srcPath = resolve(distDir, file);
            const destPath = resolve(outputDir, file);
            if (existsSync(srcPath)) {
              copyFileSync(srcPath, destPath);
            }
          });
        }
      }
    }
  ],
  build: {
    outDir: 'docs',
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
});
