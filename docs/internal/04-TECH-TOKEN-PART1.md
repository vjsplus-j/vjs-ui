# Token系统技术文档（第1部分）

> **版本**: v1.0.0  
> **作者**: VJS-UI Team  
> **更新**: 2025-11-09  
> **优先级**: 🔴 P0

---

## 📋 文档说明

本文档分为3部分：
- **第1部分**（本文档）：预期效果、设计思路、功能表
- **第2部分**：性能挑战、技术核心、实现逻辑
- **第3部分**：常见Bug、避免错误、测试策略

---

## 🎯 预期效果

### 功能目标

**核心目标**：
1. **Design Token管理** - 完整的设计令牌系统，不是简单的CSS变量
2. **多格式输出** - 支持CSS、TypeScript、SCSS等多种格式
3. **运行时管理** - 支持动态切换、热更新、变化监听
4. **嵌套支持** - 支持深度嵌套的Token结构
5. **引用解析** - 支持Token之间的相互引用

**用户体验目标**：
- **开发者友好** - 直观的API，清晰的类型提示
- **类型安全** - 100% TypeScript类型覆盖
- **易于调试** - 详细的错误信息和警告
- **性能优秀** - 快速编译，低内存占用
- **向后兼容** - 保留简化版API

**性能目标**：
- **编译速度** - 1000个Token < 10ms
- **内存占用** - 1000个Token < 1MB
- **运行时性能** - 切换主题 < 100ms（含动画）
- **首次加载** - Token初始化 < 5ms

### 预期效果展示

#### 1. 编译效果

**输入**（嵌套Token）：
```typescript
const tokens = {
  color: {
    primary: '#1677ff',
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
```

**输出**（CSS Variables）：
```css
:root {
  --vjs-color-primary: #1677ff;
  --vjs-color-text-body: #000000;
  --vjs-color-text-muted: #666666;
  --vjs-spacing-xs: 4px;
  --vjs-spacing-sm: 8px;
  --vjs-spacing-md: 16px;
}
```

**输出**（TypeScript类型）：
```typescript
export interface Tokens {
  'color.primary': string
  'color.text.body': string
  'color.text.muted': string
  'spacing.xs': string
  'spacing.sm': string
  'spacing.md': string
}

export const tokens: Tokens = {
  'color.primary': '#1677ff',
  'color.text.body': '#000000',
  'color.text.muted': '#666666',
  'spacing.xs': '4px',
  'spacing.sm': '8px',
  'spacing.md': '16px'
}
```

#### 2. Token引用效果

**输入**（带引用）：
```typescript
const tokens = {
  'color.primary': '#1677ff',
  'color.link': '$token.color.primary',
  'color.linkHover': '$token.color.primary',
  'spacing.base': '8px',
  'spacing.double': '${token.spacing.base}'  // 未来支持计算
}
```

**输出**（引用已解析）：
```css
:root {
  --vjs-color-primary: #1677ff;
  --vjs-color-link: #1677ff;       /* 引用已解析 */
  --vjs-color-linkHover: #1677ff;  /* 引用已解析 */
  --vjs-spacing-base: 8px;
  --vjs-spacing-double: 8px;       /* 引用已解析 */
}
```

#### 3. 运行时效果

**主题切换**：
```typescript
const runtime = new TokenRuntime({ enableTransition: true })

// 应用Light主题
runtime.apply(lightTheme)

// 平滑切换到Dark主题（300ms过渡动画）
runtime.apply(darkTheme)

// 监听变化
runtime.onChange((event) => {
  console.log(`Token ${event.key} changed: ${event.oldValue} → ${event.newValue}`)
})
```

**预期体验**：
- ✅ 颜色平滑过渡（300ms）
- ✅ 无闪烁
- ✅ 所有使用Token的组件自动更新
- ✅ 变化事件准确触发

#### 4. 颜色透明度效果

**输入**：
```typescript
const compiler = new TokenCompiler()
const rgba1 = compiler.applyAlpha('#1677ff', 0.5)
const rgba2 = compiler.applyAlpha('rgb(22, 119, 255)', 0.8)
```

**输出**：
```
rgba1: "rgba(22, 119, 255, 0.5)"
rgba2: "rgba(22, 119, 255, 0.8)"
```

---

## 💡 设计思路

### 架构设计

**整体架构**：

```
┌─────────────────────────────────────────────┐
│              TokenCompiler                   │
│  (编译时：Token → 多种格式)                  │
│                                              │
│  ├─ flatten()        展平嵌套Token           │
│  ├─ toCSSVariables() 编译成CSS              │
│  ├─ toTypeScript()   生成TS类型              │
│  ├─ toSCSS()         生成SCSS变量            │
│  ├─ applyAlpha()     颜色透明度              │
│  └─ resolveReferences() Token引用解析       │
└─────────────────────────────────────────────┘
                      │
                      │ 编译后的Token
                      ↓
┌─────────────────────────────────────────────┐
│              TokenRuntime                    │
│  (运行时：动态管理Token)                     │
│                                              │
│  ├─ apply()     应用Token到DOM               │
│  ├─ get/set()   读写Token值                  │
│  ├─ onChange()  监听Token变化                │
│  ├─ remove()    移除Token                    │
│  └─ destroy()   清理资源                     │
└─────────────────────────────────────────────┘
                      │
                      │ CSS Variables
                      ↓
┌─────────────────────────────────────────────┐
│                  DOM                         │
│  (应用：--vjs-xxx CSS变量)                   │
│                                              │
│  <div style="color: var(--vjs-color-primary)">
│    使用Token的元素                            │
│  </div>                                      │
└─────────────────────────────────────────────┘
```

**职责分离**：

| 组件 | 职责 | 何时使用 |
|------|------|---------|
| **TokenCompiler** | Token编译转换 | 构建时、初始化时 |
| **TokenRuntime** | 运行时Token管理 | 运行时、主题切换 |
| **SimpleTokenCompiler** | 简化版API | 向后兼容、简单场景 |

### 设计原则

#### 1. **Design Token优先**

Token不是简单的CSS变量，而是语义化的设计系统：

```typescript
// ❌ 不好：直接使用值
const color = '#1677ff'

// ✅ 好：使用语义化Token
const tokens = {
  'color.primary': '#1677ff',      // 主色
  'color.brand': '#1677ff',        // 品牌色
  'color.link': '#1677ff'          // 链接色
}
```

**为什么**：
- 语义化便于理解和维护
- 统一管理，易于修改
- 支持主题切换
- 符合设计规范

#### 2. **编译时优化**

尽可能在编译时完成工作，减少运行时开销：

```typescript
// 编译时：展平嵌套、解析引用、生成代码
const flat = compiler.flatten(nestedTokens)
const css = compiler.toCSSVariables(flat)
const ts = compiler.toTypeScript(flat)

// 运行时：只做必要的DOM操作
runtime.apply(compiledTokens)
```

**好处**：
- 运行时性能更好
- 错误在编译时发现
- 生成的代码可以缓存

#### 3. **类型安全**

100% TypeScript类型覆盖：

```typescript
// 完整的类型定义
export interface NestedToken {
  [key: string]: TokenValue
}

export type TokenValue = string | number | NestedToken

export interface FlatTokenMap {
  [key: string]: string | number
}

// 类型推断
const tokens: NestedToken = { /* ... */ }
const flat: FlatTokenMap = compiler.flatten(tokens)  // 类型正确
```

**好处**：
- 编辑器智能提示
- 编译时类型检查
- 减少运行时错误

#### 4. **向后兼容**

保留简化版API，确保现有代码继续工作：

```typescript
// 简化版（向后兼容）
import { SimpleTokenCompiler } from '@vjs-ui/core'
const compiler = new SimpleTokenCompiler()
const css = compiler.compile({ 'color': '#1677ff' })

// 完整版（新功能）
import { TokenCompiler } from '@vjs-ui/core'
const compiler = new TokenCompiler()
const css = compiler.toCSSVariables(flat)
```

### 技术选型

| 技术点 | 选型 | 理由 |
|--------|------|------|
| **数据结构** | WeakMap缓存 | 避免内存泄漏，自动GC |
| **对象遍历** | for...in + Object.entries | 性能最优 |
| **类型检查** | typeof + instanceof | 原生支持，性能好 |
| **正则表达式** | /\$\{?token\.([a-zA-Z0-9_.]+)\}?/g | 支持两种引用格式 |
| **CSS变量前缀** | --vjs- | 避免命名冲突 |
| **事件系统** | 数组+遍历 | 简单高效 |

### 设计决策

#### 决策1：扁平化 vs 嵌套结构

**问题**：内部存储应该用扁平还是嵌套？

**方案对比**：
- **方案A（扁平）**：`{ 'color.primary': '#1677ff' }`
  - 优点：查找快、遍历简单
  - 缺点：不符合设计思维
  
- **方案B（嵌套）**：`{ color: { primary: '#1677ff' } }`
  - 优点：符合设计思维、易于组织
  - 缺点：查找需要递归

**最终选择**：两者都支持
- 输入：支持嵌套（用户友好）
- 内部：扁平存储（性能优化）
- 输出：根据需要选择

**理由**：
- 用户输入时使用嵌套，符合设计思维
- 内部扁平存储，查找性能好
- flatten()函数负责转换

#### 决策2：Token引用语法

**问题**：使用什么语法表示Token引用？

**方案对比**：
- **方案A**：`$token.color.primary`
  - 优点：简洁
  - 缺点：可能与其他$符号冲突
  
- **方案B**：`${token.color.primary}`
  - 优点：类似模板字符串，易理解
  - 缺点：稍微冗长

**最终选择**：两者都支持
- `$token.xxx` - 简洁版
- `${token.xxx}` - 模板版

**理由**：
- 用户可以根据喜好选择
- 正则表达式都能匹配
- 向后兼容

#### 决策3：CSS变量命名规范

**问题**：CSS变量应该如何命名？

**方案对比**：
- **方案A**：`--color-primary`（无前缀）
  - 优点：简洁
  - 缺点：可能冲突
  
- **方案B**：`--vjs-color-primary`（有前缀）
  - 优点：避免冲突
  - 缺点：稍长

**最终选择**：方案B（有前缀）

**理由**：
- 避免与其他库冲突
- 遵循命名空间最佳实践
- 可以自定义前缀

---

## 📊 功能表

### 核心功能清单

#### TokenCompiler功能

| 功能模块 | 优先级 | 状态 | 测试 | 说明 |
|---------|-------|------|------|------|
| **flatten()** | 🔴 P0 | ✅ 完成 | 3/3 | 展平嵌套Token结构 |
| - 基础展平 | 🔴 P0 | ✅ 完成 | ✅ | 单层嵌套 → 扁平 |
| - 深度展平 | 🔴 P0 | ✅ 完成 | ✅ | 多层嵌套 → 扁平 |
| - 混合展平 | 🔴 P0 | ✅ 完成 | ✅ | 嵌套+扁平混合 |
| - 循环检测 | 🟡 P1 | ⏳ 待实现 | - | 防止循环引用 |
| **toCSSVariables()** | 🔴 P0 | ✅ 完成 | 3/3 | 编译成CSS Variables |
| - 基础生成 | 🔴 P0 | ✅ 完成 | ✅ | 生成CSS变量 |
| - 引用解析 | 🔴 P0 | ✅ 完成 | ✅ | 解析$token.xxx |
| - 自定义前缀 | 🔴 P0 | ✅ 完成 | ✅ | 支持--prefix- |
| - 美化输出 | 🔴 P0 | ✅ 完成 | ✅ | pretty选项 |
| - 媒体查询 | 🟡 P1 | ⏳ 待实现 | - | @media支持 |
| **toTypeScript()** | 🔴 P0 | ✅ 完成 | 1/1 | 生成TS类型定义 |
| - 接口生成 | 🔴 P0 | ✅ 完成 | ✅ | export interface |
| - 常量导出 | 🔴 P0 | ✅ 完成 | ✅ | export const |
| - JSDoc注释 | 🟡 P1 | ⏳ 待实现 | - | 生成注释 |
| **toSCSS()** | 🔴 P0 | ✅ 完成 | 2/2 | 生成SCSS变量 |
| - 变量生成 | 🔴 P0 | ✅ 完成 | ✅ | $xxx变量 |
| - 引用解析 | 🔴 P0 | ✅ 完成 | ✅ | 解析引用 |
| - Mixin生成 | 🟡 P1 | ⏳ 待实现 | - | @mixin支持 |
| **applyAlpha()** | 🔴 P0 | ✅ 完成 | 4/4 | 颜色透明度处理 |
| - Hex处理 | 🔴 P0 | ✅ 完成 | ✅ | #RRGGBB |
| - RGB处理 | 🔴 P0 | ✅ 完成 | ✅ | rgb(r,g,b) |
| - RGBA处理 | 🔴 P0 | ✅ 完成 | ✅ | rgba(r,g,b,a) |
| - HSL处理 | 🟡 P1 | ⏳ 待实现 | - | hsl(h,s,l) |
| **resolveReferences()** | 🔴 P0 | ✅ 完成 | 2/2 | Token引用解析 |
| - $token.xxx | 🔴 P0 | ✅ 完成 | ✅ | 简洁格式 |
| - ${token.xxx} | 🔴 P0 | ✅ 完成 | ✅ | 模板格式 |
| - 嵌套引用 | 🟡 P1 | ⏳ 待实现 | - | 引用的引用 |
| - 计算表达式 | 🟡 P1 | ⏳ 待实现 | - | ${token.x * 2} |

#### TokenRuntime功能

| 功能模块 | 优先级 | 状态 | 测试 | 说明 |
|---------|-------|------|------|------|
| **apply()** | 🔴 P0 | ✅ 完成 | 2/2 | 应用Token到DOM |
| - 基础应用 | 🔴 P0 | ✅ 完成 | ✅ | 设置CSS变量 |
| - 批量应用 | 🔴 P0 | ✅ 完成 | ✅ | 多个Token |
| - 过渡动画 | 🔴 P0 | ✅ 完成 | ✅ | 平滑过渡 |
| - 条件应用 | 🟡 P1 | ⏳ 待实现 | - | 按条件应用 |
| **get/set** | 🔴 P0 | ✅ 完成 | 4/4 | Token读写 |
| - get单个 | 🔴 P0 | ✅ 完成 | ✅ | 获取值 |
| - set单个 | 🔴 P0 | ✅ 完成 | ✅ | 设置值 |
| - setMany批量 | 🔴 P0 | ✅ 完成 | ✅ | 批量设置 |
| - getAll全部 | 🔴 P0 | ✅ 完成 | ✅ | 获取所有 |
| **onChange()** | 🔴 P0 | ✅ 完成 | 3/3 | 变化监听 |
| - 注册监听器 | 🔴 P0 | ✅ 完成 | ✅ | 添加listener |
| - 取消监听 | 🔴 P0 | ✅ 完成 | ✅ | unsubscribe |
| - 多监听器 | 🔴 P0 | ✅ 完成 | ✅ | 多个listener |
| - 事件过滤 | 🟡 P1 | ⏳ 待实现 | - | 按key过滤 |
| **remove/clear** | 🔴 P0 | ✅ 完成 | 2/2 | Token清理 |
| - remove单个 | 🔴 P0 | ✅ 完成 | ✅ | 移除Token |
| - remove多个 | 🔴 P0 | ✅ 完成 | ✅ | 批量移除 |
| - clear清空 | 🔴 P0 | ✅ 完成 | ✅ | 清空所有 |
| **destroy()** | 🔴 P0 | ✅ 完成 | 1/1 | 资源清理 |
| - 清空Token | 🔴 P0 | ✅ 完成 | ✅ | 移除所有CSS变量 |
| - 清空监听器 | 🔴 P0 | ✅ 完成 | ✅ | 移除所有listener |
| - 禁用动画 | 🔴 P0 | ✅ 完成 | ✅ | 清理transition |

### 功能详细说明

#### 功能：flatten()

**功能描述**：
- 将嵌套的Token结构展平成一维键值对
- 支持任意深度的嵌套
- 使用点号(.)连接嵌套路径

**输入输出**：
- 输入：`NestedToken` - 嵌套结构
- 输出：`FlatTokenMap` - 扁平结构

**使用示例**：
```typescript
const nested = {
  color: {
    primary: {
      base: '#1677ff',
      hover: '#4a90e2'
    }
  }
}

const flat = compiler.flatten(nested)
// {
//   'color.primary.base': '#1677ff',
//   'color.primary.hover': '#4a90e2'
// }
```

**注意事项**：
- 键名会自动用点号连接
- 基础类型值（string/number）会保留
- 对象会递归展平

---

**（第1部分完成，继续第2部分...）**
