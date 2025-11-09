/**
 * VJS-UI 简单Token编译器（MVP版本）
 * 
 * 功能：将Token对象编译成CSS Variables
 * 特点：
 * - 仅支持扁平Token结构
 * - 不支持嵌套Token
 * - 不支持Token引用
 * - 不支持运行时切换
 */

import type { SimpleToken, TokenCompileOptions } from '../types/token'

/**
 * 简单Token编译器
 * 
 * @example
 * ```typescript
 * const compiler = new SimpleTokenCompiler()
 * const tokens = {
 *   'color-primary': '#1677ff',
 *   'spacing-md': '16px'
 * }
 * const css = compiler.compile(tokens)
 * // 输出:
 * // :root {
 * //   --vjs-color-primary: #1677ff;
 * //   --vjs-spacing-md: 16px;
 * // }
 * ```
 */
export class SimpleTokenCompiler {
  private options: Required<TokenCompileOptions>

  /**
   * 构造函数
   * @param options 编译选项
   */
  constructor(options: TokenCompileOptions = {}) {
    this.options = {
      prefix: options.prefix ?? 'vjs',
      pretty: options.pretty ?? false
    }
  }

  /**
   * 编译Token到CSS Variables
   * 
   * @param tokens Token对象
   * @returns CSS字符串
   */
  compile(tokens: SimpleToken): string {
    const lines: string[] = [':root {']
    
    for (const [key, value] of Object.entries(tokens)) {
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
   * 将Token key转换为CSS变量名
   * 
   * @example
   * 'color-primary' -> '--vjs-color-primary'
   * 'color.primary' -> '--vjs-color-primary'
   * 
   * @param key Token key
   * @returns CSS变量名
   */
  private tokenKeyToCSSVar(key: string): string {
    const normalizedKey = key.replace(/\./g, '-')
    return `--${this.options.prefix}-${normalizedKey}`
  }

  /**
   * 格式化值
   * 
   * @param value Token值
   * @returns 格式化后的值
   */
  private formatValue(value: string | number): string {
    return String(value)
  }

  /**
   * 应用Token到DOM元素
   * 
   * @param tokens Token对象
   * @param element 目标DOM元素，默认为document.body
   */
  apply(tokens: SimpleToken, element: HTMLElement = document.body): void {
    for (const [key, value] of Object.entries(tokens)) {
      const cssVar = this.tokenKeyToCSSVar(key)
      const cssValue = this.formatValue(value)
      element.style.setProperty(cssVar, cssValue)
    }
  }

  /**
   * 移除Token
   * 
   * @param tokens Token对象（只需要key）
   * @param element 目标DOM元素，默认为document.body
   */
  remove(tokens: SimpleToken, element: HTMLElement = document.body): void {
    for (const key of Object.keys(tokens)) {
      const cssVar = this.tokenKeyToCSSVar(key)
      element.style.removeProperty(cssVar)
    }
  }

  /**
   * 获取Token值
   * 
   * @param key Token key
   * @param element 目标DOM元素，默认为document.body
   * @returns Token值或null
   */
  get(key: string, element: HTMLElement = document.body): string | null {
    const cssVar = this.tokenKeyToCSSVar(key)
    return getComputedStyle(element).getPropertyValue(cssVar).trim() || null
  }
}

/**
 * 创建Token编译器实例（便捷函数）
 * 
 * @param options 编译选项
 * @returns Token编译器实例
 */
export function createTokenCompiler(options?: TokenCompileOptions): SimpleTokenCompiler {
  return new SimpleTokenCompiler(options)
}
