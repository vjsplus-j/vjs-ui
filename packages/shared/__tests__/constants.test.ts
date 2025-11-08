import { describe, it, expect } from 'vitest'
import { COMPONENT_TYPES, EVENT_TYPES, PRIORITY } from '../src/constants'

describe('Constants', () => {
  describe('COMPONENT_TYPES', () => {
    it('应该定义基础组件类型', () => {
      expect(COMPONENT_TYPES.BUTTON).toBe('Button')
      expect(COMPONENT_TYPES.INPUT).toBe('Input')
      expect(COMPONENT_TYPES.CARD).toBe('Card')
    })

    it('组件类型应该是只读的', () => {
      expect(() => {
        // @ts-expect-error - 测试只读属性
        COMPONENT_TYPES.BUTTON = 'NewButton'
      }).toThrow()
    })
  })

  describe('EVENT_TYPES', () => {
    it('应该定义事件类型', () => {
      expect(EVENT_TYPES.CLICK).toBe('click')
      expect(EVENT_TYPES.CHANGE).toBe('change')
      expect(EVENT_TYPES.INPUT).toBe('input')
    })
  })

  describe('PRIORITY', () => {
    it('应该定义优先级常量', () => {
      expect(PRIORITY.IMMEDIATE).toBe(0)
      expect(PRIORITY.HIGH).toBe(1)
      expect(PRIORITY.NORMAL).toBe(2)
      expect(PRIORITY.LOW).toBe(3)
      expect(PRIORITY.IDLE).toBe(4)
    })

    it('优先级应该按顺序递增', () => {
      expect(PRIORITY.IMMEDIATE).toBeLessThan(PRIORITY.HIGH)
      expect(PRIORITY.HIGH).toBeLessThan(PRIORITY.NORMAL)
      expect(PRIORITY.NORMAL).toBeLessThan(PRIORITY.LOW)
      expect(PRIORITY.LOW).toBeLessThan(PRIORITY.IDLE)
    })
  })
})
