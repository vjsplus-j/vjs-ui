/**
 * 响应式系统 - effect()
 * 副作用函数和依赖追踪
 */

export type EffectFn = () => void

export interface ReactiveEffect extends EffectFn {
  deps: Set<ReactiveEffect>[]
  options?: EffectOptions
}

export interface EffectOptions {
  lazy?: boolean
  scheduler?: (effect: ReactiveEffect) => void
}

// 当前正在执行的effect
let activeEffect: ReactiveEffect | undefined

// effect栈（支持嵌套）
const effectStack: ReactiveEffect[] = []

// 依赖映射: target -> key -> effects
type KeyToDepMap = Map<any, Set<ReactiveEffect>>
const targetMap = new WeakMap<any, KeyToDepMap>()

/**
 * 创建effect
 */
export function effect(fn: EffectFn, options: EffectOptions = {}): ReactiveEffect {
  const effectFn: ReactiveEffect = () => {
    try {
      // 清理旧的依赖
      cleanup(effectFn)

      // 设置为当前活动effect
      activeEffect = effectFn
      effectStack.push(effectFn)

      // 执行函数
      return fn()
    } finally {
      // 恢复之前的effect
      effectStack.pop()
      activeEffect = effectStack[effectStack.length - 1]
    }
  }

  // 初始化依赖数组
  effectFn.deps = []
  effectFn.options = options

  // 如果不是lazy，立即执行
  if (!options.lazy) {
    effectFn()
  }

  return effectFn
}

/**
 * 依赖收集
 */
export function track(target: object, key: unknown): void {
  // 如果没有活动effect，不需要收集
  if (!activeEffect) {
    return
  }

  // 获取target的依赖map
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  // 获取key的依赖集合
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  // 添加effect到依赖集合
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
  }
}

/**
 * 触发更新
 */
export function trigger(target: object, key: unknown): void {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }

  const dep = depsMap.get(key)
  if (!dep) {
    return
  }

  // 创建新的Set避免死循环
  const effects = new Set(dep)

  effects.forEach((effect) => {
    // 如果有调度器，使用调度器执行
    if (effect.options?.scheduler) {
      effect.options.scheduler(effect)
    } else {
      effect()
    }
  })
}

/**
 * 清理effect的依赖
 */
function cleanup(effect: ReactiveEffect): void {
  const { deps } = effect
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i]?.delete(effect)
    }
    deps.length = 0
  }
}

/**
 * 停止effect
 */
export function stop(effect: ReactiveEffect): void {
  cleanup(effect)
}
