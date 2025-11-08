# VJS-UI 文档中心

> 📚 完整的技术文档和使用指南

---

## 🎯 文档导航

### 📖 对外文档（开发者使用）

这些文档面向使用VJS-UI的开发者，提供完整的使用指南和技术说明。

| 文档 | 说明 | 状态 |
|------|------|------|
| [快速开始](./GETTING-STARTED.md) | 安装、配置、基础使用 | ✅ 完成 |
| [技术架构](./ARCHITECTURE.md) | 三层架构设计和核心原理 | ✅ 完成 |
| [组件清单](./COMPONENTS.md) | 372个组件完整列表 | ✅ 完成 |
| [组件索引](./COMPONENTS-INDEX.md) | 按字母、场景快速查找 | ✅ 完成 |
| [版本日志](./CHANGELOG.md) | 版本更新记录 | ✅ 完成 |
| [文档指南](./DOCS-GUIDE.md) | 文档分类说明 | ✅ 完成 |

---

### 🔒 内部文档（团队开发）

这些文档包含详细的技术实现、开发规划和内部管理信息，仅供项目团队使用。

📁 **[internal/](./internal/)** - 内部文档目录

#### 📋 规划文档
- [架构规划](./internal/01-PLANNING-ARCHITECTURE.md)
- [总体计划](./internal/01-PLANNING-MASTER-PLAN.md)
- [MVP计划](./internal/01-PLANNING-MVP-PLAN.md)
- [YAGNI原则](./internal/01-PLANNING-YAGNI-PRINCIPLES.md)

#### 🛠️ 实施文档
- [实施清单](./internal/02-IMPL-CHECKLIST.md) - 完整任务清单
- [实施指南](./internal/02-IMPL-GUIDE-COMPLETE.md) - 详细实施步骤
- [测试策略](./internal/02-TEST-COMPLETE.md) - 测试覆盖计划

#### 📐 规范文档
- [API设计](./internal/03-SPEC-API-DESIGN.md)
- [组件开发指南](./internal/03-SPEC-COMPONENT-DEV-GUIDE.md)
- [技术规范](./internal/03-SPEC-TECHNICAL.md)

#### ⚡ 技术文档（23篇）
完整的技术实现文档，包含：
- DSL系统
- 响应式原理
- 性能优化
- 安全机制
- 生命周期
- 浏览器兼容
- 以及17个高级特性实现

**[查看完整技术文档列表 →](./internal/)**

#### 📊 项目管理
- [项目总结](./internal/05-PROJECT-SUMMARY.md)
- [审计优化](./internal/05-PROJECT-AUDIT-OPTIMIZATION.md)
- [发展路线图](./internal/05-PROJECT-ROADMAP.md)

---

## 🎓 学习路径

### 新手入门

1. 📖 [快速开始](./GETTING-STARTED.md) - 5分钟上手
2. 🎯 [技术架构](./ARCHITECTURE.md) - 了解设计理念
3. 📦 [组件清单](./COMPONENTS.md) - 浏览可用组件

### 进阶开发

1. 🔧 [API设计](./internal/03-SPEC-API-DESIGN.md) - 深入API
2. 💻 [组件开发指南](./internal/03-SPEC-COMPONENT-DEV-GUIDE.md) - 自定义组件
3. ⚡ [技术实现文档](./internal/) - 核心原理

### 团队协作

1. 📋 [实施清单](./internal/02-IMPL-CHECKLIST.md) - 任务管理
2. 📐 [技术规范](./internal/03-SPEC-TECHNICAL.md) - 代码规范
3. 🧪 [测试策略](./internal/02-TEST-COMPLETE.md) - 质量保证

---

## 📊 文档统计

### 对外文档
- ✅ 完成：7个
- 📝 内容：使用指南、组件清单、快速开始

### 内部文档
- ✅ 完成：38个
- 📝 内容：技术实现、开发规划、团队管理

### 总计
- 📄 文档总数：**45个**
- 💻 代码行数：**57,000+行**
- 📝 文字内容：**完整覆盖**

---

## 🔍 快速查找

### 按主题

| 主题 | 相关文档 |
|------|----------|
| **安装使用** | [快速开始](./GETTING-STARTED.md) |
| **组件查找** | [组件索引](./COMPONENTS-INDEX.md) |
| **技术原理** | [技术架构](./ARCHITECTURE.md) |
| **API文档** | [API设计](./internal/03-SPEC-API-DESIGN.md) |
| **性能优化** | [性能文档](./internal/04-TECH-PERFORMANCE-COMPLETE.md) |
| **安全机制** | [安全指南](./internal/04-TECH-SECURITY-GUIDE.md) |
| **DSL系统** | [DSL完整文档](./internal/04-TECH-DSL-COMPLETE.md) |

### 按角色

| 角色 | 推荐文档 |
|------|----------|
| **使用者** | [快速开始](./GETTING-STARTED.md) + [组件清单](./COMPONENTS.md) |
| **开发者** | [技术架构](./ARCHITECTURE.md) + [组件开发](./internal/03-SPEC-COMPONENT-DEV-GUIDE.md) |
| **团队管理** | [实施清单](./internal/02-IMPL-CHECKLIST.md) + [项目总结](./internal/05-PROJECT-SUMMARY.md) |
| **技术专家** | [完整技术文档](./internal/) |

---

## 💡 文档说明

### 文档分类原则

- **对外文档**：面向使用VJS-UI的开发者
  - 使用指南和示例
  - 组件列表和API
  - 不包含内部实现细节

- **内部文档**：面向VJS-UI团队成员
  - 详细技术实现
  - 开发规划和时间表
  - 内部决策和讨论

### 维护规则

1. **对外文档** - 保持简洁友好，随版本更新
2. **内部文档** - 详尽完整，记录所有技术细节
3. **文档同步** - 重大变更需同时更新相关文档
4. **版本控制** - 所有文档纳入Git版本管理

---

## 🤝 参与贡献

发现文档问题？欢迎：
- 提交[Issue](https://github.com/vjsplus-j/vjs-ui/issues)
- 发起[Pull Request](https://github.com/vjsplus-j/vjs-ui/pulls)
- 参与[讨论](https://github.com/vjsplus-j/vjs-ui/discussions)

---

**开始探索VJS-UI的世界吧！** 🚀
