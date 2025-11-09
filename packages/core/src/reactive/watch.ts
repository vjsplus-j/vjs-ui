/**
 * VJS-UI watch() - 监听器（完整版）
 * 
 * 功能：
 * - 监听响应式数据变化
 * - deep选项（深度监听）
 * - immediate选项（立即执行）
 * - cleanup函数支持
 * - 手动停止支持
 */

import { effect, ReactiveEffect } from './effect'
import { isRef } from './ref'
import { isReactive } from './reactive'

/**
 * Watch选项
 */
export interface WatchOptions {
  /**
   * 立即执行
   * @default false
   */
  immediate?: boolean
  
  /**
   * 深度监听
   * @default false
   */
  deep?: boolean
  
  /**
   * 刷新时机
   * @default 'post'
   */
  flush?: 'pre' | 'post' | 'sync'
}

/**
 * Watch回调函数
 */
export type WatchCallback<V = any, OV = any> = (
  value: V,
  oldValue: OV,
  onCleanup: (cleanupFn: () => void) => void
) => void

/**
 * Watch停止函数
 */
export type WatchStopHandle = () => void

/**
 * Cleanup函数
 */
let cleanup: (() => void) | undefined

/**
 * 注册cleanup函数
 */
function onCleanup(fn: () => void) {
  cleanup = fn
}

/**
 * 监听单个源
 * 
 * @example
 * ```typescript
 * const count = ref(0)
 * 
 * watch(
 *   () => count.value,
 *   (newValue, oldValue) => {
 *     console.log(`count: ${oldValue} → ${newValue}`)
 *   }
 * )
 * 
 * count.value++ // 输出: count: 0 → 1
 * ```
 */
export function watch<T>(
  source: () => T,
  cb: WatchCallback<T, T | undefined>,
  options?: WatchOptions
): WatchStopHandle

/**
 * 监听ref
 * 
 * @example
 * ```typescript
 * const count = ref(0)
 * 
 * watch(count, (newValue, oldValue) => {
 *   console.log(`count: ${oldValue} → ${newValue}`)
 * })
 * ```
 */
export function watch<T>(
  source: { value: T },
  cb: WatchCallback<T, T | undefined>,
  options?: WatchOptions
): WatchStopHandle

/**
 * 监听多个源
 * 
 * @example
 * ```typescript
 * const count = ref(0)
 * const name = ref('VJS')
 * 
 * watch(
 *   [() => count.value, () => name.value],
 *   ([newCount, newName], [oldCount, oldName]) => {
 *     console.log('Values changed')
 *   }
 * )
 * ```
 */
export function watch<T extends readonly unknown[]>(
  sources: readonly [...T],
  cb: WatchCallback<T, (T | undefined)[]>,
  options?: WatchOptions
): WatchStopHandle

export function watch(
  source: any,
  cb: WatchCallback,
  options: WatchOptions = {}
): WatchStopHandle {
  const { immediate, deep, flush = 'post' } = options

  // 获取getter函数
  let getter: () => any
  let forceTrigger = false

  if (isRef(source)) {
    // ref源
    getter = () => source.value
    forceTrigger = false
  } else if (isReactive(source)) {
    // reactive对象源
    getter = () => source
    forceTrigger = true
  } else if (Array.isArray(source)) {
    // 多个源
    getter = () =>
      source.map((s) => {
        if (isRef(s)) {
          return s.value
        } else if (isReactive(s)) {
          return traverse(s)
        } else if (typeof s === 'function') {
          return s()
        }
        return s
      })
    forceTrigger = false
  } else if (typeof source === 'function') {
    // getter函数
    getter = source
    forceTrigger = false
  } else {
    getter = () => {}
    console.warn('Invalid watch source')
  }

  // 如果启用deep，需要遍历对象
  if (deep && !forceTrigger) {
    const baseGetter = getter
    getter = () => traverse(baseGetter())
  }

  let oldValue: any

  // 创建调度器
  const scheduler = (effectFn: ReactiveEffect) => {
    // 执行cleanup
    if (cleanup) {
      cleanup()
      cleanup = undefined
    }

    // 获取新值
    const newValue = effectFn()

    // 调用回调
    cb(newValue, oldValue, onCleanup)

    // 更新旧值
    oldValue = newValue
  }

  const effectFn = effect(getter, {
    lazy: true,
    scheduler: () => {
      if (flush === 'sync') {
        scheduler(effectFn)
      } else {
        // post: 在组件更新后执行
        // pre: 在组件更新前执行
        // 目前简化处理，都使用异步
        Promise.resolve().then(() => scheduler(effectFn))
      }
    },
  }) as ReactiveEffect

  // 立即执行
  if (immediate) {
    scheduler(effectFn)
  } else {
    oldValue = effectFn()
  }

  // 返回停止函数
  return () => {
    // 执行cleanup
    if (cleanup) {
      cleanup()
      cleanup = undefined
    }
    // 停止effect
    if (effectFn.options?.onStop) {
      effectFn.options.onStop()
    }
  }
}

/**
 * 遍历对象的所有属性（用于deep选项）
 */
function traverse(value: unknown, seen = new Set<any>()): unknown {
  if (!isObject(value) || seen.has(value)) {
    return value
  }

  seen.add(value)

  if (isRef(value)) {
    traverse(value.value, seen)
  } else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen)
    }
  } else if (value instanceof Map) {
    value.forEach((v) => {
      traverse(v, seen)
    })
  } else if (value instanceof Set) {
    value.forEach((v) => {
      traverse(v, seen)
    })
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse((value as any)[key], seen)
    }
  }

  return value
}

function isObject(val: unknown): val is Record<any, any> {
  return val !== null && typeof val === 'object'
}

function isPlainObject(val: unknown): val is object {
  return Object.prototype.toString.call(val) === '[object Object]'
}

/**
 * watchEffect - 立即执行的watch
 * 
 * @example
 * ```typescript
 * const count = ref(0)
 * 
 * watchEffect(() => {
 *   console.log(`Count is: ${count.value}`)
 * })
 * // 输出: Count is: 0
 * 
 * count.value++
 * // 输出: Count is: 1
 * ```
 */
export function watchEffect(
  effect: (onCleanup: (fn: () => void) => void) => void,
  options?: Omit<WatchOptions, 'immediate'>
): WatchStopHandle {
  return watch(
    effect as any,
    () => {},
    { ...options, immediate: true }
  )
}
