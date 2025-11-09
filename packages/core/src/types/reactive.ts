/**
 * VJS-UI 响应式系统类型定义
 * 
 * 完整版：支持深度响应式、computed、watch等高级特性
 */

/**
 * 响应式Effect类型
 */
export type ReactiveEffect = {
  (): void
  _isEffect: true
  id: number
  active: boolean
  raw: () => void
  deps: Dep[]
  options: EffectOptions
}

/**
 * 依赖集合
 */
export type Dep = Set<ReactiveEffect>

/**
 * 依赖映射（key -> Dep）
 */
export type KeyToDepMap = Map<any, Dep>

/**
 * Effect选项
 */
export interface EffectOptions {
  /**
   * 是否懒执行
   * @default false
   */
  lazy?: boolean
  
  /**
   * 自定义调度器
   */
  scheduler?: (effect: ReactiveEffect) => void
  
  /**
   * 依赖追踪回调（调试用）
   */
  onTrack?: (event: DebuggerEvent) => void
  
  /**
   * 触发更新回调（调试用）
   */
  onTrigger?: (event: DebuggerEvent) => void
  
  /**
   * 停止回调
   */
  onStop?: () => void
}

/**
 * Computed Ref类型
 */
export interface ComputedRef<T = any> {
  readonly value: T
  readonly effect: ReactiveEffect
  [ComputedRefSymbol]: true
}

/**
 * 可写Computed Ref类型
 */
export interface WritableComputedRef<T = any> extends ComputedRef<T> {
  value: T
}

/**
 * Computed选项
 */
export interface ComputedOptions<T> {
  get: () => T
  set?: (value: T) => void
}

/**
 * Ref类型
 */
export interface Ref<T = any> {
  value: T
  [RefSymbol]: true
}

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
  
  /**
   * 依赖追踪回调（调试用）
   */
  onTrack?: (event: DebuggerEvent) => void
  
  /**
   * 触发更新回调（调试用）
   */
  onTrigger?: (event: DebuggerEvent) => void
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
 * 调试事件类型
 */
export type DebuggerEventType = 'get' | 'set' | 'add' | 'delete' | 'clear' | 'iterate'

/**
 * 调试事件
 */
export interface DebuggerEvent {
  effect: ReactiveEffect
  target: object
  type: DebuggerEventType
  key?: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}

/**
 * Ref Symbol
 */
export const RefSymbol = Symbol('__v_isRef')

/**
 * Computed Ref Symbol
 */
export const ComputedRefSymbol = Symbol('__v_isComputedRef')

/**
 * 响应式标记Symbol
 */
export const ReactiveSymbol = Symbol('__v_isReactive')

/**
 * 只读标记Symbol
 */
export const ReadonlySymbol = Symbol('__v_isReadonly')

/**
 * 原始值Symbol
 */
export const RawSymbol = Symbol('__v_raw')

/**
 * 跳过响应式标记Symbol
 */
export const SkipSymbol = Symbol('__v_skip')
