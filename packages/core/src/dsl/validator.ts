/**
 * DSL配置验证器
 */

import type {
  DSLNode,
  DSLConfig,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ComponentNode,
  Schema,
} from './types'

/**
 * 验证DSL配置
 */
export function validate(config: DSLConfig): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  // 验证版本
  if (!config.version) {
    warnings.push({
      message: 'Missing version field',
      path: 'config.version',
    })
  }

  // 验证根节点
  if (!config.root) {
    errors.push({
      message: 'Root node is required',
      path: 'config.root',
    })
    return { valid: false, errors, warnings }
  }

  // 验证节点树
  validateNode(config.root, 'root', errors, warnings)

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * 验证单个节点
 */
function validateNode(
  node: DSLNode,
  path: string,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  // 验证type字段
  if (!node.type) {
    errors.push({
      message: 'Node type is required',
      path,
      node,
    })
    return
  }

  // 验证type值
  const validTypes = ['component', 'text', 'fragment']
  if (!validTypes.includes(node.type)) {
    errors.push({
      message: `Invalid node type: ${node.type}`,
      path: `${path}.type`,
      node,
    })
    return
  }

  // 验证组件节点
  if (node.type === 'component') {
    validateComponentNode(node as ComponentNode, path, errors, warnings)
  }

  // 验证文本节点
  if (node.type === 'text') {
    const textNode = node as any
    if (!textNode.content && textNode.content !== '') {
      errors.push({
        message: 'Text node must have content',
        path: `${path}.content`,
        node,
      })
    }
  }

  // 验证Fragment节点
  if (node.type === 'fragment') {
    const fragmentNode = node as any
    if (!Array.isArray(fragmentNode.children)) {
      errors.push({
        message: 'Fragment node must have children array',
        path: `${path}.children`,
        node,
      })
    } else {
      fragmentNode.children.forEach((child: DSLNode, index: number) => {
        validateNode(child, `${path}.children[${index}]`, errors, warnings)
      })
    }
  }
}

/**
 * 验证组件节点
 */
function validateComponentNode(
  node: ComponentNode,
  path: string,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  // 验证component名称
  if (!node.component) {
    errors.push({
      message: 'Component name is required',
      path: `${path}.component`,
      node,
    })
    return
  }

  // 验证component名称格式
  if (typeof node.component !== 'string') {
    errors.push({
      message: 'Component name must be a string',
      path: `${path}.component`,
      node,
    })
  }

  // 验证props
  if (node.props && typeof node.props !== 'object') {
    errors.push({
      message: 'Props must be an object',
      path: `${path}.props`,
      node,
    })
  }

  // 验证children
  if (node.children) {
    if (!Array.isArray(node.children)) {
      errors.push({
        message: 'Children must be an array',
        path: `${path}.children`,
        node,
      })
    } else {
      node.children.forEach((child, index) => {
        validateNode(child, `${path}.children[${index}]`, errors, warnings)
      })
    }
  }

  // 验证slots
  if (node.slots) {
    if (typeof node.slots !== 'object') {
      errors.push({
        message: 'Slots must be an object',
        path: `${path}.slots`,
        node,
      })
    } else {
      Object.entries(node.slots).forEach(([name, content]) => {
        if (!Array.isArray(content)) {
          errors.push({
            message: `Slot "${name}" must be an array`,
            path: `${path}.slots.${name}`,
            node,
          })
        } else {
          content.forEach((child, index) => {
            validateNode(
              child,
              `${path}.slots.${name}[${index}]`,
              errors,
              warnings
            )
          })
        }
      })
    }
  }

  // 验证events
  if (node.events && typeof node.events !== 'object') {
    errors.push({
      message: 'Events must be an object',
      path: `${path}.events`,
      node,
    })
  }

  // 验证key
  if (node.key !== undefined && typeof node.key !== 'string') {
    warnings.push({
      message: 'Key should be a string',
      path: `${path}.key`,
      node,
    })
  }
}

/**
 * 验证Schema
 */
export function validateSchema(value: any, schema: Schema, path = 'value'): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  validateValue(value, schema, path, errors, warnings)

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * 验证值
 */
function validateValue(
  value: any,
  schema: Schema,
  path: string,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  // 必填验证
  if (schema.required && (value === undefined || value === null)) {
    errors.push({
      message: `${path} is required`,
      path,
    })
    return
  }

  // 跳过undefined/null
  if (value === undefined || value === null) {
    return
  }

  // 类型验证
  const actualType = Array.isArray(value) ? 'array' : typeof value
  if (schema.type && actualType !== schema.type) {
    errors.push({
      message: `${path} must be ${schema.type}, got ${actualType}`,
      path,
    })
    return
  }

  // 枚举验证
  if (schema.enum && !schema.enum.includes(value)) {
    errors.push({
      message: `${path} must be one of: ${schema.enum.join(', ')}`,
      path,
    })
  }

  // 字符串验证
  if (schema.type === 'string') {
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
      errors.push({
        message: `${path} does not match pattern: ${schema.pattern}`,
        path,
      })
    }

    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push({
        message: `${path} must be at least ${schema.minLength} characters`,
        path,
      })
    }

    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      errors.push({
        message: `${path} must be at most ${schema.maxLength} characters`,
        path,
      })
    }
  }

  // 数字验证
  if (schema.type === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) {
      errors.push({
        message: `${path} must be at least ${schema.minimum}`,
        path,
      })
    }

    if (schema.maximum !== undefined && value > schema.maximum) {
      errors.push({
        message: `${path} must be at most ${schema.maximum}`,
        path,
      })
    }
  }

  // 对象验证
  if (schema.type === 'object' && schema.properties) {
    for (const [key, propSchema] of Object.entries(schema.properties)) {
      validateValue(
        value[key],
        propSchema,
        `${path}.${key}`,
        errors,
        warnings
      )
    }
  }

  // 数组验证
  if (schema.type === 'array' && schema.items) {
    value.forEach((item: any, index: number) => {
      validateValue(item, schema.items!, `${path}[${index}]`, errors, warnings)
    })
  }
}

/**
 * 快速验证：仅返回boolean
 */
export function isValid(config: DSLConfig): boolean {
  return validate(config).valid
}
