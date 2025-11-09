# 响应式系统技术文档（第3部分）

> 接第2部分：常见Bug、避免错误、测试策略

---

## 🐛 常见Bug

### Bug清单

| Bug | 严重度 | 触发条件 | 现象 | 解决方案 | 状态 |
|-----|--------|---------|------|---------|------|
| 数组push不触发 | 🔴 高 | arr.push() | UI不更新 | 拦截数组方法 | ⚠️ 待修复 |
| watch不停止 | 🟡 中 | 未调用unwatch | 内存泄漏 | 清理effect | ⚠️ 待修复 |
| computed死循环 | 🔴 高 | 循环依赖 | 栈溢出 | 依赖检测 | ⏳ 待实现 |
| ref解包错误 | 🟡 中 | reactive中的ref | 访问.value.value | 自动解包 | ⏳ 待实现 |

### Bug详细分析

#### Bug1：数组push不触发更新

**Bug描述**：
- 调用数组的push、pop等方法后，effect不执行
- 原因：Proxy只拦截属性访问，不拦截方法调用
- 影响：数组操作的响应式失效

**触发条件**：
```typescript
const state = reactive({ items: [1, 2, 3] })

effect(() => {
  console.log('Length:', state.items.length)
})
// 输出: Length: 3

state.items.push(4)
// ❌ 没有输出！effect未触发
```

**解决方案**：见Part 2中的数组方法拦截实现

---

## ⚠️ 避免错误

### 常见错误清单

#### 错误1：忘记调用unwatch

**错误示例**：
```typescript
// ❌ 错误
export default {
  mounted() {
    watch(() => this.count, (newVal) => {
      console.log(newVal)
    })
  }
  // 组件卸载，watch未停止！
}
```

**正确做法**：
```typescript
// ✅ 正确
export default {
  data() {
    return { unwatch: null }
  },
  mounted() {
    this.unwatch = watch(() => this.count, (newVal) => {
      console.log(newVal)
    })
  },
  unmounted() {
    if (this.unwatch) {
      this.unwatch()
    }
  }
}
```

#### 错误2：在computed中修改状态

**错误示例**：
```typescript
// ❌ 错误
const count = ref(0)
const double = computed(() => {
  count.value++  // 修改依赖！
  return count.value * 2
})
```

**正确做法**：
```typescript
// ✅ 正确
const double = computed(() => {
  return count.value * 2
})
```

---

## ✅ 测试策略

### 测试用例

#### 测试1：基础响应式

```typescript
describe('reactive', () => {
  it('should make object reactive', () => {
    const original = { count: 0 }
    const observed = reactive(original)
    
    let dummy
    effect(() => {
      dummy = observed.count
    })
    
    expect(dummy).toBe(0)
    observed.count = 7
    expect(dummy).toBe(7)
  })
})
```

#### 测试2：computed缓存

```typescript
describe('computed', () => {
  it('should cache value', () => {
    const value = reactive({ count: 0 })
    let computeCount = 0
    
    const c = computed(() => {
      computeCount++
      return value.count
    })
    
    expect(c.value).toBe(0)
    expect(computeCount).toBe(1)
    
    // 多次访问，只计算一次
    c.value
    c.value
    expect(computeCount).toBe(1)
    
    // 依赖变化，重新计算
    value.count = 1
    expect(c.value).toBe(1)
    expect(computeCount).toBe(2)
  })
})
```

---

**（响应式系统Part 3完成！）**
