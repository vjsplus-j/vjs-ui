# VJS-UI 与 Vue 3 深度集成方案

> **定位**: 专注Vue 3支持，暂不考虑React/Web Components  
> **目标**: 无缝集成Vue 3生态，提供最佳开发体验  
> **策略**: 利用Vue 3特性，而非对抗  

---

## 一、架构定位

```
┌────────────────────────────────────────┐
│         VJS-UI DSL Layer               │  DSL编排层
├────────────────────────────────────────┤
│         Vue 3 Runtime                  │  Vue运行时
├────────────────────────────────────────┤
│         Browser DOM                    │  浏览器
└────────────────────────────────────────┘

VJS-UI = Vue之上的编排层，不是替代者
```

---

## 二、Vue渲染器实现

### 2.1 核心渲染器

```typescript
import { h, createApp, VNode as VueVNode } from 'vue'
import type { DSLNode, VNode } from '@vjs-ui/core'

/**
 * Vue 3渲染器
 */
class Vue3Renderer {
  private componentRegistry = new Map<string, Component>()
  
  /**
   * 注册组件
   */
  registerComponent(name: string, component: Component): void {
    this.componentRegistry.set(name, component)
  }
  
  /**
   * 挂载DSL到容器
   */
  mount(vnode: VNode, container: Element): VueRenderHandle {
    const vueVNode = this.toVueVNode(vnode)
    
    const app = createApp({
      render: () => vueVNode
    })
    
    app.mount(container)
    
    return {
      app,
      vnode: vueVNode,
      unmount: () => app.unmount()
    }
  }
  
  /**
   * 更新渲染
   */
  update(handle: VueRenderHandle, vnode: VNode): void {
    // Vue 3响应式自动处理更新
    // 这里只需要转换新的VNode
    handle.vnode = this.toVueVNode(vnode)
  }
  
  /**
   * 转换为Vue VNode
   */
  private toVueVNode(vnode: VNode): VueVNode {
    // 1. 获取组件定义
    const component = this.componentRegistry.get(vnode.type)
    
    if (!component) {
      console.warn(`Component not found: ${vnode.type}`)
      return h('div', `[${vnode.type}]`)
    }
    
    // 2. 转换props和style
    const props = {
      ...vnode.props,
      style: vnode.style
    }
    
    // 3. 转换events
    for (const [eventName, handler] of Object.entries(vnode.events || {})) {
      const vueEventName = `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`
      props[vueEventName] = handler
    }
    
    // 4. 转换children
    const children = vnode.children?.map(child => this.toVueVNode(child))
    
    // 5. 创建Vue VNode
    return h(component, props, children)
  }
}

interface VueRenderHandle {
  app: App
  vnode: VueVNode
  unmount(): void
}
```

---

## 三、Vue组合式API集成

### 3.1 useCore - 访问Core实例

```typescript
import { inject, provide, InjectionKey } from 'vue'
import type { Core } from '@vjs-ui/core'

const CoreSymbol: InjectionKey<Core> = Symbol('VJSCore')

/**
 * 提供Core实例
 */
export function provideCore(core: Core): void {
  provide(CoreSymbol, core)
}

/**
 * 使用Core实例
 */
export function useCore(): Core {
  const core = inject(CoreSymbol)
  
  if (!core) {
    throw new Error('Core not provided. Did you forget to call provideCore?')
  }
  
  return core
}
```

### 3.2 useDSL - DSL渲染

```typescript
import { ref, watch, onUnmounted, Ref } from 'vue'

/**
 * DSL渲染hook
 */
export function useDSL(dsl: Ref<DSLNode> | DSLNode) {
  const core = useCore()
  const vnode = ref<VNode | null>(null)
  const error = ref<Error | null>(null)
  
  // 渲染函数
  const render = () => {
    try {
      const dslValue = unref(dsl)
      vnode.value = core.parser.parse(dslValue, core.context)
      error.value = null
    } catch (err) {
      error.value = err as Error
      console.error('[VJS-UI] DSL render error:', err)
    }
  }
  
  // 监听DSL变化
  if (isRef(dsl)) {
    watch(dsl, render, { immediate: true })
  } else {
    render()
  }
  
  // 清理
  onUnmounted(() => {
    vnode.value = null
  })
  
  return {
    vnode,
    error,
    render
  }
}
```

### 3.3 useToken - Token访问

```typescript
import { computed, ComputedRef } from 'vue'

/**
 * Token访问hook
 */
export function useToken(key: string): ComputedRef<string> {
  const core = useCore()
  
  return computed(() => {
    return core.tokens.get(key) || ''
  })
}

/**
 * 批量Token访问
 */
export function useTokens(keys: string[]): ComputedRef<Record<string, string>> {
  const core = useCore()
  
  return computed(() => {
    const result: Record<string, string> = {}
    for (const key of keys) {
      result[key] = core.tokens.get(key) || ''
    }
    return result
  })
}
```

### 3.4 useTheme - 主题切换

```typescript
import { ref, Ref } from 'vue'

/**
 * 主题切换hook
 */
export function useTheme() {
  const core = useCore()
  const currentTheme = ref(core.tokens.currentTheme || 'default')
  
  /**
   * 切换主题
   */
  const setTheme = (theme: string) => {
    core.tokens.setTheme(theme)
    currentTheme.value = theme
    
    // 保存到localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('vjs-ui-theme', theme)
    }
  }
  
  /**
   * 切换暗黑模式
   */
  const toggleDark = () => {
    const newTheme = currentTheme.value === 'dark' ? 'default' : 'dark'
    setTheme(newTheme)
  }
  
  /**
   * 恢复主题
   */
  const restoreTheme = () => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('vjs-ui-theme')
      if (saved) {
        setTheme(saved)
      }
    }
  }
  
  return {
    currentTheme,
    setTheme,
    toggleDark,
    restoreTheme
  }
}
```

---

## 四、Vue组件包装器

### 4.1 defineVComponent - 组件定义助手

```typescript
import { defineComponent, PropType } from 'vue'

/**
 * 定义VJS-UI组件
 */
export function defineVComponent<P = any>(options: VComponentOptions<P>) {
  return defineComponent({
    name: options.name,
    
    props: options.props as any,
    
    emits: options.emits,
    
    setup(props, { emit, slots }) {
      const core = useCore()
      
      // 将DSL渲染为VNode
      const { vnode, error } = useDSL(() => {
        return options.dsl({
          props,
          emit,
          slots,
          core
        })
      })
      
      return () => {
        if (error.value) {
          return h('div', { class: 'vjs-error' }, error.value.message)
        }
        
        return vnode.value
      }
    }
  })
}

interface VComponentOptions<P = any> {
  name: string
  props?: PropType<P>
  emits?: string[]
  dsl: (context: VComponentContext<P>) => DSLNode
}

interface VComponentContext<P = any> {
  props: P
  emit: (event: string, ...args: any[]) => void
  slots: Slots
  core: Core
}
```

### 4.2 VDSLRenderer - DSL渲染组件

```typescript
/**
 * DSL渲染器组件
 */
export const VDSLRenderer = defineComponent({
  name: 'VDSLRenderer',
  
  props: {
    dsl: {
      type: Object as PropType<DSLNode>,
      required: true
    },
    context: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({})
    }
  },
  
  setup(props) {
    const core = useCore()
    
    // 创建运行时上下文
    const runtimeContext = computed(() => ({
      ...core.context,
      ...props.context
    }))
    
    // 渲染DSL
    const { vnode, error } = useDSL(() => {
      const parser = core.parser
      return parser.parse(props.dsl, runtimeContext.value)
    })
    
    return () => {
      if (error.value) {
        return h('div', { class: 'vjs-dsl-error' }, [
          h('h4', 'DSL Render Error'),
          h('pre', error.value.message)
        ])
      }
      
      const renderer = new Vue3Renderer()
      return renderer.toVueVNode(vnode.value!)
    }
  }
})
```

### 4.3 VThemeProvider - 主题提供者

```typescript
/**
 * 主题提供者组件
 */
export const VThemeProvider = defineComponent({
  name: 'VThemeProvider',
  
  props: {
    theme: {
      type: String,
      default: 'default'
    },
    tokens: {
      type: Object as PropType<TokenMap>,
      default: () => ({})
    }
  },
  
  setup(props, { slots }) {
    const core = useCore()
    
    // 应用主题
    watch(() => props.theme, (theme) => {
      core.tokens.setTheme(theme)
    }, { immediate: true })
    
    // 应用自定义tokens
    watch(() => props.tokens, (tokens) => {
      Object.entries(tokens).forEach(([key, value]) => {
        core.tokens.set(key, value)
      })
    }, { immediate: true, deep: true })
    
    return () => slots.default?.()
  }
})
```

---

## 五、Vue生命周期集成

```typescript
/**
 * 组件生命周期管理
 */
export class VueLifecycleManager {
  /**
   * 在组件挂载时
   */
  onMounted(instance: ComponentInstance, callback: () => void): void {
    // 利用Vue的onMounted
    onMounted(() => {
      callback()
    })
  }
  
  /**
   * 在组件更新时
   */
  onUpdated(instance: ComponentInstance, callback: () => void): void {
    onUpdated(() => {
      callback()
    })
  }
  
  /**
   * 在组件卸载时
   */
  onUnmounted(instance: ComponentInstance, callback: () => void): void {
    onUnmounted(() => {
      // 清理Core资源
      instance.effects?.forEach(effect => effect.stop())
      
      // 执行用户回调
      callback()
    })
  }
}
```

---

## 六、Vue指令支持

### 6.1 v-dsl指令

```typescript
import { Directive } from 'vue'

/**
 * v-dsl指令 - 直接渲染DSL
 */
export const vDsl: Directive = {
  mounted(el, binding) {
    const core = inject(CoreSymbol)
    if (!core) {
      console.error('[v-dsl] Core not provided')
      return
    }
    
    const dsl = binding.value as DSLNode
    const renderer = new Vue3Renderer()
    
    // 渲染DSL
    const vnode = core.parser.parse(dsl, core.context)
    const handle = renderer.mount(vnode, el)
    
    // 保存handle用于清理
    ;(el as any).__vjsHandle = handle
  },
  
  updated(el, binding) {
    const handle = (el as any).__vjsHandle
    if (!handle) return
    
    const core = inject(CoreSymbol)
    if (!core) return
    
    const dsl = binding.value as DSLNode
    const vnode = core.parser.parse(dsl, core.context)
    
    handle.update(vnode)
  },
  
  unmounted(el) {
    const handle = (el as any).__vjsHandle
    if (handle) {
      handle.unmount()
      delete (el as any).__vjsHandle
    }
  }
}
```

使用示例：
```vue
<template>
  <div v-dsl="buttonDSL"></div>
</template>

<script setup>
const buttonDSL = {
  type: 'Button',
  props: { text: 'Click Me' }
}
</script>
```

---

## 七、Vue插件注册

```typescript
import { App, Plugin } from 'vue'

/**
 * VJS-UI Vue插件
 */
export const VJSUIPlugin: Plugin = {
  install(app: App, options?: VJSUIOptions) {
    // 1. 创建Core实例
    const core = createCore(options?.coreOptions)
    
    // 2. 提供Core
    app.provide(CoreSymbol, core)
    
    // 3. 注册全局组件
    app.component('VDSLRenderer', VDSLRenderer)
    app.component('VThemeProvider', VThemeProvider)
    
    // 4. 注册指令
    app.directive('dsl', vDsl)
    
    // 5. 注册用户组件
    if (options?.components) {
      Object.entries(options.components).forEach(([name, component]) => {
        core.renderer.registerComponent(name, component)
        app.component(name, component)
      })
    }
    
    // 6. 应用全局配置
    if (options?.theme) {
      core.tokens.setTheme(options.theme)
    }
  }
}

interface VJSUIOptions {
  coreOptions?: CoreOptions
  components?: Record<string, Component>
  theme?: string
}
```

使用示例：
```typescript
import { createApp } from 'vue'
import { VJSUIPlugin } from '@vjs-ui/vue'
import { VButton, VInput } from '@vjs-ui/components'

const app = createApp(App)

app.use(VJSUIPlugin, {
  components: {
    VButton,
    VInput
  },
  theme: 'default'
})

app.mount('#app')
```

---

## 八、TypeScript支持

### 8.1 类型定义

```typescript
// vue-shim.d.ts
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    VDSLRenderer: typeof import('@vjs-ui/vue')['VDSLRenderer']
    VThemeProvider: typeof import('@vjs-ui/vue')['VThemeProvider']
  }
  
  export interface ComponentCustomProperties {
    $core: Core
  }
}

export {}
```

### 8.2 Props类型推导

```typescript
import { ExtractPropTypes } from 'vue'

// 组件Props
export const buttonProps = {
  type: {
    type: String as PropType<'default' | 'primary' | 'success'>,
    default: 'default'
  },
  text: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
} as const

export type ButtonProps = ExtractPropTypes<typeof buttonProps>
```

---

## 九、开发工具支持

### 9.1 Volar支持

```typescript
// volar.d.ts
import { DefineComponent } from 'vue'

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    VButton: DefineComponent<ButtonProps>
    VInput: DefineComponent<InputProps>
    VCard: DefineComponent<CardProps>
  }
}
```

### 9.2 Vue DevTools集成

```typescript
/**
 * DevTools集成
 */
export function setupDevTools(app: App, core: Core): void {
  if (process.env.NODE_ENV === 'development') {
    app.config.globalProperties.$core = core
    
    // 注册DevTools Inspector
    if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
      window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit('app:init', app, core)
    }
  }
}
```

---

## 十、性能优化

### 10.1 KeepAlive支持

```vue
<template>
  <KeepAlive>
    <VDSLRenderer :key="currentRoute" :dsl="routeDSL" />
  </KeepAlive>
</template>
```

### 10.2 Suspense支持

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncDSLComponent :dsl="dsl" />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
```

---

## 十一、测试支持

```typescript
import { mount } from '@vue/test-utils'
import { VJSUIPlugin } from '@vjs-ui/vue'

describe('Vue Integration', () => {
  it('renders DSL', () => {
    const wrapper = mount({
      template: '<VDSLRenderer :dsl="dsl" />',
      setup() {
        const dsl = {
          type: 'Button',
          props: { text: 'Test' }
        }
        return { dsl }
      }
    }, {
      global: {
        plugins: [VJSUIPlugin]
      }
    })
    
    expect(wrapper.text()).toContain('Test')
  })
})
```

---

## 十二、实施步骤

### Week 1-2: 基础渲染器
- [ ] Vue3Renderer实现
- [ ] 组件注册机制
- [ ] VNode转换逻辑

### Week 3-4: 组合式API
- [ ] useCore/useDSL/useToken
- [ ] 生命周期集成
- [ ] TypeScript类型

### Week 5-6: 高级特性
- [ ] 指令支持
- [ ] 插件系统
- [ ] DevTools集成

---

**最后更新**: 2025-01-08  
**状态**: ✅ Vue 3专属方案
