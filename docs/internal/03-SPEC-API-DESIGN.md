# VJS-UI API设计文档

> **版本**: 1.0.0  
> **更新日期**: 2025-01-08

---

## 一、Core API

### 1.1 createCore()

创建Core引擎实例。

```typescript
import { createCore, createVueRenderer } from '@vjs-ui/core'
import { compileTokens } from '@vjs-ui/tokens'

const core = createCore({
  tokens: {
    'color.primary': '#1677ff',
    'spacing.md': '16px'
  },
  initialState: {
    count: 0
  },
  renderer: createVueRenderer()
})
```

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| tokens | FlatTokenMap | 是 | Design Tokens |
| initialState | Record<string, any> | 否 | 初始状态 |
| renderer | Renderer | 是 | 渲染器实例 |

**返回值：** `Core` 实例

---

### 1.2 Core.render()

渲染DSL到DOM容器。

```typescript
const dsl = {
  type: 'Button',
  props: { text: 'Click Me' },
  events: { onClick: "console.log('clicked')" }
}

const instance = core.render(dsl, document.getElementById('app'))
```

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| dsl | DSLNode | 是 | DSL节点定义 |
| container | Element | 是 | DOM容器 |
| props | Record<string, any> | 否 | 传入的props |

**返回值：** `RenderInstance`

---

### 1.3 Core.setState()

更新全局状态。

```typescript
core.setState({ count: 1 })
```

---

## 二、Token API

### 2.1 compileTokens()

编译Token定义。

```typescript
import { compileTokens } from '@vjs-ui/tokens'
import tokens from './tokens.json'

// 编译为CSS Variables
const css = compileTokens(tokens, { format: 'css' })

// 编译为TypeScript类型
const types = compileTokens(tokens, { format: 'ts' })
```

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| tokens | TokenMap | 是 | Token定义 |
| options | TokenCompileOptions | 否 | 编译选项 |

**选项：**

```typescript
interface TokenCompileOptions {
  prefix?: string  // CSS变量前缀，默认'vjs'
  format?: 'css' | 'scss' | 'ts' | 'json'
  minify?: boolean
}
```

---

### 2.2 createTokenRuntime()

创建Token运行时。

```typescript
import { createTokenRuntime } from '@vjs-ui/tokens'

const tokenRuntime = createTokenRuntime({
  tokens: flatTokens,
  prefix: 'vjs'
})

// 获取token值
const color = tokenRuntime.get('color.primary')

// 运行时修改token
tokenRuntime.set('color.primary', '#ff0000')

// 监听变化
tokenRuntime.onChange((tokens) => {
  console.log('Tokens updated:', tokens)
})
```

---

## 三、Vue API

### 3.1 组合式函数

#### useCore()

访问Core实例。

```typescript
import { useCore } from '@vjs-ui/vue'

const core = useCore()
const state = core.getState()
```

#### useDSL()

渲染DSL。

```typescript
import { useDSL } from '@vjs-ui/vue'

const dsl = ref({
  type: 'Button',
  props: { text: 'Click' }
})

const { containerRef, render } = useDSL(dsl)

onMounted(() => {
  render()
})
```

#### useToken()

访问和修改Tokens。

```typescript
import { useToken } from '@vjs-ui/vue'

const { getToken, setToken, token } = useToken()

// 获取token值
const primaryColor = getToken('color.primary')

// 响应式token
const color = token('color.primary')
watch(color, (newColor) => {
  console.log('Color changed:', newColor)
})

// 修改token
setToken('color.primary', '#00ff00')
```

#### useTheme()

主题管理。

```typescript
import { useTheme } from '@vjs-ui/vue'
import darkTokens from './themes/dark.json'

const { currentTheme, setTheme, toggleDark } = useTheme()

// 切换主题
setTheme('dark', darkTokens)

// 切换暗黑模式
toggleDark()
```

---

### 3.2 组件API

#### VButton

```vue
<template>
  <VButton
    type="primary"
    size="medium"
    :loading="isLoading"
    :disabled="isDisabled"
    @click="handleClick"
  >
    点击我
  </VButton>
</template>
```

**Props:**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type | 'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' | 'default' | 按钮类型 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 按钮尺寸 |
| text | string | - | 按钮文本 |
| icon | Component | - | 图标组件 |
| loading | boolean | false | 加载状态 |
| disabled | boolean | false | 禁用状态 |
| block | boolean | false | 块级按钮 |

**Events:**

| 事件 | 参数 | 说明 |
|------|------|------|
| click | (event: MouseEvent) => void | 点击事件 |

**Slots:**

| 插槽 | 说明 |
|------|------|
| default | 按钮内容 |
| loading | 自定义加载状态 |

---

#### VInput

```vue
<template>
  <VInput
    v-model="value"
    type="text"
    placeholder="请输入"
    :maxlength="100"
    @change="handleChange"
  />
</template>
```

**Props:**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | string \| number | - | 输入值（v-model） |
| type | string | 'text' | 输入类型 |
| placeholder | string | - | 占位符 |
| disabled | boolean | false | 禁用状态 |
| readonly | boolean | false | 只读状态 |
| maxlength | number | - | 最大长度 |
| clearable | boolean | false | 可清空 |

**Events:**

| 事件 | 参数 | 说明 |
|------|------|------|
| update:modelValue | (value: string \| number) => void | 值变化 |
| change | (value: string \| number) => void | 值改变 |
| blur | (event: FocusEvent) => void | 失去焦点 |
| focus | (event: FocusEvent) => void | 获得焦点 |

---

## 四、DSL API

### 4.1 DSL节点定义

```typescript
interface DSLNode {
  // 基础
  type: string
  
  // 属性
  props?: Record<string, any>
  
  // 样式（支持Token引用和表达式）
  style?: Record<string, string | DSLExpression>
  
  // 事件
  events?: Record<string, string | Function>
  
  // 状态
  state?: Record<string, any>
  
  // 插槽
  slots?: Record<string, string | DSLNode | DSLNode[]>
  
  // 条件渲染
  if?: DSLExpression
  
  // 列表渲染
  for?: string  // "item in items"
  
  // 引用
  ref?: string
}
```

### 4.2 DSL表达式

支持的表达式语法：

**变量引用：**
```json
{
  "props": {
    "text": "$state.message",
    "count": "$props.value"
  }
}
```

**Token引用：**
```json
{
  "style": {
    "color": "{color.primary}",
    "padding": "{spacing.md}"
  }
}
```

**计算表达式：**
```json
{
  "props": {
    "disabled": "$state.loading || $props.disabled",
    "text": "$state.count > 0 ? 'Active' : 'Inactive'"
  }
}
```

**事件处理：**
```json
{
  "events": {
    "onClick": "$state.count = $state.count + 1; emit('update', $state.count)"
  }
}
```

---

## 五、插件API

### 5.1 创建插件

```typescript
import type { Core } from '@vjs-ui/core'

export interface Plugin {
  name: string
  install(core: Core): void
}

// 示例：日志插件
export const LoggerPlugin: Plugin = {
  name: 'logger',
  install(core) {
    const originalRender = core.render.bind(core)
    core.render = (dsl, container, props) => {
      console.log('Rendering DSL:', dsl)
      return originalRender(dsl, container, props)
    }
  }
}

// 使用插件
core.use(LoggerPlugin)
```

---

## 六、CLI API

### 6.1 命令列表

```bash
# 初始化项目
vjs init my-project

# 创建组件
vjs create component MyButton
vjs create component MyTable --template=table

# 生成主题
vjs theme generate --input theme.json --output dist/theme.css

# 开发服务器
vjs dev --port 3000

# 构建
vjs build --analyze

# 发布
vjs release --tag beta
```

### 6.2 配置文件

```typescript
// vjs.config.ts
import { defineConfig } from '@vjs-ui/cli'

export default defineConfig({
  // Token路径
  tokens: './tokens/default.json',
  
  // 输出目录
  outDir: 'dist',
  
  // 主题配置
  themes: {
    default: './tokens/default.json',
    dark: './tokens/dark.json'
  },
  
  // 组件路径
  components: './src/components',
  
  // 构建选项
  build: {
    minify: true,
    sourcemap: true
  }
})
```

---

## 七、类型导出

### 7.1 Core类型

```typescript
import type {
  // DSL
  DSLNode,
  DSLExpression,
  
  // VNode
  VNode,
  RuntimeContext,
  
  // Token
  TokenDefinition,
  TokenMap,
  FlatTokenMap,
  
  // Renderer
  Renderer,
  RenderHandle,
  
  // Core
  Core,
  CoreConfig,
  RenderInstance
} from '@vjs-ui/core'
```

### 7.2 Vue类型

```typescript
import type {
  // 组件Props
  ButtonProps,
  InputProps,
  CardProps,
  
  // 组件Emits
  ButtonEmits,
  InputEmits
} from '@vjs-ui/vue'
```

---

## 八、最佳实践

### 8.1 性能优化

```typescript
// ✅ 使用computed缓存计算结果
const filteredItems = computed(() => {
  return items.value.filter(item => item.active)
})

// ✅ 使用异步组件
const VDataTable = defineAsyncComponent(() => import('@vjs-ui/vue/DataTable'))

// ✅ 按需导入样式
import '@vjs-ui/vue/Button/style.css'
```

### 8.2 状态管理

```typescript
// ✅ 使用Core的全局状态
const core = useCore()
core.setState({ theme: 'dark' })

// ✅ 组件内部状态使用ref/reactive
const localState = reactive({ count: 0 })
```

### 8.3 主题定制

```typescript
// 1. 定义自定义tokens
const customTokens = {
  'color.primary': '#your-color',
  'radius.md': '12px'
}

// 2. 应用主题
const { setTheme } = useTheme()
setTheme('custom', customTokens)

// 3. 或者在初始化时配置
const core = createCore({
  tokens: customTokens,
  // ...
})
```

---

## 九、迁移指南

### 9.1 从Element Plus迁移

```vue
<!-- Element Plus -->
<el-button type="primary" @click="handleClick">
  Click
</el-button>

<!-- VJS-UI -->
<VButton type="primary" @click="handleClick">
  Click
</VButton>
```

### 9.2 从Ant Design Vue迁移

```vue
<!-- Ant Design Vue -->
<a-button type="primary" :loading="loading">
  Click
</a-button>

<!-- VJS-UI -->
<VButton type="primary" :loading="loading">
  Click
</VButton>
```

---

**API文档持续更新中...**

**在线文档**: https://vjs-ui.dev/api
**GitHub**: https://github.com/vjsplus-j/vjs-ui
