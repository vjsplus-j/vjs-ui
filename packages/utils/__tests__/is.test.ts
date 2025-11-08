import { describe, it, expect } from 'vitest'
import {
  isObject,
  isFunction,
  isString,
  isNumber,
  isBoolean,
  isArray,
  isPromise,
} from '../src/is'

describe('Type Check Utils', () => {
  describe('isObject', () => {
    it('应该正确判断对象', () => {
      expect(isObject({})).toBe(true)
      expect(isObject({ a: 1 })).toBe(true)
      expect(isObject([])).toBe(true) // 数组也是对象
      expect(isObject(new Date())).toBe(true)
    })

    it('应该拒绝非对象类型', () => {
      expect(isObject(null)).toBe(false)
      expect(isObject(undefined)).toBe(false)
      expect(isObject('string')).toBe(false)
      expect(isObject(123)).toBe(false)
      expect(isObject(true)).toBe(false)
    })
  })

  describe('isFunction', () => {
    it('应该正确判断函数', () => {
      expect(isFunction(() => {})).toBe(true)
      expect(isFunction(function() {})).toBe(true)
      expect(isFunction(async () => {})).toBe(true)
      expect(isFunction(class Foo {})).toBe(true)
    })

    it('应该拒绝非函数类型', () => {
      expect(isFunction({})).toBe(false)
      expect(isFunction(null)).toBe(false)
      expect(isFunction('function')).toBe(false)
    })
  })

  describe('isString', () => {
    it('应该正确判断字符串', () => {
      expect(isString('')).toBe(true)
      expect(isString('hello')).toBe(true)
      expect(isString(`template`)).toBe(true)
    })

    it('应该拒绝非字符串类型', () => {
      expect(isString(123)).toBe(false)
      expect(isString(true)).toBe(false)
      expect(isString(null)).toBe(false)
    })
  })

  describe('isNumber', () => {
    it('应该正确判断数字', () => {
      expect(isNumber(0)).toBe(true)
      expect(isNumber(123)).toBe(true)
      expect(isNumber(-456)).toBe(true)
      expect(isNumber(3.14)).toBe(true)
      expect(isNumber(NaN)).toBe(true) // NaN也是number类型
    })

    it('应该拒绝非数字类型', () => {
      expect(isNumber('123')).toBe(false)
      expect(isNumber(true)).toBe(false)
      expect(isNumber(null)).toBe(false)
    })
  })

  describe('isBoolean', () => {
    it('应该正确判断布尔值', () => {
      expect(isBoolean(true)).toBe(true)
      expect(isBoolean(false)).toBe(true)
    })

    it('应该拒绝非布尔值类型', () => {
      expect(isBoolean(1)).toBe(false)
      expect(isBoolean('true')).toBe(false)
      expect(isBoolean(null)).toBe(false)
    })
  })

  describe('isArray', () => {
    it('应该正确判断数组', () => {
      expect(isArray([])).toBe(true)
      expect(isArray([1, 2, 3])).toBe(true)
      expect(isArray(new Array())).toBe(true)
    })

    it('应该拒绝非数组类型', () => {
      expect(isArray({})).toBe(false)
      expect(isArray('array')).toBe(false)
      expect(isArray(null)).toBe(false)
    })
  })

  describe('isPromise', () => {
    it('应该正确判断Promise', () => {
      expect(isPromise(Promise.resolve())).toBe(true)
      expect(isPromise(new Promise(() => {}))).toBe(true)
      expect(isPromise({ then: () => {}, catch: () => {} })).toBe(true)
    })

    it('应该拒绝非Promise类型', () => {
      expect(isPromise({})).toBe(false)
      expect(isPromise({ then: () => {} })).toBe(false) // 只有then没有catch
      expect(isPromise(null)).toBe(false)
    })
  })
})
