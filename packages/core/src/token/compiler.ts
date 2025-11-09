/**
 * VJS-UI Token编译器（完整版）
 * 
 * 功能：
 * - 支持嵌套Token结构
 * - 支持Token引用（$token.color.primary）
 * - 多种输出格式（CSS/SCSS/TypeScript）
 * - 颜色透明度处理
 * - Token展平
 */

import type { NestedToken, FlatTokenMap, TokenCompileOptions } from '../types/token'

/**
 * Token编译器
 * 
 * @example
 * ```typescript
 * const compiler = new TokenCompiler()
 * 
 * const tokens = {
 *   color: {
 *     primary: '#1677ff',
 *     success: '#52c41a'
 *   },
 *   spacing: {
 *     md: '16px'
 *   }
 * }
 * 
 * // 展平Token
 * const flat = compiler.flatten(tokens)
 * // { 'color.primary': '#1677ff', 'color.success': '#52c41a', 'spacing.md': '16px' }
 * 
 * // 编译成CSS Variables
 * const css = compiler.toCSSVariables(flat)
 * 
 * // 编译成TypeScript类型
 * const ts = compiler.toTypeScript(flat)
 * 
 * // 编译成SCSS变量
 * const scss = compiler.toSCSS(flat)
 * ```
 */
export class TokenCompiler {
  private options: Required<TokenCompileOptions>

  constructor(options: TokenCompileOptions = {}) {
    this.options = {
      prefix: options.prefix ?? 'vjs',
      pretty: options.pretty ?? false,
      resolveReferences: options.resolveReferences ?? true
    }
  }

  /**
   * 展平嵌套Token结构
   * 
   * @example
   * flatten({ color: { primary: '#1677ff' } })
   * // => { 'color.primary': '#1677ff' }
   * 
   * @param tokens 嵌套Token对象
   * @param prefix 前缀（内部使用）
   * @returns 扁平Token映射
   */
  flatten(tokens: NestedToken, prefix = ''): FlatTokenMap {
    const result: FlatTokenMap = {}

    for (const [key, value] of Object.entries(tokens)) {
      const fullKey = prefix ? `${prefix}.${key}` : key

      if (this.isNestedToken(value)) {
        // 递归展平嵌套对象
        Object.assign(result, this.flatten(value, fullKey))
      } else {
        // 基础类型直接赋值
        result[fullKey] = value
      }
    }

    return result
  }

  /**
   * 编译Token到CSS Variables
   * 
   * @param tokens 扁平Token映射
   * @returns CSS字符串
   */
  toCSSVariables(tokens: FlatTokenMap): string {
    // 解析Token引用
    const resolved = this.options.resolveReferences
      ? this.resolveReferences(tokens)
      : tokens

    const lines: string[] = [':root {']
    
    for (const [key, value] of Object.entries(resolved)) {
      const cssVar = this.tokenKeyToCSSVar(key)
      const cssValue = this.formatValue(value)
      
      if (this.options.pretty) {
        lines.push(`  ${cssVar}: ${cssValue};`)
      } else {
        lines.push(`${cssVar}:${cssValue};`)
      }
    }
    
    lines.push('}')
    
    return this.options.pretty 
      ? lines.join('\n')
      : lines.join('')
  }

  /**
   * 编译Token到TypeScript类型
   * 
   * @example
   * toTypeScript({ 'color.primary': '#1677ff' })
   * // => export type Tokens = { 'color.primary': string }
   * 
   * @param tokens 扁平Token映射
   * @returns TypeScript代码字符串
   */
  toTypeScript(tokens: FlatTokenMap): string {
    const lines: string[] = []
    
    lines.push('/**')
    lines.push(' * Design Tokens类型定义')
    lines.push(' * @generated')
    lines.push(' */')
    lines.push('export interface Tokens {')
    
    for (const [key, value] of Object.entries(tokens)) {
      const type = typeof value === 'number' ? 'number' : 'string'
      lines.push(`  '${key}': ${type}`)
    }
    
    lines.push('}')
    lines.push('')
    lines.push('/**')
    lines.push(' * Token值映射')
    lines.push(' */')
    lines.push('export const tokens: Tokens = {')
    
    for (const [key, value] of Object.entries(tokens)) {
      const formattedValue = typeof value === 'string' ? `'${value}'` : value
      lines.push(`  '${key}': ${formattedValue},`)
    }
    
    lines.push('}')
    
    return lines.join('\n')
  }

  /**
   * 编译Token到SCSS变量
   * 
   * @example
   * toSCSS({ 'color.primary': '#1677ff' })
   * // => $color-primary: #1677ff;
   * 
   * @param tokens 扁平Token映射
   * @returns SCSS代码字符串
   */
  toSCSS(tokens: FlatTokenMap): string {
    // 解析Token引用
    const resolved = this.options.resolveReferences
      ? this.resolveReferences(tokens)
      : tokens

    const lines: string[] = []
    
    lines.push('// Design Tokens')
    lines.push('// @generated')
    lines.push('')
    
    for (const [key, value] of Object.entries(resolved)) {
      const scssVar = this.tokenKeyToSCSSVar(key)
      const scssValue = this.formatValue(value)
      lines.push(`${scssVar}: ${scssValue};`)
    }
    
    return lines.join('\n')
  }

  /**
   * 应用颜色透明度
   * 
   * @example
   * applyAlpha('#1677ff', 0.5)
   * // => rgba(22, 119, 255, 0.5)
   * 
   * @param color 颜色值（hex/rgb/rgba）
   * @param alpha 透明度（0-1）
   * @returns 带透明度的颜色值
   */
  applyAlpha(color: string, alpha: number): string {
    // 处理hex颜色
    if (color.startsWith('#')) {
      const hex = color.slice(1)
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
    
    // 处理rgb颜色
    if (color.startsWith('rgb(')) {
      const values = color.match(/\d+/g)
      if (values && values.length === 3) {
        return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`
      }
    }
    
    // 处理rgba颜色（替换alpha值）
    if (color.startsWith('rgba(')) {
      return color.replace(/[\d.]+\)$/, `${alpha})`)
    }
    
    // 无法处理的颜色格式，直接返回
    return color
  }

  /**
   * 解析Token引用
   * 
   * 支持的引用格式：
   * - $token.color.primary
   * - ${token.spacing.md}
   * 
   * @param tokens 扁平Token映射
   * @returns 解析后的Token映射
   */
  private resolveReferences(tokens: FlatTokenMap): FlatTokenMap {
    const resolved: FlatTokenMap = {}
    const referencePattern = /\$\{?token\.([a-zA-Z0-9_.]+)\}?/g

    for (const [key, value] of Object.entries(tokens)) {
      if (typeof value === 'string' && referencePattern.test(value)) {
        // 重置正则表达式状态
        referencePattern.lastIndex = 0
        
        let resolvedValue = value
        let match: RegExpExecArray | null
        
        while ((match = referencePattern.exec(value)) !== null) {
          const refKey = match[1]
          
          if (refKey && tokens[refKey] !== undefined) {
            resolvedValue = resolvedValue.replace(match[0], String(tokens[refKey]))
          }
        }
        
        resolved[key] = resolvedValue
      } else {
        resolved[key] = value
      }
    }

    return resolved
  }

  /**
   * 判断是否为嵌套Token对象
   */
  private isNestedToken(value: any): value is NestedToken {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }

  /**
   * 将Token key转换为CSS变量名
   * 
   * @example
   * 'color.primary' -> '--vjs-color-primary'
   */
  private tokenKeyToCSSVar(key: string): string {
    const normalizedKey = key.replace(/\./g, '-')
    return `--${this.options.prefix}-${normalizedKey}`
  }

  /**
   * 将Token key转换为SCSS变量名
   * 
   * @example
   * 'color.primary' -> '$color-primary'
   */
  private tokenKeyToSCSSVar(key: string): string {
    const normalizedKey = key.replace(/\./g, '-')
    return `$${normalizedKey}`
  }

  /**
   * 格式化值
   */
  private formatValue(value: string | number): string {
    return String(value)
  }
}

/**
 * 创建Token编译器实例（便捷函数）
 */
export function createTokenCompiler(options?: TokenCompileOptions): TokenCompiler {
  return new TokenCompiler(options)
}
