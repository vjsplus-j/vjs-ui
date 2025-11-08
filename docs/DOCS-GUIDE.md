# VJS-UI 文档指南

> 文档分类说明：对外文档 vs 内部文档

---

## 📖 对外文档（开发者查看）

这些文档面向使用VJS-UI的开发者，提供使用指南和技术说明。

### 核心文档

| 文档 | 说明 | 用途 |
|------|------|------|
| **README.md** | 项目介绍 | 快速了解VJS-UI |
| **ARCHITECTURE.md** | 技术架构 | 了解技术设计 |
| **COMPONENTS.md** | 组件清单 | 372个组件详情 |

### API与规范

| 文档 | 说明 | 用途 |
|------|------|------|
| **03-SPEC-API-DESIGN.md** | API设计文档 | API使用参考 |
| **03-SPEC-COMPONENT-DEV-GUIDE.md** | 组件开发指南 | 自定义组件开发 |
| **03-SPEC-TECHNICAL.md** | 技术规范 | 代码规范、命名约定 |

### 技术实现文档

| 文档 | 说明 | 用途 |
|------|------|------|
| **04-TECH-DSL-COMPLETE.md** | DSL系统 | DSL解析与渲染 |
| **04-TECH-REACTIVE-SYSTEM.md** | 响应式系统 | 响应式原理 |
| **04-TECH-PERFORMANCE-COMPLETE.md** | 性能优化 | 性能优化方案 |
| **04-TECH-SECURITY-GUIDE.md** | 安全机制 | 安全防护体系 |
| **04-TECH-VUE3-INTEGRATION.md** | Vue3集成 | Vue3适配说明 |
| **04-TECH-LIFECYCLE-SYSTEM.md** | 生命周期 | 组件生命周期 |

---

## 🔒 内部文档（团队使用）

这些文档包含项目管理、实施计划等内部信息，不对外公开。

### 项目规划

| 文档 | 说明 | 用途 |
|------|------|------|
| **README-INTERNAL.md** | 内部文档导航 | 团队使用 |
| **01-PLANNING-ARCHITECTURE.md** | 架构规划（详细） | 内部规划 |
| **01-PLANNING-MASTER-PLAN.md** | 总体实施计划 | 项目管理 |
| **01-PLANNING-MVP-PLAN.md** | MVP计划 | 开发指导 |
| **01-PLANNING-YAGNI-PRINCIPLES.md** | YAGNI原则 | 设计理念 |

### 实施与测试

| 文档 | 说明 | 用途 |
|------|------|------|
| **02-IMPL-GUIDE-COMPLETE.md** | 完整实施指南 | 开发参考 |
| **02-IMPL-CHECKLIST.md** | 实施清单（500+任务） | 任务追踪 |
| **02-TEST-COMPLETE.md** | 测试完整指南 | 测试策略 |

### 技术深度文档

| 分类 | 文档数量 | 说明 |
|------|---------|------|
| **高级特性** | 14个 | 深度优化方案 |
| **基础技术** | 9个 | 核心技术实现 |

详见内部文档列表：
- `04-TECH-LANE-EXPIRATION.md` - Lane过期机制
- `04-TECH-STARVATION-DETECTOR.md` - 饥饿检测
- `04-TECH-WORKLOAD-ESTIMATOR.md` - 工作量估算
- `04-TECH-BLOCK-OPTIMIZATION.md` - 块优化
- `04-TECH-CSP-POLICY.md` - CSP策略
- `04-TECH-SUSPENSE-BOUNDARY.md` - Suspense边界
- `04-TECH-WEBGPU-ACCELERATOR.md` - WebGPU加速
- `04-TECH-SIGNALS-REACTIVE.md` - Signals响应式
- `04-TECH-ADAPTIVE-MEMORY.md` - 自适应内存
- `04-TECH-ADAPTIVE-FRAME-BUDGET.md` - 自适应帧预算
- `04-TECH-OFFSCREEN-COMPONENT.md` - 离屏组件
- `04-TECH-PROFILER-TRACKING.md` - Profiler追踪
- `04-TECH-LARGE-OBJECT-HANDLING.md` - 大对象处理
- `04-TECH-ADVANCED-FEATURES.md` - 高级特性汇总

### 项目管理

| 文档 | 说明 | 用途 |
|------|------|------|
| **05-PROJECT-SUMMARY.md** | 项目总结 | 进度回顾 |
| **05-PROJECT-ROADMAP.md** | 项目路线图 | 特性规划 |
| **05-PROJECT-AUDIT-OPTIMIZATION.md** | 审计报告 | 优化历程 |
| **TECH-DEEP-ANALYSIS-COMPLETE.md** | 深度分析 | 技术盲区 |

---

## 📂 推荐的文档结构（未来）

```
vjs-ui/docs/
├── README.md                    # 对外：项目介绍
├── ARCHITECTURE.md              # 对外：技术架构
├── COMPONENTS.md                # 对外：组件清单
├── GETTING-STARTED.md           # 对外：快速开始（待创建）
├── CHANGELOG.md                 # 对外：更新日志（待创建）
│
├── api/                         # 对外：API文档
│   ├── 03-SPEC-API-DESIGN.md
│   └── 03-SPEC-COMPONENT-DEV-GUIDE.md
│
├── technical/                   # 对外：技术文档
│   ├── 04-TECH-DSL-COMPLETE.md
│   ├── 04-TECH-REACTIVE-SYSTEM.md
│   └── ... (其他技术文档)
│
└── internal/                    # 内部：项目管理
    ├── README-INTERNAL.md
    ├── 01-PLANNING-*.md
    ├── 02-IMPL-*.md
    ├── 05-PROJECT-*.md
    └── TECH-DEEP-ANALYSIS-COMPLETE.md
```

---

## 🎯 文档使用建议

### 对于使用者（开发者）

**快速开始**：
1. 阅读 `README.md` - 了解项目
2. 查看 `COMPONENTS.md` - 选择所需组件
3. 参考 `03-SPEC-API-DESIGN.md` - 学习API使用

**深入了解**：
1. 阅读 `ARCHITECTURE.md` - 理解技术架构
2. 查看 `04-TECH-*` 系列 - 学习技术实现
3. 参考 `03-SPEC-COMPONENT-DEV-GUIDE.md` - 开发自定义组件

### 对于贡献者（团队成员）

**开发准备**：
1. 阅读 `README-INTERNAL.md` - 内部文档导航
2. 查看 `01-PLANNING-MASTER-PLAN.md` - 了解整体规划
3. 参考 `02-IMPL-GUIDE-COMPLETE.md` - 实施指南

**开发过程**：
1. 遵循 `03-SPEC-TECHNICAL.md` - 技术规范
2. 查看 `02-IMPL-CHECKLIST.md` - 任务清单
3. 参考 `02-TEST-COMPLETE.md` - 测试要求

---

## 📝 文档维护规则

### 对外文档

- ✅ 保持简洁专业
- ✅ 突出功能特性
- ✅ 提供使用示例
- ❌ 不包含实施计划
- ❌ 不包含时间规划
- ❌ 不包含内部决策过程

### 内部文档

- ✅ 详细记录实施过程
- ✅ 包含时间规划和里程碑
- ✅ 记录决策过程和理由
- ✅ 追踪任务和进度
- ❌ 不对外公开

---

## 🔄 文档更新流程

1. **对外文档更新** - 功能发布时同步更新
2. **内部文档更新** - 开发过程中持续更新
3. **版本说明** - 在CHANGELOG.md中记录变更
4. **文档审核** - 确保对外文档无内部信息泄露

---

**保持文档的专业性和实用性！** 📚✨
