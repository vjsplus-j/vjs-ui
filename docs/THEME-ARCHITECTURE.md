# VJS-UI 主题系统架构设计

## 🎯 设计原则

### 核心理念
**开发者零CSS代码，一键切换主题**

- ✅ 样式完全封装在框架内
- ✅ 主题自动注入，无需手动引入
- ✅ 界面点击切换，无需代码
- ✅ 运行时动态切换，无需重启

---

## 🏗️ 架构层次

```
┌─────────────────────────────────────┐
│   开发者使用（零CSS代码）              │
│   import { VButton } from '@vjs-ui'  │
│   <VButton>按钮</VButton>            │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   ThemeSwitcher组件（UI层）          │
│   <ThemeSwitcher />                 │
│   点击切换 → 触发主题切换              │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   ThemeManager（管理层）             │
│   - switchTheme()                   │
│   - getCurrentTheme()               │
│   - registerTheme()                 │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Theme Tokens（数据层）             │
│   cosmic-dark.json                  │
│   midnight-blue.json                │
│   cyberpunk.json                    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   CSS Variables（渲染层）            │
│   自动注入到 :root                    │
│   --vjs-colors-primary-500          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   组件样式（样式层）                   │
│   封装在组件内部                       │
│   使用CSS Variables                  │
└─────────────────────────────────────┘
```

---

## 📦 包结构

```typescript
@vjs-ui/
├── core/
│   ├── src/
│   │   └── theme/
│   │       ├── ThemeManager.ts       // 主题管理器
│   │       ├── ThemeProvider.ts      // 主题提供者
│   │       ├── useTheme.ts           // 主题Hook
│   │       └── types.ts              // 类型定义
│   └── index.ts
│
├── tokens/
│   ├── src/
│   │   └── themes/
│   │       ├── cosmic-dark.ts        // 宇宙黑主题
│   │       ├── midnight-blue.ts      // 深夜蓝主题
│   │       ├── cyberpunk.ts          // 赛博朋克主题
│   │       ├── corporate-dark.ts     // 企业级深色
│   │       └── dream-purple.ts       // 梦幻紫主题
│   └── index.ts
│
└── vue/
    ├── src/
    │   ├── components/
    │   │   ├── Button/
    │   │   │   └── Button.vue        // 样式封装在内
    │   │   ├── Input/
    │   │   │   └── Input.vue         // 样式封装在内
    │   │   └── ThemeSwitcher/
    │   │       └── ThemeSwitcher.vue // 主题切换器
    │   └── styles/
    │       ├── base.css              // 基础样式（自动注入）
    │       └── themes.css            // 主题样式（自动注入）
    └── index.ts
```

---

## 💻 开发者使用方式

### 1. 安装（仅需一次）

```bash
npm install @vjs-ui/vue
```

### 2. 引入（App.vue）

```vue
<script setup>
import { VButton, VInput, VCard, ThemeSwitcher } from '@vjs-ui/vue'
// 就这一行！无需任何CSS导入！
</script>

<template>
  <!-- 主题切换器（可选） -->
  <ThemeSwitcher />
  
  <!-- 直接使用组件，样式自动生效 -->
  <VButton type="primary">按钮</VButton>
  <VInput v-model="value" />
  <VCard>卡片内容</VCard>
</template>
```

### 3. 完成！✨

**就这么简单！无需：**
- ❌ 导入CSS文件
- ❌ 配置样式
- ❌ 写任何CSS/SCSS
- ❌ 关心主题切换逻辑

---

## 🎨 ThemeSwitcher 组件

### 自动UI

```vue
<!-- 自动显示主题选择器 -->
<ThemeSwitcher />
```

**效果**：
- 🌌 宇宙黑
- 🌙 深夜蓝
- 🌈 赛博朋克
- 💼 企业级深色
- 🌸 梦幻紫

点击任意主题 → 整个应用立即切换！

### 自定义位置

```vue
<!-- 固定在右上角 -->
<ThemeSwitcher position="top-right" />

<!-- 固定在左下角 -->
<ThemeSwitcher position="bottom-left" />

<!-- 自定义 -->
<ThemeSwitcher :style="{ position: 'fixed', top: '20px', right: '20px' }" />
```

---

## 🔧 技术实现

### 1. 主题自动注入

```typescript
// packages/vue/src/index.ts
import { injectTheme } from '@vjs-ui/core'
import cosmicDark from '@vjs-ui/tokens/themes/cosmic-dark'

// 插件安装时自动注入
export default {
  install(app: App) {
    // 自动注入默认主题
    injectTheme(cosmicDark)
    
    // 注册组件
    app.component('VButton', VButton)
    app.component('VInput', VInput)
    // ...
  }
}
```

### 2. 样式封装在组件内

```vue
<!-- packages/vue/src/components/Button/Button.vue -->
<template>
  <button :class="buttonClass">
    <slot />
  </button>
</template>

<script setup>
// 逻辑
</script>

<style scoped>
/* 样式使用CSS Variables */
.vjs-button {
  background: var(--vjs-colors-primary-500);
  color: var(--vjs-colors-neutral-50);
  border-radius: var(--vjs-borderRadius-base);
  padding: var(--vjs-spacing-2) var(--vjs-spacing-4);
  /* ... 所有样式都在这里 */
}

.vjs-button--primary {
  background: linear-gradient(
    135deg,
    var(--vjs-colors-primary-500),
    var(--vjs-colors-primary-600)
  );
  box-shadow: var(--vjs-glow-primary);
}
/* ... */
</style>
```

### 3. 主题切换器

```vue
<!-- packages/vue/src/components/ThemeSwitcher/ThemeSwitcher.vue -->
<template>
  <div class="vjs-theme-switcher">
    <button @click="togglePanel" class="switcher-trigger">
      {{ currentTheme.icon }} {{ currentTheme.name }}
    </button>
    
    <div v-if="showPanel" class="theme-panel">
      <div
        v-for="theme in themes"
        :key="theme.id"
        :class="['theme-item', { active: theme.id === currentTheme.id }]"
        @click="switchTheme(theme.id)"
      >
        <span class="theme-icon">{{ theme.icon }}</span>
        <span class="theme-name">{{ theme.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from '@vjs-ui/core'

const { currentTheme, themes, switchTheme } = useTheme()
const showPanel = ref(false)

const togglePanel = () => {
  showPanel.value = !showPanel.value
}
</script>

<style scoped>
/* ThemeSwitcher自己的样式 */
.vjs-theme-switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

.switcher-trigger {
  background: var(--vjs-bg-primary);
  border: 1px solid var(--vjs-border-color);
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.theme-panel {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: var(--vjs-bg-primary);
  border: 1px solid var(--vjs-border-color);
  border-radius: 12px;
  padding: 8px;
  min-width: 200px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.theme-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.theme-item:hover {
  background: var(--vjs-bg-secondary);
}

.theme-item.active {
  background: var(--vjs-colors-primary-500);
  color: white;
}
</style>
```

### 4. useTheme Hook

```typescript
// packages/core/src/theme/useTheme.ts
import { ref, computed } from 'vue'
import { ThemeManager } from './ThemeManager'

const themeManager = new ThemeManager()

export function useTheme() {
  const currentThemeId = ref(themeManager.getCurrentThemeId())
  
  const themes = computed(() => themeManager.getAllThemes())
  
  const currentTheme = computed(() => 
    themeManager.getTheme(currentThemeId.value)
  )
  
  const switchTheme = (themeId: string) => {
    themeManager.switchTheme(themeId)
    currentThemeId.value = themeId
    
    // 保存到localStorage
    localStorage.setItem('vjs-ui-theme', themeId)
  }
  
  return {
    currentTheme,
    themes,
    switchTheme
  }
}
```

### 5. ThemeManager

```typescript
// packages/core/src/theme/ThemeManager.ts
import type { Theme } from './types'

export class ThemeManager {
  private themes = new Map<string, Theme>()
  private currentThemeId: string = 'cosmic-dark'
  
  constructor() {
    // 注册内置主题
    this.registerBuiltInThemes()
    
    // 加载保存的主题
    const savedTheme = localStorage.getItem('vjs-ui-theme')
    if (savedTheme && this.themes.has(savedTheme)) {
      this.switchTheme(savedTheme)
    }
  }
  
  // 注册主题
  registerTheme(theme: Theme) {
    this.themes.set(theme.id, theme)
  }
  
  // 切换主题
  switchTheme(themeId: string) {
    const theme = this.themes.get(themeId)
    if (!theme) {
      console.warn(`Theme "${themeId}" not found`)
      return
    }
    
    this.currentThemeId = themeId
    this.applyTheme(theme)
  }
  
  // 应用主题到DOM
  private applyTheme(theme: Theme) {
    const root = document.documentElement
    
    // 注入所有CSS Variables
    Object.entries(theme.tokens).forEach(([key, value]) => {
      root.style.setProperty(`--vjs-${key}`, value)
    })
    
    // 触发主题切换事件
    window.dispatchEvent(new CustomEvent('vjs-theme-change', {
      detail: { themeId: theme.id }
    }))
  }
  
  // 获取所有主题
  getAllThemes(): Theme[] {
    return Array.from(this.themes.values())
  }
  
  // 获取当前主题
  getCurrentThemeId(): string {
    return this.currentThemeId
  }
  
  // 获取指定主题
  getTheme(themeId: string): Theme | undefined {
    return this.themes.get(themeId)
  }
  
  // 注册内置主题
  private registerBuiltInThemes() {
    // 动态导入所有主题
    import('@vjs-ui/tokens/themes/cosmic-dark').then(m => 
      this.registerTheme(m.default)
    )
    import('@vjs-ui/tokens/themes/midnight-blue').then(m => 
      this.registerTheme(m.default)
    )
    // ... 其他主题
  }
}
```

---

## 🎨 主题定义示例

```typescript
// packages/tokens/src/themes/cosmic-dark.ts
export default {
  id: 'cosmic-dark',
  name: '宇宙黑',
  icon: '🌌',
  tokens: {
    // Colors
    'colors-primary-50': '#faf5ff',
    'colors-primary-500': '#a855f7',
    'colors-primary-600': '#9333ea',
    'colors-success-500': '#06b6d4',
    'colors-warning-500': '#f59e0b',
    'colors-error-500': '#ec4899',
    
    // Background
    'bg-primary': 'rgba(15, 23, 42, 0.6)',
    'bg-secondary': 'rgba(30, 41, 59, 0.6)',
    
    // Border
    'border-color': 'rgba(139, 92, 246, 0.3)',
    'borderRadius-base': '0.5rem',
    
    // Effects
    'glow-primary': '0 0 20px rgba(168, 85, 247, 0.6)',
    'glow-success': '0 0 20px rgba(6, 182, 212, 0.6)',
    
    // Spacing
    'spacing-1': '0.25rem',
    'spacing-2': '0.5rem',
    'spacing-4': '1rem',
    
    // ... 完整的Token定义
  }
}
```

---

## ✅ 优势总结

### 对开发者
1. **零配置** - 安装即用
2. **零CSS** - 无需写任何样式代码
3. **一键切换** - UI组件点击即可
4. **自动持久化** - 刷新后保持主题
5. **类型安全** - 完整TypeScript支持

### 对框架
1. **完全封装** - 样式与组件绑定
2. **高度解耦** - 主题独立管理
3. **易于扩展** - 新增主题很简单
4. **运行时切换** - 无需重新构建
5. **性能优化** - CSS Variables原生支持

---

## 🚀 实施计划

### Phase 1: 核心架构（3天）
- [ ] ThemeManager实现
- [ ] useTheme Hook
- [ ] 主题自动注入系统

### Phase 2: 组件封装（3天）
- [ ] 重构Button组件（样式内置）
- [ ] 重构Input组件（样式内置）
- [ ] 重构Card组件（样式内置）

### Phase 3: 主题切换器（2天）
- [ ] ThemeSwitcher组件
- [ ] 主题预览功能
- [ ] 持久化支持

### Phase 4: 主题完善（3天）
- [ ] 5个主题完整定义
- [ ] 主题测试
- [ ] 文档完善

**总计**: 11天完成

---

## 📝 示例代码

### 完整示例

```vue
<!-- App.vue -->
<script setup>
import '@vjs-ui/vue'  // 自动注入主题
import { VButton, VInput, VCard, ThemeSwitcher } from '@vjs-ui/vue'
import { ref } from 'vue'

const inputValue = ref('')
</script>

<template>
  <div class="app">
    <!-- 主题切换器（悬浮在右上角） -->
    <ThemeSwitcher />
    
    <!-- 使用组件，无需任何CSS -->
    <VCard header="欢迎使用 VJS-UI">
      <VInput v-model="inputValue" placeholder="输入内容" />
      <VButton type="primary" @click="handleClick">
        点击我
      </VButton>
    </VCard>
  </div>
</template>

<!-- 无需任何<style>！ -->
```

**就是这么简单！** ✨

---

**更新日期**: 2025-11-09  
**状态**: 🎯 架构设计完成
