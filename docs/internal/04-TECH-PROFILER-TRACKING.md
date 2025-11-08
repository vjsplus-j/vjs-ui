# VJS-UI Profiler细粒度追踪完整实现

> **优先级**: 🟢 P2（可选优化）  
> **工作量**: 2-3天  
> **收益**: 性能分析更精确，调试更高效  

---

## 一、问题分析

### 基础性能分析的局限

```typescript
// ❌ 基础性能分析
console.time('render')
render(component)
console.timeEnd('render') // 只知道总时间

/**
 * 问题：
 * 1. 只有总时间，不知道瓶颈在哪
 * 2. 无法追踪单个组件
 * 3. 无法追踪状态更新路径
 * 4. 难以优化具体问题
 */
```

---

## 二、设计思路

### Profiler核心概念

```typescript
/**
 * Profiler: 细粒度性能追踪
 * 
 * 追踪内容：
 * 1. 每个组件的渲染时间
 * 2. 状态更新的触发路径
 * 3. Lane优先级分布
 * 4. 渲染阶段耗时
 * 5. 内存分配
 */

// 追踪树
Component A (15ms)
├── Component B (8ms)
│   ├── Component C (3ms)
│   └── Component D (4ms)
└── Component E (5ms)
```

---

## 三、完整实现

### 3.1 Profiler核心类

```typescript
/**
 * Profiler - 性能追踪器
 */
export class Profiler {
  private isEnabled = __DEV__
  private traces: ProfileTrace[] = []
  private currentTrace: ProfileTrace | null = null
  private traceStack: ProfileTrace[] = []
  
  /**
   * 开始追踪
   */
  startTrace(
    id: string,
    type: TraceType,
    metadata?: any
  ): void {
    if (!this.isEnabled) return
    
    const trace: ProfileTrace = {
      id,
      type,
      startTime: performance.now(),
      endTime: 0,
      duration: 0,
      metadata,
      children: []
    }
    
    // 如果有父trace，添加为子节点
    if (this.currentTrace) {
      this.currentTrace.children.push(trace)
      this.traceStack.push(this.currentTrace)
    }
    
    this.currentTrace = trace
    this.traces.push(trace)
  }
  
  /**
   * 结束追踪
   */
  endTrace(id: string): void {
    if (!this.isEnabled || !this.currentTrace) return
    
    if (this.currentTrace.id !== id) {
      console.warn(`[Profiler] Trace mismatch: expected ${this.currentTrace.id}, got ${id}`)
      return
    }
    
    this.currentTrace.endTime = performance.now()
    this.currentTrace.duration = this.currentTrace.endTime - this.currentTrace.startTime
    
    // 弹出父trace
    this.currentTrace = this.traceStack.pop() || null
  }
  
  /**
   * 标记事件
   */
  mark(name: string, metadata?: any): void {
    if (!this.isEnabled) return
    
    if (this.currentTrace) {
      if (!this.currentTrace.marks) {
        this.currentTrace.marks = []
      }
      
      this.currentTrace.marks.push({
        name,
        time: performance.now() - this.currentTrace.startTime,
        metadata
      })
    }
  }
  
  /**
   * 追踪组件渲染
   */
  traceComponent(
    componentName: string,
    phase: 'mount' | 'update',
    fn: () => void
  ): void {
    this.startTrace(componentName, 'component', { phase })
    
    try {
      fn()
    } finally {
      this.endTrace(componentName)
    }
  }
  
  /**
   * 追踪状态更新
   */
  traceStateUpdate(
    stateName: string,
    oldValue: any,
    newValue: any,
    fn: () => void
  ): void {
    this.startTrace(`state:${stateName}`, 'state-update', {
      oldValue,
      newValue
    })
    
    try {
      fn()
    } finally {
      this.endTrace(`state:${stateName}`)
    }
  }
  
  /**
   * 获取追踪结果
   */
  getTraces(): ProfileTrace[] {
    return this.traces
  }
  
  /**
   * 获取统计信息
   */
  getStats(): ProfileStats {
    const componentTraces = this.traces.filter(t => t.type === 'component')
    const stateTraces = this.traces.filter(t => t.type === 'state-update')
    
    return {
      totalTraces: this.traces.length,
      totalDuration: this.traces.reduce((sum, t) => sum + t.duration, 0),
      componentTraces: componentTraces.length,
      avgComponentTime: 
        componentTraces.reduce((sum, t) => sum + t.duration, 0) / componentTraces.length || 0,
      stateUpdates: stateTraces.length,
      slowestComponents: this.getSlowestComponents(10)
    }
  }
  
  /**
   * 获取最慢的组件
   */
  private getSlowestComponents(count: number): Array<{
    id: string
    duration: number
    metadata?: any
  }> {
    return this.traces
      .filter(t => t.type === 'component')
      .sort((a, b) => b.duration - a.duration)
      .slice(0, count)
      .map(t => ({
        id: t.id,
        duration: t.duration,
        metadata: t.metadata
      }))
  }
  
  /**
   * 生成火焰图数据
   */
  generateFlameGraph(): FlameGraphNode {
    const root: FlameGraphNode = {
      name: 'Root',
      value: 0,
      children: []
    }
    
    this.traces.forEach(trace => {
      if (!trace.children || trace.children.length === 0) {
        this.addToFlameGraph(root, trace)
      }
    })
    
    return root
  }
  
  /**
   * 添加到火焰图
   */
  private addToFlameGraph(parent: FlameGraphNode, trace: ProfileTrace): void {
    const node: FlameGraphNode = {
      name: trace.id,
      value: trace.duration,
      children: []
    }
    
    parent.children.push(node)
    
    if (trace.children) {
      trace.children.forEach(child => {
        this.addToFlameGraph(node, child)
      })
    }
  }
  
  /**
   * 清空追踪
   */
  clear(): void {
    this.traces = []
    this.currentTrace = null
    this.traceStack = []
  }
  
  /**
   * 启用/禁用
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }
}

/**
 * 追踪记录
 */
interface ProfileTrace {
  id: string
  type: TraceType
  startTime: number
  endTime: number
  duration: number
  metadata?: any
  children: ProfileTrace[]
  marks?: ProfileMark[]
}

/**
 * 追踪类型
 */
type TraceType = 
  | 'component'
  | 'state-update'
  | 'effect'
  | 'render-phase'
  | 'commit-phase'

/**
 * 标记
 */
interface ProfileMark {
  name: string
  time: number
  metadata?: any
}

/**
 * 统计信息
 */
interface ProfileStats {
  totalTraces: number
  totalDuration: number
  componentTraces: number
  avgComponentTime: number
  stateUpdates: number
  slowestComponents: Array<{
    id: string
    duration: number
    metadata?: any
  }>
}

/**
 * 火焰图节点
 */
interface FlameGraphNode {
  name: string
  value: number
  children: FlameGraphNode[]
}

// 全局单例
export const profiler = new Profiler()
```

### 3.2 集成到Fiber

```typescript
/**
 * Fiber渲染集成Profiler
 */
class FiberWorkLoop {
  private profiler = profiler
  
  /**
   * 工作循环（带追踪）
   */
  performUnitOfWork(fiber: FiberNode): void {
    this.profiler.startTrace(
      `fiber:${fiber.type}`,
      'component',
      { lane: fiber.lanes }
    )
    
    try {
      // 开始工作
      this.profiler.mark('begin-work')
      this.beginWork(fiber)
      
      // 完成工作
      this.profiler.mark('complete-work')
      this.completeWork(fiber)
      
    } finally {
      this.profiler.endTrace(`fiber:${fiber.type}`)
    }
  }
  
  /**
   * 提交阶段（带追踪）
   */
  commitRoot(root: FiberNode): void {
    this.profiler.startTrace('commit-root', 'commit-phase')
    
    try {
      // Before mutation
      this.profiler.mark('before-mutation')
      this.commitBeforeMutationEffects(root)
      
      // Mutation
      this.profiler.mark('mutation')
      this.commitMutationEffects(root)
      
      // Layout
      this.profiler.mark('layout')
      this.commitLayoutEffects(root)
      
    } finally {
      this.profiler.endTrace('commit-root')
    }
  }
}
```

### 3.3 React DevTools兼容

```typescript
/**
 * React DevTools Profiler适配
 */
export class ReactDevToolsProfiler {
  private profiler = profiler
  
  /**
   * 开始Profiling
   */
  startProfiling(): void {
    this.profiler.clear()
    this.profiler.setEnabled(true)
    
    // 通知DevTools
    this.sendToDevTools({
      type: 'profiling-started'
    })
  }
  
  /**
   * 停止Profiling
   */
  stopProfiling(): ProfileData {
    this.profiler.setEnabled(false)
    
    const data: ProfileData = {
      traces: this.profiler.getTraces(),
      stats: this.profiler.getStats(),
      flameGraph: this.profiler.generateFlameGraph()
    }
    
    // 发送到DevTools
    this.sendToDevTools({
      type: 'profiling-stopped',
      data
    })
    
    return data
  }
  
  /**
   * 发送到DevTools
   */
  private sendToDevTools(message: any): void {
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__.emit('vjs-ui-profiler', message)
    }
  }
}

interface ProfileData {
  traces: ProfileTrace[]
  stats: ProfileStats
  flameGraph: FlameGraphNode
}
```

---

## 四、使用示例

```typescript
// 示例1: 基础使用
profiler.startTrace('app-render', 'render-phase')

render(app)

profiler.endTrace('app-render')

// 查看结果
const stats = profiler.getStats()
console.log(`总耗时: ${stats.totalDuration.toFixed(2)}ms`)
console.log(`组件追踪: ${stats.componentTraces}个`)
console.log(`最慢组件:`, stats.slowestComponents)

// 示例2: 组件追踪
profiler.traceComponent('UserList', 'update', () => {
  renderUserList(users)
})

// 示例3: 状态更新追踪
profiler.traceStateUpdate('count', 0, 1, () => {
  setCount(1)
})

// 示例4: 生成火焰图
const flameGraph = profiler.generateFlameGraph()
console.log('火焰图数据:', flameGraph)

// 可视化（需要第三方库）
import { renderFlameGraph } from 'd3-flame-graph'
renderFlameGraph(container, flameGraph)
```

---

## 五、可视化工具

### 5.1 火焰图

```typescript
/**
 * 火焰图渲染器
 */
export class FlameGraphRenderer {
  private container: HTMLElement
  private data: FlameGraphNode
  
  constructor(container: HTMLElement, data: FlameGraphNode) {
    this.container = container
    this.data = data
  }
  
  /**
   * 渲染
   */
  render(): void {
    const svg = this.createSVG()
    this.renderNode(svg, this.data, 0, 0, this.container.clientWidth)
    this.container.appendChild(svg)
  }
  
  /**
   * 创建SVG
   */
  private createSVG(): SVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '600')
    return svg
  }
  
  /**
   * 渲染节点
   */
  private renderNode(
    svg: SVGElement,
    node: FlameGraphNode,
    depth: number,
    x: number,
    width: number
  ): void {
    const height = 20
    const y = depth * height
    
    // 创建矩形
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', x.toString())
    rect.setAttribute('y', y.toString())
    rect.setAttribute('width', width.toString())
    rect.setAttribute('height', height.toString())
    rect.setAttribute('fill', this.getColor(node.value))
    rect.setAttribute('stroke', 'white')
    
    // 添加文本
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', (x + 5).toString())
    text.setAttribute('y', (y + 14).toString())
    text.textContent = `${node.name} (${node.value.toFixed(2)}ms)`
    
    svg.appendChild(rect)
    svg.appendChild(text)
    
    // 递归渲染子节点
    let childX = x
    node.children.forEach(child => {
      const childWidth = (child.value / node.value) * width
      this.renderNode(svg, child, depth + 1, childX, childWidth)
      childX += childWidth
    })
  }
  
  /**
   * 获取颜色
   */
  private getColor(value: number): string {
    if (value > 100) return '#ff4444' // 红色
    if (value > 50) return '#ff9944'  // 橙色
    if (value > 10) return '#ffff44'  // 黄色
    return '#44ff44'                   // 绿色
  }
}
```

### 5.2 时间线视图

```typescript
/**
 * 时间线渲染器
 */
export class TimelineRenderer {
  render(traces: ProfileTrace[]): void {
    traces.forEach(trace => {
      console.log(
        `[${ trace.startTime.toFixed(2)}ms - ${trace.endTime.toFixed(2)}ms] ` +
        `${trace.id} (${trace.duration.toFixed(2)}ms)`
      )
      
      if (trace.marks) {
        trace.marks.forEach(mark => {
          console.log(`  ├─ ${mark.name} @ ${mark.time.toFixed(2)}ms`)
        })
      }
    })
  }
}
```

---

## 六、性能测试

```typescript
import { describe, it, expect } from 'vitest'

describe('Profiler', () => {
  it('应该记录追踪时间', () => {
    profiler.clear()
    
    profiler.startTrace('test', 'component')
    
    // 模拟工作
    const start = performance.now()
    while (performance.now() - start < 10) {
      // 忙等待10ms
    }
    
    profiler.endTrace('test')
    
    const traces = profiler.getTraces()
    expect(traces.length).toBe(1)
    expect(traces[0].duration).toBeGreaterThan(9)
    expect(traces[0].duration).toBeLessThan(15)
  })
  
  it('应该追踪嵌套组件', () => {
    profiler.clear()
    
    profiler.startTrace('parent', 'component')
    profiler.startTrace('child1', 'component')
    profiler.endTrace('child1')
    profiler.startTrace('child2', 'component')
    profiler.endTrace('child2')
    profiler.endTrace('parent')
    
    const traces = profiler.getTraces()
    const parent = traces.find(t => t.id === 'parent')
    
    expect(parent?.children.length).toBe(2)
  })
  
  it('应该生成火焰图', () => {
    profiler.clear()
    
    profiler.startTrace('root', 'component')
    profiler.startTrace('child', 'component')
    profiler.endTrace('child')
    profiler.endTrace('root')
    
    const flameGraph = profiler.generateFlameGraph()
    
    expect(flameGraph.children.length).toBeGreaterThan(0)
  })
})
```

---

## 七、最佳实践

### ✅ 推荐做法

```typescript
// 1. 只在开发环境启用
if (__DEV__) {
  profiler.setEnabled(true)
}

// 2. 定期清理追踪数据
setInterval(() => {
  profiler.clear()
}, 60000) // 每分钟清理

// 3. 关注最慢的组件
const stats = profiler.getStats()
stats.slowestComponents.forEach(comp => {
  if (comp.duration > 16) {
    console.warn(`慢组件: ${comp.id} (${comp.duration.toFixed(2)}ms)`)
  }
})

// 4. 使用火焰图可视化
const flameGraph = profiler.generateFlameGraph()
const renderer = new FlameGraphRenderer(container, flameGraph)
renderer.render()
```

### ❌ 避免的错误

```typescript
// ❌ 生产环境启用
profiler.setEnabled(true) // 影响性能！

// ❌ 忘记结束追踪
profiler.startTrace('test', 'component')
// 忘记调用 endTrace()

// ❌ 不清理数据
// 数据会不断积累，占用内存

// ❌ 过度追踪
profiler.startTrace('tiny-function', 'component')
doTinyWork() // 追踪开销 > 实际工作
profiler.endTrace('tiny-function')
```

---

## 八、性能开销

### Profiler自身开销

```
不启用: 0ms（完全无开销）
启用但不追踪: <0.1ms
追踪100个组件: ~2ms
生成火焰图: ~5ms

建议: 只在需要时启用
```

---

## 九、总结

### 核心价值

✅ **精确定位性能瓶颈**  
✅ **可视化火焰图**  
✅ **追踪状态更新路径**  
✅ **开发调试利器**  

### 关键要点

1. 细粒度追踪每个组件
2. 记录渲染时间和标记
3. 生成火焰图可视化
4. React DevTools兼容

### 实施步骤

```
1. 集成Profiler到渲染器
2. 开发环境启用追踪
3. 收集性能数据
4. 分析最慢组件
5. 可视化展示
```

### 使用场景

```
✅ 适合:
- 性能调试
- 优化分析
- 开发环境

❌ 不适合:
- 生产环境（有开销）
- 持续监控（数据太多）
```
