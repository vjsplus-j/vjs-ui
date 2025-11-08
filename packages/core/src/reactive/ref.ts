/**
 * 响应式系统 - ref()
 * 响应式引用，用于基本类型
 */

import { track, trigger } from './effect'
import { reactive, isReactive, toRaw } from './reactive'

const IS_REF = Symbol('isRef')

export interface Ref<T = any> {
  value: T
  [IS_REF]: true
}

class RefImpl<T> {
  private _value: T
  private _rawValue: T
  public readonly [IS_REF] = true

  constructor(value: T) {
    this._rawValue = toRaw(value)
    this._value = convert(value)
  }

  get value() {
    // 依赖收集
    track(this, 'value')
    return this._value
  }

  set value(newValue) {
    newValue = toRaw(newValue)

    if (newValue !== this._rawValue) {
      this._rawValue = newValue
      this._value = convert(newValue)
      // 触发更新
      trigger(this, 'value')
    }
  }
}

/**
 * 转换值：对象转reactive，基本类型保持不变
 */
function convert<T>(value: T): T {
  return isObject(value) ? reactive(value) : value
}

function isObject(val: unknown): val is Record<any, any> {
  return val !== null && typeof val === 'object'
}

/**
 * 创建ref
 */
export function ref<T>(value: T): Ref<T> {
  return new RefImpl(value) as any
}

/**
 * 判断是否为ref
 */
export function isRef<T>(r: Ref<T> | unknown): r is Ref<T> {
  return !!(r && (r as any)[IS_REF])
}

/**
 * 解包ref
 */
export function unref<T>(ref: T | Ref<T>): T {
  return isRef(ref) ? ref.value : ref
}

/**
 * 创建一个ref，自动解包其他ref
 */
export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K
): Ref<T[K]> {
  const val = object[key]
  return isRef(val) ? (val as any) : (ref(object[key]) as any)
}

/**
 * 将响应式对象的所有属性转换为ref
 */
export function toRefs<T extends object>(
  object: T
): { [K in keyof T]: Ref<T[K]> } {
  if (!isReactive(object)) {
    console.warn('toRefs() expects a reactive object')
  }

  const result: any = {}

  for (const key in object) {
    result[key] = toRef(object, key)
  }

  return result
}

/**
 * computed - 计算属性
 */
export interface ComputedRef<T> extends Ref<T> {
  readonly value: T
}

export function computed<T>(getter: () => T): ComputedRef<T> {
  let value: T
  let dirty = true

  const computedRef: any = {
    get value() {
      if (dirty) {
        value = getter()
        dirty = false
      }
      track(computedRef, 'value')
      return value
    },
    [IS_REF]: true,
  }

  // 创建effect来追踪依赖
  const runner = () => getter()
  runner()

  return computedRef as ComputedRef<T>
}
