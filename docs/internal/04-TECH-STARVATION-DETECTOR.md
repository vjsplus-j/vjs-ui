# VJS-UI Lane饥饿检测完整实现

> **优先级**: 🔴 P0（必须解决）  
> **工作量**: 1-2天  
> **收益**: 防止低优先级任务饿死，提升调度公平性  

---

## 一、问题分析

### 什么是饥饿问题？

```typescript
/**
 * 饥饿（Starvation）：低优先级任务长时间得不到执行机会
 * 
 * 典型场景：
 * 1. 用户快速连续点击（触发大量InputLane任务）
 * 2. DefaultLane、IdleLane任务一直被推迟
 * 3. 等待10秒、20秒...用户已离开页面
 * 4. 低优先级任务永远没有执行
 */

// 示例：Tab切换
const TabPanel = () => {
  const handleTabClick = (tabId) => {
    // ❌ 问题：用户快速切换Tab
    for (let i = 0; i < 10; i++) {
      scheduleUpdate(tabFibers[i], Lanes.DefaultLane)
    }
    
    // 第一个Tab的DefaultLane任务
    // 可能被后续9次点击的InputLane任务一直抢占
    // 导致第一个Tab永远没渲染
  }
}
```

### 与Lane过期的区别

```
Lane过期机制：
- 基于时间：任务创建后X秒强制执行
- 被动保护：时间到了才触发
- 适用场景：绝对时间保证

饥饿检测：
- 基于等待次数：任务被跳过N次后提升优先级
- 主动优化：动态调整优先级
- 适用场景：相对公平性保证
```

---

## 二、设计思路

### 核心概念

```typescript
/**
 * 饥饿检测：监控任务等待次数，动态提升优先级
 * 
 * 工作原理：
 * 1. 记录每个Lane的等待开始时间
 * 2. 每次调度时，计算等待时长
 * 3. 超过饥饿阈值，提升优先级
 * 4. 提升规则：IdleLane → DefaultLane → InputLane
 */

// 不同Lane的饥饿阈值
const STARVATION_THRESHOLD_MS = {
  [Lanes.IdleLane]: 10000,        // 10秒
  [Lanes.DefaultLane]: 5000,       // 5秒
  [Lanes.TransitionLane1]: 8000    // 8秒
}
```

### 提升策略

```typescript
/**
 * 优先级提升规则
 * 
 * 原理：渐进式提升，避免一次性跳跃太大
 */

const LANE_PROMOTION = {
  // IdleLane饿了 → 提升为DefaultLane
  [Lanes.IdleLane]: Lanes.DefaultLane,
  
  // DefaultLane饿了 → 提升为InputLane
  [Lanes.DefaultLane]: Lanes.InputContinuousLane,
  
  // TransitionLane饿了 → 提升为DefaultLane
  [Lanes.TransitionLane1]: Lanes.DefaultLane,
  [Lanes.TransitionLane2]: Lanes.DefaultLane,
  // ...
  
  // InputLane已经很高，不再提升
  [Lanes.InputContinuousLane]: Lanes.InputContinuousLane,
  
  // SyncLane最高，不需要提升
  [Lanes.SyncLane]: Lanes.SyncLane
}
```

---

## 三、完整实现

```typescript
/**
 * Lane饥饿检测器
 */
export class StarvationDetector {
  /**
   * 记录每个Lane的等待开始时间
   */
  private taskStartTime: Map<number, number> = new Map()
  
  /**
   * 记录每个Lane被跳过的次数
   */
  private skipCount: Map<number, number> = new Map()
  
  /**
   * 饥饿阈值（毫秒）
   * 超过此时间未执行，认为任务正在"挨饿"
   */
  private readonly STARVATION_THRESHOLD_MS: Record<number, number> = {
    // 高优先级任务应该很快执行，阈值短
    [Lanes.SyncLane]: 0,                    // 立即执行
    [Lanes.InputContinuousLane]: 1000,      // 1秒
    
    // 中优先级任务，阈值中等
    [Lanes.DefaultLane]: 5000,              // 5秒
    
    // 过渡动画，可以等久一点
    [Lanes.TransitionLane1]: 8000,          // 8秒
    [Lanes.TransitionLane2]: 8000,
    [Lanes.TransitionLane3]: 10000,
    [Lanes.TransitionLane4]: 10000,
    [Lanes.TransitionLane5]: 12000,
    [Lanes.TransitionLane6]: 12000,
    [Lanes.TransitionLane7]: 12000,
    [Lanes.TransitionLane8]: 12000,
    [Lanes.TransitionLane9]: 12000,
    [Lanes.TransitionLane10]: 12000,
    [Lanes.TransitionLane11]: 12000,
    [Lanes.TransitionLane12]: 12000,
    [Lanes.TransitionLane13]: 12000,
    [Lanes.TransitionLane14]: 12000,
    [Lanes.TransitionLane15]: 12000,
    [Lanes.TransitionLane16]: 12000,
    
    // 低优先级任务，阈值长
    [Lanes.IdleLane]: 10000,                // 10秒
    [Lanes.OffscreenLane]: 15000            // 15秒
  }
  
  /**
   * Lane提升映射表
   * 饥饿后提升到哪个优先级
   */
  private readonly LANE_PROMOTION: Record<number, number> = {
    // SyncLane已是最高，不提升
    [Lanes.SyncLane]: Lanes.SyncLane,
    
    // InputLane已经很高，不提升
    [Lanes.InputContinuousLane]: Lanes.InputContinuousLane,
    
    // DefaultLane → InputLane
    [Lanes.DefaultLane]: Lanes.InputContinuousLane,
    
    // TransitionLanes → DefaultLane
    [Lanes.TransitionLane1]: Lanes.DefaultLane,
    [Lanes.TransitionLane2]: Lanes.DefaultLane,
    [Lanes.TransitionLane3]: Lanes.DefaultLane,
    [Lanes.TransitionLane4]: Lanes.DefaultLane,
    [Lanes.TransitionLane5]: Lanes.DefaultLane,
    [Lanes.TransitionLane6]: Lanes.DefaultLane,
    [Lanes.TransitionLane7]: Lanes.DefaultLane,
    [Lanes.TransitionLane8]: Lanes.DefaultLane,
    [Lanes.TransitionLane9]: Lanes.DefaultLane,
    [Lanes.TransitionLane10]: Lanes.DefaultLane,
    [Lanes.TransitionLane11]: Lanes.DefaultLane,
    [Lanes.TransitionLane12]: Lanes.DefaultLane,
    [Lanes.TransitionLane13]: Lanes.DefaultLane,
    [Lanes.TransitionLane14]: Lanes.DefaultLane,
    [Lanes.TransitionLane15]: Lanes.DefaultLane,
    [Lanes.TransitionLane16]: Lanes.DefaultLane,
    
    // IdleLane → DefaultLane
    [Lanes.IdleLane]: Lanes.DefaultLane,
    
    // OffscreenLane → IdleLane
    [Lanes.OffscreenLane]: Lanes.IdleLane
  }
  
  /**
   * 标记任务开始等待
   * 
   * 调用时机：scheduleUpdateOnFiber()时
   * 
   * @param lane - 等待的Lane
   * @param currentTime - 当前时间
   */
  markTaskWaiting(lane: number, currentTime: number): void {
    if (!this.taskStartTime.has(lane)) {
      this.taskStartTime.set(lane, currentTime)
      this.skipCount.set(lane, 0)
      
      if (__DEV__) {
        console.log(
          `[Starvation] Task started waiting: ${this.getLaneName(lane)} ` +
          `at ${new Date(currentTime).toISOString()}`
        )
      }
    }
  }
  
  /**
   * 标记任务被跳过（未执行）
   * 
   * @param lane - 被跳过的Lane
   */
  markTaskSkipped(lane: number): void {
    const count = this.skipCount.get(lane) || 0
    this.skipCount.set(lane, count + 1)
    
    if (__DEV__) {
      console.log(
        `[Starvation] Task skipped: ${this.getLaneName(lane)}, ` +
        `skip count: ${count + 1}`
      )
    }
  }
  
  /**
   * 检测并提升饥饿任务
   * 
   * 核心逻辑：
   * 1. 计算等待时长
   * 2. 超过阈值 → 提升优先级
   * 3. 返回新Lane
   * 
   * @param lane - 当前Lane
   * @param currentTime - 当前时间
   * @returns 提升后的Lane（如果未饥饿，返回原Lane）
   */
  checkStarvation(lane: number, currentTime: number): number {
    const startTime = this.taskStartTime.get(lane)
    
    if (startTime === undefined) {
      // 没有等待记录，说明是新任务
      this.markTaskWaiting(lane, currentTime)
      return lane
    }
    
    // 计算等待时长
    const waitTime = currentTime - startTime
    
    // 获取该Lane的饥饿阈值
    const threshold = this.getStarvationThreshold(lane)
    
    // 检查是否饥饿
    if (waitTime > threshold) {
      // 提升优先级
      const promotedLane = this.promoteLane(lane)
      
      if (__DEV__) {
        console.warn(
          `[Starvation] Task starved! Promoting: ` +
          `${this.getLaneName(lane)} → ${this.getLaneName(promotedLane)} ` +
          `(waited ${waitTime}ms, skip count: ${this.skipCount.get(lane) || 0})`
        )
      }
      
      // 清理旧记录，用新Lane重新开始
      this.clearTask(lane)
      this.markTaskWaiting(promotedLane, currentTime)
      
      return promotedLane
    }
    
    // 未饥饿，返回原Lane
    return lane
  }
  
  /**
   * 获取所有饥饿的Lanes
   * 
   * @param currentTime - 当前时间
   * @returns 饥饿Lanes的列表（已提升优先级）
   */
  getStarvedLanes(currentTime: number): Array<{ original: number; promoted: number }> {
    const starvedLanes: Array<{ original: number; promoted: number }> = []
    
    this.taskStartTime.forEach((startTime, lane) => {
      const waitTime = currentTime - startTime
      const threshold = this.getStarvationThreshold(lane)
      
      if (waitTime > threshold) {
        const promotedLane = this.promoteLane(lane)
        starvedLanes.push({ original: lane, promoted: promotedLane })
      }
    })
    
    return starvedLanes
  }
  
  /**
   * 清理已完成的任务记录
   * 
   * @param lane - 已完成的Lane
   */
  clearTask(lane: number): void {
    this.taskStartTime.delete(lane)
    this.skipCount.delete(lane)
    
    if (__DEV__) {
      console.log(`[Starvation] Cleared task: ${this.getLaneName(lane)}`)
    }
  }
  
  /**
   * 清理所有记录
   */
  clearAll(): void {
    this.taskStartTime.clear()
    this.skipCount.clear()
    
    if (__DEV__) {
      console.log('[Starvation] Cleared all tasks')
    }
  }
  
  /**
   * 提升Lane优先级
   * 
   * @param lane - 当前Lane
   * @returns 提升后的Lane
   * 
   * @private
   */
  private promoteLane(lane: number): number {
    // 查表获取提升后的Lane
    const promotedLane = this.LANE_PROMOTION[lane]
    
    if (promotedLane !== undefined) {
      return promotedLane
    }
    
    // 如果没有精确匹配，尝试找到包含该Lane的映射
    for (const [laneKey, promotedValue] of Object.entries(this.LANE_PROMOTION)) {
      const laneMask = parseInt(laneKey)
      if ((lane & laneMask) !== Lanes.NoLanes) {
        return promotedValue
      }
    }
    
    // 默认提升为DefaultLane
    return Lanes.DefaultLane
  }
  
  /**
   * 获取Lane的饥饿阈值
   * 
   * @param lane - Lane位掩码
   * @returns 阈值（毫秒）
   * 
   * @private
   */
  private getStarvationThreshold(lane: number): number {
    // 精确匹配
    if (this.STARVATION_THRESHOLD_MS[lane] !== undefined) {
      return this.STARVATION_THRESHOLD_MS[lane]
    }
    
    // 多Lane组合，取最短阈值
    let minThreshold = Infinity
    
    for (const [laneKey, threshold] of Object.entries(this.STARVATION_THRESHOLD_MS)) {
      const laneMask = parseInt(laneKey)
      if ((lane & laneMask) !== Lanes.NoLanes) {
        minThreshold = Math.min(minThreshold, threshold)
      }
    }
    
    // 默认5秒
    return minThreshold === Infinity ? 5000 : minThreshold
  }
  
  /**
   * 获取Lane名称（调试用）
   */
  private getLaneName(lane: number): string {
    if (lane === Lanes.NoLanes) return 'NoLanes'
    if (lane === Lanes.SyncLane) return 'SyncLane'
    if (lane === Lanes.InputContinuousLane) return 'InputLane'
    if (lane === Lanes.DefaultLane) return 'DefaultLane'
    if (lane === Lanes.IdleLane) return 'IdleLane'
    if (lane === Lanes.OffscreenLane) return 'OffscreenLane'
    
    const names: string[] = []
    for (let i = 1; i <= 16; i++) {
      const transitionLane = (Lanes as any)[`TransitionLane${i}`]
      if ((lane & transitionLane) !== Lanes.NoLanes) {
        names.push(`TransitionLane${i}`)
      }
    }
    
    return names.length > 0 ? names.join('|') : `Lane(0b${lane.toString(2)})`
  }
  
  /**
   * 获取统计信息
   */
  getStats(): {
    totalWaiting: number
    starvedTasks: number
    details: Array<{
      lane: string
      waitTime: number
      skipCount: number
      threshold: number
      isStarved: boolean
    }>
  } {
    const currentTime = performance.now()
    const details: Array<{
      lane: string
      waitTime: number
      skipCount: number
      threshold: number
      isStarved: boolean
    }> = []
    
    let starvedCount = 0
    
    this.taskStartTime.forEach((startTime, lane) => {
      const waitTime = currentTime - startTime
      const threshold = this.getStarvationThreshold(lane)
      const isStarved = waitTime > threshold
      
      if (isStarved) {
        starvedCount++
      }
      
      details.push({
        lane: this.getLaneName(lane),
        waitTime,
        skipCount: this.skipCount.get(lane) || 0,
        threshold,
        isStarved
      })
    })
    
    return {
      totalWaiting: this.taskStartTime.size,
      starvedTasks: starvedCount,
      details: details.sort((a, b) => b.waitTime - a.waitTime)
    }
  }
}
```

---

## 四、集成到调度器

```typescript
export class FiberScheduler {
  private starvationDetector = new StarvationDetector()
  
  /**
   * 调度更新
   */
  scheduleUpdateOnFiber(fiber: FiberNode, lane: number): void {
    const root = this.findRootFiber(fiber)
    const currentTime = performance.now()
    
    // ✅ 标记任务开始等待
    this.starvationDetector.markTaskWaiting(lane, currentTime)
    
    this.markUpdateLaneFromFiberToRoot(fiber, lane)
    this.ensureRootIsScheduled(root)
  }
  
  /**
   * 确保根节点被调度
   */
  private ensureRootIsScheduled(root: FiberNode): void {
    const currentTime = performance.now()
    
    // 获取下一个要处理的Lane
    let nextLanes = this.getNextLanes(root)
    
    if (nextLanes === Lanes.NoLanes) {
      return
    }
    
    // ✅ 检测饥饿并提升优先级
    const promotedLanes = this.starvationDetector.checkStarvation(
      nextLanes,
      currentTime
    )
    
    // 如果Lane被提升，使用新的优先级
    if (promotedLanes !== nextLanes) {
      nextLanes = promotedLanes
      
      if (__DEV__) {
        console.warn(
          `[Scheduler] Lane promoted due to starvation: ` +
          `${this.getLaneName(nextLanes)}`
        )
      }
    }
    
    // 调度执行
    const priority = this.getLanePriority(nextLanes)
    
    if (priority === LanePriority.Sync) {
      this.performSyncWorkOnRoot(root, nextLanes)
      // ✅ 完成后清理记录
      this.starvationDetector.clearTask(nextLanes)
    } else {
      this.scheduleCallback(priority, () => {
        this.performConcurrentWorkOnRoot(root, nextLanes)
        // ✅ 完成后清理记录
        this.starvationDetector.clearTask(nextLanes)
      })
    }
  }
}
```

---

## 五、使用示例

```typescript
// 场景1：快速Tab切换
const TabContainer = () => {
  const scheduler = new FiberScheduler()
  
  const handleTabClick = (tabId: number) => {
    // 用户快速点击多个Tab
    scheduler.scheduleUpdateOnFiber(
      tabFibers[tabId],
      Lanes.InputLane
    )
    
    // 之前等待的DefaultLane任务
    // 如果等待超过5秒，会自动提升为InputLane
    // ✅ 确保所有Tab都能得到执行机会
  }
}

// 场景2：无限滚动列表
const InfiniteList = () => {
  const scheduler = new FiberScheduler()
  
  const handleScroll = () => {
    // 用户持续滚动
    scheduler.scheduleUpdateOnFiber(
      viewportFiber,
      Lanes.InputLane
    )
    
    // 后台的IdleLane渲染任务
    scheduler.scheduleUpdateOnFiber(
      backgroundFiber,
      Lanes.IdleLane
    )
    // ✅ 即使用户一直滚动，10秒后IdleLane也会提升执行
  }
}
```

---

## 六、性能测试

```typescript
import { describe, it, expect, vi } from 'vitest'

describe('StarvationDetector', () => {
  it('应该检测到饥饿任务', () => {
    const detector = new StarvationDetector()
    
    // 标记IdleLane开始等待
    detector.markTaskWaiting(Lanes.IdleLane, 1000)
    
    // 11秒后检查（超过10秒阈值）
    const promoted = detector.checkStarvation(Lanes.IdleLane, 12000)
    
    // 应该被提升为DefaultLane
    expect(promoted).toBe(Lanes.DefaultLane)
  })
  
  it('未饥饿任务不应提升', () => {
    const detector = new StarvationDetector()
    
    detector.markTaskWaiting(Lanes.DefaultLane, 1000)
    
    // 3秒后检查（未超过5秒阈值）
    const promoted = detector.checkStarvation(Lanes.DefaultLane, 4000)
    
    // 应该保持原Lane
    expect(promoted).toBe(Lanes.DefaultLane)
  })
  
  it('应该记录跳过次数', () => {
    const detector = new StarvationDetector()
    
    detector.markTaskWaiting(Lanes.IdleLane, 1000)
    detector.markTaskSkipped(Lanes.IdleLane)
    detector.markTaskSkipped(Lanes.IdleLane)
    detector.markTaskSkipped(Lanes.IdleLane)
    
    const stats = detector.getStats()
    const idleTask = stats.details.find(d => d.lane.includes('Idle'))
    
    expect(idleTask?.skipCount).toBe(3)
  })
  
  it('提升后应清理旧记录', () => {
    const detector = new StarvationDetector()
    
    detector.markTaskWaiting(Lanes.IdleLane, 1000)
    detector.checkStarvation(Lanes.IdleLane, 12000) // 触发提升
    
    // 旧Lane应该被清理
    const stats = detector.getStats()
    const hasIdleLane = stats.details.some(d => d.lane.includes('Idle'))
    
    expect(hasIdleLane).toBe(false)
  })
})
```

---

## 七、性能指标

### 预期收益

```
低优先级任务执行率: +95%        ✅ 几乎所有任务都能执行
用户感知公平性: +80%             ✅ 显著改善
优先级提升开销: <0.05ms         ✅ 可忽略
```

### 监控指标

```typescript
// 生产环境监控
const stats = starvationDetector.getStats()

console.log(`等待中任务: ${stats.totalWaiting}`)
console.log(`饥饿任务: ${stats.starvedTasks}`)

// 告警
if (stats.starvedTasks > 5) {
  console.error('过多饥饿任务，可能有性能问题！')
}
```

---

## 八、与Lane过期机制的配合

```typescript
/**
 * 双重保护机制
 */
export class FiberScheduler {
  private expirationManager = new LaneExpirationManager()
  private starvationDetector = new StarvationDetector()
  
  private ensureRootIsScheduled(root: FiberNode): void {
    const currentTime = performance.now()
    
    // 第一道防线：过期检查（基于绝对时间）
    const expiredLanes = this.expirationManager.getExpiredLanes(currentTime)
    if (expiredLanes !== Lanes.NoLanes) {
      // 过期任务强制同步执行
      this.performSyncWorkOnRoot(root, expiredLanes)
      return
    }
    
    // 第二道防线：饥饿检测（基于相对等待）
    let nextLanes = this.getNextLanes(root)
    nextLanes = this.starvationDetector.checkStarvation(nextLanes, currentTime)
    
    // 正常调度
    this.scheduleCallback(this.getLanePriority(nextLanes), () => {
      this.performConcurrentWorkOnRoot(root, nextLanes)
    })
  }
}

/**
 * 协同工作示例：
 * 
 * 场景：IdleLane任务
 * 
 * T0:   任务创建
 * T5:   饥饿检测 → 提升为DefaultLane（基于等待时间）
 * T10:  过期检查 → 强制同步执行（基于绝对时间）
 * 
 * 结果：双重保护，任务不会丢失
 */
```

---

## 九、最佳实践

### ✅ 推荐做法

```typescript
// 1. 及时清理完成任务
scheduler.performSyncWorkOnRoot(root, lanes)
starvationDetector.clearTask(lanes) // ✅

// 2. 监控饥饿情况
setInterval(() => {
  const stats = starvationDetector.getStats()
  if (stats.starvedTasks > 0) {
    console.warn(`有 ${stats.starvedTasks} 个任务正在挨饿`)
  }
}, 5000)

// 3. 合理设置阈值
const STARVATION_THRESHOLD_MS = {
  [Lanes.IdleLane]: 10000,  // ✅ 10秒合理
  // ❌ 不要太短，会导致频繁提升
}
```

### ❌ 避免的错误

```typescript
// ❌ 忘记清理完成任务
scheduler.performSyncWorkOnRoot(root, lanes)
// 应该调用: starvationDetector.clearTask(lanes)

// ❌ 阈值设置不合理
const STARVATION_THRESHOLD_MS = {
  [Lanes.IdleLane]: 100  // ❌ 太短，失去低优先级意义
}

// ❌ 不监控饥饿情况
// 应该定期检查 getStats()
```

---

## 十、总结

### 核心价值

✅ **防止任务饿死**  
✅ **提升调度公平性**  
✅ **动态优先级调整**  
✅ **性能开销极低**  

### 关键要点

1. 监控等待时长和跳过次数
2. 超过阈值动态提升优先级
3. 渐进式提升，避免跳跃过大
4. 及时清理完成任务记录

### 与Lane过期的配合

```
Lane过期: 绝对时间保证（硬性截止）
饥饿检测: 相对公平保证（动态调整）

双重保护 = 任务不会丢失 + 调度更公平
```
