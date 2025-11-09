/**
 * VJS-UI Token系统
 * 
 * 完整版Token系统，支持：
 * - 嵌套Token结构
 * - Token引用
 * - 多种输出格式（CSS/SCSS/TypeScript）
 * - 运行时动态切换
 * - Token变化监听
 */

// 编译器
export { TokenCompiler, createTokenCompiler } from './compiler'

// 运行时
export { TokenRuntime, createTokenRuntime } from './runtime'

// 简单编译器（向后兼容）
export { SimpleTokenCompiler, createTokenCompiler as createSimpleTokenCompiler } from './simple-token'

// 类型
export type * from '../types/token'
