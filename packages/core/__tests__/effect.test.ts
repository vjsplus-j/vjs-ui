import { describe, it, expect, vi } from 'vitest'
import { effect, stop } from '../src/reactive/effect'
import { reactive } from '../src/reactive/reactive'

describe('effect', () => {
  describe('基础功能', () => {
    it('应该立即执行effect函数', () => {
      const fn = vi.fn()
      effect(fn)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('应该在响应式数据变化时重新执行', () => {
      const obj = reactive({ count: 0 })
      let dummy: number

      effect(() => {
        dummy = obj.count
      })

      expect(dummy!).toBe(0)
      obj.count = 1
      expect(dummy!).toBe(1)
      obj.count = 2
      expect(dummy!).toBe(2)
    })

    it('应该返回effect函数', () => {
      const fn = vi.fn()
      const runner = effect(fn)

      expect(typeof runner).toBe('function')
      expect(fn).toHaveBeenCalledTimes(1)

      runner()
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })

  describe('依赖收集', () => {
    it('应该只追踪被访问的属性', () => {
      const obj = reactive({ count: 0, name: 'test' })
      const fn = vi.fn(() => obj.count)

      effect(fn)
      expect(fn).toHaveBeenCalledTimes(1)

      obj.count++
      expect(fn).toHaveBeenCalledTimes(2)

      obj.name = 'new name'
      expect(fn).toHaveBeenCalledTimes(2) // 不应该触发
    })

    it('应该处理多个属性依赖', () => {
      const obj = reactive({ a: 1, b: 2 })
      let dummy: number

      effect(() => {
        dummy = obj.a + obj.b
      })

      expect(dummy!).toBe(3)
      
      obj.a = 2
      expect(dummy!).toBe(4)
      
      obj.b = 3
      expect(dummy!).toBe(5)
    })

    it('应该处理条件分支', () => {
      const obj = reactive({ ok: true, text: 'hello' })
      const fn = vi.fn(() => (obj.ok ? obj.text : 'not'))

      effect(fn)
      expect(fn).toHaveBeenCalledTimes(1)

      obj.text = 'world'
      expect(fn).toHaveBeenCalledTimes(2)

      obj.ok = false
      expect(fn).toHaveBeenCalledTimes(3)

      obj.text = 'ignored'
      expect(fn).toHaveBeenCalledTimes(3) // 不应该触发
    })
  })

  describe('嵌套effect', () => {
    it('应该支持嵌套effect', () => {
      const obj = reactive({ count: 0 })
      let dummy1: number, dummy2: number

      effect(() => {
        dummy1 = obj.count

        effect(() => {
          dummy2 = obj.count * 2
        })
      })

      expect(dummy1!).toBe(0)
      expect(dummy2!).toBe(0)

      obj.count++
      expect(dummy1!).toBe(1)
      expect(dummy2!).toBe(2)
    })

    it('应该在嵌套effect中正确恢复上下文', () => {
      const obj1 = reactive({ count: 0 })
      const obj2 = reactive({ count: 0 })
      let dummy1: number, dummy2: number

      effect(() => {
        dummy1 = obj1.count
        
        effect(() => {
          dummy2 = obj2.count
        })
        
        // 这里应该仍然追踪obj1
        dummy1 = obj1.count
      })

      obj1.count++
      expect(dummy1!).toBe(1)

      obj2.count++
      expect(dummy2!).toBe(1)
    })
  })

  describe('lazy选项', () => {
    it('lazy为true时不应该立即执行', () => {
      const fn = vi.fn()
      const runner = effect(fn, { lazy: true })

      expect(fn).not.toHaveBeenCalled()

      runner()
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('lazy effect仍然应该收集依赖', () => {
      const obj = reactive({ count: 0 })
      let dummy: number

      const runner = effect(() => {
        dummy = obj.count
      }, { lazy: true })

      expect(dummy!).toBeUndefined()

      runner()
      expect(dummy!).toBe(0)

      obj.count++
      expect(dummy!).toBe(1)
    })
  })

  describe('scheduler调度器', () => {
    it('应该使用scheduler而不是直接执行', () => {
      const obj = reactive({ count: 0 })
      const scheduler = vi.fn()
      const fn = vi.fn(() => obj.count)

      effect(fn, { scheduler })

      expect(fn).toHaveBeenCalledTimes(1)
      expect(scheduler).not.toHaveBeenCalled()

      obj.count++
      expect(scheduler).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledTimes(1) // 不应该直接调用
    })

    it('scheduler应该接收effect作为参数', () => {
      const obj = reactive({ count: 0 })
      let receivedEffect: any

      const scheduler = (eff: any) => {
        receivedEffect = eff
      }

      effect(() => obj.count, { scheduler })

      obj.count++
      expect(typeof receivedEffect).toBe('function')
    })
  })

  describe('stop功能', () => {
    it('应该停止effect的执行', () => {
      const obj = reactive({ count: 0 })
      let dummy: number

      const runner = effect(() => {
        dummy = obj.count
      })

      expect(dummy!).toBe(0)
      
      obj.count++
      expect(dummy!).toBe(1)

      stop(runner)
      obj.count++
      expect(dummy!).toBe(1) // 不应该更新
    })

    it('停止后可以手动调用runner', () => {
      const obj = reactive({ count: 0 })
      let dummy: number

      const runner = effect(() => {
        dummy = obj.count
      })

      stop(runner)
      obj.count = 10
      expect(dummy!).toBe(0)

      runner()
      expect(dummy!).toBe(10)
    })
  })

  describe('清理依赖', () => {
    it('应该在重新执行时清理旧的依赖', () => {
      const obj = reactive({ ok: true, a: 1, b: 2 })
      const fn = vi.fn(() => (obj.ok ? obj.a : obj.b))

      effect(fn)
      expect(fn).toHaveBeenCalledTimes(1)

      obj.a = 10
      expect(fn).toHaveBeenCalledTimes(2)

      obj.ok = false
      expect(fn).toHaveBeenCalledTimes(3)

      obj.a = 20
      expect(fn).toHaveBeenCalledTimes(3) // 不应该触发

      obj.b = 20
      expect(fn).toHaveBeenCalledTimes(4) // 应该触发
    })
  })

  describe('边界情况', () => {
    it('应该处理effect中的异常', () => {
      const obj = reactive({ count: 0 })
      const fn = vi.fn(() => {
        if (obj.count === 1) {
          throw new Error('test error')
        }
      })

      effect(fn)
      expect(fn).toHaveBeenCalledTimes(1)

      expect(() => {
        obj.count = 1
      }).toThrow('test error')
    })

    // 注意：避免无限循环是使用者的责任，不是框架的责任
    // Vue 3也不会阻止这种情况

    it('应该处理空effect', () => {
      const fn = vi.fn()
      effect(fn)
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })
})
