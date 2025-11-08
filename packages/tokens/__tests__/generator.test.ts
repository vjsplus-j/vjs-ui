import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  generateCSSVariables,
  generateCSSString,
  injectCSSVariables,
  getCSSVariable,
  setCSSVariable,
} from '../src/generator'
import type { Tokens } from '../src/types'

describe('Token Generator', () => {
  const mockTokens: Partial<Tokens> = {
    colors: {
      primary: {
        50: '#e6f2ff',
        500: '#1890ff',
        900: '#001a33',
      },
      success: {
        50: '#e8f7ef',
        500: '#52c41a',
        900: '#1f5a0d',
      },
    } as any,
    spacing: {
      '0': '0',
      '1': '4px',
      '2': '8px',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
    },
  } as Tokens

  describe('generateCSSVariables', () => {
    it('应该生成CSS变量对象', () => {
      const vars = generateCSSVariables(mockTokens as Tokens)

      expect(vars).toHaveProperty('--vjs-colors-primary-50', '#e6f2ff')
      expect(vars).toHaveProperty('--vjs-colors-primary-500', '#1890ff')
      expect(vars).toHaveProperty('--vjs-spacing-1', '4px')
      expect(vars).toHaveProperty('--vjs-fontSize-xs', '12px')
    })

    it('应该支持自定义前缀', () => {
      const vars = generateCSSVariables(mockTokens as Tokens, { prefix: 'custom' })

      expect(vars).toHaveProperty('--custom-colors-primary-50')
      expect(vars).toHaveProperty('--custom-spacing-1')
    })

    it('应该扁平化嵌套对象', () => {
      const vars = generateCSSVariables(mockTokens as Tokens)
      const keys = Object.keys(vars)

      expect(keys.every(key => key.startsWith('--vjs-'))).toBe(true)
      expect(keys.some(key => key.includes('colors-primary'))).toBe(true)
    })

    it('应该处理所有token类型', () => {
      const vars = generateCSSVariables(mockTokens as Tokens)

      expect(vars).toHaveProperty('--vjs-colors-primary-50')
      expect(vars).toHaveProperty('--vjs-spacing-1')
      expect(vars).toHaveProperty('--vjs-fontSize-xs')
    })
  })

  describe('generateCSSString', () => {
    it('应该生成CSS字符串', () => {
      const cssString = generateCSSString(mockTokens as Tokens)

      expect(cssString).toContain(':root {')
      expect(cssString).toContain('--vjs-colors-primary-50: #e6f2ff;')
      expect(cssString).toContain('--vjs-spacing-1: 4px;')
      expect(cssString).toContain('}')
    })

    it('应该支持component scope', () => {
      const cssString = generateCSSString(mockTokens as Tokens, { scope: 'component' })

      expect(cssString).toContain('.vjs-ui {')
      expect(cssString).not.toContain(':root {')
    })

    it('应该正确格式化CSS', () => {
      const cssString = generateCSSString(mockTokens as Tokens)
      const lines = cssString.split('\n')

      expect(lines[0]).toMatch(/^:root \{$/)
      expect(lines[lines.length - 1]).toBe('}')
      expect(lines.slice(1, -1).every(line => line.startsWith('  '))).toBe(true)
    })

    it('应该包含所有token', () => {
      const cssString = generateCSSString(mockTokens as Tokens)

      expect(cssString).toContain('colors-primary')
      expect(cssString).toContain('colors-success')
      expect(cssString).toContain('spacing')
      expect(cssString).toContain('fontSize')
    })
  })

  describe('DOM操作（浏览器环境模拟）', () => {
    beforeEach(() => {
      // 模拟DOM环境
      global.document = {
        getElementById: vi.fn(),
        createElement: vi.fn(() => ({
          id: '',
          textContent: '',
        })),
        head: {
          appendChild: vi.fn(),
        },
        documentElement: {
          style: {
            setProperty: vi.fn(),
          },
        },
      } as any

      global.getComputedStyle = vi.fn(() => ({
        getPropertyValue: vi.fn(() => '#1890ff'),
      })) as any
    })

    afterEach(() => {
      delete (global as any).document
      delete (global as any).getComputedStyle
    })

    describe('injectCSSVariables', () => {
      it('应该创建style标签并注入CSS', () => {
        const createElementSpy = vi.spyOn(document, 'createElement')
        const appendChildSpy = vi.spyOn(document.head, 'appendChild')

        injectCSSVariables(mockTokens as Tokens)

        expect(createElementSpy).toHaveBeenCalledWith('style')
        expect(appendChildSpy).toHaveBeenCalled()
      })

      it('应该移除旧的style标签', () => {
        const oldStyle = { remove: vi.fn() }
        const getElementByIdSpy = vi.spyOn(document, 'getElementById').mockReturnValue(oldStyle as any)

        injectCSSVariables(mockTokens as Tokens)

        expect(getElementByIdSpy).toHaveBeenCalledWith('vjs-ui-tokens')
        expect(oldStyle.remove).toHaveBeenCalled()
      })

      it('应该设置style标签的id和内容', () => {
        const mockStyle: any = { id: '', textContent: '' }
        vi.spyOn(document, 'createElement').mockReturnValue(mockStyle)

        injectCSSVariables(mockTokens as Tokens)

        expect(mockStyle.id).toBe('vjs-ui-tokens')
        expect(mockStyle.textContent).toContain(':root {')
      })
    })

    describe('getCSSVariable', () => {
      it('应该获取CSS变量值', () => {
        const value = getCSSVariable('colors-primary-500')
        expect(value).toBe('#1890ff')
      })

      it('应该支持自定义前缀', () => {
        getCSSVariable('colors-primary-500', 'custom')
        expect(getComputedStyle).toHaveBeenCalled()
      })

      it('应该处理已有--前缀的变量名', () => {
        getCSSVariable('--vjs-colors-primary-500')
        expect(getComputedStyle).toHaveBeenCalled()
      })
    })

    describe('setCSSVariable', () => {
      it('应该设置CSS变量值', () => {
        const setPropertySpy = vi.spyOn(document.documentElement.style, 'setProperty')

        setCSSVariable('colors-primary-500', '#ff0000')

        expect(setPropertySpy).toHaveBeenCalledWith('--vjs-colors-primary-500', '#ff0000')
      })

      it('应该支持数字值', () => {
        const setPropertySpy = vi.spyOn(document.documentElement.style, 'setProperty')

        setCSSVariable('spacing-1', 16)

        expect(setPropertySpy).toHaveBeenCalledWith('--vjs-spacing-1', '16')
      })

      it('应该支持自定义前缀', () => {
        const setPropertySpy = vi.spyOn(document.documentElement.style, 'setProperty')

        setCSSVariable('test', 'value', 'custom')

        expect(setPropertySpy).toHaveBeenCalledWith('--custom-test', 'value')
      })
    })
  })

  describe('非浏览器环境', () => {
    beforeEach(() => {
      delete (global as any).document
      delete (global as any).getComputedStyle
    })

    it('injectCSSVariables应该发出警告', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      injectCSSVariables(mockTokens as Tokens)

      expect(consoleSpy).toHaveBeenCalledWith(
        'injectCSSVariables can only be called in browser environment'
      )

      consoleSpy.mockRestore()
    })

    it('getCSSVariable应该返回空字符串', () => {
      const value = getCSSVariable('test')
      expect(value).toBe('')
    })

    it('setCSSVariable应该不执行', () => {
      // 应该不会抛出错误
      expect(() => {
        setCSSVariable('test', 'value')
      }).not.toThrow()
    })
  })

  describe('边界情况', () => {
    it('应该处理空token对象', () => {
      const vars = generateCSSVariables({} as Tokens)
      expect(Object.keys(vars).length).toBe(0)
    })

    it('应该处理特殊字符', () => {
      const tokens = {
        spacing: {
          '0': '0',
          '0.5': '2px',
        },
      } as any

      const vars = generateCSSVariables(tokens)
      expect(vars).toHaveProperty('--vjs-spacing-0', '0')
      expect(vars).toHaveProperty('--vjs-spacing-0.5', '2px')
    })

    it('应该处理数字类型的值', () => {
      const tokens = {
        zIndex: {
          '0': 0,
          '10': 10,
        },
      } as any

      const vars = generateCSSVariables(tokens)
      expect(vars).toHaveProperty('--vjs-zIndex-0', 0)
      expect(vars).toHaveProperty('--vjs-zIndex-10', 10)
    })
  })
})
