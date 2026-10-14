import { defineConfig } from 'vite'

/*
 * base vem do ambiente porque o mesmo codigo e servido de dois lugares:
 * na raiz de um dominio proprio, e numa subpasta do GitHub Pages, onde o
 * caminho precisa carregar o nome do repositorio. Cravar '/' aqui quebra
 * todo asset na publicacao de amostra.
 *
 *   BASE=/beto-carrero-green-beach/ npm run build
 */
export default defineConfig({
  base: process.env.BASE || '/',
  build: {
    target: 'es2020',
    assetsInlineLimit: 2048,
    cssCodeSplit: false,
  },
  server: { port: 5195, open: false },
})
