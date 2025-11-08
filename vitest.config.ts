import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    // 测试环境
    environment: 'jsdom',
    
    // 全局API
    globals: true,
    
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'tests/',
        '**/__tests__/**',
      ],
      all: true,
      lines: 85,
      functions: 85,
      branches: 85,
      statements: 85,
    },
    
    // 测试文件匹配
    include: [
      'packages/**/__tests__/**/*.{test,spec}.{js,ts}',
      'packages/**/*.{test,spec}.{js,ts}',
    ],
    
    // 排除文件
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache',
    ],
    
    // 设置文件
    setupFiles: ['./vitest.setup.ts'],
  },
  
  resolve: {
    alias: {
      '@vjs-ui/core': resolve(__dirname, 'packages/core/src'),
      '@vjs-ui/tokens': resolve(__dirname, 'packages/tokens/src'),
      '@vjs-ui/vue': resolve(__dirname, 'packages/vue/src'),
      '@vjs-ui/utils': resolve(__dirname, 'packages/utils/src'),
      '@vjs-ui/shared': resolve(__dirname, 'packages/shared/src'),
    },
  },
})
