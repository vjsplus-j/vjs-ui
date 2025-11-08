# @vjs-ui/utils

> VJS-UI 工具函数库

## 功能

- 类型检查工具
- 对象操作工具
- 数组操作工具
- 字符串处理工具
- 日期格式化工具
- 防抖节流工具

## 安装

```bash
pnpm add @vjs-ui/utils
```

## 使用

```typescript
import { isObject, deepClone } from '@vjs-ui/utils'

isObject({}) // true
deepClone({ a: 1 }) // { a: 1 }
```

## License

MIT
