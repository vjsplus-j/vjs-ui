/**
 * Token系统单元测试
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { SimpleTokenCompiler, createTokenCompiler } from '../../src/token/simple-token'
import type { SimpleToken } from '../../src/types/token'

describe('SimpleTokenCompiler', () => {
  let compiler: SimpleTokenCompiler
  let testElement: HTMLElement

  beforeEach(() => {
    compiler = new SimpleTokenCompiler({ pretty: true })
    testElement = document.createElement('div')
    document.body.appendChild(testElement)
  })

  afterEach(() => {
    document.body.removeChild(testElement)
  })

  describe('compile()', () => {
    it('应该将Token编译成CSS Variables', () => {
      const tokens: SimpleToken = {
        'color-primary': '#1677ff',
        'spacing-md': '16px'
      }

      const css = compiler.compile(tokens)

      expect(css).toContain('--vjs-color-primary: #1677ff;')
      expect(css).toContain('--vjs-spacing-md: 16px;')
      expect(css).toContain(':root {')
      expect(css).toContain('}')
    })

    it('应该处理点号分隔的key', () => {
      const tokens: SimpleToken = {
        'color.primary': '#1677ff',
        'font.size.base': '14px'
      }

      const css = compiler.compile(tokens)

      expect(css).toContain('--vjs-color-primary: #1677ff;')
      expect(css).toContain('--vjs-font-size-base: 14px;')
    })

    it('应该处理数字值', () => {
      const tokens: SimpleToken = {
        'z-index': 1000,
        'opacity': 0.8
      }

      const css = compiler.compile(tokens)

      expect(css).toContain('--vjs-z-index: 1000;')
      expect(css).toContain('--vjs-opacity: 0.8;')
    })

    it('应该支持pretty选项', () => {
      const prettyCompiler = new SimpleTokenCompiler({ pretty: true })
      const uglyCompiler = new SimpleTokenCompiler({ pretty: false })

      const tokens: SimpleToken = { 'color': 'red' }

      const prettyCss = prettyCompiler.compile(tokens)
      const uglyCss = uglyCompiler.compile(tokens)

      expect(prettyCss).toContain('\n')
      expect(prettyCss).toContain('  ')
      expect(uglyCss).not.toContain('\n  ')
    })

    it('应该支持自定义前缀', () => {
      const customCompiler = new SimpleTokenCompiler({ prefix: 'custom' })
      const tokens: SimpleToken = { 'color': 'blue' }

      const css = customCompiler.compile(tokens)

      expect(css).toContain('--custom-color:blue;')
    })
  })

  describe('apply()', () => {
    it('应该将Token应用到DOM元素', () => {
      const tokens: SimpleToken = {
        'color-primary': '#1677ff',
        'spacing-md': '16px'
      }

      compiler.apply(tokens, testElement)

      const style = getComputedStyle(testElement)
      expect(style.getPropertyValue('--vjs-color-primary')).toBe('#1677ff')
      expect(style.getPropertyValue('--vjs-spacing-md')).toBe('16px')
    })

    it('应该在未指定元素时应用到body', () => {
      const tokens: SimpleToken = {
        'test-token': 'value'
      }

      compiler.apply(tokens)

      const style = getComputedStyle(document.body)
      expect(style.getPropertyValue('--vjs-test-token')).toBe('value')

      // 清理
      compiler.remove(tokens)
    })
  })

  describe('remove()', () => {
    it('应该移除Token', () => {
      const tokens: SimpleToken = {
        'color-primary': '#1677ff'
      }

      compiler.apply(tokens, testElement)
      expect(testElement.style.getPropertyValue('--vjs-color-primary')).toBe('#1677ff')

      compiler.remove(tokens, testElement)
      expect(testElement.style.getPropertyValue('--vjs-color-primary')).toBe('')
    })
  })

  describe('get()', () => {
    it('应该获取Token值', () => {
      const tokens: SimpleToken = {
        'color-primary': '#1677ff'
      }

      compiler.apply(tokens, testElement)

      const value = compiler.get('color-primary', testElement)
      expect(value).toBe('#1677ff')
    })

    it('应该在Token不存在时返回null', () => {
      const value = compiler.get('non-existent', testElement)
      expect(value).toBe(null)
    })
  })
})

describe('createTokenCompiler()', () => {
  it('应该创建Token编译器实例', () => {
    const compiler = createTokenCompiler()
    expect(compiler).toBeInstanceOf(SimpleTokenCompiler)
  })

  it('应该接受配置选项', () => {
    const compiler = createTokenCompiler({ prefix: 'test', pretty: true })
    const tokens: SimpleToken = { 'color': 'red' }
    const css = compiler.compile(tokens)

    expect(css).toContain('--test-color: red;')
    expect(css).toContain('\n')
  })
})
