/**
 * 共享常量
 */

// 组件类型
export const COMPONENT_TYPES = {
  BUTTON: 'Button',
  INPUT: 'Input',
  CARD: 'Card',
} as const

// 事件类型
export const EVENT_TYPES = {
  CLICK: 'click',
  CHANGE: 'change',
  INPUT: 'input',
} as const

// 优先级
export const PRIORITY = {
  IMMEDIATE: 0,
  HIGH: 1,
  NORMAL: 2,
  LOW: 3,
  IDLE: 4,
} as const
