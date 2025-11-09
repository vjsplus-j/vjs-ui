# VJS-UI 响应式系统

> 完整的响应式引擎 - VJS-UI的数据响应核心

---

## 📋 功能对比表

### MVP简化版 vs 完整版对比

| 功能 | 简化版 | 完整版 | 状态 | 说明 |
|------|--------|--------|------|------|
| **基础响应式** |  |  |  |  |
| reactive() | ✅ 浅层 | ✅ 深度 | ⏳ 待实现 | 响应式对象，支持深度嵌套 |
| effect() | ✅ 基础 | ✅ 完整 | ⏳ 待实现 | 副作用函数，支持cleanup |
| ref() | ✅ | ✅ | ⏳ 待实现 | Ref引用，自动解包 |
| **高级响应式** |  |  |  |  |
| computed() | ❌ | ✅ | ⏳ 待实现 | 计算属性，缓存+懒计算 |
| watch() | ❌ | ✅ | ⏳ 待实现 | 监听器，deep+immediate |
| watchEffect() | ❌ | ✅ | ⏳ 待实现 | 立即执行的监听器 |
| readonly() | ❌ | ✅ | ⏱️ 未来 | 只读响应式对象 |
| shallowReactive() | ❌ | ✅ | ⏱️ 未来 | 浅层响应式 |
| shallowRef() | ❌ | ✅ | ⏱️ 未来 | 浅层Ref |
| **依赖管理** |  |  |  |  |
| 依赖追踪 | ✅ 基础 | ✅ 完整 | ⏳ 待实现 | 自动追踪依赖关系 |
| 依赖收集 | ✅ | ✅ | ⏳ 待实现 | 收集effect的依赖 |
| 依赖清理 | ❌ | ✅ | ⏳ 待实现 | 清理无效依赖，防止内存泄漏 |
| effectStack | ✅ | ✅ | ⏳ 待实现 | effect嵌套管理 |
| **性能优化** |  |  |  |  |
| 懒计算 | ❌ | ✅ | ⏳ 待实现 | computed懒计算 |
| 缓存机制 | ❌ | ✅ | ⏳ 待实现 | computed缓存 |
| 批量更新 | ❌ | ✅ | ⏱️ 未来 | 批量触发更新 |
| 异步调度 | ❌ | ✅ | ⏱️ 未来 | 异步调度更新 |
| **调试功能** |  |  |  |  |
| 依赖图 | ❌ | ✅ | ⏱️ 未来 | 可视化依赖关系 |
| 追踪模式 | ❌ | ✅ | ⏱️ 未来 | 调试模式追踪变化 |
| 性能监控 | ❌ | ✅ | ⏱️ 未来 | 监控响应式性能 |
| **测试覆盖** |  |  |  |  |
| 单元测试 | 预计10个 | 预计30+个 | ⏳ 待实现 | 全面的测试覆盖 |
| 性能测试 | ❌ | ✅ | ⏱️ 未来 | 性能基准测试 |

---

## 🎯 核心组件（规划）

### 1. reactive() - 深度响应式对象

**功能**：创建深度响应式对象

```typescript
import { reactive } from '@vjs-ui/core'

// 基础用法
const state = reactive({
  count: 0,
  user: {
    name: 'VJS',
    age: 18
  }
})

// 深度响应式
state.user.name = 'UI' // 会触发更新
state.count++ // 会触发更新

// 数组支持
const list = reactive([1, 2, 3])
list.push(4) // 会触发更新
```

**特性**：
- ✅ 深度响应式（嵌套对象自动响应式化）
- ✅ 数组方法支持
- ✅ Map/Set支持
- ✅ 循环引用处理
- ✅ 性能优化（避免重复代理）

### 2. effect() - 副作用函数

**功能**：自动追踪依赖并在依赖变化时重新执行

```typescript
import { reactive, effect } from '@vjs-ui/core'

const state = reactive({ count: 0 })

// 基础用法
effect(() => {
  console.log(`count is ${state.count}`)
})
// 输出: count is 0

state.count++
// 输出: count is 1

// 带cleanup
effect((onCleanup) => {
  const timer = setTimeout(() => {
    console.log(state.count)
  }, 1000)
  
  onCleanup(() => {
    clearTimeout(timer)
  })
})
```

**特性**：
- ✅ 自动依赖追踪
- ✅ cleanup函数支持
- ✅ 嵌套effect支持
- ✅ 暂停/恢复支持
- ✅ 手动停止支持

### 3. computed() - 计算属性

**功能**：基于响应式数据的计算属性，支持缓存

```typescript
import { reactive, computed } from '@vjs-ui/core'

const state = reactive({
  firstName: 'Zhang',
  lastName: 'San'
})

// 只读计算属性
const fullName = computed(() => {
  return `${state.firstName} ${state.lastName}`
})

console.log(fullName.value) // Zhang San
state.firstName = 'Li'
console.log(fullName.value) // Li San

// 可写计算属性
const fullNameWritable = computed({
  get() {
    return `${state.firstName} ${state.lastName}`
  },
  set(value) {
    const parts = value.split(' ')
    state.firstName = parts[0]
    state.lastName = parts[1]
  }
})
```

**特性**：
- ✅ 缓存机制（值不变时不重新计算）
- ✅ 懒计算（首次访问时才计算）
- ✅ 可写计算属性支持
- ✅ 嵌套computed支持
- ✅ 依赖追踪

### 4. watch() - 监听器

**功能**：监听响应式数据的变化

```typescript
import { reactive, watch } from '@vjs-ui/core'

const state = reactive({ count: 0, user: { name: 'VJS' } })

// 监听单个值
watch(
  () => state.count,
  (newValue, oldValue) => {
    console.log(`count changed: ${oldValue} → ${newValue}`)
  }
)

// 监听多个值
watch(
  () => [state.count, state.user.name],
  ([newCount, newName], [oldCount, oldName]) => {
    console.log('Values changed')
  }
)

// 深度监听
watch(
  () => state.user,
  (newUser, oldUser) => {
    console.log('User changed')
  },
  { deep: true }
)

// 立即执行
watch(
  () => state.count,
  (value) => {
    console.log(`Current count: ${value}`)
  },
  { immediate: true }
)
```

**特性**：
- ✅ 单个/多个值监听
- ✅ 深度监听（deep选项）
- ✅ 立即执行（immediate选项）
- ✅ cleanup函数支持
- ✅ 手动停止支持

### 5. ref() - Ref引用

**功能**：创建可变的响应式引用

```typescript
import { ref, effect } from '@vjs-ui/core'

// 基础用法
const count = ref(0)

effect(() => {
  console.log(count.value)
})

count.value++ // 触发effect

// 对象ref
const user = ref({ name: 'VJS' })
user.value.name = 'UI' // 触发effect

// 自动解包（在reactive中）
const state = reactive({
  count: ref(0)
})

console.log(state.count) // 0（自动解包，不需要.value）
state.count++ // 直接修改
```

**特性**：
- ✅ 基础类型响应式
- ✅ 对象ref支持
- ✅ 自动解包（在reactive/computed中）
- ✅ isRef()判断
- ✅ unref()获取原始值

---

## 🏗️ 架构设计

### 依赖追踪原理

```
┌─────────────────────────────────────┐
│          Effect Function            │
│  effect(() => {                     │
│    console.log(state.count)         │
│  })                                 │
└────────────┬────────────────────────┘
             │
             │ 1. 执行时收集依赖
             ↓
┌─────────────────────────────────────┐
│          Reactive Object            │
│  const state = reactive({           │
│    count: 0                         │
│  })                                 │
└────────────┬────────────────────────┘
             │
             │ 2. 数据变化时触发
             ↓
┌─────────────────────────────────────┐
│       Trigger Re-execution          │
│  state.count++ → 重新执行effect     │
└─────────────────────────────────────┘
```

### 核心数据结构

```typescript
// 依赖映射
type Dep = Set<ReactiveEffect>
type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

// Effect栈（处理嵌套）
const effectStack: ReactiveEffect[] = []
let activeEffect: ReactiveEffect | undefined

// ReactiveEffect类
class ReactiveEffect {
  active = true
  deps: Dep[] = []
  
  constructor(
    public fn: () => void,
    public options?: EffectOptions
  ) {}
  
  run() { /* ... */ }
  stop() { /* ... */ }
}
```

---

## 📖 使用场景

### 场景1：组件状态管理

```typescript
import { reactive, computed, watch } from '@vjs-ui/core'

interface TodoItem {
  id: number
  text: string
  done: boolean
}

const todoState = reactive({
  todos: [] as TodoItem[],
  filter: 'all' as 'all' | 'active' | 'done'
})

// 计算属性
const filteredTodos = computed(() => {
  switch (todoState.filter) {
    case 'active':
      return todoState.todos.filter(t => !t.done)
    case 'done':
      return todoState.todos.filter(t => t.done)
    default:
      return todoState.todos
  }
})

// 监听变化
watch(
  () => todoState.todos.length,
  (newLen, oldLen) => {
    console.log(`Todo count: ${oldLen} → ${newLen}`)
  }
)
```

### 场景2：表单验证

```typescript
import { reactive, computed, watch } from '@vjs-ui/core'

const form = reactive({
  email: '',
  password: '',
  errors: {} as Record<string, string>
})

// 验证规则（计算属性）
const isEmailValid = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
})

const isPasswordValid = computed(() => {
  return form.password.length >= 6
})

const isFormValid = computed(() => {
  return isEmailValid.value && isPasswordValid.value
})

// 实时验证（watch）
watch(() => form.email, (email) => {
  if (!isEmailValid.value) {
    form.errors.email = '邮箱格式不正确'
  } else {
    delete form.errors.email
  }
})

watch(() => form.password, (password) => {
  if (!isPasswordValid.value) {
    form.errors.password = '密码至少6位'
  } else {
    delete form.errors.password
  }
})
```

### 场景3：数据同步

```typescript
import { ref, watch } from '@vjs-ui/core'

const localData = ref({ count: 0 })

// 同步到localStorage
watch(
  () => localData.value,
  (data) => {
    localStorage.setItem('data', JSON.stringify(data))
  },
  { deep: true }
)

// 从localStorage加载
const stored = localStorage.getItem('data')
if (stored) {
  localData.value = JSON.parse(stored)
}
```

---

## 🔧 配置选项

### EffectOptions

```typescript
interface EffectOptions {
  lazy?: boolean           // 是否懒执行
  scheduler?: (fn: () => void) => void  // 自定义调度器
  onTrack?: (event: DebuggerEvent) => void  // 依赖追踪回调
  onTrigger?: (event: DebuggerEvent) => void  // 触发回调
  onStop?: () => void      // 停止回调
}
```

### WatchOptions

```typescript
interface WatchOptions {
  immediate?: boolean      // 立即执行
  deep?: boolean          // 深度监听
  flush?: 'pre' | 'post' | 'sync'  // 刷新时机
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}
```

---

## 🎨 设计原则

### 1. 最小侵入

响应式系统应该透明且最小化侵入：

```typescript
// ❌ 不好：需要显式通知
const state = { count: 0 }
state.count++
notify('count', state.count) // 手动通知

// ✅ 好：自动追踪
const state = reactive({ count: 0 })
state.count++ // 自动触发更新
```

### 2. 性能优先

- 懒计算：computed不会立即计算
- 缓存机制：相同输入不重新计算
- 依赖清理：防止内存泄漏

### 3. 调试友好

- 清晰的依赖关系
- 可追踪的变化
- 详细的错误信息

---

## ⚠️ 注意事项

### 1. 避免在setup外使用

```typescript
// ❌ 不好
const state = reactive({ count: 0 })

export function useCounter() {
  return state
}

// ✅ 好
export function useCounter() {
  const state = reactive({ count: 0 })
  return state
}
```

### 2. 注意ref自动解包

```typescript
const count = ref(0)
const state = reactive({ count })

console.log(state.count) // 0（自动解包）
console.log(count.value) // 0（需要.value）
```

### 3. 清理副作用

```typescript
// ❌ 不好：没有清理
effect(() => {
  const timer = setInterval(() => {
    console.log(state.count)
  }, 1000)
})

// ✅ 好：清理定时器
effect((onCleanup) => {
  const timer = setInterval(() => {
    console.log(state.count)
  }, 1000)
  
  onCleanup(() => {
    clearInterval(timer)
  })
})
```

---

## ✅ 测试覆盖（规划）

### 测试统计（预计）

- **reactive()**: 8个测试
- **effect()**: 7个测试
- **computed()**: 6个测试
- **watch()**: 5个测试
- **ref()**: 4个测试
- **总计**: 30+个测试

### 测试覆盖范围

- ✅ 基础功能测试
- ✅ 深度响应式测试
- ✅ 依赖追踪测试
- ✅ 性能测试
- ✅ 内存泄漏测试
- ✅ 边界情况测试

---

## 📚 相关文档

- [核心原则](../../../docs/CORE-PRINCIPLES.md) - DSL是核心中的核心
- [架构设计](../../../docs/ARCHITECTURE.md) - 完整架构设计
- [实施清单](../../../docs/internal/02-IMPL-CHECKLIST.md) - 实施进度

---

**响应式系统是VJS-UI的数据核心，为DSL驱动提供强大的响应式数据支持！** ⚡✨
