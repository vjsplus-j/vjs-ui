# VJS-UI 测试策略

> **目标**: 建立全面的测试体系，确保代码质量和系统稳定性  
> **覆盖率目标**: 核心>90%, 组件>85%, 整体>85%

---

## 一、测试金字塔

```
           /\
          /  \
         / E2E \         10% - 关键用户路径
        /________\
       /          \
      /Integration\      20% - 模块集成
     /______________\
    /                \
   /  Unit Tests      \   70% - 单元测试
  /____________________\
```

---

## 二、单元测试策略

### 2.1 核心模块测试

#### Token系统测试

```typescript
// packages/core/test/unit/token/compiler.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { TokenCompiler } from '../../../src/token/compiler'
import type { TokenMap } from '../../../src/types'

describe('TokenCompiler', () => {
  let compiler: TokenCompiler
  let tokens: TokenMap

  beforeEach(() => {
    tokens = {
      'color.primary': {
        value: '#1677ff',
        type: 'color'
      },
      'color.secondary': {
        value: '#1677ff',
        type: 'color',
        alpha: 0.5,
        reference: 'color.primary'
      },
      'spacing.md': {
        value: '16px',
        type: 'spacing'
      }
    }
    compiler = new TokenCompiler(tokens)
  })

  describe('flatten()', () => {
    it('should flatten token definitions', () => {
      const flat = compiler.getFlatTokens()
      expect(flat['color.primary']).toBe('#1677ff')
      expect(flat['spacing.md']).toBe('16px')
    })

    it('should resolve token references', () => {
      const flat = compiler.getFlatTokens()
      expect(flat['color.secondary']).toContain('#1677ff')
    })

    it('should detect circular references', () => {
      const circularTokens: TokenMap = {
        'a': { value: 'b', type: 'other', reference: 'b' },
        'b': { value: 'a', type: 'other', reference: 'a' }
      }
      
      expect(() => new TokenCompiler(circularTokens)).toThrow('Circular token reference')
    })
  })

  describe('toCSSVariables()', () => {
    it('should generate CSS variables', () => {
      const css = compiler.toCSSVariables()
      expect(css).toContain(':root {')
      expect(css).toContain('--vjs-color-primary: #1677ff;')
      expect(css).toContain('--vjs-spacing-md: 16px;')
      expect(css).toContain('}')
    })

    it('should support custom prefix', () => {
      const css = compiler.toCSSVariables({ prefix: 'custom' })
      expect(css).toContain('--custom-color-primary')
    })

    it('should support minification', () => {
      const css = compiler.toCSSVariables({ minify: true })
      expect(css).not.toContain('\n')
    })
  })

  describe('toTypeScript()', () => {
    it('should generate TypeScript types', () => {
      const types = compiler.toTypeScript()
      expect(types).toContain("export type TokenKey =")
      expect(types).toContain("'color.primary'")
      expect(types).toContain("'spacing.md'")
    })
  })
})
```

#### 响应式系统测试

```typescript
// packages/core/test/unit/reactive/reactive.test.ts

import { describe, it, expect, vi } from 'vitest'
import { reactive, effect, computed, watch } from '../../../src/reactive'

describe('Reactive System', () => {
  describe('reactive()', () => {
    it('should make object reactive', () => {
      const obj = reactive({ count: 0 })
      let dummy
      
      effect(() => {
        dummy = obj.count
      })
      
      expect(dummy).toBe(0)
      obj.count = 1
      expect(dummy).toBe(1)
    })

    it('should make nested object reactive', () => {
      const obj = reactive({ nested: { count: 0 } })
      let dummy
      
      effect(() => {
        dummy = obj.nested.count
      })
      
      expect(dummy).toBe(0)
      obj.nested.count = 1
      expect(dummy).toBe(1)
    })

    it('should not trigger when value does not change', () => {
      const obj = reactive({ count: 0 })
      const fn = vi.fn(() => obj.count)
      
      effect(fn)
      expect(fn).toHaveBeenCalledTimes(1)
      
      obj.count = 0 // 相同的值
      expect(fn).toHaveBeenCalledTimes(1) // 不应该再次调用
    })

    it('should handle array mutations', () => {
      const arr = reactive([1, 2, 3])
      let sum = 0
      
      effect(() => {
        sum = arr.reduce((a, b) => a + b, 0)
      })
      
      expect(sum).toBe(6)
      arr.push(4)
      expect(sum).toBe(10)
    })
  })

  describe('effect()', () => {
    it('should run immediately', () => {
      const fn = vi.fn()
      effect(fn)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should support lazy option', () => {
      const fn = vi.fn()
      effect(fn, { lazy: true })
      expect(fn).not.toHaveBeenCalled()
    })

    it('should return cleanup function', () => {
      const obj = reactive({ count: 0 })
      const fn = vi.fn(() => obj.count)
      
      const cleanup = effect(fn)
      expect(fn).toHaveBeenCalledTimes(1)
      
      obj.count = 1
      expect(fn).toHaveBeenCalledTimes(2)
      
      cleanup()
      obj.count = 2
      expect(fn).toHaveBeenCalledTimes(2) // 不应该再次调用
    })
  })

  describe('computed()', () => {
    it('should compute value', () => {
      const obj = reactive({ count: 0 })
      const double = computed(() => obj.count * 2)
      
      expect(double.value).toBe(0)
      obj.count = 1
      expect(double.value).toBe(2)
    })

    it('should cache computed value', () => {
      const obj = reactive({ count: 0 })
      const fn = vi.fn(() => obj.count * 2)
      const double = computed(fn)
      
      // 多次访问
      expect(double.value).toBe(0)
      expect(double.value).toBe(0)
      expect(fn).toHaveBeenCalledTimes(1) // 只计算一次
      
      // 依赖变化后重新计算
      obj.count = 1
      expect(double.value).toBe(2)
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })

  describe('watch()', () => {
    it('should watch reactive property', () => {
      const obj = reactive({ count: 0 })
      const callback = vi.fn()
      
      watch(() => obj.count, callback)
      
      obj.count = 1
      expect(callback).toHaveBeenCalledWith(1, 0, expect.any(Function))
    })

    it('should support immediate option', () => {
      const obj = reactive({ count: 0 })
      const callback = vi.fn()
      
      watch(() => obj.count, callback, { immediate: true })
      
      expect(callback).toHaveBeenCalledWith(0, undefined, expect.any(Function))
    })

    it('should support cleanup', () => {
      const obj = reactive({ count: 0 })
      const cleanup = vi.fn()
      
      watch(() => obj.count, (newVal, oldVal, onCleanup) => {
        onCleanup(cleanup)
      })
      
      obj.count = 1
      expect(cleanup).not.toHaveBeenCalled()
      
      obj.count = 2
      expect(cleanup).toHaveBeenCalledTimes(1)
    })
  })
})
```

#### 安全性测试 🔴

```typescript
// packages/core/test/unit/security/evaluator.test.ts

import { describe, it, expect } from 'vitest'
import { SecureEvaluator } from '../../../src/evaluator/secure'

describe('Security Tests', () => {
  const evaluator = new SecureEvaluator()
  
  describe('Constructor Access Prevention', () => {
    it('should block constructor access', async () => {
      await expect(
        evaluator.evaluate('Math.constructor', {})
      ).rejects.toThrow('危险模式')
    })

    it('should block constructor property', async () => {
      await expect(
        evaluator.evaluate('({}).constructor', {})
      ).rejects.toThrow()
    })
  })

  describe('Prototype Pollution Prevention', () => {
    it('should block __proto__ access', async () => {
      await expect(
        evaluator.evaluate('__proto__', {})
      ).rejects.toThrow('危险模式')
    })

    it('should block prototype property', async () => {
      await expect(
        evaluator.evaluate('Object.prototype', {})
      ).rejects.toThrow('危险模式')
    })
  })

  describe('Code Injection Prevention', () => {
    it('should block eval', async () => {
      await expect(
        evaluator.evaluate('eval("alert(1)")', {})
      ).rejects.toThrow('危险模式')
    })

    it('should block Function constructor', async () => {
      await expect(
        evaluator.evaluate('Function("return 1")', {})
      ).rejects.toThrow()
    })

    it('should block import', async () => {
      await expect(
        evaluator.evaluate('import("module")', {})
      ).rejects.toThrow('危险模式')
    })
  })

  describe('Resource Limits', () => {
    it('should timeout on infinite loops', async () => {
      await expect(
        evaluator.evaluate('while(true){}', {})
      ).rejects.toThrow('执行超时')
    })

    it('should limit operations count', async () => {
      // 生成超过1000次操作的表达式
      const expr = Array(1001).fill('1 + 1').join(' + ')
      await expect(
        evaluator.evaluate(expr, {})
      ).rejects.toThrow('操作次数超限')
    })
  })

  describe('DOM Access Prevention', () => {
    it('should block document access', async () => {
      await expect(
        evaluator.evaluate('document.cookie', {})
      ).rejects.toThrow('危险模式')
    })

    it('should block window access', async () => {
      await expect(
        evaluator.evaluate('window.location', {})
      ).rejects.toThrow('危险模式')
    })
  })

  describe('Safe Operations', () => {
    it('should allow safe arithmetic', async () => {
      const result = await evaluator.evaluate('1 + 2 * 3', {})
      expect(result).toBe(7)
    })

    it('should allow safe comparisons', async () => {
      const result = await evaluator.evaluate('5 > 3', {})
      expect(result).toBe(true)
    })

    it('should allow context access', async () => {
      const result = await evaluator.evaluate('state.count', {
        state: { count: 42 }
      })
      expect(result).toBe(42)
    })
  })
})
```

---

## 三、组件测试策略

### 3.1 组件单元测试

```typescript
// packages/vue/test/unit/Button.test.ts

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { VButton } from '../../src/components/Button'

describe('VButton', () => {
  describe('Rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(VButton, {
        props: { text: 'Click Me' }
      })
      
      expect(wrapper.text()).toContain('Click Me')
      expect(wrapper.classes()).toContain('vjs-button')
    })

    it('should render with slot', () => {
      const wrapper = mount(VButton, {
        slots: {
          default: '<span>Custom Content</span>'
        }
      })
      
      expect(wrapper.html()).toContain('Custom Content')
    })

    it('should apply type class', () => {
      const wrapper = mount(VButton, {
        props: { type: 'primary' }
      })
      
      expect(wrapper.classes()).toContain('vjs-button--primary')
    })

    it('should apply size class', () => {
      const wrapper = mount(VButton, {
        props: { size: 'large' }
      })
      
      expect(wrapper.classes()).toContain('vjs-button--large')
    })
  })

  describe('Interactions', () => {
    it('should emit click event', async () => {
      const wrapper = mount(VButton)
      
      await wrapper.trigger('click')
      
      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')![0]).toEqual([expect.any(MouseEvent)])
    })

    it('should not emit click when disabled', async () => {
      const wrapper = mount(VButton, {
        props: { disabled: true }
      })
      
      await wrapper.trigger('click')
      
      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('should not emit click when loading', async () => {
      const wrapper = mount(VButton, {
        props: { loading: true }
      })
      
      await wrapper.trigger('click')
      
      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  describe('Loading State', () => {
    it('should show loading spinner', () => {
      const wrapper = mount(VButton, {
        props: { loading: true }
      })
      
      expect(wrapper.find('.vjs-button__loading').exists()).toBe(true)
    })

    it('should hide text when loading', () => {
      const wrapper = mount(VButton, {
        props: { text: 'Click', loading: true }
      })
      
      // 应该不显示原文本（或使用loading插槽）
      expect(wrapper.find('.vjs-button__loading').exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('should have correct aria-disabled', () => {
      const wrapper = mount(VButton, {
        props: { disabled: true }
      })
      
      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('should be focusable', () => {
      const wrapper = mount(VButton)
      const button = wrapper.element as HTMLButtonElement
      
      button.focus()
      expect(document.activeElement).toBe(button)
    })
  })

  describe('Snapshots', () => {
    it('should match snapshot - default', () => {
      const wrapper = mount(VButton, {
        props: { text: 'Click' }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - primary', () => {
      const wrapper = mount(VButton, {
        props: { text: 'Click', type: 'primary' }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - loading', () => {
      const wrapper = mount(VButton, {
        props: { text: 'Click', loading: true }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
```

---

## 四、集成测试策略

### 4.1 模块集成测试

```typescript
// packages/core/test/integration/core-integration.test.ts

import { describe, it, expect } from 'vitest'
import { createCore } from '../../src/core'
import { MockRenderer } from '../mocks/renderer'
import type { DSLNode } from '../../src/types'

describe('Core Integration', () => {
  describe('DSL to Rendering Pipeline', () => {
    it('should parse and render simple DSL', () => {
      const renderer = new MockRenderer()
      const core = createCore({
        tokens: { 'color.primary': '#1677ff' },
        renderer
      })

      const dsl: DSLNode = {
        type: 'Button',
        props: { text: 'Click' }
      }

      const container = document.createElement('div')
      const instance = core.render(dsl, container)

      expect(instance).toBeDefined()
      expect(instance.vnode.type).toBe('Button')
      expect(instance.vnode.props.text).toBe('Click')
    })

    it('should handle token references in style', () => {
      const renderer = new MockRenderer()
      const core = createCore({
        tokens: { 'color.primary': '#1677ff' },
        renderer
      })

      const dsl: DSLNode = {
        type: 'Box',
        style: {
          color: '{color.primary}'
        }
      }

      const container = document.createElement('div')
      const instance = core.render(dsl, container)

      expect(instance.vnode.style.color).toBe('#1677ff')
    })

    it('should update on state change', async () => {
      const renderer = new MockRenderer()
      const core = createCore({
        tokens: {},
        initialState: { count: 0 },
        renderer
      })

      const dsl: DSLNode = {
        type: 'Text',
        props: {
          content: '$state.count'
        }
      }

      const container = document.createElement('div')
      const instance = core.render(dsl, container)

      expect(instance.vnode.props.content).toBe(0)

      // 更新状态
      core.setState({ count: 1 })

      // 等待下一帧
      await new Promise(resolve => requestAnimationFrame(resolve))

      const updated = renderer.getMounted(instance.handle.id)
      expect(updated?.props.content).toBe(1)
    })
  })
})
```

---

## 五、E2E测试策略

### 5.1 关键用户路径测试

```typescript
// e2e/mvp.spec.ts

import { test, expect } from '@playwright/test'

test.describe('MVP User Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('should render basic components', async ({ page }) => {
    // 验证组件渲染
    await expect(page.locator('.vjs-button')).toBeVisible()
    await expect(page.locator('.vjs-input')).toBeVisible()
    await expect(page.locator('.vjs-card')).toBeVisible()
  })

  test('should handle button click', async ({ page }) => {
    const button = page.locator('.vjs-button')
    const counter = page.locator('[data-testid="counter"]')

    await expect(counter).toHaveText('0')
    
    await button.click()
    await expect(counter).toHaveText('1')
    
    await button.click()
    await expect(counter).toHaveText('2')
  })

  test('should handle input v-model', async ({ page }) => {
    const input = page.locator('.vjs-input')
    const display = page.locator('[data-testid="input-value"]')

    await input.fill('Hello World')
    await expect(display).toHaveText('Hello World')
  })

  test('should switch theme', async ({ page }) => {
    const themeButton = page.locator('[data-testid="theme-toggle"]')
    const root = page.locator(':root')

    await themeButton.click()
    
    // 验证CSS变量变化
    const color = await root.evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--vjs-color-primary')
    })
    
    expect(color).toBeTruthy()
  })
})
```

---

## 六、性能测试策略

### 6.1 性能基准测试

```typescript
// packages/core/test/benchmarks/performance.bench.ts

import { bench, describe } from 'vitest'
import { reactive, effect } from '../../src/reactive'
import { SimpleParser } from '../../src/dsl/simple-parser'
import type { SimpleDSL } from '../../src/dsl/simple-parser'

describe('Performance Benchmarks', () => {
  describe('Reactive System', () => {
    bench('create reactive object', () => {
      reactive({ count: 0 })
    })

    bench('reactive get', () => {
      const obj = reactive({ count: 0 })
      effect(() => obj.count)
    })

    bench('reactive set', () => {
      const obj = reactive({ count: 0 })
      obj.count = 1
    })

    bench('deep reactive access', () => {
      const obj = reactive({ a: { b: { c: { d: 0 } } } })
      effect(() => obj.a.b.c.d)
    })
  })

  describe('DSL Parser', () => {
    const parser = new SimpleParser()

    bench('parse simple DSL', () => {
      const dsl: SimpleDSL = {
        type: 'Button',
        props: { text: 'Click' }
      }
      parser.parse(dsl)
    })

    bench('parse 1000 simple nodes', () => {
      const nodes: SimpleDSL[] = Array(1000).fill(null).map(() => ({
        type: 'Button',
        props: { text: 'Click' }
      }))
      
      nodes.forEach(node => parser.parse(node))
    })

    bench('parse nested DSL', () => {
      const dsl: SimpleDSL = {
        type: 'Container',
        children: Array(10).fill(null).map(() => ({
          type: 'Button',
          props: { text: 'Click' }
        }))
      }
      parser.parse(dsl)
    })
  })
})
```

---

## 七、测试覆盖率要求

### 7.1 覆盖率目标

| 模块 | 目标覆盖率 | 当前覆盖率 | 状态 |
|------|-----------|-----------|------|
| @vjs-ui/core | ≥ 90% | - | ⚪ 待测 |
| @vjs-ui/vue | ≥ 85% | - | ⚪ 待测 |
| @vjs-ui/react | ≥ 85% | - | ⚪ 待测 |
| **整体** | **≥ 85%** | **-** | **⚪ 待测** |

### 7.2 关键模块优先级

**必须100%覆盖：**
- 安全相关代码（evaluator, sandbox）
- 核心响应式系统
- Token编译器

**必须>90%覆盖：**
- DSL解析器
- Binder
- Renderer接口

---

## 八、测试工具配置

### 8.1 Vitest配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.test.ts',
        '**/*.spec.ts'
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 80,
        statements: 85
      }
    }
  }
})
```

### 8.2 Playwright配置

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI
  }
})
```

---

## 九、CI/CD集成

### 9.1 GitHub Actions工作流

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run unit tests
        run: pnpm test
      
      - name: Run coverage
        run: pnpm test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
      
      - name: Run E2E tests
        run: pnpm test:e2e
```

---

## 十、测试最佳实践

### 10.1 测试编写原则

1. **AAA模式** - Arrange, Act, Assert
2. **单一职责** - 每个测试只验证一个功能
3. **独立性** - 测试间不能有依赖
4. **可重复** - 相同输入总是相同输出
5. **快速** - 单元测试<100ms

### 10.2 命名规范

```typescript
// ✅ 好的命名
describe('TokenCompiler', () => {
  describe('toCSSVariables()', () => {
    it('should generate CSS variables with default prefix', () => {})
    it('should support custom prefix', () => {})
    it('should minify output when option enabled', () => {})
  })
})

// ❌ 差的命名
describe('test', () => {
  it('works', () => {})
})
```

---

**测试是质量保证的基石，务必严格执行！**
# VJS-UI 分阶段测试清单

> **用途**: 明确每个阶段需要测试什么，达到什么效果  
> **更新日期**: 2025-01-08  
> **状态**: 🎯 执行指南

---

## 📋 测试维度说明

每个阶段的测试都必须覆盖以下维度：

| 维度 | 说明 | 覆盖率要求 |
|------|------|-----------|
| **功能性** | 功能是否正常工作 | 100% |
| **安全性** | 是否存在安全漏洞 | 100% |
| **性能** | 是否达到性能指标 | 基准测试通过 |
| **易用性** | 开发者使用是否方便 | 主观评估 |
| **无障碍** | 是否符合a11y标准 | WCAG 2.1 AA |
| **兼容性** | 浏览器兼容性 | 测试矩阵通过 |

---

## 🎯 MVP阶段测试清单（4周）

### Week 1: Token + 响应式

#### 功能性测试 ✅
```typescript
// Token系统
✓ Token编译生成CSS变量
✓ Token引用解析
✓ 循环引用检测
✓ 多层嵌套Token

// 响应式系统
✓ reactive创建响应式对象
✓ effect自动追踪依赖
✓ ref包装基本类型
✓ 嵌套对象响应式
✓ 数组响应式
✓ 值不变时不触发更新
```

#### 性能测试 ✅
```typescript
✓ 创建reactive对象 < 1ms
✓ 依赖收集 < 0.5ms
✓ 触发更新 < 0.5ms
✓ 1000个响应式对象 < 100ms
```

#### 易用性测试 🆕
```typescript
// 开发者体验
✓ API直观易懂
✓ TypeScript类型提示完整
✓ 错误信息清晰
✓ 调试友好（可查看依赖关系）

// 示例代码
const state = reactive({ count: 0 })  // ✓ 简单直观
effect(() => console.log(state.count)) // ✓ 自动追踪
state.count++ // ✓ 自动触发更新
```

#### 文档测试 🆕
```typescript
✓ 有README说明如何使用
✓ 有API文档
✓ 有使用示例
✓ 有常见问题解答
```

**Week 1 成功标准**：
- [ ] 所有单元测试通过（覆盖率>70%）
- [ ] 性能测试达标
- [ ] 开发者能在5分钟内上手
- [ ] 错误信息能快速定位问题

---

### Week 2: DSL + Vue渲染器

#### 功能性测试 ✅
```typescript
// DSL解析器
✓ 解析简单DSL
✓ 解析嵌套DSL
✓ 解析props
✓ 解析style
✓ 验证DSL格式

// Vue渲染器
✓ 注册组件
✓ 渲染DSL到DOM
✓ 更新组件
✓ 卸载组件
```

#### 易用性测试 🆕
```typescript
// DSL易用性
✓ DSL结构清晰易懂
✓ 支持类型提示（TypeScript）
✓ 错误时有明确提示

// 示例：DSL是否易写易读
const dsl = {
  type: 'Button',           // ✓ 类型明确
  props: { text: 'Click' }, // ✓ 属性清晰
  style: { color: 'red' }   // ✓ 样式直观
}

// Vue渲染器易用性
✓ 一行代码完成渲染
✓ 支持热更新
✓ 错误时不崩溃
```

#### 集成测试 ✅
```typescript
✓ Token + DSL + Vue 完整流程
✓ 状态变化自动更新视图
✓ 多个组件互不干扰
```

**Week 2 成功标准**：
- [ ] 集成测试通过
- [ ] DSL格式友好，容易理解
- [ ] 渲染错误有友好提示
- [ ] 文档完整

---

### Week 3: 基础组件（Button/Input/Card）

#### 功能性测试 ✅
```typescript
// VButton
✓ 渲染正确的HTML
✓ 点击触发事件
✓ disabled状态不可点击
✓ loading状态显示加载
✓ 不同type显示不同样式

// VInput
✓ v-model双向绑定
✓ placeholder显示
✓ disabled状态
✓ 输入验证
✓ 清空按钮

// VCard
✓ header/body/footer插槽
✓ 正确渲染子内容
✓ 样式正确应用
```

#### 无障碍测试 🆕
```typescript
// VButton
✓ 有正确的role属性
✓ 键盘可访问（Tab/Enter/Space）
✓ disabled时有aria-disabled
✓ loading时有aria-busy
✓ 焦点样式清晰

// VInput
✓ 有label关联
✓ 错误时有aria-invalid
✓ 占位符文本清晰
✓ 键盘导航流畅

// VCard
✓ 语义化HTML标签
✓ 标题有正确层级
```

#### 易用性测试 🆕
```typescript
// API易用性
✓ Props命名直观（text而非label）
✓ 事件命名标准（@click而非@onClick）
✓ 默认值合理
✓ 类型定义完整

// 使用体验
<VButton type="primary" @click="handleClick">
  Click Me
</VButton>
// ✓ 代码简洁
// ✓ 意图明确
// ✓ 类型安全

// 错误处理
✓ Props错误有警告
✓ 事件错误不崩溃
✓ 开发模式下有详细提示
```

#### 视觉回归测试 🆕
```typescript
✓ Button各状态截图对比
✓ Input各状态截图对比
✓ Card各状态截图对比
✓ 暗色主题下正常显示
```

**Week 3 成功标准**：
- [ ] 组件测试覆盖率>85%
- [ ] 无障碍测试全部通过
- [ ] 视觉回归测试通过
- [ ] 开发者反馈API友好

---

### Week 4: 集成测试与文档

#### E2E测试 ✅
```typescript
✓ 完整用户路径测试
✓ 按钮点击计数器
✓ 输入框双向绑定
✓ 主题切换生效
✓ 多组件交互正常
```

#### 文档完整性测试 🆕
```typescript
✓ 快速开始指南
✓ 每个组件有文档
✓ 每个API有说明
✓ 有完整示例
✓ 有常见问题
✓ 有故障排查指南
```

#### 易用性验证 🆕
```typescript
// 新手测试
✓ 新开发者15分钟内运行示例
✓ 30分钟内理解核心概念
✓ 1小时内开发简单页面

// 文档可用性
✓ 文档搜索功能正常
✓ 代码示例可直接复制运行
✓ API文档有类型提示
```

**MVP成功标准**：
- [ ] 所有测试通过
- [ ] 覆盖率>70%
- [ ] 性能达标
- [ ] 新手能快速上手
- [ ] 发布v0.1.0

---

## 🔬 Core引擎阶段测试清单（6-8周）

### 阶段1 Week 1: 完整Token + 响应式

#### 功能性测试（扩展）✅
```typescript
// Token系统增强
✓ 动态切换主题
✓ Token继承
✓ Token覆盖
✓ 多主题并存
✓ TypeScript类型生成

// 响应式系统增强
✓ computed缓存机制
✓ watch回调
✓ 深度监听
✓ 立即执行
✓ 清理函数
✓ effectStack管理
```

#### 性能测试（提高标准）✅
```typescript
✓ Token编译1000个 < 50ms
✓ 主题切换 < 100ms
✓ computed缓存命中 < 0.1ms
✓ watch触发 < 1ms
✓ 深度响应式访问 < 2ms
```

#### 易用性测试 🆕
```typescript
// Token系统易用性
const theme = useTheme()
theme.setToken('color.primary', '#ff0000') // ✓ 简单直观
theme.switchTheme('dark') // ✓ 一键切换

// 响应式易用性
const double = computed(() => count.value * 2) // ✓ 自动缓存
watch(() => count.value, (newVal) => {}) // ✓ 灵活监听
```

---

### 阶段1 Week 2: 表达式 + 安全沙箱

#### 功能性测试 ✅
```typescript
// 表达式引擎
✓ 算术运算（+、-、*、/）
✓ 比较运算（>、<、==、!=）
✓ 逻辑运算（&&、||、!）
✓ 三元运算（? :）
✓ 成员访问（obj.prop）
✓ 数组访问（arr[0]）
✓ 函数调用（Math.max）
```

#### 安全性测试（100%覆盖）🔴
```typescript
// 必须全部通过，一个都不能失败！
✓ 阻止constructor访问
✓ 阻止__proto__访问
✓ 阻止prototype访问
✓ 阻止eval执行
✓ 阻止Function构造
✓ 阻止import动态导入
✓ 阻止require导入
✓ 阻止document访问
✓ 阻止window访问
✓ 阻止全局对象访问
✓ 超时保护（100ms）
✓ 操作次数限制（1000次）
✓ 内存限制
✓ 原型链污染防护
✓ XSS注入防护

// 安全审计
✓ 静态代码扫描通过
✓ 渗透测试通过
✓ 安全专家review通过
```

#### 性能测试 ✅
```typescript
✓ 简单表达式求值 < 1ms
✓ 复杂表达式求值 < 10ms
✓ 1000次求值 < 100ms
✓ 表达式编译缓存命中 < 0.1ms
```

#### 易用性测试 🆕
```typescript
// 表达式易写性
{
  "props": {
    "text": "$state.count",                    // ✓ 简单变量
    "visible": "$state.count > 0",             // ✓ 条件表达式
    "label": "$state.name || 'Unknown'",       // ✓ 逻辑运算
    "class": "$state.active ? 'active' : ''"   // ✓ 三元运算
  }
}

// 错误提示友好性
✓ 表达式语法错误有明确提示
✓ 安全错误有解释（为什么被阻止）
✓ 变量未定义有提示
```

**安全性验证清单**：
- [ ] 所有安全测试100%通过
- [ ] 无任何绕过方式
- [ ] 性能损耗<10%
- [ ] 错误信息不泄露敏感信息

---

### 阶段1 Week 3: Binder + Core集成

#### 功能性测试 ✅
```typescript
// Binder
✓ Props动态绑定
✓ Style动态绑定
✓ Events动态绑定
✓ Token引用解析
✓ 表达式绑定
✓ 依赖收集
✓ 自动更新
✓ 内存清理

// Core集成
✓ 所有子系统协同工作
✓ render流程正确
✓ update流程正确
✓ unmount流程正确
✓ 事件总线正常
```

#### 集成测试 ✅
```typescript
// 完整流程测试
✓ DSL → Parser → Binder → Renderer
✓ 状态变化 → 依赖触发 → 视图更新
✓ Token变化 → 样式更新
✓ 表达式求值 → 安全检查 → 绑定
```

#### 性能测试 ✅
```typescript
✓ 挂载1000个节点 < 200ms
✓ 更新单个节点 < 5ms
✓ 批量更新100个节点 < 50ms
✓ 卸载1000个节点 < 100ms
✓ 内存泄漏检测通过
```

#### 易用性测试 🆕
```typescript
// 整体API易用性
const core = createCore({
  tokens: defaultTokens,
  initialState: { count: 0 }
})

core.render(dsl, container) // ✓ 一行渲染
core.setState({ count: 1 }) // ✓ 简单更新
core.unmount(instance) // ✓ 清理方便

// 错误处理
✓ DSL格式错误有详细提示
✓ 绑定失败不崩溃
✓ 开发模式下有性能警告
```

**Core阶段成功标准**：
- [ ] 功能测试全部通过
- [ ] 安全测试100%覆盖
- [ ] 性能测试达标
- [ ] 集成测试通过
- [ ] 内存泄漏检测通过
- [ ] 覆盖率>90%
- [ ] 发布v0.2.0

---

## 🎨 Vue适配层测试清单（6周）

### Week 1: Vue渲染器

#### 功能性测试 ✅
```typescript
// VueRenderer
✓ Core VNode → Vue VNode转换
✓ 组件注册
✓ 组件懒加载
✓ 插槽支持
✓ 指令支持
✓ 组合式函数

// 组合式函数
✓ useCore()
✓ useDSL()
✓ useToken()
✓ useTheme()
✓ useVModel()
```

#### Vue兼容性测试 🆕
```typescript
✓ Vue 3.3.x兼容
✓ Composition API正常
✓ Options API正常
✓ setup语法糖支持
✓ TypeScript类型完整
✓ HMR热更新正常
```

#### 易用性测试 🆕
```typescript
// 组合式函数易用性
<script setup>
const { tokens, setToken } = useToken()  // ✓ 直观
const { state, setState } = useCore()    // ✓ 简洁
</script>

// Vue开发者熟悉度
✓ API风格与Vue一致
✓ 命名符合Vue规范
✓ 类型提示完整
✓ Volar支持良好
```

---

### Week 2-4: 10个核心组件

#### 功能性测试（每个组件）✅
```typescript
// 必须测试的点
✓ 基础渲染
✓ Props传递
✓ Events触发
✓ Slots插槽
✓ v-model双向绑定
✓ 动态更新
✓ 条件渲染
✓ 列表渲染
✓ 样式应用
✓ 主题切换
```

#### 无障碍测试（每个组件）🆕
```typescript
// WCAG 2.1 AA级标准
✓ 语义化HTML
✓ ARIA属性正确
✓ 键盘导航完整
  - Tab键切换
  - Enter/Space激活
  - Esc关闭
  - 方向键导航
✓ 焦点管理
✓ 屏幕阅读器友好
✓ 颜色对比度≥4.5:1
✓ 文本可缩放
```

#### 易用性测试（每个组件）🆕
```typescript
// API设计
✓ Props命名直观
✓ Events命名标准
✓ Slots命名清晰
✓ 默认值合理
✓ 必填项最少

// 使用体验
<VButton type="primary" @click="handleClick">
  Submit
</VButton>
// ✓ 代码简洁（1-2行）
// ✓ 意图明确
// ✓ IDE提示完整

// 错误处理
✓ Props类型错误有警告
✓ 必填props缺失有提示
✓ 运行时错误有友好消息
```

#### 视觉测试（每个组件）🆕
```typescript
// 截图回归测试
✓ 默认状态
✓ hover状态
✓ focus状态
✓ active状态
✓ disabled状态
✓ loading状态
✓ error状态
✓ 暗色主题
✓ 不同尺寸（sm/md/lg）
✓ 响应式布局
```

#### 浏览器兼容性测试 🆕
```typescript
✓ Chrome 90+
✓ Firefox 88+
✓ Safari 14+
✓ Edge 90+
✓ 移动端Safari
✓ 移动端Chrome
```

---

### Week 5-6: 测试与文档

#### 组件文档测试 🆕
```typescript
// 每个组件必须有
✓ 组件描述
✓ 基础用法示例
✓ 进阶用法示例
✓ Props API表格
✓ Events API表格
✓ Slots API表格
✓ 常见问题FAQ
✓ 可运行的demo

// 文档质量
✓ 代码示例可复制运行
✓ 截图清晰
✓ 描述准确
✓ 更新及时
```

#### 集成测试 ✅
```typescript
// 多组件交互
✓ Form + Input + Button
✓ Table + Pagination
✓ Modal + Form
✓ Dialog + Button
✓ 嵌套组件通信
```

**Vue阶段成功标准**：
- [ ] 10个组件全部完成
- [ ] 每个组件测试覆盖率>85%
- [ ] 无障碍测试全部通过
- [ ] 视觉回归测试通过
- [ ] 浏览器兼容性测试通过
- [ ] 文档完整
- [ ] 发布v0.5.0

---

## 📊 测试效果评估标准

### 功能性效果
```
✓ 所有功能按预期工作
✓ 边界条件正确处理
✓ 错误情况优雅降级
✓ 覆盖率达标
```

### 安全性效果
```
✓ 无已知安全漏洞
✓ 安全审计通过
✓ 渗透测试通过
✓ 100%覆盖关键路径
```

### 性能效果
```
✓ 达到性能基准
✓ 无内存泄漏
✓ 无性能退化
✓ 响应时间<指标
```

### 易用性效果
```
✓ 新手15分钟上手
✓ API直观易懂
✓ 错误信息友好
✓ 文档完整清晰
✓ IDE支持良好
```

### 无障碍效果
```
✓ 键盘完全可用
✓ 屏幕阅读器友好
✓ 焦点管理正确
✓ WCAG 2.1 AA达标
```

### 兼容性效果
```
✓ 主流浏览器正常
✓ 移动端正常
✓ 不同分辨率正常
✓ 降级方案可用
```

---

## 🚨 关键测试指标

### 必须达标指标

| 指标 | 目标 | 不达标后果 |
|------|------|-----------|
| Core测试覆盖率 | ≥90% | 🔴 不能发布 |
| Vue测试覆盖率 | ≥85% | 🔴 不能发布 |
| 安全测试覆盖 | 100% | 🔴 不能发布 |
| 无障碍测试 | 100%通过 | 🟡 警告 |
| 性能测试 | 全部达标 | 🔴 不能发布 |
| 浏览器兼容 | 主流浏览器 | 🔴 不能发布 |

### 推荐达标指标

| 指标 | 目标 | 备注 |
|------|------|------|
| 易用性评分 | >8/10 | 开发者反馈 |
| 文档完整度 | 100% | 每个API都有 |
| 示例覆盖 | 100% | 每个功能都有 |
| 问题响应 | <48h | Issues响应 |

---

## 📝 测试报告模板

### 每周测试报告

```markdown
## Week X 测试报告

### 测试概况
- 测试用例总数：XXX
- 通过：XXX
- 失败：XXX
- 跳过：XXX
- 覆盖率：XX%

### 功能性测试
- ✅ Token系统：10/10通过
- ✅ 响应式系统：15/15通过
- ❌ DSL解析：8/10通过（2个失败）

### 安全性测试
- ✅ Constructor防护：5/5通过
- ✅ 原型污染防护：3/3通过
- ✅ 代码注入防护：5/5通过

### 性能测试
- ✅ Token编译：45ms < 50ms ✓
- ❌ 响应式更新：18ms > 16ms ✗

### 易用性测试
- ✅ API直观性：9/10分
- ✅ 文档完整性：8/10分
- ⚠️ 错误提示：6/10分（需改进）

### 问题清单
1. DSL解析嵌套层级过深时失败
2. 响应式更新性能略低于目标

### 下周计划
1. 修复DSL解析问题
2. 优化响应式更新性能
3. 改进错误提示信息
```

---

## ⚠️ 测试失败处理流程

### 功能测试失败
```
1. 确认是代码bug还是测试用例问题
2. 创建Issue记录问题
3. 修复代码或更新测试
4. 重新运行测试
5. 确认通过后关闭Issue
```

### 安全测试失败
```
1. 🔴 立即停止发布
2. 分析安全漏洞
3. 紧急修复
4. 完整回归测试
5. 安全审计确认
6. 才能发布
```

### 性能测试失败
```
1. 分析性能瓶颈
2. 优化代码
3. 重新基准测试
4. 确认达标
```

### 易用性测试失败
```
1. 收集用户反馈
2. 改进API设计
3. 更新文档
4. 重新评估
```

---

**测试是质量的保证，每个阶段的测试都不能省略！**

**特别注意**：
- 🔴 安全性测试必须100%通过
- ✅ 易用性测试要重视开发者反馈
- 📊 每周更新测试报告
- 🚨 测试失败要及时处理
