/**
 * DSL类型定义
 */

// DSL节点类型
export type DSLNodeType = 
  | 'component'
  | 'text'
  | 'fragment'

// 基础DSL节点
export interface DSLNode {
  type: DSLNodeType
  id?: string
  key?: string
}

// 组件节点
export interface ComponentNode extends DSLNode {
  type: 'component'
  component: string
  props?: Record<string, any>
  children?: DSLNode[]
  slots?: Record<string, DSLNode[]>
  events?: Record<string, string>
  directives?: Directive[]
  ref?: string
}

// 文本节点
export interface TextNode extends DSLNode {
  type: 'text'
  content: string
}

// Fragment节点
export interface FragmentNode extends DSLNode {
  type: 'fragment'
  children: DSLNode[]
}

// 指令
export interface Directive {
  name: string
  value?: any
  arg?: string
  modifiers?: string[]
}

// DSL配置
export interface DSLConfig {
  version?: string
  root: DSLNode
  metadata?: {
    title?: string
    description?: string
    author?: string
    created?: string
    updated?: string
  }
}

// 解析选项
export interface ParseOptions {
  strict?: boolean
  validate?: boolean
  transforms?: Transform[]
}

// 转换器
export type Transform = (node: DSLNode) => DSLNode | null

// 验证结果
export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

// 验证错误
export interface ValidationError {
  message: string
  path: string
  node?: DSLNode
}

// 验证警告
export interface ValidationWarning {
  message: string
  path: string
  node?: DSLNode
}

// Schema定义
export interface Schema {
  type: string
  required?: boolean
  properties?: Record<string, Schema>
  items?: Schema
  enum?: any[]
  pattern?: string
  minLength?: number
  maxLength?: number
  minimum?: number
  maximum?: number
}
