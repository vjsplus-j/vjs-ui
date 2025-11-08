import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VjsUiUtils',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`
    },
    rollupOptions: {
      external: ['@vjs-ui/shared'],
      output: {
        exports: 'named',
        globals: {
          '@vjs-ui/shared': 'VjsUiShared'
        }
      }
    },
    sourcemap: true,
    minify: false
  }
})
