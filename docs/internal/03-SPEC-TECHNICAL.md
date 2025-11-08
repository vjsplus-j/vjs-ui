# VJS-UI 技术规范文档

> **版本**: 1.0.0  
> **更新日期**: 2025-01-08  
> **状态**: 📋 草案

---

## 目录

1. [总体规范](#一总体规范)
2. [代码规范](#二代码规范)
3. [命名规范](#三命名规范)
4. [安全规范](#四安全规范)
5. [性能规范](#五性能规范)
6. [测试规范](#六测试规范)
7. [文档规范](#七文档规范)
8. [发布规范](#八发布规范)

---

## 一、总体规范

### 1.1 技术栈约束

| 技术 | 版本要求 | 说明 |
|------|---------|------|
| Node.js | >=18.0.0 | LTS版本 |
| pnpm | >=8.0.0 | 包管理器 |
| TypeScript | ^5.3.0 | 严格模式 |
| Vue | ^3.3.0 | 仅peer依赖 |
| React | ^18.0.0 | 仅peer依赖 |

### 1.2 浏览器支持

```json
{
  "browserslist": [
    "Chrome >= 90",
    "Firefox >= 88",
    "Safari >= 14",
    "Edge >= 90"
  ]
}
```

### 1.3 模块化规范

- **输出格式**: ESM (主要) + CJS (兼容) + UMD (CDN)
- **Tree-shaking**: 必须支持
- **Side Effects**: 在package.json中明确声明
- **依赖**: 尽量零依赖，必要时使用peerDependencies

---

## 二、代码规范

### 2.1 TypeScript规范

#### 严格模式配置

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

#### 类型定义规范

```typescript
// ✅ 推荐：使用interface定义对象类型
export interface UserInfo {
  id: string
  name: string
  email?: string  // 可选属性使用?
}

// ✅ 推荐：使用type定义联合类型
export type ButtonType = 'primary' | 'secondary' | 'danger'

// ❌ 禁止：使用any
const data: any = {}  // 错误！

// ✅ 正确：使用unknown或具体类型
const data: unknown = {}
const user: UserInfo = { id: '1', name: 'Alice' }

// ✅ 推荐：函数类型注解
function greet(name: string): string {
  return `Hello, ${name}`
}

// ✅ 推荐：泛型约束
function getValue<T extends { id: string }>(item: T): string {
  return item.id
}
```

#### 导出规范

```typescript
// ✅ 推荐：命名导出
export { Button }
export type { ButtonProps }

// ⚠️ 谨慎使用：默认导出（仅用于Vue组件）
export default defineComponent({ ... })

// ❌ 避免：导出时重命名
export { Button as VButton }  // 在导入端重命名更好
```

### 2.2 代码风格

#### ESLint配置

```javascript
// .eslintrc.cjs
module.exports = {
  rules: {
    // 缩进：2空格
    'indent': ['error', 2],
    
    // 引号：单引号
    'quotes': ['error', 'single'],
    
    // 分号：不使用
    'semi': ['error', 'never'],
    
    // 尾随逗号：多行时使用
    'comma-dangle': ['error', 'only-multiline'],
    
    // 箭头函数：参数始终使用括号
    'arrow-parens': ['error', 'always'],
    
    // 对象/数组解构
    'prefer-destructuring': ['error', {
      array: false,
      object: true
    }],
    
    // 禁止console（warn和error除外）
    'no-console': ['warn', { allow: ['warn', 'error'] }]
  }
}
```

#### Prettier配置

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

---

## 三、命名规范

### 3.1 文件命名

| 类型 | 命名方式 | 示例 |
|------|---------|------|
| Vue组件 | PascalCase.vue | `Button.vue`, `UserCard.vue` |
| TypeScript | kebab-case.ts | `token-runtime.ts`, `ast-walker.ts` |
| 类文件 | PascalCase.ts | `Parser.ts`, `Binder.ts` |
| 类型定义 | types.ts | `types.ts` |
| 测试文件 | *.test.ts | `parser.test.ts` |
| 配置文件 | kebab-case | `vite.config.ts` |

### 3.2 变量命名

```typescript
// ✅ 变量：camelCase
const userName = 'Alice'
const isLoading = false

// ✅ 常量：UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3
const API_BASE_URL = 'https://api.example.com'

// ✅ 类/接口：PascalCase
class TokenCompiler { }
interface UserInfo { }

// ✅ 泛型：单字母或T开头的PascalCase
function identity<T>(value: T): T { return value }
function map<TInput, TOutput>(fn: (item: TInput) => TOutput) { }

// ✅ 私有成员：_前缀
class Example {
  private _internalState: number
  private _calculateValue(): number { return 0 }
}

// ✅ 布尔变量：is/has/should前缀
const isEnabled = true
const hasError = false
const shouldUpdate = true
```

### 3.3 组件命名

```typescript
// ✅ Vue组件：V前缀 + PascalCase
export const VButton = defineComponent({ ... })
export const VDataTable = defineComponent({ ... })

// ✅ 组件Props：组件名 + Props后缀
export interface VButtonProps { }
export interface VDataTableProps { }

// ✅ 组件Emits：组件名 + Emits后缀
export interface VButtonEmits {
  (e: 'click', event: MouseEvent): void
}
```

### 3.4 DSL节点命名

```typescript
// ✅ DSL定义：组件名 + DSL后缀
export const ButtonDSL: DSLNode = { ... }
export const InputDSL: DSLNode = { ... }
```

---

## 四、安全规范

### 4.1 表达式执行安全

**禁止使用的特性：**

```typescript
// ❌ 禁止：直接使用new Function
const fn = new Function('return ' + userInput)

// ❌ 禁止：eval
eval(userInput)

// ❌ 禁止：访问全局对象
window.location = userInput
document.cookie = userInput

// ✅ 正确：使用jsep + AST解释器
import jsep from 'jsep'
const ast = jsep(expression)
const result = astWalker.walk(ast, context)
```

**白名单机制：**

```typescript
// ✅ 只允许安全的操作符
const ALLOWED_OPERATORS = new Set([
  '+', '-', '*', '/', '%',
  '==', '===', '!=', '!==',
  '<', '<=', '>', '>=',
  '&&', '||', '!', '?', ':'
])

// ✅ 只允许安全的全局函数
const ALLOWED_FUNCTIONS = new Set([
  'String', 'Number', 'Boolean',
  'Array', 'Object', 'Math', 'Date', 'JSON'
])
```

### 4.2 XSS防护

```typescript
// ✅ 文本内容自动转义
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// ✅ 危险的HTML使用v-html时必须提示
<template>
  <div v-html="sanitizedHtml" />  <!-- 必须经过sanitize -->
</template>

// ❌ 禁止：直接插入用户输入
innerHTML = userInput  // 危险！
```

### 4.3 依赖安全

```bash
# 定期审计依赖
pnpm audit

# 更新依赖
pnpm update

# 检查过时的依赖
pnpm outdated
```

---

## 五、性能规范

### 5.1 包体积目标

| 包 | 目标大小 (gzipped) | 说明 |
|---|-------------------|------|
| @vjs-ui/core | < 50KB | 核心引擎 |
| @vjs-ui/tokens | < 10KB | Token系统 |
| @vjs-ui/vue | < 30KB | Vue适配器（不含组件） |
| 单个组件 | < 10KB | 平均每个组件 |

### 5.2 性能基准

```typescript
// test/benchmarks/performance.bench.ts

import { bench, describe } from 'vitest'

describe('Performance Benchmarks', () => {
  bench('parse 1000 DSL nodes', () => {
    // 目标: < 100ms
  })

  bench('bind 1000 expressions', () => {
    // 目标: < 50ms
  })

  bench('render 100 components', () => {
    // 目标: < 16ms (60fps)
  })
})
```

### 5.3 优化策略

**代码分割：**

```typescript
// ✅ 动态导入组件
const VDataTable = defineAsyncComponent(() => import('./DataTable.vue'))

// ✅ 按需导入样式
import '@vjs-ui/vue/Button/style.css'
```

**缓存策略：**

```typescript
// ✅ 表达式编译缓存
const expressionCache = new Map<string, CompiledExpression>()

// ✅ 计算属性缓存
const double = computed(() => count.value * 2)
```

**批量更新：**

```typescript
// ✅ 使用requestAnimationFrame批处理
private scheduleUpdate(): void {
  requestAnimationFrame(() => {
    this.flushUpdates()
  })
}
```

---

## 六、测试规范

### 6.1 测试覆盖率要求

| 包 | 覆盖率目标 |
|---|----------|
| @vjs-ui/core | ≥ 90% |
| @vjs-ui/vue | ≥ 85% |
| @vjs-ui/react | ≥ 85% |

### 6.2 测试分类

**单元测试：**

```typescript
// ✅ 测试纯函数
describe('TokenCompiler', () => {
  it('should compile tokens to CSS variables', () => {
    const compiler = new TokenCompiler(tokens)
    const css = compiler.toCSSVariables()
    expect(css).toContain('--vjs-color-primary')
  })
})
```

**组件测试：**

```typescript
// ✅ 测试组件行为
import { mount } from '@vue/test-utils'

describe('VButton', () => {
  it('should emit click event', async () => {
    const wrapper = mount(VButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

**E2E测试（关键路径）：**

```typescript
// ✅ 测试完整流程
import { test, expect } from '@playwright/test'

test('should render DSL and handle interaction', async ({ page }) => {
  await page.goto('/playground')
  await page.click('[data-testid="render-button"]')
  await expect(page.locator('.vjs-button')).toBeVisible()
})
```

### 6.3 测试文件组织

```
test/
├── unit/              # 单元测试
│   ├── core/
│   ├── parser/
│   └── reactive/
├── integration/       # 集成测试
│   └── core.test.ts
├── e2e/              # E2E测试
│   └── playground.spec.ts
└── benchmarks/       # 性能基准测试
    └── performance.bench.ts
```

---

## 七、文档规范

### 7.1 代码注释

**JSDoc规范：**

```typescript
/**
 * 解析DSL节点为VNode
 * 
 * @param node - DSL节点定义
 * @param ctx - 运行时上下文
 * @returns 解析后的VNode数组
 * 
 * @example
 * ```ts
 * const vnodes = parser.parse({
 *   type: 'Button',
 *   props: { text: 'Click' }
 * }, context)
 * ```
 * 
 * @throws {Error} 当DSL无效时抛出错误
 */
parse(node: DSLNode, ctx: RuntimeContext): VNode[] {
  // 实现...
}
```

**行内注释：**

```typescript
// ✅ 解释"为什么"而不是"是什么"
// 使用WeakMap避免内存泄漏，因为target可能被GC
const targetMap = new WeakMap<object, Map<string, Set<Effect>>>()

// ❌ 不必要的注释
// 创建一个空数组
const items = []
```

### 7.2 README规范

每个包必须包含：

- 简介与功能特性
- 安装方法
- 快速开始
- API文档链接
- 示例代码
- 贡献指南链接

### 7.3 CHANGELOG规范

遵循 [Keep a Changelog](https://keepachangelog.com/) 格式：

```markdown
# Changelog

## [0.2.0] - 2025-01-15

### Added
- 新增VDataTable组件
- 支持虚拟滚动

### Changed
- 优化响应式系统性能

### Fixed
- 修复Token引用解析bug

### Breaking Changes
- 移除deprecated的oldAPI
```

---

## 八、发布规范

### 8.1 版本号规范

遵循 [Semantic Versioning](https://semver.org/)：

- **MAJOR**: 破坏性变更
- **MINOR**: 新功能（向后兼容）
- **PATCH**: Bug修复

### 8.2 发布流程

```bash
# 1. 确保所有测试通过
pnpm test

# 2. 构建所有包
pnpm build

# 3. 使用changeset创建变更集
pnpm changeset

# 4. 更新版本号
pnpm changeset version

# 5. 提交变更
git add .
git commit -m "chore: release"

# 6. 发布到npm
pnpm changeset publish

# 7. 推送tag
git push --follow-tags
```

### 8.3 发布检查清单

- [ ] 所有测试通过
- [ ] 文档已更新
- [ ] CHANGELOG已更新
- [ ] 版本号已更新
- [ ] Breaking Changes已标注
- [ ] GitHub Release已创建

---

## 九、附录

### 9.1 开发工具配置

**VSCode推荐配置：**

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

**VSCode推荐插件：**

- Vue - Official
- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)

### 9.2 Git提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型：**

- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档
- `style`: 格式（不影响代码运行）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试
- `chore`: 构建/工具

**示例：**

```
feat(core): add DSL for loop support

Add support for "item in items" syntax in DSL parser.

Closes #123
```

---

**文档维护者**: VJS Team  
**最后更新**: 2025-01-08
