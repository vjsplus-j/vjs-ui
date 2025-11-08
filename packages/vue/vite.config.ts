import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VjsUiVue',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`
    },
    rollupOptions: {
      external: ['vue', '@vjs-ui/core', '@vjs-ui/tokens', '@vjs-ui/shared', '@vjs-ui/utils'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          '@vjs-ui/core': 'VjsUiCore',
          '@vjs-ui/tokens': 'VjsUiTokens',
          '@vjs-ui/shared': 'VjsUiShared',
          '@vjs-ui/utils': 'VjsUiUtils'
        }
      }
    },
    sourcemap: true,
    minify: false
  }
})
