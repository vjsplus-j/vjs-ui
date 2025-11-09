/**
 * VJS-UI Token运行时管理器
 * 
 * 功能：
 * - 运行时应用和切换Token
 * - Token变化监听
 * - 过渡动画支持
 * - Token get/set
 */

import type { FlatTokenMap, TokenRuntimeOptions, TokenChangeEvent } from '../types/token'

/**
 * Token运行时管理器
 * 
 * @example
 * ```typescript
 * const runtime = new TokenRuntime()
 * 
 * // 应用Token
 * runtime.apply({
 *   'color.primary': '#1677ff',
 *   'spacing.md': '16px'
 * })
 * 
 * // 获取Token值
 * const primary = runtime.get('color.primary')
 * 
 * // 设置Token值
 * runtime.set('color.primary', '#ff0000')
 * 
 * // 监听Token变化
 * runtime.onChange((event) => {
 *   console.log(`Token ${event.key} changed from ${event.oldValue} to ${event.newValue}`)
 * })
 * 
 * // 清理
 * runtime.destroy()
 * ```
 */
export class TokenRuntime {
  private options: Required<TokenRuntimeOptions>
  private currentTokens: FlatTokenMap = {}
  private listeners: Array<(event: TokenChangeEvent) => void> = []
  private cssVarCache: Map<string, string> = new Map()

  constructor(options: TokenRuntimeOptions = {}) {
    this.options = {
      prefix: options.prefix ?? 'vjs',
      target: options.target ?? (typeof document !== 'undefined' ? document.body : undefined!),
      enableTransition: options.enableTransition ?? true,
      transitionDuration: options.transitionDuration ?? 300
    }
  }

  /**
   * 应用Token到DOM
   * 
   * @param tokens 扁平Token映射
   * @param animate 是否启用过渡动画
   */
  apply(tokens: FlatTokenMap, animate = this.options.enableTransition): void {
    if (!this.options.target) {
      throw new Error('TokenRuntime: target element is not available')
    }

    // 启用过渡动画
    if (animate) {
      this.enableTransition()
    }

    // 应用Token
    for (const [key, value] of Object.entries(tokens)) {
      const cssVar = this.tokenKeyToCSSVar(key)
      const cssValue = this.formatValue(value)
      const oldValue = this.currentTokens[key]

      // 设置CSS变量
      this.options.target.style.setProperty(cssVar, cssValue)
      this.cssVarCache.set(key, cssVar)

      // 触发变化事件
      if (oldValue !== undefined && oldValue !== value) {
        this.emitChange({
          key,
          oldValue,
          newValue: value,
          timestamp: Date.now()
        })
      }

      // 更新缓存
      this.currentTokens[key] = value
    }

    // 禁用过渡动画
    if (animate) {
      setTimeout(() => {
        this.disableTransition()
      }, this.options.transitionDuration)
    }
  }

  /**
   * 获取Token值
   * 
   * @param key Token key
   * @returns Token值或null
   */
  get(key: string): string | number | null {
    // 先从缓存获取
    if (this.currentTokens[key] !== undefined) {
      return this.currentTokens[key]
    }

    // 从DOM获取
    if (!this.options.target) {
      return null
    }

    const cssVar = this.tokenKeyToCSSVar(key)
    const value = getComputedStyle(this.options.target).getPropertyValue(cssVar).trim()
    
    return value || null
  }

  /**
   * 设置Token值
   * 
   * @param key Token key
   * @param value Token值
   * @param animate 是否启用过渡动画
   */
  set(key: string, value: string | number, animate = this.options.enableTransition): void {
    this.apply({ [key]: value }, animate)
  }

  /**
   * 批量设置Token值
   * 
   * @param tokens Token映射
   * @param animate 是否启用过渡动画
   */
  setMany(tokens: FlatTokenMap, animate = this.options.enableTransition): void {
    this.apply(tokens, animate)
  }

  /**
   * 移除Token
   * 
   * @param keys Token keys
   */
  remove(keys: string | string[]): void {
    if (!this.options.target) {
      return
    }

    const keyArray = Array.isArray(keys) ? keys : [keys]

    for (const key of keyArray) {
      const cssVar = this.cssVarCache.get(key)
      
      if (cssVar) {
        this.options.target.style.removeProperty(cssVar)
        this.cssVarCache.delete(key)
      }

      delete this.currentTokens[key]
    }
  }

  /**
   * 清除所有Token
   */
  clear(): void {
    if (!this.options.target) {
      return
    }

    for (const cssVar of this.cssVarCache.values()) {
      this.options.target.style.removeProperty(cssVar)
    }

    this.cssVarCache.clear()
    this.currentTokens = {}
  }

  /**
   * 获取所有Token
   * 
   * @returns 当前所有Token的副本
   */
  getAll(): FlatTokenMap {
    return { ...this.currentTokens }
  }

  /**
   * 监听Token变化
   * 
   * @param listener 监听函数
   * @returns 取消监听的函数
   */
  onChange(listener: (event: TokenChangeEvent) => void): () => void {
    this.listeners.push(listener)

    // 返回取消监听的函数
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index !== -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  /**
   * 销毁运行时实例
   */
  destroy(): void {
    this.clear()
    this.listeners = []
    this.disableTransition()
  }

  /**
   * 启用过渡动画
   */
  private enableTransition(): void {
    if (!this.options.target) {
      return
    }

    const transition = `all ${this.options.transitionDuration}ms ease-in-out`
    this.options.target.style.transition = transition
  }

  /**
   * 禁用过渡动画
   */
  private disableTransition(): void {
    if (!this.options.target) {
      return
    }

    this.options.target.style.transition = ''
  }

  /**
   * 触发变化事件
   */
  private emitChange(event: TokenChangeEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event)
      } catch (error) {
        console.error('TokenRuntime: Error in change listener:', error)
      }
    }
  }

  /**
   * 将Token key转换为CSS变量名
   */
  private tokenKeyToCSSVar(key: string): string {
    const normalizedKey = key.replace(/\./g, '-')
    return `--${this.options.prefix}-${normalizedKey}`
  }

  /**
   * 格式化值
   */
  private formatValue(value: string | number): string {
    return String(value)
  }
}

/**
 * 创建Token运行时实例（便捷函数）
 */
export function createTokenRuntime(options?: TokenRuntimeOptions): TokenRuntime {
  return new TokenRuntime(options)
}
