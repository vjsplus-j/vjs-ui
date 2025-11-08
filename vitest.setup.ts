/**
 * Vitest 全局设置文件
 */

// 设置测试超时时间
import { beforeAll, afterEach, afterAll } from 'vitest'

// 全局测试超时时间（毫秒）
beforeAll(() => {
  // 设置为10秒，适合大多数单元测试
  // 如果需要更长时间，可以在特定测试中单独设置
})

// 每个测试后清理
afterEach(() => {
  // 清理模拟和定时器
  // vi.clearAllMocks()
  // vi.clearAllTimers()
})

// 所有测试完成后
afterAll(() => {
  // 全局清理工作
})

// 扩展期望匹配器（如果需要）
// import '@testing-library/jest-dom'

// 禁用控制台警告（测试时）
const originalWarn = console.warn
const originalError = console.error

beforeAll(() => {
  console.warn = (...args: any[]) => {
    // 过滤掉一些已知的警告
    const message = args[0]
    if (
      typeof message === 'string' &&
      (message.includes('deprecated') ||
       message.includes('[Vue warn]'))
    ) {
      return
    }
    originalWarn(...args)
  }
  
  console.error = (...args: any[]) => {
    // 过滤掉一些已知的错误
    const message = args[0]
    if (typeof message === 'string' && message.includes('Not implemented')) {
      return
    }
    originalError(...args)
  }
})

afterAll(() => {
  console.warn = originalWarn
  console.error = originalError
})
