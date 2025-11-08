/**
 * CSS Variables生成器
 */

import type { Tokens, CSSVariables, TokenGeneratorOptions } from './types'
import tokensData from './tokens.json'

/**
 * 将Token对象扁平化为CSS变量格式
 */
function flattenTokens(
  obj: Record<string, any>,
  prefix = '',
  result: CSSVariables = {}
): CSSVariables {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}-${key}` : key

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      flattenTokens(value, newKey, result)
    } else {
      result[newKey] = value
    }
  }

  return result
}

/**
 * 生成CSS Variables
 */
export function generateCSSVariables(
  tokens: Tokens = tokensData as Tokens,
  options: TokenGeneratorOptions = {}
): CSSVariables {
  const { prefix = 'vjs' } = options
  const flattened = flattenTokens(tokens)
  const cssVars: CSSVariables = {}

  for (const [key, value] of Object.entries(flattened)) {
    cssVars[`--${prefix}-${key}`] = value
  }

  return cssVars
}

/**
 * 生成CSS字符串
 */
export function generateCSSString(
  tokens: Tokens = tokensData as Tokens,
  options: TokenGeneratorOptions = {}
): string {
  const { scope = 'global' } = options
  const cssVars = generateCSSVariables(tokens, options)

  const declarations = Object.entries(cssVars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')

  const selector = scope === 'global' ? ':root' : '.vjs-ui'

  return `${selector} {\n${declarations}\n}`
}

/**
 * 注入CSS Variables到DOM
 */
export function injectCSSVariables(
  tokens: Tokens = tokensData as Tokens,
  options: TokenGeneratorOptions = {}
): void {
  if (typeof document === 'undefined') {
    console.warn('injectCSSVariables can only be called in browser environment')
    return
  }

  const cssString = generateCSSString(tokens, options)
  const styleId = 'vjs-ui-tokens'

  // 移除旧的style标签
  const oldStyle = document.getElementById(styleId)
  if (oldStyle) {
    oldStyle.remove()
  }

  // 创建新的style标签
  const style = document.createElement('style')
  style.id = styleId
  style.textContent = cssString
  document.head.appendChild(style)
}

/**
 * 获取CSS变量值
 */
export function getCSSVariable(name: string, prefix = 'vjs'): string {
  if (typeof document === 'undefined') {
    return ''
  }

  const varName = name.startsWith('--') ? name : `--${prefix}-${name}`
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
}

/**
 * 设置CSS变量值
 */
export function setCSSVariable(
  name: string,
  value: string | number,
  prefix = 'vjs'
): void {
  if (typeof document === 'undefined') {
    return
  }

  const varName = name.startsWith('--') ? name : `--${prefix}-${name}`
  document.documentElement.style.setProperty(varName, String(value))
}
