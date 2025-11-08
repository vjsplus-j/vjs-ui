/**
 * Design Token类型定义
 */

export interface ColorScale {
  50: string
  100?: string
  200?: string
  300?: string
  400?: string
  500: string
  600?: string
  700?: string
  800?: string
  900: string
}

export interface Tokens {
  colors: {
    primary: ColorScale
    success: ColorScale
    warning: ColorScale
    error: ColorScale
    info: ColorScale
    neutral: ColorScale
  }
  spacing: Record<string, string>
  fontSize: Record<string, string>
  fontWeight: Record<string, string>
  lineHeight: Record<string, string>
  borderRadius: Record<string, string>
  borderWidth: Record<string, string>
  boxShadow: Record<string, string>
  zIndex: Record<string, string | number>
  transition: Record<string, string>
}

export interface CSSVariables {
  [key: string]: string | number
}

export interface TokenGeneratorOptions {
  prefix?: string
  scope?: 'global' | 'component'
}
