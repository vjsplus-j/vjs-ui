# VJS-UI 快速开始

> 5分钟上手VJS-UI，开始构建企业级应用

---

## 📦 安装

### 环境要求

- Node.js >= 16.0.0
- Vue 3.0+ / React 18+ / 原生Web Components

### 使用包管理器安装

```bash
# npm
npm install @vjs-ui/vue

# yarn
yarn add @vjs-ui/vue

# pnpm (推荐)
pnpm add @vjs-ui/vue
```

### CDN引入

```html
<!-- 开发环境 -->
<script src="https://unpkg.com/@vjs-ui/vue"></script>

<!-- 生产环境 -->
<script src="https://unpkg.com/@vjs-ui/vue@1.0.0/dist/index.prod.js"></script>
```

---

## 🚀 Vue 3 快速开始

### 1. 完整引入

```javascript
// main.js
import { createApp } from 'vue'
import VjsUI from '@vjs-ui/vue'
import '@vjs-ui/vue/dist/style.css'
import App from './App.vue'

const app = createApp(App)
app.use(VjsUI)
app.mount('#app')
```

### 2. 按需引入（推荐）

```javascript
// main.js
import { createApp } from 'vue'
import { VButton, VTable, VChart } from '@vjs-ui/vue'
import App from './App.vue'

const app = createApp(App)
app.component('VButton', VButton)
app.component('VTable', VTable)
app.component('VChart', VChart)
app.mount('#app')
```

### 3. 自动导入（推荐）

使用 `unplugin-vue-components` 实现自动按需导入：

```bash
pnpm add -D unplugin-vue-components
```

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VjsUIResolver } from '@vjs-ui/vue/resolver'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VjsUIResolver()]
    })
  ]
})
```

现在可以直接使用组件，无需手动导入：

```vue
<template>
  <VButton type="primary">自动导入</VButton>
</template>
```

---

## 💡 第一个示例

### Hello World

```vue
<template>
  <div class="app">
    <VButton type="primary" @click="handleClick">
      Hello VJS-UI
    </VButton>
    <VMessage v-if="visible" type="success">
      欢迎使用 VJS-UI！
    </VMessage>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { VButton, VMessage } from '@vjs-ui/vue'

const visible = ref(false)

const handleClick = () => {
  visible.value = true
  setTimeout(() => {
    visible.value = false
  }, 3000)
}
</script>

<style scoped>
.app {
  padding: 20px;
}
</style>
```

---

## 📊 常用组件示例

### 数据表格

```vue
<template>
  <VTable
    :data="tableData"
    :columns="columns"
    :pagination="pagination"
    @page-change="handlePageChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { VTable } from '@vjs-ui/vue'

const tableData = ref([
  { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 32, email: 'lisi@example.com' },
  { id: 3, name: '王五', age: 25, email: 'wangwu@example.com' }
])

const columns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 100 },
  { prop: 'email', label: '邮箱' }
]

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 100
})

const handlePageChange = (page) => {
  pagination.value.current = page
  // 加载数据
}
</script>
```

### 表单组件

```vue
<template>
  <VForm
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="100px"
  >
    <VFormItem label="用户名" prop="username">
      <VInput v-model="formData.username" placeholder="请输入用户名" />
    </VFormItem>
    
    <VFormItem label="密码" prop="password">
      <VPassword v-model="formData.password" placeholder="请输入密码" />
    </VFormItem>
    
    <VFormItem label="邮箱" prop="email">
      <VInput v-model="formData.email" type="email" placeholder="请输入邮箱" />
    </VFormItem>
    
    <VFormItem label="性别" prop="gender">
      <VRadioGroup v-model="formData.gender">
        <VRadio value="male">男</VRadio>
        <VRadio value="female">女</VRadio>
      </VRadioGroup>
    </VFormItem>
    
    <VFormItem>
      <VButton type="primary" @click="handleSubmit">提交</VButton>
      <VButton @click="handleReset">重置</VButton>
    </VFormItem>
  </VForm>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { VForm, VFormItem, VInput, VPassword, VRadioGroup, VRadio, VButton } from '@vjs-ui/vue'

const formRef = ref()

const formData = reactive({
  username: '',
  password: '',
  email: '',
  gender: 'male'
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log('提交:', formData)
    }
  })
}

const handleReset = () => {
  formRef.value.resetFields()
}
</script>
```

### 图表组件

```vue
<template>
  <VChart
    :option="chartOption"
    width="100%"
    height="400px"
  />
</template>

<script setup>
import { ref } from 'vue'
import { VChart } from '@vjs-ui/vue'

const chartOption = ref({
  title: { text: '销售数据' },
  tooltip: {},
  xAxis: {
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: {},
  series: [{
    name: '销量',
    type: 'bar',
    data: [5, 20, 36, 10, 10, 20]
  }]
})
</script>
```

---

## 🎨 主题定制

### 使用预设主题

```javascript
import { setTheme } from '@vjs-ui/core'

// 切换到深色模式
setTheme('dark')

// 切换到浅色模式
setTheme('light')
```

### 自定义主题

```javascript
import { setTheme } from '@vjs-ui/core'

setTheme({
  colorPrimary: '#1890ff',
  colorSuccess: '#52c41a',
  colorWarning: '#faad14',
  colorError: '#ff4d4f',
  borderRadius: '4px',
  fontSize: '14px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
})
```

### CSS Variables 方式

```css
:root {
  --vjs-color-primary: #1890ff;
  --vjs-color-success: #52c41a;
  --vjs-color-warning: #faad14;
  --vjs-color-error: #ff4d4f;
  --vjs-border-radius: 4px;
  --vjs-font-size: 14px;
}

/* 深色模式 */
[data-theme='dark'] {
  --vjs-color-primary: #177ddc;
  --vjs-bg-color: #141414;
  --vjs-text-color: rgba(255, 255, 255, 0.85);
}
```

---

## 🔧 DSL 驱动使用

### 基础用法

```javascript
import { createComponent } from '@vjs-ui/core'

// 通过JSON配置创建组件
const config = {
  type: 'Button',
  props: {
    type: 'primary',
    size: 'large',
    disabled: false
  },
  children: '动态按钮',
  events: {
    onClick: () => {
      console.log('点击了按钮')
    }
  }
}

const button = createComponent(config)
```

### 动态表单

```javascript
const formConfig = {
  type: 'Form',
  props: {
    model: 'formData',
    labelWidth: '100px'
  },
  children: [
    {
      type: 'FormItem',
      props: { label: '用户名', prop: 'username' },
      children: {
        type: 'Input',
        props: {
          vModel: 'formData.username',
          placeholder: '请输入用户名'
        }
      }
    },
    {
      type: 'FormItem',
      props: { label: '密码', prop: 'password' },
      children: {
        type: 'Password',
        props: {
          vModel: 'formData.password',
          placeholder: '请输入密码'
        }
      }
    }
  ]
}

const form = createComponent(formConfig, context)
```

### 表达式绑定

```javascript
const config = {
  type: 'Button',
  props: {
    type: 'primary',
    disabled: '{{loading}}',  // 绑定到 context.loading
    loading: '{{loading}}'
  },
  children: '{{loading ? "加载中..." : "提交"}}',
  events: {
    onClick: '{{handleSubmit}}'  // 绑定到 context.handleSubmit
  }
}

const context = {
  loading: ref(false),
  handleSubmit: () => {
    context.loading.value = true
    // 提交逻辑
  }
}

const button = createComponent(config, context)
```

---

## 📱 响应式设计

### 使用栅格系统

```vue
<template>
  <VRow :gutter="16">
    <VCol :xs="24" :sm="12" :md="8" :lg="6">
      <VCard>响应式卡片 1</VCard>
    </VCol>
    <VCol :xs="24" :sm="12" :md="8" :lg="6">
      <VCard>响应式卡片 2</VCard>
    </VCol>
    <VCol :xs="24" :sm="12" :md="8" :lg="6">
      <VCard>响应式卡片 3</VCard>
    </VCol>
    <VCol :xs="24" :sm="12" :md="8" :lg="6">
      <VCard>响应式卡片 4</VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { VRow, VCol, VCard } from '@vjs-ui/vue'
</script>
```

### 响应式断点

| 断点 | 尺寸 | 设备 |
|------|------|------|
| xs | <576px | 手机 |
| sm | ≥576px | 平板 |
| md | ≥768px | 小屏电脑 |
| lg | ≥992px | 桌面 |
| xl | ≥1200px | 大屏 |
| xxl | ≥1600px | 超大屏 |

---

## 🌐 国际化

### 配置语言

```javascript
import { createApp } from 'vue'
import VjsUI from '@vjs-ui/vue'
import zhCN from '@vjs-ui/locale/zh-CN'
import enUS from '@vjs-ui/locale/en-US'

const app = createApp(App)

// 中文
app.use(VjsUI, { locale: zhCN })

// 英文
app.use(VjsUI, { locale: enUS })
```

### 动态切换语言

```vue
<script setup>
import { ref } from 'vue'
import { useLocale } from '@vjs-ui/vue'
import zhCN from '@vjs-ui/locale/zh-CN'
import enUS from '@vjs-ui/locale/en-US'

const { setLocale } = useLocale()
const currentLang = ref('zh-CN')

const switchLang = (lang) => {
  currentLang.value = lang
  setLocale(lang === 'zh-CN' ? zhCN : enUS)
}
</script>
```

---

## ⚡ 性能优化

### 虚拟滚动

```vue
<template>
  <VVirtualList
    :data="largeDataList"
    :item-height="50"
    height="500px"
  >
    <template #default="{ item }">
      <div class="list-item">{{ item.name }}</div>
    </template>
  </VVirtualList>
</template>

<script setup>
import { ref } from 'vue'
import { VVirtualList } from '@vjs-ui/vue'

// 支持10万+数据流畅渲染
const largeDataList = ref(
  Array.from({ length: 100000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`
  }))
)
</script>
```

### 懒加载

```vue
<template>
  <VImage
    :src="imageSrc"
    lazy
    loading="loading.gif"
    error="error.png"
  />
</template>
```

---

## ❓ 常见问题

### Q: 如何全局配置组件？

```javascript
app.use(VjsUI, {
  // 全局尺寸
  size: 'large',
  // 全局语言
  locale: zhCN,
  // 全局z-index起始值
  zIndex: 3000,
  // 全局主题
  theme: 'dark'
})
```

### Q: 如何使用TypeScript？

所有组件都提供完整的TS类型定义：

```typescript
import type { ButtonProps, TableColumn } from '@vjs-ui/vue'

const buttonProps: ButtonProps = {
  type: 'primary',
  size: 'large'
}

const columns: TableColumn[] = [
  { prop: 'id', label: 'ID' },
  { prop: 'name', label: '姓名' }
]
```

### Q: 如何自定义组件样式？

```vue
<style>
/* 使用CSS Variables覆盖 */
.custom-button {
  --vjs-button-bg: #ff6b6b;
  --vjs-button-color: #fff;
  --vjs-button-border-radius: 20px;
}

/* 或直接覆盖类名 */
.vjs-button--primary {
  background: #ff6b6b !important;
}
</style>
```

### Q: 如何按需加载？

推荐使用 `unplugin-vue-components` 自动按需导入（见上文配置）。

### Q: 支持SSR吗？

支持！配合Nuxt 3使用：

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vjs-ui/nuxt']
})
```

---

## 📚 下一步

- **[组件清单](./COMPONENTS.md)** - 查看所有372个组件
- **[技术架构](./ARCHITECTURE.md)** - 了解技术实现
- **[API参考](./03-SPEC-API-DESIGN.md)** - 详细API文档
- **[组件开发](./03-SPEC-COMPONENT-DEV-GUIDE.md)** - 开发自定义组件

---

## 💬 需要帮助？

- [GitHub Issues](https://github.com/vjsplus-j/vjs-ui/issues)
- [GitHub Discussions](https://github.com/vjsplus-j/vjs-ui/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/vjs-ui)

---

**开始使用VJS-UI构建你的应用吧！** 🚀
