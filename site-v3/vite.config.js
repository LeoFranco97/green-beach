import { defineConfig } from 'vite'

// base: troque para '/nome-do-repositorio/' se publicar em subpasta do GitHub Pages.
export default defineConfig({
  base: '/',
  build: {
    target: 'es2020',
    assetsInlineLimit: 2048,
    cssCodeSplit: false,
  },
  server: { port: 5190, open: false },
})
