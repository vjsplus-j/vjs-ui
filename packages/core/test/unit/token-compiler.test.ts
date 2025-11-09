/**
 * TokenCompiler完整版测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { TokenCompiler, createTokenCompiler } from '../../src/token/compiler'
import type { NestedToken, FlatTokenMap } from '../../src/types/token'

describe('TokenCompiler (完整版)', () => {
  let compiler: TokenCompiler

  beforeEach(() => {
    compiler = new TokenCompiler({ pretty: true })
  })

  describe('flatten()', () => {
    it('应该展平嵌套Token结构', () => {
      const tokens: NestedToken = {
        color: {
          primary: '#1677ff',
          success: '#52c41a'
        },
        spacing: {
          md: '16px'
        }
      }

      const flat = compiler.flatten(tokens)

      expect(flat).toEqual({
        'color.primary': '#1677ff',
        'color.success': '#52c41a',
        'spacing.md': '16px'
      })
    })

    it('应该处理深度嵌套', () => {
      const tokens: NestedToken = {
        design: {
          color: {
            primary: {
              base: '#1677ff',
              hover: '#4a90e2'
            }
          }
        }
      }

      const flat = compiler.flatten(tokens)

      expect(flat).toEqual({
        'design.color.primary.base': '#1677ff',
        'design.color.primary.hover': '#4a90e2'
      })
    })

    it('应该处理混合结构', () => {
      const tokens: NestedToken = {
        color: {
          primary: '#1677ff',
          text: {
            body: '#000000',
            muted: '#666666'
          }
        },
        'font-size': '14px'
      }

      const flat = compiler.flatten(tokens)

      expect(flat).toHaveProperty('color.primary')
      expect(flat).toHaveProperty('color.text.body')
      expect(flat).toHaveProperty('color.text.muted')
      expect(flat).toHaveProperty('font-size')
    })
  })

  describe('toCSSVariables()', () => {
    it('应该编译扁平Token到CSS Variables', () => {
      const tokens: FlatTokenMap = {
        'color.primary': '#1677ff',
        'spacing.md': '16px'
      }

      const css = compiler.toCSSVariables(tokens)

      expect(css).toContain('--vjs-color-primary: #1677ff;')
      expect(css).toContain('--vjs-spacing-md: 16px;')
    })

    it('应该解析Token引用', () => {
      const tokens: FlatTokenMap = {
        'color.primary': '#1677ff',
        'color.link': '$token.color.primary'
      }

      const css = compiler.toCSSVariables(tokens)

      expect(css).toContain('--vjs-color-link: #1677ff;')
    })

    it('应该支持${...}格式的Token引用', () => {
      const tokens: FlatTokenMap = {
        'spacing.base': '8px',
        'spacing.double': '${token.spacing.base}'
      }

      const css = compiler.toCSSVariables(tokens)

      expect(css).toContain('--vjs-spacing-double: 8px;')
    })
  })

  describe('toTypeScript()', () => {
    it('应该生成TypeScript类型定义', () => {
      const tokens: FlatTokenMap = {
        'color.primary': '#1677ff',
        'spacing.md': '16px',
        'z-index': 1000
      }

      const ts = compiler.toTypeScript(tokens)

      expect(ts).toContain("export interface Tokens {")
      expect(ts).toContain("'color.primary': string")
      expect(ts).toContain("'spacing.md': string")
      expect(ts).toContain("'z-index': number")
      expect(ts).toContain("export const tokens: Tokens")
    })
  })

  describe('toSCSS()', () => {
    it('应该生成SCSS变量', () => {
      const tokens: FlatTokenMap = {
        'color.primary': '#1677ff',
        'spacing.md': '16px'
      }

      const scss = compiler.toSCSS(tokens)

      expect(scss).toContain('$color-primary: #1677ff;')
      expect(scss).toContain('$spacing-md: 16px;')
    })

    it('应该解析Token引用', () => {
      const tokens: FlatTokenMap = {
        'color.primary': '#1677ff',
        'color.link': '$token.color.primary'
      }

      const scss = compiler.toSCSS(tokens)

      expect(scss).toContain('$color-link: #1677ff;')
    })
  })

  describe('applyAlpha()', () => {
    it('应该处理hex颜色', () => {
      const result = compiler.applyAlpha('#1677ff', 0.5)
      expect(result).toBe('rgba(22, 119, 255, 0.5)')
    })

    it('应该处理rgb颜色', () => {
      const result = compiler.applyAlpha('rgb(22, 119, 255)', 0.8)
      expect(result).toBe('rgba(22, 119, 255, 0.8)')
    })

    it('应该处理rgba颜色', () => {
      const result = compiler.applyAlpha('rgba(22, 119, 255, 1)', 0.3)
      expect(result).toBe('rgba(22, 119, 255, 0.3)')
    })

    it('应该处理无法识别的颜色格式', () => {
      const result = compiler.applyAlpha('blue', 0.5)
      expect(result).toBe('blue')
    })
  })

  describe('配置选项', () => {
    it('应该支持自定义前缀', () => {
      const customCompiler = new TokenCompiler({ prefix: 'custom', pretty: true })
      const tokens: FlatTokenMap = { 'color': 'blue' }

      const css = customCompiler.toCSSVariables(tokens)

      expect(css).toContain('--custom-color: blue;')
    })

    it('应该支持禁用Token引用解析', () => {
      const noResolveCompiler = new TokenCompiler({ resolveReferences: false })
      const tokens: FlatTokenMap = {
        'color.primary': '#1677ff',
        'color.link': '$token.color.primary'
      }

      const css = noResolveCompiler.toCSSVariables(tokens)

      expect(css).toContain('$token.color.primary')
    })
  })
})

describe('createTokenCompiler()', () => {
  it('应该创建TokenCompiler实例', () => {
    const compiler = createTokenCompiler()
    expect(compiler).toBeInstanceOf(TokenCompiler)
  })

  it('应该接受配置选项', () => {
    const compiler = createTokenCompiler({ prefix: 'test', pretty: true })
    const tokens: FlatTokenMap = { 'color': 'red' }
    const css = compiler.toCSSVariables(tokens)

    expect(css).toContain('--test-color: red;')
    expect(css).toContain('\n')
  })
})
