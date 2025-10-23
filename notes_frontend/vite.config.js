/// <reference types="vite/client" />


import { defineConfig } from 'vite'
import blitsVitePlugins from '@lightningjs/blits/vite'

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [...blitsVitePlugins],
    resolve: {
      mainFields: ['browser', 'module', 'jsnext:main', 'jsnext'],
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: ['.kavia.ai'],
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
      fs: {
        allow: ['..'],
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 3000
    },
    worker: {
      format: 'es',
    },
  }
})
