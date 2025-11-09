# VJS-UI 核心原则

> **⚠️ 极其重要 - 所有开发者必读**  
> **这些原则写在骨子里，永远不能动摇！**  
> **创建日期**: 2025-11-09  
> **优先级**: 🔴🔴🔴 最高

---

## 🎯 第一原则：DSL是核心中的核心

### 不可动摇的事实

```
┌─────────────────────────────────────────┐
│                                         │
│        DSL Core 引擎                    │
│                                         │
│   这是VJS-UI的灵魂和存在价值            │
│   所有其他功能都是围绕它构建的           │
│   绝对不能被替代或简化                  │
│                                         │
└─────────────────────────────────────────┘
```

### 架构层次（不可改变）

```
第1层（核心层）：DSL Core Engine
├── DSL Parser          ← 解析DSL定义
├── Token System        ← Design Tokens（不是CSS主题）
├── Reactive System     ← 响应式引擎
├── Evaluator          ← 表达式求值器（安全沙箱）
├── Binder             ← 数据绑定器
└── Renderer Interface  ← 渲染器抽象

第2层（适配层）：Framework Adapters
├── Vue 3 Renderer      ← 将DSL渲染到Vue
├── React Renderer      ← 将DSL渲染到React（未来）
└── Web Components      ← 将DSL渲染到原生（未来）

第3层（工具层）：Developer Tools
├── CLI                ← 命令行工具
├── Playground         ← 在线演示
└── DevTools           ← 开发者工具

第4层（展示层）：Examples & Themes
├── examples/          ← 示例代码
└── themes/           ← 主题配置（仅用于展示效果）
```

---

## ❌ 绝对禁止的事情

### 1. 不能把DSL Core简化掉

**错误做法** ❌：
```typescript
// 错误！直接写Vue组件
<template>
  <button>{{ text }}</button>
</template>
```

**正确做法** ✅：
```typescript
// 正确！使用DSL定义
const dsl = {
  type: 'Button',
  props: { text: 'Click Me' },
  events: { onClick: "console.log('clicked')" }
}

// 通过Core引擎渲染
core.render(dsl, container)
```

### 2. 不能把Token系统改成纯CSS主题

**错误理解** ❌：
- "Token系统就是CSS Variables"
- "主题就是换换颜色"
- "不需要Design Tokens"

**正确理解** ✅：
- Token系统是Design Tokens（设计令牌）
- Token可以编译成多种格式（CSS/SCSS/TS）
- Token是语义化的设计系统
- 主题只是Token的一种应用场景

### 3. 不能说"examples是最终方案"

**错误理解** ❌：
- "examples/index.html就是我们的组件库"
- "主题系统就是核心功能"
- "不需要DSL，直接用Vue就行"

**正确理解** ✅：
- examples只是演示和展示
- 主题只是辅助开发者看效果
- DSL Core才是真正的产品
- 最终产品是通过DSL定义组件

### 4. 不能跳过Core直接做适配层

**错误顺序** ❌：
```
第1步：实现Vue组件
第2步：添加主题
第3步：想起来还需要DSL？
```

**正确顺序** ✅：
```
第1步：实现DSL Core引擎
第2步：实现Vue渲染器（适配DSL到Vue）
第3步：实现组件（基于DSL定义）
第4步：添加主题（辅助展示）
```

---

## ✅ 必须遵守的原则

### 原则1：DSL优先

**所有功能都必须通过DSL实现**
```typescript
// 组件定义
const buttonDSL = {
  type: 'Button',
  props: {
    text: '$state.buttonText',
    type: 'primary'
  },
  events: {
    onClick: 'state.count++'
  }
}

// 条件渲染
const conditionalDSL = {
  type: 'Button',
  if: '$state.isVisible',
  props: { text: 'Hello' }
}

// 列表渲染
const listDSL = {
  type: 'Card',
  for: 'item in $state.items',
  props: { title: '$item.name' }
}
```

### 原则2：Token系统是语义化的

**不是简单的CSS变量**
```typescript
// Design Tokens（语义化）
const tokens = {
  color: {
    primary: '#1677ff',
    success: '#52c41a',
    text: {
      body: '#000000',
      muted: '#666666'
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px'
  }
}

// 编译成CSS Variables
compiler.toCSSVariables(tokens)
// --vjs-color-primary: #1677ff
// --vjs-spacing-md: 16px

// 编译成TypeScript类型
compiler.toTypeScript(tokens)
// type Tokens = { 'color.primary': string, ... }
```

### 原则3：框架无关

**Core引擎不依赖任何框架**
```typescript
// packages/core - 完全独立
export class Core {
  constructor(options: {
    tokens: FlatTokenMap
    renderer: Renderer  // 抽象接口
  })
}

// packages/vue - Vue适配器
export class VueRenderer implements Renderer {
  mount(vnode: VNode, container: Element) {
    // 将VNode渲染成Vue组件
  }
}

// packages/react - React适配器（未来）
export class ReactRenderer implements Renderer {
  mount(vnode: VNode, container: Element) {
    // 将VNode渲染成React组件
  }
}
```

### 原则4：安全第一

**表达式求值必须在安全沙箱中**
```typescript
// 错误 ❌ - 直接eval
eval(userExpression)

// 正确 ✅ - 安全沙箱
const sandbox = new Sandbox({
  allowedGlobals: ['Math', 'Date', 'console']
})
sandbox.evaluate(userExpression, context)
```

---

## 📚 核心文档索引

### 必读文档（理解核心）

| 优先级 | 文档 | 说明 |
|-------|------|------|
| 🔴 P0 | **本文档** | 核心原则，不可动摇 |
| 🔴 P0 | [ARCHITECTURE.md](./ARCHITECTURE.md) | 完整架构设计 |
| 🔴 P0 | [04-TECH-DSL-COMPLETE.md](./internal/04-TECH-DSL-COMPLETE.md) | DSL技术完整方案 |
| 🟡 P1 | [01-PLANNING-MVP-PLAN.md](./internal/01-PLANNING-MVP-PLAN.md) | MVP实施计划 |
| 🟡 P1 | [02-IMPL-GUIDE-COMPLETE.md](./internal/02-IMPL-GUIDE-COMPLETE.md) | 实施指南 |

### 核心技术文档

| 文档 | 核心程度 | 说明 |
|------|---------|------|
| [04-TECH-DSL-COMPLETE.md](./internal/04-TECH-DSL-COMPLETE.md) | 🔥🔥🔥 | DSL解析、渲染、并发 |
| [04-TECH-REACTIVE-SYSTEM.md](./internal/04-TECH-REACTIVE-SYSTEM.md) | 🔥🔥🔥 | 响应式引擎 |
| [04-TECH-SECURITY-GUIDE.md](./internal/04-TECH-SECURITY-GUIDE.md) | 🔥🔥🔥 | 安全沙箱 |
| [04-TECH-PERFORMANCE-COMPLETE.md](./internal/04-TECH-PERFORMANCE-COMPLETE.md) | 🔥🔥 | 性能优化 |

---

## 🎯 实施时的检查清单

### 每次开发前问自己

- [ ] 我是否在DSL Core的基础上工作？
- [ ] 我是否遵循了DSL优先原则？
- [ ] 我是否理解Token系统不是CSS主题？
- [ ] 我是否保持了框架无关性？
- [ ] 我是否实现了安全沙箱？

### 每次代码审查时检查

- [ ] 代码是否依赖具体框架（Vue/React）？
- [ ] 是否跳过DSL直接操作DOM？
- [ ] Token系统是否退化成CSS变量？
- [ ] 表达式求值是否安全？
- [ ] 架构层次是否清晰？

### 每次合并前确认

- [ ] Core引擎的独立性是否保持？
- [ ] DSL功能是否完整？
- [ ] 文档是否更新（强调DSL核心）？
- [ ] 测试是否覆盖DSL场景？

---

## 💡 正确的开发心态

### ✅ 正确的思维方式

```
我在开发什么？
→ DSL驱动的UI引擎

最终产品是什么？
→ 开发者写DSL，引擎渲染成UI

我的价值在哪？
→ 让开发者不需要写框架代码，只需要写DSL

为什么不直接用Vue？
→ 因为DSL可以跨框架，可以安全求值，可以动态渲染
```

### ❌ 错误的思维方式

```
"DSL太复杂了，直接用Vue不是更简单？"
→ 错！这会失去跨框架能力和安全性

"主题系统做得很好，就是这个方向"
→ 错！主题只是辅助，DSL才是核心

"examples已经能用了，为什么还要Core？"
→ 错！examples只是展示，不是产品

"Token就是CSS Variables吧"
→ 错！Token是语义化的设计系统
```

---

## 🔥 给未来开发者的警告

### 如果你想简化架构

**停！** 🛑

在你动手之前，问自己：
1. 我是否完全理解了DSL Core的价值？
2. 我的简化是否会失去跨框架能力？
3. 我的简化是否会失去安全性？
4. 我的简化是否会失去动态渲染能力？

如果任何一个答案是"是"，那就不要简化！

### 如果你觉得DSL没必要

**停！** 🛑

重新阅读：
1. [ARCHITECTURE.md](./ARCHITECTURE.md) - 理解为什么需要DSL
2. [04-TECH-DSL-COMPLETE.md](./internal/04-TECH-DSL-COMPLETE.md) - 理解DSL的价值
3. 本文档 - 理解DSL是核心中的核心

如果还是不理解，去问问项目负责人，不要自己决定！

---

## 📊 核心vs辅助

### 核心功能（必须有）

| 功能 | 重要性 | 说明 |
|------|--------|------|
| DSL Parser | 🔥🔥🔥 | 解析DSL定义 |
| Token System | 🔥🔥🔥 | Design Tokens |
| Reactive System | 🔥🔥🔥 | 响应式引擎 |
| Evaluator | 🔥🔥🔥 | 安全表达式求值 |
| Binder | 🔥🔥🔥 | 数据绑定 |
| Renderer Interface | 🔥🔥🔥 | 渲染抽象 |

### 辅助功能（可以简化）

| 功能 | 重要性 | 说明 |
|------|--------|------|
| CLI | 🔥 | 命令行工具 |
| Playground | 🔥 | 在线演示 |
| DevTools | 🔥 | 开发者工具 |
| Themes | 💧 | 主题配置（展示用） |
| Examples | 💧 | 示例代码（展示用） |

---

## 🎯 总结

### 永远记住

1. **DSL Core是核心中的核心** - 写在骨子里，不可动摇
2. **Token系统是Design Tokens** - 不是简单的CSS主题
3. **框架无关** - Core不依赖任何框架
4. **安全第一** - 表达式求值必须在沙箱中
5. **Examples只是展示** - 不是最终产品

### 如果迷失方向

回来重新阅读本文档，记住：

```
┌─────────────────────────────────────┐
│                                     │
│   DSL Core Engine                   │
│   这是VJS-UI的全部意义所在           │
│                                     │
└─────────────────────────────────────┘
```

---

**这些原则写在骨子里，永远不能动摇！** 🔥

**创建日期**: 2025-11-09  
**最后更新**: 2025-11-09  
**优先级**: 🔴🔴🔴 最高
