import { describe, it, expect, vi } from 'vitest'
import { reactive, isReactive, toRaw } from '../src/reactive/reactive'
import { effect } from '../src/reactive/effect'

describe('reactive', () => {
  describe('reactive()', () => {
    it('应该创建响应式对象', () => {
      const original = { count: 0 }
      const observed = reactive(original)

      expect(observed).not.toBe(original)
      expect(observed.count).toBe(0)
    })

    it('应该使嵌套对象也变成响应式', () => {
      const original = {
        nested: {
          count: 0
        }
      }
      const observed = reactive(original)

      expect(isReactive(observed.nested)).toBe(true)
    })

    it('应该保持响应式对象的引用', () => {
      const original = { count: 0 }
      const observed1 = reactive(original)
      const observed2 = reactive(original)

      expect(observed1).toBe(observed2)
    })

    it('对于非对象应该发出警告并返回原值', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const num = reactive(123 as any)
      const str = reactive('test' as any)
      const bool = reactive(true as any)

      expect(num).toBe(123)
      expect(str).toBe('test')
      expect(bool).toBe(true)
      expect(consoleSpy).toHaveBeenCalledTimes(3)

      consoleSpy.mockRestore()
    })

    it('应该正确处理数组', () => {
      const original = [1, 2, 3]
      const observed = reactive(original)

      expect(isReactive(observed)).toBe(true)
      expect(observed.length).toBe(3)
      expect(observed[0]).toBe(1)
    })
  })

  describe('响应式更新', () => {
    it('应该在属性变化时触发effect', () => {
      const obj = reactive({ count: 0 })
      let dummy: number

      effect(() => {
        dummy = obj.count
      })

      expect(dummy!).toBe(0)
      obj.count++
      expect(dummy!).toBe(1)
    })

    it('应该在嵌套对象变化时触发effect', () => {
      const obj = reactive({
        nested: { count: 0 }
      })
      let dummy: number

      effect(() => {
        dummy = obj.nested.count
      })

      expect(dummy!).toBe(0)
      obj.nested.count++
      expect(dummy!).toBe(1)
    })

    it('应该处理多个effect', () => {
      const obj = reactive({ count: 0 })
      let dummy1: number, dummy2: number

      effect(() => {
        dummy1 = obj.count
      })

      effect(() => {
        dummy2 = obj.count * 2
      })

      expect(dummy1!).toBe(0)
      expect(dummy2!).toBe(0)

      obj.count++

      expect(dummy1!).toBe(1)
      expect(dummy2!).toBe(2)
    })

    it('应该在删除属性时触发effect', () => {
      const obj = reactive({ count: 0, name: 'test' })
      let dummy: any

      effect(() => {
        dummy = obj.name
      })

      expect(dummy).toBe('test')
      delete obj.name
      expect(dummy).toBe(undefined)
    })
  })

  describe('isReactive()', () => {
    it('应该正确判断响应式对象', () => {
      const original = { count: 0 }
      const observed = reactive(original)

      expect(isReactive(observed)).toBe(true)
      expect(isReactive(original)).toBe(false)
    })

    it('对于非响应式对象应该返回false', () => {
      expect(isReactive({})).toBe(false)
      expect(isReactive(123)).toBe(false)
      expect(isReactive('test')).toBe(false)
      expect(isReactive(null)).toBe(false)
      expect(isReactive(undefined)).toBe(false)
    })
  })

  describe('toRaw()', () => {
    it('应该返回原始对象', () => {
      const original = { count: 0 }
      const observed = reactive(original)

      expect(toRaw(observed)).toBe(original)
    })

    it('对于非响应式对象应该返回自身', () => {
      const obj = { count: 0 }
      expect(toRaw(obj)).toBe(obj)
    })

    it('应该处理嵌套的响应式对象', () => {
      const original = { nested: { count: 0 } }
      const observed = reactive(original)

      expect(toRaw(observed)).toBe(original)
      expect(toRaw(observed.nested)).toBe(original.nested)
    })
  })

  describe('边界情况', () => {
    it('应该避免无限递归', () => {
      const obj: any = reactive({ count: 0 })
      obj.self = obj

      let dummy: number
      effect(() => {
        dummy = obj.count
      })

      expect(dummy!).toBe(0)
      obj.count++
      expect(dummy!).toBe(1)
    })

    it('应该处理Symbol作为key', () => {
      const key = Symbol('test')
      const obj = reactive({ [key]: 'value' })
      let dummy: any

      effect(() => {
        dummy = obj[key]
      })

      expect(dummy).toBe('value')
      obj[key] = 'new value'
      expect(dummy).toBe('new value')
    })

    it('应该处理原型链上的属性', () => {
      const proto = { inherited: 'value' }
      const obj = reactive(Object.create(proto))
      let dummy: any

      effect(() => {
        dummy = obj.inherited
      })

      expect(dummy).toBe('value')
    })
  })
})
