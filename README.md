# VJS-UI 企业级组件库

> 基于 Design Token + DSL 驱动的跨框架UI组件库  
> 372个企业级组件 覆盖21+行业场景

[![NPM Version](https://img.shields.io/npm/v/@vjs-ui/vue)](https://www.npmjs.com/package/@vjs-ui/vue)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Vue](https://img.shields.io/badge/Vue-3.0+-green.svg)](https://vuejs.org/)
[![Downloads](https://img.shields.io/npm/dm/@vjs-ui/vue)](https://www.npmjs.com/package/@vjs-ui/vue)
[![Stars](https://img.shields.io/github/stars/vjsplus-j/vjs-ui?style=social)](https://github.com/vjsplus-j/vjs-ui)

---

## 🎬 在线演示

- **[官方文档](https://vjs-ui.github.io)** - 完整文档和示例
- **[组件演示](https://vjs-ui.github.io/playground)** - 在线体验所有组件
- **[代码示例](https://stackblitz.com/github/vjsplus-j/vjs-ui)** - StackBlitz在线编辑

---

## ✨ 核心特性

### 🎯 DSL驱动
- **JSON配置即可生成组件** - 无需手写代码
- **动态渲染能力** - 运行时动态创建组件
- **可视化拖拽支持** - 低代码平台友好

### ⚡ 高性能
- **零虚拟DOM Diff** - 直接响应式更新
- **并发渲染** - Time Slicing + 优先级调度
- **虚拟滚动** - 支持10万+数据流畅渲染
- **对象池优化** - VNode复用，减少GC压力

### 🔒 企业级安全
- **五层安全防护** - 表达式静态分析、AST白名单、安全沙箱
- **XSS防护** - 完整的内容安全策略
- **权限控制** - 细粒度的组件权限管理

### 🎨 独特的多主题系统 ⭐
- **开发者零CSS** - 安装即用，无需写任何样式代码
- **一键切换主题** - UI组件点击即可切换，自动持久化
- **5大独特主题** - 宇宙黑、深夜蓝、赛博朋克、企业级深色、梦幻紫
- **运行时动态切换** - 无需重新构建，即时生效
- **完全封装** - 样式与组件绑定，主题独立管理
- **科技感设计** - 发光、毛玻璃、渐变等现代视觉效果

### 🌐 跨框架支持
- **Vue 3** - 优先支持，深度集成
- **React** - 适配层支持
- **Web Components** - 原生组件支持

---

## 📦 组件库（372个）

### 组件分类

| 分类 | 组件数 | 说明 |
|------|--------|------|
| 🎨 基础UI组件 | 43 | Button、Input、Table等通用组件 |
| 📊 数据可视化 | 60 | 图表、地图、大屏展示 |
| 🏢 企业管理 | 51 | 工作流、文件、日志、低代码 |
| 🤖 AI智能 | 34 | 智能对话、模型训练、图像识别 |
| 🎥 专业领域 | 52 | 音视频、物联网、数字孪生、金融 |
| 🛒 电商供应链 | 27 | 商品、交易、营销、物流 |
| 👥 客户人力 | 27 | CRM、HRM系统 |
| 🏥 医疗教育 | 24 | 医疗健康、在线教育 |
| 🔧 PLM支付 | 18 | 产品管理、支付结算 |
| 💼 ERP项目 | 18 | ERP财务、项目管理 |
| 🌐 门户内容 | 18 | 企业门户、CMS、博客 |

**[查看完整组件清单 →](./COMPONENTS.md)**

---

## 🎯 适用场景

VJS-UI 覆盖21+行业场景，提供完整的企业级解决方案：

```
✅ 企业管理系统      ✅ 数据可视化大屏    ✅ 电商零售平台
✅ 金融交易系统      ✅ 医疗健康系统      ✅ 教育培训平台
✅ 制造工业系统      ✅ 物联网平台        ✅ 供应链管理
✅ 客户关系CRM       ✅ 人力资源HRM       ✅ 项目管理系统
✅ 企业门户网站      ✅ 内容管理CMS       ✅ 博客新闻平台
✅ 音视频系统        ✅ AI智能应用        ✅ 区块链应用
✅ 安防监控系统      ✅ 数字孪生          ✅ 即时通讯
```

---

## 🚀 快速开始

### 安装

```bash
# npm
npm install @vjs-ui/core @vjs-ui/tokens

# yarn
yarn add @vjs-ui/core @vjs-ui/tokens

# pnpm (推荐)
pnpm add @vjs-ui/core @vjs-ui/tokens
```

### 响应式系统使用

```javascript
import { reactive, ref, effect, computed } from '@vjs-ui/core'

// 1. 响应式对象
const state = reactive({
  count: 0,
  nested: {
    value: 'hello'
  }
})

// 2. 响应式引用
const count = ref(0)
const message = ref('Hello VJS-UI')

// 3. 副作用函数
effect(() => {
  console.log('Count:', count.value)
})

count.value++ // 自动触发effect

// 4. 计算属性
const double = computed(() => count.value * 2)
console.log(double.value) // 自动计算
```

### Design Token使用

```javascript
import { 
  tokens, 
  generateCSSString, 
  injectCSSVariables,
  setCSSVariable 
} from '@vjs-ui/tokens'

// 1. 获取token
console.log(tokens.colors.primary[500]) // #1890ff

// 2. 生成CSS字符串
const cssString = generateCSSString(tokens)
console.log(cssString)
// :root {
//   --vjs-colors-primary-500: #1890ff;
//   --vjs-spacing-1: 4px;
//   ...
// }

// 3. 注入到页面
injectCSSVariables(tokens)

// 4. 运行时修改
setCSSVariable('colors-primary-500', '#FF0000')

// 5. 在CSS中使用
// .button {
//   background: var(--vjs-colors-primary-500);
//   padding: var(--vjs-spacing-4);
//   border-radius: var(--vjs-borderRadius-md);
// }
```

### TypeScript支持

```typescript
import type { Ref, ComputedRef } from '@vjs-ui/core'
import type { Tokens, CSSVariables } from '@vjs-ui/tokens'

// 完整的类型推导
const count: Ref<number> = ref(0)
const double: ComputedRef<number> = computed(() => count.value * 2)

// Token类型安全
const tokens: Tokens = {
  colors: { /* ... */ },
  spacing: { /* ... */ },
  // ...
}
```

---

## 🎨 主题定制

### 使用 Design Token

```javascript
import { setTheme } from '@vjs-ui/core'

// 设置全局主题
setTheme({
  colorPrimary: '#1890ff',
  colorSuccess: '#52c41a',
  colorWarning: '#faad14',
  colorError: '#ff4d4f',
  borderRadius: '4px',
  fontSize: '14px'
})
```

### CSS Variables

```css
:root {
  --vjs-color-primary: #1890ff;
  --vjs-border-radius: 4px;
  --vjs-font-size: 14px;
}

/* 深色模式 */
[data-theme='dark'] {
  --vjs-color-primary: #177ddc;
  --vjs-bg-color: #141414;
}
```

---

## 📚 文档导航

### 核心文档

- **[技术架构](./ARCHITECTURE.md)** - 了解VJS-UI的技术设计
- **[组件清单](./COMPONENTS.md)** - 372个组件完整列表
- **[API参考](./03-SPEC-API-DESIGN.md)** - API使用文档
- **[组件开发指南](./03-SPEC-COMPONENT-DEV-GUIDE.md)** - 如何开发自定义组件

### 技术特性

- **[DSL系统](./04-TECH-DSL-COMPLETE.md)** - DSL解析与渲染
- **[响应式系统](./04-TECH-REACTIVE-SYSTEM.md)** - 响应式原理
- **[性能优化](./04-TECH-PERFORMANCE-COMPLETE.md)** - 性能优化方案
- **[安全机制](./04-TECH-SECURITY-GUIDE.md)** - 安全防护体系

---

## 🎯 开发规范

### 代码规范

**组件命名**（PascalCase）
```typescript
// ✅ 推荐
VButton, VTable, VDataChart

// ❌ 避免
vbutton, v-button, Button
```

**Props定义**（camelCase）
```typescript
// ✅ 推荐
<VButton buttonType="primary" />

// ❌ 避免
<VButton button-type="primary" />
```

### 类型安全

所有组件提供完整的TypeScript类型定义：

```typescript
import type { ButtonProps, TableProps } from '@vjs-ui/vue'

const buttonProps: ButtonProps = {
  type: 'primary',
  size: 'large',
  disabled: false
}
```

---

## 🌟 性能指标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 核心包体积 | < 80KB gzipped | 最小化打包体积 |
| 渲染性能 | < 200ms | 1000节点渲染时间 |
| 响应式更新 | < 16ms | 保持60fps流畅度 |
| 内存占用 | < 100MB | 运行时内存控制 |
| 虚拟滚动 | 10万+数据 | 大数据列表性能 |

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发环境

```bash
# 克隆仓库
git clone https://github.com/vjsplus-j/vjs-ui.git

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 构建
pnpm build
```

---

## 📄 许可证

[MIT License](./LICENSE)

---

## 👥 贡献者

感谢所有为VJS-UI做出贡献的开发者！

[![Contributors](https://contrib.rocks/image?repo=vjsplus-j/vjs-ui)](https://github.com/vjsplus-j/vjs-ui/graphs/contributors)

### 核心团队

- **[@vjsplus-j](https://github.com/vjsplus-j)** - 项目创建者和维护者
- **VJS Team** - 核心开发团队

---

## 💬 联系我们

- **官网**: [https://vjs-ui.github.io](https://vjs-ui.github.io)
- **GitHub**: [https://github.com/vjsplus-j/vjs-ui](https://github.com/vjsplus-j/vjs-ui)
- **Issues**: [创建Issue](https://github.com/vjsplus-j/vjs-ui/issues)
- **Discussions**: [技术讨论](https://github.com/vjsplus-j/vjs-ui/discussions)
- **Twitter**: [@vjs_ui](https://twitter.com/vjs_ui)

---

## ⭐ 支持我们

如果VJS-UI对你有帮助，请给我们一个Star！⭐

[![Star History Chart](https://api.star-history.com/svg?repos=vjsplus-j/vjs-ui&type=Date)](https://star-history.com/#vjsplus-j/vjs-ui&Date)

---

**用VJS-UI构建下一代企业级应用！** 🚀

