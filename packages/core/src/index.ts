/**
 * @vjs-ui/core
 * 核心引擎
 */

// 导出Token系统
export * from './token/simple-token'
export type * from './types/token'

// 导出响应式系统
export * from './reactive'

// 导出DSL系统
export * from './dsl'

// 版本信息
export const version = '0.1.0'
