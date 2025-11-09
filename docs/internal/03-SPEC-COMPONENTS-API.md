# VJS-UI 组件API设计

> **版本**: 1.0.0  
> **创建日期**: 2025-11-09  
> **状态**: ✅ 设计完成  
> **范围**: Button、Input、Card 三个基础组件

---

## 📋 设计原则

### 1. API一致性
- 所有组件使用统一的命名规范
- Props命名使用驼峰命名法
- Events使用`on`前缀
- Slots使用语义化命名

### 2. TypeScript优先
- 所有Props必须有类型定义
- 所有Events必须有类型定义
- 提供完整的类型导出

### 3. 主题集成
- 所有组件自动适配主题系统
- 使用CSS Variables
- 不需要手动传递主题

### 4. 简单易用
- 合理的默认值
- 清晰的文档注释
- 丰富的使用示例

---

## 🔘 Button 按钮

### 组件概述

按钮用于触发操作或提交表单。

### TypeScript类型定义

```typescript
/**
 * 按钮类型
 */
export type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'default'

/**
 * 按钮尺寸
 */
export type ButtonSize = 'small' | 'medium' | 'large'

/**
 * 按钮HTML类型
 */
export type ButtonHtmlType = 'button' | 'submit' | 'reset'

/**
 * Button组件Props
 */
export interface ButtonProps {
  /**
   * 按钮类型
   * @default 'default'
   */
  type?: ButtonType

  /**
   * 按钮尺寸
   * @default 'medium'
   */
  size?: ButtonSize

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean

  /**
   * 是否加载中
   * @default false
   */
  loading?: boolean

  /**
   * 是否块级元素（100%宽度）
   * @default false
   */
  block?: boolean

  /**
   * 是否圆形按钮
   * @default false
   */
  circle?: boolean

  /**
   * 是否圆角按钮
   * @default false
   */
  round?: boolean

  /**
   * 原生button的type属性
   * @default 'button'
   */
  htmlType?: ButtonHtmlType

  /**
   * 图标（图标名称或emoji）
   */
  icon?: string

  /**
   * 图标位置
   * @default 'left'
   */
  iconPosition?: 'left' | 'right'
}

/**
 * Button组件Emits
 */
export interface ButtonEmits {
  /**
   * 点击事件
   * @param event 原生鼠标事件
   */
  (e: 'click', event: MouseEvent): void
}

/**
 * Button组件Slots
 */
export interface ButtonSlots {
  /**
   * 默认插槽 - 按钮内容
   */
  default?: () => any

  /**
   * 图标插槽 - 自定义图标
   */
  icon?: () => any
}
```

### 使用示例

```vue
<template>
  <!-- 基础用法 -->
  <VButton>默认按钮</VButton>
  <VButton type="primary">主要按钮</VButton>
  <VButton type="success">成功按钮</VButton>
  <VButton type="warning">警告按钮</VButton>
  <VButton type="danger">危险按钮</VButton>

  <!-- 尺寸 -->
  <VButton size="small">小按钮</VButton>
  <VButton size="medium">中等按钮</VButton>
  <VButton size="large">大按钮</VButton>

  <!-- 状态 -->
  <VButton disabled>禁用按钮</VButton>
  <VButton loading>加载中</VButton>

  <!-- 样式变体 -->
  <VButton block>块级按钮</VButton>
  <VButton circle icon="🔍"></VButton>
  <VButton round>圆角按钮</VButton>

  <!-- 图标 -->
  <VButton icon="✨">带图标</VButton>
  <VButton icon="✨" icon-position="right">图标在右</VButton>

  <!-- 事件 -->
  <VButton @click="handleClick">点击我</VButton>

  <!-- 插槽 -->
  <VButton>
    <template #icon>
      <span>🎨</span>
    </template>
    自定义图标
  </VButton>
</template>

<script setup lang="ts">
const handleClick = (event: MouseEvent) => {
  console.log('按钮被点击', event)
}
</script>
```

### CSS类名

```css
.vjs-button              /* 基础类 */
.vjs-button--primary     /* 类型：主要 */
.vjs-button--success     /* 类型：成功 */
.vjs-button--warning     /* 类型：警告 */
.vjs-button--danger      /* 类型：危险 */
.vjs-button--default     /* 类型：默认 */
.vjs-button--small       /* 尺寸：小 */
.vjs-button--medium      /* 尺寸：中 */
.vjs-button--large       /* 尺寸：大 */
.vjs-button--disabled    /* 状态：禁用 */
.vjs-button--loading     /* 状态：加载中 */
.vjs-button--block       /* 样式：块级 */
.vjs-button--circle      /* 样式：圆形 */
.vjs-button--round       /* 样式：圆角 */
.vjs-button__icon        /* 图标元素 */
.vjs-button__content     /* 内容元素 */
.vjs-button__loader      /* 加载动画元素 */
```

---

## 📝 Input 输入框

### 组件概述

输入框用于用户输入数据。

### TypeScript类型定义

```typescript
/**
 * 输入框类型
 */
export type InputType = 'text' | 'password' | 'number' | 'email' | 'tel' | 'url'

/**
 * 输入框尺寸
 */
export type InputSize = 'small' | 'medium' | 'large'

/**
 * Input组件Props
 */
export interface InputProps {
  /**
   * 绑定值（支持v-model）
   */
  modelValue?: string | number

  /**
   * 输入框类型
   * @default 'text'
   */
  type?: InputType

  /**
   * 输入框尺寸
   * @default 'medium'
   */
  size?: InputSize

  /**
   * 占位文本
   */
  placeholder?: string

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean

  /**
   * 是否只读
   * @default false
   */
  readonly?: boolean

  /**
   * 是否必填
   * @default false
   */
  required?: boolean

  /**
   * 是否可清空
   * @default false
   */
  clearable?: boolean

  /**
   * 是否显示密码切换按钮（仅type="password"有效）
   * @default false
   */
  showPassword?: boolean

  /**
   * 最大长度
   */
  maxlength?: number

  /**
   * 是否显示字数统计
   * @default false
   */
  showCount?: boolean

  /**
   * 前缀图标
   */
  prefixIcon?: string

  /**
   * 后缀图标
   */
  suffixIcon?: string

  /**
   * 错误状态
   * @default false
   */
  error?: boolean

  /**
   * 错误信息
   */
  errorMessage?: string

  /**
   * 原生name属性
   */
  name?: string

  /**
   * 原生autocomplete属性
   */
  autocomplete?: string
}

/**
 * Input组件Emits
 */
export interface InputEmits {
  /**
   * v-model更新事件
   * @param value 新值
   */
  (e: 'update:modelValue', value: string | number): void

  /**
   * 输入事件
   * @param value 当前值
   * @param event 原生事件
   */
  (e: 'input', value: string | number, event: Event): void

  /**
   * 改变事件（失焦时触发）
   * @param value 当前值
   * @param event 原生事件
   */
  (e: 'change', value: string | number, event: Event): void

  /**
   * 获得焦点事件
   * @param event 原生事件
   */
  (e: 'focus', event: FocusEvent): void

  /**
   * 失去焦点事件
   * @param event 原生事件
   */
  (e: 'blur', event: FocusEvent): void

  /**
   * 清空事件
   */
  (e: 'clear'): void

  /**
   * 回车事件
   * @param event 原生事件
   */
  (e: 'enter', event: KeyboardEvent): void
}

/**
 * Input组件Slots
 */
export interface InputSlots {
  /**
   * 前置内容
   */
  prefix?: () => any

  /**
   * 后置内容
   */
  suffix?: () => any

  /**
   * 前置元素（外部）
   */
  prepend?: () => any

  /**
   * 后置元素（外部）
   */
  append?: () => any
}

/**
 * Input组件暴露的方法
 */
export interface InputExpose {
  /**
   * 使输入框获得焦点
   */
  focus: () => void

  /**
   * 使输入框失去焦点
   */
  blur: () => void

  /**
   * 选中输入框文本
   */
  select: () => void

  /**
   * 清空输入框
   */
  clear: () => void
}
```

### 使用示例

```vue
<template>
  <!-- 基础用法 -->
  <VInput v-model="value" placeholder="请输入内容" />

  <!-- 类型 -->
  <VInput v-model="password" type="password" placeholder="请输入密码" />
  <VInput v-model="email" type="email" placeholder="请输入邮箱" />

  <!-- 尺寸 -->
  <VInput v-model="value" size="small" />
  <VInput v-model="value" size="medium" />
  <VInput v-model="value" size="large" />

  <!-- 状态 -->
  <VInput v-model="value" disabled />
  <VInput v-model="value" readonly />

  <!-- 功能 -->
  <VInput v-model="value" clearable />
  <VInput v-model="password" type="password" show-password />
  <VInput v-model="value" maxlength="10" show-count />

  <!-- 图标 -->
  <VInput v-model="value" prefix-icon="🔍" />
  <VInput v-model="value" suffix-icon="✨" />

  <!-- 错误状态 -->
  <VInput v-model="value" error error-message="输入有误" />

  <!-- 事件 -->
  <VInput 
    v-model="value" 
    @input="handleInput"
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur"
    @clear="handleClear"
    @enter="handleEnter"
  />

  <!-- 插槽 -->
  <VInput v-model="value">
    <template #prefix>
      <span>🔍</span>
    </template>
    <template #suffix>
      <span>✨</span>
    </template>
  </VInput>

  <VInput v-model="value">
    <template #prepend>
      <span>http://</span>
    </template>
    <template #append>
      <span>.com</span>
    </template>
  </VInput>

  <!-- 暴露的方法 -->
  <VInput ref="inputRef" v-model="value" />
  <button @click="inputRef?.focus()">聚焦</button>
  <button @click="inputRef?.clear()">清空</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { InputExpose } from 'vjs-ui'

const value = ref('')
const password = ref('')
const email = ref('')
const inputRef = ref<InputExpose>()

const handleInput = (value: string | number, event: Event) => {
  console.log('输入:', value, event)
}

const handleChange = (value: string | number, event: Event) => {
  console.log('改变:', value, event)
}

const handleFocus = (event: FocusEvent) => {
  console.log('获得焦点:', event)
}

const handleBlur = (event: FocusEvent) => {
  console.log('失去焦点:', event)
}

const handleClear = () => {
  console.log('清空')
}

const handleEnter = (event: KeyboardEvent) => {
  console.log('回车:', event)
}
</script>
```

### CSS类名

```css
.vjs-input                /* 基础类（容器） */
.vjs-input--small         /* 尺寸：小 */
.vjs-input--medium        /* 尺寸：中 */
.vjs-input--large         /* 尺寸：大 */
.vjs-input--disabled      /* 状态：禁用 */
.vjs-input--readonly      /* 状态：只读 */
.vjs-input--error         /* 状态：错误 */
.vjs-input--focused       /* 状态：聚焦 */
.vjs-input__wrapper       /* 输入框包装器 */
.vjs-input__inner         /* 原生input元素 */
.vjs-input__prefix        /* 前缀容器 */
.vjs-input__suffix        /* 后缀容器 */
.vjs-input__prepend       /* 前置元素 */
.vjs-input__append        /* 后置元素 */
.vjs-input__clear         /* 清空按钮 */
.vjs-input__password      /* 密码切换按钮 */
.vjs-input__count         /* 字数统计 */
.vjs-input__error-message /* 错误信息 */
```

---

## 🎴 Card 卡片

### 组件概述

卡片容器，用于展示内容。

### TypeScript类型定义

```typescript
/**
 * 卡片阴影
 */
export type CardShadow = 'always' | 'hover' | 'never'

/**
 * Card组件Props
 */
export interface CardProps {
  /**
   * 卡片标题
   */
  title?: string

  /**
   * 是否显示边框
   * @default true
   */
  bordered?: boolean

  /**
   * 阴影显示时机
   * @default 'always'
   */
  shadow?: CardShadow

  /**
   * 是否可悬停（悬停时有动画效果）
   * @default false
   */
  hoverable?: boolean

  /**
   * 卡片内边距
   * @default '20px'
   */
  padding?: string

  /**
   * 背景色（如果需要自定义）
   */
  backgroundColor?: string

  /**
   * 是否加载中
   * @default false
   */
  loading?: boolean
}

/**
 * Card组件Emits
 */
export interface CardEmits {
  /**
   * 点击事件
   * @param event 原生鼠标事件
   */
  (e: 'click', event: MouseEvent): void
}

/**
 * Card组件Slots
 */
export interface CardSlots {
  /**
   * 默认插槽 - 卡片内容
   */
  default?: () => any

  /**
   * 标题插槽 - 自定义标题区域
   */
  header?: () => any

  /**
   * 底部插槽 - 底部区域
   */
  footer?: () => any

  /**
   * 额外内容插槽 - 标题右侧的额外内容
   */
  extra?: () => any

  /**
   * 封面插槽 - 卡片顶部封面图
   */
  cover?: () => any
}
```

### 使用示例

```vue
<template>
  <!-- 基础用法 -->
  <VCard title="卡片标题">
    <p>卡片内容</p>
  </VCard>

  <!-- 无边框 -->
  <VCard :bordered="false">
    <p>无边框卡片</p>
  </VCard>

  <!-- 阴影 -->
  <VCard shadow="always">始终显示阴影</VCard>
  <VCard shadow="hover">悬停显示阴影</VCard>
  <VCard shadow="never">不显示阴影</VCard>

  <!-- 可悬停 -->
  <VCard hoverable>
    <p>悬停有动画效果</p>
  </VCard>

  <!-- 自定义内边距 -->
  <VCard padding="40px">
    <p>大内边距</p>
  </VCard>

  <!-- 加载中 -->
  <VCard loading>
    <p>内容加载中...</p>
  </VCard>

  <!-- 完整示例 -->
  <VCard 
    title="完整卡片"
    bordered
    shadow="hover"
    hoverable
    @click="handleClick"
  >
    <template #extra>
      <a href="#">更多</a>
    </template>

    <template #cover>
      <img src="cover.jpg" alt="封面" />
    </template>

    <p>这是卡片的主要内容区域</p>
    <p>可以放置任意内容</p>

    <template #footer>
      <div class="card-actions">
        <button>操作1</button>
        <button>操作2</button>
      </div>
    </template>
  </VCard>

  <!-- 自定义标题 -->
  <VCard>
    <template #header>
      <div class="custom-header">
        <h3>🎨 自定义标题</h3>
        <span>副标题</span>
      </div>
    </template>

    <p>卡片内容</p>
  </VCard>
</template>

<script setup lang="ts">
const handleClick = (event: MouseEvent) => {
  console.log('卡片被点击', event)
}
</script>
```

### CSS类名

```css
.vjs-card                /* 基础类 */
.vjs-card--bordered      /* 有边框 */
.vjs-card--shadow-always /* 阴影：始终 */
.vjs-card--shadow-hover  /* 阴影：悬停 */
.vjs-card--shadow-never  /* 阴影：从不 */
.vjs-card--hoverable     /* 可悬停 */
.vjs-card--loading       /* 加载中 */
.vjs-card__header        /* 标题区域 */
.vjs-card__title         /* 标题文本 */
.vjs-card__extra         /* 额外内容 */
.vjs-card__cover         /* 封面区域 */
.vjs-card__body          /* 内容区域 */
.vjs-card__footer        /* 底部区域 */
.vjs-card__loading       /* 加载动画 */
```

---

## 📊 API设计总结

### 组件对比

| 特性 | Button | Input | Card |
|------|--------|-------|------|
| **Props数量** | 10个 | 19个 | 7个 |
| **Events数量** | 1个 | 7个 | 1个 |
| **Slots数量** | 2个 | 4个 | 5个 |
| **暴露方法** | - | 4个 | - |
| **复杂度** | 简单 | 中等 | 简单 |

### 命名规范

#### Props命名
- 使用驼峰命名：`modelValue`, `prefixIcon`
- 布尔值使用`is/has/show`前缀：`disabled`, `showPassword`
- 枚举类型使用名词：`type`, `size`, `shadow`

#### Events命名
- 使用小写：`click`, `input`, `change`
- 不使用`on`前缀（组件使用时加`@`）

#### Slots命名
- 使用语义化名称：`default`, `header`, `footer`
- 前后缀使用方位词：`prefix`, `suffix`, `prepend`, `append`

#### CSS类名
- 使用BEM规范：`vjs-component__element--modifier`
- 组件前缀：`vjs-`
- 元素连接：`__`
- 修饰符连接：`--`

### TypeScript类型
- 所有组件导出Props/Emits/Slots类型
- 复杂组件导出Expose类型（暴露的方法）
- 枚举类型使用type定义：`type ButtonType = 'primary' | 'success'`

---

## ✅ 设计完成

**本文档已完成Button、Input、Card三个组件的完整API设计。**

### 下一步
- [ ] 创建 `03-SPEC-THEME-MANAGER.md` - ThemeManager设计
- [ ] 创建 `03-SPEC-TYPESCRIPT-TYPES.md` - TypeScript类型系统
- [ ] 创建 `03-SPEC-BUILD-CONFIG.md` - 构建配置设计
- [ ] 创建 `02-IMPL-STEP-BY-STEP.md` - 分步骤实施计划

---

**状态**：✅ **完成** | **日期**：2025-11-09
