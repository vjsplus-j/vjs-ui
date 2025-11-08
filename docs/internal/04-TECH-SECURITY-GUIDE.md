# VJS-UI 安全沙箱分阶段实施手册

> **目标**: 建立可执行、可验证的安全防护体系  
> **策略**: 阶段化解锁，每阶段可交付、可测试  
> **原则**: 先关闭攻击面，再逐步开放能力  

---

## 一、安全分层架构

```
┌──────────────────────────────────────────┐
│  阶段A: MVP（禁用表达式）               │  攻击面 = 0
├──────────────────────────────────────────┤
│  阶段B: 受限表达式（白名单AST）         │  攻击面 < 5%
├──────────────────────────────────────────┤
│  阶段C: 完整沙箱（资源限制+隔离）       │  攻击面 < 1%
└──────────────────────────────────────────┘
```

---

## 二、阶段A：MVP（禁用表达式）

### 时间：Week 1-2
### 交付物：静态DSL解析器 + 验证器

### 2.1 实现代码

```typescript
/**
 * 表达式检测器（MVP阶段）
 */
class ExpressionValidator {
  // 表达式特征模式
  private EXPRESSION_PATTERNS = [
    /\$state\./,      // $state.xxx
    /\$props\./,      // $props.xxx
    /\$context\./,    // $context.xxx
    /\{[^}]+\}/,      // {token.xxx}
    /\(\s*\)/,        // 函数调用
    /=>/              // 箭头函数
  ]
  
  /**
   * 验证DSL节点（递归）
   */
  validate(node: DSLNode): ValidationResult {
    const errors: string[] = []
    
    // 检查props
    if (node.props) {
      this.checkObject(node.props, 'props', errors)
    }
    
    // 检查style
    if (node.style) {
      this.checkObject(node.style, 'style', errors)
    }
    
    // 检查events
    if (node.events) {
      errors.push(`Events are disabled in MVP mode at node: ${node.type}`)
    }
    
    // 检查条件/循环
    if (node.if || node.for) {
      errors.push(`Conditional/loop rendering disabled in MVP at node: ${node.type}`)
    }
    
    // 递归检查子节点
    if (node.children) {
      node.children.forEach(child => {
        const childResult = this.validate(child)
        errors.push(...childResult.errors)
      })
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
  
  /**
   * 检查对象中的值
   */
  private checkObject(obj: Record<string, any>, path: string, errors: string[]): void {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        // 检查是否包含表达式
        if (this.hasExpression(value)) {
          errors.push(
            `Expression detected in ${path}.${key}: "${value}". ` +
            `Dynamic expressions are disabled in MVP mode.`
          )
        }
      } else if (typeof value === 'object' && value !== null) {
        // 递归检查嵌套对象
        this.checkObject(value, `${path}.${key}`, errors)
      }
    }
  }
  
  /**
   * 检测字符串是否包含表达式
   */
  private hasExpression(str: string): boolean {
    return this.EXPRESSION_PATTERNS.some(pattern => pattern.test(str))
  }
}

/**
 * 在Parser中集成验证
 */
class DSLParser {
  private validator = new ExpressionValidator()
  
  parse(dsl: DSLNode): VNode {
    // MVP阶段：强制验证
    const result = this.validator.validate(dsl)
    
    if (!result.valid) {
      throw new SecurityError(
        'DSL validation failed:\n' + result.errors.join('\n')
      )
    }
    
    // 解析静态DSL
    return this.parseStatic(dsl)
  }
}
```

### 2.2 测试用例（20个）

```typescript
describe('MVP Security - Expression Blocking', () => {
  const validator = new ExpressionValidator()
  
  it('允许静态字符串', () => {
    const dsl = {
      type: 'Button',
      props: { text: 'Click Me', disabled: false }
    }
    expect(validator.validate(dsl).valid).toBe(true)
  })
  
  it('阻止$state表达式', () => {
    const dsl = {
      type: 'Button',
      props: { text: '$state.label' }
    }
    const result = validator.validate(dsl)
    expect(result.valid).toBe(false)
    expect(result.errors[0]).toContain('$state')
  })
  
  it('阻止Token引用', () => {
    const dsl = {
      type: 'Button',
      style: { color: '{color.primary}' }
    }
    expect(validator.validate(dsl).valid).toBe(false)
  })
  
  it('阻止条件渲染', () => {
    const dsl = {
      type: 'Button',
      if: '$state.show'
    }
    expect(validator.validate(dsl).valid).toBe(false)
  })
  
  it('阻止事件绑定', () => {
    const dsl = {
      type: 'Button',
      events: { onClick: 'handleClick' }
    }
    expect(validator.validate(dsl).valid).toBe(false)
  })
})
```

### 2.3 CI集成

```yaml
# .github/workflows/security-check.yml
name: Security Check

on: [push, pull_request]

jobs:
  mvp-security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run MVP Security Tests
        run: npm run test:security:mvp
      - name: Block if failed
        if: failure()
        run: exit 1
```

---

## 三、阶段B：受限表达式（白名单AST）

### 时间：Week 3-6
### 交付物：安全表达式引擎 + 100+测试用例

### 3.1 白名单AST Walker

```typescript
/**
 * 安全表达式求值器
 */
class SafeEvaluator {
  // 允许的AST节点类型（白名单）
  private ALLOWED_NODES = new Set([
    'Literal',             // 字面量: 1, 'string', true
    'Identifier',          // 标识符: count, name
    'MemberExpression',    // 成员访问: obj.prop, arr[0]
    'BinaryExpression',    // 二元运算: +, -, *, /, >, <, ==
    'LogicalExpression',   // 逻辑运算: &&, ||
    'UnaryExpression',     // 一元运算: !, -, +
    'ConditionalExpression', // 三元: a ? b : c
    'ArrayExpression',     // 数组: [1, 2, 3]
    'ObjectExpression'     // 对象: {a: 1}
  ])
  
  // 禁止的节点类型（黑名单，用于双重验证）
  private FORBIDDEN_NODES = new Set([
    'CallExpression',      // 函数调用
    'NewExpression',       // new 构造
    'AssignmentExpression', // 赋值
    'UpdateExpression',    // ++ / --
    'FunctionExpression',  // function(){}
    'ArrowFunctionExpression', // () => {}
    'ThisExpression',      // this
    'Super'                // super
  ])
  
  /**
   * 编译表达式
   */
  compile(expression: string): CompiledExpression {
    // 1. 解析为AST
    const ast = jsep(expression)
    
    // 2. 验证AST安全性
    this.validateAST(ast)
    
    // 3. 编译为执行函数
    return this.compileAST(ast)
  }
  
  /**
   * 验证AST（递归）
   */
  private validateAST(node: Expression): void {
    // 黑名单检查
    if (this.FORBIDDEN_NODES.has(node.type)) {
      throw new SecurityError(
        `Forbidden expression node: ${node.type}. ` +
        `Only simple expressions are allowed.`
      )
    }
    
    // 白名单检查
    if (!this.ALLOWED_NODES.has(node.type)) {
      throw new SecurityError(
        `Unknown expression node: ${node.type}`
      )
    }
    
    // 递归验证子节点
    this.visitChildren(node, child => this.validateAST(child))
  }
  
  /**
   * 编译AST为执行函数
   */
  private compileAST(ast: Expression): CompiledExpression {
    return (context: RuntimeContext) => {
      let stepCount = 0
      const MAX_STEPS = 5000
      
      const walk = (node: Expression): any => {
        // 防止无限循环
        if (++stepCount > MAX_STEPS) {
          throw new SecurityError('Expression too complex')
        }
        
        switch (node.type) {
          case 'Literal':
            return node.value
            
          case 'Identifier':
            return this.resolveIdentifier(node.name, context)
            
          case 'MemberExpression': {
            const obj = walk(node.object)
            const prop = node.computed 
              ? walk(node.property) 
              : node.property.name
            
            // 防止原型污染
            if (prop === '__proto__' || prop === 'constructor' || prop === 'prototype') {
              throw new SecurityError('Access to prototype chain is forbidden')
            }
            
            return obj?.[prop]
          }
          
          case 'BinaryExpression':
            return this.evalBinary(
              node.operator,
              walk(node.left),
              walk(node.right)
            )
            
          case 'LogicalExpression': {
            const left = walk(node.left)
            if (node.operator === '&&') {
              return left && walk(node.right)
            } else {
              return left || walk(node.right)
            }
          }
          
          case 'UnaryExpression': {
            const arg = walk(node.argument)
            switch (node.operator) {
              case '!': return !arg
              case '-': return -arg
              case '+': return +arg
              default: throw new SecurityError(`Unsupported operator: ${node.operator}`)
            }
          }
          
          case 'ConditionalExpression':
            return walk(node.test) 
              ? walk(node.consequent) 
              : walk(node.alternate)
            
          case 'ArrayExpression':
            return node.elements.map(walk)
            
          case 'ObjectExpression': {
            const obj: any = {}
            node.properties.forEach(prop => {
              const key = prop.key.name || walk(prop.key)
              obj[key] = walk(prop.value)
            })
            return obj
          }
          
          default:
            throw new SecurityError(`Unhandled node type: ${node.type}`)
        }
      }
      
      return walk(ast)
    }
  }
  
  /**
   * 解析标识符（仅限白名单变量）
   */
  private resolveIdentifier(name: string, context: RuntimeContext): any {
    // 只允许访问安全上下文
    const ALLOWED_VARS = ['$state', '$props', '$context', 'tokens']
    
    if (!ALLOWED_VARS.includes(name)) {
      throw new SecurityError(`Unknown identifier: ${name}`)
    }
    
    return context[name]
  }
  
  /**
   * 二元运算
   */
  private evalBinary(op: string, left: any, right: any): any {
    switch (op) {
      case '+': return left + right
      case '-': return left - right
      case '*': return left * right
      case '/': return left / right
      case '%': return left % right
      case '==': return left == right
      case '===': return left === right
      case '!=': return left != right
      case '!==': return left !== right
      case '<': return left < right
      case '<=': return left <= right
      case '>': return left > right
      case '>=': return left >= right
      default:
        throw new SecurityError(`Unsupported operator: ${op}`)
    }
  }
}

class SecurityError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SecurityError'
  }
}
```

### 3.2 安全测试矩阵（100+用例）

```typescript
describe('Safe Evaluator Security Tests', () => {
  const evaluator = new SafeEvaluator()
  const context = {
    $state: { count: 10, name: 'test' },
    $props: { label: 'Button' },
    tokens: { color: '#ff0000' }
  }
  
  describe('允许的表达式', () => {
    it('算术运算', () => {
      expect(evaluator.compile('1 + 2')(context)).toBe(3)
      expect(evaluator.compile('$state.count * 2')(context)).toBe(20)
    })
    
    it('逻辑运算', () => {
      expect(evaluator.compile('$state.count > 5')(context)).toBe(true)
      expect(evaluator.compile('true && false')(context)).toBe(false)
    })
    
    it('成员访问', () => {
      expect(evaluator.compile('$state.name')(context)).toBe('test')
      expect(evaluator.compile('$props.label')(context)).toBe('Button')
    })
    
    it('三元表达式', () => {
      expect(evaluator.compile('$state.count > 5 ? "yes" : "no"')(context)).toBe('yes')
    })
  })
  
  describe('禁止的表达式（应抛出SecurityError）', () => {
    it('函数调用', () => {
      expect(() => evaluator.compile('alert(1)')).toThrow(SecurityError)
      expect(() => evaluator.compile('console.log("x")')).toThrow(SecurityError)
    })
    
    it('构造函数', () => {
      expect(() => evaluator.compile('new Date()')).toThrow(SecurityError)
      expect(() => evaluator.compile('new Array(1000)')).toThrow(SecurityError)
    })
    
    it('赋值操作', () => {
      expect(() => evaluator.compile('$state.count = 100')).toThrow(SecurityError)
    })
    
    it('原型链访问', () => {
      expect(() => {
        evaluator.compile('$state.__proto__')(context)
      }).toThrow('prototype chain')
      
      expect(() => {
        evaluator.compile('$state.constructor')(context)
      }).toThrow('prototype chain')
    })
    
    it('this关键字', () => {
      expect(() => evaluator.compile('this.window')).toThrow(SecurityError)
    })
    
    it('eval/Function', () => {
      expect(() => evaluator.compile('eval("alert(1)")')).toThrow(SecurityError)
    })
  })
  
  describe('DoS防护', () => {
    it('复杂度限制', () => {
      // 生成超长表达式
      const longExpr = '1' + ' + 1'.repeat(10000)
      expect(() => {
        const fn = evaluator.compile(longExpr)
        fn(context)
      }).toThrow('too complex')
    })
  })
})
```

---

## 四、阶段C：完整沙箱（生产就绪）

### 时间：Week 7-12
### 交付物：Worker隔离 + 资源监控 + 审计日志

### 4.1 Worker沙箱

```typescript
/**
 * Worker沙箱执行器
 */
class WorkerSandbox {
  private worker: Worker | null = null
  private taskId = 0
  private pendingTasks = new Map<number, PendingTask>()
  
  constructor() {
    this.initWorker()
  }
  
  /**
   * 在Worker中执行表达式
   */
  async evaluate(expression: string, context: any, timeout = 1000): Promise<any> {
    const id = ++this.taskId
    
    return new Promise((resolve, reject) => {
      // 超时保护
      const timer = setTimeout(() => {
        this.pendingTasks.delete(id)
        reject(new Error('Expression execution timeout'))
      }, timeout)
      
      // 记录待处理任务
      this.pendingTasks.set(id, { resolve, reject, timer })
      
      // 发送到Worker
      this.worker!.postMessage({
        id,
        type: 'evaluate',
        expression,
        context
      })
    })
  }
  
  private initWorker(): void {
    // 创建Worker（内联代码）
    const workerCode = `
      ${SafeEvaluator.toString()}
      
      const evaluator = new SafeEvaluator()
      
      self.onmessage = (e) => {
        const { id, expression, context } = e.data
        
        try {
          const fn = evaluator.compile(expression)
          const result = fn(context)
          
          self.postMessage({ id, success: true, result })
        } catch (error) {
          self.postMessage({ 
            id, 
            success: false, 
            error: error.message 
          })
        }
      }
    `
    
    const blob = new Blob([workerCode], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)
    
    this.worker = new Worker(url)
    this.worker.onmessage = this.handleMessage.bind(this)
    
    URL.revokeObjectURL(url)
  }
  
  private handleMessage(e: MessageEvent): void {
    const { id, success, result, error } = e.data
    const task = this.pendingTasks.get(id)
    
    if (task) {
      clearTimeout(task.timer)
      this.pendingTasks.delete(id)
      
      if (success) {
        task.resolve(result)
      } else {
        task.reject(new Error(error))
      }
    }
  }
  
  /**
   * 销毁Worker
   */
  destroy(): void {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
    this.pendingTasks.clear()
  }
}
```

### 4.2 资源监控

```typescript
/**
 * 资源监控器
 */
class ResourceMonitor {
  private memoryUsage = 0
  private expressionCount = 0
  private errorCount = 0
  
  /**
   * 记录表达式执行
   */
  track(expression: string, duration: number, success: boolean): void {
    this.expressionCount++
    
    if (!success) {
      this.errorCount++
    }
    
    // 超时告警
    if (duration > 100) {
      console.warn(`[Security] Slow expression: ${expression} (${duration}ms)`)
    }
    
    // 错误率告警
    if (this.errorCount / this.expressionCount > 0.1) {
      console.error('[Security] High error rate detected')
    }
  }
  
  /**
   * 获取统计
   */
  getStats(): SecurityStats {
    return {
      totalExpressions: this.expressionCount,
      errorRate: this.errorCount / this.expressionCount,
      memoryUsage: this.memoryUsage
    }
  }
}
```

---

## 五、安全配置开关

```typescript
/**
 * 安全配置
 */
interface SecurityConfig {
  // 表达式模式
  expressionMode: 'disabled' | 'restricted' | 'full'
  
  // 资源限制
  maxSteps: number
  timeout: number
  
  // Worker隔离
  useWorker: boolean
  
  // 审计日志
  enableAudit: boolean
}

const SECURITY_CONFIGS = {
  mvp: {
    expressionMode: 'disabled',
    maxSteps: 0,
    timeout: 0,
    useWorker: false,
    enableAudit: false
  },
  
  beta: {
    expressionMode: 'restricted',
    maxSteps: 5000,
    timeout: 100,
    useWorker: false,
    enableAudit: true
  },
  
  production: {
    expressionMode: 'full',
    maxSteps: 10000,
    timeout: 1000,
    useWorker: true,
    enableAudit: true
  }
}
```

---

## 六、实施时间表

| 阶段 | 周期 | 交付物 | 安全等级 |
|------|------|--------|----------|
| A-MVP | Week 1-2 | 禁用表达式 | 100% |
| B-Beta | Week 3-6 | 白名单AST | 95% |
| C-Prod | Week 7-12 | Worker+监控 | 99% |

---

## 七、验收标准

### MVP验收
- [ ] 所有表达式被阻止
- [ ] 20个测试用例全通过
- [ ] CI自动检查

### Beta验收
- [ ] 100+安全测试通过
- [ ] 原型污染防护测试
- [ ] DoS防护测试
- [ ] 第三方安全审计（可选）

### Production验收
- [ ] Worker隔离正常
- [ ] 资源监控就绪
- [ ] 审计日志完整
- [ ] 压力测试通过

---

**最后更新**: 2025-01-08  
**状态**: ✅ 可执行方案
