# @vjs-ui/core

> VJS-UI 核心引擎

## 功能

- DSL Parser - DSL解析器
- Data Binder - 数据绑定器
- Reactive System - 响应式系统
- Renderer - 渲染器
- Evaluator - 表达式求值器

## 安装

```bash
pnpm add @vjs-ui/core
```

## 使用

```typescript
import { createComponent } from '@vjs-ui/core'

const config = {
  type: 'Button',
  props: { type: 'primary' },
  children: 'Click Me'
}

const component = createComponent(config)
```

## License

MIT
