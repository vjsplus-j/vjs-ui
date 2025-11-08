# VJS-UI 技术架构

> 基于 Design Token + DSL 驱动的现代化跨框架UI组件库

---

## 🎯 设计理念

### 核心目标

- **高性能** - 零虚拟DOM Diff，直接响应式更新
- **易用性** - DSL驱动，JSON配置即可使用
- **开发效率** - 低代码友好，可视化拖拽支持
- **企业级能力** - 372个组件覆盖21+行业场景

### 技术选型

| 技术 | 选型 | 理由 |
|------|------|------|
| 语言 | TypeScript 5.0+ | 类型安全、开发体验 |
| 构建 | Vite + Rollup | 开发快速、打包优化 |
| 包管理 | pnpm + Turborepo | Monorepo管理、缓存复用 |
| 测试 | Vitest + Playwright | 单元测试 + E2E测试 |
| 样式 | CSS Variables + PostCSS | 主题定制、动态切换 |
| 响应式 | 自研 Proxy-based | 精确依赖追踪 |

---

## 🏗️ 三层架构模型

```
┌────────────────────────────────────────────────────┐
│                    VJS-UI                          │
├────────────────────────────────────────────────────┤
│  Layer 3: Framework Adapters                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │
│  │   Vue 3  │  │  React   │  │ Web Component│    │
│  └──────────┘  └──────────┘  └──────────────┘    │
├────────────────────────────────────────────────────┤
│  Layer 2: Core Engine (DSL + Runtime)              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │ Parser  │ │ Binder  │ │Renderer │ │Reactive │ │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ │
├────────────────────────────────────────────────────┤
│  Layer 1: Design Tokens & Style System            │
│  ┌──────────┐  ┌────────────┐  ┌───────────────┐ │
│  │  Tokens  │  │ CSS System │  │ Theme Engine  │ │
│  └──────────┘  └────────────┘  └───────────────┘ │
└────────────────────────────────────────────────────┘
```

### Layer 1: Design Tokens System

**职责**：提供统一的设计语言和样式系统

**核心模块**：
- **Token定义** - 颜色、间距、字体、阴影等设计变量
- **CSS Variables** - 运行时动态主题切换
- **Theme Engine** - 主题管理和切换机制

**Token类型**：
```typescript
interface TokenDefinition {
  color: ColorTokens      // 颜色系统
  spacing: SpacingTokens  // 间距系统
  radius: RadiusTokens    // 圆角系统
  font: FontTokens        // 字体系统
  shadow: ShadowTokens    // 阴影系统
  motion: MotionTokens    // 动画系统
  zIndex: ZIndexTokens    // 层级系统
}
```

---

### Layer 2: Core Engine

**职责**：DSL解析、数据绑定、响应式系统、渲染调度

#### 2.1 DSL Parser（DSL解析器）

**功能**：
- JSON配置解析
- 表达式编译
- 安全验证

**示例**：
```typescript
// DSL配置
const config = {
  type: 'Button',
  props: {
    type: 'primary',
    disabled: '{{form.loading}}',  // 表达式绑定
    onClick: '{{handleSubmit}}'
  },
  children: 'Submit'
}

// 解析结果
const vnode = parser.parse(config, context)
```

#### 2.2 Data Binder（数据绑定器）

**功能**：
- 双向数据绑定
- 表达式求值
- 依赖追踪

**核心机制**：
```typescript
// 响应式绑定
const state = reactive({
  count: 0,
  loading: false
})

// 自动追踪依赖
effect(() => {
  console.log(`Count: ${state.count}`)
})

// 更新触发重渲染
state.count++ // 自动触发effect
```

#### 2.3 Reactive System（响应式系统）

**基于Proxy的精确依赖追踪**：

```typescript
class ReactiveSystem {
  // 响应式对象创建
  reactive<T>(target: T): T {
    return new Proxy(target, {
      get(target, key, receiver) {
        track(target, key)  // 追踪依赖
        return Reflect.get(target, key, receiver)
      },
      set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver)
        trigger(target, key)  // 触发更新
        return result
      }
    })
  }
  
  // 副作用函数
  effect(fn: Function) {
    const effectFn = () => {
      activeEffect = effectFn
      fn()
      activeEffect = null
    }
    effectFn()
  }
}
```

**性能优化**：
- **批量更新** - 同一tick内的多次更新合并
- **惰性求值** - computed懒计算
- **依赖清理** - 自动清理无效依赖

#### 2.4 Renderer（渲染器）

**并发渲染架构**：

```typescript
// Time Slicing - 可中断渲染
function workLoop(deadline) {
  while (workInProgress && deadline.timeRemaining() > 0) {
    performUnitOfWork(workInProgress)
  }
  
  if (workInProgress) {
    requestIdleCallback(workLoop)  // 继续未完成的工作
  }
}

// 优先级调度
enum Priority {
  Immediate = 1,    // 立即执行
  UserBlocking = 2, // 用户交互
  Normal = 3,       // 普通更新
  Low = 4,          // 低优先级
  Idle = 5          // 空闲时执行
}
```

---

### Layer 3: Framework Adapters

**职责**：适配不同的前端框架

#### 3.1 Vue 3 Adapter

```typescript
// Vue组件包装
export const VButton = defineComponent({
  name: 'VButton',
  props: buttonProps,
  setup(props, { slots, emit }) {
    const coreComponent = useCoreComponent('Button', props)
    
    return () => coreComponent.render(slots, emit)
  }
})
```

#### 3.2 React Adapter

```typescript
// React组件包装
export const VButton: React.FC<ButtonProps> = (props) => {
  const coreComponent = useCoreComponent('Button', props)
  
  return coreComponent.render()
}
```

#### 3.3 Web Components

```typescript
// 原生Web Component
class VButton extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.coreComponent = createCoreComponent('Button')
  }
  
  connectedCallback() {
    this.render()
  }
}

customElements.define('v-button', VButton)
```

---

## 🚀 性能优化策略

### 1. 零虚拟DOM Diff

**传统方式**：
```
更新数据 → 创建新VTree → Diff → Patch DOM
```

**VJS-UI方式**：
```
更新数据 → 精确追踪依赖 → 直接更新DOM
```

**优势**：
- ✅ 无Diff开销
- ✅ 更新精确到具体节点
- ✅ 内存占用更低

### 2. 并发渲染

**Time Slicing（时间切片）**：
```typescript
// 将长任务切分成小片段
function renderWithTimeSlicing(elements) {
  const chunks = splitIntoChunks(elements, 100)
  
  for (const chunk of chunks) {
    scheduleCallback(Priority.Normal, () => {
      renderChunk(chunk)
    })
  }
}
```

**优先级调度**：
```typescript
// 高优先级任务优先执行
scheduleCallback(Priority.Immediate, urgentTask)
scheduleCallback(Priority.Normal, normalTask)
scheduleCallback(Priority.Low, backgroundTask)
```

### 3. 虚拟滚动

**支持10万+数据流畅渲染**：

```typescript
class VirtualScroll {
  // 只渲染可见区域
  getVisibleRange() {
    const start = Math.floor(scrollTop / itemHeight)
    const end = start + Math.ceil(viewportHeight / itemHeight)
    return { start, end }
  }
  
  // 动态渲染
  render() {
    const { start, end } = this.getVisibleRange()
    return data.slice(start, end).map(renderItem)
  }
}
```

### 4. 对象池优化

**VNode复用**：
```typescript
class ObjectPool<T> {
  private pool: T[] = []
  
  // 获取对象
  acquire(): T {
    return this.pool.pop() || this.create()
  }
  
  // 释放对象
  release(obj: T) {
    this.reset(obj)
    this.pool.push(obj)
  }
}
```

---

## 🔒 安全机制

### 五层安全防护

#### 1. 表达式静态分析
```typescript
// 危险模式检测
const dangerousPatterns = [
  /constructor/,
  /__proto__/,
  /prototype/,
  /eval\s*\(/,
  /Function\s*\(/
]

function validateExpression(expr: string) {
  for (const pattern of dangerousPatterns) {
    if (pattern.test(expr)) {
      throw new SecurityError('Dangerous expression detected')
    }
  }
}
```

#### 2. AST白名单验证
```typescript
const allowedNodeTypes = [
  'Identifier',
  'Literal',
  'BinaryExpression',
  'MemberExpression',
  'CallExpression'
]

function validateAST(node: Node) {
  if (!allowedNodeTypes.includes(node.type)) {
    throw new SecurityError(`Node type ${node.type} not allowed`)
  }
}
```

#### 3. 安全上下文隔离
```typescript
// 创建纯净的执行上下文
const safeContext = Object.create(null)
safeContext.Math = Math
safeContext.Date = Date
// 不包含 window, document, eval 等
```

#### 4. 资源限制
```typescript
// 超时保护
function evaluateWithTimeout(expr: string, timeout = 100) {
  const startTime = Date.now()
  
  return evaluate(expr, {
    shouldYield: () => Date.now() - startTime > timeout
  })
}
```

#### 5. 完整安全求值器
```typescript
class SafeEvaluator {
  evaluate(expr: string, context: object) {
    // 1. 静态分析
    this.validateExpression(expr)
    
    // 2. AST解析
    const ast = parse(expr)
    
    // 3. AST验证
    this.validateAST(ast)
    
    // 4. 安全上下文
    const safeContext = this.createSafeContext(context)
    
    // 5. 限制执行
    return this.evaluateWithTimeout(ast, safeContext)
  }
}
```

---

## 🎨 主题系统

### Design Token 工作流

```
设计师定义 Token
    ↓
JSON 配置文件
    ↓
编译生成
    ├→ CSS Variables
    ├→ TypeScript Types
    └→ SCSS Variables
    ↓
运行时动态切换
```

### 主题切换实现

```typescript
class ThemeEngine {
  private themes: Map<string, Theme> = new Map()
  private current: string = 'default'
  
  // 注册主题
  register(name: string, theme: Theme) {
    this.themes.set(name, theme)
  }
  
  // 切换主题
  switch(name: string) {
    const theme = this.themes.get(name)
    if (!theme) return
    
    // 更新CSS Variables
    Object.entries(theme.tokens).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--vjs-${key}`, value)
    })
    
    this.current = name
  }
}
```

---

## 📦 组件库架构

### Monorepo 结构

```
vjs-ui/
├── packages/
│   ├── core/              # 核心引擎
│   │   ├── parser/        # DSL解析
│   │   ├── reactive/      # 响应式系统
│   │   ├── renderer/      # 渲染器
│   │   └── evaluator/     # 表达式求值
│   │
│   ├── tokens/            # Design Tokens
│   ├── vue/               # Vue适配器 + 372个组件
│   ├── react/             # React适配器
│   ├── web-components/    # Web Components
│   │
│   ├── utils/             # 工具函数
│   └── shared/            # 共享类型
│
├── docs/                  # 文档
└── examples/              # 示例项目
```

### 组件分类（372个）

详见 [COMPONENTS.md](./COMPONENTS.md)

---

## 🧪 测试策略

### 测试金字塔

```
        E2E (10%)
         /\
        /  \
       /    \
      /      \
  集成 (20%)
    /        \
   /          \
  /            \
单元测试 (70%)
```

### 覆盖率要求

| 模块 | 目标覆盖率 |
|------|------------|
| Core引擎 | ≥ 90% |
| Vue适配层 | ≥ 85% |
| 组件库 | ≥ 85% |
| 工具函数 | ≥ 95% |

---

## 🔗 相关文档

- [组件清单](./COMPONENTS.md) - 372个组件完整列表
- [API参考](./03-SPEC-API-DESIGN.md) - API使用文档
- [DSL系统](./04-TECH-DSL-COMPLETE.md) - DSL技术详解
- [响应式系统](./04-TECH-REACTIVE-SYSTEM.md) - 响应式原理
- [性能优化](./04-TECH-PERFORMANCE-COMPLETE.md) - 性能优化方案

---

**VJS-UI - 下一代企业级UI组件库** 🚀
