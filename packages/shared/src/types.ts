/**
 * 共享类型定义
 */

// 组件配置接口
export interface ComponentConfig {
  type: string
  props?: Record<string, any>
  children?: ComponentConfig[] | string
  events?: Record<string, Function>
}

// VNode接口
export interface VNode {
  type: string | symbol
  props: Record<string, any> | null
  children: VNode[] | string | null
  key: string | number | null
}

// 响应式类型
export interface ReactiveEffect {
  (): void
  deps: Set<ReactiveEffect>[]
  options?: ReactiveEffectOptions
}

export interface ReactiveEffectOptions {
  lazy?: boolean
  scheduler?: (effect: ReactiveEffect) => void
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}

export interface DebuggerEvent {
  effect: ReactiveEffect
  target: object
  type: string
  key: any
  newValue?: any
  oldValue?: any
}
