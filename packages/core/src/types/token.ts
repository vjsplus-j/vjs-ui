/**
 * VJS-UI Token类型定义
 * 
 * 完整版：支持嵌套结构、Token引用、运行时切换
 */

/**
 * Token值类型
 */
export type TokenValue = string | number | NestedToken

/**
 * 嵌套Token对象
 */
export interface NestedToken {
  [key: string]: TokenValue
}

/**
 * 扁平Token映射
 * 
 * @example
 * ```typescript
 * const tokens: FlatTokenMap = {
 *   'color.primary': '#1677ff',
 *   'color.success': '#52c41a',
 *   'spacing.md': '16px'
 * }
 * ```
 */
export interface FlatTokenMap {
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
  
  /**
   * 是否解析Token引用
   * @default true
   */
  resolveReferences?: boolean
}

/**
 * Token运行时选项
 */
export interface TokenRuntimeOptions {
  /**
   * CSS变量前缀
   * @default 'vjs'
   */
  prefix?: string
  
  /**
   * 目标元素
   * @default document.body
   */
  target?: HTMLElement
  
  /**
   * 是否启用过渡动画
   * @default true
   */
  enableTransition?: boolean
  
  /**
   * 过渡持续时间（ms）
   * @default 300
   */
  transitionDuration?: number
}

/**
 * Token变化事件
 */
export interface TokenChangeEvent {
  /**
   * 变化的Token key
   */
  key: string
  
  /**
   * 旧值
   */
  oldValue: string | number
  
  /**
   * 新值
   */
  newValue: string | number
  
  /**
   * 时间戳
   */
  timestamp: number
}
