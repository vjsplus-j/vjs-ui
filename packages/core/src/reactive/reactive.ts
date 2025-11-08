/**
 * 响应式系统 - reactive()
 * 基于Proxy实现的响应式对象
 */

import { track, trigger } from './effect'

// 存储原始对象到响应式对象的映射
const reactiveMap = new WeakMap<object, any>()

// 标记对象是否为响应式
const RAW = Symbol('raw')
const IS_REACTIVE = Symbol('isReactive')

/**
 * 判断是否为对象
 */
function isObject(val: unknown): val is Record<any, any> {
  return val !== null && typeof val === 'object'
}

/**
 * 创建响应式对象
 */
export function reactive<T extends object>(target: T): T {
  // 如果不是对象，直接返回
  if (!isObject(target)) {
    console.warn('reactive() expects an object')
    return target
  }

  // 如果已经是响应式对象，直接返回
  if (isReactive(target)) {
    return target
  }

  // 如果已经创建过响应式对象，返回缓存
  const existingProxy = reactiveMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  // 创建Proxy
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      // 特殊属性处理
      if (key === RAW) {
        return target
      }
      if (key === IS_REACTIVE) {
        return true
      }

      // 依赖收集
      track(target, key)

      const result = Reflect.get(target, key, receiver)

      // 如果属性值是对象，递归创建响应式
      if (isObject(result)) {
        return reactive(result)
      }

      return result
    },

    set(target, key, value, receiver) {
      const oldValue = (target as any)[key]

      // 设置新值
      const result = Reflect.set(target, key, value, receiver)

      // 如果值发生变化，触发更新
      if (oldValue !== value) {
        trigger(target, key)
      }

      return result
    },

    deleteProperty(target, key) {
      const hadKey = Object.prototype.hasOwnProperty.call(target, key)
      const result = Reflect.deleteProperty(target, key)

      if (hadKey && result) {
        trigger(target, key)
      }

      return result
    },
  })

  // 缓存响应式对象
  reactiveMap.set(target, proxy)

  return proxy
}

/**
 * 判断是否为响应式对象
 */
export function isReactive(value: unknown): boolean {
  return !!(value && (value as any)[IS_REACTIVE])
}

/**
 * 获取响应式对象的原始对象
 */
export function toRaw<T>(observed: T): T {
  const raw = observed && (observed as any)[RAW]
  return raw ? toRaw(raw) : observed
}
