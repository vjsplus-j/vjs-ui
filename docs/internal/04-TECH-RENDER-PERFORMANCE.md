# 渲染性能管理技术文档

> **版本**: v1.0.0  
> **作者**: VJS-UI Team  
> **更新**: 2025-11-09  
> **优先级**: 🔴 P0

---

## 📋 文档说明

本文档包含完整的渲染性能管理技术方案，涵盖软硬件性能监控、FPS追踪、硬件检测、自适应调整等所有方面。

---

## 🔥 技术核心

### 性能监控器

```typescript
/**
 * 渲染性能监控器
 * 监控FPS、帧时间、渲染耗时、硬件性能
 */
class RenderPerformanceMonitor {
  // FPS追踪
  private fps = 0
  private frameCount = 0
  private lastFpsUpdate = 0
  private frameTimes: number[] = []
  private maxFrameTimeHistory = 60
  
  // 渲染指标
  private metrics: RenderMetrics = {
    fps: 60,
    frameTime: 0,
    renderTime: 0,
    layoutTime: 0,
    paintTime: 0,
    idleTime: 0,
    droppedFrames: 0,
    totalFrames: 0
  }
  
  // 硬件信息
  private hardwareInfo: HardwareInfo | null = null
  
  // 性能级别
  private performanceLevel: PerformanceLevel = 'high'
  
  // 回调
  private callbacks: PerformanceCallback[] = []
  
  // RAF ID
  private rafId: number | null = null
  private running = false
  
  constructor() {
    this.detectHardware()
  }
  
  /**
   * 启动监控
   */
  start(): void {
    if (this.running) return
    
    this.running = true
    this.lastFpsUpdate = performance.now()
    this.measure()
    
    console.log('[PerformanceMonitor] Started')
  }
  
  /**
   * 停止监控
   */
  stop(): void {
    if (!this.running) return
    
    this.running = false
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    
    console.log('[PerformanceMonitor] Stopped')
  }
  
  /**
   * 测量帧性能
   */
  private measure(): void {
    if (!this.running) return
    
    const now = performance.now()
    
    this.rafId = requestAnimationFrame((timestamp) => {
      this.onFrame(timestamp)
      this.measure()
    })
  }
  
  /**
   * 帧回调
   */
  private onFrame(timestamp: number): void {
    this.frameCount++
    this.metrics.totalFrames++
    
    // 计算帧时间
    const frameTime = timestamp - this.lastFpsUpdate
    this.frameTimes.push(frameTime)
    
    if (this.frameTimes.length > this.maxFrameTimeHistory) {
      this.frameTimes.shift()
    }
    
    // 检查掉帧
    if (frameTime > 16.67) {  // 60fps阈值
      this.metrics.droppedFrames++
    }
    
    // 每秒更新一次FPS
    const elapsed = timestamp - this.lastFpsUpdate
    if (elapsed >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / elapsed)
      this.metrics.fps = this.fps
      this.metrics.frameTime = this.calculateAvgFrameTime()
      
      this.frameCount = 0
      this.lastFpsUpdate = timestamp
      
      // 触发回调
      this.notifyCallbacks()
      
      // 动态调整性能级别
      this.adjustPerformanceLevel()
    }
  }
  
  /**
   * 计算平均帧时间
   */
  private calculateAvgFrameTime(): number {
    if (this.frameTimes.length === 0) return 0
    
    const sum = this.frameTimes.reduce((a, b) => a + b, 0)
    return sum / this.frameTimes.length
  }
  
  /**
   * 检测硬件
   */
  private detectHardware(): void {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext
    
    if (!gl) {
      this.hardwareInfo = {
        gpu: 'unknown',
        gpuVendor: 'unknown',
        gpuRenderer: 'unknown',
        maxTextureSize: 0,
        webglVersion: 0,
        cores: navigator.hardwareConcurrency || 1,
        memory: (performance as any).memory?.jsHeapSizeLimit || 0
      }
      return
    }
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    const vendor = debugInfo 
      ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
      : gl.getParameter(gl.VENDOR)
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : gl.getParameter(gl.RENDERER)
    
    this.hardwareInfo = {
      gpu: renderer,
      gpuVendor: vendor,
      gpuRenderer: renderer,
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      webglVersion: gl instanceof WebGL2RenderingContext ? 2 : 1,
      cores: navigator.hardwareConcurrency || 1,
      memory: (performance as any).memory?.jsHeapSizeLimit || 0
    }
    
    // 根据硬件初步评估性能级别
    this.initialPerformanceLevel()
    
    console.log('[PerformanceMonitor] Hardware detected:', this.hardwareInfo)
  }
  
  /**
   * 初始性能级别评估
   */
  private initialPerformanceLevel(): void {
    if (!this.hardwareInfo) return
    
    // 根据GPU、CPU核心数、内存评估
    const cores = this.hardwareInfo.cores
    const memory = this.hardwareInfo.memory
    const maxTexture = this.hardwareInfo.maxTextureSize
    
    if (cores >= 8 && memory >= 4 * 1024 * 1024 * 1024 && maxTexture >= 16384) {
      this.performanceLevel = 'high'
    } else if (cores >= 4 && memory >= 2 * 1024 * 1024 * 1024 && maxTexture >= 8192) {
      this.performanceLevel = 'medium'
    } else {
      this.performanceLevel = 'low'
    }
  }
  
  /**
   * 动态调整性能级别
   */
  private adjustPerformanceLevel(): void {
    const avgFps = this.metrics.fps
    const droppedFrameRate = this.metrics.droppedFrames / this.metrics.totalFrames
    
    // 根据实际FPS调整
    if (avgFps >= 55 && droppedFrameRate < 0.05) {
      // 性能良好，可以提升
      if (this.performanceLevel === 'low') {
        this.performanceLevel = 'medium'
      } else if (this.performanceLevel === 'medium') {
        this.performanceLevel = 'high'
      }
    } else if (avgFps < 30 || droppedFrameRate > 0.2) {
      // 性能不足，降级
      if (this.performanceLevel === 'high') {
        this.performanceLevel = 'medium'
      } else if (this.performanceLevel === 'medium') {
        this.performanceLevel = 'low'
      }
    }
  }
  
  /**
   * 测量渲染时间
   */
  measureRender(name: string, fn: () => void): void {
    const start = performance.now()
    
    fn()
    
    const duration = performance.now() - start
    this.metrics.renderTime = duration
    
    if (duration > 16) {
      console.warn(`[PerformanceMonitor] Slow render: ${name} took ${duration.toFixed(2)}ms`)
    }
  }
  
  /**
   * 异步测量
   */
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    
    const result = await fn()
    
    const duration = performance.now() - start
    
    if (duration > 100) {
      console.warn(`[PerformanceMonitor] Slow async operation: ${name} took ${duration.toFixed(2)}ms`)
    }
    
    return result
  }
  
  /**
   * 注册回调
   */
  onMetricsUpdate(callback: PerformanceCallback): () => void {
    this.callbacks.push(callback)
    
    return () => {
      const index = this.callbacks.indexOf(callback)
      if (index > -1) {
        this.callbacks.splice(index, 1)
      }
    }
  }
  
  /**
   * 通知回调
   */
  private notifyCallbacks(): void {
    this.callbacks.forEach(callback => {
      try {
        callback(this.metrics, this.performanceLevel)
      } catch (error) {
        console.error('[PerformanceMonitor] Error in callback:', error)
      }
    })
  }
  
  /**
   * 获取指标
   */
  getMetrics(): RenderMetrics {
    return { ...this.metrics }
  }
  
  /**
   * 获取硬件信息
   */
  getHardwareInfo(): HardwareInfo | null {
    return this.hardwareInfo
  }
  
  /**
   * 获取性能级别
   */
  getPerformanceLevel(): PerformanceLevel {
    return this.performanceLevel
  }
  
  /**
   * 获取详细报告
   */
  getReport(): PerformanceReport {
    return {
      timestamp: Date.now(),
      metrics: this.getMetrics(),
      hardware: this.hardwareInfo,
      level: this.performanceLevel,
      recommendations: this.generateRecommendations()
    }
  }
  
  /**
   * 生成优化建议
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = []
    
    if (this.metrics.fps < 30) {
      recommendations.push('FPS过低，建议降低渲染复杂度')
    }
    
    if (this.metrics.droppedFrames / this.metrics.totalFrames > 0.1) {
      recommendations.push('掉帧率过高，建议优化渲染逻辑')
    }
    
    if (this.metrics.renderTime > 16) {
      recommendations.push('渲染耗时过长，建议使用时间分片')
    }
    
    if (this.performanceLevel === 'low') {
      recommendations.push('硬件性能较低，建议启用低性能模式')
    }
    
    return recommendations
  }
}

// 类型定义
interface RenderMetrics {
  fps: number
  frameTime: number
  renderTime: number
  layoutTime: number
  paintTime: number
  idleTime: number
  droppedFrames: number
  totalFrames: number
}

interface HardwareInfo {
  gpu: string
  gpuVendor: string
  gpuRenderer: string
  maxTextureSize: number
  webglVersion: number
  cores: number
  memory: number
}

type PerformanceLevel = 'low' | 'medium' | 'high'

type PerformanceCallback = (metrics: RenderMetrics, level: PerformanceLevel) => void

interface PerformanceReport {
  timestamp: number
  metrics: RenderMetrics
  hardware: HardwareInfo | null
  level: PerformanceLevel
  recommendations: string[]
}
```

---

## 二、帧时间分析器（200行）

```typescript
/**
 * 帧时间分析器
 * 详细分析每帧的各个阶段耗时
 */
class FrameTimeAnalyzer {
  private samples: FrameSample[] = []
  private maxSamples = 300  // 保留5秒数据（60fps）
  
  /**
   * 开始测量帧
   */
  startFrame(): FrameContext {
    // ...
  }
  
  /**
   * 标记阶段
   */
  mark(context: FrameContext, stage: FrameStage): void {
    // ...
  }
  
  /**
   * 结束测量帧
   */
  endFrame(context: FrameContext): void {
    // ...
  }
  
  /**
   * 获取分析结果
   */
  getAnalysis(): FrameAnalysis {
    // ...
  }
  
  /**
   * 计算各阶段平均耗时
   */
  private calculateAvgStages(): Map<FrameStage, number> {
    // ...
  }
}

interface FrameContext {
  startTime: number
  marks: Map<FrameStage, number>
}

type FrameStage = 'update' | 'diff' | 'patch' | 'layout' | 'paint' | 'idle'

interface FrameSample {
  timestamp: number
  totalTime: number
  stages: Map<FrameStage, number>
}

interface FrameAnalysis {
  avgFrameTime: number
  avgStages: Map<FrameStage, number>
  slowFrames: number
  p95FrameTime: number
  p99FrameTime: number
}
```

---

## 三、使用示例（100行）

```typescript
/**
 * 使用示例
 */

// 1. 初始化监控
const perfMonitor = new RenderPerformanceMonitor()
const frameAnalyzer = new FrameTimeAnalyzer()

// 2. 启动监控
perfMonitor.start()

// 3. 注册性能回调
perfMonitor.onMetricsUpdate((metrics, level) => {
  console.log('FPS:', metrics.fps)
  console.log('Performance Level:', level)
  
  // 根据性能级别调整渲染策略
  if (level === 'low') {
    // 降低质量
    enableLowQualityMode()
  } else if (level === 'high') {
    // 启用高级特性
    enableAdvancedFeatures()
  }
})

// 4. 测量渲染
function render() {
  perfMonitor.measureRender('main-render', () => {
    // 渲染逻辑
    doRender()
  })
}

// 5. 详细帧分析
function renderWithAnalysis() {
  const frameCtx = frameAnalyzer.startFrame()
  
  // Update阶段
  performUpdate()
  frameAnalyzer.mark(frameCtx, 'update')
  
  // Diff阶段
  performDiff()
  frameAnalyzer.mark(frameCtx, 'diff')
  
  // Patch阶段
  performPatch()
  frameAnalyzer.mark(frameCtx, 'patch')
  
  frameAnalyzer.endFrame(frameCtx)
}

// 6. 获取报告
setInterval(() => {
  const report = perfMonitor.getReport()
  const analysis = frameAnalyzer.getAnalysis()
  
  console.log('Performance Report:', report)
  console.log('Frame Analysis:', analysis)
  
  if (report.recommendations.length > 0) {
    console.warn('Recommendations:', report.recommendations)
  }
}, 10000)

// 辅助函数
function doRender() {}
function performUpdate() {}
function performDiff() {}
function performPatch() {}
function enableLowQualityMode() {}
function enableAdvancedFeatures() {}
```

---


---

## 🛠️ 实现逻辑

### 时间分片渲染器

```typescript
/**
 * 时间分片渲染器
 * 将大量渲染任务分片执行，避免阻塞主线程
 */
class TimeSlicedRenderer {
  private tasks: RenderTask[] = []
  private isRendering = false
  private frameDeadline = 16  // 16ms per frame
  private idleDeadline = 5    // 空闲时最多执行5ms
  
  private perfMonitor: RenderPerformanceMonitor
  
  constructor(perfMonitor: RenderPerformanceMonitor) {
    this.perfMonitor = perfMonitor
  }
  
  /**
   * 调度渲染任务
   */
  schedule(task: RenderTask): void {
    this.tasks.push(task)
    
    if (!this.isRendering) {
      this.startRender()
    }
  }
  
  /**
   * 开始渲染
   */
  private startRender(): void {
    this.isRendering = true
    
    // 优先使用requestIdleCallback
    if ('requestIdleCallback' in window) {
      this.renderInIdle()
    } else {
      this.renderInRAF()
    }
  }
  
  /**
   * 在空闲时渲染
   */
  private renderInIdle(): void {
    requestIdleCallback((deadline) => {
      this.workLoop(deadline)
    })
  }
  
  /**
   * 在RAF中渲染
   */
  private renderInRAF(): void {
    requestAnimationFrame((timestamp) => {
      const deadline = {
        timeRemaining: () => this.frameDeadline - (performance.now() - timestamp),
        didTimeout: false
      }
      
      this.workLoop(deadline as IdleDeadline)
    })
  }
  
  /**
   * 工作循环
   */
  private workLoop(deadline: IdleDeadline): void {
    let shouldYield = false
    
    while (!shouldYield && this.tasks.length > 0) {
      const task = this.tasks.shift()!
      
      try {
        // 执行任务
        this.perfMonitor.measureRender(task.name, () => {
          task.execute()
        })
        
        // 检查是否应该让出控制权
        const timeRemaining = deadline.timeRemaining()
        shouldYield = timeRemaining < 1
        
      } catch (error) {
        console.error(`[TimeSliced] Error in task ${task.name}:`, error)
      }
    }
    
    // 如果还有任务，继续调度
    if (this.tasks.length > 0) {
      this.renderInIdle()
    } else {
      this.isRendering = false
    }
  }
  
  /**
   * 取消所有任务
   */
  cancelAll(): void {
    this.tasks = []
    this.isRendering = false
  }
}

interface RenderTask {
  name: string
  priority: number
  execute: () => void
}
```

---

## 二、批量更新优化器（250行）

```typescript
/**
 * 批量更新优化器
 * 将多个DOM更新合并为一次，减少重排重绘
 */
class BatchUpdateOptimizer {
  private pendingUpdates: DOMUpdate[] = []
  private rafId: number | null = null
  private isFlushing = false
  
  /**
   * 调度更新
   */
  scheduleUpdate(update: DOMUpdate): void {
    this.pendingUpdates.push(update)
    
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        this.flush()
      })
    }
  }
  
  /**
   * 刷新更新
   */
  private flush(): void {
    if (this.isFlushing) return
    
    this.isFlushing = true
    this.rafId = null
    
    try {
      // 按类型分组
      const grouped = this.groupByType(this.pendingUpdates)
      
      // 按最优顺序执行
      this.executeReads(grouped.reads || [])
      this.executeWrites(grouped.writes || [])
      
      this.pendingUpdates = []
      
    } finally {
      this.isFlushing = false
    }
  }
  
  /**
   * 按类型分组
   */
  private groupByType(updates: DOMUpdate[]): GroupedUpdates {
    const grouped: GroupedUpdates = {
      reads: [],
      writes: []
    }
    
    updates.forEach(update => {
      if (update.type === 'read') {
        grouped.reads!.push(update)
      } else {
        grouped.writes!.push(update)
      }
    })
    
    return grouped
  }
  
  /**
   * 执行读操作
   */
  private executeReads(reads: DOMUpdate[]): void {
    reads.forEach(update => {
      try {
        update.execute()
      } catch (error) {
        console.error('[BatchUpdate] Error in read:', error)
      }
    })
  }
  
  /**
   * 执行写操作
   */
  private executeWrites(writes: DOMUpdate[]): void {
    // 合并相同元素的多个写操作
    const merged = this.mergeWrites(writes)
    
    merged.forEach(update => {
      try {
        update.execute()
      } catch (error) {
        console.error('[BatchUpdate] Error in write:', error)
      }
    })
  }
  
  /**
   * 合并写操作
   */
  private mergeWrites(writes: DOMUpdate[]): DOMUpdate[] {
    const elementMap = new Map<Element, DOMUpdate[]>()
    
    writes.forEach(update => {
      if (update.element) {
        if (!elementMap.has(update.element)) {
          elementMap.set(update.element, [])
        }
        elementMap.get(update.element)!.push(update)
      }
    })
    
    const merged: DOMUpdate[] = []
    
    elementMap.forEach((updates, element) => {
      // 合并为单个更新
      merged.push({
        type: 'write',
        element,
        execute: () => {
          updates.forEach(u => u.execute())
        }
      })
    })
    
    return merged
  }
}

interface DOMUpdate {
  type: 'read' | 'write'
  element?: Element
  execute: () => void
}

interface GroupedUpdates {
  reads?: DOMUpdate[]
  writes?: DOMUpdate[]
}
```

---

## 三、按需渲染管理器（200行）

```typescript
/**
 * 按需渲染管理器
 * 只渲染可见区域的内容
 */
class OnDemandRenderer {
  private observer: IntersectionObserver
  private observedElements = new Map<Element, RenderCallback>()
  
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        root: null,
        rootMargin: '100px',  // 提前100px开始渲染
        threshold: 0.01
      }
    )
  }
  
  /**
   * 观察元素
   */
  observe(element: Element, callback: RenderCallback): void {
    this.observedElements.set(element, callback)
    this.observer.observe(element)
  }
  
  /**
   * 取消观察
   */
  unobserve(element: Element): void {
    this.observedElements.delete(element)
    this.observer.unobserve(element)
  }
  
  /**
   * 处理交叉
   */
  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      const callback = this.observedElements.get(entry.target)
      if (!callback) return
      
      if (entry.isIntersecting) {
        // 进入可见区域，渲染
        callback(true)
      } else {
        // 离开可见区域，卸载
        callback(false)
      }
    })
  }
  
  /**
   * 销毁
   */
  destroy(): void {
    this.observer.disconnect()
    this.observedElements.clear()
  }
}

type RenderCallback = (visible: boolean) => void
```

---

## 四、性能自适应策略（150行）

```typescript
/**
 * 性能自适应策略
 * 根据设备性能自动调整渲染策略
 */
class AdaptiveRenderStrategy {
  private perfMonitor: RenderPerformanceMonitor
  private currentStrategy: RenderStrategy = 'balanced'
  
  // 策略配置
  private strategies: Record<RenderStrategy, StrategyConfig> = {
    'performance': {
      maxNodes: 10000,
      enableAnimations: true,
      enableShadows: true,
      enableBlur: true,
      textureQuality: 'high',
      particleCount: 10000
    },
    'balanced': {
      maxNodes: 5000,
      enableAnimations: true,
      enableShadows: true,
      enableBlur: false,
      textureQuality: 'medium',
      particleCount: 5000
    },
    'quality': {
      maxNodes: 2000,
      enableAnimations: false,
      enableShadows: false,
      enableBlur: false,
      textureQuality: 'low',
      particleCount: 1000
    }
  }
  
  constructor(perfMonitor: RenderPerformanceMonitor) {
    this.perfMonitor = perfMonitor
    this.adjustStrategy()
  }
  
  /**
   * 调整策略
   */
  private adjustStrategy(): void {
    const level = this.perfMonitor.getPerformanceLevel()
    
    if (level === 'high') {
      this.currentStrategy = 'performance'
    } else if (level === 'medium') {
      this.currentStrategy = 'balanced'
    } else {
      this.currentStrategy = 'quality'
    }
    
    console.log(`[AdaptiveStrategy] Switched to ${this.currentStrategy} mode`)
  }
  
  /**
   * 获取当前配置
   */
  getConfig(): StrategyConfig {
    return this.strategies[this.currentStrategy]
  }
  
  /**
   * 手动设置策略
   */
  setStrategy(strategy: RenderStrategy): void {
    this.currentStrategy = strategy
    console.log(`[AdaptiveStrategy] Manually set to ${strategy} mode`)
  }
}

type RenderStrategy = 'performance' | 'balanced' | 'quality'

interface StrategyConfig {
  maxNodes: number
  enableAnimations: boolean
  enableShadows: boolean
  enableBlur: boolean
  textureQuality: 'low' | 'medium' | 'high'
  particleCount: number
}
```

---

## 五、使用示例

```typescript
/**
 * 完整使用示例
 */

// 1. 初始化组件
const perfMonitor = new RenderPerformanceMonitor()
const timeSlicedRenderer = new TimeSlicedRenderer(perfMonitor)
const batchUpdater = new BatchUpdateOptimizer()
const onDemandRenderer = new OnDemandRenderer()
const adaptiveStrategy = new AdaptiveRenderStrategy(perfMonitor)

perfMonitor.start()

// 2. 使用时间分片渲染大列表
function renderLargeList(items: any[]) {
  items.forEach((item, index) => {
    timeSlicedRenderer.schedule({
      name: `render-item-${index}`,
      priority: 1,
      execute: () => {
        renderItem(item)
      }
    })
  })
}

// 3. 使用批量更新
function updateStyles(elements: Element[]) {
  elements.forEach(el => {
    // 读操作
    batchUpdater.scheduleUpdate({
      type: 'read',
      element: el,
      execute: () => {
        const width = el.clientWidth
        console.log('Width:', width)
      }
    })
    
    // 写操作
    batchUpdater.scheduleUpdate({
      type: 'write',
      element: el,
      execute: () => {
        el.setAttribute('style', 'color: red')
      }
    })
  })
}

// 4. 使用按需渲染
function setupLazyComponents() {
  document.querySelectorAll('.lazy-component').forEach(el => {
    onDemandRenderer.observe(el, (visible) => {
      if (visible) {
        // 渲染组件
        renderComponent(el)
      } else {
        // 卸载组件
        unmountComponent(el)
      }
    })
  })
}

// 5. 使用自适应策略
function renderWithAdaptive() {
  const config = adaptiveStrategy.getConfig()
  
  // 根据配置调整渲染
  if (config.enableAnimations) {
    enableAnimations()
  } else {
    disableAnimations()
  }
  
  // 限制节点数
  const nodes = getAllNodes().slice(0, config.maxNodes)
  renderNodes(nodes)
}

// 辅助函数
function renderItem(item: any) {}
function renderComponent(el: Element) {}
function unmountComponent(el: Element) {}
function enableAnimations() {}
function disableAnimations() {}
function getAllNodes(): any[] { return [] }
function renderNodes(nodes: any[]) {}
```

---

## 六、性能优化清单

```
✅ 时间分片
  - 大任务拆分为小任务
  - 使用requestIdleCallback
  - 避免长时间阻塞主线程

✅ 批量更新
  - 合并多个DOM操作
  - 读写分离（避免layout thrashing）
  - 使用RAF合并帧

✅ 按需渲染
  - 只渲染可见区域
  - 虚拟滚动
  - IntersectionObserver监听

✅ 自适应策略
  - 根据设备性能调整
  - 动态降级/升级
  - 配置化控制

✅ GPU加速
  - 使用transform代替position
  - 启用will-change
  - 使用composite layers

✅ 内存优化
  - 对象池复用
  - 及时释放引用
  - 避免内存泄漏
```

---


```typescript
/**
 * 浏览器能力检测器
 * 检测浏览器支持的特性和API
 */
class BrowserCapabilityDetector {
  private capabilities: BrowserCapabilities
  
  constructor() {
    this.capabilities = this.detect()
  }
  
  /**
   * 检测所有能力
   */
  private detect(): BrowserCapabilities {
    return {
      // 基础能力
      browser: this.detectBrowser(),
      version: this.detectVersion(),
      platform: this.detectPlatform(),
      
      // API支持
      webgl: this.hasWebGL(),
      webgl2: this.hasWebGL2(),
      webworker: this.hasWebWorker(),
      serviceWorker: this.hasServiceWorker(),
      indexedDB: this.hasIndexedDB(),
      localStorage: this.hasLocalStorage(),
      
      // 特性支持
      customElements: this.hasCustomElements(),
      shadowDOM: this.hasShadowDOM(),
      proxy: this.hasProxy(),
      promises: this.hasPromises(),
      asyncAwait: this.hasAsyncAwait(),
      modules: this.hasModules(),
      
      // CSS特性
      cssGrid: this.hasCSSGrid(),
      cssFlexbox: this.hasCSSFlexbox(),
      cssVariables: this.hasCSSVariables(),
      cssTransform: this.hasCSSTransform(),
      
      // 性能API
      performanceObserver: this.hasPerformanceObserver(),
      intersectionObserver: this.hasIntersectionObserver(),
      resizeObserver: this.hasResizeObserver(),
      mutationObserver: this.hasMutationObserver(),
      
      // 其他
      touch: this.hasTouch(),
      pointerEvents: this.hasPointerEvents(),
      passive: this.hasPassiveEvents()
    }
  }
  
  /**
   * 检测浏览器类型
   */
  private detectBrowser(): BrowserType {
    const ua = navigator.userAgent
    
    if (/Chrome/.test(ua) && /Google Inc/.test(navigator.vendor)) {
      return 'chrome'
    } else if (/Safari/.test(ua) && /Apple/.test(navigator.vendor)) {
      return 'safari'
    } else if (/Firefox/.test(ua)) {
      return 'firefox'
    } else if (/Edge/.test(ua)) {
      return 'edge'
    } else if (/MSIE|Trident/.test(ua)) {
      return 'ie'
    }
    
    return 'unknown'
  }
  
  /**
   * 检测浏览器版本
   */
  private detectVersion(): number {
    const ua = navigator.userAgent
    const browser = this.detectBrowser()
    
    let match: RegExpMatchArray | null = null
    
    switch (browser) {
      case 'chrome':
        match = ua.match(/Chrome\/(\d+)/)
        break
      case 'safari':
        match = ua.match(/Version\/(\d+)/)
        break
      case 'firefox':
        match = ua.match(/Firefox\/(\d+)/)
        break
      case 'edge':
        match = ua.match(/Edge\/(\d+)/)
        break
      case 'ie':
        match = ua.match(/(?:MSIE |rv:)(\d+)/)
        break
    }
    
    return match ? parseInt(match[1]) : 0
  }
  
  /**
   * 检测平台
   */
  private detectPlatform(): Platform {
    const ua = navigator.userAgent
    
    if (/Android/.test(ua)) return 'android'
    if (/iPhone|iPad|iPod/.test(ua)) return 'ios'
    if (/Mac/.test(ua)) return 'macos'
    if (/Win/.test(ua)) return 'windows'
    if (/Linux/.test(ua)) return 'linux'
    
    return 'unknown'
  }
  
  // API检测
  private hasWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas')
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    } catch {
      return false
    }
  }
  
  private hasWebGL2(): boolean {
    try {
      const canvas = document.createElement('canvas')
      return !!canvas.getContext('webgl2')
    } catch {
      return false
    }
  }
  
  private hasWebWorker(): boolean {
    return typeof Worker !== 'undefined'
  }
  
  private hasServiceWorker(): boolean {
    return 'serviceWorker' in navigator
  }
  
  private hasIndexedDB(): boolean {
    return 'indexedDB' in window
  }
  
  private hasLocalStorage(): boolean {
    try {
      localStorage.setItem('test', 'test')
      localStorage.removeItem('test')
      return true
    } catch {
      return false
    }
  }
  
  // 特性检测
  private hasCustomElements(): boolean {
    return 'customElements' in window
  }
  
  private hasShadowDOM(): boolean {
    return !!HTMLElement.prototype.attachShadow
  }
  
  private hasProxy(): boolean {
    return typeof Proxy !== 'undefined'
  }
  
  private hasPromises(): boolean {
    return typeof Promise !== 'undefined'
  }
  
  private hasAsyncAwait(): boolean {
    try {
      eval('(async () => {})')
      return true
    } catch {
      return false
    }
  }
  
  private hasModules(): boolean {
    const script = document.createElement('script')
    return 'noModule' in script
  }
  
  // CSS特性
  private hasCSSGrid(): boolean {
    return this.testCSSProperty('grid-template-columns')
  }
  
  private hasCSSFlexbox(): boolean {
    return this.testCSSProperty('flex-direction')
  }
  
  private hasCSSVariables(): boolean {
    return this.testCSSProperty('--test')
  }
  
  private hasCSSTransform(): boolean {
    return this.testCSSProperty('transform')
  }
  
  private testCSSProperty(property: string): boolean {
    const el = document.createElement('div')
    return property in el.style
  }
  
  // 观察者API
  private hasPerformanceObserver(): boolean {
    return typeof PerformanceObserver !== 'undefined'
  }
  
  private hasIntersectionObserver(): boolean {
    return typeof IntersectionObserver !== 'undefined'
  }
  
  private hasResizeObserver(): boolean {
    return typeof ResizeObserver !== 'undefined'
  }
  
  private hasMutationObserver(): boolean {
    return typeof MutationObserver !== 'undefined'
  }
  
  // 其他
  private hasTouch(): boolean {
    return 'ontouchstart' in window
  }
  
  private hasPointerEvents(): boolean {
    return 'onpointerdown' in window
  }
  
  private hasPassiveEvents(): boolean {
    let supported = false
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: () => { supported = true }
      })
      window.addEventListener('test' as any, null as any, opts)
    } catch {}
    return supported
  }
  
  /**
   * 获取能力
   */
  getCapabilities(): BrowserCapabilities {
    return { ...this.capabilities }
  }
  
  /**
   * 检查是否支持特性
   */
  supports(feature: keyof BrowserCapabilities): boolean {
    return !!this.capabilities[feature]
  }
  
  /**
   * 是否是现代浏览器
   */
  isModernBrowser(): boolean {
    return this.capabilities.proxy && 
           this.capabilities.promises && 
           this.capabilities.modules &&
           this.capabilities.webgl
  }
}

// 类型定义
type BrowserType = 'chrome' | 'safari' | 'firefox' | 'edge' | 'ie' | 'unknown'
type Platform = 'windows' | 'macos' | 'linux' | 'ios' | 'android' | 'unknown'

interface BrowserCapabilities {
  browser: BrowserType
  version: number
  platform: Platform
  webgl: boolean
  webgl2: boolean
  webworker: boolean
  serviceWorker: boolean
  indexedDB: boolean
  localStorage: boolean
  customElements: boolean
  shadowDOM: boolean
  proxy: boolean
  promises: boolean
  asyncAwait: boolean
  modules: boolean
  cssGrid: boolean
  cssFlexbox: boolean
  cssVariables: boolean
  cssTransform: boolean
  performanceObserver: boolean
  intersectionObserver: boolean
  resizeObserver: boolean
  mutationObserver: boolean
  touch: boolean
  pointerEvents: boolean
  passive: boolean
}
```

---

## 二、Polyfill管理器（200行）

```typescript
/**
 * Polyfill管理器
 * 动态加载需要的polyfills
 */
class PolyfillManager {
  private detector: BrowserCapabilityDetector
  private loaded = new Set<string>()
  
  // Polyfill CDN URL
  private polyfillCDN = 'https://polyfill.io/v3/polyfill.min.js'
  
  constructor(detector: BrowserCapabilityDetector) {
    this.detector = detector
  }
  
  /**
   * 自动加载需要的polyfills
   */
  async autoLoad(): Promise<void> {
    const needed = this.detectNeededPolyfills()
    
    if (needed.length === 0) {
      console.log('[Polyfill] No polyfills needed')
      return
    }
    
    console.log('[Polyfill] Loading:', needed)
    
    await this.loadPolyfills(needed)
  }
  
  /**
   * 检测需要的polyfills
   */
  private detectNeededPolyfills(): string[] {
    const needed: string[] = []
    const caps = this.detector.getCapabilities()
    
    if (!caps.promises) needed.push('Promise')
    if (!caps.proxy) needed.push('Proxy')
    if (!caps.intersectionObserver) needed.push('IntersectionObserver')
    if (!caps.resizeObserver) needed.push('ResizeObserver')
    if (!caps.customElements) needed.push('customElements')
    
    // 数组方法
    if (!Array.prototype.includes) needed.push('Array.prototype.includes')
    if (!Array.prototype.find) needed.push('Array.prototype.find')
    if (!Array.prototype.findIndex) needed.push('Array.prototype.findIndex')
    
    // 对象方法
    if (!Object.assign) needed.push('Object.assign')
    if (!Object.entries) needed.push('Object.entries')
    if (!Object.values) needed.push('Object.values')
    
    return needed
  }
  
  /**
   * 加载polyfills
   */
  private async loadPolyfills(polyfills: string[]): Promise<void> {
    const features = polyfills.join(',')
    const url = `${this.polyfillCDN}?features=${features}`
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = url
      script.onload = () => {
        polyfills.forEach(p => this.loaded.add(p))
        console.log('[Polyfill] Loaded successfully')
        resolve()
      }
      script.onerror = () => {
        console.error('[Polyfill] Failed to load')
        reject(new Error('Polyfill load failed'))
      }
      document.head.appendChild(script)
    })
  }
  
  /**
   * 检查polyfill是否已加载
   */
  isLoaded(polyfill: string): boolean {
    return this.loaded.has(polyfill)
  }
}
```

---

## 三、降级策略管理器（100行）

```typescript
/**
 * 降级策略管理器
 * 为不支持的浏览器提供降级方案
 */
class DegradationStrategy {
  private detector: BrowserCapabilityDetector
  private strategies: Map<string, FallbackStrategy> = new Map()
  
  constructor(detector: BrowserCapabilityDetector) {
    this.detector = detector
    this.registerDefaultStrategies()
  }
  
  /**
   * 注册默认策略
   */
  private registerDefaultStrategies(): void {
    // WebGL降级
    this.register('webgl', {
      check: () => this.detector.supports('webgl'),
      fallback: () => {
        console.warn('[Degradation] WebGL not supported, using Canvas2D')
        return 'canvas2d'
      }
    })
    
    // Proxy降级
    this.register('proxy', {
      check: () => this.detector.supports('proxy'),
      fallback: () => {
        console.warn('[Degradation] Proxy not supported, using Object.defineProperty')
        return 'defineProperty'
      }
    })
    
    // IntersectionObserver降级
    this.register('intersectionObserver', {
      check: () => this.detector.supports('intersectionObserver'),
      fallback: () => {
        console.warn('[Degradation] IntersectionObserver not supported, using scroll events')
        return 'scroll'
      }
    })
  }
  
  /**
   * 注册策略
   */
  register(name: string, strategy: FallbackStrategy): void {
    this.strategies.set(name, strategy)
  }
  
  /**
   * 获取策略
   */
  get(name: string): any {
    const strategy = this.strategies.get(name)
    if (!strategy) return null
    
    return strategy.check() ? 'native' : strategy.fallback()
  }
  
  /**
   * 应用所有降级策略
   */
  applyAll(): Record<string, any> {
    const results: Record<string, any> = {}
    
    this.strategies.forEach((strategy, name) => {
      results[name] = this.get(name)
    })
    
    return results
  }
}

interface FallbackStrategy {
  check: () => boolean
  fallback: () => any
}
```

---

## 四、完整使用示例

```typescript
/**
 * 完整使用示例
 */

// 1. 初始化
const detector = new BrowserCapabilityDetector()
const polyfillManager = new PolyfillManager(detector)
const degradation = new DegradationStrategy(detector)

// 2. 启动时检测和加载
async function initCompatibility() {
  console.log('Browser:', detector.getCapabilities())
  
  // 加载polyfills
  await polyfillManager.autoLoad()
  
  // 应用降级策略
  const fallbacks = degradation.applyAll()
  console.log('Fallback strategies:', fallbacks)
  
  // 检查是否是现代浏览器
  if (!detector.isModernBrowser()) {
    showOldBrowserWarning()
  }
}

// 3. 根据能力选择实现
function createRenderer() {
  if (detector.supports('webgl2')) {
    return new WebGL2Renderer()
  } else if (detector.supports('webgl')) {
    return new WebGLRenderer()
  } else {
    return new Canvas2DRenderer()
  }
}

// 4. 事件监听器兼容
function addEventListenerSafe(
  element: Element,
  event: string,
  handler: EventListener
) {
  const options = detector.supports('passive') 
    ? { passive: true }
    : false
  
  element.addEventListener(event, handler, options)
}

// 5. CSS变量降级
function setCSSVariable(name: string, value: string) {
  if (detector.supports('cssVariables')) {
    document.documentElement.style.setProperty(name, value)
  } else {
    // 降级：直接设置到样式表
    applyLegacyCSS(name, value)
  }
}

// 辅助函数
function showOldBrowserWarning() {
  console.warn('您的浏览器版本过旧，部分功能可能无法正常使用')
}

class WebGL2Renderer {}
class WebGLRenderer {}
class Canvas2DRenderer {}

function applyLegacyCSS(name: string, value: string) {}
```

---

## 五、浏览器兼容性矩阵

```
支持的浏览器版本:

Chrome:
  ✅ 90+ (完整支持)
  🟡 80-89 (部分降级)
  ❌ <80 (不支持)

Firefox:
  ✅ 88+ (完整支持)
  🟡 78-87 (部分降级)
  ❌ <78 (不支持)

Safari:
  ✅ 14+ (完整支持)
  🟡 13 (部分降级)
  ❌ <13 (不支持)

Edge:
  ✅ 90+ (完整支持)
  🟡 80-89 (部分降级)
  ❌ <80 (不支持)

移动端:
  ✅ iOS 14+
  ✅ Android 90+
  🟡 iOS 13
  🟡 Android 80-89

关键特性支持:
  Proxy: Chrome 49+, Firefox 18+, Safari 10+
  WebGL: Chrome 9+, Firefox 4+, Safari 5.1+
  WebGL2: Chrome 56+, Firefox 51+, Safari 15+
  ES6 Modules: Chrome 61+, Firefox 60+, Safari 11+
  IntersectionObserver: Chrome 51+, Firefox 55+, Safari 12.1+
```

---

---

**参考文档**：
- [01-PLANNING-ARCHITECTURE.md](./01-PLANNING-ARCHITECTURE.md) - 架构设计
- [04-TECH-WORKLOAD-ESTIMATOR.md](./04-TECH-WORKLOAD-ESTIMATOR.md) - 工作量预估器

---

**最后更新**: 2025-11-09  
**维护者**: VJS-UI Team  
**状态**: ✅ 完成
