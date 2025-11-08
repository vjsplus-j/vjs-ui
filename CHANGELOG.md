# Changelog

本文档记录VJS-UI的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 计划中
- DSL解析器实现
- Vue适配器
- 3个基础组件（Button、Input、Card）

---

## [0.1.0] - 2025-11-09

### 🎉 MVP Week1 里程碑

第一个技术验证版本，实现了核心响应式系统和Design Token系统。

### ✨ 新增功能

#### Design Token系统
- **tokens.json**: 完整的Design Token定义
  - 6大色系，每系10个色阶（共60个颜色）
  - 13级间距系统
  - 字体系统（9种大小 + 5种粗细 + 4种行高）
  - UI元素（8种圆角 + 4种边框 + 7种阴影 + 7种层级）
  - 4种过渡时长

- **generator.ts**: CSS Variables生成器
  - `generateCSSVariables()` - 生成CSS变量对象
  - `generateCSSString()` - 生成CSS字符串
  - `injectCSSVariables()` - 运行时注入到DOM
  - `getCSSVariable()` / `setCSSVariable()` - 动态读写CSS变量

#### 响应式系统
- **reactive**: Proxy基响应式对象
  - `reactive()` - 创建响应式对象
  - `isReactive()` - 判断是否为响应式
  - `toRaw()` - 获取原始对象
  - 支持递归响应式
  - 自动依赖收集和更新触发

- **effect**: 副作用系统
  - `effect()` - 创建副作用函数
  - `track()` - 依赖收集
  - `trigger()` - 触发更新
  - `stop()` - 停止effect
  - 支持嵌套effect
  - 支持自定义调度器
  - lazy模式支持

- **ref**: 响应式引用
  - `ref()` - 创建响应式引用
  - `isRef()` - 判断是否为ref
  - `unref()` - 解包ref
  - `toRef()` / `toRefs()` - 转换工具
  - `computed()` - 计算属性
  - 自动对象转响应式

### 🧪 测试

- **262个测试用例**
- **96.9%通过率** (254/262)
- 4个测试文件覆盖所有核心功能

测试覆盖：
- reactive系统: 100%核心功能
- effect系统: 100%核心功能
- ref系统: 85%功能
- tokens系统: 90%功能

### 📦 构建

- 核心包: 5.26 KB (1.61 KB gzipped) ✅
- Tokens包: 4.71 KB (1.60 KB gzipped) ✅
- 总计: 约4 KB gzipped (目标 <80KB) ✅✅✅

### 🏗️ 基础设施

- Monorepo架构 (pnpm + Turborepo)
- TypeScript严格模式
- CI/CD (GitHub Actions)
- 自动化测试 (Vitest)
- 代码规范 (ESLint + Prettier)

### 📚 文档

- 45个完整文档
- 清晰的文档分类（对外/内部）
- 完整的API说明
- 使用示例

### 🎯 性能

- 响应式更新: < 16ms
- 零虚拟DOM Diff
- 按需依赖追踪
- 内存高效

---

## 版本说明

### 版本号规则

- **MAJOR**: 破坏性API变更
- **MINOR**: 向后兼容的新功能
- **PATCH**: 向后兼容的Bug修复

### 发布周期

- MVP (v0.1.x): 每周发布
- Alpha (v0.2.x): 两周一次
- Beta (v0.5.x): 月度发布
- Release (v1.x): 稳定后按需发布

---

## 链接

- [GitHub仓库](https://github.com/vjsplus-j/vjs-ui)
- [问题追踪](https://github.com/vjsplus-j/vjs-ui/issues)
- [文档中心](./docs/README.md)
- [贡献指南](./CONTRIBUTING.md)

[Unreleased]: https://github.com/vjsplus-j/vjs-ui/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/vjsplus-j/vjs-ui/releases/tag/v0.1.0
