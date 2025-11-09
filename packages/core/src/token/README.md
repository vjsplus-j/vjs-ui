# VJS-UI Token系统

> Design Token系统 - VJS-UI的核心设计系统

---

## 📋 功能对比表

### MVP简化版 vs 完整版对比

| 功能 | 简化版 | 完整版 | 状态 | 说明 |
|------|--------|--------|------|------|
| **基础功能** |  |  |  |  |
| 扁平Token | ✅ | ✅ | ✅ 已实现 | 支持扁平结构的Token映射 |
| 嵌套Token | ❌ | ✅ | ✅ 已实现 | 支持多层嵌套的Token结构 |
| Token引用 | ❌ | ✅ | ✅ 已实现 | 支持`$token.xxx`和`${token.xxx}`引用 |
| **编译输出** |  |  |  |  |
| CSS Variables | ✅ | ✅ | ✅ 已实现 | 编译成CSS变量 |
| TypeScript类型 | ❌ | ✅ | ✅ 已实现 | 生成TypeScript类型定义 |
| SCSS变量 | ❌ | ✅ | ✅ 已实现 | 编译成SCSS变量 |
| JSON输出 | ❌ | ❌ | ⏱️ 未来 | 导出为JSON格式 |
| **高级功能** |  |  |  |  |
| 颜色透明度 | ❌ | ✅ | ✅ 已实现 | applyAlpha()处理颜色透明度 |
| Token展平 | ❌ | ✅ | ✅ 已实现 | flatten()展平嵌套结构 |
| 自定义前缀 | ✅ | ✅ | ✅ 已实现 | 支持自定义CSS变量前缀 |
| 美化输出 | ✅ | ✅ | ✅ 已实现 | 格式化输出代码 |
| **运行时功能** |  |  |  |  |
| 运行时切换 | ❌ | ✅ | ✅ 已实现 | TokenRuntime动态切换 |
| Token变化监听 | ❌ | ✅ | ✅ 已实现 | onChange()监听Token变化 |
| 过渡动画 | ❌ | ✅ | ✅ 已实现 | 切换时的过渡动画支持 |
| 批量操作 | ❌ | ✅ | ✅ 已实现 | setMany()批量设置Token |
| Token缓存 | ❌ | ✅ | ✅ 已实现 | 内部缓存机制 |
| 资源清理 | ❌ | ✅ | ✅ 已实现 | destroy()清理资源 |
| **测试覆盖** |  |  |  |  |
| 单元测试 | 12个 | 48个 | ✅ 已完成 | 全面的测试覆盖 |
| 集成测试 | ❌ | ⏱️ 未来 | ⏱️ 计划中 | 与其他系统的集成测试 |

---

## 🎯 核心组件

### 1. TokenCompiler - Token编译器

**功能**：将Token编译成多种格式

```typescript
import { TokenCompiler } from '@vjs-ui/core'

const compiler = new TokenCompiler({ pretty: true })

// 展平嵌套Token
const nested = {
  color: {
    primary: '#1677ff',
    success: '#52c41a'
  }
}
const flat = compiler.flatten(nested)

// 编译成CSS Variables
const css = compiler.toCSSVariables(flat)

// 编译成TypeScript
const ts = compiler.toTypeScript(flat)

// 编译成SCSS
const scss = compiler.toSCSS(flat)

// 颜色透明度
const rgba = compiler.applyAlpha('#1677ff', 0.5)
```

**API**：

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `flatten()` | `NestedToken` | `FlatTokenMap` | 展平嵌套Token结构 |
| `toCSSVariables()` | `FlatTokenMap` | `string` | 编译成CSS Variables |
| `toTypeScript()` | `FlatTokenMap` | `string` | 生成TypeScript类型 |
| `toSCSS()` | `FlatTokenMap` | `string` | 生成SCSS变量 |
| `applyAlpha()` | `color, alpha` | `string` | 应用颜色透明度 |

### 2. TokenRuntime - Token运行时管理器

**功能**：运行时动态管理Token

```typescript
import { TokenRuntime } from '@vjs-ui/core'

const runtime = new TokenRuntime()

// 应用Token
runtime.apply({
  'color.primary': '#1677ff',
  'spacing.md': '16px'
})

// 监听变化
runtime.onChange((event) => {
  console.log(`${event.key}: ${event.oldValue} → ${event.newValue}`)
})

// 动态切换（带动画）
runtime.set('color.primary', '#ff0000', true)

// 批量设置
runtime.setMany({
  'color.primary': '#1677ff',
  'color.success': '#52c41a'
})

// 清理
runtime.destroy()
```

**API**：

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `apply()` | `tokens, animate?` | `void` | 应用Token到DOM |
| `get()` | `key` | `string \| number \| null` | 获取Token值 |
| `set()` | `key, value, animate?` | `void` | 设置单个Token |
| `setMany()` | `tokens, animate?` | `void` | 批量设置Token |
| `remove()` | `keys` | `void` | 移除Token |
| `clear()` | - | `void` | 清除所有Token |
| `getAll()` | - | `FlatTokenMap` | 获取所有Token |
| `onChange()` | `listener` | `() => void` | 监听变化 |
| `destroy()` | - | `void` | 销毁实例 |

### 3. SimpleTokenCompiler - 简化版编译器（向后兼容）

**功能**：简化版Token编译器，向后兼容

```typescript
import { SimpleTokenCompiler } from '@vjs-ui/core'

const compiler = new SimpleTokenCompiler()
const tokens = { 'color-primary': '#1677ff' }
const css = compiler.compile(tokens)
```

---

## 📖 使用场景

### 场景1：主题系统

```typescript
import { TokenCompiler, TokenRuntime } from '@vjs-ui/core'

// 定义主题
const lightTheme = {
  color: {
    primary: '#1677ff',
    bg: '#ffffff',
    text: '#000000'
  }
}

const darkTheme = {
  color: {
    primary: '#4a90e2',
    bg: '#000000',
    text: '#ffffff'
  }
}

// 编译器
const compiler = new TokenCompiler()
const runtime = new TokenRuntime()

// 切换主题
function switchTheme(theme: 'light' | 'dark') {
  const tokens = theme === 'light' ? lightTheme : darkTheme
  const flat = compiler.flatten(tokens)
  runtime.apply(flat, true) // 带动画
}
```

### 场景2：Token引用

```typescript
const tokens = {
  color: {
    primary: '#1677ff',
    link: '$token.color.primary',        // 引用
    linkHover: '${token.color.primary}'  // 也支持这种格式
  },
  spacing: {
    base: '8px',
    double: '$token.spacing.base'  // 会自动解析为16px（如果有计算）
  }
}

const compiler = new TokenCompiler()
const flat = compiler.flatten(tokens)
const css = compiler.toCSSVariables(flat) // 引用会自动解析
```

### 场景3：构建时生成

```typescript
import { TokenCompiler } from '@vjs-ui/core'
import fs from 'fs'

const compiler = new TokenCompiler({ pretty: true })
const tokens = { /* ... */ }
const flat = compiler.flatten(tokens)

// 生成CSS文件
fs.writeFileSync('tokens.css', compiler.toCSSVariables(flat))

// 生成TypeScript文件
fs.writeFileSync('tokens.ts', compiler.toTypeScript(flat))

// 生成SCSS文件
fs.writeFileSync('_tokens.scss', compiler.toSCSS(flat))
```

---

## 🔧 配置选项

### TokenCompileOptions

```typescript
interface TokenCompileOptions {
  prefix?: string          // CSS变量前缀，默认'vjs'
  pretty?: boolean         // 美化输出，默认false
  resolveReferences?: boolean  // 解析Token引用，默认true
}
```

### TokenRuntimeOptions

```typescript
interface TokenRuntimeOptions {
  prefix?: string          // CSS变量前缀，默认'vjs'
  target?: HTMLElement     // 目标元素，默认document.body
  enableTransition?: boolean   // 启用过渡动画，默认true
  transitionDuration?: number  // 过渡时长(ms)，默认300
}
```

---

## 🎨 设计原则

### 1. Design Tokens优先

Token系统不是简单的CSS变量，而是语义化的设计系统：

```typescript
// ❌ 不好：直接使用颜色值
const style = { color: '#1677ff' }

// ✅ 好：使用Token
const tokens = {
  'color.primary': '#1677ff',
  'color.text.body': '#000000'
}
```

### 2. 嵌套结构

支持嵌套结构，更符合设计思维：

```typescript
const tokens = {
  color: {
    primary: {
      base: '#1677ff',
      hover: '#4a90e2',
      active: '#2e69c7'
    },
    text: {
      body: '#000000',
      muted: '#666666',
      disabled: '#999999'
    }
  }
}
```

### 3. 多种输出格式

编译成多种格式，适应不同场景：
- CSS Variables - 运行时使用
- TypeScript - 类型安全
- SCSS - 预处理器使用

---

## ✅ 测试覆盖

### 测试统计

- **TokenCompiler**: 17个测试 ✅
- **TokenRuntime**: 19个测试 ✅
- **SimpleTokenCompiler**: 12个测试 ✅
- **总计**: 48个测试，全部通过 🎉

### 测试覆盖范围

- ✅ 基础功能测试
- ✅ 边界情况测试
- ✅ 错误处理测试
- ✅ 配置选项测试
- ✅ 集成场景测试

---

## 📚 相关文档

- [核心原则](../../../docs/CORE-PRINCIPLES.md) - DSL是核心中的核心
- [架构设计](../../../docs/ARCHITECTURE.md) - 完整架构设计
- [实施清单](../../../docs/internal/02-IMPL-CHECKLIST.md) - 实施进度

---

**Token系统是VJS-UI设计系统的基础，为DSL Core提供语义化的设计令牌支持！** 🎨✨
