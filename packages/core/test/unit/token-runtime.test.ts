/**
 * TokenRuntime完整版测试
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { TokenRuntime, createTokenRuntime } from '../../src/token/runtime'
import type { FlatTokenMap, TokenChangeEvent } from '../../src/types/token'

describe('TokenRuntime (完整版)', () => {
  let runtime: TokenRuntime
  let testElement: HTMLElement

  beforeEach(() => {
    testElement = document.createElement('div')
    document.body.appendChild(testElement)
    runtime = new TokenRuntime({ target: testElement, enableTransition: false })
  })

  afterEach(() => {
    runtime.destroy()
    document.body.removeChild(testElement)
  })

  describe('apply()', () => {
    it('应该应用Token到DOM元素', () => {
      const tokens: FlatTokenMap = {
        'color.primary': '#1677ff',
        'spacing.md': '16px'
      }

      runtime.apply(tokens)

      const style = getComputedStyle(testElement)
      expect(style.getPropertyValue('--vjs-color-primary')).toBe('#1677ff')
      expect(style.getPropertyValue('--vjs-spacing-md')).toBe('16px')
    })

    it('应该触发变化事件', () => {
      const listener = vi.fn()
      runtime.onChange(listener)

      runtime.apply({ 'color.primary': '#1677ff' })
      runtime.apply({ 'color.primary': '#ff0000' })

      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'color.primary',
          oldValue: '#1677ff',
          newValue: '#ff0000'
        })
      )
    })
  })

  describe('get()', () => {
    it('应该获取Token值', () => {
      const tokens: FlatTokenMap = {
        'color.primary': '#1677ff'
      }

      runtime.apply(tokens)

      const value = runtime.get('color.primary')
      expect(value).toBe('#1677ff')
    })

    it('应该在Token不存在时返回null', () => {
      const value = runtime.get('non.existent')
      expect(value).toBe(null)
    })
  })

  describe('set()', () => {
    it('应该设置单个Token值', () => {
      runtime.set('color.primary', '#1677ff')

      const value = runtime.get('color.primary')
      expect(value).toBe('#1677ff')
    })

    it('应该触发变化事件', () => {
      const listener = vi.fn()
      runtime.onChange(listener)

      runtime.set('color.primary', '#1677ff')
      runtime.set('color.primary', '#ff0000')

      expect(listener).toHaveBeenCalledTimes(1)
    })
  })

  describe('setMany()', () => {
    it('应该批量设置Token值', () => {
      const tokens: FlatTokenMap = {
        'color.primary': '#1677ff',
        'color.success': '#52c41a'
      }

      runtime.setMany(tokens)

      expect(runtime.get('color.primary')).toBe('#1677ff')
      expect(runtime.get('color.success')).toBe('#52c41a')
    })
  })

  describe('remove()', () => {
    it('应该移除单个Token', () => {
      runtime.set('color.primary', '#1677ff')
      expect(runtime.get('color.primary')).toBe('#1677ff')

      runtime.remove('color.primary')
      expect(runtime.get('color.primary')).toBe(null)
    })

    it('应该批量移除Token', () => {
      runtime.setMany({
        'color.primary': '#1677ff',
        'color.success': '#52c41a'
      })

      runtime.remove(['color.primary', 'color.success'])

      expect(runtime.get('color.primary')).toBe(null)
      expect(runtime.get('color.success')).toBe(null)
    })
  })

  describe('clear()', () => {
    it('应该清除所有Token', () => {
      runtime.setMany({
        'color.primary': '#1677ff',
        'color.success': '#52c41a',
        'spacing.md': '16px'
      })

      runtime.clear()

      expect(runtime.get('color.primary')).toBe(null)
      expect(runtime.get('color.success')).toBe(null)
      expect(runtime.get('spacing.md')).toBe(null)
    })
  })

  describe('getAll()', () => {
    it('应该获取所有Token', () => {
      const tokens: FlatTokenMap = {
        'color.primary': '#1677ff',
        'spacing.md': '16px'
      }

      runtime.apply(tokens)

      const all = runtime.getAll()
      expect(all).toEqual(tokens)
    })

    it('应该返回副本而不是引用', () => {
      runtime.set('color.primary', '#1677ff')

      const all1 = runtime.getAll()
      const all2 = runtime.getAll()

      expect(all1).not.toBe(all2)
      expect(all1).toEqual(all2)
    })
  })

  describe('onChange()', () => {
    it('应该监听Token变化', () => {
      const listener = vi.fn()
      runtime.onChange(listener)

      runtime.set('color.primary', '#1677ff')
      runtime.set('color.primary', '#ff0000')

      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('应该返回取消监听函数', () => {
      const listener = vi.fn()
      const unsubscribe = runtime.onChange(listener)

      runtime.set('color.primary', '#1677ff')
      expect(listener).toHaveBeenCalledTimes(0)

      runtime.set('color.primary', '#ff0000')
      expect(listener).toHaveBeenCalledTimes(1)

      unsubscribe()

      runtime.set('color.primary', '#00ff00')
      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('应该支持多个监听器', () => {
      const listener1 = vi.fn()
      const listener2 = vi.fn()

      runtime.onChange(listener1)
      runtime.onChange(listener2)

      runtime.set('color.primary', '#1677ff')
      runtime.set('color.primary', '#ff0000')

      expect(listener1).toHaveBeenCalledTimes(1)
      expect(listener2).toHaveBeenCalledTimes(1)
    })
  })

  describe('destroy()', () => {
    it('应该清理所有资源', () => {
      const listener = vi.fn()
      runtime.onChange(listener)

      runtime.setMany({
        'color.primary': '#1677ff',
        'spacing.md': '16px'
      })

      runtime.destroy()

      // 所有Token应该被清除
      expect(runtime.get('color.primary')).toBe(null)
      expect(runtime.get('spacing.md')).toBe(null)

      // 监听器应该被移除
      runtime.set('color.primary', '#ff0000')
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('配置选项', () => {
    it('应该支持自定义前缀', () => {
      const customRuntime = new TokenRuntime({
        prefix: 'custom',
        target: testElement,
        enableTransition: false
      })

      customRuntime.set('color', 'blue')

      const style = getComputedStyle(testElement)
      expect(style.getPropertyValue('--custom-color')).toBe('blue')

      customRuntime.destroy()
    })
  })
})

describe('createTokenRuntime()', () => {
  it('应该创建TokenRuntime实例', () => {
    const runtime = createTokenRuntime()
    expect(runtime).toBeInstanceOf(TokenRuntime)
    runtime.destroy()
  })

  it('应该接受配置选项', () => {
    const testElement = document.createElement('div')
    document.body.appendChild(testElement)

    const runtime = createTokenRuntime({
      prefix: 'test',
      target: testElement,
      enableTransition: false
    })

    runtime.set('color', 'red')

    const style = getComputedStyle(testElement)
    expect(style.getPropertyValue('--test-color')).toBe('red')

    runtime.destroy()
    document.body.removeChild(testElement)
  })
})
