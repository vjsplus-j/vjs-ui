/**
 * 类型检查工具
 */

export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'

export const isString = (val: unknown): val is string =>
  typeof val === 'string'

export const isNumber = (val: unknown): val is number =>
  typeof val === 'number'

export const isBoolean = (val: unknown): val is boolean =>
  typeof val === 'boolean'

export const isArray = Array.isArray

export const isPromise = <T = any>(val: unknown): val is Promise<T> =>
  isObject(val) && isFunction((val as any).then) && isFunction((val as any).catch)
