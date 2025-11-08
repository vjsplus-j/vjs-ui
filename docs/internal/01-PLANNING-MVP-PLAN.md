# VJS-UI MVP实施计划

> **目标**: 用4周时间实现可验证的最小可行产品  
> **原则**: 简单、稳定、可扩展  
> **状态**: 🎯 执行方案

---

## 一、MVP范围定义

### 1.1 包含功能 ✅

```typescript
/**
 * MVP核心功能清单
 */
const MVP_FEATURES = {
  // 基础DSL（无表达式）
  dsl: {
    staticProps: true,      // 静态属性
    staticStyle: true,      // 静态样式
    staticEvents: false,    // ❌ 暂不支持
    conditionalRender: false, // ❌ 暂不支持
    listRender: false,      // ❌ 暂不支持
    slots: true            // 基础插槽
  },
  
  // 基础响应式（仅reactive）
  reactive: {
    reactive: true,         // reactive对象
    effect: true,          // 基础effect
    computed: false,       // ❌ 暂不支持
    watch: false,          // ❌ 暂不支持
    ref: true             // ref引用
  },
  
  // Token系统（简化版）
  tokens: {
    static: true,          // 静态Token
    runtime: false,        // ❌ 运行时切换
    compiler: true         // 基础编译
  },
  
  // 组件（3个基础组件）
  components: {
    Button: true,
    Input: true,
    Card: true,
    Dialog: false,         // ❌ v0.2.0
    Table: false          // ❌ v0.2.0
  },
  
  // 测试
  testing: {
    unitTests: true,       // 基础单元测试
    coverage: 70          // 目标覆盖率70%
  }
}
```

### 1.2 不包含功能 ❌

```typescript
const MVP_EXCLUDED = {
  // 高级特性
  expressionEngine: false,    // 表达式求值
  securitySandbox: false,     // 安全沙箱
  virtualScroll: false,       // 虚拟滚动
  
  // 跨框架
  reactAdapter: false,        // React适配
  webComponents: false,       // Web Components
  
  // 工具
  cli: false,                // CLI工具
  playground: false,         // 在线演示
  devtools: false,          // 开发者工具
  
  // 企业级
  i18n: false,              // 国际化
  a11y: false,              // 无障碍
  ssr: false               // 服务端渲染
}
```

---

## 二、MVP实施路径（4周）

### Week 1: 基础架构 + Token系统

#### Day 1-2: 项目初始化
```bash
# 创建核心包
mkdir -p packages/core/src/{types,token,reactive}
mkdir -p packages/vue/src/{adapter,components}

# 创建测试目录
mkdir -p packages/core/test/unit
```

#### Day 3-5: Token系统
```typescript
// packages/core/src/token/simple-token.ts

/**
 * MVP版Token系统（简化版）
 */
export interface SimpleToken {
  [key: string]: string | number
}

export class SimpleTokenCompiler {
  compile(tokens: SimpleToken): string {
    const lines: string[] = [':root {']
    
    for (const [key, value] of Object.entries(tokens)) {
      lines.push(`  --vjs-${key.replace(/\./g, '-')}: ${value};`)
    }
    
    lines.push('}')
    return lines.join('\n')
  }
}

// 使用示例
const tokens = {
  'color-primary': '#1677ff',
  'spacing-md': '16px'
}

const compiler = new SimpleTokenCompiler()
const css = compiler.compile(tokens)
// 输出CSS文件
```

**测试：**
```typescript
describe('SimpleTokenCompiler', () => {
  it('should compile tokens to CSS', () => {
    const compiler = new SimpleTokenCompiler()
    const css = compiler.compile({ 'color-primary': '#1677ff' })
    expect(css).toContain('--vjs-color-primary: #1677ff')
  })
})
```

#### Day 6-7: 基础响应式
```typescript
// packages/core/src/reactive/simple-reactive.ts

/**
 * MVP版响应式系统（仅reactive + effect）
 */

let activeEffect: Function | undefined

export function effect(fn: Function): Function {
  const effectFn = () => {
    activeEffect = effectFn
    fn()
    activeEffect = undefined
  }
  
  effectFn()
  return effectFn
}

export function reactive<T extends object>(target: T): T {
  const deps = new Map<string, Set<Function>>()
  
  return new Proxy(target, {
    get(target, key) {
      // 依赖收集
      if (activeEffect) {
        if (!deps.has(key as string)) {
          deps.set(key as string, new Set())
        }
        deps.get(key as string)!.add(activeEffect)
      }
      return Reflect.get(target, key)
    },
    
    set(target, key, value) {
      const result = Reflect.set(target, key, value)
      
      // 触发更新
      const effects = deps.get(key as string)
      if (effects) {
        effects.forEach(effect => effect())
      }
      
      return result
    }
  })
}

export function ref<T>(value: T) {
  const wrapper = { value }
  return reactive(wrapper)
}
```

**测试：**
```typescript
describe('Simple Reactive', () => {
  it('should track and trigger', () => {
    const state = reactive({ count: 0 })
    let dummy
    
    effect(() => {
      dummy = state.count
    })
    
    expect(dummy).toBe(0)
    state.count = 1
    expect(dummy).toBe(1)
  })
})
```

---

### Week 2: DSL解析器 + Vue渲染器

#### Day 8-10: 简单DSL解析器
```typescript
// packages/core/src/dsl/simple-parser.ts

/**
 * MVP版DSL解析器（无表达式）
 */
export interface SimpleDSL {
  type: string
  props?: Record<string, any>
  style?: Record<string, string>
  children?: SimpleDSL[]
}

export interface SimpleVNode {
  type: string
  props: Record<string, any>
  style: Record<string, string>
  children: SimpleVNode[]
}

export class SimpleParser {
  parse(dsl: SimpleDSL): SimpleVNode {
    return {
      type: dsl.type,
      props: dsl.props || {},
      style: dsl.style || {},
      children: (dsl.children || []).map(child => this.parse(child))
    }
  }
}

// 使用示例
const dsl: SimpleDSL = {
  type: 'Button',
  props: {
    text: 'Click Me',
    disabled: false
  },
  style: {
    color: 'var(--vjs-color-primary)'
  }
}

const parser = new SimpleParser()
const vnode = parser.parse(dsl)
```

**测试：**
```typescript
describe('SimpleParser', () => {
  it('should parse DSL to VNode', () => {
    const parser = new SimpleParser()
    const vnode = parser.parse({
      type: 'Button',
      props: { text: 'Click' }
    })
    
    expect(vnode.type).toBe('Button')
    expect(vnode.props.text).toBe('Click')
  })
  
  it('should parse nested children', () => {
    const parser = new SimpleParser()
    const vnode = parser.parse({
      type: 'Card',
      children: [
        { type: 'Button', props: { text: 'OK' } }
      ]
    })
    
    expect(vnode.children).toHaveLength(1)
    expect(vnode.children[0].type).toBe('Button')
  })
})
```

#### Day 11-14: Vue渲染器
```typescript
// packages/vue/src/adapter/simple-renderer.ts

import { h, createApp } from 'vue'
import type { SimpleVNode } from '@vjs-ui/core'

/**
 * MVP版Vue渲染器
 */
export class SimpleVueRenderer {
  private componentMap = new Map<string, any>()
  
  registerComponent(name: string, component: any): void {
    this.componentMap.set(name, component)
  }
  
  render(vnode: SimpleVNode): any {
    const component = this.componentMap.get(vnode.type)
    
    if (!component) {
      console.warn(`Component not found: ${vnode.type}`)
      return h('div', `[${vnode.type}]`)
    }
    
    const children = vnode.children.map(child => this.render(child))
    
    return h(component, {
      ...vnode.props,
      style: vnode.style
    }, children.length > 0 ? children : undefined)
  }
  
  mount(vnode: SimpleVNode, container: Element): void {
    const app = createApp({
      render: () => this.render(vnode)
    })
    
    app.mount(container)
  }
}
```

---

### Week 3: 基础组件实现

#### VButton（MVP版）
```vue
<!-- packages/vue/src/components/Button/Button.vue -->
<template>
  <button
    :class="['vjs-button', `vjs-button--${type}`]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot>{{ text }}</slot>
  </button>
</template>

<script setup lang="ts">
defineOptions({ name: 'VButton' })

interface Props {
  type?: 'default' | 'primary'
  text?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'default',
  disabled: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<style scoped>
.vjs-button {
  padding: var(--vjs-spacing-md);
  border: 1px solid var(--vjs-color-border);
  border-radius: var(--vjs-radius-md);
  background: var(--vjs-color-bg);
  cursor: pointer;
  font-size: var(--vjs-font-size-base);
}

.vjs-button--primary {
  background: var(--vjs-color-primary);
  color: white;
  border-color: var(--vjs-color-primary);
}

.vjs-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
```

#### VInput（MVP版）
```vue
<!-- packages/vue/src/components/Input/Input.vue -->
<template>
  <input
    :class="['vjs-input']"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="handleInput"
  />
</template>

<script setup lang="ts">
defineOptions({ name: 'VInput' })

interface Props {
  modelValue?: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.vjs-input {
  padding: var(--vjs-spacing-sm);
  border: 1px solid var(--vjs-color-border);
  border-radius: var(--vjs-radius-md);
  font-size: var(--vjs-font-size-base);
  width: 100%;
}

.vjs-input:focus {
  outline: none;
  border-color: var(--vjs-color-primary);
}

.vjs-input:disabled {
  background: var(--vjs-color-bg-disabled);
  cursor: not-allowed;
}
</style>
```

#### VCard（MVP版）
```vue
<!-- packages/vue/src/components/Card/Card.vue -->
<template>
  <div class="vjs-card">
    <div v-if="$slots.header" class="vjs-card__header">
      <slot name="header" />
    </div>
    
    <div class="vjs-card__body">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="vjs-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'VCard' })
</script>

<style scoped>
.vjs-card {
  border: 1px solid var(--vjs-color-border);
  border-radius: var(--vjs-radius-md);
  background: var(--vjs-color-bg);
  box-shadow: var(--vjs-shadow-sm);
  overflow: hidden;
}

.vjs-card__header {
  padding: var(--vjs-spacing-md);
  border-bottom: 1px solid var(--vjs-color-border);
  font-weight: 600;
}

.vjs-card__body {
  padding: var(--vjs-spacing-md);
}

.vjs-card__footer {
  padding: var(--vjs-spacing-md);
  border-top: 1px solid var(--vjs-color-border);
}
</style>
```

---

### Week 4: 集成测试 + 文档

#### Day 22-24: 集成测试
```typescript
// packages/vue/test/integration/mvp.test.ts

describe('MVP Integration', () => {
  it('should render DSL with Vue', () => {
    const dsl = {
      type: 'Button',
      props: { text: 'Click Me' }
    }
    
    const parser = new SimpleParser()
    const renderer = new SimpleVueRenderer()
    renderer.registerComponent('Button', VButton)
    
    const vnode = parser.parse(dsl)
    const container = document.createElement('div')
    renderer.mount(vnode, container)
    
    expect(container.querySelector('.vjs-button')).toBeTruthy()
    expect(container.textContent).toContain('Click Me')
  })
  
  it('should work with reactive state', async () => {
    const state = reactive({ count: 0 })
    
    const wrapper = mount({
      setup() {
        return { state }
      },
      template: `
        <VButton @click="state.count++">
          Count: {{ state.count }}
        </VButton>
      `,
      components: { VButton }
    })
    
    await wrapper.find('.vjs-button').trigger('click')
    expect(wrapper.text()).toContain('Count: 1')
  })
})
```

#### Day 25-26: 示例应用
```vue
<!-- examples/mvp-demo/App.vue -->
<template>
  <div class="demo">
    <VCard>
      <template #header>
        <h2>VJS-UI MVP Demo</h2>
      </template>
      
      <div class="demo-content">
        <VInput v-model="name" placeholder="Enter your name" />
        
        <VButton type="primary" @click="handleClick">
          Hello, {{ name || 'World' }}!
        </VButton>
        
        <p>Clicked {{ count }} times</p>
      </div>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VButton, VInput, VCard } from '@vjs-ui/vue'

const name = ref('')
const count = ref(0)

const handleClick = () => {
  count.value++
  alert(`Hello, ${name.value || 'World'}!`)
}
</script>
```

#### Day 27-28: 文档
```markdown
# VJS-UI v0.1.0 (MVP)

## 快速开始

\`\`\`bash
pnpm add @vjs-ui/vue
\`\`\`

## 基础用法

\`\`\`vue
<template>
  <VButton type="primary" @click="handleClick">
    Click Me
  </VButton>
</template>

<script setup>
import { VButton } from '@vjs-ui/vue'

const handleClick = () => {
  console.log('clicked')
}
</script>
\`\`\`

## 当前功能

- ✅ 3个基础组件（Button, Input, Card）
- ✅ 简单DSL支持
- ✅ 基础响应式系统
- ✅ Token系统

## 即将推出（v0.2.0）

- 表达式支持
- Dialog和Table组件
- 更多主题
```

---

## 三、MVP成功标准

### 功能标准
- [x] 3个组件可正常使用
- [x] DSL可以渲染基础组件
- [x] 响应式状态更新正常
- [x] Token系统工作正常

### 质量标准
- [ ] 单元测试覆盖率 > 70%
- [ ] 无严重bug
- [ ] 文档完整

### 性能标准
- [ ] 核心包 < 30KB (gzipped)
- [ ] 组件渲染 < 50ms

---

## 四、MVP之后的路线图

### v0.2.0 - Alpha (Week 5-10)
- 表达式引擎
- 安全沙箱
- Dialog和Table组件
- computed和watch

### v0.5.0 - Beta (Week 11-16)
- 完整的Vue适配
- 10个组件
- CLI工具
- Playground

### v1.0.0 - Release (Week 17-26)
- React适配
- 性能优化
- 完整文档
- 生产就绪

---

**MVP目标**: 4周内交付可用的基础版本，验证技术方案可行性。
