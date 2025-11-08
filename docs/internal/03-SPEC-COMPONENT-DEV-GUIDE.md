# VJS-UI 组件开发指南

> 本指南帮助开发者创建符合VJS-UI规范的组件

---

## 一、组件开发流程

### 1.1 创建组件骨架

```bash
# 使用CLI创建组件（未来支持）
vjs create component MyComponent

# 或手动创建目录结构
mkdir -p packages/vue/src/components/MyComponent
cd packages/vue/src/components/MyComponent
touch MyComponent.vue MyComponent.dsl.ts types.ts index.ts
```

### 1.2 目录结构

```
MyComponent/
├── MyComponent.vue       # Vue组件实现
├── MyComponent.dsl.ts    # DSL定义
├── MyComponent.styles.ts # 样式定义（可选）
├── types.ts              # TypeScript类型
├── index.ts              # 导出入口
└── __tests__/            # 测试文件
    └── MyComponent.test.ts
```

---

## 二、编写组件

### 2.1 定义TypeScript类型

```typescript
// types.ts

/**
 * MyComponent Props定义
 */
export interface MyComponentProps {
  /**
   * 组件标题
   */
  title?: string
  
  /**
   * 是否显示
   * @default true
   */
  visible?: boolean
  
  /**
   * 尺寸
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large'
}

/**
 * MyComponent Emits定义
 */
export interface MyComponentEmits {
  /**
   * 关闭事件
   */
  (e: 'close'): void
  
  /**
   * 值变化事件
   */
  (e: 'change', value: string): void
}

/**
 * MyComponent Slots定义
 */
export interface MyComponentSlots {
  /**
   * 默认插槽
   */
  default?: () => any
  
  /**
   * 标题插槽
   */
  title?: () => any
}
```

### 2.2 编写DSL定义

```typescript
// MyComponent.dsl.ts

import type { DSLNode } from '@vjs-ui/core'

/**
 * MyComponent DSL定义
 * 用于DSL方式渲染组件
 */
export const MyComponentDSL: DSLNode = {
  type: 'div',
  props: {
    class: [
      'vjs-my-component',
      '$props.size ? `vjs-my-component--${$props.size}` : ""',
      '$props.visible ? "vjs-my-component--visible" : "vjs-my-component--hidden"'
    ]
  },
  style: {
    padding: '{spacing.md}',
    borderRadius: '{radius.md}',
    backgroundColor: '{color.background}'
  },
  slots: {
    default: [
      {
        type: 'div',
        props: {
          class: 'vjs-my-component__title'
        },
        slots: {
          default: '$props.title || "Default Title"'
        }
      },
      {
        type: 'div',
        props: {
          class: 'vjs-my-component__content'
        },
        slots: {
          default: '$slots.default'
        }
      }
    ]
  }
}
```

### 2.3 编写Vue组件

```vue
<!-- MyComponent.vue -->
<template>
  <div
    v-if="visible"
    :class="componentClass"
    :style="componentStyle"
  >
    <div class="vjs-my-component__title">
      <slot name="title">{{ title }}</slot>
    </div>
    
    <div class="vjs-my-component__content">
      <slot />
    </div>
    
    <div v-if="closable" class="vjs-my-component__close" @click="handleClose">
      ×
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToken } from '../../composables'
import type { MyComponentProps, MyComponentEmits } from './types'

/**
 * 组件名称（用于调试）
 */
defineOptions({
  name: 'VMyComponent'
})

/**
 * Props定义
 */
const props = withDefaults(defineProps<MyComponentProps>(), {
  visible: true,
  size: 'medium',
  closable: false
})

/**
 * Emits定义
 */
const emit = defineEmits<MyComponentEmits>()

/**
 * Token访问
 */
const { getToken, getTokenVar } = useToken()

/**
 * 组件class
 */
const componentClass = computed(() => [
  'vjs-my-component',
  `vjs-my-component--${props.size}`,
  {
    'vjs-my-component--closable': props.closable
  }
])

/**
 * 组件style（使用Token）
 */
const componentStyle = computed(() => ({
  '--vjs-component-padding': getToken('spacing.md'),
  '--vjs-component-radius': getToken('radius.md'),
  '--vjs-component-bg': getToken('color.background')
}))

/**
 * 关闭处理
 */
const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
.vjs-my-component {
  position: relative;
  padding: var(--vjs-component-padding);
  border-radius: var(--vjs-component-radius);
  background: var(--vjs-component-bg);
  box-shadow: var(--vjs-shadow-sm);
  transition: all var(--vjs-motion-duration-fast) var(--vjs-motion-easing-ease);
}

.vjs-my-component--small {
  padding: var(--vjs-spacing-sm);
}

.vjs-my-component--large {
  padding: var(--vjs-spacing-lg);
}

.vjs-my-component__title {
  margin-bottom: var(--vjs-spacing-sm);
  font-size: var(--vjs-font-size-lg);
  font-weight: 600;
  color: var(--vjs-color-text);
}

.vjs-my-component__content {
  color: var(--vjs-color-text-secondary);
}

.vjs-my-component__close {
  position: absolute;
  top: var(--vjs-spacing-sm);
  right: var(--vjs-spacing-sm);
  cursor: pointer;
  font-size: var(--vjs-font-size-xl);
  color: var(--vjs-color-text-secondary);
  transition: color var(--vjs-motion-duration-fast);
}

.vjs-my-component__close:hover {
  color: var(--vjs-color-text);
}
</style>
```

### 2.4 导出组件

```typescript
// index.ts

import MyComponent from './MyComponent.vue'
import { MyComponentDSL } from './MyComponent.dsl'
import type { MyComponentProps, MyComponentEmits, MyComponentSlots } from './types'

// 导出组件
export { MyComponent, MyComponentDSL }

// 导出类型
export type { MyComponentProps, MyComponentEmits, MyComponentSlots }

// 安装函数（支持Vue.use）
export default {
  install(app: any) {
    app.component('VMyComponent', MyComponent)
  }
}
```

---

## 三、编写测试

### 3.1 单元测试

```typescript
// __tests__/MyComponent.test.ts

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { MyComponent } from '../index'

describe('MyComponent', () => {
  it('should render correctly', () => {
    const wrapper = mount(MyComponent, {
      props: {
        title: 'Test Title',
        visible: true
      }
    })
    
    expect(wrapper.find('.vjs-my-component__title').text()).toBe('Test Title')
    expect(wrapper.isVisible()).toBe(true)
  })

  it('should emit close event', async () => {
    const wrapper = mount(MyComponent, {
      props: {
        closable: true
      }
    })
    
    await wrapper.find('.vjs-my-component__close').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should apply size classes', () => {
    const wrapper = mount(MyComponent, {
      props: {
        size: 'large'
      }
    })
    
    expect(wrapper.classes()).toContain('vjs-my-component--large')
  })
})
```

### 3.2 快照测试

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { MyComponent } from '../index'

describe('MyComponent snapshots', () => {
  it('should match snapshot', () => {
    const wrapper = mount(MyComponent, {
      props: {
        title: 'Test',
        size: 'medium'
      }
    })
    
    expect(wrapper.html()).toMatchSnapshot()
  })
})
```

---

## 四、编写文档

### 4.1 组件README

```markdown
# MyComponent 组件

简洁的描述。

## 基础用法

\`\`\`vue
<template>
  <VMyComponent title="标题">
    内容
  </VMyComponent>
</template>
\`\`\`

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | - | 组件标题 |
| visible | boolean | true | 是否显示 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 尺寸 |

### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| close | () => void | 关闭事件 |

### Slots

| 插槽 | 说明 |
|------|------|
| default | 默认内容 |
| title | 标题内容 |

## 示例

### 不同尺寸

\`\`\`vue
<VMyComponent size="small">Small</VMyComponent>
<VMyComponent size="medium">Medium</VMyComponent>
<VMyComponent size="large">Large</VMyComponent>
\`\`\`

### 可关闭

\`\`\`vue
<VMyComponent closable @close="handleClose">
  Content
</VMyComponent>
\`\`\`
```

---

## 五、样式规范

### 5.1 使用Token系统

```scss
// ✅ 正确：使用CSS变量
.vjs-my-component {
  padding: var(--vjs-spacing-md);
  color: var(--vjs-color-text);
}

// ❌ 错误：硬编码值
.vjs-my-component {
  padding: 16px;
  color: #333;
}
```

### 5.2 BEM命名规范

```scss
// Block
.vjs-my-component { }

// Element
.vjs-my-component__title { }
.vjs-my-component__content { }

// Modifier
.vjs-my-component--large { }
.vjs-my-component--disabled { }

// State
.vjs-my-component.is-active { }
```

### 5.3 响应式设计

```scss
.vjs-my-component {
  padding: var(--vjs-spacing-md);
  
  @media (max-width: 768px) {
    padding: var(--vjs-spacing-sm);
  }
}
```

---

## 六、无障碍规范

### 6.1 ARIA属性

```vue
<template>
  <div
    role="dialog"
    :aria-label="title"
    :aria-hidden="!visible"
  >
    <!-- 内容 -->
  </div>
</template>
```

### 6.2 键盘导航

```typescript
const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Escape':
      handleClose()
      break
    case 'Enter':
      handleConfirm()
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
```

### 6.3 焦点管理

```typescript
import { ref, onMounted, onUnmounted } from 'vue'

const dialogRef = ref<HTMLElement>()

onMounted(() => {
  // 保存之前的焦点元素
  const previousFocus = document.activeElement as HTMLElement
  
  // 聚焦到对话框
  dialogRef.value?.focus()
  
  onUnmounted(() => {
    // 恢复焦点
    previousFocus?.focus()
  })
})
```

---

## 七、性能优化

### 7.1 使用computed缓存

```typescript
// ✅ 好：使用computed缓存计算结果
const filteredItems = computed(() => {
  return items.value.filter(item => item.active)
})

// ❌ 差：每次render都重新计算
const filteredItems = items.value.filter(item => item.active)
```

### 7.2 避免不必要的渲染

```vue
<template>
  <!-- ✅ 使用v-show切换显示 -->
  <div v-show="visible">Content</div>
  
  <!-- ⚠️ v-if会销毁重建DOM -->
  <div v-if="visible">Heavy Content</div>
</template>
```

### 7.3 懒加载大组件

```typescript
const VDataTable = defineAsyncComponent(() => 
  import('./DataTable.vue')
)
```

---

## 八、提交检查清单

开发完成后，确保：

- [ ] 类型定义完整（Props, Emits, Slots）
- [ ] DSL定义正确
- [ ] 组件逻辑实现
- [ ] 样式使用Token系统
- [ ] 单元测试覆盖率 > 80%
- [ ] 无障碍支持（ARIA、键盘）
- [ ] 文档完整（README + 示例）
- [ ] 通过ESLint检查
- [ ] 通过TypeScript检查
- [ ] 性能测试通过

---

## 九、发布流程

```bash
# 1. 确保在正确的分支
git checkout main

# 2. 运行测试
pnpm test

# 3. 构建
pnpm build

# 4. 创建changeset
pnpm changeset
# 选择类型：patch/minor/major
# 输入变更描述

# 5. 提交变更
git add .
git commit -m "feat(vue): add MyComponent"

# 6. 推送
git push origin main

# 7. 创建PR或直接合并
```

---

## 十、常见问题

### Q1: 如何处理复杂的状态逻辑？

A: 使用组合式函数抽离逻辑

```typescript
// useMyComponent.ts
export function useMyComponent(props: MyComponentProps) {
  const internalState = reactive({
    count: 0
  })
  
  const increment = () => {
    internalState.count++
  }
  
  return {
    state: internalState,
    increment
  }
}

// MyComponent.vue
const { state, increment } = useMyComponent(props)
```

### Q2: 如何处理异步操作？

A: 使用async/await + loading状态

```typescript
const loading = ref(false)

const fetchData = async () => {
  loading.value = true
  try {
    const data = await api.getData()
    // 处理数据
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
```

### Q3: 如何做国际化？

A: 使用i18n组合函数

```typescript
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const title = computed(() => t('myComponent.title'))
```

---

**Happy Coding! 🎉**
