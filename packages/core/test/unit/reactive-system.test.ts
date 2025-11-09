/**
 * 响应式系统综合测试（完整版）
 */

import { describe, it, expect, vi } from 'vitest'
import {
  reactive,
  isReactive,
  toRaw,
  effect,
  ref,
  isRef,
  unref,
  computed,
  isComputed,
  watch,
  watchEffect
} from '../../src/reactive'

describe('响应式系统（完整版）', () => {
  describe('reactive()', () => {
    it('应该创建响应式对象', () => {
      const obj = reactive({ count: 0 })
      expect(isReactive(obj)).toBe(true)
    })

    it('应该支持深度响应式', () => {
      const obj = reactive({
        nested: { count: 0 }
      })

      let dummy
      effect(() => {
        dummy = obj.nested.count
      })

      expect(dummy).toBe(0)
      obj.nested.count = 1
      expect(dummy).toBe(1)
    })

    it('应该支持数组', () => {
      const arr = reactive([1, 2, 3])
      let sum = 0

      effect(() => {
        sum = arr.reduce((a, b) => a + b, 0)
      })

      expect(sum).toBe(6)
      arr.push(4)
      expect(sum).toBe(10)
    })

    it('应该返回原始对象', () => {
      const obj = { count: 0 }
      const observed = reactive(obj)
      expect(toRaw(observed)).toBe(obj)
    })
  })

  describe('effect()', () => {
    it('应该自动执行', () => {
      const obj = reactive({ count: 0 })
      let dummy

      effect(() => {
        dummy = obj.count
      })

      expect(dummy).toBe(0)
    })

    it('应该在依赖变化时重新执行', () => {
      const obj = reactive({ count: 0 })
      let dummy

      effect(() => {
        dummy = obj.count
      })

      expect(dummy).toBe(0)
      obj.count = 1
      expect(dummy).toBe(1)
    })

    it('应该支持嵌套effect', () => {
      const obj = reactive({ a: 0, b: 0 })
      let dummy1, dummy2

      effect(() => {
        dummy1 = obj.a
        effect(() => {
          dummy2 = obj.b
        })
      })

      expect(dummy1).toBe(0)
      expect(dummy2).toBe(0)

      obj.a = 1
      expect(dummy1).toBe(1)

      obj.b = 1
      expect(dummy2).toBe(1)
    })

    it('应该支持lazy选项', () => {
      const obj = reactive({ count: 0 })
      let dummy

      const runner = effect(
        () => {
          dummy = obj.count
        },
        { lazy: true }
      )

      expect(dummy).toBeUndefined()
      runner()
      expect(dummy).toBe(0)
    })
  })

  describe('ref()', () => {
    it('应该创建ref', () => {
      const count = ref(0)
      expect(isRef(count)).toBe(true)
      expect(count.value).toBe(0)
    })

    it('应该响应式更新', () => {
      const count = ref(0)
      let dummy

      effect(() => {
        dummy = count.value
      })

      expect(dummy).toBe(0)
      count.value = 1
      expect(dummy).toBe(1)
    })

    it('应该支持对象ref', () => {
      const obj = ref({ count: 0 })
      let dummy

      effect(() => {
        dummy = obj.value.count
      })

      expect(dummy).toBe(0)
      obj.value.count = 1
      expect(dummy).toBe(1)
    })

    it('unref应该解包ref', () => {
      const count = ref(0)
      expect(unref(count)).toBe(0)
      expect(unref(1)).toBe(1)
    })
  })

  describe('computed()', () => {
    it('应该创建计算属性', () => {
      const count = ref(0)
      const double = computed(() => count.value * 2)

      expect(isComputed(double)).toBe(true)
      expect(double.value).toBe(0)
    })

    it('应该懒计算', () => {
      const count = ref(0)
      const getter = vi.fn(() => count.value * 2)
      const double = computed(getter)

      expect(getter).not.toHaveBeenCalled()
      expect(double.value).toBe(0)
      expect(getter).toHaveBeenCalledTimes(1)
    })

    it('应该缓存值', () => {
      const count = ref(0)
      const getter = vi.fn(() => count.value * 2)
      const double = computed(getter)

      expect(double.value).toBe(0)
      expect(double.value).toBe(0)
      expect(getter).toHaveBeenCalledTimes(1)

      count.value = 1
      expect(double.value).toBe(2)
      expect(getter).toHaveBeenCalledTimes(2)
    })

    it('应该支持可写computed', () => {
      const firstName = ref('Zhang')
      const lastName = ref('San')

      const fullName = computed({
        get() {
          return `${firstName.value} ${lastName.value}`
        },
        set(value) {
          const parts = value.split(' ')
          firstName.value = parts[0]
          lastName.value = parts[1]
        }
      })

      expect(fullName.value).toBe('Zhang San')

      fullName.value = 'Li Si'
      expect(firstName.value).toBe('Li')
      expect(lastName.value).toBe('Si')
    })
  })

  describe('watch()', () => {
    it('应该监听ref', () => {
      const count = ref(0)
      const callback = vi.fn()

      watch(count, callback)

      count.value = 1
      return new Promise(resolve => {
        setTimeout(() => {
          expect(callback).toHaveBeenCalledWith(1, 0, expect.any(Function))
          resolve(undefined)
        }, 0)
      })
    })

    it('应该监听getter', () => {
      const state = reactive({ count: 0 })
      const callback = vi.fn()

      watch(() => state.count, callback)

      state.count = 1
      return new Promise(resolve => {
        setTimeout(() => {
          expect(callback).toHaveBeenCalledWith(1, 0, expect.any(Function))
          resolve(undefined)
        }, 0)
      })
    })

    it('应该支持immediate选项', () => {
      const count = ref(0)
      const callback = vi.fn()

      watch(count, callback, { immediate: true })

      expect(callback).toHaveBeenCalledWith(0, undefined, expect.any(Function))
    })

    it('应该支持deep选项', () => {
      const state = reactive({ nested: { count: 0 } })
      const callback = vi.fn()

      watch(() => state.nested, callback, { deep: true })

      state.nested.count = 1
      return new Promise(resolve => {
        setTimeout(() => {
          expect(callback).toHaveBeenCalled()
          resolve(undefined)
        }, 0)
      })
    })

    it('应该返回停止函数', () => {
      const count = ref(0)
      const callback = vi.fn()

      const stop = watch(count, callback)

      count.value = 1
      stop()
      count.value = 2

      return new Promise(resolve => {
        setTimeout(() => {
          expect(callback).toHaveBeenCalledTimes(1)
          resolve(undefined)
        }, 0)
      })
    })
  })

  describe('watchEffect()', () => {
    it('应该立即执行', () => {
      const count = ref(0)
      const callback = vi.fn()

      watchEffect(() => {
        callback(count.value)
      })

      expect(callback).toHaveBeenCalledWith(0)
    })

    it('应该在依赖变化时重新执行', () => {
      const count = ref(0)
      const callback = vi.fn()

      watchEffect(() => {
        callback(count.value)
      })

      expect(callback).toHaveBeenCalledTimes(1)

      count.value = 1

      return new Promise(resolve => {
        setTimeout(() => {
          expect(callback).toHaveBeenCalledTimes(2)
          expect(callback).toHaveBeenCalledWith(1)
          resolve(undefined)
        }, 0)
      })
    })
  })

  describe('集成测试', () => {
    it('应该支持复杂的响应式场景', () => {
      const state = reactive({
        count: 0,
        user: {
          name: 'VJS',
          age: 18
        }
      })

      const count2x = computed(() => state.count * 2)
      const count4x = computed(() => count2x.value * 2)

      let dummy1, dummy2
      effect(() => {
        dummy1 = count2x.value
        dummy2 = count4x.value
      })

      expect(dummy1).toBe(0)
      expect(dummy2).toBe(0)

      state.count = 1
      expect(dummy1).toBe(2)
      expect(dummy2).toBe(4)
    })
  })
})
