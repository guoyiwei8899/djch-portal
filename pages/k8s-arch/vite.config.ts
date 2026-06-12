import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// 单文件打包：JS/CSS 全部内联进一个 index.html，
// 直接塞进 k8s ConfigMap k8s-arch-html 即可。
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 4000,
  },
})
