# 贡献指南

感谢你对VJS-UI的关注！我们欢迎所有形式的贡献。

---

## 🤝 如何贡献

### 报告Bug

在提交Bug之前，请：
1. 搜索[Issues](https://github.com/vjsplus-j/vjs-ui/issues)确认问题未被报告
2. 使用Bug报告模板
3. 提供详细的复现步骤
4. 包含环境信息（浏览器、Node版本等）

### 提出新功能

1. 搜索[Discussions](https://github.com/vjsplus-j/vjs-ui/discussions)确认想法未被讨论
2. 创建Feature Request Issue
3. 详细描述用例和预期行为
4. 考虑向后兼容性

### 提交代码

1. Fork本仓库
2. 创建feature分支：`git checkout -b feature/your-feature`
3. 编写代码和测试
4. 提交：`git commit -m "feat: add awesome feature"`
5. 推送：`git push origin feature/your-feature`
6. 开启Pull Request

---

## 📝 开发流程

### 环境准备

```bash
# 克隆仓库
git clone https://github.com/vjsplus-j/vjs-ui.git
cd vjs-ui

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 项目结构

```
vjs-ui/
├── packages/
│   ├── core/          # 核心引擎
│   ├── tokens/        # Design Tokens
│   ├── vue/           # Vue组件库
│   ├── utils/         # 工具函数
│   └── shared/        # 共享类型
├── docs/              # 文档
└── examples/          # 示例代码
```

### 开发命令

```bash
# 开发模式
pnpm dev

# 构建
pnpm build

# 测试
pnpm test

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

---

## ✅ 代码规范

### Commit消息规范

遵循[Conventional Commits](https://www.conventionalcommits.org/)：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型(type)**：
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链配置

**示例**：
```
feat(core): add DSL parser

Implement basic DSL parser with expression support

Closes #123
```

### 代码风格

- 使用ESLint + Prettier
- 严格的TypeScript模式
- 编写单元测试（覆盖率>85%）
- 添加JSDoc注释
- 遵循现有代码风格

### 测试要求

```bash
# 运行所有测试
pnpm test

# 单包测试
pnpm test --filter=@vjs-ui/core

# 覆盖率报告
pnpm test --coverage
```

**要求**：
- 新功能必须有测试
- Bug修复必须有回归测试
- 核心模块覆盖率≥90%
- 整体覆盖率≥85%

---

## 📦 发布流程

**仅核心团队成员**

```bash
# 创建changeset
pnpm changeset

# 版本升级
pnpm version

# 发布到npm
pnpm release
```

---

## 🎯 优先级

### 高优先级
- Bug修复
- 性能优化
- 安全问题
- 文档改进

### 中优先级
- 新组件
- API增强
- 单元测试

### 低优先级
- 代码重构
- 优化建议

---

## 💬 需要帮助？

- [GitHub Issues](https://github.com/vjsplus-j/vjs-ui/issues)
- [GitHub Discussions](https://github.com/vjsplus-j/vjs-ui/discussions)
- [文档](https://vjs-ui.github.io)

---

## 📜 行为准则

请阅读我们的[行为准则](./CODE_OF_CONDUCT.md)，共同营造友好的社区环境。

---

**再次感谢你的贡献！** 💖
