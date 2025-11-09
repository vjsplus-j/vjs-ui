/**
 * VJS-UI Token类型定义
 * 
 * MVP版本：简化的Token系统，仅支持扁平结构
 */

/**
 * 简单Token映射（MVP版本）
 * 
 * @example
 * ```typescript
 * const tokens: SimpleToken = {
 *   'color-primary': '#1677ff',
 *   'spacing-md': '16px',
 *   'font-size-base': '14px'
 * }
 * ```
 */
export interface SimpleToken {
  [key: string]: string | number
}

/**
 * Token编译选项
 */
export interface TokenCompileOptions {
  /**
   * CSS变量前缀
   * @default 'vjs'
   */
  prefix?: string
  
  /**
   * 是否美化输出
   * @default false
   */
  pretty?: boolean
}
