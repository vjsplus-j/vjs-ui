# VJS-UI 架构设计总览

> **设计理念**: 基于 Design Token + DSL 驱动的跨框架UI组件库
> **核心目标**: 性能、易用性、开发效率、企业级能力

---

## 一、架构三层模型

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

---

## 二、Layer 1: Design Tokens System

### 2.1 Token类型定义

```typescript
interface TokenDefinition {
  // 颜色系统
  color: {
    primary: string
    success: string
    warning: string
    danger: string
    info: string
    // ... 细分色阶
  }
  
  // 间距系统
  spacing: {
    xs: string  // 4px
    sm: string  // 8px
    md: string  // 16px
    lg: string  // 24px
    xl: string  // 32px
  }
  
  // 圆角系统
  radius: {
    sm: string  // 4px
    md: string  // 8px
    lg: string  // 16px
    full: string // 9999px
  }
  
  // 字体系统
  font: {
    family: string
    size: Record<string, string>
    weight: Record<string, number>
    lineHeight: Record<string, number>
  }
  
  // 阴影系统
  shadow: Record<string, string>
  
  // 动画系统
  motion: {
    duration: Record<string, string>
    easing: Record<string, string>
  }
  
  // z-index层级
  zIndex: Record<string, number>
}
```

### 2.2 Token存储格式

使用JSON Schema标准格式：

```json
{
  "color.primary": {
    "value": "#1677ff",
    "type": "color",
    "description": "主色调"
  },
  "color.primary.hover": {
    "value": "{color.primary}",
    "type": "color",
    "alpha": 0.8
  },
  "spacing.md": {
    "value": "16px",
    "type": "spacing"
  }
}
```

### 2.3 Token运行时

Token在运行时通过两种方式工作：

1. **CSS Variables模式** (默认)
   ```css
   :root {
     --vjs-color-primary: #1677ff;
     --vjs-spacing-md: 16px;
   }
   ```

2. **JS Runtime模式** (动态主题)
   ```typescript
   const tokens = createTokenRuntime(tokenDefinitions)
   tokens.set('color.primary', '#ff0000') // 立即生效
   ```

---

## 三、Layer 2: Core Engine

### 3.1 DSL (Domain Specific Language)

DSL是组件的声明式描述语言，包含以下核心域：

```typescript
interface DSLNode {
  // 基础信息
  id?: string
  type: string  // 组件类型，如 'Button', 'Input'
  
  // 属性配置
  props?: Record<string, any>
  
  // 样式配置（支持Token引用）
  style?: Record<string, string | DSLExpression>
  
  // 事件绑定
  events?: Record<string, string | Function>
  
  // 内部状态
  state?: Record<string, any>
  
  // 插槽内容
  slots?: Record<string, string | DSLNode | DSLNode[]>
  
  // 条件渲染
  if?: DSLExpression
  
  // 列表渲染
  for?: string  // "item in items"
  
  // 引用标识
  ref?: string
  
  // 动画配置
  motion?: MotionConfig
  
  // 自定义数据
  meta?: Record<string, any>
}
```

#### DSL表达式系统

支持三类变量引用：

- `$state.xxx` - 组件内部状态
- `$props.xxx` - 父组件传入的属性
- `$context.xxx` - 全局上下文（主题、路由、权限等）
- `{token.name}` - Design Token引用

示例：

```json
{
  "type": "Button",
  "props": {
    "text": "$props.label",
    "disabled": "$state.loading"
  },
  "style": {
    "backgroundColor": "{color.primary}",
    "borderRadius": "{radius.md}",
    "padding": "$state.size === 'large' ? '{spacing.lg}' : '{spacing.md}'"
  },
  "events": {
    "onClick": "$state.loading = true; emit('submit', $state.formData)"
  }
}
```

### 3.2 核心引擎组件

#### 3.2.1 Parser (解析器)

职责：将JSON DSL解析为虚拟节点树(VNodeTree)

```typescript
class Parser {
  parse(dsl: DSLNode, context: RuntimeContext): VNode[]
  
  // 处理条件渲染
  private handleIf(node: DSLNode): boolean
  
  // 处理列表渲染
  private handleFor(node: DSLNode): VNode[]
  
  // 处理插槽
  private handleSlots(node: DSLNode): VNode[]
}
```

#### 3.2.2 Evaluator (表达式求值器)

职责：安全地执行DSL中的表达式

```typescript
class Evaluator {
  // 编译表达式为函数
  compile(expression: string): CompiledFunction
  
  // 执行表达式
  evaluate(expression: string, context: EvalContext): any
  
  // 安全沙箱（基于jsep + 自定义AST解释器）
  private createSandbox(): Sandbox
}
```

**安全性设计：**
- 使用jsep解析表达式为AST
- 自定义AST解释器，只允许白名单操作
- 禁止访问全局对象(window, document等)
- 禁止执行危险函数(eval, Function等)

#### 3.2.3 Reactive (响应式系统)

职责：实现细粒度的响应式数据绑定

```typescript
class ReactiveSystem {
  // 创建响应式对象
  reactive<T>(obj: T): T
  
  // 副作用函数
  effect(fn: EffectFunction): EffectCleanup
  
  // 依赖追踪
  track(target: object, key: string | symbol): void
  
  // 触发更新
  trigger(target: object, key: string | symbol): void
}
```

采用类似Vue 3的实现：
- Proxy实现响应式
- WeakMap存储依赖关系
- 支持嵌套对象响应式

#### 3.2.4 Binder (绑定器)

职责：将表达式与响应式系统绑定，建立依赖关系

```typescript
class Binder {
  // 绑定VNode的props/style/events
  bind(vnode: VNode): void
  
  // 处理Token引用
  private resolveToken(value: string): string
  
  // 处理表达式绑定
  private bindExpression(expr: string, context: RuntimeContext): void
  
  // 清理绑定（防止内存泄漏）
  unbind(vnode: VNode): void
}
```

#### 3.2.5 Renderer (渲染器接口)

职责：定义渲染器标准接口，由框架适配层实现

```typescript
interface Renderer {
  // 挂载组件
  mount(container: Element, vnode: VNode): RenderHandle
  
  // 更新组件
  update(handle: RenderHandle, vnode: VNode): void
  
  // 卸载组件
  unmount(handle: RenderHandle): void
  
  // 批量更新（性能优化）
  batchUpdate(updates: Update[]): void
}
```

### 3.3 Core引擎协调器

```typescript
class Core {
  private tokens: TokenMap
  private state: ReactiveState
  private parser: Parser
  private binder: Binder
  private evaluator: Evaluator
  private renderer: Renderer
  
  constructor(config: CoreConfig) {
    // 初始化各个子系统
  }
  
  // 渲染DSL到容器
  render(dsl: DSLNode, container: Element, props?: any): RenderInstance {
    // 1. 解析DSL
    const vnodes = this.parser.parse(dsl, context)
    
    // 2. 绑定数据
    vnodes.forEach(vnode => this.binder.bind(vnode))
    
    // 3. 渲染
    const handle = this.renderer.mount(container, vnodes[0])
    
    return { vnode: vnodes[0], handle }
  }
  
  // 更新状态
  setState(updates: StateUpdate): void
  
  // 卸载
  unmount(instance: RenderInstance): void
}
```

---

## 四、Layer 3: Framework Adapters

### 4.1 Vue 3 适配器

```typescript
// packages/vue/src/adapter.ts
class VueRenderer implements Renderer {
  mount(container: Element, vnode: VNode): RenderHandle {
    const app = createApp({
      setup() {
        return () => this.buildVNode(vnode)
      }
    })
    app.mount(container)
    return { app, vnode }
  }
  
  private buildVNode(vnode: VNode): VNode {
    // 将Core VNode转换为Vue VNode
    return h(
      this.resolveComponent(vnode.type),
      { ...vnode.props, style: vnode.style },
      vnode.children.map(child => this.buildVNode(child))
    )
  }
}
```

### 4.2 组件注册系统

```typescript
// Vue组件包装器
export function defineVComponent(dsl: DSLNode) {
  return defineComponent({
    name: dsl.type,
    props: extractProps(dsl),
    setup(props, { slots, emit }) {
      const core = useCore()
      const instance = core.render(dsl, /* ... */)
      
      onUnmounted(() => {
        core.unmount(instance)
      })
      
      return () => instance.vnode
    }
  })
}
```

---

## 五、样式系统架构

### 5.1 样式生成策略

```
Token Definition (JSON)
    ↓
Token Compiler
    ↓
├─→ CSS Variables (:root)
├─→ TypeScript Types
├─→ SCSS Variables (可选)
└─→ Figma Tokens (可选)
```

### 5.2 组件样式组织

```
components/
  Button/
    ├── Button.dsl.ts       # DSL定义
    ├── Button.styles.ts    # 样式定义（基于Token）
    └── Button.vue          # Vue包装器
```

样式定义示例：

```typescript
// Button.styles.ts
import { defineStyles } from '@vjs-ui/core'

export const buttonStyles = defineStyles({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '{font.family}',
    fontSize: '{font.size.base}',
    borderRadius: '{radius.md}',
    transition: 'all {motion.duration.fast} {motion.easing.ease}',
    cursor: 'pointer',
    userSelect: 'none'
  },
  
  variants: {
    type: {
      primary: {
        backgroundColor: '{color.primary}',
        color: 'white',
        '&:hover': {
          backgroundColor: '{color.primary.hover}'
        }
      },
      secondary: {
        backgroundColor: '{color.secondary}',
        color: 'white'
      }
    },
    
    size: {
      small: {
        padding: '{spacing.xs} {spacing.sm}',
        fontSize: '{font.size.sm}'
      },
      medium: {
        padding: '{spacing.sm} {spacing.md}',
        fontSize: '{font.size.base}'
      },
      large: {
        padding: '{spacing.md} {spacing.lg}',
        fontSize: '{font.size.lg}'
      }
    }
  }
})
```

---

## 六、性能优化策略

### 6.1 按需加载

```typescript
// 组件级代码分割
const Button = defineAsyncComponent(() => import('@vjs-ui/vue/Button'))

// 样式按需加载
import '@vjs-ui/vue/Button/style.css'
```

### 6.2 虚拟滚动

对于大列表场景，内置虚拟滚动支持：

```json
{
  "type": "List",
  "props": {
    "virtual": true,
    "itemHeight": 50,
    "items": "$state.largeList"
  }
}
```

### 6.3 响应式优化

- 细粒度依赖追踪，只更新变化的部分
- 批量更新机制（requestAnimationFrame）
- 计算属性缓存

### 6.4 构建优化

- Tree-shaking: preserveModules输出
- 代码分割: 动态import
- CSS提取: 独立CSS文件
- 压缩: Terser + cssnano

---

## 七、开发者工具

### 7.1 可视化DSL编辑器

```
┌─────────────────────────────────────────┐
│  Component Tree    │   Property Panel   │
│  ├─ Button         │   ┌──────────────┐ │
│  ├─ Input          │   │ Props        │ │
│  └─ Card           │   │ Style        │ │
│                    │   │ Events       │ │
│                    │   └──────────────┘ │
├─────────────────────────────────────────┤
│            Preview                       │
│    ┌────────────────────────────┐       │
│    │  [实时预览组件]             │       │
│    └────────────────────────────┘       │
├─────────────────────────────────────────┤
│  DSL JSON          │   Generated Code   │
│  {...}             │   <template>...    │
└─────────────────────────────────────────┘
```

### 7.2 CLI工具

```bash
# 创建新组件
vjs create component Button

# 生成主题
vjs theme generate --input theme.json --output theme.css

# 构建
vjs build

# 开发服务器
vjs dev
```

### 7.3 浏览器DevTools插件

- Token实时查看和修改
- 组件树可视化
- 性能分析
- DSL调试

---

## 八、企业级特性

### 8.1 无障碍(A11y)

- 自动生成ARIA属性
- 键盘导航支持
- 焦点管理
- 屏幕阅读器优化

### 8.2 国际化(i18n)

```typescript
{
  "type": "Button",
  "props": {
    "text": "$t('common.submit')"
  }
}
```

### 8.3 SSR/SSG支持

- 服务端Token解析
- 同构渲染
- Hydration优化
- 静态提取

### 8.4 测试支持

```typescript
import { mount } from '@vjs-ui/test-utils'

test('Button renders correctly', () => {
  const wrapper = mount({
    type: 'Button',
    props: { text: 'Click me' }
  })
  
  expect(wrapper.text()).toBe('Click me')
})
```

---

## 九、扩展性设计

### 9.1 插件系统

```typescript
interface Plugin {
  name: string
  install(core: Core): void
}

// 使用插件
core.use(MyPlugin)
```

### 9.2 自定义渲染器

```typescript
class CustomRenderer implements Renderer {
  // 实现自定义渲染逻辑
}

core.useRenderer(new CustomRenderer())
```

### 9.3 组件市场

- 第三方组件注册
- 版本管理
- 依赖解析

---

## 十、技术栈总结

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| 构建工具 | Vite + Rollup | 开发用Vite，构建用Rollup |
| 包管理 | pnpm + Turborepo | Monorepo管理 |
| 语言 | TypeScript | 严格模式 |
| 样式 | CSS Variables + PostCSS | 原子化可选 |
| 测试 | Vitest + Playwright | 单元+E2E |
| 文档 | VitePress | 支持Vue组件 |
| CI/CD | GitHub Actions | 自动发布 |
| 版本 | Changesets | 语义化版本 |

---

## 十一、架构优势总结

1. **跨框架复用** - 一次开发，多框架使用
2. **高性能** - 细粒度更新，虚拟滚动，懒加载
3. **易扩展** - 插件系统，自定义渲染器
4. **易用性** - DSL声明式，可视化工具
5. **企业级** - A11y，i18n，SSR，完整测试
6. **类型安全** - 完整TypeScript支持
7. **主题灵活** - Token驱动，动态切换
8. **开发效率** - CLI工具，代码生成

---

## 十二、下一步

### 参考详细实施文档

#### 📋 规划文档
- [01-PLANNING-MASTER-PLAN.md](./01-PLANNING-MASTER-PLAN.md) - 总体实施计划
- [01-PLANNING-MVP-PLAN.md](./01-PLANNING-MVP-PLAN.md) - MVP 4周实施路径
- [01-PLANNING-YAGNI-PRINCIPLES.md](./01-PLANNING-YAGNI-PRINCIPLES.md) - YAGNI原则

#### 🔧 实施文档
- [02-IMPL-GUIDE-COMPLETE.md](./02-IMPL-GUIDE-COMPLETE.md) - 完整实施指南（总导航）
- [02-IMPL-CURRENT-PHASE.md](./02-IMPL-CURRENT-PHASE.md) - 当前阶段实施计划
- [02-IMPL-CHECKLIST.md](./02-IMPL-CHECKLIST.md) - 实施清单
- [02-IMPL-PROGRESS.md](./02-IMPL-PROGRESS.md) - 实施进度追踪
- [02-IMPL-REVIEW-WEEK1.md](./02-IMPL-REVIEW-WEEK1.md) - Week 1质量评估报告

#### 📐 规范文档
- [03-SPEC-API-DESIGN.md](./03-SPEC-API-DESIGN.md) - API设计规范
- [03-SPEC-COMPONENT-DEV-GUIDE.md](./03-SPEC-COMPONENT-DEV-GUIDE.md) - 组件开发指南
- [03-SPEC-COMPONENTS-API.md](./03-SPEC-COMPONENTS-API.md) - 组件API设计
- [03-SPEC-TECHNICAL.md](./03-SPEC-TECHNICAL.md) - 技术规范
- [03-SPEC-THEME-MANAGER.md](./03-SPEC-THEME-MANAGER.md) - 主题管理器设计

#### 🔥 核心技术文档

**Token系统**：
- [04-TECH-TOKEN-PART1.md](./04-TECH-TOKEN-PART1.md) - Token系统（预期效果+设计+功能）
- [04-TECH-TOKEN-PART2.md](./04-TECH-TOKEN-PART2.md) - Token系统（性能+技术+实现）
- [04-TECH-TOKEN-PART3.md](./04-TECH-TOKEN-PART3.md) - Token系统（Bug+错误+测试）

**响应式系统**：
- [04-TECH-REACTIVE-PART1.md](./04-TECH-REACTIVE-PART1.md) - 响应式系统（预期效果+设计+功能）
- [04-TECH-REACTIVE-SYSTEM.md](./04-TECH-REACTIVE-SYSTEM.md) - 响应式系统详细设计
- [04-TECH-SIGNALS-REACTIVE.md](./04-TECH-SIGNALS-REACTIVE.md) - Signals响应式方案

**DSL系统**：
- [04-TECH-DSL-PART1.md](./04-TECH-DSL-PART1.md) - DSL系统（预期效果+设计+功能）🔴 核心
- [04-TECH-DSL-COMPLETE.md](./04-TECH-DSL-COMPLETE.md) - DSL完整方案

**性能优化**：
- [04-TECH-PERFORMANCE-COMPLETE.md](./04-TECH-PERFORMANCE-COMPLETE.md) - 性能优化完整方案
- [04-TECH-RENDER-PERFORMANCE.md](./04-TECH-RENDER-PERFORMANCE.md) - 渲染性能优化
- [04-TECH-BLOCK-OPTIMIZATION.md](./04-TECH-BLOCK-OPTIMIZATION.md) - 块级优化
- [04-TECH-ADAPTIVE-FRAME-BUDGET.md](./04-TECH-ADAPTIVE-FRAME-BUDGET.md) - 自适应帧预算
- [04-TECH-ADAPTIVE-MEMORY.md](./04-TECH-ADAPTIVE-MEMORY.md) - 自适应内存管理

**安全系统**：
- [04-TECH-SECURITY-GUIDE.md](./04-TECH-SECURITY-GUIDE.md) - 安全指南
- [04-TECH-CSP-POLICY.md](./04-TECH-CSP-POLICY.md) - CSP内容安全策略

**高级特性**：
- [04-TECH-LIFECYCLE-SYSTEM.md](./04-TECH-LIFECYCLE-SYSTEM.md) - 生命周期系统
- [04-TECH-SUSPENSE-BOUNDARY.md](./04-TECH-SUSPENSE-BOUNDARY.md) - Suspense边界
- [04-TECH-VUE3-INTEGRATION.md](./04-TECH-VUE3-INTEGRATION.md) - Vue3集成方案

#### ✅ 测试文档
- [02-TEST-COMPLETE.md](./02-TEST-COMPLETE.md) - 完整测试方案

#### 📊 项目管理
- [05-PROJECT-ROADMAP.md](./05-PROJECT-ROADMAP.md) - 项目路线图
- [05-PROJECT-SUMMARY.md](./05-PROJECT-SUMMARY.md) - 项目总结
- [05-PROJECT-AUDIT-OPTIMIZATION.md](./05-PROJECT-AUDIT-OPTIMIZATION.md) - 项目审计优化

#### 📚 文档索引
- [00-DOC-INDEX.md](./00-DOC-INDEX.md) - 文档分类索引（快速查找）
- [00-TECH-DOC-TEMPLATE.md](./00-TECH-DOC-TEMPLATE.md) - 技术文档模板
- [README-INTERNAL.md](./README-INTERNAL.md) - 内部文档说明

---

## 十三、快速导航

### 🚀 新成员入职？
1. 先读：[CORE-PRINCIPLES.md](../CORE-PRINCIPLES.md) - 核心原则
2. 再读：[01-PLANNING-ARCHITECTURE.md](./01-PLANNING-ARCHITECTURE.md) - 本文档
3. 然后：[01-PLANNING-MASTER-PLAN.md](./01-PLANNING-MASTER-PLAN.md) - 总体计划
4. 最后：根据角色阅读对应技术文档

### 💻 开始开发？
1. 查看：[02-IMPL-CURRENT-PHASE.md](./02-IMPL-CURRENT-PHASE.md) - 当前阶段
2. 参考：[02-IMPL-GUIDE-COMPLETE.md](./02-IMPL-GUIDE-COMPLETE.md) - 实施指南
3. 遵循：[03-SPEC-COMPONENT-DEV-GUIDE.md](./03-SPEC-COMPONENT-DEV-GUIDE.md) - 开发规范

### 🔍 查找技术细节？
1. 使用：[00-DOC-INDEX.md](./00-DOC-INDEX.md) - 文档索引
2. 按主题查找：Token/响应式/DSL/性能/安全等
3. 按优先级查找：P0/P1/P2

---

**最后更新**: 2025-11-09  
**维护者**: VJS-UI Team  
**状态**: ✅ 持续更新
