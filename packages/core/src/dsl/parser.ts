/**
 * DSL解析器
 * 将JSON配置解析为DSL节点树
 */

import type {
  DSLNode,
  DSLConfig,
  ParseOptions,
  ComponentNode,
  TextNode,
  FragmentNode,
} from './types'

/**
 * 解析DSL配置
 */
export function parse(config: any, options: ParseOptions = {}): DSLConfig {
  const { strict = true, validate = true } = options

  if (!config) {
    throw new Error('DSL config is required')
  }

  // 验证配置格式
  if (validate) {
    validateConfig(config, strict)
  }

  // 解析根节点
  const root = parseNode(config.root || config, options)

  return {
    version: config.version || '1.0.0',
    root,
    metadata: config.metadata,
  }
}

/**
 * 解析单个节点
 */
export function parseNode(node: any, options: ParseOptions = {}): DSLNode {
  if (!node) {
    throw new Error('Node is required')
  }

  // 字符串节点 -> 文本节点
  if (typeof node === 'string') {
    return createTextNode(node)
  }

  // 数组节点 -> Fragment
  if (Array.isArray(node)) {
    return createFragmentNode(node, options)
  }

  // 对象节点
  if (typeof node === 'object') {
    const type = node.type || 'component'

    switch (type) {
      case 'text':
        return createTextNode(node.content)

      case 'fragment':
        return createFragmentNode(node.children || [], options)

      case 'component':
        return createComponentNode(node, options)

      default:
        throw new Error(`Unknown node type: ${type}`)
    }
  }

  throw new Error(`Invalid node: ${JSON.stringify(node)}`)
}

/**
 * 创建文本节点
 */
function createTextNode(content: string): TextNode {
  return {
    type: 'text',
    content: String(content),
  }
}

/**
 * 创建Fragment节点
 */
function createFragmentNode(
  children: any[],
  options: ParseOptions
): FragmentNode {
  return {
    type: 'fragment',
    children: children.map((child) => parseNode(child, options)),
  }
}

/**
 * 创建组件节点
 */
function createComponentNode(
  node: any,
  options: ParseOptions
): ComponentNode {
  const componentNode: ComponentNode = {
    type: 'component',
    component: node.component || node.tag || 'div',
  }

  // ID
  if (node.id) {
    componentNode.id = node.id
  }

  // Key
  if (node.key) {
    componentNode.key = node.key
  }

  // Props
  if (node.props) {
    componentNode.props = { ...node.props }
  }

  // Children
  if (node.children) {
    if (Array.isArray(node.children)) {
      componentNode.children = node.children.map((child: any) =>
        parseNode(child, options)
      )
    } else {
      componentNode.children = [parseNode(node.children, options)]
    }
  }

  // Slots
  if (node.slots) {
    componentNode.slots = {}
    for (const [name, content] of Object.entries(node.slots)) {
      componentNode.slots[name] = Array.isArray(content)
        ? content.map((child: any) => parseNode(child, options))
        : [parseNode(content, options)]
    }
  }

  // Events
  if (node.events || node.on) {
    componentNode.events = node.events || node.on
  }

  // Directives
  if (node.directives) {
    componentNode.directives = node.directives
  }

  // Ref
  if (node.ref) {
    componentNode.ref = node.ref
  }

  return componentNode
}

/**
 * 验证配置
 */
function validateConfig(config: any, strict: boolean): void {
  if (typeof config !== 'object') {
    throw new Error('Config must be an object')
  }

  if (!config.root && !config.component && !config.type) {
    if (strict) {
      throw new Error('Config must have a root node')
    }
  }
}

/**
 * 序列化DSL节点为JSON
 */
export function stringify(node: DSLNode, pretty = false): string {
  return JSON.stringify(node, null, pretty ? 2 : 0)
}

/**
 * 克隆DSL节点
 */
export function cloneNode(node: DSLNode): DSLNode {
  return JSON.parse(JSON.stringify(node))
}

/**
 * 遍历DSL树
 */
export function traverse(
  node: DSLNode,
  visitor: (node: DSLNode, parent?: DSLNode) => void,
  parent?: DSLNode
): void {
  visitor(node, parent)

  if (node.type === 'component' && (node as ComponentNode).children) {
    ;(node as ComponentNode).children!.forEach((child: DSLNode) => traverse(child, visitor, node))
  }

  if (node.type === 'fragment' && (node as FragmentNode).children) {
    ;(node as FragmentNode).children.forEach((child: DSLNode) => traverse(child, visitor, node))
  }
}

/**
 * 查找节点
 */
export function findNode(
  root: DSLNode,
  predicate: (node: DSLNode) => boolean
): DSLNode | null {
  let result: DSLNode | null = null

  traverse(root, (node) => {
    if (!result && predicate(node)) {
      result = node
    }
  })

  return result
}

/**
 * 查找所有匹配节点
 */
export function findAllNodes(
  root: DSLNode,
  predicate: (node: DSLNode) => boolean
): DSLNode[] {
  const results: DSLNode[] = []

  traverse(root, (node) => {
    if (predicate(node)) {
      results.push(node)
    }
  })

  return results
}
