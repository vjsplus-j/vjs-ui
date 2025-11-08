/**
 * @vjs-ui/vue
 * Vue 3 适配器
 */

import type { App } from 'vue'

// 导出组件
import VButton from './components/Button/Button.vue'
import VInput from './components/Input/Input.vue'
import VCard from './components/Card/Card.vue'

export { VButton, VInput, VCard }

export const components = [VButton, VInput, VCard]

// 安装函数
export function install(app: App): void {
  components.forEach((component) => {
    const name = component.name || component.__name || 'VComponent'
    app.component(name, component)
  })
}

// 版本信息
export const version = '0.1.0'

// 默认导出
export default {
  version,
  install,
}
