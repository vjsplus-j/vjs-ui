/**
 * VJS-UI computed() - 计算属性（完整版）
 * 
 * 功能：
 * - 懒计算（首次访问时才计算）
 * - 缓存机制（值不变时不重新计算）
 * - 可写计算属性
 * - 嵌套computed支持
 */

import { effect, ReactiveEffect } from './effect'
import { track, trigger } from './effect'
import type { Ref } from './ref'

const IS_REF = Symbol('isRef')

/**
 * Computed Ref接口
 */
export interface ComputedRef<T> extends Ref<T> {
  readonly value: T
}

/**
 * 可写Computed Ref接口
 */
export interface WritableComputedRef<T> extends Ref<T> {
  value: T
}

/**
 * Computed选项
 */
export interface ComputedOptions<T> {
  get: () => T
  set?: (value: T) => void
}

class ComputedRefImpl<T> {
  private _value!: T
  private _dirty = true
  public effect: ReactiveEffect
  public readonly [IS_REF] = true

  constructor(
    getter: () => T,
    private readonly _setter?: (value: T) => void
  ) {
    // 创建effect，设置lazy和scheduler
    this.effect = effect(getter, {
      lazy: true,
      scheduler: () => {
        // 值变化时标记为dirty
        if (!this._dirty) {
          this._dirty = true
          // 触发依赖这个computed的effect
          trigger(this, 'value')
        }
      },
    }) as ReactiveEffect
  }

  get value(): T {
    // 依赖收集
    track(this, 'value')

    // 如果dirty，重新计算
    if (this._dirty) {
      this._value = this.effect() as T
      this._dirty = false
    }

    return this._value
  }

  set value(newValue: T) {
    if (this._setter) {
      this._setter(newValue)
    } else {
      console.warn('Computed property is readonly')
    }
  }
}

/**
 * 创建计算属性（只读）
 * 
 * @example
 * ```typescript
 * const count = ref(0)
 * const double = computed(() => count.value * 2)
 * 
 * console.log(double.value) // 0
 * count.value = 1
 * console.log(double.value) // 2
 * ```
 */
export function computed<T>(getter: () => T): ComputedRef<T>

/**
 * 创建计算属性（可写）
 * 
 * @example
 * ```typescript
 * const firstName = ref('Zhang')
 * const lastName = ref('San')
 * 
 * const fullName = computed({
 *   get() {
 *     return `${firstName.value} ${lastName.value}`
 *   },
 *   set(value) {
 *     const parts = value.split(' ')
 *     firstName.value = parts[0]
 *     lastName.value = parts[1]
 *   }
 * })
 * 
 * console.log(fullName.value) // Zhang San
 * fullName.value = 'Li Si'
 * console.log(firstName.value) // Li
 * ```
 */
export function computed<T>(options: ComputedOptions<T>): WritableComputedRef<T>

export function computed<T>(
  getterOrOptions: (() => T) | ComputedOptions<T>
): ComputedRef<T> | WritableComputedRef<T> {
  let getter: () => T
  let setter: ((value: T) => void) | undefined

  // 处理参数
  if (typeof getterOrOptions === 'function') {
    getter = getterOrOptions
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  return new ComputedRefImpl(getter, setter) as any
}

/**
 * 判断是否为Computed Ref
 */
export function isComputed<T>(value: any): value is ComputedRef<T> {
  return !!(value && value.effect)
}
