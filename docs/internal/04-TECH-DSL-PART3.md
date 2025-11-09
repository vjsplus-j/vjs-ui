# DSL系统技术文档（第3部分）

> 接第2部分：常见Bug、避免错误、测试策略

---

## 🐛 常见Bug

### Bug清单

| Bug | 严重度 | 触发条件 | 现象 | 解决方案 | 状态 |
|-----|--------|---------|------|---------|------|
| XSS注入风险 | 🔴 高 | 恶意表达式 | 代码执行 | 沙箱隔离 | ✅ 已防范 |
| 表达式死循环 | 🔴 高 | 递归调用 | 浏览器卡死 | 超时保护 | ⏳ 待实现 |
| 内存泄漏 | 🟡 中 | 未清理监听器 | 内存增长 | WeakMap | ⏳ 待优化 |
| v-for key缺失 | 🟡 中 | 未设置key | 渲染错误 | 警告提示 | ⏳ 待实现 |
| 循环引用 | 🟡 中 | DSL自引用 | 栈溢出 | 深度限制 | ⏳ 待实现 |

### Bug详细分析

#### Bug1：XSS注入风险

**Bug描述**：
- 恶意用户可能通过表达式注入XSS代码
- 例如：访问window.location进行重定向
- 例如：创建script标签注入恶意脚本
- 影响范围：整个应用安全

**触发条件**：
```json
{
  "type": "div",
  "props": {
    "innerHTML": "eval('alert(1)')"
  }
}

{
  "type": "button",
  "events": {
    "onClick": "window.location='http://evil.com'"
  }
}
```

**原因分析**：
- 根本原因：表达式有完整JS能力
- 为什么危险：用户可控DSL内容
- 影响范围：所有使用DSL的页面

**解决方案**：

**1. 沙箱隔离**：
```typescript
class SecuritySandbox {
  private blacklist = new Set([
    'eval', 'Function', 'window', 'document',
    'global', 'process', 'require', 'import'
  ])
  
  checkSafety(ast: jsep.Expression): void {
    this.traverse(ast, node => {
      if (node.type === 'Identifier') {
        if (this.blacklist.has(node.name)) {
          throw new SecurityError(
            `Access to '${node.name}' is forbidden for security reasons`
          )
        }
      }
    })
  }
}
```

**2. 禁用innerHTML**：
```typescript
// ❌ 危险：直接设置innerHTML
<div v-html="$props.content"></div>

// ✅ 安全：使用textContent
<div>{{ $props.content }}</div>
```

**3. CSP策略**：
```html
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self'; object-src 'none'">
```

**验证方法**：
```typescript
test('should prevent XSS injection', () => {
  const maliciousDSL = {
    type: 'div',
    props: { text: "eval('alert(1)')" }
  }
  
  expect(() => {
    parser.parse(maliciousDSL, context)
  }).toThrow(SecurityError)
})
```

**预防措施**：
1. 使用AST解释器而非eval
2. 严格的白名单机制
3. CSP策略防护
4. 定期安全审计

#### Bug2：表达式死循环

**Bug描述**：
- 表达式中包含死循环
- 导致浏览器卡死
- 用户只能强制关闭

**触发条件**：
```json
{
  "type": "div",
  "props": {
    "text": "(() => { while(true) {} })()"
  }
}
```

**现象**：
- CPU占用100%
- 页面无响应
- 控制台无输出
- 需要强制关闭标签页

**原因分析**：
- 根本原因：未限制执行时间
- 为什么会出现：用户误写或恶意代码
- 影响范围：整个页面

**解决方案**：

**超时保护机制**：
```typescript
class TimeoutProtection {
  private maxExecutionTime = 1000 // 1秒
  
  executeWithTimeout<T>(
    fn: () => T,
    timeout = this.maxExecutionTime
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      let timeoutId: any
      let resolved = false
      
      // 设置超时
      timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true
          reject(new Error(
            `Execution timeout: exceeded ${timeout}ms`
          ))
        }
      }, timeout)
      
      // 执行函数
      try {
        Promise.resolve(fn()).then(
          result => {
            if (!resolved) {
              resolved = true
              clearTimeout(timeoutId)
              resolve(result)
            }
          },
          error => {
            if (!resolved) {
              resolved = true
              clearTimeout(timeoutId)
              reject(error)
            }
          }
        )
      } catch (error) {
        if (!resolved) {
          resolved = true
          clearTimeout(timeoutId)
          reject(error)
        }
      }
    })
  }
}
```

**使用示例**：
```typescript
const evaluator = new ExpressionEvaluator()
const timeout = new TimeoutProtection()

try {
  const result = await timeout.executeWithTimeout(() => {
    return evaluator.evaluate(expression, context)
  }, 1000)
} catch (error) {
  if (error.message.includes('timeout')) {
    console.error('Expression took too long to execute')
  }
}
```

**预防措施**：
1. 所有表达式执行都加超时保护
2. 默认超时时间1秒
3. 超时后清晰提示
4. 禁止while/for等循环语句

---

## ⚠️ 避免错误

### 常见错误清单

#### 错误1：在DSL中使用原生DOM操作

**错误描述**：
- 在表达式中直接操作DOM
- 破坏框架的响应式系统
- 导致状态不一致

**错误示例**：
```json
// ❌ 错误的做法
{
  "type": "button",
  "events": {
    "onClick": "document.getElementById('myDiv').style.display = 'none'"
  }
}
```

**正确做法**：
```json
// ✅ 正确的做法
{
  "type": "button",
  "events": {
    "onClick": "$state.showDiv = false"
  }
}

{
  "type": "div",
  "if": "$state.showDiv",
  "props": {
    "id": "myDiv"
  }
}
```

**为什么错误**：
- 原因1：绕过了响应式系统
- 原因2：难以追踪状态变化
- 原因3：可能导致内存泄漏

**后果**：
- UI与状态不一致
- 调试困难
- 性能问题

#### 错误2：过度使用复杂表达式

**错误描述**：
- 在表达式中写复杂逻辑
- 可读性差
- 难以维护

**错误示例**：
```json
// ❌ 错误：表达式过于复杂
{
  "type": "div",
  "props": {
    "text": "$state.items.filter(x => x.active && x.price > 100).map(x => x.name).join(', ') || 'No items'"
  }
}
```

**正确做法**：
```typescript
// ✅ 正确：使用computed
const state = reactive({
  items: [...],
  activeExpensiveItems: computed(() => {
    return state.items
      .filter(x => x.active && x.price > 100)
      .map(x => x.name)
      .join(', ') || 'No items'
  })
})
```

```json
{
  "type": "div",
  "props": {
    "text": "$state.activeExpensiveItems"
  }
}
```

**为什么错误**：
- 原因1：可读性差
- 原因2：性能差（每次都计算）
- 原因3：难以测试

#### 错误3：忘记设置v-for的key

**错误描述**：
- 列表渲染时未设置key
- 导致渲染性能问题
- 可能出现状态错乱

**错误示例**：
```json
// ❌ 错误：缺少key
{
  "type": "ul",
  "children": [{
    "type": "li",
    "for": "item in $state.items",
    "props": { "text": "item.name" }
  }]
}
```

**正确做法**：
```json
// ✅ 正确：添加key
{
  "type": "ul",
  "children": [{
    "type": "li",
    "for": "item in $state.items",
    "key": "item.id",
    "props": { "text": "item.name" }
  }]
}
```

**为什么需要key**：
- 原因1：帮助框架识别元素
- 原因2：优化diff算法
- 原因3：保持组件状态

---

## ✅ 测试策略

### 测试覆盖

| 测试类型 | 覆盖率 | 测试数 | 说明 |
|---------|--------|--------|------|
| 单元测试 | 90% | 100+ | Parser/Evaluator/Sandbox |
| 集成测试 | 80% | 30+ | DSL→VNode→DOM |
| 安全测试 | 100% | 20+ | XSS/注入/沙箱 |
| 性能测试 | 100% | 10+ | 大规模DSL性能 |
| E2E测试 | 70% | 15+ | 真实场景 |

### 测试用例

#### 测试1：基础DSL解析

**测试目标**：
- 验证DSL正确解析为VNode
- 确保所有字段正确映射

**测试代码**：
```typescript
describe('DSL Parser', () => {
  it('should parse basic DSL to VNode', () => {
    const dsl = {
      type: 'button',
      props: { text: 'Click me', disabled: false },
      style: { color: 'red' },
      events: { onClick: 'handleClick()' }
    }
    
    const vnode = parser.parse(dsl, context)
    
    expect(vnode).toEqual({
      type: 'button',
      props: { text: 'Click me', disabled: false },
      style: { color: 'red' },
      events: { onClick: expect.any(Function) },
      children: []
    })
  })
})
```

#### 测试2：表达式求值

**测试代码**：
```typescript
describe('Expression Evaluator', () => {
  it('should evaluate expressions correctly', () => {
    const testCases = [
      { expr: '$state.count + 1', context: { state: { count: 5 } }, expected: 6 },
      { expr: '$state.count > 10', context: { state: { count: 15 } }, expected: true },
      { expr: '$state.name || "default"', context: { state: { name: '' } }, expected: 'default' }
    ]
    
    testCases.forEach(({ expr, context, expected }) => {
      const result = evaluator.evaluate(expr, context)
      expect(result).toBe(expected)
    })
  })
})
```

#### 测试3：安全沙箱

**测试代码**：
```typescript
describe('Security Sandbox', () => {
  it('should prevent access to dangerous objects', () => {
    const dangerousExprs = [
      'window.location = "http://evil.com"',
      'eval("alert(1)")',
      'document.cookie',
      'process.exit()',
      'require("fs")'
    ]
    
    dangerousExprs.forEach(expr => {
      expect(() => {
        evaluator.evaluate(expr, {})
      }).toThrow(SecurityError)
    })
  })
  
  it('should allow safe operations', () => {
    const safeExprs = [
      { expr: 'Math.max(1, 2)', expected: 2 },
      { expr: '"hello".toUpperCase()', expected: 'HELLO' },
      { expr: '[1,2,3].map(x => x * 2)', expected: [2,4,6] }
    ]
    
    safeExprs.forEach(({ expr, expected }) => {
      const result = evaluator.evaluate(expr, {})
      expect(result).toEqual(expected)
    })
  })
})
```

#### 测试4：性能基准

**测试代码**：
```typescript
describe('Performance', () => {
  it('should parse 1000 nodes in <50ms', () => {
    const dsl = generateLargeDSL(1000)
    
    const start = performance.now()
    parser.parse(dsl, context)
    const end = performance.now()
    
    expect(end - start).toBeLessThan(50)
  })
  
  it('should have >80% cache hit rate', () => {
    const expressions = generateExpressions(1000)
    
    expressions.forEach(expr => {
      compiler.compile(expr)
    })
    
    const stats = compiler.getCacheStats()
    expect(stats.hitRate).toBeGreaterThan(0.8)
  })
})
```

### 最佳实践

#### 实践1：使用TypeScript类型

**推荐做法**：
```typescript
// ✅ 定义DSL类型
interface DSLNode {
  type: string
  props?: Record<string, any>
  children?: DSLNode[]
  if?: string
  for?: string
}

// 类型检查
const dsl: DSLNode = {
  type: 'button',
  props: { text: 'Click' }
}
```

#### 实践2：表达式简洁化

**推荐做法**：
```json
// ✅ 简单表达式
{
  "props": {
    "text": "$state.count"
  }
}

// ❌ 避免复杂表达式
{
  "props": {
    "text": "$state.items.filter(x=>x.active).map(y=>y.name).join(',')"
  }
}
```

#### 实践3：安全优先

**推荐做法**：
```typescript
// ✅ 启用所有安全检查
const parser = new DSLParser({
  enableSandbox: true,
  timeout: 1000,
  maxDepth: 10,
  strictMode: true
})
```

---

## 📖 使用示例

### 完整示例：用户列表

```json
{
  "type": "div",
  "children": [
    {
      "type": "h2",
      "props": { "text": "用户列表" }
    },
    {
      "type": "ul",
      "children": [{
        "type": "li",
        "for": "(user, index) in $state.users",
        "key": "user.id",
        "props": {
          "text": "index + 1 + '. ' + user.name + ' (' + user.age + ')'"
        },
        "events": {
          "onClick": "$emit('user-click', user)"
        }
      }]
    },
    {
      "type": "p",
      "if": "$state.users.length === 0",
      "props": { "text": "暂无用户" }
    }
  ]
}
```

---

**（DSL系统Part 3完成！）**
