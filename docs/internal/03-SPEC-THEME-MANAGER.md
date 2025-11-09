# VJS-UI 主题管理器设计

> **版本**: 1.0.0  
> **创建日期**: 2025-11-09  
> **状态**: ✅ 设计完成  
> **范围**: ThemeManager类 + useTheme Hook + 主题配置

---

## 📋 设计目标

### 1. 零配置使用
- 开箱即用，19个预设主题
- 自动注入CSS Variables
- 无需手动编写CSS

### 2. 灵活扩展
- 支持自定义主题
- 支持主题覆盖
- 支持运行时切换

### 3. TypeScript友好
- 完整的类型定义
- 智能提示
- 类型安全

---

## 🎨 主题配置格式

### Theme接口

```typescript
/**
 * 主题配置接口
 */
export interface Theme {
  /**
   * 主题唯一标识
   */
  id: string

  /**
   * 主题名称
   */
  name: string

  /**
   * 主题图标（emoji或图标名）
   */
  icon?: string

  /**
   * 主题描述
   */
  description?: string

  /**
   * CSS变量配置
   */
  variables: ThemeVariables
}

/**
 * 主题CSS变量
 */
export interface ThemeVariables {
  // 背景色
  '--bg-body'?: string
  '--bg-primary'?: string
  '--bg-secondary'?: string
  '--bg-hover'?: string

  // 文字颜色
  '--text-primary'?: string
  '--text-secondary'?: string
  '--text-muted'?: string

  // 主题色
  '--primary'?: string
  '--primary-hover'?: string

  // 状态色
  '--success'?: string
  '--warning'?: string
  '--danger'?: string
  '--info'?: string

  // 边框
  '--border'?: string
  '--border-radius'?: string

  // 阴影和发光
  '--shadow'?: string
  '--glow'?: string

  // 其他自定义变量
  [key: string]: string | undefined
}
```

### 预设主题示例

```typescript
export const PRESET_THEMES: Theme[] = [
  {
    id: 'cosmic-dark',
    name: '宇宙黑',
    icon: '🌌',
    description: '深邃浩瀚的星空主题',
    variables: {
      '--bg-body': 'linear-gradient(135deg, #000000 0%, #0a0e1a 30%, #001529 60%, #000000 100%)',
      '--bg-primary': 'rgba(5, 10, 20, 0.9)',
      '--bg-secondary': 'rgba(10, 14, 26, 0.85)',
      '--bg-hover': 'rgba(74, 144, 226, 0.12)',
      '--text-primary': '#e6f7ff',
      '--text-secondary': '#91caff',
      '--text-muted': '#4a7ca8',
      '--primary': '#4a90e2',
      '--primary-hover': '#69a7f0',
      '--success': '#52c41a',
      '--warning': '#faad14',
      '--danger': '#ff4d4f',
      '--border': 'rgba(74, 144, 226, 0.2)',
      '--shadow': '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 2px rgba(74, 144, 226, 0.15)',
      '--glow': '0 0 30px rgba(74, 144, 226, 0.25), 0 0 80px rgba(0, 21, 41, 0.4)'
    }
  },
  // ... 其他18个主题
]
```

---

## 🔧 ThemeManager 类

### 类设计

```typescript
/**
 * 主题管理器配置
 */
export interface ThemeManagerOptions {
  /**
   * 初始主题ID
   * @default 'cosmic-dark'
   */
  initialTheme?: string

  /**
   * 是否启用本地存储
   * @default true
   */
  enableStorage?: boolean

  /**
   * 本地存储键名
   * @default 'vjs-ui-theme'
   */
  storageKey?: string

  /**
   * 自定义主题
   */
  customThemes?: Theme[]

  /**
   * CSS变量挂载目标
   * @default document.body
   */
  target?: HTMLElement
}

/**
 * 主题管理器类
 */
export class ThemeManager {
  /**
   * 当前主题
   */
  private currentTheme: Theme

  /**
   * 所有可用主题
   */
  private themes: Map<string, Theme>

  /**
   * 配置选项
   */
  private options: Required<ThemeManagerOptions>

  /**
   * 事件监听器
   */
  private listeners: Map<string, Function[]>

  /**
   * 构造函数
   */
  constructor(options?: ThemeManagerOptions)

  /**
   * 应用主题
   * @param themeId 主题ID
   * @returns 是否应用成功
   */
  applyTheme(themeId: string): boolean

  /**
   * 获取当前主题
   * @returns 当前主题
   */
  getCurrentTheme(): Theme

  /**
   * 获取所有主题
   * @returns 主题列表
   */
  getAllThemes(): Theme[]

  /**
   * 根据ID获取主题
   * @param themeId 主题ID
   * @returns 主题对象或undefined
   */
  getTheme(themeId: string): Theme | undefined

  /**
   * 注册自定义主题
   * @param theme 主题对象
   */
  registerTheme(theme: Theme): void

  /**
   * 注销主题
   * @param themeId 主题ID
   */
  unregisterTheme(themeId: string): void

  /**
   * 监听主题变化
   * @param event 事件名（'change'）
   * @param callback 回调函数
   */
  on(event: 'change', callback: (theme: Theme) => void): void

  /**
   * 移除事件监听
   * @param event 事件名
   * @param callback 回调函数
   */
  off(event: 'change', callback: Function): void

  /**
   * 保存当前主题到本地存储
   */
  saveToStorage(): void

  /**
   * 从本地存储加载主题
   * @returns 加载的主题ID或null
   */
  loadFromStorage(): string | null

  /**
   * 应用CSS变量到目标元素
   * @param variables CSS变量对象
   * @param target 目标元素
   */
  private applyCSSVariables(variables: ThemeVariables, target: HTMLElement): void

  /**
   * 触发事件
   * @param event 事件名
   * @param data 事件数据
   */
  private emit(event: string, data: any): void
}
```

### 使用示例

```typescript
import { ThemeManager } from 'vjs-ui'

// 创建主题管理器实例
const themeManager = new ThemeManager({
  initialTheme: 'cosmic-dark',
  enableStorage: true,
  storageKey: 'my-app-theme'
})

// 应用主题
themeManager.applyTheme('sakura-pink')

// 获取当前主题
const currentTheme = themeManager.getCurrentTheme()
console.log(currentTheme.name) // 樱花粉

// 获取所有主题
const allThemes = themeManager.getAllThemes()
console.log(`共${allThemes.length}个主题`)

// 监听主题变化
themeManager.on('change', (theme) => {
  console.log(`主题切换为: ${theme.name}`)
})

// 注册自定义主题
themeManager.registerTheme({
  id: 'my-theme',
  name: '我的主题',
  icon: '🎨',
  description: '自定义主题',
  variables: {
    '--bg-body': '#ffffff',
    '--text-primary': '#000000',
    '--primary': '#1677ff'
  }
})
```

---

## ⚡ useTheme Hook

### Hook设计

```typescript
/**
 * useTheme Hook返回值
 */
export interface UseThemeReturn {
  /**
   * 当前主题（响应式）
   */
  currentTheme: Ref<Theme>

  /**
   * 所有主题列表（响应式）
   */
  themes: Ref<Theme[]>

  /**
   * 应用主题
   * @param themeId 主题ID
   */
  applyTheme: (themeId: string) => void

  /**
   * 注册主题
   * @param theme 主题对象
   */
  registerTheme: (theme: Theme) => void

  /**
   * 主题管理器实例
   */
  themeManager: ThemeManager
}

/**
 * useTheme Hook
 * @param options 配置选项
 * @returns Hook返回值
 */
export function useTheme(options?: ThemeManagerOptions): UseThemeReturn
```

### 使用示例（Vue 3）

```vue
<template>
  <div class="theme-demo">
    <h1>当前主题：{{ currentTheme.name }} {{ currentTheme.icon }}</h1>

    <div class="theme-list">
      <button
        v-for="theme in themes"
        :key="theme.id"
        :class="{ active: theme.id === currentTheme.id }"
        @click="applyTheme(theme.id)"
      >
        {{ theme.icon }} {{ theme.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from 'vjs-ui'

// 使用主题Hook
const { currentTheme, themes, applyTheme, registerTheme } = useTheme({
  initialTheme: 'cosmic-dark'
})

// 注册自定义主题
registerTheme({
  id: 'custom',
  name: '自定义',
  icon: '🎨',
  variables: {
    '--primary': '#ff0000'
  }
})
</script>
```

---

## 🔌 Vue插件

### 插件设计

```typescript
/**
 * Vue插件配置
 */
export interface VjsUIOptions {
  /**
   * 主题管理器配置
   */
  theme?: ThemeManagerOptions
}

/**
 * Vue插件
 */
export const VjsUI = {
  install(app: App, options?: VjsUIOptions): void
}
```

### 使用示例

```typescript
// main.ts
import { createApp } from 'vue'
import VjsUI from 'vjs-ui'
import 'vjs-ui/dist/style.css'
import App from './App.vue'

const app = createApp(App)

app.use(VjsUI, {
  theme: {
    initialTheme: 'cosmic-dark',
    enableStorage: true
  }
})

app.mount('#app')
```

---

## 📦 导出结构

### 完整导出

```typescript
// packages/vue/src/theme/index.ts

export { ThemeManager } from './ThemeManager'
export { useTheme } from './useTheme'
export { PRESET_THEMES } from './themes'

export type {
  Theme,
  ThemeVariables,
  ThemeManagerOptions,
  UseThemeReturn
} from './types'
```

---

## 🎯 实现要点

### 1. CSS变量注入

```typescript
private applyCSSVariables(variables: ThemeVariables, target: HTMLElement): void {
  Object.entries(variables).forEach(([key, value]) => {
    if (value !== undefined) {
      target.style.setProperty(key, value)
    }
  })
}
```

### 2. 本地存储

```typescript
saveToStorage(): void {
  if (this.options.enableStorage) {
    localStorage.setItem(
      this.options.storageKey,
      this.currentTheme.id
    )
  }
}

loadFromStorage(): string | null {
  if (this.options.enableStorage) {
    return localStorage.getItem(this.options.storageKey)
  }
  return null
}
```

### 3. 事件系统

```typescript
on(event: 'change', callback: (theme: Theme) => void): void {
  if (!this.listeners.has(event)) {
    this.listeners.set(event, [])
  }
  this.listeners.get(event)!.push(callback)
}

private emit(event: string, data: any): void {
  const callbacks = this.listeners.get(event)
  if (callbacks) {
    callbacks.forEach(callback => callback(data))
  }
}
```

### 4. Vue响应式集成

```typescript
export function useTheme(options?: ThemeManagerOptions): UseThemeReturn {
  // 单例模式，全局共享一个ThemeManager实例
  if (!globalThemeManager) {
    globalThemeManager = new ThemeManager(options)
  }

  const currentTheme = ref(globalThemeManager.getCurrentTheme())
  const themes = ref(globalThemeManager.getAllThemes())

  // 监听主题变化，更新响应式变量
  globalThemeManager.on('change', (theme) => {
    currentTheme.value = theme
  })

  const applyTheme = (themeId: string) => {
    globalThemeManager.applyTheme(themeId)
  }

  const registerTheme = (theme: Theme) => {
    globalThemeManager.registerTheme(theme)
    themes.value = globalThemeManager.getAllThemes()
  }

  return {
    currentTheme,
    themes,
    applyTheme,
    registerTheme,
    themeManager: globalThemeManager
  }
}
```

---

## 📁 文件结构

```
packages/vue/src/theme/
├── types.ts              # TypeScript类型定义
├── themes.ts             # 预设主题配置（19个）
├── ThemeManager.ts       # 主题管理器类
├── useTheme.ts           # Vue Hook
├── plugin.ts             # Vue插件
└── index.ts              # 统一导出
```

---

## ✅ 设计完成

**本文档已完成ThemeManager的完整设计。**

### 关键特性
- ✅ 19个预设主题
- ✅ CSS Variables自动注入
- ✅ 本地存储支持
- ✅ 事件系统
- ✅ Vue 3集成
- ✅ TypeScript类型完整

### 下一步
- [ ] 创建 `03-SPEC-TYPESCRIPT-TYPES.md` - TypeScript类型系统
- [ ] 创建 `03-SPEC-BUILD-CONFIG.md` - 构建配置设计
- [ ] 创建 `02-IMPL-STEP-BY-STEP.md` - 分步骤实施计划

---

**状态**：✅ **完成** | **日期**：2025-11-09
