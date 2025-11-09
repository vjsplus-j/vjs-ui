# VJS-UI 多主题系统开发计划

## 📋 概述

打造独特的VJS-UI主题系统，让用户能够轻松切换不同风格的主题，彻底区别于Element Plus的设计风格。

**核心理念**：宇宙黑 + 科技感 + 高级感

---

## 🎨 5大主题方案

### 1. 🌌 宇宙黑主题（Cosmic Dark）**默认主题**
**定位**：科技感、未来感、专业

**色彩方案**：
```css
--primary: 紫色渐变 (#a855f7 → #9333ea)
--success: 青色 (#06b6d4)
--warning: 橙金色 (#f59e0b)
--error: 粉红色 (#ec4899)
--background: 深空蓝黑 (#0a0e27)
```

**特色效果**：
- 毛玻璃效果（backdrop-filter: blur）
- 发光边框（box-shadow glow）
- 渐变背景
- 流光按钮动画
- 星空粒子效果（可选）

---

### 2. 🌙 深夜蓝主题（Midnight Blue）
**定位**：沉稳、专业、商务

**色彩方案**：
```css
--primary: 深蓝色 (#1e40af → #3b82f6)
--success: 翠绿色 (#059669)
--warning: 琥珀色 (#d97706)
--error: 深红色 (#dc2626)
--background: 深蓝黑 (#0f172a)
```

**特色效果**：
- 柔和阴影
- 优雅过渡
- 磨砂质感

---

### 3. 🌈 赛博朋克主题（Cyberpunk）
**定位**：炫酷、前卫、激进

**色彩方案**：
```css
--primary: 霓虹紫 (#a855f7)
--success: 霓虹绿 (#22c55e)
--warning: 霓虹黄 (#eab308)
--error: 霓虹红 (#ef4444)
--accent: 霓虹青 (#06b6d4)
--background: 纯黑 (#000000)
```

**特色效果**：
- 强烈霓虹发光
- 故障艺术效果（glitch）
- 扫描线动画
- 电路板纹理
- RGB色彩分离

---

### 4. 💼 企业级深色主题（Corporate Dark）
**定位**：专业、信任、稳重

**色彩方案**：
```css
--primary: 商务蓝 (#2563eb)
--success: 森林绿 (#10b981)
--warning: 金橙色 (#f59e0b)
--error: 深红 (#dc2626)
--background: 炭灰黑 (#18181b)
```

**特色效果**：
- 简洁线条
- 精致阴影
- 高级质感

---

### 5. 🌸 梦幻紫主题（Dream Purple）
**定位**：优雅、梦幻、创意

**色彩方案**：
```css
--primary: 梦幻紫 (#c084fc → #e879f9)
--success: 薄荷绿 (#34d399)
--warning: 蜜桃橙 (#fb923c)
--error: 玫瑰粉 (#f472b6)
--background: 深紫黑 (#1e1b4b)
```

**特色效果**：
- 柔和渐变
- 梦幻光晕
- 流动动画

---

## 🏗️ 技术实现方案

### 阶段1：Design Token增强（Week 5）

```typescript
// packages/tokens/src/themes/cosmic-dark.json
{
  "name": "cosmic-dark",
  "colors": {
    "primary": {
      "50": "#faf5ff",
      "500": "#a855f7",
      "600": "#9333ea"
    },
    // ... 完整色板
  },
  "effects": {
    "glow": {
      "primary": "0 0 20px rgba(168, 85, 247, 0.6)",
      "success": "0 0 20px rgba(6, 182, 212, 0.6)"
    },
    "backdrop": {
      "blur": "blur(10px)",
      "opacity": 0.6
    }
  }
}
```

### 阶段2：主题切换器组件（Week 6）

```typescript
// packages/vue/src/components/ThemeSwitcher/ThemeSwitcher.vue
<template>
  <div class="vjs-theme-switcher">
    <button @click="toggleTheme">切换主题</button>
    <div class="theme-list">
      <div v-for="theme in themes" 
           :key="theme.name"
           @click="setTheme(theme.name)">
        {{ theme.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTheme } from '@vjs-ui/core'

const { currentTheme, setTheme, themes } = useTheme()
</script>
```

### 阶段3：主题管理系统（Week 7）

```typescript
// packages/core/src/theme/index.ts
export class ThemeManager {
  private currentTheme: Theme
  private themes: Map<string, Theme>
  
  // 切换主题
  switchTheme(themeName: string) {
    const theme = this.themes.get(themeName)
    if (theme) {
      this.applyTheme(theme)
    }
  }
  
  // 应用主题到DOM
  private applyTheme(theme: Theme) {
    Object.entries(theme.tokens).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--vjs-${key}`, value)
    })
  }
  
  // 注册自定义主题
  registerTheme(theme: Theme) {
    this.themes.set(theme.name, theme)
  }
}
```

### 阶段4：主题持久化（Week 8）

```typescript
// 本地存储
localStorage.setItem('vjs-ui-theme', 'cosmic-dark')

// 自动加载
const savedTheme = localStorage.getItem('vjs-ui-theme') || 'cosmic-dark'
themeManager.switchTheme(savedTheme)

// 系统主题检测
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
```

---

## 📦 包结构

```
packages/
├── tokens/
│   ├── src/
│   │   └── themes/
│   │       ├── cosmic-dark.json      # 宇宙黑
│   │       ├── midnight-blue.json    # 深夜蓝
│   │       ├── cyberpunk.json        # 赛博朋克
│   │       ├── corporate-dark.json   # 企业级深色
│   │       └── dream-purple.json     # 梦幻紫
│   └── index.ts
│
├── core/
│   └── src/
│       └── theme/
│           ├── ThemeManager.ts       # 主题管理器
│           ├── types.ts              # 类型定义
│           └── index.ts
│
└── vue/
    └── src/
        └── components/
            └── ThemeSwitcher/        # 主题切换器
                ├── ThemeSwitcher.vue
                └── index.ts
```

---

## 🎯 开发里程碑

### Alpha v0.2.0（预计2周）
- ✅ 完成5个主题的Token定义
- ✅ 实现ThemeManager核心功能
- ✅ 创建ThemeSwitcher组件
- ✅ 支持运行时切换

### Beta v0.5.0（预计4周）
- ✅ 主题持久化
- ✅ 系统主题检测
- ✅ 自定义主题API
- ✅ 主题预览功能

### v1.0.0（预计6周）
- ✅ 主题市场（用户分享主题）
- ✅ 在线主题编辑器
- ✅ 主题导入/导出
- ✅ 完整文档

---

## 🎨 核心设计理念

### 我们的特色

| 特性 | 实现方式 |
|------|---------|
| 默认主题 | 宇宙黑（科技感） |
| 主题切换 | 运行时动态切换 |
| 暗色主题 | 5种独特风格 |
| 视觉特效 | 发光/毛玻璃/渐变 |
| 自定义能力 | Design Tokens + 完整API |
| 动画效果 | 流光/粒子/扫描线 |

---

## 💡 核心特色

### 1. 运行时主题切换
```typescript
// 无需重新构建，即时切换
themeManager.switchTheme('cyberpunk')
```

### 2. 完整的Design Token系统
```typescript
// 访问任何token
const primary = tokens.colors.primary[500]
```

### 3. 主题继承
```typescript
// 基于现有主题创建新主题
const myTheme = themeManager.extend('cosmic-dark', {
  colors: {
    primary: { 500: '#your-color' }
  }
})
```

### 4. CSS-in-JS + CSS Variables
```typescript
// 完美结合
const Button = styled.button`
  background: var(--vjs-colors-primary-500);
  box-shadow: var(--vjs-glow-primary);
`
```

---

## 📈 优先级

### 高优先级（Alpha v0.2.0）
1. 宇宙黑主题完整实现
2. ThemeManager核心功能
3. 运行时切换能力

### 中优先级（Beta v0.5.0）
4. 其他4个主题实现
5. ThemeSwitcher组件
6. 主题持久化

### 低优先级（v1.0.0+）
7. 主题市场
8. 在线编辑器
9. 高级特效（粒子、扫描线等）

---

## 🚀 下一步行动

1. **立即开始**：创建cosmic-dark主题完整实现
2. **Week 5**：实现ThemeManager
3. **Week 6**：创建ThemeSwitcher组件
4. **Week 7**：完成其他4个主题

---

**更新日期**: 2025-11-09  
**状态**: 📋 计划中  
**负责人**: VJS Team  
**优先级**: ⭐⭐⭐⭐⭐ 极高
