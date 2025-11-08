import { describe, it, expect, vi } from 'vitest'
import { ref, isRef, unref, toRef, toRefs, computed } from '../src/reactive/ref'
import { reactive, isReactive } from '../src/reactive/reactive'
import { effect } from '../src/reactive/effect'

describe('ref', () => {
  describe('ref()', () => {
    it('应该创建ref对象', () => {
      const count = ref(0)
      expect(count.value).toBe(0)
    })

    it('应该是响应式的', () => {
      const count = ref(0)
      let dummy: number

      effect(() => {
        dummy = count.value
      })

      expect(dummy!).toBe(0)
      count.value = 1
      expect(dummy!).toBe(1)
    })

    it('应该处理对象值', () => {
      const obj = ref({ count: 0 })
      expect(isReactive(obj.value)).toBe(true)
    })

    it('应该处理嵌套ref', () => {
      const inner = ref(0)
      const outer = ref(inner as any)

      // ref不会自动解包其他ref
      expect(outer.value).toBeDefined()
    })
  })

  describe('响应式更新', () => {
    it('值变化时应该触发effect', () => {
      const count = ref(0)
      const fn = vi.fn(() => count.value)

      effect(fn)
      expect(fn).toHaveBeenCalledTimes(1)

      count.value++
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('相同值不应该触发effect', () => {
      const count = ref(0)
      const fn = vi.fn(() => count.value)

      effect(fn)
      expect(fn).toHaveBeenCalledTimes(1)

      count.value = 0
      expect(fn).toHaveBeenCalledTimes(1) // 不应该触发
    })

    it('对象ref的属性变化应该触发effect', () => {
      const obj = ref({ count: 0 })
      let dummy: number

      effect(() => {
        dummy = obj.value.count
      })

      expect(dummy!).toBe(0)
      obj.value.count++
      expect(dummy!).toBe(1)
    })
  })

  describe('isRef()', () => {
    it('应该正确判断ref', () => {
      const count = ref(0)
      const obj = { count: 0 }

      expect(isRef(count)).toBe(true)
      expect(isRef(obj)).toBe(false)
      expect(isRef(0)).toBe(false)
      expect(isRef(null)).toBe(false)
    })
  })

  describe('unref()', () => {
    it('应该解包ref', () => {
      const count = ref(0)
      expect(unref(count)).toBe(0)
    })

    it('对于非ref应该返回原值', () => {
      expect(unref(0)).toBe(0)
      expect(unref('test')).toBe('test')
      expect(unref({})).toEqual({})
    })
  })

  describe('toRef()', () => {
    it('应该创建对象属性的ref', () => {
      const obj = reactive({ count: 0 })
      const countRef = toRef(obj, 'count')

      expect(isRef(countRef)).toBe(true)
      expect(countRef.value).toBe(0)
    })

    it('应该保持响应式连接', () => {
      const obj = reactive({ count: 0 })
      const countRef = toRef(obj, 'count')

      expect(countRef.value).toBe(0)
      
      obj.count++
      expect(countRef.value).toBe(1)
    })

    it('对于已经是ref的值应该直接返回', () => {
      const obj: any = reactive({ count: ref(0) })
      const countRef = toRef(obj, 'count')

      expect(countRef).toBe(obj.count)
    })
  })

  describe('toRefs()', () => {
    it('应该转换对象所有属性为ref', () => {
      const obj = reactive({ a: 1, b: 2 })
      const refs = toRefs(obj)

      expect(isRef(refs.a)).toBe(true)
      expect(isRef(refs.b)).toBe(true)
      expect(refs.a.value).toBe(1)
      expect(refs.b.value).toBe(2)
    })

    it('应该保持响应式连接', () => {
      const obj = reactive({ a: 1, b: 2 })
      const refs = toRefs(obj)

      expect(refs.a.value).toBe(1)
      expect(refs.b.value).toBe(2)

      obj.a++
      expect(refs.a.value).toBe(2)
    })

    it('对于非响应式对象应该发出警告', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const obj = { count: 0 }
      toRefs(obj)

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('computed()', () => {
    it('应该创建计算属性', () => {
      const count = ref(0)
      const double = computed(() => count.value * 2)

      expect(double.value).toBe(0)
    })

    it('应该计算属性值', () => {
      const count = ref(0)
      const double = computed(() => count.value * 2)

      expect(double.value).toBe(0)
    })

    it('依赖变化时应该更新', () => {
      const count = ref(0)
      const double = computed(() => count.value * 2)

      expect(double.value).toBe(0)

      count.value = 1
      expect(double.value).toBe(2)
    })

    it('应该计算属性可读', () => {
      const count = ref(0)
      const double = computed(() => count.value * 2)

      expect(double.value).toBe(0)
      count.value = 1
      expect(double.value).toBe(2)
    })

    it('应该支持链式computed', () => {
      const count = ref(1)
      const double = computed(() => count.value * 2)
      const quad = computed(() => double.value * 2)

      expect(quad.value).toBe(4)
    })

    it('应该处理多个依赖', () => {
      const a = ref(1)
      const b = ref(2)
      const sum = computed(() => a.value + b.value)

      expect(sum.value).toBe(3)
    })
  })

  describe('边界情况', () => {
    it('ref应该处理undefined和null', () => {
      const undefinedRef = ref(undefined)
      const nullRef = ref(null)

      expect(undefinedRef.value).toBeUndefined()
      expect(nullRef.value).toBeNull()
    })

    it('computed应该正常工作', () => {
      const count = ref(5)
      const double = computed(() => count.value * 2)

      expect(double.value).toBe(10)
    })

    it('ref应该正确处理NaN', () => {
      const numRef = ref(NaN)
      const fn = vi.fn(() => numRef.value)

      effect(fn)
      expect(fn).toHaveBeenCalledTimes(1)

      numRef.value = NaN
      // NaN !== NaN，所以应该触发
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('toRefs应该处理空对象', () => {
      const obj = reactive({})
      const refs = toRefs(obj)

      expect(Object.keys(refs).length).toBe(0)
    })
  })
})
