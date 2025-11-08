# 安全政策

VJS-UI团队非常重视安全问题。我们感谢社区在负责任地披露安全漏洞方面的帮助。

---

## 🔒 支持的版本

| 版本 | 支持状态 |
| ------- | ---------- |
| 1.x.x   | ✅ 支持   |
| 0.x.x   | ⚠️  Beta  |

---

## 🚨 报告安全漏洞

**请不要公开报告安全问题！**

如果你发现了安全漏洞，请通过以下方式私下报告：

### 首选方式：GitHub Security Advisories

1. 访问 [Security Advisories](https://github.com/vjsplus-j/vjs-ui/security/advisories)
2. 点击 "Report a vulnerability"
3. 填写详细信息

### 备选方式：电子邮件

发送邮件至：**security@vjs-ui.dev**

**邮件标题**：`[SECURITY] 简短描述`

**包含信息**：
- 漏洞类型
- 影响范围
- 复现步骤
- PoC代码（如有）
- 潜在影响
- 你的联系方式

---

## 📅 响应时间

我们承诺：
- **24小时内**确认收到报告
- **7天内**提供初步评估
- **30天内**修复高危漏洞
- **90天内**修复中低危漏洞

---

## 🛡️ 安全措施

VJS-UI采取以下安全措施：

### 1. 表达式安全
- **禁用eval/new Function** - 使用jsep AST解析
- **白名单验证** - 仅允许安全操作符和函数
- **沙箱隔离** - 无DOM/全局对象访问
- **资源限制** - 超时保护和操作次数限制

### 2. XSS防护
- **内容安全策略(CSP)** - 严格的CSP头
- **输出转义** - 自动HTML转义
- **属性白名单** - 仅允许安全属性

### 3. 原型污染防护
- **Object.create(null)** - 无原型链对象
- **hasOwnProperty检查** - 严格属性检查
- **冻结原型** - 防止原型篡改

### 4. 依赖安全
- **定期审计** - npm audit + Snyk扫描
- **最小依赖** - 减少攻击面
- **版本锁定** - package-lock.json

---

## 🏆 安全致谢

我们感谢以下研究者的负责任披露：

_（待添加）_

---

## 📖 安全最佳实践

使用VJS-UI时，请遵循：

### 1. 输入验证
```typescript
// ✅ 好的做法
const config = sanitizeConfig(userInput)

// ❌ 不好的做法
const config = JSON.parse(userInput)
```

### 2. CSP配置
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self'">
```

### 3. 更新依赖
```bash
# 检查安全更新
pnpm audit

# 更新到最新版本
pnpm update @vjs-ui/vue --latest
```

---

## 🔗 相关资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)
- [VJS-UI安全文档](https://vjs-ui.github.io/guide/security)

---

## 📜 漏洞披露政策

### 时间线
1. **0天**: 收到报告
2. **7天**: 确认漏洞并开始修复
3. **30-90天**: 发布安全补丁
4. **90天后**: 公开披露（如已修复）

### 致谢
- 安全研究者将被列入致谢名单
- 重大漏洞发现者可获得致谢徽章

---

**感谢你帮助VJS-UI变得更安全！** 🛡️
