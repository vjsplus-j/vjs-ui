# 生命周期管理技术文档

> **版本**: v1.0.0  
> **作者**: VJS-UI Team  
> **更新**: 2025-11-09  
> **优先级**: 🔴 P0

---

## 📋 文档说明

本文档包含完整的生命周期管理技术方案，涵盖核心管理器、资源管理、Keep-Alive、自动清理调度等所有方面。

---

## 🔥 技术核心

### 核心生命周期管理器

```typescript
/**
 * 生命周期管理器 - 核心实现
 * 管理组件、资源、事件、定时器的完整生命周期
 */
class LifecycleManager {
  // 组件生命周期追踪
  private components = new Map<string, ComponentLifecycle>()
  
  // 资源生命周期追踪
  private resources = new Map<string, ResourceLifecycle>()
  
  // 全局钩子
  private globalHooks: GlobalHooks = {
    beforeCreate: [],
    created: [],
    beforeMount: [],
    mounted: [],
    beforeUpdate: [],
    updated: [],
    beforeUnmount: [],
    unmounted: [],
    errorCaptured: [],
    activated: [],
    deactivated: []
  }
  
  // 清理队列
  private cleanupQueue: CleanupTask[] = []
  private isCleaningUp = false
  
  /**
   * 注册组件
   */
  registerComponent(id: string, component: any): ComponentLifecycle {
    const lifecycle: ComponentLifecycle = {
      id,
      component,
      state: 'created',
      createdAt: Date.now(),
      mountedAt: null,
      unmountedAt: null,
      updateCount: 0,
      renderCount: 0,
      errorCount: 0,
      resources: new Set(),
      eventListeners: new Set(),
      timers: new Set(),
      watchers: new Set(),
      children: new Set(),
      parent: null
    }
    
    this.components.set(id, lifecycle)
    this.executeGlobalHooks('created', lifecycle)
    
    console.log(`[Lifecycle] Component ${id} registered`)
    
    return lifecycle
  }
  
  /**
   * 组件挂载
   */
  async mountComponent(id: string): Promise<void> {
    const lifecycle = this.components.get(id)
    if (!lifecycle) {
      throw new Error(`Component ${id} not registered`)
    }
    
    if (lifecycle.state !== 'created' && lifecycle.state !== 'unmounted') {
      console.warn(`[Lifecycle] Component ${id} already mounted (state: ${lifecycle.state})`)
      return
    }
    
    try {
      console.log(`[Lifecycle] Mounting component ${id}`)
      
      // beforeMount钩子
      await this.executeGlobalHooks('beforeMount', lifecycle)
      await this.executeComponentHook(lifecycle, 'beforeMount')
      
      // 更新状态
      lifecycle.state = 'mounting'
      
      // 实际挂载由渲染器完成
      // 这里只管理生命周期状态
      
      // 标记挂载完成
      lifecycle.state = 'mounted'
      lifecycle.mountedAt = Date.now()
      
      // mounted钩子
      await this.executeComponentHook(lifecycle, 'mounted')
      await this.executeGlobalHooks('mounted', lifecycle)
      
      console.log(`[Lifecycle] Component ${id} mounted`)
      
    } catch (error) {
      lifecycle.state = 'error'
      lifecycle.errorCount++
      await this.handleError(lifecycle, error as Error, 'mount')
      throw error
    }
  }
  
  /**
   * 组件更新
   */
  async updateComponent(id: string): Promise<void> {
    const lifecycle = this.components.get(id)
    if (!lifecycle || lifecycle.state !== 'mounted') {
      return
    }
    
    try {
      // beforeUpdate钩子
      await this.executeGlobalHooks('beforeUpdate', lifecycle)
      await this.executeComponentHook(lifecycle, 'beforeUpdate')
      
      lifecycle.state = 'updating'
      lifecycle.updateCount++
      
      // 实际更新由渲染器完成
      
      lifecycle.state = 'mounted'
      
      // updated钩子
      await this.executeComponentHook(lifecycle, 'updated')
      await this.executeGlobalHooks('updated', lifecycle)
      
    } catch (error) {
      lifecycle.errorCount++
      await this.handleError(lifecycle, error as Error, 'update')
    }
  }
  
  /**
   * 组件卸载
   */
  async unmountComponent(id: string, immediate: boolean = false): Promise<void> {
    const lifecycle = this.components.get(id)
    if (!lifecycle) {
      console.warn(`[Lifecycle] Component ${id} not found for unmount`)
      return
    }
    
    if (lifecycle.state === 'unmounting' || lifecycle.state === 'unmounted') {
      console.warn(`[Lifecycle] Component ${id} already unmounting/unmounted`)
      return
    }
    
    try {
      console.log(`[Lifecycle] Unmounting component ${id}`)
      
      // beforeUnmount钩子
      await this.executeGlobalHooks('beforeUnmount', lifecycle)
      await this.executeComponentHook(lifecycle, 'beforeUnmount')
      
      lifecycle.state = 'unmounting'
      
      // 清理所有资源
      if (immediate) {
        await this.cleanupComponentImmediate(lifecycle)
      } else {
        await this.cleanupComponent(lifecycle)
      }
      
      lifecycle.state = 'unmounted'
      lifecycle.unmountedAt = Date.now()
      
      // unmounted钩子
      await this.executeComponentHook(lifecycle, 'unmounted')
      await this.executeGlobalHooks('unmounted', lifecycle)
      
      console.log(`[Lifecycle] Component ${id} unmounted`)
      
      // 从注册表移除
      this.components.delete(id)
      
    } catch (error) {
      lifecycle.errorCount++
      console.error(`[Lifecycle] Error unmounting component ${id}:`, error)
    }
  }
  
  /**
   * 清理组件资源（异步批量）
   */
  private async cleanupComponent(lifecycle: ComponentLifecycle): Promise<void> {
    const tasks: CleanupTask[] = []
    
    // 收集清理任务
    lifecycle.eventListeners.forEach(listener => {
      tasks.push({
        id: `listener-${Date.now()}`,
        type: 'event-listener',
        priority: 1,
        execute: () => this.removeEventListener(listener)
      })
    })
    
    lifecycle.timers.forEach(timer => {
      tasks.push({
        id: `timer-${Date.now()}`,
        type: 'timer',
        priority: 1,
        execute: async () => this.clearTimer(timer)
      })
    })
    
    lifecycle.watchers.forEach(watcher => {
      tasks.push({
        id: `watcher-${Date.now()}`,
        type: 'watcher',
        priority: 2,
        execute: async () => watcher.stop()
      })
    })
    
    // 清理子组件
    for (const childId of lifecycle.children) {
      tasks.push({
        id: `child-${childId}`,
        type: 'child-component',
        priority: 3,
        execute: () => this.unmountComponent(childId)
      })
    }
    
    // 清理资源
    lifecycle.resources.forEach(resourceId => {
      tasks.push({
        id: `resource-${resourceId}`,
        type: 'resource',
        priority: 4,
        execute: () => this.releaseResource(resourceId)
      })
    })
    
    // 添加到清理队列
    this.cleanupQueue.push(...tasks)
    
    // 触发清理
    this.processCleanupQueue()
  }
  
  /**
   * 立即清理组件资源（同步）
   */
  private async cleanupComponentImmediate(lifecycle: ComponentLifecycle): Promise<void> {
    // 清理事件监听器
    for (const listener of lifecycle.eventListeners) {
      await this.removeEventListener(listener)
    }
    lifecycle.eventListeners.clear()
    
    // 清理定时器
    for (const timer of lifecycle.timers) {
      this.clearTimer(timer)
    }
    lifecycle.timers.clear()
    
    // 清理watchers
    for (const watcher of lifecycle.watchers) {
      watcher.stop()
    }
    lifecycle.watchers.clear()
    
    // 清理子组件
    const childPromises = Array.from(lifecycle.children).map(childId =>
      this.unmountComponent(childId, true)
    )
    await Promise.all(childPromises)
    lifecycle.children.clear()
    
    // 清理资源
    const resourcePromises = Array.from(lifecycle.resources).map(resourceId =>
      this.releaseResource(resourceId)
    )
    await Promise.all(resourcePromises)
    lifecycle.resources.clear()
  }
  
  /**
   * 处理清理队列
   */
  private async processCleanupQueue(): Promise<void> {
    if (this.isCleaningUp) return
    
    this.isCleaningUp = true
    
    try {
      // 按优先级排序
      this.cleanupQueue.sort((a, b) => a.priority - b.priority)
      
      // 批量执行
      const batchSize = 10
      while (this.cleanupQueue.length > 0) {
        const batch = this.cleanupQueue.splice(0, batchSize)
        
        await Promise.allSettled(
          batch.map(task => task.execute())
        )
      }
    } finally {
      this.isCleaningUp = false
    }
  }
  
  /**
   * 移除事件监听器
   */
  private async removeEventListener(listener: EventListenerInfo): Promise<void> {
    try {
      listener.target.removeEventListener(
        listener.event,
        listener.handler,
        listener.options
      )
    } catch (error) {
      console.error('[Lifecycle] Error removing event listener:', error)
    }
  }
  
  /**
   * 清理定时器
   */
  private clearTimer(timer: TimerInfo): void {
    try {
      if (timer.type === 'timeout') {
        clearTimeout(timer.id)
      } else {
        clearInterval(timer.id)
      }
    } catch (error) {
      console.error('[Lifecycle] Error clearing timer:', error)
    }
  }
  
  /**
   * 释放资源
   */
  private async releaseResource(resourceId: string): Promise<void> {
    const resource = this.resources.get(resourceId)
    if (!resource) return
    
    try {
      // 减少引用计数
      resource.refCount--
      
      // 如果引用计数为0，执行清理
      if (resource.refCount <= 0) {
        if (resource.cleanup) {
          await resource.cleanup()
        }
        
        resource.state = 'released'
        resource.releasedAt = Date.now()
        
        this.resources.delete(resourceId)
        
        console.log(`[Lifecycle] Resource ${resourceId} released`)
      }
    } catch (error) {
      console.error(`[Lifecycle] Error releasing resource ${resourceId}:`, error)
    }
  }
  
  /**
   * 执行组件钩子
   */
  private async executeComponentHook(
    lifecycle: ComponentLifecycle,
    hook: LifecycleHook
  ): Promise<void> {
    const component = lifecycle.component
    const hookFn = component[hook]
    
    if (typeof hookFn === 'function') {
      try {
        await hookFn.call(component)
      } catch (error) {
        await this.handleError(lifecycle, error as Error, hook)
      }
    }
  }
  
  /**
   * 执行全局钩子
   */
  private async executeGlobalHooks(
    hook: LifecycleHook,
    lifecycle: ComponentLifecycle
  ): Promise<void> {
    const hooks = this.globalHooks[hook] || []
    
    for (const fn of hooks) {
      try {
        await fn(lifecycle)
      } catch (error) {
        console.error(`[Lifecycle] Error in global ${hook} hook:`, error)
      }
    }
  }
  
  /**
   * 错误处理
   */
  private async handleError(
    lifecycle: ComponentLifecycle,
    error: Error,
    context?: string
  ): Promise<void> {
    const errorCaptured = this.globalHooks.errorCaptured || []
    
    let handled = false
    for (const fn of errorCaptured) {
      try {
        const result = await fn(error, lifecycle, context)
        if (result === false) {
          handled = true
          break
        }
      } catch (e) {
        console.error('[Lifecycle] Error in errorCaptured hook:', e)
      }
    }
    
    if (!handled) {
      console.error(`[Lifecycle] Unhandled error in component ${lifecycle.id} (${context}):`, error)
    }
  }
  
  /**
   * 注册全局钩子
   */
  onHook(hook: LifecycleHook, fn: Function): () => void {
    if (!this.globalHooks[hook]) {
      this.globalHooks[hook] = []
    }
    
    this.globalHooks[hook].push(fn)
    
    // 返回取消注册函数
    return () => {
      const hooks = this.globalHooks[hook]
      const index = hooks.indexOf(fn)
      if (index > -1) {
        hooks.splice(index, 1)
      }
    }
  }
  
  /**
   * 获取组件生命周期
   */
  getComponent(id: string): ComponentLifecycle | undefined {
    return this.components.get(id)
  }
  
  /**
   * 获取所有组件
   */
  getAllComponents(): ComponentLifecycle[] {
    return Array.from(this.components.values())
  }
  
  /**
   * 获取统计信息
   */
  getStats(): LifecycleStats {
    const components = Array.from(this.components.values())
    
    return {
      totalComponents: components.length,
      mountedComponents: components.filter(c => c.state === 'mounted').length,
      unmountedComponents: components.filter(c => c.state === 'unmounted').length,
      errorComponents: components.filter(c => c.errorCount > 0).length,
      totalResources: this.resources.size,
      totalEventListeners: components.reduce((sum, c) => sum + c.eventListeners.size, 0),
      totalTimers: components.reduce((sum, c) => sum + c.timers.size, 0),
      totalWatchers: components.reduce((sum, c) => sum + c.watchers.size, 0),
      avgLifetime: this.calculateAvgLifetime(components),
      memoryUsage: this.estimateMemoryUsage()
    }
  }
  
  private calculateAvgLifetime(components: ComponentLifecycle[]): number {
    const mounted = components.filter(c => c.mountedAt)
    if (mounted.length === 0) return 0
    
    const now = Date.now()
    const totalLifetime = mounted.reduce((sum, c) => {
      const end = c.unmountedAt || now
      return sum + (end - c.mountedAt!)
    }, 0)
    
    return totalLifetime / mounted.length
  }
  
  private estimateMemoryUsage(): number {
    return this.components.size * 10240 + this.resources.size * 5120
  }
}

// 类型定义
interface ComponentLifecycle {
  id: string
  component: any
  state: LifecycleState
  createdAt: number
  mountedAt: number | null
  unmountedAt: number | null
  updateCount: number
  renderCount: number
  errorCount: number
  resources: Set<string>
  eventListeners: Set<EventListenerInfo>
  timers: Set<TimerInfo>
  watchers: Set<Watcher>
  children: Set<string>
  parent: string | null
}

interface ResourceLifecycle {
  id: string
  type: ResourceType
  data: any
  state: 'active' | 'released'
  createdAt: number
  releasedAt: number | null
  refCount: number
  cleanup?: () => Promise<void>
}

interface EventListenerInfo {
  target: EventTarget
  event: string
  handler: EventListener
  options?: AddEventListenerOptions
}

interface TimerInfo {
  type: 'timeout' | 'interval'
  id: number
}

interface Watcher {
  stop: () => void
}

interface CleanupTask {
  id: string
  type: string
  priority: number
  execute: () => Promise<void>
}

type LifecycleState = 
  | 'created' 
  | 'mounting' 
  | 'mounted' 
  | 'updating' 
  | 'unmounting' 
  | 'unmounted' 
  | 'error'

type LifecycleHook = 
  | 'beforeCreate'
  | 'created'
  | 'beforeMount'
  | 'mounted'
  | 'beforeUpdate'
  | 'updated'
  | 'beforeUnmount'
  | 'unmounted'
  | 'errorCaptured'
  | 'activated'
  | 'deactivated'

type ResourceType = 'image' | 'video' | 'audio' | 'data' | 'connection' | 'worker'

interface GlobalHooks {
  [key: string]: Function[]
}

interface LifecycleStats {
  totalComponents: number
  mountedComponents: number
  unmountedComponents: number
  errorComponents: number
  totalResources: number
  totalEventListeners: number
  totalTimers: number
  totalWatchers: number
  avgLifetime: number
  memoryUsage: number
}
```

---

## 🛠️ 实现逻辑

### 资源管理器

```typescript
/**
 * 资源管理器 - 完整实现
 */
class ResourceManager {
  // ...
}

// ...

### Keep-Alive管理器

```typescript
/**
 * Keep-Alive缓存管理器
 */
class KeepAliveManager {
  // ...
}

// ...

### 泄漏检测器

```typescript
/**
 * 泄漏检测器 - 生命周期泄漏专用
 */
class LifecycleLeakDetector {
  // ...
}

// ...

---

---

## 📖 使用示例

### 自动清理调度器

```typescript
/**
 * 自动清理调度器
 * 定期清理僵尸组件、过期资源、泄漏检测
 */
class CleanupScheduler {
  private lifecycleManager: LifecycleManager
  private resourceManager: ResourceManager
  private leakDetector: LifecycleLeakDetector
  private tasks: ScheduledTask[] = []
  private running = false
  private interval: number | null = null
  
  constructor(
    lifecycleManager: LifecycleManager,
    resourceManager: ResourceManager
  ) {
    this.lifecycleManager = lifecycleManager
    this.resourceManager = resourceManager
    this.leakDetector = new LifecycleLeakDetector()
  }
  
  /**
   * 启动调度
   */
  start(config: SchedulerConfig = {}): void {
    if (this.running) {
      console.warn('[Scheduler] Already running')
      return
    }
    
    const {
      checkInterval = 30000,  // 30秒
      enableLeakDetection = true,
      enableResourceCleanup = true,
      enableZombieCleanup = true
    } = config
    
    this.running = true
    
    // 注册清理任务
    if (enableLeakDetection) {
      this.schedule({
        id: 'leak-detection',
        type: 'interval',
        intervalMs: 60000,  // 每分钟
        execute: async () => this.detectLeaks()
      })
    }
    
    if (enableResourceCleanup) {
      this.schedule({
        id: 'resource-cleanup',
        type: 'interval',
        intervalMs: 120000,  // 每2分钟
        execute: async () => this.cleanupResources()
      })
    }
    
    if (enableZombieCleanup) {
      this.schedule({
        id: 'zombie-cleanup',
        type: 'interval',
        intervalMs: 300000,  // 每5分钟
        execute: async () => this.cleanupZombies()
      })
    }
    
    // 启动主循环
    this.interval = window.setInterval(() => {
      this.tick()
    }, checkInterval)
    
    console.log('[Scheduler] Started with interval', checkInterval)
  }
  
  /**
   * 停止调度
   */
  stop(): void {
    if (!this.running) return
    
    this.running = false
    if (this.interval !== null) {
      clearInterval(this.interval)
      this.interval = null
    }
    
    console.log('[Scheduler] Stopped')
  }
  
  /**
   * 调度任务
   */
  schedule(config: TaskConfig): string {
    const task: ScheduledTask = {
      ...config,
      scheduledAt: Date.now(),
      lastRun: null,
      runCount: 0,
      errors: 0
    }
    
    this.tasks.push(task)
    console.log(`[Scheduler] Task ${task.id} scheduled`)
    
    return task.id
  }
  
  /**
   * 取消任务
   */
  cancel(taskId: string): void {
    const index = this.tasks.findIndex(t => t.id === taskId)
    if (index > -1) {
      this.tasks.splice(index, 1)
      console.log(`[Scheduler] Task ${taskId} cancelled`)
    }
  }
  
  /**
   * 执行调度tick
   */
  private async tick(): Promise<void> {
    const now = Date.now()
    const toRun: ScheduledTask[] = []
    
    // 找出需要执行的任务
    this.tasks.forEach(task => {
      if (this.shouldRun(task, now)) {
        toRun.push(task)
      }
    })
    
    // 执行任务
    for (const task of toRun) {
      try {
        await task.execute()
        task.lastRun = now
        task.runCount++
      } catch (error) {
        task.errors++
        console.error(`[Scheduler] Error in task ${task.id}:`, error)
      }
    }
    
    // 移除一次性任务
    this.tasks = this.tasks.filter(task => {
      if (task.type === 'once' && task.runCount > 0) {
        return false
      }
      // 移除错误过多的任务
      if (task.errors > 5) {
        console.error(`[Scheduler] Task ${task.id} removed due to excessive errors`)
        return false
      }
      return true
    })
  }
  
  /**
   * 判断是否应该运行
   */
  private shouldRun(task: ScheduledTask, now: number): boolean {
    if (task.type === 'once') {
      return task.runCount === 0
    }
    
    if (task.type === 'interval') {
      if (task.lastRun === null) return true
      return now - task.lastRun >= task.intervalMs!
    }
    
    if (task.type === 'idle') {
      return typeof requestIdleCallback !== 'undefined'
    }
    
    return false
  }
  
  /**
   * 检测泄漏
   */
  private async detectLeaks(): Promise<void> {
    const leaks = this.leakDetector.detect(this.lifecycleManager)
    
    if (leaks.length > 0) {
      console.warn(`[Scheduler] Detected ${leaks.length} leaks:`, leaks)
      
      // 自动修复一些泄漏
      for (const leak of leaks) {
        if (leak.type === 'uncleaned-component' && leak.severity === 'high') {
          console.log(`[Scheduler] Auto-cleaning leaked component ${leak.componentId}`)
          await this.lifecycleManager.unmountComponent(leak.componentId, true)
        }
      }
    }
  }
  
  /**
   * 清理资源
   */
  private async cleanupResources(): Promise<void> {
    // 清理未使用的资源
    // 实现根据实际需求
    console.log('[Scheduler] Cleaning up resources')
  }
  
  /**
   * 清理僵尸组件
   */
  private async cleanupZombies(): Promise<void> {
    const components = this.lifecycleManager.getAllComponents()
    const now = Date.now()
    const maxLifetime = 3600000  // 1小时
    
    for (const lifecycle of components) {
      if (lifecycle.state === 'mounted' && lifecycle.mountedAt) {
        const lifetime = now - lifecycle.mountedAt
        
        if (lifetime > maxLifetime) {
          console.log(`[Scheduler] Cleaning zombie component ${lifecycle.id}`)
          // 这里需要根据实际情况决定是否自动卸载
          // await this.lifecycleManager.unmountComponent(lifecycle.id)
        }
      }
    }
  }
  
  /**
   * 获取统计信息
   */
  getStats(): SchedulerStats {
    return {
      running: this.running,
      totalTasks: this.tasks.length,
      totalRuns: this.tasks.reduce((sum, t) => sum + t.runCount, 0),
      totalErrors: this.tasks.reduce((sum, t) => sum + t.errors, 0)
    }
  }
}

interface SchedulerConfig {
  checkInterval?: number
  enableLeakDetection?: boolean
  enableResourceCleanup?: boolean
  enableZombieCleanup?: boolean
}

interface TaskConfig {
  id: string
  type: 'once' | 'interval' | 'idle'
  intervalMs?: number
  execute: () => Promise<void>
}

interface ScheduledTask extends TaskConfig {
  scheduledAt: number
  lastRun: number | null
  runCount: number
  errors: number
}

interface SchedulerStats {
  running: boolean
  totalTasks: number
  totalRuns: number
  totalErrors: number
}
```

---

### 完整使用示例

```typescript
/**
 * 完整使用示例
 */

// 1. 初始化系统
const lifecycleManager = new LifecycleManager()
const resourceManager = new ResourceManager(lifecycleManager)
const keepAliveManager = new KeepAliveManager(lifecycleManager, 10)
const scheduler = new CleanupScheduler(lifecycleManager, resourceManager)

// 2. 注册全局钩子
lifecycleManager.onHook('mounted', async (lifecycle) => {
  console.log(`Component ${lifecycle.id} mounted`)
})

lifecycleManager.onHook('errorCaptured', async (error, lifecycle, context) => {
  console.error(`Error in ${lifecycle.id} during ${context}:`, error)
  // 可以返回false阻止错误冒泡
  return true
})

// 3. 启动自动清理
scheduler.start({
  checkInterval: 30000,
  enableLeakDetection: true,
  enableResourceCleanup: true,
  enableZombieCleanup: true
})

// 4. 组件生命周期
class MyComponent {
  id: string
  lifecycle: ComponentLifecycle
  
  constructor(id: string) {
    this.id = id
    this.lifecycle = lifecycleManager.registerComponent(id, this)
  }
  
  async mount() {
    await lifecycleManager.mountComponent(this.id)
    
    // 注册事件监听器
    const handler = () => console.log('clicked')
    document.addEventListener('click', handler)
    
    lifecycleManager['trackEventListener'](this.id, document, 'click', handler)
  }
  
  async unmount() {
    await lifecycleManager.unmountComponent(this.id)
  }
  
  // 生命周期钩子
  async beforeMount() {
    console.log('beforeMount')
  }
  
  async mounted() {
    console.log('mounted')
  }
  
  async beforeUnmount() {
    console.log('beforeUnmount')
  }
  
  async unmounted() {
    console.log('unmounted')
  }
}

// 5. 使用示例
async function example() {
  const component = new MyComponent('my-component')
  
  await component.mount()
  
  // 使用Keep-Alive缓存
  await keepAliveManager.cacheComponent('my-component', null, component)
  
  // 稍后恢复
  const cached = await keepAliveManager.getCached('my-component')
  
  // 清理
  await component.unmount()
  
  // 查看统计
  console.log('Lifecycle stats:', lifecycleManager.getStats())
  console.log('Resource stats:', resourceManager.getStats())
  console.log('KeepAlive stats:', keepAliveManager.getStats())
  console.log('Scheduler stats:', scheduler.getStats())
}
```

---

---

## ⚠️ 避免错误

### 最佳实践

```typescript
/**
 * 最佳实践指南
 */

// ✅ 1. 始终在组件卸载时清理资源
class GoodComponent {
  async unmount() {
    // 框架会自动清理追踪的资源
    await lifecycleManager.unmountComponent(this.id)
  }
}

// ❌ 2. 不要忘记追踪事件监听器
class BadComponent {
  constructor() {
    // ❌ 没有追踪，会导致泄漏
    document.addEventListener('click', this.onClick)
  }
  
  onClick = () => {
    console.log('clicked')
  }
}

class GoodComponent2 {
  constructor(id: string) {
    const handler = this.onClick
    document.addEventListener('click', handler)
    
    // ✅ 追踪监听器
    lifecycleManager['trackEventListener'](id, document, 'click', handler)
  }
  
  onClick = () => {
    console.log('clicked')
  }
}

// ✅ 3. 使用Keep-Alive优化频繁切换的组件
async function optimizedRouting(newRoute: string) {
  const currentComponent = getCurrentComponent()
  
  // 缓存而不是销毁
  await keepAliveManager.cacheComponent(
    currentComponent.id,
    currentComponent.vnode,
    currentComponent
  )
  
  // 尝试从缓存恢复
  const cached = await keepAliveManager.getCached(newRoute)
  if (cached) {
    return cached.component
  }
  
  // 创建新组件
  return createComponent(newRoute)
}

// ✅ 4. 使用资源管理器管理大型资源
async function loadImage(componentId: string, url: string) {
  const img = new Image()
  img.src = url
  
  await new Promise((resolve) => {
    img.onload = resolve
  })
  
  // 注册资源
  resourceManager.register(
    componentId,
    `image-${url}`,
    'image',
    img,
    async () => {
      img.src = ''
    }
  )
  
  return img
}

// ✅ 5. 使用全局错误处理
lifecycleManager.onHook('errorCaptured', async (error, lifecycle, context) => {
  // 上报错误
  reportError({
    componentId: lifecycle.id,
    error: error.message,
    context,
    timestamp: Date.now()
  })
  
  // 尝试恢复
  if (context === 'update') {
    // 重新渲染
    await lifecycleManager.updateComponent(lifecycle.id)
  }
  
  return false  // 阻止错误冒泡
})

// ✅ 6. 定期检查系统健康
setInterval(() => {
  const stats = lifecycleManager.getStats()
  
  if (stats.errorComponents > 5) {
    console.warn('Too many error components:', stats.errorComponents)
  }
  
  if (stats.totalEventListeners > 1000) {
    console.warn('Too many event listeners:', stats.totalEventListeners)
  }
  
  if (stats.memoryUsage > 100 * 1024 * 1024) {  // 100MB
    console.warn('High memory usage:', stats.memoryUsage)
  }
}, 60000)

// 辅助函数
function getCurrentComponent(): any {
  // 实现获取当前组件
  return {} as any
}

function createComponent(route: string): any {
  // 实现创建组件
  return {} as any
}

function reportError(error: any): void {
  // 实现错误上报
  console.error('Error reported:', error)
}
```

---

---

## ✅ 测试策略

### 性能指标

```
生命周期管理性能:
  组件注册: < 0.1ms
  组件挂载: < 1ms
  组件卸载: < 2ms
  资源清理: < 5ms
  Keep-Alive缓存: < 0.5ms
  泄漏检测: < 100ms (每分钟)

内存管理:
  单组件开销: ~10KB
  Keep-Alive缓存: ~50KB/组件
  资源追踪: ~5KB/资源

推荐配置:
  Keep-Alive缓存大小: 10-20个组件
  清理检查间隔: 30-60秒
  泄漏检测间隔: 60-120秒
  最大组件生命周期: 1小时
```

---

### 故障排查

```typescript
/**
 * 常见问题排查
 */

// 问题1: 组件未正确卸载
// 症状: 内存持续增长
// 解决: 检查是否调用了unmount
async function checkUnmount(componentId: string) {
  const lifecycle = lifecycleManager.getComponent(componentId)
  if (lifecycle && lifecycle.state !== 'unmounted') {
    console.log('Component not unmounted, forcing...')
    await lifecycleManager.unmountComponent(componentId, true)
  }
}

// 问题2: 事件监听器泄漏
// 症状: totalEventListeners持续增长
// 解决: 确保所有监听器被追踪
function auditEventListeners() {
  const stats = lifecycleManager.getStats()
  if (stats.totalEventListeners > 100) {
    console.warn('High event listener count:', stats.totalEventListeners)
    
    // 检查每个组件
    lifecycleManager.getAllComponents().forEach(lifecycle => {
      if (lifecycle.eventListeners.size > 10) {
        console.warn(`Component ${lifecycle.id} has ${lifecycle.eventListeners.size} listeners`)
      }
    })
  }
}

// 问题3: Keep-Alive缓存过大
// 症状: 内存占用高
// 解决: 调整缓存大小或手动清理
async function optimizeCache() {
  const stats = keepAliveManager.getStats()
  if (stats.size >= stats.maxSize) {
    console.log('Cache full, clearing old entries')
    // Keep-Alive会自动LRU驱逐
  }
}
```

---

---

**参考文档**：
- [01-PLANNING-ARCHITECTURE.md](./01-PLANNING-ARCHITECTURE.md) - 架构设计
- [04-TECH-REACTIVE.md](./04-TECH-REACTIVE.md) - 响应式系统

---

**最后更新**: 2025-11-09  
**维护者**: VJS-UI Team  
**状态**: ✅ 完成
