import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VjsUiCore',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`
    },
    rollupOptions: {
      external: ['@vjs-ui/shared', '@vjs-ui/utils'],
      output: {
        exports: 'named',
        globals: {
          '@vjs-ui/shared': 'VjsUiShared',
          '@vjs-ui/utils': 'VjsUiUtils'
        }
      }
    },
    sourcemap: true,
    minify: false
  },
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
})
