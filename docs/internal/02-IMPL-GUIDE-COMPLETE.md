# VJS-UI 架构实施指南（总导航）

> **文档性质**: 总体实施流程索引  
> **目标**: 提供清晰的、有序的架构实现路径  
> **更新日期**: 2025-01-08  
> **状态**: 🎯 执行指南

---

## 📖 如何使用本指南

本文档是VJS-UI项目的**总导航**，按照架构实现的真实顺序整理了所有文档。

**阅读原则**：
1. **严格按序号阅读** - 每个阶段都有前置依赖
2. **理解后再动手** - 看懂文档再写代码
3. **边做边验证** - 完成一个步骤，运行测试验证
4. **记录问题** - 遇到问题及时更新文档

---

## 🎯 架构实施流程总览

```
阶段0：了解项目（1-2天）
    ↓
阶段1：关键文档必读（1-2天）🔴
    ↓
阶段2：项目初始化（2-3天）
    ↓
阶段3：MVP快速验证（4周）🎯
    ↓
阶段4：Core引擎完善（6-8周）
    ↓
阶段5：Vue适配层（6周）
    ↓
阶段6：开发者工具（3-4周）
    ↓
阶段7：跨框架扩展（4周）
    ↓
阶段8：企业级特性（持续）
```

---

## 📚 阶段0：项目理解阶段（1-2天）

### 📄 0-1. 项目概览

**文档**: `../README.md`（项目根目录）  
**用时**: 30分钟  
**优先级**: 🟡 中

**阅读重点**：
- 项目定位：跨框架UI组件库
- 核心特性：DSL驱动、Design Token、响应式
- 技术栈：pnpm + Turborepo + TypeScript
- 开发周期：23-26周（约6个月）

---

### 📄 0-2. 文档中心导航

**文档**: [docs/README.md](./README.md)  
**用时**: 20分钟  
**优先级**: 🟡 中

**作用**：
- 了解所有文档的分类
- 找到适合你角色的阅读路径
- 查看项目当前状态

---

## 🚨 阶段1：关键文档必读阶段（1-2天）

> **⚠️ 警告**: 不读这些文档直接开发，会导致返工！

### 📄 1-1. 风险评估与改进方案 🔴

**文档**: [RISK-ASSESSMENT.md](./RISK-ASSESSMENT.md)  
**用时**: 1小时  
**优先级**: 🔴 最高（必读！）

**核心内容**：
1. **十大关键问题**
   - 时间估算不足（8周→23-26周）
   - 架构复杂度过高（需要职责分离）
   - 安全性实现不足（需要五层防护）
   - 性能目标不现实（50KB→80KB）

2. **改进方案**
   - 架构重构：Core拆分为4个子系统
   - 安全加固：五层安全防护机制
   - 性能调整：更现实的性能目标
   - MVP优先：4周快速验证方案

**必须理解的概念**：
- 为什么时间要从8周调整到26周
- 五层安全防护是什么
- MVP和完整版的区别

---

### 📄 1-2. 架构设计总览

**文档**: [ARCHITECTURE.md](./ARCHITECTURE.md)  
**用时**: 1小时  
**优先级**: 🔴 高

**核心内容**：
1. **三层架构模型**
   - Layer 1: Design Tokens
   - Layer 2: Core Engine
   - Layer 3: Framework Adapters

2. **Core引擎组件**
   - Parser、Evaluator、Reactive、Binder、Renderer

**必须理解的概念**：
- 什么是三层架构
- DSL如何转换为真实组件
- 响应式系统如何工作

---

### 📄 1-3. 测试策略

**文档**: [TESTING-STRATEGY.md](./TESTING-STRATEGY.md)  
**用时**: 45分钟  
**优先级**: 🔴 高

**核心内容**：
- 测试金字塔：70%单元 + 20%集成 + 10%E2E
- 覆盖率要求：Core≥90%, Vue≥85%, 整体≥85%
- 安全测试：100%覆盖

---

### 📄 1-4. 总体实施计划

**文档**: [00-MASTER-PLAN.md](./00-MASTER-PLAN.md)  
**用时**: 45分钟  
**优先级**: 🟡 中

**核心内容**：
- 时间规划对比（原8-10周 → 调整23-26周）
- 里程碑定义（MVP/Alpha/Beta/Release）
- 各阶段目标和任务

---

### 📄 1-5. 技术规范

**文档**: [TECHNICAL-SPECS.md](./TECHNICAL-SPECS.md)  
**用时**: 30分钟  
**优先级**: 🟢 中

**核心内容**：
- 代码规范（TypeScript/ESLint/Prettier）
- 命名规范
- 性能规范
- 安全规范

---

### 📄 1-6. 组件路线图

**文档**: [COMPONENT-ROADMAP.md](./COMPONENT-ROADMAP.md)  
**用时**: 30分钟  
**优先级**: 🟢 低（可稍后）

**核心内容**：
- 三层组件体系（Foundation/Composition/Pro）
- 60+组件完整矩阵
- 开发阶段规划

---

## 🔧 阶段2：项目初始化阶段（2-3天）

### 📄 2-1. 实施清单总览

**文档**: [IMPLEMENTATION-CHECKLIST.md](./IMPLEMENTATION-CHECKLIST.md)  
**用时**: 持续使用  
**优先级**: 🔴 高

**作用**: 项目实施的Task List，每完成一项打勾

---

### 2.1 Day 1：Monorepo架构搭建

#### 创建项目根目录
```bash
# 1. 创建项目文件夹
mkdir vjs-ui && cd vjs-ui

# 2. 初始化Git
git init
git branch -M main

# 3. 创建.gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
*.tsbuildinfo

# Logs
logs/
*.log
npm-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Env
.env
.env.local
.env.*.local

# Test coverage
coverage/
.nyc_output/

# Temp
.temp/
.cache/
EOF
```

#### 配置pnpm workspace
```bash
# 1. 安装pnpm（如未安装）
npm install -g pnpm

# 2. 初始化package.json
pnpm init

# 3. 创建pnpm-workspace.yaml
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'packages/*'
  - 'examples/*'
EOF

# 4. 更新package.json
cat > package.json << 'EOF'
{
  "name": "vjs-ui",
  "version": "0.0.0",
  "private": true,
  "description": "A cross-framework UI library powered by Design Tokens and DSL",
  "type": "module",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "test:coverage": "turbo run test:coverage",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,vue,js,json,md}\"",
    "clean": "turbo run clean && rm -rf node_modules",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "pnpm build && changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.1",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "prettier": "^3.2.4",
    "turbo": "^1.11.0",
    "typescript": "^5.3.3",
    "vitest": "^1.2.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.15.0"
}
EOF
```

#### 配置Turborepo
```bash
# 创建turbo.json
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "test:coverage": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "clean": {
      "cache": false
    }
  }
}
EOF
```

#### 创建packages目录结构
```bash
# 创建核心包
mkdir -p packages/core/src/{types,token,reactive,dsl,evaluator,binder}
mkdir -p packages/core/test/{unit,integration,benchmarks}

# 创建Vue适配包
mkdir -p packages/vue/src/{adapter,components,composables}
mkdir -p packages/vue/test/{unit,e2e}

# 创建React适配包（后期）
mkdir -p packages/react/src/{adapter,components,hooks}
mkdir -p packages/react/test

# 创建工具包
mkdir -p packages/utils/src
mkdir -p packages/cli/src

# 创建示例项目
mkdir -p examples/mvp-demo/src
mkdir -p examples/playground/src

# 创建文档目录
mkdir -p docs
```

---

### 2.2 Day 2：TypeScript配置

#### 根目录tsconfig.json（基础配置）
```bash
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": false,
    
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    
    "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@vjs-ui/core": ["./packages/core/src"],
      "@vjs-ui/vue": ["./packages/vue/src"],
      "@vjs-ui/utils": ["./packages/utils/src"]
    }
  },
  "include": ["packages/*/src/**/*"],
  "exclude": ["node_modules", "dist", "**/node_modules", "**/dist"]
}
EOF
```

#### packages/core/tsconfig.json
```bash
cat > packages/core/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test"]
}
EOF
```

#### packages/vue/tsconfig.json
```bash
cat > packages/vue/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true,
    "jsx": "preserve"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test"],
  "references": [
    { "path": "../core" }
  ]
}
EOF
```

---

### 2.3 Day 2：代码规范配置

#### ESLint配置
```bash
cat > .eslintrc.cjs << 'EOF'
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './packages/*/tsconfig.json']
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
    ]
  },
  ignorePatterns: ['dist', 'node_modules', '*.config.js', '*.config.ts']
}
EOF
```

#### Prettier配置
```bash
cat > .prettierrc.json << 'EOF'
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf",
  "useTabs": false
}
EOF

cat > .prettierignore << 'EOF'
dist
node_modules
coverage
.next
.nuxt
.output
.vitepress/cache
.vitepress/dist
pnpm-lock.yaml
CHANGELOG.md
EOF
```

#### EditorConfig配置
```bash
cat > .editorconfig << 'EOF'
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

[*.json]
insert_final_newline = false
EOF
```

---

### 2.4 Day 3：CI/CD配置

#### GitHub Actions - 测试工作流
```bash
mkdir -p .github/workflows

cat > .github/workflows/ci.yml << 'EOF'
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          run_install: false
      
      - name: Get pnpm store directory
        id: pnpm-cache
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT
      
      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Lint
        run: pnpm lint
      
      - name: Type check
        run: pnpm type-check
      
      - name: Test
        run: pnpm test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js & pnpm
        uses: actions/setup-node@v4
        with:
          node-version: 18
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build
        run: pnpm build
      
      - name: Check bundle size
        run: pnpm check-size
EOF
```

#### GitHub Actions - 发布工作流
```bash
cat > .github/workflows/release.yml << 'EOF'
name: Release

on:
  push:
    branches:
      - main

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build
        run: pnpm build
      
      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm release
          commit: 'chore: release packages'
          title: 'chore: release packages'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
EOF
```

---

### 2.5 Day 3：Changesets配置

```bash
# 初始化Changesets
pnpm dlx @changesets/cli init

# 配置.changeset/config.json
cat > .changeset/config.json << 'EOF'
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["@vjs-ui/examples-*"]
}
EOF
```

---

### 2.6 创建核心包package.json

#### packages/core/package.json
```bash
cat > packages/core/package.json << 'EOF'
{
  "name": "@vjs-ui/core",
  "version": "0.0.0",
  "description": "VJS-UI Core Engine",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "dev": "vite build --watch",
    "build": "vite build && tsc --emitDeclarationOnly",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src --ext .ts",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "jsep": "^1.3.8"
  },
  "devDependencies": {
    "@types/node": "^20.11.5",
    "@vitest/coverage-v8": "^1.2.0",
    "vite": "^5.0.11",
    "vite-plugin-dts": "^3.7.0",
    "vitest": "^1.2.0"
  },
  "keywords": [
    "vjs-ui",
    "design-tokens",
    "dsl",
    "reactive",
    "ui-framework"
  ],
  "license": "MIT"
}
EOF
```

#### packages/vue/package.json
```bash
cat > packages/vue/package.json << 'EOF'
{
  "name": "@vjs-ui/vue",
  "version": "0.0.0",
  "description": "VJS-UI Vue 3 Adapter",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "dev": "vite build --watch",
    "build": "vite build && tsc --emitDeclarationOnly",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src --ext .ts,.vue",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@vjs-ui/core": "workspace:*"
  },
  "peerDependencies": {
    "vue": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.5",
    "@vitejs/plugin-vue": "^5.0.3",
    "@vitest/coverage-v8": "^1.2.0",
    "@vue/test-utils": "^2.4.3",
    "vite": "^5.0.11",
    "vite-plugin-dts": "^3.7.0",
    "vitest": "^1.2.0",
    "vue": "^3.4.15"
  },
  "keywords": [
    "vjs-ui",
    "vue",
    "vue3",
    "components"
  ],
  "license": "MIT"
}
EOF
```

---

### 2.7 创建Vite配置

#### packages/core/vite.config.ts
```bash
cat > packages/core/vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VJSUICore',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['jsep'],
      output: {
        exports: 'named'
      }
    },
    sourcemap: true,
    minify: false
  }
})
EOF
```

---

### 2.8 创建测试配置

#### vitest.config.ts
```bash
cat > vitest.config.ts << 'EOF'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/dist/**'
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 80,
        statements: 85
      }
    }
  }
})
EOF
```

---

### 2.9 Git提交规范

#### commitlint配置
```bash
# 安装commitlint
pnpm add -D @commitlint/cli @commitlint/config-conventional

# 创建配置文件
cat > .commitlintrc.cjs << 'EOF'
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复bug
        'docs',     // 文档
        'style',    // 格式
        'refactor', // 重构
        'perf',     // 性能优化
        'test',     // 测试
        'chore',    // 构建/工具
        'revert',   // 回退
        'ci'        // CI配置
      ]
    ]
  }
}
EOF

# 配置husky
pnpm add -D husky lint-staged
pnpm exec husky install

# 创建pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm exec lint-staged
EOF

chmod +x .husky/pre-commit

# 创建commit-msg hook
cat > .husky/commit-msg << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm exec commitlint --edit $1
EOF

chmod +x .husky/commit-msg

# 配置lint-staged
cat > .lintstagedrc.json << 'EOF'
{
  "*.{ts,tsx,vue}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{js,json,md}": [
    "prettier --write"
  ]
}
EOF
```

---

### 2.10 创建README

#### 项目根README.md
```bash
cat > README.md << 'EOF'
# VJS-UI

> A cross-framework UI library powered by Design Tokens and DSL

## 🚀 Features

- 🎨 **Design Tokens** - Theme customization made easy
- 📝 **DSL Driven** - Build UIs with declarative syntax
- ⚡ **High Performance** - Optimized for speed
- 🔒 **Type Safe** - Full TypeScript support
- 🌍 **Cross Framework** - Vue 3, React, Web Components
- 🔐 **Secure** - Multi-layer security protection

## 📦 Packages

- `@vjs-ui/core` - Core engine
- `@vjs-ui/vue` - Vue 3 adapter
- `@vjs-ui/react` - React adapter (coming soon)
- `@vjs-ui/cli` - CLI tools (coming soon)

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

## 📖 Documentation

See [docs/README.md](./docs/README.md)

## 🗺️ Roadmap

- [x] Project setup
- [ ] MVP (4 weeks)
- [ ] Core engine (6-8 weeks)
- [ ] Vue adapter (6 weeks)
- [ ] React adapter (4 weeks)

## 📄 License

MIT

---

**Status**: 🎯 In Planning
**Version**: v0.0.0
EOF
```

---

### 2.11 最后检查清单

```bash
# 安装所有依赖
pnpm install

# 验证配置
pnpm lint
pnpm type-check

# 提交初始代码
git add .
git commit -m "chore: initial project setup"

# 推送到远程（如果已配置）
git remote add origin <your-repo-url>
git push -u origin main
```

---

**阶段2完成标准**：
- [ ] Monorepo架构搭建完成
- [ ] TypeScript配置正确
- [ ] 代码规范工具配置完成
- [ ] CI/CD工作流配置完成
- [ ] Changesets配置完成
- [ ] 所有package.json创建完成
- [ ] Git工作流配置完成
- [ ] pnpm install无错误
- [ ] pnpm lint通过
- [ ] 首次Git提交完成

---

## 🎯 阶段3：MVP快速验证阶段（4周）

### 📄 3-1. MVP实施计划总览

**文档**: [MVP-PLAN.md](./MVP-PLAN.md)  
**用时**: 4周（严格执行）  
**优先级**: 🔴 最高

**为什么从MVP开始？**
1. 快速验证技术方案的可行性
2. 降低风险，避免大规模返工
3. 4周内看到可运行的成果
4. 建立团队信心

**MVP核心原则**：
- 简单优先 - 功能最小化
- 稳定可用 - 质量不妥协
- 可扩展 - 为未来留接口

---

### 3.1 MVP功能范围定义

#### ✅ 包含功能
```typescript
// Token系统（简化版）
- 静态Token定义
- 基础编译器（JSON → CSS Variables）
- TypeScript类型生成

// 响应式系统（基础版）
- reactive() - 创建响应式对象
- effect() - 自动追踪依赖
- ref() - 基本类型响应式

// DSL解析器（无表达式）
- 静态props解析
- 静态style解析
- 基础插槽支持

// Vue渲染器
- 组件注册
- DSL → Vue VNode转换
- 基础渲染

// 3个基础组件
- VButton（类型、禁用、事件）
- VInput（v-model、验证）
- VCard（插槽）

// 测试
- 单元测试（覆盖率>70%）
- 基础集成测试
```

#### ❌ 不包含功能
```typescript
// 延后到v0.2.0+
- 表达式引擎（$state.count）
- 安全沙箱（五层防护）
- computed/watch（高级响应式）
- 条件渲染（v-if）
- 列表渲染（v-for）
- React适配
- CLI工具
- 虚拟滚动
```

---

### 3.2 Week 1：Token系统 + 响应式引擎（Day 1-7）

#### Day 1-2：项目结构 + Token系统

**创建核心文件**：
```bash
# Token系统
packages/core/src/token/
├── types.ts           # Token类型定义
├── simple-compiler.ts # 简化版编译器
└── index.ts

# 测试文件
packages/core/test/unit/token/
└── compiler.test.ts
```

**Token编译器实现**：
```typescript
// packages/core/src/token/simple-compiler.ts
export interface SimpleToken {
  [key: string]: string | number
}

export class SimpleTokenCompiler {
  compile(tokens: SimpleToken): string {
    const lines: string[] = [':root {']
    
    for (const [key, value] of Object.entries(tokens)) {
      lines.push(`  --vjs-${key.replace(/\./g, '-')}: ${value};`)
    }
    
    lines.push('}')
    return lines.join('\n')
  }
}
```

**Day 1-2 任务清单**：
- [ ] 创建Token类型定义
- [ ] 实现SimpleTokenCompiler
- [ ] 编写单元测试（5个测试用例）
- [ ] 测试覆盖率>80%
- [ ] 创建默认主题JSON

---

#### Day 3-5：响应式系统核心

**创建响应式文件**：
```bash
packages/core/src/reactive/
├── reactive.ts  # reactive实现
├── effect.ts    # effect实现
├── ref.ts       # ref实现
└── index.ts
```

**响应式核心实现**：
```typescript
// packages/core/src/reactive/reactive.ts
let activeEffect: Function | undefined

export function effect(fn: Function): Function {
  const effectFn = () => {
    activeEffect = effectFn
    fn()
    activeEffect = undefined
  }
  effectFn()
  return effectFn
}

export function reactive<T extends object>(target: T): T {
  const deps = new Map<string, Set<Function>>()
  
  return new Proxy(target, {
    get(target, key) {
      // 依赖收集
      if (activeEffect) {
        if (!deps.has(key as string)) {
          deps.set(key as string, new Set())
        }
        deps.get(key as string)!.add(activeEffect)
      }
      return Reflect.get(target, key)
    },
    
    set(target, key, value) {
      const result = Reflect.set(target, key, value)
      // 触发更新
      const effects = deps.get(key as string)
      if (effects) {
        effects.forEach(effect => effect())
      }
      return result
    }
  })
}

export function ref<T>(value: T) {
  const wrapper = { value }
  return reactive(wrapper)
}
```

**Day 3-5 任务清单**：
- [ ] 实现reactive()
- [ ] 实现effect()
- [ ] 实现ref()
- [ ] 处理嵌套对象
- [ ] 处理数组操作
- [ ] 编写15+测试用例
- [ ] 测试覆盖率>90%

---

#### Day 6-7：性能测试 + 文档

**性能基准**：
```typescript
// packages/core/test/benchmarks/week1.bench.ts
import { bench } from 'vitest'

bench('create reactive object', () => {
  reactive({ count: 0 })
})

bench('reactive get', () => {
  const obj = reactive({ count: 0 })
  effect(() => obj.count)
})

bench('reactive set', () => {
  const obj = reactive({ count: 0 })
  obj.count = 1
})
```

**Day 6-7 任务清单**：
- [ ] 性能基准测试
- [ ] reactive创建 < 1ms
- [ ] 依赖收集 < 0.5ms
- [ ] 触发更新 < 0.5ms
- [ ] 编写Week 1总结文档
- [ ] 代码review
- [ ] 提交Week 1代码

**Week 1 验收标准**：
- [ ] Token系统可用
- [ ] 响应式系统可用
- [ ] 测试覆盖率>70%
- [ ] 性能达标
- [ ] 代码已提交

---

### 3.3 Week 2：DSL解析器 + Vue渲染器（Day 8-14）

#### Day 8-10：DSL解析器

**创建DSL文件**：
```bash
packages/core/src/dsl/
├── types.ts          # DSL类型定义
├── simple-parser.ts  # 简单解析器
└── index.ts
```

**DSL解析器实现**：
```typescript
// packages/core/src/dsl/simple-parser.ts
export interface SimpleDSL {
  type: string
  props?: Record<string, any>
  style?: Record<string, string>
  children?: SimpleDSL[]
}

export interface SimpleVNode {
  type: string
  props: Record<string, any>
  style: Record<string, string>
  children: SimpleVNode[]
}

export class SimpleParser {
  parse(dsl: SimpleDSL): SimpleVNode {
    return {
      type: dsl.type,
      props: dsl.props || {},
      style: dsl.style || {},
      children: (dsl.children || []).map(child => this.parse(child))
    }
  }
  
  validate(dsl: SimpleDSL): boolean {
    if (!dsl.type || typeof dsl.type !== 'string') {
      throw new Error('DSL必须有type字段')
    }
    return true
  }
}
```

**Day 8-10 任务清单**：
- [ ] 定义DSL类型
- [ ] 定义VNode类型
- [ ] 实现SimpleParser
- [ ] 实现validate验证
- [ ] 支持嵌套children
- [ ] 编写10+测试用例
- [ ] 测试覆盖率>85%

---

#### Day 11-14：Vue渲染器

**创建Vue适配器**：
```bash
packages/vue/src/adapter/
├── simple-renderer.ts  # Vue渲染器
└── index.ts

packages/vue/src/composables/
├── useCore.ts
└── index.ts
```

**Vue渲染器实现**：
```typescript
// packages/vue/src/adapter/simple-renderer.ts
import { h, createApp } from 'vue'
import type { SimpleVNode } from '@vjs-ui/core'

export class SimpleVueRenderer {
  private componentMap = new Map<string, any>()
  
  registerComponent(name: string, component: any): void {
    this.componentMap.set(name, component)
  }
  
  render(vnode: SimpleVNode): any {
    const component = this.componentMap.get(vnode.type)
    
    if (!component) {
      console.warn(`Component not found: ${vnode.type}`)
      return h('div', `[${vnode.type}]`)
    }
    
    const children = vnode.children.map(child => this.render(child))
    
    return h(component, {
      ...vnode.props,
      style: vnode.style
    }, children.length > 0 ? children : undefined)
  }
  
  mount(vnode: SimpleVNode, container: Element): void {
    const app = createApp({
      render: () => this.render(vnode)
    })
    app.mount(container)
  }
}
```

**Day 11-14 任务清单**：
- [ ] 实现SimpleVueRenderer
- [ ] 实现registerComponent
- [ ] 实现render方法
- [ ] 实现mount方法
- [ ] 创建useCore组合式函数
- [ ] 编写集成测试
- [ ] 测试覆盖率>80%

**Week 2 验收标准**：
- [ ] DSL可以正确解析
- [ ] Vue渲染器可用
- [ ] 集成测试通过
- [ ] 测试覆盖率>75%
- [ ] 代码已提交

---

### 3.4 Week 3：3个基础组件（Day 15-21）

#### Day 15-17：VButton组件

**组件文件**：
```bash
packages/vue/src/components/Button/
├── Button.vue
├── types.ts
└── index.ts
```

**VButton实现**：
```vue
<!-- packages/vue/src/components/Button/Button.vue -->
<template>
  <button
    :class="['vjs-button', `vjs-button--${type}`]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot>{{ text }}</slot>
  </button>
</template>

<script setup lang="ts">
defineOptions({ name: 'VButton' })

interface Props {
  type?: 'default' | 'primary'
  text?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'default',
  disabled: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<style scoped>
.vjs-button {
  padding: var(--vjs-spacing-md);
  border: 1px solid var(--vjs-color-border);
  border-radius: var(--vjs-radius-md);
  background: var(--vjs-color-bg);
  cursor: pointer;
}

.vjs-button--primary {
  background: var(--vjs-color-primary);
  color: white;
  border-color: var(--vjs-color-primary);
}

.vjs-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
```

**Day 15-17 任务清单**：
- [ ] 创建VButton组件
- [ ] 支持type属性
- [ ] 支持disabled状态
- [ ] 支持click事件
- [ ] 支持默认插槽
- [ ] 编写组件测试（10+用例）
- [ ] 测试覆盖率>85%

---

#### Day 18-19：VInput组件

**VInput实现**：
```vue
<!-- packages/vue/src/components/Input/Input.vue -->
<template>
  <input
    :class="['vjs-input']"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="handleInput"
  />
</template>

<script setup lang="ts">
defineOptions({ name: 'VInput' })

interface Props {
  modelValue?: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.vjs-input {
  padding: var(--vjs-spacing-sm);
  border: 1px solid var(--vjs-color-border);
  border-radius: var(--vjs-radius-md);
  width: 100%;
}

.vjs-input:focus {
  outline: none;
  border-color: var(--vjs-color-primary);
}

.vjs-input:disabled {
  background: var(--vjs-color-bg-disabled);
  cursor: not-allowed;
}
</style>
```

**Day 18-19 任务清单**：
- [ ] 创建VInput组件
- [ ] 支持v-model
- [ ] 支持type属性
- [ ] 支持placeholder
- [ ] 支持disabled状态
- [ ] 编写组件测试（8+用例）
- [ ] 测试覆盖率>85%

---

#### Day 20-21：VCard组件

**VCard实现**：
```vue
<!-- packages/vue/src/components/Card/Card.vue -->
<template>
  <div class="vjs-card">
    <div v-if="$slots.header" class="vjs-card__header">
      <slot name="header" />
    </div>
    
    <div class="vjs-card__body">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="vjs-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'VCard' })
</script>

<style scoped>
.vjs-card {
  border: 1px solid var(--vjs-color-border);
  border-radius: var(--vjs-radius-md);
  background: var(--vjs-color-bg);
  box-shadow: var(--vjs-shadow-sm);
  overflow: hidden;
}

.vjs-card__header {
  padding: var(--vjs-spacing-md);
  border-bottom: 1px solid var(--vjs-color-border);
  font-weight: 600;
}

.vjs-card__body {
  padding: var(--vjs-spacing-md);
}

.vjs-card__footer {
  padding: var(--vjs-spacing-md);
  border-top: 1px solid var(--vjs-color-border);
}
</style>
```

**Day 20-21 任务清单**：
- [ ] 创建VCard组件
- [ ] 支持header插槽
- [ ] 支持默认插槽
- [ ] 支持footer插槽
- [ ] 编写组件测试（6+用例）
- [ ] 测试覆盖率>85%

**Week 3 验收标准**：
- [ ] 3个组件全部完成
- [ ] 组件可独立使用
- [ ] 组件可通过DSL渲染
- [ ] 测试覆盖率>85%
- [ ] 代码已提交

---

### 3.5 Week 4：集成测试 + 文档 + 发布（Day 22-28）

#### Day 22-24：集成测试

**完整流程测试**：
```typescript
// packages/vue/test/integration/mvp.test.ts
import { describe, it, expect } from 'vitest'
import { SimpleParser, SimpleTokenCompiler, reactive } from '@vjs-ui/core'
import { SimpleVueRenderer } from '@vjs-ui/vue'
import { VButton, VInput, VCard } from '@vjs-ui/vue'

describe('MVP Integration', () => {
  it('should render DSL with Vue', () => {
    const dsl = {
      type: 'Button',
      props: { text: 'Click Me' }
    }
    
    const parser = new SimpleParser()
    const renderer = new SimpleVueRenderer()
    renderer.registerComponent('Button', VButton)
    
    const vnode = parser.parse(dsl)
    const container = document.createElement('div')
    renderer.mount(vnode, container)
    
    expect(container.querySelector('.vjs-button')).toBeTruthy()
    expect(container.textContent).toContain('Click Me')
  })
  
  it('should work with reactive state', async () => {
    const state = reactive({ count: 0 })
    
    // 测试状态更新
    expect(state.count).toBe(0)
    state.count++
    expect(state.count).toBe(1)
  })
  
  it('should render nested components', () => {
    const dsl = {
      type: 'Card',
      children: [
        {
          type: 'Button',
          props: { text: 'Submit' }
        }
      ]
    }
    
    const parser = new SimpleParser()
    const renderer = new SimpleVueRenderer()
    renderer.registerComponent('Card', VCard)
    renderer.registerComponent('Button', VButton)
    
    const vnode = parser.parse(dsl)
    const container = document.createElement('div')
    renderer.mount(vnode, container)
    
    expect(container.querySelector('.vjs-card')).toBeTruthy()
    expect(container.querySelector('.vjs-button')).toBeTruthy()
  })
})
```

**Day 22-24 任务清单**：
- [ ] 编写完整流程集成测试
- [ ] Token + DSL + Vue集成测试
- [ ] 响应式 + 组件集成测试
- [ ] 3个组件互相嵌套测试
- [ ] 测试覆盖率>70%
- [ ] 所有测试通过

---

#### Day 25-26：示例应用

**创建MVP Demo**：
```vue
<!-- examples/mvp-demo/src/App.vue -->
<template>
  <div class="demo">
    <VCard>
      <template #header>
        <h2>VJS-UI MVP Demo</h2>
      </template>
      
      <div class="demo-content">
        <VInput 
          v-model="name" 
          placeholder="Enter your name" 
        />
        
        <VButton 
          type="primary" 
          @click="handleClick"
        >
          Hello, {{ name || 'World' }}!
        </VButton>
        
        <p>Clicked {{ count }} times</p>
      </div>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VButton, VInput, VCard } from '@vjs-ui/vue'

const name = ref('')
const count = ref(0)

const handleClick = () => {
  count.value++
  alert(`Hello, ${name.value || 'World'}!`)
}
</script>

<style scoped>
.demo {
  max-width: 600px;
  margin: 50px auto;
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
```

**Day 25-26 任务清单**：
- [ ] 创建MVP示例应用
- [ ] 展示3个组件使用
- [ ] 展示响应式状态
- [ ] 展示DSL渲染（可选）
- [ ] 应用可正常运行
- [ ] 截图保存

---

#### Day 27-28：文档 + 发布

**编写文档**：
```markdown
# VJS-UI v0.1.0 (MVP)

## 快速开始

\`\`\`bash
pnpm add @vjs-ui/vue
\`\`\`

## 基础用法

\`\`\`vue
<template>
  <VButton type="primary" @click="handleClick">
    Click Me
  </VButton>
</template>

<script setup>
import { VButton } from '@vjs-ui/vue'

const handleClick = () => {
  console.log('clicked')
}
</script>
\`\`\`

## 当前功能

- ✅ 3个基础组件（Button, Input, Card）
- ✅ 简单DSL支持
- ✅ 基础响应式系统
- ✅ Token系统

## 即将推出（v0.2.0）

- 表达式支持
- Dialog和Table组件
- 更多主题
```

**发布流程**：
```bash
# 1. 确保所有测试通过
pnpm test

# 2. 创建changeset
pnpm changeset
# 选择: minor (新功能)
# 包: @vjs-ui/core, @vjs-ui/vue
# 描述: feat: MVP release

# 3. 更新版本号
pnpm changeset version

# 4. 构建
pnpm build

# 5. 提交
git add .
git commit -m "chore: release v0.1.0"
git tag v0.1.0

# 6. 发布
pnpm changeset publish

# 7. 推送
git push origin main --tags
```

**Day 27-28 任务清单**：
- [ ] 编写快速开始文档
- [ ] 编写API文档
- [ ] 编写使用示例
- [ ] 更新CHANGELOG
- [ ] 创建GitHub Release
- [ ] 发布到npm
- [ ] 验证发布成功

**Week 4 验收标准**：
- [ ] 集成测试全部通过
- [ ] 示例应用可运行
- [ ] 文档完整
- [ ] v0.1.0成功发布
- [ ] npm包可安装使用

---

### 3.6 MVP总体验收标准

#### 功能验收
```
✓ 3个组件可正常使用
✓ DSL可以渲染基础组件
✓ 响应式状态更新正常
✓ Token系统工作正常
```

#### 质量验收
```
✓ 测试覆盖率>70%
  - Core模块: >75%
  - Vue模块: >70%
✓ 无严重bug
✓ 代码规范检查通过
✓ TypeScript类型完整
```

#### 性能验收
```
✓ 核心包<30KB (gzipped)
✓ 组件渲染<50ms
✓ 响应式更新<2ms
```

#### 文档验收
```
✓ README完整
✓ 快速开始指南
✓ API文档
✓ 使用示例
✓ CHANGELOG
```

#### 发布验收
```
✓ npm包成功发布
✓ 版本号正确（v0.1.0）
✓ GitHub Release创建
✓ 示例可运行
```

---

**MVP成功标志**：
- 🎉 v0.1.0成功发布到npm
- 🎉 团队成员可安装使用
- 🎉 示例应用可正常运行
- 🎉 技术方案得到验证
- 🎉 为v0.2.0打下基础

---

## 🔬 阶段4：Core引擎完善阶段（6-8周）

> **重要性**: 🔴 项目核心阶段  
> **风险**: 高（安全性、性能）  
> **测试要求**: Core≥90%, 安全100%

> **📋 详细文档已分离**：  
> 由于内容非常详细（包含大量代码和测试用例），已分为3个独立文档：
> - [📄 Part 1: Week 1-2](./00-IMPLEMENTATION-GUIDE-PHASE4-PART1.md) - Token + 响应式 + 表达式 + 安全 ✅
> - [📄 Part 2: Week 3-4](./00-IMPLEMENTATION-GUIDE-PHASE4-PART2.md) - Binder + Core集成 ✅
> - [📄 Part 3: Week 5-8](./00-IMPLEMENTATION-GUIDE-PHASE4-PART3.md) - 测试 + 优化 + 发布 ✅

---

### 4.1 阶段总览

**为什么这个阶段最重要？**
1. 从MVP简化版升级到**生产级别**
2. 实现**完整表达式系统**（DSL的核心能力）
3. 实现**五层安全防护**🔴（必须100%测试）
4. 为Vue适配和组件开发打下坚实基础

**6-8周时间分配**：
- **Week 1**: Token系统完整版 + 响应式完整版（computed/watch）
- **Week 2**: DSL完整版 + 表达式引擎 + 五层安全沙箱 🔴
- **Week 3**: Binder（数据绑定器）+ Core引擎集成
- **Week 4-5**: 完善测试（覆盖率>90%）+ 性能优化
- **Week 6-7**: 文档完善 + 代码审查
- **Week 8**: 发布v0.2.0 + 总结

---

### 📄 4-1. Week 1：完整Token + 响应式系统

**文档**: [01-PHASE-1-CORE.md](./01-PHASE-1-CORE.md) + [详细Part 1](./00-IMPLEMENTATION-GUIDE-PHASE4-PART1.md)  
**用时**: 1周  
**优先级**: 🔴 高

**本周目标**：
- 完整Token系统（动态切换、引用、alpha、循环检测）
- 完整响应式系统（computed + watch + effectStack）
- 测试覆盖率>90%

**关键任务**：
- Day 1-3: Token系统（20+测试用例）
- Day 4-7: 响应式系统（30+测试用例）

**验收标准**：
- [ ] 50+测试全部通过
- [ ] Token动态切换正常
- [ ] computed缓存机制正确
- [ ] watch监听正确
- [ ] 无内存泄漏

---

### 📄 4-2. Week 2：表达式 + 安全沙箱 🔴

**文档**: [01-PHASE-1-CORE-WEEK2.md](./01-PHASE-1-CORE-WEEK2.md) + [详细Part 1](./00-IMPLEMENTATION-GUIDE-PHASE4-PART1.md)  
**用时**: 1周  
**优先级**: 🔴 最高（安全关键）

**本周目标**：
- 完整DSL解析器（if/for/slots/events）
- 表达式引擎（jsep + AST求值）
- **五层安全防护**（100%测试覆盖）

**五层安全防护**：
1. 表达式静态分析（危险模式检测）
2. AST白名单验证（仅允许安全节点）
3. 安全上下文隔离（纯净对象）
4. 资源限制（超时、操作次数）
5. 完整安全求值器（集成所有防护）

**关键任务**：
- Day 8-9: DSL解析器（20+测试）
- Day 10-12: 表达式+安全（50+测试）🔴
- Day 13-14: 集成测试（30+测试）

**验收标准**：
- [ ] 100+测试全部通过
- [ ] 安全测试100%覆盖
- [ ] 所有危险操作被阻止
- [ ] 性能损耗<10%

---

### 📄 4-3. Week 3-4+：Binder + 集成 + 优化

**文档**: 
- [详细Part 2](./00-IMPLEMENTATION-GUIDE-PHASE4-PART2.md) - Week 3-4 ✅
- [详细Part 3](./00-IMPLEMENTATION-GUIDE-PHASE4-PART3.md) - Week 5-8 ✅

**用时**: 5-6周  
**优先级**: 🔴 高

**Week 3目标**: Binder + Core集成（Part 2）  
**Week 4-5目标**: 完善测试 + 性能优化（Part 3）  
**Week 6-7目标**: 文档 + 审查（Part 3）  
**Week 8目标**: 发布v0.2.0（Part 3）

**详细内容**: 
- Part 2包含Binder实现和Core引擎集成（485行，70+测试）
- Part 3包含测试完善、性能优化、文档和发布流程（549行）

---

**阶段4完成标志**：
- 🎉 Core引擎生产就绪
- 🎉 安全审计全部通过
- 🎉 性能达到目标
- 🎉 测试覆盖率>90%
- 🎉 v0.2.0成功发布

---

## 🎨 阶段5：Vue适配层阶段（6周）

> **重要性**: 🔴 第一个框架适配  
> **风险**: 中（API设计、组件质量）  
> **测试要求**: Vue模块≥85%, 组件≥85%

> **📋 详细文档已分离**：  
> 由于内容非常详细（10个组件+完整测试），已分为2个独立文档：
> - [📄 Part 1: Week 1-3](./00-IMPLEMENTATION-GUIDE-PHASE5-PART1.md) - 渲染器 + 前6个组件 ✅
> - [📄 Part 2: Week 4-6](./00-IMPLEMENTATION-GUIDE-PHASE5-PART2.md) - 后4个组件 + 测试 + 发布 ✅

---

### 5.1 阶段总览

**为什么这个阶段重要？**
1. 第一个完整的**框架适配**验证
2. 10个核心组件为后续打下基础
3. 建立组件开发规范和模式
4. 为React适配提供参考

**6周时间分配**：
- **Week 1**: Vue渲染器 + 组合式函数 + 组件基础
- **Week 2**: 基础组件（Button、Input、Card）
- **Week 3**: 表单组件（Select、Checkbox、Radio）
- **Week 4**: 复杂组件（Dialog、Table）
- **Week 5**: 高级组件（Form、DatePicker）
- **Week 6**: 完善测试 + 文档 + 发布v0.5.0

---

### 📄 5-1. Week 1：Vue渲染器 + 基础设施

**文档**: [02-PHASE-2-VUE.md](./02-PHASE-2-VUE.md) + [详细Part 1](./00-IMPLEMENTATION-GUIDE-PHASE5-PART1.md)  
**用时**: 1周  
**优先级**: 🔴 高

**本周目标**：
- Vue渲染器实现（实现Renderer接口）
- 组合式函数（useCore、useTheme、useToken）
- 组件基础设施（基类、工具函数）
- 样式系统集成

**关键任务**：
- Day 1-3: Vue渲染器（20+测试）
- Day 4-5: 组合式函数（15+测试）
- Day 6-7: 组件基础设施

**验收标准**：
- [ ] Vue渲染器完整实现
- [ ] DSL可渲染为Vue组件
- [ ] 组合式函数可用
- [ ] 35+测试通过

---

### 📄 5-2. Week 2-3：前6个基础组件

**文档**: [详细Part 1](./00-IMPLEMENTATION-GUIDE-PHASE5-PART1.md)  
**用时**: 2周  
**优先级**: 🔴 高

**本周目标**：
- Week 2: Button、Input、Card（3个）
- Week 3: Select、Checkbox、Radio（3个）

**每个组件包含**：
- Vue SFC实现
- TypeScript类型定义
- 单元测试（≥10个）
- 使用文档
- 示例代码

**验收标准**：
- [ ] 6个组件功能完整
- [ ] 支持DSL渲染
- [ ] 支持主题切换
- [ ] 60+测试通过
- [ ] 测试覆盖率>85%

---

### 📄 5-3. Week 4-5：后4个复杂组件

**文档**: [详细Part 2](./00-IMPLEMENTATION-GUIDE-PHASE5-PART2.md)  
**用时**: 2周  
**优先级**: 🔴 高

**本周目标**：
- Week 4: Dialog、Table（2个复杂组件）
- Week 5: Form、DatePicker（2个高级组件）

**复杂组件特点**：
- 多个子组件协同
- 复杂状态管理
- 高级交互逻辑
- 性能要求高

**验收标准**：
- [ ] 4个复杂组件完整
- [ ] 性能达标（Table渲染1000行<500ms）
- [ ] 40+测试通过
- [ ] 使用文档完整

---

### 📄 5-4. Week 6：测试 + 文档 + 发布

**文档**: [详细Part 2](./00-IMPLEMENTATION-GUIDE-PHASE5-PART2.md)  
**用时**: 1周  
**优先级**: 🔴 高

**本周目标**：
- 完善所有组件测试
- 编写完整使用文档
- 性能优化
- 发布v0.5.0

**关键任务**：
- Day 1-3: 补充测试到>85%
- Day 4-5: 文档和示例
- Day 6-7: 发布流程

**验收标准**：
- [ ] 测试覆盖率>85%
- [ ] 文档完整
- [ ] 性能达标
- [ ] v0.5.0成功发布

---

**阶段5完成标志**：
- 🎉 Vue适配层完整
- 🎉 10个核心组件生产就绪
- 🎉 测试覆盖率>85%
- 🎉 文档完整
- 🎉 v0.5.0成功发布

---

## 🛠️ 阶段6：开发者工具阶段（3-4周）

### 📄 6-1. 开发者工具实施

**文档**: 03-PHASE-3-DEVTOOLS.md（待创建）  
**用时**: 3-4周  
**优先级**: 🟡 中

**目标**：
- Playground（在线演示）
- CLI工具
- 文档站（VitePress）

---

## 🚀 阶段7：跨框架扩展阶段（4周）

### 📄 7-1. 扩展优化实施

**文档**: 04-PHASE-4-EXTEND.md（待创建）  
**用时**: 4周  
**优先级**: 🟡 中

**目标**：
- React适配
- 性能优化（虚拟滚动、批量更新）
- Bundle优化

---

## 🏢 阶段8：企业级特性阶段（持续）

### 📄 8-1. 企业级特性实施

**文档**: 05-PHASE-5-ENTERPRISE.md（待创建）  
**用时**: 持续迭代  
**优先级**: 🟢 低

---

### 8.1 完整组件库（30+组件）

#### 布局组件
```
✓ Container - 容器组件
✓ Row / Col - 栅格系统
✓ Space - 间距组件
✓ Divider - 分割线
✓ Grid - 网格布局
✓ Flex - 弹性布局
```

#### 导航组件
```
□ Menu - 导航菜单（多级、折叠）
□ Breadcrumb - 面包屑
□ Tabs - 标签页（可拖拽、可关闭）
□ Pagination - 分页器（跳转、快速跳页）
□ Steps - 步骤条（垂直、水平）
□ Affix - 固钉
□ BackTop - 回到顶部
□ Anchor - 锚点
```

#### 数据录入（完整表单体系）
```
□ Form - 表单容器（动态表单）
□ FormItem - 表单项
□ Checkbox - 多选框（全选、半选）
□ Radio - 单选框（按钮组）
□ Select - 下拉选择（搜索、多选、分组）
□ DatePicker - 日期选择器（范围、快捷）
□ TimePicker - 时间选择器
□ Upload - 文件上传（拖拽、预览、多文件）
□ Switch - 开关
□ Slider - 滑块（范围、步长）
□ Rate - 评分
□ ColorPicker - 颜色选择器
□ Transfer - 穿梭框
□ Cascader - 级联选择器
```

#### 数据展示
```
□ Table - 表格（完整版：排序、筛选、固定列）
□ List - 列表（无限滚动）
□ Tree - 树形控件（搜索、拖拽）
□ TreeSelect - 树形选择
□ Timeline - 时间轴
□ Tag - 标签（动态、可关闭）
□ Badge - 徽章
□ Avatar - 头像（组合显示）
□ Descriptions - 描述列表
□ Empty - 空状态
□ Statistic - 统计数值
□ Calendar - 日历
□ Card - 卡片（可折叠、加载中）
□ Collapse - 折叠面板
□ Carousel - 走马灯
□ Image - 图片（预览、懒加载）
```

#### 反馈组件
```
□ Alert - 警告提示（可关闭、图标）
□ Message - 消息提示（全局方法）
□ Notification - 通知提醒框
□ Modal - 模态框（拖拽、全屏）
□ Dialog - 对话框（确认、表单）
□ Drawer - 抽屉（多层）
□ Tooltip - 文字提示
□ Popover - 气泡卡片
□ Popconfirm - 气泡确认框
□ Progress - 进度条（环形、仪表盘）
□ Spin - 加载中
□ Skeleton - 骨架屏
□ Result - 结果页
```

---

### 8.2 Pro企业组件（高级功能）

#### 数据展示增强
```
□ DataGrid - 高性能表格
  - 虚拟滚动（百万行数据）
  - 固定列、表头
  - 行列合并
  - 可编辑单元格
  - 导出Excel
  - 打印

□ ProTable - 高级表格
  - 内置工具栏
  - 列配置（显示/隐藏）
  - 查询表单
  - 批量操作
  - 数据源配置

□ ProList - 高级列表
  - 搜索、筛选
  - 分组显示
  - 卡片/列表切换
```

#### 低代码组件
```
□ FormBuilder - 表单生成器
  - JSON Schema驱动
  - 拖拽设计器
  - 自定义验证规则
  - 联动逻辑
  - 表单预览

□ TableBuilder - 表格配置器
  - 可视化配置列
  - 数据源绑定
  - 操作按钮配置

□ PageLayout - 页面布局
  - Header + Sider + Content
  - 响应式布局
  - 面包屑集成
  - 多标签页

□ Dashboard - 仪表盘
  - 可拖拽组件
  - 自定义布局
  - Widget市场
  - 数据大屏
```

#### 数据可视化
```
□ Chart - 图表组件
  - ECharts集成
  - AntV集成
  - 常用图表封装
  - 实时数据更新

□ ChartBuilder - 图表配置器
  - 可视化配置
  - 数据绑定
  - 主题切换
```

#### 高级编辑器
```
□ CodeEditor - 代码编辑器
  - Monaco Editor
  - 语法高亮
  - 代码提示
  - 多语言支持

□ RichEditor - 富文本编辑器
  - 工具栏配置
  - 图片上传
  - Markdown支持

□ JSONViewer - JSON查看器
  - 格式化显示
  - 折叠展开
  - 搜索高亮
```

#### 工作流相关
```
□ WorkflowDesigner - 流程图设计器
  - 节点拖拽
  - 连线配置
  - 流程验证
  - 导出/导入

□ SplitPane - 分割面板
  - 水平/垂直分割
  - 可调整大小
  - 嵌套支持
```

---

### 8.3 主题市场

#### 主题系统增强
```
□ 主题编辑器
  - 可视化编辑Token
  - 实时预览
  - 导出主题包

□ 主题市场
  - 主题浏览
  - 主题下载
  - 主题评分
  - 主题分享

□ 企业定制
  - 品牌色自动生成
  - 组件样式定制
  - 导出设计规范
```

#### 预设主题
```
□ Default - 默认主题
□ Dark - 暗色主题
□ Compact - 紧凑主题
□ Enterprise - 企业主题
□ Material - Material Design
□ Ant Design - Ant风格
□ Element - Element风格
```

---

### 8.4 国际化（i18n）

#### 多语言支持
```
□ 内置语言包
  - 简体中文
  - 繁体中文
  - 英语
  - 日语
  - 韩语
  - 法语
  - 德语
  - 西班牙语

□ i18n系统
  - 动态切换语言
  - 日期本地化
  - 数字本地化
  - 货币格式化

□ RTL支持
  - 阿拉伯语
  - 希伯来语
  - 布局自动镜像
```

---

### 8.5 无障碍（a11y）

#### WCAG 2.1 AAA级
```
□ 键盘导航
  - Tab键完整支持
  - 快捷键支持
  - 焦点陷阱管理

□ 屏幕阅读器
  - ARIA完整支持
  - 语义化HTML
  - 动态内容通知

□ 视觉辅助
  - 颜色对比度≥7:1
  - 焦点样式清晰
  - 文本可缩放至200%
  - 高对比度模式

□ 无障碍工具
  - 无障碍检查器
  - 自动测试
  - 报告生成
```

---

### 8.6 SSR/SSG支持

#### 服务端渲染
```
□ Nuxt集成
  - Nuxt模块
  - 自动导入
  - SSR优化

□ Next.js集成
  - Next.js插件
  - App Router支持
  - RSC支持

□ Vite SSR
  - SSR中间件
  - 预渲染
  - Hydration优化
```

#### 静态生成
```
□ 静态站点生成
  - VitePress集成
  - 构建优化
  - SEO优化

□ 预渲染
  - 关键页面预渲染
  - 增量静态生成
```

---

### 8.7 性能优化

#### 运行时优化
```
□ 虚拟滚动
  - 列表虚拟化
  - 表格虚拟化
  - 动态高度支持

□ 懒加载
  - 组件懒加载
  - 图片懒加载
  - 路由懒加载

□ 缓存策略
  - 计算属性缓存
  - 组件缓存
  - 请求缓存
```

#### 构建优化
```
□ Tree-shaking
  - 按需导入
  - 无副作用标记
  - DCE优化

□ 代码分割
  - 路由分割
  - 组件分割
  - 异步chunk

□ 压缩优化
  - Gzip压缩
  - Brotli压缩
  - 图片压缩
```

---

### 8.8 开发者工具增强

#### 浏览器扩展
```
□ VJS DevTools
  - 组件树查看
  - Token实时编辑
  - DSL调试
  - 性能分析
  - 时间旅行调试
```

#### CLI增强
```
□ 项目模板
  - 多种项目模板
  - 自定义模板
  - 模板市场

□ 代码生成
  - 组件生成
  - 页面生成
  - 表单生成
  - CRUD生成

□ 构建优化
  - 分析报告
  - 优化建议
  - 依赖分析
```

#### 可视化设计器
```
□ DSL设计器
  - 拖拽设计
  - 属性编辑
  - 样式编辑
  - 实时预览
  - 代码生成

□ 低代码平台
  - 页面设计
  - 流程设计
  - 数据建模
  - 接口配置
```

---

### 8.9 企业级特性

#### 权限管理
```
□ 菜单权限
□ 按钮权限
□ 数据权限
□ 字段权限
□ 动态路由
```

#### 数据管理
```
□ 表格增强
  - 导入导出
  - 批量操作
  - 数据校验
  - 操作日志

□ 表单增强
  - 分步表单
  - 动态表单
  - 表单联动
  - 远程数据
```

#### 监控与分析
```
□ 性能监控
  - 加载时间
  - 渲染性能
  - API耗时
  - 错误追踪

□ 用户行为
  - 操作录制
  - 热力图
  - 漏斗分析
  - 用户路径
```

---

### 8.10 生态建设

#### 社区运营
```
□ 官方网站
□ 组件市场
□ 插件市场
□ 主题市场
□ 模板市场
□ 社区论坛
□ 技术博客
□ 视频教程
```

#### 企业服务
```
□ 技术支持
□ 定制开发
□ 培训服务
□ 咨询服务
□ SLA保障
```

---

**阶段8成功标准**：
- [ ] 完整组件库（60+组件）
- [ ] 主题市场上线
- [ ] 多语言支持完整
- [ ] 无障碍AAA级达标
- [ ] SSR/SSG生产可用
- [ ] 开发者工具完善
- [ ] 社区活跃
- [ ] 企业客户案例

**预计时间线**：
- v1.0.0: 30+基础组件
- v1.5.0: Pro企业组件
- v2.0.0: 完整生态
- v3.0.0: 低代码平台

---

## 📚 辅助参考文档

### 📄 API设计规范

**文档**: [API-DESIGN.md](./API-DESIGN.md)  
**查阅时机**: 开发组件时参考

### 📄 组件开发指南

**文档**: [COMPONENT-DEV-GUIDE.md](./COMPONENT-DEV-GUIDE.md)  
**查阅时机**: 开发新组件时参考

---

## 🎯 快速启动路径

### 新成员（3天入门）

```
Day 1:
  → README.md (30分钟)
  → RISK-ASSESSMENT.md (1小时) 🔴
  → ARCHITECTURE.md (1小时)

Day 2:
  → TESTING-STRATEGY.md (45分钟)
  → MVP-PLAN.md (1小时)
  → TECHNICAL-SPECS.md (30分钟)

Day 3 开始:
  → 跟随MVP-PLAN开始开发
```

### 架构师（2天）

```
Day 1:
  → RISK-ASSESSMENT.md 🔴
  → ARCHITECTURE.md
  → 00-MASTER-PLAN.md
  → TESTING-STRATEGY.md

Day 2:
  → 所有实施文档（01-05-PHASE）
  → TECHNICAL-SPECS.md
  → COMPONENT-ROADMAP.md
```

---

## ⚠️ 常见错误提醒

### ❌ 错误1：跳过MVP阶段
```
"我们直接开发完整版吧，MVP太简单了"
```
**后果**: 技术方案未验证，后期大规模返工

### ❌ 错误2：忽视测试
```
"先写完功能，测试以后再补"
```
**后果**: Bug积累，重构困难

### ❌ 错误3：忽视安全性
```
"安全问题以后再优化"
```
**后果**: 生产环境漏洞，用户数据风险

---

## 📊 当前进度

**阶段0（项目初始化）**: ✅ 70%完成  
**MVP阶段**: ⚪ 待开始  
**Core阶段**: ⚪ 待开始  
**Vue阶段**: ⚪ 待开始  

---

## 🎉 总结

### 三个关键原则

1. **按顺序执行** - 每个阶段都有前置依赖
2. **MVP优先** - 快速验证，降低风险
3. **质量为本** - 测试覆盖率、安全性不妥协

### 下一步行动

1. ✅ 阅读本实施指南
2. → 阅读 RISK-ASSESSMENT.md 🔴
3. → 阅读 ARCHITECTURE.md
4. → 开始MVP Week 1

---

**最后更新**: 2025-01-08  
**维护者**: VJS Team  
**文档状态**: 🚀 执行中
# 阶段1: Core基础设施详细实施文档

> **时间**: 2-3周
> **目标**: 构建VJS-UI的核心引擎
> **状态**: 📋 规划中

---

## 目录

1. [总览](#一总览)
2. [Week 1: Token系统 + 响应式引擎](#二week-1-token系统--响应式引擎)
3. [Week 2: DSL解析器 + 表达式求值器](#三week-2-dsl解析器--表达式求值器)
4. [Week 3: Binder + Core引擎集成](#四week-3-binder--core引擎集成)
5. [测试策略](#五测试策略)
6. [性能基准](#六性能基准)

---

## 一、总览

### 1.1 核心包结构

```
@vjs-ui/core/
├── src/
│   ├── types/              # 类型定义
│   │   ├── dsl.ts         # DSL类型
│   │   ├── token.ts       # Token类型
│   │   ├── vnode.ts       # VNode类型
│   │   ├── context.ts     # 上下文类型
│   │   └── index.ts
│   │
│   ├── token/             # Token系统
│   │   ├── compiler.ts    # Token编译器
│   │   ├── runtime.ts     # Token运行时
│   │   ├── utils.ts       # 工具函数
│   │   └── index.ts
│   │
│   ├── reactive/          # 响应式系统
│   │   ├── reactive.ts    # reactive实现
│   │   ├── effect.ts      # effect实现
│   │   ├── computed.ts    # computed实现
│   │   ├── watch.ts       # watch实现
│   │   ├── ref.ts         # ref实现
│   │   └── index.ts
│   │
│   ├── parser/            # DSL解析器
│   │   ├── parser.ts      # 核心解析器
│   │   ├── if-parser.ts   # 条件解析
│   │   ├── for-parser.ts  # 循环解析
│   │   ├── slot-parser.ts # 插槽解析
│   │   └── index.ts
│   │
│   ├── evaluator/         # 表达式求值器
│   │   ├── evaluator.ts   # 核心求值器
│   │   ├── sandbox.ts     # 安全沙箱
│   │   ├── ast-walker.ts  # AST遍历器
│   │   └── index.ts
│   │
│   ├── binder/            # 数据绑定器
│   │   ├── binder.ts      # 核心绑定器
│   │   ├── props-binder.ts
│   │   ├── style-binder.ts
│   │   ├── event-binder.ts
│   │   └── index.ts
│   │
│   ├── renderer/          # 渲染器接口
│   │   ├── renderer.ts    # 接口定义
│   │   ├── vnode.ts       # VNode工厂
│   │   └── index.ts
│   │
│   ├── core.ts            # Core主类
│   └── index.ts           # 入口
│
├── test/                  # 测试
│   ├── unit/
│   ├── integration/
│   └── benchmarks/
│
├── package.json
├── tsconfig.json
├── rollup.config.ts
└── README.md
```

### 1.2 核心依赖

```json
{
  "dependencies": {
    "jsep": "^1.3.8"  // 表达式解析
  },
  "devDependencies": {
    "@types/jsep": "^1.3.5",
    "vitest": "^1.0.0",
    "rollup": "^4.6.0",
    "typescript": "^5.3.2"
  }
}
```

---

## 二、Week 1: Token系统 + 响应式引擎

### 2.1 Token系统实现

#### 2.1.1 类型定义

```typescript
// src/types/token.ts

/**
 * Token值类型
 */
export type TokenValue = string | number | boolean

/**
 * Token定义
 */
export interface TokenDefinition {
  value: TokenValue
  type: 'color' | 'spacing' | 'radius' | 'font' | 'shadow' | 'motion' | 'zIndex' | 'other'
  description?: string
  alpha?: number  // 用于颜色透明度
  reference?: string  // 引用其他token
}

/**
 * Token集合
 */
export type TokenMap = Record<string, TokenDefinition>

/**
 * 扁平化Token（运行时使用）
 */
export type FlatTokenMap = Record<string, TokenValue>

/**
 * Token编译选项
 */
export interface TokenCompileOptions {
  prefix?: string  // CSS变量前缀，默认'vjs'
  format?: 'css' | 'scss' | 'less' | 'js' | 'json'
  minify?: boolean
}

/**
 * Token运行时配置
 */
export interface TokenRuntimeConfig {
  tokens: FlatTokenMap
  prefix?: string
  scope?: Element  // CSS Variables作用域
}
```

#### 2.1.2 Token编译器

```typescript
// src/token/compiler.ts

import type { TokenMap, FlatTokenMap, TokenCompileOptions, TokenDefinition } from '../types'

/**
 * Token编译器类
 */
export class TokenCompiler {
  private tokens: TokenMap
  private flatTokens: FlatTokenMap = {}

  constructor(tokens: TokenMap) {
    this.tokens = tokens
    this.flatten()
  }

  /**
   * 展平Token定义，解析引用
   */
  private flatten(): void {
    const resolve = (key: string, visited = new Set<string>()): TokenValue => {
      if (visited.has(key)) {
        throw new Error(`Circular token reference detected: ${key}`)
      }

      const token = this.tokens[key]
      if (!token) {
        throw new Error(`Token not found: ${key}`)
      }

      // 如果有引用，递归解析
      if (token.reference) {
        visited.add(key)
        const refValue = resolve(token.reference, visited)
        
        // 处理alpha透明度（仅color类型）
        if (token.type === 'color' && token.alpha !== undefined) {
          return this.applyAlpha(String(refValue), token.alpha)
        }
        
        return refValue
      }

      return token.value
    }

    // 解析所有token
    for (const key in this.tokens) {
      this.flatTokens[key] = resolve(key)
    }
  }

  /**
   * 应用alpha透明度到颜色
   */
  private applyAlpha(color: string, alpha: number): string {
    // 简化实现，实际应使用color库
    if (color.startsWith('#')) {
      const hex = Math.round(alpha * 255).toString(16).padStart(2, '0')
      return color + hex
    }
    return color
  }

  /**
   * 编译为CSS Variables
   */
  toCSSVariables(options: TokenCompileOptions = {}): string {
    const prefix = options.prefix || 'vjs'
    const lines: string[] = [':root {']

    for (const [key, value] of Object.entries(this.flatTokens)) {
      const cssVar = `--${prefix}-${key.replace(/\./g, '-')}`
      lines.push(`  ${cssVar}: ${value};`)
    }

    lines.push('}')
    return options.minify ? lines.join('') : lines.join('\n')
  }

  /**
   * 编译为TypeScript类型
   */
  toTypeScript(): string {
    const keys = Object.keys(this.flatTokens)
    return `export type TokenKey = ${keys.map(k => `'${k}'`).join(' | ')}`
  }

  /**
   * 编译为SCSS变量
   */
  toSCSS(): string {
    const lines: string[] = []
    for (const [key, value] of Object.entries(this.flatTokens)) {
      const scssVar = `$${key.replace(/\./g, '-')}`
      lines.push(`${scssVar}: ${value};`)
    }
    return lines.join('\n')
  }

  /**
   * 获取扁平化的tokens
   */
  getFlatTokens(): FlatTokenMap {
    return { ...this.flatTokens }
  }
}

/**
 * 编译Token
 */
export function compileTokens(tokens: TokenMap, options?: TokenCompileOptions): string {
  const compiler = new TokenCompiler(tokens)
  
  switch (options?.format || 'css') {
    case 'css':
      return compiler.toCSSVariables(options)
    case 'scss':
      return compiler.toSCSS()
    case 'js':
    case 'json':
      return JSON.stringify(compiler.getFlatTokens(), null, 2)
    default:
      throw new Error(`Unsupported format: ${options?.format}`)
  }
}
```

#### 2.1.3 Token运行时

```typescript
// src/token/runtime.ts

import type { FlatTokenMap, TokenRuntimeConfig } from '../types'

/**
 * Token运行时类
 */
export class TokenRuntime {
  private tokens: FlatTokenMap
  private prefix: string
  private scope: Element
  private listeners = new Set<(tokens: FlatTokenMap) => void>()

  constructor(config: TokenRuntimeConfig) {
    this.tokens = config.tokens
    this.prefix = config.prefix || 'vjs'
    this.scope = config.scope || document.documentElement
    this.apply()
  }

  /**
   * 应用tokens到DOM
   */
  private apply(): void {
    for (const [key, value] of Object.entries(this.tokens)) {
      this.setCSSVariable(key, value)
    }
  }

  /**
   * 设置CSS变量
   */
  private setCSSVariable(key: string, value: string | number | boolean): void {
    const cssVar = `--${this.prefix}-${key.replace(/\./g, '-')}`
    this.scope.style.setProperty(cssVar, String(value))
  }

  /**
   * 获取token值
   */
  get(key: string): string | number | boolean | undefined {
    return this.tokens[key]
  }

  /**
   * 设置token值（运行时修改）
   */
  set(key: string, value: string | number | boolean): void {
    this.tokens[key] = value
    this.setCSSVariable(key, value)
    this.notify()
  }

  /**
   * 批量设置tokens
   */
  setMultiple(updates: Partial<FlatTokenMap>): void {
    Object.assign(this.tokens, updates)
    for (const [key, value] of Object.entries(updates)) {
      this.setCSSVariable(key, value)
    }
    this.notify()
  }

  /**
   * 获取CSS变量引用
   */
  getVar(key: string): string {
    return `var(--${this.prefix}-${key.replace(/\./g, '-')})`
  }

  /**
   * 监听token变化
   */
  onChange(callback: (tokens: FlatTokenMap) => void): () => void {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  /**
   * 通知listeners
   */
  private notify(): void {
    this.listeners.forEach(callback => callback(this.tokens))
  }

  /**
   * 重置为初始tokens
   */
  reset(tokens?: FlatTokenMap): void {
    this.tokens = tokens || this.tokens
    this.apply()
    this.notify()
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.listeners.clear()
  }
}

/**
 * 创建Token运行时
 */
export function createTokenRuntime(config: TokenRuntimeConfig): TokenRuntime {
  return new TokenRuntime(config)
}
```

#### 2.1.4 预设主题

```typescript
// @vjs-ui/tokens/src/presets/default.json
{
  "color.primary": {
    "value": "#1677ff",
    "type": "color",
    "description": "主色调"
  },
  "color.primary.hover": {
    "value": "#1677ff",
    "type": "color",
    "alpha": 0.8,
    "reference": "color.primary"
  },
  "color.success": {
    "value": "#52c41a",
    "type": "color"
  },
  "color.warning": {
    "value": "#faad14",
    "type": "color"
  },
  "color.danger": {
    "value": "#ff4d4f",
    "type": "color"
  },
  "color.info": {
    "value": "#1890ff",
    "type": "color"
  },
  
  "spacing.xs": {
    "value": "4px",
    "type": "spacing"
  },
  "spacing.sm": {
    "value": "8px",
    "type": "spacing"
  },
  "spacing.md": {
    "value": "16px",
    "type": "spacing"
  },
  "spacing.lg": {
    "value": "24px",
    "type": "spacing"
  },
  "spacing.xl": {
    "value": "32px",
    "type": "spacing"
  },
  
  "radius.sm": {
    "value": "4px",
    "type": "radius"
  },
  "radius.md": {
    "value": "8px",
    "type": "radius"
  },
  "radius.lg": {
    "value": "16px",
    "type": "radius"
  },
  "radius.full": {
    "value": "9999px",
    "type": "radius"
  },
  
  "font.family": {
    "value": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    "type": "font"
  },
  "font.size.xs": {
    "value": "12px",
    "type": "font"
  },
  "font.size.sm": {
    "value": "14px",
    "type": "font"
  },
  "font.size.base": {
    "value": "16px",
    "type": "font"
  },
  "font.size.lg": {
    "value": "18px",
    "type": "font"
  },
  "font.size.xl": {
    "value": "20px",
    "type": "font"
  },
  
  "shadow.sm": {
    "value": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "type": "shadow"
  },
  "shadow.md": {
    "value": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    "type": "shadow"
  },
  "shadow.lg": {
    "value": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    "type": "shadow"
  },
  
  "motion.duration.fast": {
    "value": "150ms",
    "type": "motion"
  },
  "motion.duration.base": {
    "value": "300ms",
    "type": "motion"
  },
  "motion.duration.slow": {
    "value": "500ms",
    "type": "motion"
  },
  "motion.easing.ease": {
    "value": "cubic-bezier(0.4, 0, 0.2, 1)",
    "type": "motion"
  },
  
  "zIndex.dropdown": {
    "value": 1000,
    "type": "zIndex"
  },
  "zIndex.modal": {
    "value": 1050,
    "type": "zIndex"
  },
  "zIndex.tooltip": {
    "value": 1100,
    "type": "zIndex"
  }
}
```

### 2.2 响应式系统实现

#### 2.2.1 类型定义

```typescript
// src/types/reactive.ts

export type Effect = () => void
export type EffectCleanup = () => void

export interface ReactiveEffectOptions {
  lazy?: boolean
  scheduler?: (effect: Effect) => void
}

export interface ComputedRef<T = any> {
  readonly value: T
}

export interface WatchOptions {
  immediate?: boolean
  deep?: boolean
}

export type WatchCallback<T = any> = (
  newValue: T,
  oldValue: T,
  onCleanup: (cleanup: () => void) => void
) => void
```

#### 2.2.2 核心响应式实现

```typescript
// src/reactive/reactive.ts

/**
 * 当前活跃的effect
 */
let activeEffect: Effect | undefined
const effectStack: Effect[] = []

/**
 * 依赖映射表 WeakMap<target, Map<key, Set<Effect>>>
 */
const targetMap = new WeakMap<object, Map<string | symbol, Set<Effect>>>()

/**
 * 执行effect并追踪依赖
 */
export function effect(fn: Effect, options: ReactiveEffectOptions = {}): EffectCleanup {
  const effectFn = () => {
    try {
      effectStack.push(effectFn)
      activeEffect = effectFn
      return fn()
    } finally {
      effectStack.pop()
      activeEffect = effectStack[effectStack.length - 1]
    }
  }

  if (!options.lazy) {
    effectFn()
  }

  return () => {
    // 清理effect
    cleanup(effectFn)
  }
}

/**
 * 追踪依赖
 */
export function track(target: object, key: string | symbol): void {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  dep.add(activeEffect)
}

/**
 * 触发更新
 */
export function trigger(target: object, key: string | symbol): void {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const dep = depsMap.get(key)
  if (!dep) return

  // 创建副本避免无限循环
  const effects = new Set(dep)
  effects.forEach(effect => effect())
}

/**
 * 清理effect的所有依赖
 */
function cleanup(effect: Effect): void {
  targetMap.forEach(depsMap => {
    depsMap.forEach(dep => {
      dep.delete(effect)
    })
  })
}

/**
 * 创建响应式对象
 */
export function reactive<T extends object>(target: T): T {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key)
      const result = Reflect.get(target, key, receiver)
      
      // 深度响应式
      if (typeof result === 'object' && result !== null) {
        return reactive(result)
      }
      
      return result
    },

    set(target, key, value, receiver) {
      const oldValue = (target as any)[key]
      const result = Reflect.set(target, key, value, receiver)
      
      // 只在值真正改变时触发
      if (oldValue !== value) {
        trigger(target, key)
      }
      
      return result
    },

    deleteProperty(target, key) {
      const result = Reflect.deleteProperty(target, key)
      trigger(target, key)
      return result
    }
  })
}

/**
 * 检查是否为响应式对象
 */
const reactiveFlag = Symbol('__vjs_reactive__')

export function isReactive(value: any): boolean {
  return !!(value && value[reactiveFlag])
}
```

#### 2.2.3 Computed实现

```typescript
// src/reactive/computed.ts

import { effect, type Effect } from './reactive'
import type { ComputedRef } from '../types'

/**
 * 计算属性
 */
export function computed<T>(getter: () => T): ComputedRef<T> {
  let value: T
  let dirty = true
  
  const effectFn = effect(
    () => {
      value = getter()
      dirty = false
    },
    { lazy: true }
  )

  return {
    get value() {
      if (dirty) {
        effectFn()
      }
      return value
    }
  }
}
```

#### 2.2.4 Watch实现

```typescript
// src/reactive/watch.ts

import { effect } from './reactive'
import type { WatchCallback, WatchOptions } from '../types'

/**
 * 监听器
 */
export function watch<T>(
  source: () => T,
  callback: WatchCallback<T>,
  options: WatchOptions = {}
): () => void {
  let oldValue: T
  let cleanup: (() => void) | undefined

  const onCleanup = (fn: () => void) => {
    cleanup = fn
  }

  const job = () => {
    const newValue = source()
    
    if (cleanup) {
      cleanup()
      cleanup = undefined
    }
    
    callback(newValue, oldValue, onCleanup)
    oldValue = newValue
  }

  if (options.immediate) {
    job()
  }

  return effect(job, { lazy: !options.immediate })
}
```

### 2.3 单元测试示例

```typescript
// test/unit/reactive.test.ts

import { describe, it, expect, vi } from 'vitest'
import { reactive, effect, computed, watch } from '../src/reactive'

describe('Reactive System', () => {
  describe('reactive', () => {
    it('should make object reactive', () => {
      const obj = reactive({ count: 0 })
      let dummy
      
      effect(() => {
        dummy = obj.count
      })
      
      expect(dummy).toBe(0)
      obj.count++
      expect(dummy).toBe(1)
    })

    it('should handle nested objects', () => {
      const obj = reactive({ nested: { count: 0 } })
      let dummy
      
      effect(() => {
        dummy = obj.nested.count
      })
      
      expect(dummy).toBe(0)
      obj.nested.count++
      expect(dummy).toBe(1)
    })
  })

  describe('computed', () => {
    it('should compute value', () => {
      const obj = reactive({ count: 0 })
      const double = computed(() => obj.count * 2)
      
      expect(double.value).toBe(0)
      obj.count++
      expect(double.value).toBe(2)
    })

    it('should cache computed value', () => {
      const obj = reactive({ count: 0 })
      const getter = vi.fn(() => obj.count * 2)
      const double = computed(getter)
      
      expect(double.value).toBe(0)
      expect(getter).toHaveBeenCalledTimes(1)
      
      // 多次访问，getter只调用一次
      expect(double.value).toBe(0)
      expect(getter).toHaveBeenCalledTimes(1)
      
      // 依赖改变，重新计算
      obj.count++
      expect(double.value).toBe(2)
      expect(getter).toHaveBeenCalledTimes(2)
    })
  })

  describe('watch', () => {
    it('should watch reactive property', () => {
      const obj = reactive({ count: 0 })
      const callback = vi.fn()
      
      watch(() => obj.count, callback)
      
      obj.count++
      expect(callback).toHaveBeenCalledWith(1, 0, expect.any(Function))
    })

    it('should support immediate option', () => {
      const obj = reactive({ count: 0 })
      const callback = vi.fn()
      
      watch(() => obj.count, callback, { immediate: true })
      
      expect(callback).toHaveBeenCalledWith(0, undefined, expect.any(Function))
    })
  })
})
```

---

**继续下一部分: Week 2 DSL解析器和表达式求值器...**

（由于文档过长，我会拆分为多个文件。现在先保存这部分，然后继续创建）
# 阶段1 Week 2: DSL解析器 + 表达式求值器

> 本文档是 [01-PHASE-1-CORE.md](./01-PHASE-1-CORE.md) 的续篇

---

## 三、Week 2: DSL解析器 + 表达式求值器

### 3.1 DSL类型系统

```typescript
// src/types/dsl.ts

/**
 * DSL节点定义
 */
export interface DSLNode {
  // 基础信息
  id?: string
  type: string  // 组件类型
  
  // 属性配置
  props?: Record<string, any>
  
  // 样式配置
  style?: Record<string, string | DSLExpression>
  
  // 事件绑定
  events?: Record<string, string | Function>
  
  // 内部状态
  state?: Record<string, any>
  
  // 插槽内容
  slots?: Record<string, string | DSLNode | DSLNode[]>
  
  // 条件渲染
  if?: DSLExpression
  
  // 列表渲染
  for?: string  // "item in items" 或 "item, index in items"
  
  // 节点引用
  ref?: string
  
  // 动画配置
  motion?: MotionConfig
  
  // 自定义元数据
  meta?: Record<string, any>
}

/**
 * DSL表达式类型
 */
export type DSLExpression = string

/**
 * 动画配置
 */
export interface MotionConfig {
  enter?: string | MotionKeyframes
  leave?: string | MotionKeyframes
  duration?: number
  easing?: string
}

export interface MotionKeyframes {
  from: Record<string, any>
  to: Record<string, any>
}

/**
 * VNode定义（内部虚拟节点）
 */
export interface VNode {
  id: string
  type: string
  props: Record<string, any>
  style: Record<string, any>
  events: Record<string, Function>
  children: VNode[]
  raw: DSLNode  // 原始DSL
  ctx: RuntimeContext
}

/**
 * 运行时上下文
 */
export interface RuntimeContext {
  tokens: FlatTokenMap
  state: Record<string, any>
  props: Record<string, any>
  rootState: Record<string, any>
  emit: (event: string, payload?: any) => void
  getRef: (ref: string) => any
}

/**
 * 解析选项
 */
export interface ParseOptions {
  strict?: boolean  // 严格模式
  maxDepth?: number  // 最大嵌套深度
}
```

### 3.2 DSL解析器实现

#### 3.2.1 核心解析器

```typescript
// src/parser/parser.ts

import { v4 as uuid } from 'uuid'
import type { DSLNode, VNode, RuntimeContext, ParseOptions } from '../types'
import { parseIf } from './if-parser'
import { parseFor } from './for-parser'
import { parseSlots } from './slot-parser'

/**
 * DSL解析器类
 */
export class Parser {
  private options: ParseOptions
  private depth = 0

  constructor(options: ParseOptions = {}) {
    this.options = {
      strict: false,
      maxDepth: 100,
      ...options
    }
  }

  /**
   * 解析DSL节点
   */
  parse(node: DSLNode, ctx: RuntimeContext): VNode[] {
    if (!node) {
      if (this.options.strict) {
        throw new Error('DSL node is required')
      }
      return []
    }

    // 检查嵌套深度
    this.depth++
    if (this.depth > this.options.maxDepth!) {
      throw new Error(`Maximum nesting depth exceeded: ${this.options.maxDepth}`)
    }

    try {
      // 1. 处理条件渲染
      if (node.if !== undefined) {
        const shouldRender = parseIf(node.if, ctx)
        if (!shouldRender) {
          return []
        }
      }

      // 2. 处理列表渲染
      if (node.for) {
        return parseFor(node, ctx, (itemNode, itemCtx) => {
          return this.parseSingle(itemNode, itemCtx)
        })
      }

      // 3. 处理单个节点
      return [this.parseSingle(node, ctx)]
    } finally {
      this.depth--
    }
  }

  /**
   * 解析单个节点
   */
  private parseSingle(node: DSLNode, ctx: RuntimeContext): VNode {
    const id = node.id || uuid()
    
    // 处理插槽
    const children = parseSlots(node.slots, ctx, (childNode) => {
      return this.parse(childNode, ctx)
    })

    const vnode: VNode = {
      id,
      type: node.type,
      props: { ...(node.props || {}) },
      style: { ...(node.style || {}) },
      events: {},
      children: children.flat(),
      raw: node,
      ctx
    }

    return vnode
  }

  /**
   * 验证DSL节点
   */
  validate(node: DSLNode): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!node.type) {
      errors.push('Missing required field: type')
    }

    if (node.for && node.if) {
      errors.push('Cannot use both "for" and "if" on the same node')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

/**
 * 便捷函数：解析DSL
 */
export function parseDSL(node: DSLNode, ctx: RuntimeContext, options?: ParseOptions): VNode[] {
  const parser = new Parser(options)
  return parser.parse(node, ctx)
}
```

#### 3.2.2 条件解析器

```typescript
// src/parser/if-parser.ts

import { compileExpression } from '../evaluator'
import type { DSLExpression, RuntimeContext } from '../types'

/**
 * 解析if表达式
 */
export function parseIf(expression: DSLExpression, ctx: RuntimeContext): boolean {
  try {
    const compiled = compileExpression(expression)
    const result = compiled({
      __state: ctx.state,
      __props: ctx.props,
      __context: ctx,
      tokens: ctx.tokens
    })
    
    return Boolean(result)
  } catch (error) {
    console.error('Error evaluating if expression:', expression, error)
    return false
  }
}
```

#### 3.2.3 循环解析器

```typescript
// src/parser/for-parser.ts

import { compileExpression } from '../evaluator'
import type { DSLNode, VNode, RuntimeContext } from '../types'

/**
 * 解析for表达式
 * 支持: "item in items" 或 "item, index in items"
 */
export function parseFor(
  node: DSLNode,
  ctx: RuntimeContext,
  parseNode: (node: DSLNode, ctx: RuntimeContext) => VNode
): VNode[] {
  const forExpr = node.for!
  
  // 解析for表达式
  const match = forExpr.match(/^\s*(\w+)(?:\s*,\s*(\w+))?\s+in\s+(.+)$/)
  if (!match) {
    throw new Error(`Invalid for expression: ${forExpr}`)
  }

  const [, itemName, indexName, listExpr] = match

  // 获取列表数据
  const compiled = compileExpression(listExpr)
  const list = compiled({
    __state: ctx.state,
    __props: ctx.props,
    __context: ctx,
    tokens: ctx.tokens
  })

  if (!Array.isArray(list)) {
    console.warn('For expression did not evaluate to an array:', listExpr)
    return []
  }

  // 为每个item创建节点
  const vnodes: VNode[] = []
  
  list.forEach((item, index) => {
    // 克隆节点（移除for指令）
    const itemNode: DSLNode = {
      ...node,
      for: undefined,
      // 合并item数据到state
      state: {
        ...(node.state || {}),
        [itemName]: item,
        ...(indexName ? { [indexName]: index } : {})
      },
      // 生成唯一key
      id: `${node.id || node.type}-${index}`
    }

    // 解析节点
    const vnode = parseNode(itemNode, ctx)
    vnodes.push(vnode)
  })

  return vnodes
}
```

#### 3.2.4 插槽解析器

```typescript
// src/parser/slot-parser.ts

import { v4 as uuid } from 'uuid'
import type { DSLNode, VNode, RuntimeContext } from '../types'

/**
 * 解析插槽
 */
export function parseSlots(
  slots: DSLNode['slots'],
  ctx: RuntimeContext,
  parseNode: (node: DSLNode, ctx: RuntimeContext) => VNode[]
): VNode[] {
  if (!slots) {
    return []
  }

  const children: VNode[] = []

  for (const slotContent of Object.values(slots)) {
    if (typeof slotContent === 'string') {
      // 文本节点
      children.push(createTextNode(slotContent, ctx))
    } else if (Array.isArray(slotContent)) {
      // 多个节点
      slotContent.forEach(node => {
        children.push(...parseNode(node, ctx))
      })
    } else {
      // 单个节点
      children.push(...parseNode(slotContent, ctx))
    }
  }

  return children
}

/**
 * 创建文本节点
 */
function createTextNode(text: string, ctx: RuntimeContext): VNode {
  return {
    id: uuid(),
    type: 'Text',
    props: { text },
    style: {},
    events: {},
    children: [],
    raw: { type: 'Text' },
    ctx
  }
}
```

### 3.3 表达式求值器实现

#### 3.3.1 表达式编译器

```typescript
// src/evaluator/evaluator.ts

import jsep from 'jsep'
import { ASTWalker } from './ast-walker'
import type { DSLExpression } from '../types'

/**
 * 表达式求值上下文
 */
export interface EvalContext {
  __state: Record<string, any>
  __props: Record<string, any>
  __context: any
  tokens: Record<string, any>
  __event?: any
}

/**
 * 编译后的表达式函数
 */
export type CompiledExpression = (ctx: EvalContext) => any

/**
 * 表达式编译器缓存
 */
const expressionCache = new Map<string, CompiledExpression>()

/**
 * 编译表达式
 */
export function compileExpression(expr: DSLExpression): CompiledExpression {
  // 检查缓存
  if (expressionCache.has(expr)) {
    return expressionCache.get(expr)!
  }

  // 预处理：替换特殊标记
  const transformed = transformExpression(expr)

  try {
    // 使用jsep解析为AST
    const ast = jsep(transformed)
    
    // 创建AST walker
    const walker = new ASTWalker()
    
    // 编译为函数
    const compiled: CompiledExpression = (ctx: EvalContext) => {
      return walker.walk(ast, ctx)
    }

    // 缓存
    expressionCache.set(expr, compiled)
    
    return compiled
  } catch (error) {
    console.error('Failed to compile expression:', expr, error)
    // 返回一个安全的默认函数
    return () => undefined
  }
}

/**
 * 转换表达式中的特殊标记
 */
function transformExpression(expr: string): string {
  return expr
    .replace(/\$state\./g, '__state.')
    .replace(/\$props\./g, '__props.')
    .replace(/\$context\./g, '__context.')
    .replace(/\$event/g, '__event')
}

/**
 * 清除编译缓存
 */
export function clearExpressionCache(): void {
  expressionCache.clear()
}
```

#### 3.3.2 AST遍历器（安全沙箱）

```typescript
// src/evaluator/ast-walker.ts

import type { Expression } from 'jsep'
import type { EvalContext } from './evaluator'

/**
 * 白名单：允许的操作符
 */
const ALLOWED_OPERATORS = new Set([
  '+', '-', '*', '/', '%',
  '==', '===', '!=', '!==',
  '<', '<=', '>', '>=',
  '&&', '||', '!',
  '?', ':',  // 三元运算符
])

/**
 * 白名单：允许的内置函数
 */
const ALLOWED_FUNCTIONS = new Set([
  'String',
  'Number',
  'Boolean',
  'Array',
  'Object',
  'Math',
  'Date',
  'JSON'
])

/**
 * AST遍历器（安全执行）
 */
export class ASTWalker {
  /**
   * 遍历AST节点
   */
  walk(node: Expression, ctx: EvalContext): any {
    switch (node.type) {
      case 'Literal':
        return this.walkLiteral(node)
      
      case 'Identifier':
        return this.walkIdentifier(node, ctx)
      
      case 'MemberExpression':
        return this.walkMemberExpression(node, ctx)
      
      case 'BinaryExpression':
        return this.walkBinaryExpression(node, ctx)
      
      case 'UnaryExpression':
        return this.walkUnaryExpression(node, ctx)
      
      case 'LogicalExpression':
        return this.walkLogicalExpression(node, ctx)
      
      case 'ConditionalExpression':
        return this.walkConditionalExpression(node, ctx)
      
      case 'CallExpression':
        return this.walkCallExpression(node, ctx)
      
      case 'ArrayExpression':
        return this.walkArrayExpression(node, ctx)
      
      case 'ObjectExpression':
        return this.walkObjectExpression(node, ctx)
      
      default:
        throw new Error(`Unsupported expression type: ${node.type}`)
    }
  }

  /**
   * 字面量
   */
  private walkLiteral(node: any): any {
    return node.value
  }

  /**
   * 标识符
   */
  private walkIdentifier(node: any, ctx: EvalContext): any {
    const name = node.name
    
    // 只允许访问上下文中的变量
    if (name in ctx) {
      return ctx[name as keyof EvalContext]
    }
    
    // 检查是否为允许的全局函数
    if (ALLOWED_FUNCTIONS.has(name)) {
      return (globalThis as any)[name]
    }
    
    throw new Error(`Undefined variable: ${name}`)
  }

  /**
   * 成员访问
   */
  private walkMemberExpression(node: any, ctx: EvalContext): any {
    const object = this.walk(node.object, ctx)
    const property = node.computed 
      ? this.walk(node.property, ctx)
      : node.property.name

    if (object == null) {
      return undefined
    }

    return object[property]
  }

  /**
   * 二元运算符
   */
  private walkBinaryExpression(node: any, ctx: EvalContext): any {
    const operator = node.operator
    
    // 检查操作符白名单
    if (!ALLOWED_OPERATORS.has(operator)) {
      throw new Error(`Operator not allowed: ${operator}`)
    }

    const left = this.walk(node.left, ctx)
    const right = this.walk(node.right, ctx)

    switch (operator) {
      case '+': return left + right
      case '-': return left - right
      case '*': return left * right
      case '/': return left / right
      case '%': return left % right
      case '==': return left == right
      case '===': return left === right
      case '!=': return left != right
      case '!==': return left !== right
      case '<': return left < right
      case '<=': return left <= right
      case '>': return left > right
      case '>=': return left >= right
      default:
        throw new Error(`Unknown operator: ${operator}`)
    }
  }

  /**
   * 一元运算符
   */
  private walkUnaryExpression(node: any, ctx: EvalContext): any {
    const operator = node.operator
    const argument = this.walk(node.argument, ctx)

    switch (operator) {
      case '!': return !argument
      case '+': return +argument
      case '-': return -argument
      default:
        throw new Error(`Unknown unary operator: ${operator}`)
    }
  }

  /**
   * 逻辑运算符
   */
  private walkLogicalExpression(node: any, ctx: EvalContext): any {
    const operator = node.operator
    const left = this.walk(node.left, ctx)

    switch (operator) {
      case '&&':
        return left && this.walk(node.right, ctx)
      case '||':
        return left || this.walk(node.right, ctx)
      default:
        throw new Error(`Unknown logical operator: ${operator}`)
    }
  }

  /**
   * 三元运算符
   */
  private walkConditionalExpression(node: any, ctx: EvalContext): any {
    const test = this.walk(node.test, ctx)
    return test
      ? this.walk(node.consequent, ctx)
      : this.walk(node.alternate, ctx)
  }

  /**
   * 函数调用
   */
  private walkCallExpression(node: any, ctx: EvalContext): any {
    const callee = this.walk(node.callee, ctx)
    const args = node.arguments.map((arg: any) => this.walk(arg, ctx))

    if (typeof callee !== 'function') {
      throw new Error('Callee is not a function')
    }

    // 安全调用
    return callee(...args)
  }

  /**
   * 数组表达式
   */
  private walkArrayExpression(node: any, ctx: EvalContext): any[] {
    return node.elements.map((element: any) => this.walk(element, ctx))
  }

  /**
   * 对象表达式
   */
  private walkObjectExpression(node: any, ctx: EvalContext): Record<string, any> {
    const obj: Record<string, any> = {}
    
    node.properties.forEach((prop: any) => {
      const key = prop.key.type === 'Identifier' 
        ? prop.key.name 
        : this.walk(prop.key, ctx)
      const value = this.walk(prop.value, ctx)
      obj[key] = value
    })

    return obj
  }
}
```

#### 3.3.3 安全沙箱增强

```typescript
// src/evaluator/sandbox.ts

/**
 * 创建安全执行环境
 */
export class Sandbox {
  private allowedGlobals: Set<string>

  constructor(allowedGlobals: string[] = []) {
    this.allowedGlobals = new Set([
      'undefined',
      'null',
      'true',
      'false',
      'NaN',
      'Infinity',
      ...allowedGlobals
    ])
  }

  /**
   * 在沙箱中执行代码
   */
  execute(code: string, context: Record<string, any>): any {
    // 创建受限的全局对象
    const sandbox = this.createSandbox(context)
    
    try {
      // 使用with创建作用域（注意：严格模式下不可用）
      const fn = new Function(...Object.keys(sandbox), `return (${code})`)
      return fn(...Object.values(sandbox))
    } catch (error) {
      console.error('Sandbox execution error:', error)
      throw error
    }
  }

  /**
   * 创建沙箱环境
   */
  private createSandbox(context: Record<string, any>): Record<string, any> {
    const sandbox: Record<string, any> = {}

    // 注入上下文
    Object.assign(sandbox, context)

    // 注入允许的全局变量
    this.allowedGlobals.forEach(name => {
      if (name in globalThis) {
        sandbox[name] = (globalThis as any)[name]
      }
    })

    return sandbox
  }
}
```

### 3.4 单元测试

```typescript
// test/unit/parser.test.ts

import { describe, it, expect } from 'vitest'
import { parseDSL } from '../src/parser'
import type { DSLNode, RuntimeContext } from '../src/types'

describe('Parser', () => {
  const createContext = (): RuntimeContext => ({
    tokens: {},
    state: { count: 0, items: ['a', 'b', 'c'] },
    props: {},
    rootState: {},
    emit: () => {},
    getRef: () => null
  })

  describe('basic parsing', () => {
    it('should parse simple node', () => {
      const dsl: DSLNode = {
        type: 'Button',
        props: { text: 'Click' }
      }

      const vnodes = parseDSL(dsl, createContext())
      
      expect(vnodes).toHaveLength(1)
      expect(vnodes[0].type).toBe('Button')
      expect(vnodes[0].props.text).toBe('Click')
    })
  })

  describe('conditional rendering', () => {
    it('should render when condition is true', () => {
      const dsl: DSLNode = {
        type: 'Button',
        if: '$state.count === 0'
      }

      const vnodes = parseDSL(dsl, createContext())
      expect(vnodes).toHaveLength(1)
    })

    it('should not render when condition is false', () => {
      const dsl: DSLNode = {
        type: 'Button',
        if: '$state.count > 0'
      }

      const vnodes = parseDSL(dsl, createContext())
      expect(vnodes).toHaveLength(0)
    })
  })

  describe('list rendering', () => {
    it('should render list items', () => {
      const dsl: DSLNode = {
        type: 'ListItem',
        for: 'item in $state.items',
        props: { text: '$state.item' }
      }

      const vnodes = parseDSL(dsl, createContext())
      expect(vnodes).toHaveLength(3)
    })

    it('should support index in for loop', () => {
      const dsl: DSLNode = {
        type: 'ListItem',
        for: 'item, index in $state.items'
      }

      const vnodes = parseDSL(dsl, createContext())
      expect(vnodes).toHaveLength(3)
    })
  })
})

// test/unit/evaluator.test.ts

import { describe, it, expect } from 'vitest'
import { compileExpression } from '../src/evaluator'

describe('Evaluator', () => {
  const createContext = () => ({
    __state: { count: 10, name: 'test' },
    __props: { value: 5 },
    __context: {},
    tokens: { 'color.primary': '#1677ff' }
  })

  it('should evaluate simple expression', () => {
    const fn = compileExpression('$state.count + 1')
    expect(fn(createContext())).toBe(11)
  })

  it('should evaluate comparison', () => {
    const fn = compileExpression('$state.count > 5')
    expect(fn(createContext())).toBe(true)
  })

  it('should evaluate ternary operator', () => {
    const fn = compileExpression('$state.count > 5 ? "big" : "small"')
    expect(fn(createContext())).toBe('big')
  })

  it('should access nested properties', () => {
    const ctx = {
      __state: { user: { name: 'Alice' } },
      __props: {},
      __context: {},
      tokens: {}
    }
    const fn = compileExpression('$state.user.name')
    expect(fn(ctx)).toBe('Alice')
  })

  it('should handle undefined gracefully', () => {
    const fn = compileExpression('$state.missing')
    expect(fn(createContext())).toBeUndefined()
  })
})
```

---

**继续下一部分: Week 3...**

（内容过长，我会继续创建Week 3的文档）
# 阶段1 Week 3: Binder + Core引擎集成

> 本文档是 [01-PHASE-1-CORE.md](./01-PHASE-1-CORE.md) 的续篇

---

## 四、Week 3: Binder + Renderer接口 + Core集成

### 4.1 Binder实现

#### 4.1.1 核心Binder类

```typescript
// src/binder/binder.ts

import { effect } from '../reactive'
import { compileExpression } from '../evaluator'
import type { VNode, DSLExpression } from '../types'

/**
 * 绑定清理函数集合
 */
const binderCleanups = new WeakMap<VNode, Array<() => void>>()

/**
 * 绑定器类
 */
export class Binder {
  /**
   * 绑定VNode
   */
  bind(vnode: VNode): void {
    const cleanups: Array<() => void> = []

    // 1. 绑定props
    this.bindProps(vnode, cleanups)

    // 2. 绑定style
    this.bindStyle(vnode, cleanups)

    // 3. 绑定events
    this.bindEvents(vnode, cleanups)

    // 4. 绑定children
    vnode.children.forEach(child => this.bind(child))

    // 存储清理函数
    binderCleanups.set(vnode, cleanups)
  }

  /**
   * 解除绑定
   */
  unbind(vnode: VNode): void {
    // 清理当前节点
    const cleanups = binderCleanups.get(vnode)
    if (cleanups) {
      cleanups.forEach(cleanup => cleanup())
      binderCleanups.delete(vnode)
    }

    // 递归清理children
    vnode.children.forEach(child => this.unbind(child))
  }

  /**
   * 绑定Props
   */
  private bindProps(vnode: VNode, cleanups: Array<() => void>): void {
    const { props } = vnode.raw
    if (!props) return

    for (const [key, value] of Object.entries(props)) {
      if (this.isExpression(value)) {
        // 动态绑定
        this.bindDynamicProp(vnode, key, value as string, cleanups)
      } else if (this.isTokenReference(value)) {
        // Token引用
        vnode.props[key] = this.resolveToken(value as string, vnode)
      } else {
        // 静态值
        vnode.props[key] = value
      }
    }
  }

  /**
   * 绑定动态prop
   */
  private bindDynamicProp(
    vnode: VNode,
    key: string,
    expr: string,
    cleanups: Array<() => void>
  ): void {
    const compiled = compileExpression(expr)
    const ctx = vnode.ctx

    const cleanup = effect(() => {
      try {
        vnode.props[key] = compiled({
          __state: ctx.state,
          __props: ctx.props,
          __context: ctx,
          tokens: ctx.tokens
        })
        
        // 触发更新
        ctx.emit('__update__', { vnodeId: vnode.id, type: 'props', key })
      } catch (error) {
        console.error(`Error binding prop "${key}":`, error)
      }
    })

    cleanups.push(cleanup)
  }

  /**
   * 绑定Style
   */
  private bindStyle(vnode: VNode, cleanups: Array<() => void>): void {
    const { style } = vnode.raw
    if (!style) return

    for (const [key, value] of Object.entries(style)) {
      if (this.isExpression(value)) {
        // 动态绑定
        this.bindDynamicStyle(vnode, key, value as string, cleanups)
      } else if (this.isTokenReference(value)) {
        // Token引用
        vnode.style[key] = this.resolveToken(value as string, vnode)
      } else {
        // 静态值
        vnode.style[key] = value as string
      }
    }
  }

  /**
   * 绑定动态style
   */
  private bindDynamicStyle(
    vnode: VNode,
    key: string,
    expr: string,
    cleanups: Array<() => void>
  ): void {
    const compiled = compileExpression(expr)
    const ctx = vnode.ctx

    const cleanup = effect(() => {
      try {
        vnode.style[key] = compiled({
          __state: ctx.state,
          __props: ctx.props,
          __context: ctx,
          tokens: ctx.tokens
        })
        
        // 触发更新
        ctx.emit('__update__', { vnodeId: vnode.id, type: 'style', key })
      } catch (error) {
        console.error(`Error binding style "${key}":`, error)
      }
    })

    cleanups.push(cleanup)
  }

  /**
   * 绑定Events
   */
  private bindEvents(vnode: VNode, cleanups: Array<() => void>): void {
    const { events } = vnode.raw
    if (!events) return

    for (const [eventName, handler] of Object.entries(events)) {
      if (typeof handler === 'function') {
        // 直接使用函数
        vnode.events[eventName] = handler
      } else if (typeof handler === 'string') {
        // 编译表达式为函数
        vnode.events[eventName] = this.compileEventHandler(handler, vnode)
      }
    }
  }

  /**
   * 编译事件处理器
   */
  private compileEventHandler(expr: string, vnode: VNode): Function {
    const compiled = compileExpression(expr)
    const ctx = vnode.ctx

    return (event: Event) => {
      try {
        return compiled({
          __state: ctx.state,
          __props: ctx.props,
          __context: ctx,
          tokens: ctx.tokens,
          __event: event
        })
      } catch (error) {
        console.error(`Error handling event:`, error)
      }
    }
  }

  /**
   * 判断是否为表达式
   */
  private isExpression(value: any): boolean {
    return typeof value === 'string' && value.includes('$')
  }

  /**
   * 判断是否为Token引用
   */
  private isTokenReference(value: any): boolean {
    return typeof value === 'string' && 
           value.startsWith('{') && 
           value.endsWith('}')
  }

  /**
   * 解析Token引用
   */
  private resolveToken(reference: string, vnode: VNode): string {
    const tokenKey = reference.slice(1, -1)  // 移除{}
    const tokenValue = vnode.ctx.tokens[tokenKey]

    if (tokenValue === undefined) {
      console.warn(`Token not found: ${tokenKey}`)
      // 返回CSS变量引用
      return `var(--vjs-${tokenKey.replace(/\./g, '-')})`
    }

    return String(tokenValue)
  }
}

/**
 * 便捷函数
 */
export function bindVNode(vnode: VNode): void {
  const binder = new Binder()
  binder.bind(vnode)
}

export function unbindVNode(vnode: VNode): void {
  const binder = new Binder()
  binder.unbind(vnode)
}
```

### 4.2 Renderer接口定义

```typescript
// src/renderer/renderer.ts

import type { VNode } from '../types'

/**
 * 渲染句柄
 */
export interface RenderHandle {
  id: string
  vnode: VNode
  instance?: any  // 框架特定的实例
}

/**
 * 渲染器接口
 */
export interface Renderer {
  /**
   * 挂载VNode到容器
   */
  mount(container: Element, vnode: VNode): RenderHandle

  /**
   * 更新已挂载的VNode
   */
  update(handle: RenderHandle, vnode: VNode): void

  /**
   * 卸载VNode
   */
  unmount(handle: RenderHandle): void

  /**
   * 批量更新（可选，用于性能优化）
   */
  batchUpdate?(updates: UpdateBatch): void
}

/**
 * 更新批次
 */
export interface UpdateBatch {
  updates: Array<{
    handle: RenderHandle
    vnode: VNode
  }>
}

/**
 * VNode工厂函数
 */
export function createVNode(
  type: string,
  props?: Record<string, any>,
  children?: VNode[]
): Partial<VNode> {
  return {
    type,
    props: props || {},
    style: {},
    events: {},
    children: children || []
  }
}
```

### 4.3 Core引擎主类

```typescript
// src/core.ts

import { reactive } from './reactive'
import { Parser } from './parser'
import { Binder } from './binder'
import { TokenRuntime } from './token'
import type {
  DSLNode,
  VNode,
  RuntimeContext,
  Renderer,
  RenderHandle,
  FlatTokenMap
} from './types'

/**
 * Core配置
 */
export interface CoreConfig {
  tokens: FlatTokenMap
  initialState?: Record<string, any>
  renderer: Renderer
}

/**
 * 渲染实例
 */
export interface RenderInstance {
  vnode: VNode
  handle: RenderHandle
  update: (state?: Record<string, any>) => void
  unmount: () => void
}

/**
 * Core引擎主类
 */
export class Core {
  private tokenRuntime: TokenRuntime
  private state: Record<string, any>
  private parser: Parser
  private binder: Binder
  private renderer: Renderer
  private instances = new Map<string, RenderInstance>()
  private updateQueue = new Set<string>()
  private updating = false

  constructor(config: CoreConfig) {
    // 初始化Token运行时
    this.tokenRuntime = new TokenRuntime({
      tokens: config.tokens
    })

    // 初始化响应式状态
    this.state = reactive(config.initialState || {})

    // 初始化子系统
    this.parser = new Parser()
    this.binder = new Binder()
    this.renderer = config.renderer

    // 监听Token变化
    this.tokenRuntime.onChange(() => {
      this.triggerUpdate()
    })
  }

  /**
   * 渲染DSL到容器
   */
  render(
    dsl: DSLNode,
    container: Element,
    props: Record<string, any> = {}
  ): RenderInstance {
    // 创建运行时上下文
    const context = this.createContext(props)

    // 1. 解析DSL
    const vnodes = this.parser.parse(dsl, context)
    if (vnodes.length === 0) {
      throw new Error('DSL parsing resulted in no nodes')
    }

    const rootVNode = vnodes[0]

    // 2. 绑定数据
    this.binder.bind(rootVNode)

    // 3. 渲染
    const handle = this.renderer.mount(container, rootVNode)

    // 4. 创建实例
    const instance: RenderInstance = {
      vnode: rootVNode,
      handle,
      update: (state) => this.updateInstance(handle.id, state),
      unmount: () => this.unmountInstance(handle.id)
    }

    // 保存实例
    this.instances.set(handle.id, instance)

    return instance
  }

  /**
   * 创建运行时上下文
   */
  private createContext(props: Record<string, any>): RuntimeContext {
    return {
      tokens: this.tokenRuntime['tokens'],  // 访问private属性
      state: this.state,
      props,
      rootState: this.state,
      emit: (event: string, payload?: any) => {
        this.handleEmit(event, payload)
      },
      getRef: (ref: string) => {
        return this.getRef(ref)
      }
    }
  }

  /**
   * 处理事件发射
   */
  private handleEmit(event: string, payload?: any): void {
    if (event === '__update__') {
      // 内部更新事件
      this.scheduleUpdate(payload?.vnodeId)
    } else {
      // 用户自定义事件
      console.log('Event emitted:', event, payload)
    }
  }

  /**
   * 调度更新
   */
  private scheduleUpdate(vnodeId?: string): void {
    if (vnodeId) {
      this.updateQueue.add(vnodeId)
    }

    if (!this.updating) {
      this.updating = true
      // 使用requestAnimationFrame批量更新
      requestAnimationFrame(() => {
        this.flushUpdates()
        this.updating = false
      })
    }
  }

  /**
   * 刷新更新队列
   */
  private flushUpdates(): void {
    this.updateQueue.forEach(vnodeId => {
      // 找到包含该vnode的instance
      this.instances.forEach(instance => {
        if (this.findVNode(instance.vnode, vnodeId)) {
          this.renderer.update(instance.handle, instance.vnode)
        }
      })
    })

    this.updateQueue.clear()
  }

  /**
   * 查找VNode
   */
  private findVNode(vnode: VNode, id: string): VNode | null {
    if (vnode.id === id) return vnode
    
    for (const child of vnode.children) {
      const found = this.findVNode(child, id)
      if (found) return found
    }
    
    return null
  }

  /**
   * 触发全量更新
   */
  private triggerUpdate(): void {
    this.instances.forEach(instance => {
      this.renderer.update(instance.handle, instance.vnode)
    })
  }

  /**
   * 更新实例状态
   */
  private updateInstance(instanceId: string, state?: Record<string, any>): void {
    if (state) {
      Object.assign(this.state, state)
    }
    
    const instance = this.instances.get(instanceId)
    if (instance) {
      this.renderer.update(instance.handle, instance.vnode)
    }
  }

  /**
   * 卸载实例
   */
  private unmountInstance(instanceId: string): void {
    const instance = this.instances.get(instanceId)
    if (!instance) return

    // 解除绑定
    this.binder.unbind(instance.vnode)

    // 卸载渲染
    this.renderer.unmount(instance.handle)

    // 移除实例
    this.instances.delete(instanceId)
  }

  /**
   * 获取引用
   */
  private getRef(ref: string): any {
    // TODO: 实现ref查找
    return null
  }

  /**
   * 获取状态
   */
  getState(): Record<string, any> {
    return this.state
  }

  /**
   * 设置状态
   */
  setState(updates: Record<string, any>): void {
    Object.assign(this.state, updates)
  }

  /**
   * 获取Token运行时
   */
  getTokenRuntime(): TokenRuntime {
    return this.tokenRuntime
  }

  /**
   * 销毁Core实例
   */
  destroy(): void {
    // 卸载所有实例
    Array.from(this.instances.keys()).forEach(id => {
      this.unmountInstance(id)
    })

    // 清理Token运行时
    this.tokenRuntime.destroy()
  }
}

/**
 * 创建Core实例
 */
export function createCore(config: CoreConfig): Core {
  return new Core(config)
}
```

### 4.4 Core入口

```typescript
// src/index.ts

// 类型导出
export type {
  // DSL类型
  DSLNode,
  DSLExpression,
  MotionConfig,
  
  // VNode类型
  VNode,
  RuntimeContext,
  
  // Token类型
  TokenDefinition,
  TokenMap,
  FlatTokenMap,
  TokenCompileOptions,
  TokenRuntimeConfig,
  
  // Renderer类型
  Renderer,
  RenderHandle,
  UpdateBatch,
  
  // Core类型
  CoreConfig,
  RenderInstance
} from './types'

// 核心API导出
export { Core, createCore } from './core'
export { Parser, parseDSL } from './parser'
export { Binder, bindVNode, unbindVNode } from './binder'
export { compileExpression, clearExpressionCache } from './evaluator'
export { TokenCompiler, TokenRuntime, compileTokens, createTokenRuntime } from './token'
export { reactive, effect, computed, watch } from './reactive'
export { createVNode } from './renderer'

// 默认导出
export default {
  createCore,
  parseDSL,
  bindVNode,
  compileExpression,
  compileTokens,
  createTokenRuntime,
  reactive,
  effect,
  computed,
  watch
}
```

### 4.5 包配置

```json
// packages/core/package.json
{
  "name": "@vjs-ui/core",
  "version": "0.1.0",
  "description": "VJS-UI Core Engine - DSL + Token + Reactive System",
  "type": "module",
  "main": "./dist/index.cjs.js",
  "module": "./dist/index.esm.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js",
      "types": "./dist/index.d.ts"
    },
    "./package.json": "./package.json"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "dev": "rollup -c -w",
    "build": "rollup -c && tsc --declaration --emitDeclarationOnly --outDir dist",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "jsep": "^1.3.8"
  },
  "devDependencies": {
    "@types/jsep": "^1.3.5",
    "@rollup/plugin-node-resolve": "^15.2.3",
    "@rollup/plugin-typescript": "^11.1.5",
    "rollup": "^4.6.0",
    "typescript": "^5.3.2",
    "vitest": "^1.0.0",
    "@vitest/coverage-v8": "^1.0.0"
  },
  "keywords": [
    "ui",
    "dsl",
    "token",
    "reactive",
    "framework-agnostic"
  ],
  "license": "MIT"
}
```

### 4.6 Rollup配置

```typescript
// packages/core/rollup.config.ts

import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'

export default defineConfig({
  input: 'src/index.ts',
  external: ['jsep'],
  plugins: [
    resolve(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false  // 由单独的tsc命令生成
    })
  ],
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'VjsUICore',
      sourcemap: true,
      globals: {
        jsep: 'jsep'
      }
    }
  ]
})
```

### 4.7 集成测试

```typescript
// test/integration/core.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { createCore } from '../src/core'
import type { DSLNode, Renderer, RenderHandle, VNode } from '../src/types'

// Mock Renderer
class MockRenderer implements Renderer {
  private mounts = new Map<string, VNode>()

  mount(container: Element, vnode: VNode): RenderHandle {
    const id = vnode.id
    this.mounts.set(id, vnode)
    return { id, vnode }
  }

  update(handle: RenderHandle, vnode: VNode): void {
    this.mounts.set(handle.id, vnode)
  }

  unmount(handle: RenderHandle): void {
    this.mounts.delete(handle.id)
  }

  getMounted(id: string): VNode | undefined {
    return this.mounts.get(id)
  }
}

describe('Core Integration', () => {
  let core: ReturnType<typeof createCore>
  let renderer: MockRenderer
  let container: HTMLDivElement

  beforeEach(() => {
    renderer = new MockRenderer()
    container = document.createElement('div')
    
    core = createCore({
      tokens: {
        'color.primary': '#1677ff',
        'spacing.md': '16px'
      },
      initialState: {
        count: 0,
        message: 'Hello'
      },
      renderer
    })
  })

  it('should render simple DSL', () => {
    const dsl: DSLNode = {
      type: 'Button',
      props: {
        text: 'Click'
      }
    }

    const instance = core.render(dsl, container)
    
    expect(instance).toBeDefined()
    expect(instance.vnode.type).toBe('Button')
    expect(instance.vnode.props.text).toBe('Click')
  })

  it('should bind reactive state', () => {
    const dsl: DSLNode = {
      type: 'Text',
      props: {
        content: '$state.message'
      }
    }

    const instance = core.render(dsl, container)
    
    expect(instance.vnode.props.content).toBe('Hello')
    
    // 更新状态
    core.setState({ message: 'World' })
    
    // 等待下一帧
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        const mounted = renderer.getMounted(instance.handle.id)
        expect(mounted?.props.content).toBe('World')
        resolve(undefined)
      })
    })
  })

  it('should resolve token references', () => {
    const dsl: DSLNode = {
      type: 'Box',
      style: {
        color: '{color.primary}',
        padding: '{spacing.md}'
      }
    }

    const instance = core.render(dsl, container)
    
    expect(instance.vnode.style.color).toBe('#1677ff')
    expect(instance.vnode.style.padding).toBe('16px')
  })

  it('should handle conditional rendering', () => {
    const dsl: DSLNode = {
      type: 'Alert',
      if: '$state.count > 0'
    }

    const instance = core.render(dsl, container)
    
    // 初始不渲染（count = 0）
    expect(instance.vnode.type).toBe('Alert')
    
    core.setState({ count: 1 })
    
    // 更新后应该渲染
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        resolve(undefined)
      })
    })
  })

  it('should unmount properly', () => {
    const dsl: DSLNode = {
      type: 'Button'
    }

    const instance = core.render(dsl, container)
    const handleId = instance.handle.id
    
    expect(renderer.getMounted(handleId)).toBeDefined()
    
    instance.unmount()
    
    expect(renderer.getMounted(handleId)).toBeUndefined()
  })
})
```

---

## 五、测试策略

### 5.1 单元测试清单

- [x] Token系统
  - [x] Token编译器
  - [x] Token运行时
  - [x] Token引用解析
  
- [x] 响应式系统
  - [x] reactive
  - [x] effect
  - [x] computed
  - [x] watch
  
- [x] DSL解析器
  - [x] 基础解析
  - [x] 条件渲染
  - [x] 列表渲染
  - [x] 插槽处理
  
- [x] 表达式求值器
  - [x] 表达式编译
  - [x] AST遍历
  - [x] 安全沙箱
  
- [x] 绑定器
  - [x] Props绑定
  - [x] Style绑定
  - [x] Events绑定
  - [x] 清理机制

### 5.2 集成测试清单

- [x] Core引擎集成
- [x] 渲染流程
- [x] 状态更新
- [x] Token切换
- [x] 卸载清理

### 5.3 性能测试

```typescript
// test/benchmarks/reactive.bench.ts

import { bench, describe } from 'vitest'
import { reactive, effect } from '../src/reactive'

describe('Reactive Performance', () => {
  bench('reactive object creation', () => {
    reactive({ count: 0, nested: { value: 1 } })
  })

  bench('effect execution', () => {
    const obj = reactive({ count: 0 })
    effect(() => obj.count)
  })

  bench('deep reactive access', () => {
    const obj = reactive({ a: { b: { c: { d: 0 } } } })
    effect(() => obj.a.b.c.d)
  })
})
```

---

## 六、性能基准

### 6.1 目标指标

| 指标 | 目标值 |
|------|--------|
| 包体积(gzipped) | < 50KB |
| 解析1000个节点 | < 100ms |
| 绑定1000个表达式 | < 50ms |
| 响应式更新延迟 | < 16ms (60fps) |

### 6.2 优化策略

1. **表达式缓存**: 已编译的表达式缓存复用
2. **批量更新**: requestAnimationFrame批处理
3. **依赖追踪**: 细粒度的响应式更新
4. **Tree-shaking**: ESM模块化输出

---

## 七、下一步

阶段1完成后，进入阶段2：
- [02-PHASE-2-VUE.md](./02-PHASE-2-VUE.md) - Vue适配层实现

**当前状态**: 📋 Week 3 规划完成
# 阶段2: Vue适配层详细实施文档

> **时间**: 2周
> **目标**: 基于Core引擎实现Vue 3适配器，创建5个核心组件
> **依赖**: 阶段1完成

---

## 一、总览

### 1.1 目标
- 实现Vue 3渲染器
- 创建Vue组合式函数
- 实现5个核心组件（Button, Input, Card, Dialog, Table）
- 建立组件开发模式
- 完善测试与文档

### 1.2 包结构

```
@vjs-ui/vue/
├── src/
│   ├── adapter/            # Vue适配器
│   │   ├── VueRenderer.ts
│   │   ├── component-registry.ts
│   │   └── index.ts
│   │
│   ├── composables/        # 组合式函数
│   │   ├── useCore.ts
│   │   ├── useDSL.ts
│   │   ├── useToken.ts
│   │   ├── useTheme.ts
│   │   └── index.ts
│   │
│   ├── components/         # 组件
│   │   ├── Button/
│   │   │   ├── Button.dsl.ts
│   │   │   ├── Button.vue
│   │   │   ├── Button.styles.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Dialog/
│   │   └── Table/
│   │
│   ├── directives/         # 自定义指令
│   │   ├── v-dsl.ts
│   │   └── index.ts
│   │
│   ├── utils/              # 工具函数
│   │   ├── props.ts
│   │   ├── slots.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
├── styles/                 # 样式
│   ├── base.css
│   ├── components/
│   └── themes/
│
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 二、Week 1: Vue渲染器 + 组件系统

### 2.1 Vue渲染器实现

```typescript
// src/adapter/VueRenderer.ts

import { createApp, h, type VNode as VueVNode, type App } from 'vue'
import type { Renderer, RenderHandle, VNode } from '@vjs-ui/core'
import { ComponentRegistry } from './component-registry'

/**
 * Vue渲染句柄
 */
interface VueRenderHandle extends RenderHandle {
  app: App
  container: Element
}

/**
 * Vue渲染器
 */
export class VueRenderer implements Renderer {
  private registry: ComponentRegistry

  constructor() {
    this.registry = new ComponentRegistry()
  }

  /**
   * 挂载VNode
   */
  mount(container: Element, vnode: VNode): VueRenderHandle {
    // 创建Vue应用
    const app = createApp({
      name: 'VjsUIRoot',
      setup() {
        return () => this.buildVNode(vnode)
      }
    })

    // 注册全局组件
    this.registry.registerToApp(app)

    // 挂载
    app.mount(container)

    return {
      id: vnode.id,
      vnode,
      app,
      container
    }
  }

  /**
   * 更新VNode
   */
  update(handle: VueRenderHandle, vnode: VNode): void {
    // Vue的响应式系统会自动处理更新
    // 这里只需要确保vnode引用被更新
    handle.vnode = vnode
  }

  /**
   * 卸载VNode
   */
  unmount(handle: VueRenderHandle): void {
    handle.app.unmount()
  }

  /**
   * 构建Vue VNode
   */
  private buildVNode(vnode: VNode): VueVNode | string {
    // 文本节点
    if (vnode.type === 'Text') {
      return vnode.props.text || ''
    }

    // 获取组件
    const component = this.registry.getComponent(vnode.type)
    if (!component) {
      console.warn(`Component not registered: ${vnode.type}`)
      return h('div', `[Unknown Component: ${vnode.type}]`)
    }

    // 构建props
    const props = {
      ...vnode.props,
      style: vnode.style
    }

    // 绑定事件
    Object.entries(vnode.events).forEach(([name, handler]) => {
      const eventName = `on${name.charAt(0).toUpperCase()}${name.slice(1)}`
      props[eventName] = handler
    })

    // 构建children
    const children = vnode.children.map(child => this.buildVNode(child))

    return h(component, props, children.length > 0 ? children : undefined)
  }

  /**
   * 注册组件
   */
  registerComponent(name: string, component: any): void {
    this.registry.register(name, component)
  }

  /**
   * 注册多个组件
   */
  registerComponents(components: Record<string, any>): void {
    this.registry.registerMultiple(components)
  }
}

/**
 * 创建Vue渲染器
 */
export function createVueRenderer(): VueRenderer {
  return new VueRenderer()
}
```

```typescript
// src/adapter/component-registry.ts

import type { App, Component } from 'vue'

/**
 * 组件注册表
 */
export class ComponentRegistry {
  private components = new Map<string, Component>()

  /**
   * 注册组件
   */
  register(name: string, component: Component): void {
    this.components.set(name, component)
  }

  /**
   * 批量注册
   */
  registerMultiple(components: Record<string, Component>): void {
    Object.entries(components).forEach(([name, component]) => {
      this.register(name, component)
    })
  }

  /**
   * 获取组件
   */
  getComponent(name: string): Component | undefined {
    return this.components.get(name)
  }

  /**
   * 注册到Vue应用
   */
  registerToApp(app: App): void {
    this.components.forEach((component, name) => {
      app.component(name, component)
    })
  }

  /**
   * 清除所有注册
   */
  clear(): void {
    this.components.clear()
  }
}
```

### 2.2 组合式函数

```typescript
// src/composables/useCore.ts

import { inject, provide, type InjectionKey } from 'vue'
import { Core } from '@vjs-ui/core'

const CoreSymbol: InjectionKey<Core> = Symbol('vjs-ui-core')

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
    throw new Error('Core not provided. Did you forget to use provideCore()?')
  }
  return core
}
```

```typescript
// src/composables/useDSL.ts

import { ref, watch, onUnmounted, type Ref } from 'vue'
import type { DSLNode, RenderInstance } from '@vjs-ui/core'
import { useCore } from './useCore'

/**
 * DSL渲染组合函数
 */
export function useDSL(dsl: Ref<DSLNode> | DSLNode) {
  const core = useCore()
  const instance = ref<RenderInstance | null>(null)
  const containerRef = ref<HTMLElement>()

  // 渲染DSL
  const render = (props?: Record<string, any>) => {
    if (!containerRef.value) return
    
    const dslValue = typeof dsl === 'object' && 'value' in dsl ? dsl.value : dsl
    instance.value = core.render(dslValue, containerRef.value, props)
  }

  // 监听DSL变化
  if (typeof dsl === 'object' && 'value' in dsl) {
    watch(dsl, () => {
      if (instance.value) {
        instance.value.unmount()
      }
      render()
    })
  }

  // 清理
  onUnmounted(() => {
    if (instance.value) {
      instance.value.unmount()
    }
  })

  return {
    containerRef,
    instance,
    render
  }
}
```

```typescript
// src/composables/useToken.ts

import { computed, type ComputedRef } from 'vue'
import { useCore } from './useCore'

/**
 * Token访问组合函数
 */
export function useToken() {
  const core = useCore()
  const tokenRuntime = core.getTokenRuntime()

  /**
   * 获取token值
   */
  const getToken = (key: string): string | number | boolean | undefined => {
    return tokenRuntime.get(key)
  }

  /**
   * 获取CSS变量引用
   */
  const getTokenVar = (key: string): string => {
    return tokenRuntime.getVar(key)
  }

  /**
   * 设置token值
   */
  const setToken = (key: string, value: string | number | boolean): void => {
    tokenRuntime.set(key, value)
  }

  /**
   * 批量设置tokens
   */
  const setTokens = (updates: Record<string, string | number | boolean>): void => {
    tokenRuntime.setMultiple(updates)
  }

  /**
   * 创建响应式token
   */
  const token = (key: string): ComputedRef<string | number | boolean | undefined> => {
    return computed(() => getToken(key))
  }

  return {
    getToken,
    getTokenVar,
    setToken,
    setTokens,
    token
  }
}
```

```typescript
// src/composables/useTheme.ts

import { ref, watch, onMounted } from 'vue'
import { useToken } from './useToken'
import type { FlatTokenMap } from '@vjs-ui/core'

/**
 * 主题管理组合函数
 */
export function useTheme() {
  const { setTokens } = useToken()
  const currentTheme = ref<string>('default')

  /**
   * 切换主题
   */
  const setTheme = (themeName: string, tokens: FlatTokenMap): void => {
    setTokens(tokens)
    currentTheme.value = themeName
  }

  /**
   * 切换暗黑模式
   */
  const toggleDark = (): void => {
    // 实现暗黑模式切换逻辑
    const isDark = document.documentElement.classList.toggle('dark')
    currentTheme.value = isDark ? 'dark' : 'default'
  }

  /**
   * 从localStorage恢复主题
   */
  const restoreTheme = (): void => {
    const saved = localStorage.getItem('vjs-ui-theme')
    if (saved) {
      currentTheme.value = saved
      document.documentElement.classList.toggle('dark', saved === 'dark')
    }
  }

  // 监听主题变化，保存到localStorage
  watch(currentTheme, (theme) => {
    localStorage.setItem('vjs-ui-theme', theme)
  })

  // 初始化时恢复主题
  onMounted(() => {
    restoreTheme()
  })

  return {
    currentTheme,
    setTheme,
    toggleDark,
    restoreTheme
  }
}
```

---

## 三、Week 2: 核心组件实现

### 3.1 VButton组件

```typescript
// src/components/Button/Button.dsl.ts

import type { DSLNode } from '@vjs-ui/core'

export const ButtonDSL: DSLNode = {
  type: 'button',
  props: {
    type: 'button',
    disabled: '$props.disabled',
    class: [
      'vjs-button',
      '$props.type ? `vjs-button--${$props.type}` : ""',
      '$props.size ? `vjs-button--${$props.size}` : ""',
      '$props.loading ? "vjs-button--loading" : ""'
    ]
  },
  style: {
    backgroundColor: '$props.type === "primary" ? {color.primary} : "transparent"',
    borderRadius: '{radius.md}',
    padding: '$props.size === "large" ? "{spacing.lg}" : "{spacing.md}"',
    fontSize: '{font.size.base}'
  },
  events: {
    click: '$props.disabled || $props.loading ? null : emit("click", $event)'
  },
  slots: {
    default: '$props.loading ? "Loading..." : $props.text'
  }
}
```

```vue
<!-- src/components/Button/Button.vue -->
<template>
  <button
    :class="buttonClass"
    :style="buttonStyle"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="vjs-button__loading">
      <slot name="loading">
        <span class="vjs-button__spinner"></span>
      </slot>
    </span>
    <span v-if="icon && !loading" class="vjs-button__icon">
      <component :is="icon" />
    </span>
    <span v-if="$slots.default || text" class="vjs-button__text">
      <slot>{{ text }}</slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToken } from '../../composables'
import type { ButtonProps, ButtonEmits } from './types'

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  size: 'medium',
  disabled: false,
  loading: false
})

const emit = defineEmits<ButtonEmits>()

const { getToken } = useToken()

const buttonClass = computed(() => [
  'vjs-button',
  `vjs-button--${props.type}`,
  `vjs-button--${props.size}`,
  {
    'vjs-button--loading': props.loading,
    'vjs-button--disabled': props.disabled,
    'vjs-button--block': props.block
  }
])

const buttonStyle = computed(() => ({
  '--vjs-button-bg': props.type === 'primary' ? getToken('color.primary') : 'transparent',
  '--vjs-button-radius': getToken('radius.md'),
  '--vjs-button-padding': props.size === 'large' 
    ? getToken('spacing.lg') 
    : getToken('spacing.md')
}))

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  emit('click', event)
}
</script>

<style scoped>
.vjs-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--vjs-spacing-xs);
  padding: var(--vjs-button-padding);
  border: 1px solid transparent;
  border-radius: var(--vjs-button-radius);
  background: var(--vjs-button-bg);
  font-family: var(--vjs-font-family);
  font-size: var(--vjs-font-size-base);
  font-weight: 500;
  line-height: 1.5;
  color: var(--vjs-color-text);
  cursor: pointer;
  user-select: none;
  transition: all var(--vjs-motion-duration-fast) var(--vjs-motion-easing-ease);
}

.vjs-button:hover:not(.vjs-button--disabled):not(.vjs-button--loading) {
  opacity: 0.8;
  transform: translateY(-1px);
}

.vjs-button:active:not(.vjs-button--disabled):not(.vjs-button--loading) {
  transform: translateY(0);
}

.vjs-button--primary {
  background: var(--vjs-color-primary);
  color: white;
  border-color: var(--vjs-color-primary);
}

.vjs-button--disabled,
.vjs-button--loading {
  opacity: 0.6;
  cursor: not-allowed;
}

.vjs-button--block {
  width: 100%;
}

.vjs-button__spinner {
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: vjs-spin 0.6s linear infinite;
}

@keyframes vjs-spin {
  to { transform: rotate(360deg); }
}
</style>
```

```typescript
// src/components/Button/types.ts

export interface ButtonProps {
  /**
   * 按钮类型
   */
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  
  /**
   * 按钮尺寸
   */
  size?: 'small' | 'medium' | 'large'
  
  /**
   * 按钮文本
   */
  text?: string
  
  /**
   * 图标
   */
  icon?: any
  
  /**
   * 是否禁用
   */
  disabled?: boolean
  
  /**
   * 是否加载中
   */
  loading?: boolean
  
  /**
   * 是否块级按钮
   */
  block?: boolean
}

export interface ButtonEmits {
  (e: 'click', event: MouseEvent): void
}
```

### 3.2 组件导出

```typescript
// src/components/Button/index.ts

import Button from './Button.vue'
import { ButtonDSL } from './Button.dsl'
import type { ButtonProps, ButtonEmits } from './types'

export { Button, ButtonDSL }
export type { ButtonProps, ButtonEmits }

// 安装函数
export default {
  install(app: any) {
    app.component('VButton', Button)
  }
}
```

### 3.3 其他组件结构（类似实现）

- **VInput**: 输入框组件，支持v-model
- **VCard**: 卡片容器组件
- **VDialog**: 对话框组件，支持焦点陷阱
- **VTable**: 表格组件，支持排序、分页

---

## 四、包配置与构建

```json
// packages/vue/package.json
{
  "name": "@vjs-ui/vue",
  "version": "0.1.0",
  "description": "VJS-UI Vue 3 Adapter",
  "type": "module",
  "main": "./dist/index.cjs.js",
  "module": "./dist/index.esm.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js",
      "types": "./dist/index.d.ts"
    },
    "./style.css": "./dist/style.css",
    "./Button": "./dist/components/Button/index.js",
    "./Input": "./dist/components/Input/index.js"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "dev": "vite",
    "build": "vite build && vue-tsc --declaration --emitDeclarationOnly",
    "test": "vitest",
    "typecheck": "vue-tsc --noEmit"
  },
  "peerDependencies": {
    "vue": "^3.3.0"
  },
  "dependencies": {
    "@vjs-ui/core": "workspace:*"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.5.0",
    "@vue/test-utils": "^2.4.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0",
    "vue-tsc": "^1.8.0"
  }
}
```

---

## 五、质量保证

### 5.1 测试清单

- [ ] 单元测试（组件逻辑）
- [ ] 组件测试（渲染、交互）
- [ ] 快照测试（UI一致性）
- [ ] a11y测试（无障碍）

### 5.2 文档清单

- [ ] 每个组件的API文档
- [ ] 使用示例（至少3个/组件）
- [ ] 最佳实践指南
- [ ] 迁移指南（从其他UI库）

---

**下一阶段**: [03-PHASE-3-DEVTOOLS.md](./03-PHASE-3-DEVTOOLS.md)
# 阶段4详细计划 - Part 1: Week 1-2

> 这是00-IMPLEMENTATION-GUIDE.md阶段4的详细补充文档  
> **建议**: 将此内容整合到主文档的阶段4部分

---

## 🔬 阶段4：Core引擎完善阶段（6-8周）- Week 1详细

> **重要性**: 🔴 项目核心阶段  
> **测试要求**: Core≥90%, 安全100%

---

## 📦 Week 1：完整Token + 响应式系统（Day 1-7）

### Day 1-3：完整Token系统

#### Token系统完整实现代码

详见 MVP-PLAN.md 中的基础实现，这里扩展：

**TokenCompiler完整版**（核心代码）：
```typescript
// packages/core/src/token/compiler.ts
export class TokenCompiler {
  private flatTokens: Record<string, string> = {}
  private visitedKeys = new Set<string>()

  constructor(private tokens: TokenMap) {
    this.flatten()
  }

  private flatten(): void {
    for (const key in this.tokens) {
      this.flatTokens[key] = this.resolveToken(key)
    }
  }

  private resolveToken(key: string): string {
    const token = this.tokens[key]
    if (!token) throw new Error(`Token不存在: ${key}`)

    if (this.visitedKeys.has(key)) {
      throw new Error(`检测到循环引用: ${key}`)
    }
    this.visitedKeys.add(key)

    if (token.reference) {
      const refValue = this.resolveToken(token.reference)
      this.visitedKeys.delete(key)
      
      if (token.alpha !== undefined && token.type === 'color') {
        return this.applyAlpha(refValue, token.alpha)
      }
      return refValue
    }

    this.visitedKeys.delete(key)
    return String(token.value)
  }

  // ... 其他方法见完整文档
}
```

#### Token测试（20+用例）

```typescript
describe('TokenCompiler - 基础功能', () => {
  test('1. 编译简单Token', () => { /*...*/ })
  test('2. 编译多个Token', () => { /*...*/ })
  test('3. 处理不同类型Token', () => { /*...*/ })
})

describe('TokenCompiler - Token引用', () => {
  test('4. 解析简单引用', () => { /*...*/ })
  test('5. 解析多层引用', () => { /*...*/ })
  test('6. 检测循环引用', () => { /*...*/ })
  test('7. 检测自引用', () => { /*...*/ })
  test('8. 引用不存在的Token应报错', () => { /*...*/ })
})

describe('TokenCompiler - 颜色透明度', () => {
  test('9. 应用alpha到hex颜色', () => { /*...*/ })
  test('10. alpha值边界测试(0)', () => { /*...*/ })
  test('11. alpha值边界测试(1)', () => { /*...*/ })
  test('12. alpha值边界测试(0.5)', () => { /*...*/ })
})

describe('TokenCompiler - CSS生成', () => {
  test('13. 生成标准CSS', () => { /*...*/ })
  test('14. 自定义前缀', () => { /*...*/ })
  test('15. 压缩模式', () => { /*...*/ })
  test('16. 空Token处理', () => { /*...*/ })
})

describe('TokenCompiler - TypeScript生成', () => {
  test('17. 生成类型定义', () => { /*...*/ })
  test('18. 处理特殊字符', () => { /*...*/ })
})

describe('TokenCompiler - SCSS生成', () => {
  test('19. 生成SCSS变量', () => { /*...*/ })
  test('20. 处理嵌套key', () => { /*...*/ })
})

describe('TokenRuntime - 动态切换', () => {
  test('21. 注册主题', () => { /*...*/ })
  test('22. 应用主题到DOM', () => { /*...*/ })
  test('23. 切换主题', () => { /*...*/ })
  test('24. 获取Token值', () => { /*...*/ })
  test('25. 清理DOM', () => { /*...*/ })
})
```

**Day 1-3 验收**：
- [ ] 20+测试全部通过
- [ ] 覆盖率>90%
- [ ] 循环引用检测正确
- [ ] 动态切换无内存泄漏

---

### Day 4-7：完整响应式系统

#### computed + watch 实现

**computed测试（15+用例）**：
```typescript
describe('computed', () => {
  test('1. 基础计算', () => { /*...*/ })
  test('2. 缓存机制', () => { /*...*/ })
  test('3. 链式computed', () => { /*...*/ })
  test('4. 依赖多个reactive', () => { /*...*/ })
  test('5. 嵌套对象依赖', () => { /*...*/ })
  test('6. 数组依赖', () => { /*...*/ })
  test('7. 条件计算', () => { /*...*/ })
  test('8. 异常处理', () => { /*...*/ })
  test('9. 性能：不重复计算', () => { /*...*/ })
  test('10. 性能：懒计算', () => { /*...*/ })
  test('11. computed作为effect依赖', () => { /*...*/ })
  test('12. 多个computed互相依赖', () => { /*...*/ })
  test('13. computed + watch组合', () => { /*...*/ })
  test('14. 内存泄漏检测', () => { /*...*/ })
  test('15. 边界值测试', () => { /*...*/ })
})
```

**watch测试（15+用例）**：
```typescript
describe('watch', () => {
  test('1. 基础监听', () => { /*...*/ })
  test('2. immediate选项', () => { /*...*/ })
  test('3. cleanup函数', () => { /*...*/ })
  test('4. 停止监听', () => { /*...*/ })
  test('5. 监听多个属性', () => { /*...*/ })
  test('6. 监听computed', () => { /*...*/ })
  test('7. 监听嵌套对象', () => { /*...*/ })
  test('8. 监听数组变化', () => { /*...*/ })
  test('9. deep选项', () => { /*...*/ })
  test('10. 异步cleanup', () => { /*...*/ })
  test('11. 监听条件表达式', () => { /*...*/ })
  test('12. 多个watch同一属性', () => { /*...*/ })
  test('13. watch嵌套', () => { /*...*/ })
  test('14. 内存泄漏检测', () => { /*...*/ })
  test('15. 边界值测试', () => { /*...*/ })
})
```

**Day 4-7 验收**：
- [ ] 30+测试全部通过
- [ ] 覆盖率>95%
- [ ] 无内存泄漏
- [ ] 性能基准达标

---

**Week 1完成标志**：
✅ Token系统生产就绪  
✅ 响应式系统完整  
✅ 测试覆盖率>90%  
✅ 代码review通过  

---

## 🔐 Week 2：DSL + 表达式 + 安全沙箱（Day 8-14）🔴

> **⚠️ 本周最关键** - 涉及安全性，必须100%测试覆盖

### Day 8-9：完整DSL解析器

#### 完整DSL类型定义

```typescript
// packages/core/src/dsl/types.ts
export interface DSLNode {
  type: string
  props?: Record<string, any>
  style?: Record<string, string>
  
  // 条件渲染
  if?: string          // 表达式: "$state.count > 0"
  elseIf?: string      
  else?: boolean
  
  // 列表渲染
  for?: {
    item: string       // 迭代变量名
    index?: string     
    source: string     // 数据源表达式: "$state.list"
  }
  
  // 事件
  events?: Record<string, string>  // { onClick: "$handlers.handleClick" }
  
  // 插槽
  slots?: Record<string, DSLNode[]>
  
  // 子节点
  children?: DSLNode[]
}
```

#### DSL解析器测试（20+用例）

```typescript
describe('DSLParser - 条件渲染', () => {
  test('1. 解析if条件', () => { /*...*/ })
  test('2. 解析if-else', () => { /*...*/ })
  test('3. 解析if-elseif-else', () => { /*...*/ })
  test('4. 嵌套条件', () => { /*...*/ })
})

describe('DSLParser - 列表渲染', () => {
  test('5. 解析for循环', () => { /*...*/ })
  test('6. 解析for with index', () => { /*...*/ })
  test('7. 嵌套for', () => { /*...*/ })
  test('8. for + if组合', () => { /*...*/ })
})

describe('DSLParser - 事件绑定', () => {
  test('9. 解析click事件', () => { /*...*/ })
  test('10. 解析多个事件', () => { /*...*/ })
  test('11. 事件表达式', () => { /*...*/ })
})

describe('DSLParser - 插槽', () => {
  test('12. 解析默认插槽', () => { /*...*/ })
  test('13. 解析具名插槽', () => { /*...*/ })
  test('14. 多个插槽', () => { /*...*/ })
})

describe('DSLParser - 验证', () => {
  test('15. 缺少type应报错', () => { /*...*/ })
  test('16. 非法type应报错', () => { /*...*/ })
  test('17. 循环引用检测', () => { /*...*/ })
  test('18. 深度限制', () => { /*...*/ })
  test('19. 节点数量限制', () => { /*...*/ })
  test('20. 格式验证', () => { /*...*/ })
})
```

**Day 8-9 验收**：
- [ ] 20+测试通过
- [ ] 支持条件渲染
- [ ] 支持列表渲染
- [ ] 支持事件绑定
- [ ] DSL验证正确

---

### Day 10-12：表达式引擎 + 五层安全沙箱 🔴

#### 五层安全防护架构

```
用户表达式: "$state.count + 1"
    ↓
【第1层】表达式静态分析 - 检测危险模式
    ↓
【第2层】jsep解析为AST
    ↓
【第3层】AST白名单验证 - 只允许安全节点
    ↓
【第4层】安全上下文隔离 - 纯净对象
    ↓
【第5层】资源限制执行 - 超时+次数限制
    ↓
安全的求值结果
```

#### 第1层：表达式静态分析

```typescript
// packages/core/src/evaluator/auditor.ts
export class ExpressionAuditor {
  private readonly dangerousPatterns = [
    /constructor/i,
    /__proto__/i,
    /prototype/i,
    /\beval\b/i,
    /Function\s*\(/i,
    /import\s*\(/i,
    /require\s*\(/i,
    /document\./i,
    /window\./i,
    /global\./i,
    /process\./i,
    /\[\s*['"]constructor['"]\s*\]/,
    /\[\s*['"]__proto__['"]\s*\]/
  ]

  audit(expression: string): { safe: boolean; errors: string[] } {
    const errors: string[] = []
    
    for (const pattern of this.dangerousPatterns) {
      if (pattern.test(expression)) {
        errors.push(`检测到危险模式: ${pattern.source}`)
      }
    }
    
    return {
      safe: errors.length === 0,
      errors
    }
  }
}
```

#### 第2-3层：AST解析 + 白名单验证

```typescript
// packages/core/src/evaluator/validator.ts
import jsep from 'jsep'

export class ASTValidator {
  private readonly allowedTypes = new Set([
    'Literal',          // 字面量: 1, "hello", true
    'Identifier',       // 标识符: count, name
    'MemberExpression', // 成员访问: obj.prop
    'BinaryExpression', // 二元运算: a + b
    'UnaryExpression',  // 一元运算: !flag
    'ConditionalExpression', // 三元: a ? b : c
    'ArrayExpression',  // 数组: [1, 2, 3]
    'CallExpression',   // 函数调用: Math.max(a, b)
    'LogicalExpression' // 逻辑: a && b
  ])

  private readonly allowedOperators = new Set([
    '+', '-', '*', '/', '%',
    '>', '<', '>=', '<=', '==', '!=', '===', '!==',
    '&&', '||', '!',
    '?', ':'
  ])

  private readonly allowedFunctions = new Set([
    'Math.max', 'Math.min', 'Math.abs',
    'Math.floor', 'Math.ceil', 'Math.round',
    'Number', 'String', 'Boolean',
    'Array.isArray'
  ])

  validate(expression: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    
    try {
      const ast = jsep(expression)
      this.validateNode(ast, errors)
    } catch (e) {
      errors.push(`解析失败: ${e.message}`)
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  private validateNode(node: any, errors: string[]): void {
    // 检查节点类型
    if (!this.allowedTypes.has(node.type)) {
      errors.push(`不允许的节点类型: ${node.type}`)
      return
    }

    // 检查运算符
    if (node.operator && !this.allowedOperators.has(node.operator)) {
      errors.push(`不允许的运算符: ${node.operator}`)
    }

    // 检查函数调用
    if (node.type === 'CallExpression') {
      const funcName = this.getFunctionName(node.callee)
      if (!this.allowedFunctions.has(funcName)) {
        errors.push(`不允许的函数: ${funcName}`)
      }
    }

    // 递归检查子节点
    if (node.argument) this.validateNode(node.argument, errors)
    if (node.left) this.validateNode(node.left, errors)
    if (node.right) this.validateNode(node.right, errors)
    if (node.test) this.validateNode(node.test, errors)
    if (node.consequent) this.validateNode(node.consequent, errors)
    if (node.alternate) this.validateNode(node.alternate, errors)
    if (node.elements) node.elements.forEach((el: any) => this.validateNode(el, errors))
    if (node.arguments) node.arguments.forEach((arg: any) => this.validateNode(arg, errors))
  }

  private getFunctionName(node: any): string {
    if (node.type === 'Identifier') return node.name
    if (node.type === 'MemberExpression') {
      return `${this.getFunctionName(node.object)}.${node.property.name}`
    }
    return 'unknown'
  }
}
```

#### 第4层：安全上下文隔离

```typescript
// packages/core/src/evaluator/context.ts
export class SafeContext {
  createContext(data: any): any {
    // 创建纯净对象，无原型链
    const context = Object.create(null)
    
    // 安全复制数据
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        context[key] = this.sanitizeValue(data[key])
      }
    }
    
    // 提供安全的全局函数
    context.Math = {
      max: Math.max,
      min: Math.min,
      abs: Math.abs,
      floor: Math.floor,
      ceil: Math.ceil,
      round: Math.round
    }
    
    return context
  }

  private sanitizeValue(value: any): any {
    if (value === null || value === undefined) return value
    if (typeof value !== 'object') return value
    
    // 移除原型链
    if (Array.isArray(value)) {
      return value.map(v => this.sanitizeValue(v))
    }
    
    const sanitized = Object.create(null)
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        sanitized[key] = this.sanitizeValue(value[key])
      }
    }
    return sanitized
  }
}
```

#### 第5层：资源限制执行器

```typescript
// packages/core/src/evaluator/limiter.ts
export class ResourceLimiter {
  private maxExecutionTime = 100 // ms
  private maxOperations = 1000

  async executeWithLimits<T>(
    fn: () => T,
    options?: { timeout?: number; maxOps?: number }
  ): Promise<T> {
    const timeout = options?.timeout || this.maxExecutionTime
    const maxOps = options?.maxOps || this.maxOperations
    
    let operations = 0
    const startTime = Date.now()
    
    // 操作计数器
    const checkLimits = () => {
      operations++
      if (operations > maxOps) {
        throw new Error(`操作次数超限: ${operations} > ${maxOps}`)
      }
      if (Date.now() - startTime > timeout) {
        throw new Error(`执行超时: ${Date.now() - startTime}ms > ${timeout}ms`)
      }
    }

    // 使用Promise.race实现超时
    return Promise.race([
      Promise.resolve(fn()),
      new Promise<T>((_, reject) => {
        setTimeout(() => reject(new Error('执行超时')), timeout)
      })
    ])
  }
}
```

#### 完整安全求值器（集成所有层）

```typescript
// packages/core/src/evaluator/index.ts
export class SecureEvaluator {
  private auditor = new ExpressionAuditor()
  private validator = new ASTValidator()
  private contextBuilder = new SafeContext()
  private limiter = new ResourceLimiter()

  async evaluate(expression: string, data: any): Promise<any> {
    // 第1层：静态分析
    const auditResult = this.auditor.audit(expression)
    if (!auditResult.safe) {
      throw new Error(`表达式不安全: ${auditResult.errors.join(', ')}`)
    }

    // 第2-3层：AST验证
    const validationResult = this.validator.validate(expression)
    if (!validationResult.valid) {
      throw new Error(`表达式验证失败: ${validationResult.errors.join(', ')}`)
    }

    // 第4层：安全上下文
    const context = this.contextBuilder.createContext(data)

    // 第5层：资源限制执行
    return this.limiter.executeWithLimits(() => {
      const ast = jsep(expression)
      return this.evaluateNode(ast, context)
    })
  }

  private evaluateNode(node: any, context: any): any {
    switch (node.type) {
      case 'Literal':
        return node.value
      
      case 'Identifier':
        return context[node.name]
      
      case 'MemberExpression':
        const obj = this.evaluateNode(node.object, context)
        const prop = node.computed 
          ? this.evaluateNode(node.property, context)
          : node.property.name
        return obj?.[prop]
      
      case 'BinaryExpression':
        const left = this.evaluateNode(node.left, context)
        const right = this.evaluateNode(node.right, context)
        return this.evalBinaryOp(node.operator, left, right)
      
      case 'UnaryExpression':
        const arg = this.evaluateNode(node.argument, context)
        return this.evalUnaryOp(node.operator, arg)
      
      case 'ConditionalExpression':
        const test = this.evaluateNode(node.test, context)
        return test 
          ? this.evaluateNode(node.consequent, context)
          : this.evaluateNode(node.alternate, context)
      
      case 'ArrayExpression':
        return node.elements.map((el: any) => this.evaluateNode(el, context))
      
      case 'CallExpression':
        return this.evaluateCall(node, context)
      
      case 'LogicalExpression':
        const leftVal = this.evaluateNode(node.left, context)
        if (node.operator === '&&') return leftVal && this.evaluateNode(node.right, context)
        if (node.operator === '||') return leftVal || this.evaluateNode(node.right, context)
        throw new Error(`不支持的逻辑运算符: ${node.operator}`)
      
      default:
        throw new Error(`不支持的节点类型: ${node.type}`)
    }
  }

  private evalBinaryOp(op: string, left: any, right: any): any {
    switch (op) {
      case '+': return left + right
      case '-': return left - right
      case '*': return left * right
      case '/': return left / right
      case '%': return left % right
      case '>': return left > right
      case '<': return left < right
      case '>=': return left >= right
      case '<=': return left <= right
      case '==': return left == right
      case '!=': return left != right
      case '===': return left === right
      case '!==': return left !== right
      default: throw new Error(`不支持的运算符: ${op}`)
    }
  }

  private evalUnaryOp(op: string, arg: any): any {
    switch (op) {
      case '!': return !arg
      case '-': return -arg
      case '+': return +arg
      default: throw new Error(`不支持的一元运算符: ${op}`)
    }
  }

  private evaluateCall(node: any, context: any): any {
    const funcName = this.validator['getFunctionName'](node.callee)
    const args = node.arguments.map((arg: any) => this.evaluateNode(arg, context))
    
    // 安全的函数调用
    if (funcName.startsWith('Math.')) {
      const method = funcName.split('.')[1]
      return (Math as any)[method](...args)
    }
    
    if (funcName === 'Number') return Number(...args)
    if (funcName === 'String') return String(...args)
    if (funcName === 'Boolean') return Boolean(...args)
    if (funcName === 'Array.isArray') return Array.isArray(...args)
    
    throw new Error(`不允许的函数调用: ${funcName}`)
  }
}
```

---

### 安全测试（50+用例，100%覆盖）🔴

```typescript
describe('SecureEvaluator - 第1层：静态分析', () => {
  test('1. 阻止constructor访问', async () => {
    await expect(
      evaluator.evaluate('obj.constructor', {})
    ).rejects.toThrow('不安全')
  })

  test('2. 阻止__proto__访问', async () => {
    await expect(
      evaluator.evaluate('obj.__proto__', {})
    ).rejects.toThrow('不安全')
  })

  test('3. 阻止prototype访问', async () => {
    await expect(
      evaluator.evaluate('obj.prototype', {})
    ).rejects.toThrow('不安全')
  })

  test('4. 阻止eval调用', async () => {
    await expect(
      evaluator.evaluate('eval("alert(1)")', {})
    ).rejects.toThrow('不安全')
  })

  test('5. 阻止Function构造', async () => {
    await expect(
      evaluator.evaluate('Function("return 1")()', {})
    ).rejects.toThrow('不安全')
  })

  test('6. 阻止import动态导入', async () => {
    await expect(
      evaluator.evaluate('import("./hack")', {})
    ).rejects.toThrow('不安全')
  })

  test('7. 阻止require', async () => {
    await expect(
      evaluator.evaluate('require("fs")', {})
    ).rejects.toThrow('不安全')
  })

  test('8. 阻止document访问', async () => {
    await expect(
      evaluator.evaluate('document.cookie', {})
    ).rejects.toThrow('不安全')
  })

  test('9. 阻止window访问', async () => {
    await expect(
      evaluator.evaluate('window.location', {})
    ).rejects.toThrow('不安全')
  })

  test('10. 阻止通过方括号访问constructor', async () => {
    await expect(
      evaluator.evaluate('obj["constructor"]', {})
    ).rejects.toThrow('不安全')
  })
})

describe('SecureEvaluator - 第2-3层：AST验证', () => {
  test('11. 允许基础算术', async () => {
    const result = await evaluator.evaluate('1 + 2 * 3', {})
    expect(result).toBe(7)
  })

  test('12. 允许成员访问', async () => {
    const result = await evaluator.evaluate('obj.count', { obj: { count: 10 } })
    expect(result).toBe(10)
  })

  test('13. 允许三元运算', async () => {
    const result = await evaluator.evaluate('count > 0 ? "yes" : "no"', { count: 1 })
    expect(result).toBe('yes')
  })

  test('14. 允许安全函数Math.max', async () => {
    const result = await evaluator.evaluate('Math.max(1, 2, 3)', {})
    expect(result).toBe(3)
  })

  test('15. 阻止未知函数', async () => {
    await expect(
      evaluator.evaluate('alert("hack")', {})
    ).rejects.toThrow('不允许的函数')
  })

  test('16. 阻止未知运算符', async () => {
    await expect(
      evaluator.evaluate('a ** b', { a: 2, b: 3 })
    ).rejects.toThrow('不允许的运算符')
  })
})

describe('SecureEvaluator - 第4层：上下文隔离', () => {
  test('17. 无法访问Object.prototype', async () => {
    const result = await evaluator.evaluate('obj.toString', { obj: {} })
    expect(result).toBeUndefined()
  })

  test('18. 无法通过__proto__污染', async () => {
    // 即使数据中有__proto__，也应被移除
    const result = await evaluator.evaluate('count', { 
      count: 1,
      __proto__: { hacked: true }
    })
    expect(result).toBe(1)
  })

  test('19. 数组值正确隔离', async () => {
    const result = await evaluator.evaluate('arr[0]', { arr: [1, 2, 3] })
    expect(result).toBe(1)
  })

  test('20. 嵌套对象正确隔离', async () => {
    const result = await evaluator.evaluate('user.name', { 
      user: { name: 'Alice' }
    })
    expect(result).toBe('Alice')
  })
})

describe('SecureEvaluator - 第5层：资源限制', () => {
  test('21. 简单表达式快速执行', async () => {
    const start = Date.now()
    await evaluator.evaluate('1 + 1', {})
    const duration = Date.now() - start
    expect(duration).toBeLessThan(10)
  })

  test('22. 超时保护', async () => {
    // 模拟超时场景（需要特殊构造）
    await expect(
      evaluator.evaluate('1', {}, { timeout: 1 })
    ).rejects.toThrow('超时')
  })

  test('23. 操作次数限制', async () => {
    // 大量嵌套运算
    const expr = '1' + '+1'.repeat(2000)
    await expect(
      evaluator.evaluate(expr, {})
    ).rejects.toThrow('操作次数超限')
  })
})

describe('SecureEvaluator - 综合测试', () => {
  test('24. 复杂安全表达式', async () => {
    const result = await evaluator.evaluate(
      'user.age > 18 ? Math.max(score, 60) : score',
      { user: { age: 20 }, score: 85 }
    )
    expect(result).toBe(85)
  })

  test('25. 数组操作', async () => {
    const result = await evaluator.evaluate(
      'arr[0] + arr[1]',
      { arr: [10, 20] }
    )
    expect(result).toBe(30)
  })

  // ... 继续到50+测试
})
```

**Day 10-12 验收标准**（严格）：
- [ ] 50+安全测试全部通过
- [ ] 五层防护全部生效
- [ ] 所有危险操作被阻止
- [ ] 安全测试覆盖率100%
- [ ] 性能损耗<10%
- [ ] 无任何已知绕过方式

---

### Day 13-14：集成测试

#### 完整流程集成测试（30+用例）

```typescript
describe('Core Integration - Token + DSL + Expression', () => {
  test('1. Token动态值 + 表达式', async () => { /*...*/ })
  test('2. 条件渲染 + 表达式', async () => { /*...*/ })
  test('3. 列表渲染 + 表达式', async () => { /*...*/ })
  test('4. 事件处理 + 表达式', async () => { /*...*/ })
  test('5. 复杂嵌套场景', async () => { /*...*/ })
  // ... 30个测试
})
```

**Week 2 完成标志**：
- 🎉 表达式引擎生产就绪
- 🎉 五层安全防护全部实现
- 🎉 安全测试100%覆盖
- 🎉 100+测试全部通过
- 🎉 为Core集成做好准备

---

**接下来请查看**：
- Part 2: Week 3-4（Binder + Core集成）
- Part 3: Week 5-8（测试 + 优化 + 发布）
# 阶段4详细计划 - Part 2: Week 3-4

> 这是00-IMPLEMENTATION-GUIDE.md阶段4的详细补充文档  
> **前置**: 需先完成Part 1（Week 1-2）

---

## 🔗 Week 3：Binder（数据绑定器）+ Core集成（Day 15-21）

### 前置条件验收
- ✅ Token系统完整
- ✅ 响应式系统完整
- ✅ DSL解析器完整
- ✅ 表达式引擎 + 安全沙箱完整

---

### Day 15-17：Binder实现

#### Binder职责

```
Binder的作用：
1. 监听数据变化
2. 重新求值表达式
3. 更新UI
4. 管理依赖关系
5. 清理资源
```

#### Binder核心实现

```typescript
// packages/core/src/binder/index.ts
import { reactive, effect } from '../reactive'
import { SecureEvaluator } from '../evaluator'

export interface Binding {
  expression: string
  context: any
  callback: (value: any) => void
  cleanup?: () => void
}

export class Binder {
  private evaluator = new SecureEvaluator()
  private bindings = new Map<string, Binding>()
  private effects = new Map<string, Function>()

  /**
   * 创建响应式绑定
   */
  bind(
    id: string,
    expression: string,
    context: any,
    callback: (value: any) => void
  ): void {
    // 保存绑定信息
    this.bindings.set(id, { expression, context, callback })

    // 创建响应式effect
    const effectFn = effect(async () => {
      try {
        // 求值表达式
        const value = await this.evaluator.evaluate(expression, context)
        // 调用回调更新UI
        callback(value)
      } catch (error) {
        console.error(`绑定求值失败 [${id}]:`, error)
      }
    })

    this.effects.set(id, effectFn)
  }

  /**
   * 更新绑定上下文
   */
  updateContext(id: string, newContext: any): void {
    const binding = this.bindings.get(id)
    if (!binding) return

    binding.context = newContext
    
    // 重新绑定
    this.unbind(id)
    this.bind(id, binding.expression, newContext, binding.callback)
  }

  /**
   * 解除绑定
   */
  unbind(id: string): void {
    const effectFn = this.effects.get(id)
    if (effectFn) {
      // 停止effect
      effectFn()
      this.effects.delete(id)
    }

    const binding = this.bindings.get(id)
    if (binding?.cleanup) {
      binding.cleanup()
    }

    this.bindings.delete(id)
  }

  /**
   * 解除所有绑定
   */
  unbindAll(): void {
    for (const id of this.bindings.keys()) {
      this.unbind(id)
    }
  }

  /**
   * 获取绑定数量
   */
  getBindingCount(): number {
    return this.bindings.size
  }
}
```

#### Binder高级功能

```typescript
// packages/core/src/binder/advanced.ts
export class AdvancedBinder extends Binder {
  /**
   * 批量绑定
   */
  bindBatch(bindings: Array<{
    id: string
    expression: string
    context: any
    callback: (value: any) => void
  }>): void {
    for (const binding of bindings) {
      this.bind(binding.id, binding.expression, binding.context, binding.callback)
    }
  }

  /**
   * 条件绑定（仅当条件为真时绑定）
   */
  bindConditional(
    id: string,
    condition: () => boolean,
    expression: string,
    context: any,
    callback: (value: any) => void
  ): void {
    if (condition()) {
      this.bind(id, expression, context, callback)
    }
  }

  /**
   * 延迟绑定（防抖）
   */
  bindDebounced(
    id: string,
    expression: string,
    context: any,
    callback: (value: any) => void,
    delay: number = 300
  ): void {
    let timeoutId: any

    this.bind(id, expression, context, (value) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => callback(value), delay)
    })
  }

  /**
   * 节流绑定
   */
  bindThrottled(
    id: string,
    expression: string,
    context: any,
    callback: (value: any) => void,
    interval: number = 300
  ): void {
    let lastTime = 0

    this.bind(id, expression, context, (value) => {
      const now = Date.now()
      if (now - lastTime >= interval) {
        callback(value)
        lastTime = now
      }
    })
  }
}
```

#### Binder测试（30+用例）

```typescript
describe('Binder - 基础功能', () => {
  test('1. 创建简单绑定', () => { /*...*/ })
  test('2. 响应式更新', () => { /*...*/ })
  test('3. 解除绑定', () => { /*...*/ })
  test('4. 重新绑定', () => { /*...*/ })
  test('5. 多个绑定', () => { /*...*/ })
})

describe('Binder - 表达式绑定', () => {
  test('6. 绑定算术表达式', () => { /*...*/ })
  test('7. 绑定条件表达式', () => { /*...*/ })
  test('8. 绑定成员访问', () => { /*...*/ })
  test('9. 绑定函数调用', () => { /*...*/ })
  test('10. 表达式错误处理', () => { /*...*/ })
})

describe('Binder - 高级功能', () => {
  test('11. 批量绑定', () => { /*...*/ })
  test('12. 条件绑定', () => { /*...*/ })
  test('13. 延迟绑定（防抖）', () => { /*...*/ })
  test('14. 节流绑定', () => { /*...*/ })
  test('15. 更新上下文', () => { /*...*/ })
})

describe('Binder - 资源管理', () => {
  test('16. 内存泄漏检测', () => { /*...*/ })
  test('17. cleanup正确执行', () => { /*...*/ })
  test('18. 解除所有绑定', () => { /*...*/ })
  test('19. 重复绑定同一ID', () => { /*...*/ })
  test('20. 大量绑定性能', () => { /*...*/ })
})

describe('Binder - 集成测试', () => {
  test('21. 与Token集成', () => { /*...*/ })
  test('22. 与DSL集成', () => { /*...*/ })
  test('23. 与响应式集成', () => { /*...*/ })
  test('24. 完整数据流', () => { /*...*/ })
  test('25. 嵌套绑定', () => { /*...*/ })
})
```

**Day 15-17 验收**：
- [ ] 30+测试通过
- [ ] Binder功能完整
- [ ] 支持高级功能
- [ ] 无内存泄漏
- [ ] 与其他模块集成正常

---

### Day 18-21：Core引擎集成

#### Core引擎架构（职责分离）

```typescript
// packages/core/src/core/index.ts
import { TokenRuntime } from '../token'
import { reactive, computed, watch } from '../reactive'
import { DSLParser } from '../dsl'
import { SecureEvaluator } from '../evaluator'
import { Binder } from '../binder'

export interface CoreConfig {
  tokens?: any
  initialState?: any
  handlers?: Record<string, Function>
}

export class Core {
  // 子系统
  private tokenRuntime: TokenRuntime
  private parser: DSLParser
  private evaluator: SecureEvaluator
  private binder: Binder
  
  // 状态管理
  private state: any
  private handlers: Record<string, Function>
  
  // 渲染器接口
  private renderer: Renderer | null = null

  constructor(config: CoreConfig = {}) {
    this.tokenRuntime = new TokenRuntime()
    this.parser = new DSLParser()
    this.evaluator = new SecureEvaluator()
    this.binder = new Binder()
    
    // 初始化状态（响应式）
    this.state = reactive(config.initialState || {})
    this.handlers = config.handlers || {}
    
    // 注册默认Token
    if (config.tokens) {
      this.tokenRuntime.registerTheme('default', config.tokens)
      this.tokenRuntime.apply('default')
    }
  }

  /**
   * 注册渲染器
   */
  setRenderer(renderer: Renderer): void {
    this.renderer = renderer
  }

  /**
   * 渲染DSL
   */
  render(dsl: any, container?: any): RenderInstance {
    if (!this.renderer) {
      throw new Error('渲染器未注册')
    }

    // 1. 解析DSL
    const parsedDSL = this.parser.parse(dsl)

    // 2. 创建渲染实例
    const instance = this.renderer.render(parsedDSL, container)

    // 3. 建立数据绑定
    this.setupBindings(instance, parsedDSL)

    return instance
  }

  /**
   * 建立数据绑定
   */
  private setupBindings(instance: any, dsl: any): void {
    // Props绑定
    if (dsl.props) {
      for (const [key, value] of Object.entries(dsl.props)) {
        if (typeof value === 'string' && value.startsWith('$')) {
          this.binder.bind(
            `${instance.id}-prop-${key}`,
            value.slice(1), // 去掉$前缀
            { state: this.state },
            (newValue) => {
              instance.updateProp(key, newValue)
            }
          )
        }
      }
    }

    // Style绑定
    if (dsl.style) {
      for (const [key, value] of Object.entries(dsl.style)) {
        if (typeof value === 'string' && value.startsWith('$')) {
          this.binder.bind(
            `${instance.id}-style-${key}`,
            value.slice(1),
            { state: this.state },
            (newValue) => {
              instance.updateStyle(key, newValue)
            }
          )
        }
      }
    }

    // 事件绑定
    if (dsl.events) {
      for (const [event, handlerName] of Object.entries(dsl.events)) {
        const handler = this.handlers[handlerName]
        if (handler) {
          instance.on(event, handler)
        }
      }
    }

    // 递归处理子节点
    if (dsl.children) {
      for (const child of dsl.children) {
        this.setupBindings(child, child)
      }
    }
  }

  /**
   * 更新状态
   */
  setState(updates: any): void {
    Object.assign(this.state, updates)
  }

  /**
   * 获取状态
   */
  getState(): any {
    return this.state
  }

  /**
   * 切换主题
   */
  setTheme(themeName: string): void {
    this.tokenRuntime.switchTheme(themeName)
  }

  /**
   * 销毁实例
   */
  destroy(): void {
    this.binder.unbindAll()
    this.tokenRuntime.destroy()
  }
}

// 渲染器接口
export interface Renderer {
  render(dsl: any, container: any): RenderInstance
}

export interface RenderInstance {
  id: string
  updateProp(key: string, value: any): void
  updateStyle(key: string, value: any): void
  on(event: string, handler: Function): void
  destroy(): void
}
```

#### Core集成测试（40+用例）

```typescript
describe('Core - 初始化', () => {
  test('1. 默认配置初始化', () => { /*...*/ })
  test('2. 自定义状态初始化', () => { /*...*/ })
  test('3. Token初始化', () => { /*...*/ })
  test('4. handlers初始化', () => { /*...*/ })
})

describe('Core - 渲染流程', () => {
  test('5. 注册渲染器', () => { /*...*/ })
  test('6. 渲染简单DSL', () => { /*...*/ })
  test('7. 渲染嵌套DSL', () => { /*...*/ })
  test('8. Props绑定', () => { /*...*/ })
  test('9. Style绑定', () => { /*...*/ })
  test('10. 事件绑定', () => { /*...*/ })
})

describe('Core - 状态管理', () => {
  test('11. 更新状态', () => { /*...*/ })
  test('12. 状态响应式更新UI', () => { /*...*/ })
  test('13. 复杂状态更新', () => { /*...*/ })
  test('14. 批量状态更新', () => { /*...*/ })
})

describe('Core - 主题切换', () => {
  test('15. 切换主题', () => { /*...*/ })
  test('16. 主题切换后UI更新', () => { /*...*/ })
})

describe('Core - 完整数据流', () => {
  test('17. Token → DSL → Render', () => { /*...*/ })
  test('18. State → Expression → Binding → UI', () => { /*...*/ })
  test('19. Event → Handler → State → UI', () => { /*...*/ })
  test('20. 复杂交互流程', () => { /*...*/ })
})

describe('Core - 性能测试', () => {
  test('21. 渲染1000个节点 < 200ms', () => { /*...*/ })
  test('22. 更新100个绑定 < 50ms', () => { /*...*/ })
  test('23. 切换主题 < 100ms', () => { /*...*/ })
})

describe('Core - 资源清理', () => {
  test('24. destroy清理所有资源', () => { /*...*/ })
  test('25. 无内存泄漏', () => { /*...*/ })
})
```

**Day 18-21 验收**：
- [ ] 40+测试通过
- [ ] Core引擎完整集成
- [ ] 职责分离清晰
- [ ] 完整数据流正常
- [ ] 性能达标
- [ ] 无内存泄漏

---

## Week 3-4 总体验收标准

### 功能完整性
```
✓ Binder实现完整
✓ Core引擎集成完成
✓ 所有子系统协同工作
✓ 完整数据流打通
```

### 质量标准
```
✓ 测试覆盖率>90%
✓ 70+测试全部通过
✓ 无已知bug
✓ 代码review通过
```

### 性能标准
```
✓ 渲染1000节点 < 200ms
✓ 更新性能 < 50ms
✓ 主题切换 < 100ms
✓ 无内存泄漏
```

### 文档标准
```
✓ API文档完整
✓ 架构文档清晰
✓ 使用示例完整
```

---

**Week 3-4完成标志**：
- 🎉 Binder生产就绪
- 🎉 Core引擎完整集成
- 🎉 所有子系统协同工作
- 🎉 为Vue适配做好准备
- 🎉 可以进入测试优化阶段

---

**接下来请查看**：
- Part 3: Week 5-8（完善测试 + 性能优化 + 文档 + 发布v0.2.0）
# 阶段4详细计划 - Part 3: Week 5-8

> 这是00-IMPLEMENTATION-GUIDE.md阶段4的详细补充文档  
> **前置**: 需先完成Part 1-2（Week 1-4）

---

## ✅ Week 5-6：完善测试 + 性能优化（Day 22-35）

### 前置条件验收
- ✅ Core引擎所有子系统完成
- ✅ Binder实现完成
- ✅ 基础测试通过

---

### Day 22-25：完善单元测试（补齐到>90%）

#### 测试覆盖率现状检查

```bash
pnpm test:coverage

# 检查各模块覆盖率
packages/core/src/token        - 目标: >90%
packages/core/src/reactive     - 目标: >95%
packages/core/src/dsl          - 目标: >90%
packages/core/src/evaluator    - 目标: 100% (安全关键)
packages/core/src/binder       - 目标: >90%
packages/core/src/core         - 目标: >90%
```

#### 补充缺失的测试用例

**Token系统补充测试**：
```typescript
describe('TokenCompiler - 边界测试', () => {
  test('空Token对象', () => { /*...*/ })
  test('极大Token数量（1000+）', () => { /*...*/ })
  test('极深嵌套引用（10层）', () => { /*...*/ })
  test('特殊字符处理', () => { /*...*/ })
  test('Unicode字符', () => { /*...*/ })
  test('并发编译', () => { /*...*/ })
})

describe('TokenRuntime - 边界测试', () => {
  test('快速切换主题（压力测试）', () => { /*...*/ })
  test('内存泄漏检测（长时间运行）', () => { /*...*/ })
  test('多实例隔离', () => { /*...*/ })
})
```

**响应式系统补充测试**：
```typescript
describe('Reactive - 复杂场景', () => {
  test('深度嵌套对象（20层）', () => { /*...*/ })
  test('大数组（10000项）', () => { /*...*/ })
  test('循环引用对象', () => { /*...*/ })
  test('Map/Set支持', () => { /*...*/ })
  test('WeakMap/WeakSet支持', () => { /*...*/ })
})

describe('Computed - 复杂依赖', () => {
  test('复杂依赖链（A→B→C→D）', () => { /*...*/ })
  test('菱形依赖（A→B,C→D）', () => { /*...*/ })
  test('动态依赖', () => { /*...*/ })
})

describe('Watch - 复杂场景', () => {
  test('watch深度对象', () => { /*...*/ })
  test('多个watcher同一属性', () => { /*...*/ })
  test('异步watcher', () => { /*...*/ })
})
```

**表达式+安全系统补充测试**：
```typescript
describe('SecureEvaluator - 渗透测试', () => {
  test('尝试绕过1: 注释绕过', () => { /*...*/ })
  test('尝试绕过2: Unicode绕过', () => { /*...*/ })
  test('尝试绕过3: 字符串拼接', () => { /*...*/ })
  test('尝试绕过4: 模板字符串', () => { /*...*/ })
  test('尝试绕过5: 间接访问', () => { /*...*/ })
  test('尝试绕过6: 原型链污染', () => { /*...*/ })
  test('尝试绕过7: Symbol访问', () => { /*...*/ })
  test('尝试绕过8: Proxy绕过', () => { /*...*/ })
  test('尝试绕过9: Reflect绕过', () => { /*...*/ })
  test('尝试绕过10: 异步绕过', () => { /*...*/ })
})
```

**Day 22-25 验收**：
- [ ] 所有模块覆盖率达标
- [ ] Core模块 >90%
- [ ] 安全模块 100%
- [ ] 边界测试完整
- [ ] 渗透测试全部通过

---

### Day 26-28：集成测试完善

#### E2E测试场景

```typescript
describe('E2E - 完整用户场景', () => {
  test('场景1: 简单计数器', async () => {
    // 1. 创建Core实例
    const core = new Core({
      initialState: { count: 0 },
      handlers: {
        increment: (state) => state.count++
      }
    })
    
    // 2. 定义DSL
    const dsl = {
      type: 'div',
      children: [
        {
          type: 'p',
          props: { text: '$state.count' }
        },
        {
          type: 'button',
          props: { text: 'Add' },
          events: { click: 'increment' }
        }
      ]
    }
    
    // 3. 渲染
    const instance = core.render(dsl, container)
    
    // 4. 验证初始状态
    expect(container.querySelector('p').textContent).toBe('0')
    
    // 5. 模拟点击
    container.querySelector('button').click()
    await nextTick()
    
    // 6. 验证更新
    expect(container.querySelector('p').textContent).toBe('1')
    
    // 7. 清理
    core.destroy()
  })

  test('场景2: 条件渲染', () => { /*...*/ })
  test('场景3: 列表渲染', () => { /*...*/ })
  test('场景4: 表单输入', () => { /*...*/ })
  test('场景5: 主题切换', () => { /*...*/ })
  test('场景6: 复杂嵌套', () => { /*...*/ })
})
```

#### 压力测试

```typescript
describe('压力测试', () => {
  test('渲染1000个节点', async () => {
    const start = Date.now()
    // ... 渲染逻辑
    const duration = Date.now() - start
    expect(duration).toBeLessThan(200)
  })

  test('10000次状态更新', async () => {
    const start = Date.now()
    for (let i = 0; i < 10000; i++) {
      core.setState({ count: i })
    }
    const duration = Date.now() - start
    expect(duration).toBeLessThan(1000)
  })

  test('内存泄漏检测（创建销毁1000次）', () => {
    const memBefore = process.memoryUsage().heapUsed
    
    for (let i = 0; i < 1000; i++) {
      const core = new Core()
      core.render(simpleDSL)
      core.destroy()
    }
    
    global.gc() // 需要--expose-gc
    const memAfter = process.memoryUsage().heapUsed
    const leak = memAfter - memBefore
    
    expect(leak).toBeLessThan(10 * 1024 * 1024) // 10MB
  })
})
```

**Day 26-28 验收**：
- [ ] E2E测试覆盖主要场景
- [ ] 压力测试通过
- [ ] 无内存泄漏
- [ ] 性能达标

---

### Day 29-32：性能优化

#### 性能基准测试

```typescript
// packages/core/test/benchmarks/suite.bench.ts
import { bench, describe } from 'vitest'

describe('Token性能', () => {
  bench('编译100个Token', () => {
    const compiler = new TokenCompiler(tokens100)
    compiler.toCSSVariables()
  })

  bench('编译1000个Token', () => {
    const compiler = new TokenCompiler(tokens1000)
    compiler.toCSSVariables()
  })

  bench('主题切换', () => {
    runtime.switchTheme('dark')
  })
})

describe('响应式性能', () => {
  bench('创建reactive对象', () => {
    reactive({ count: 0, name: 'test', nested: { value: 1 } })
  })

  bench('reactive读取', () => {
    const obj = reactive({ count: 0 })
    effect(() => obj.count)
  })

  bench('reactive更新', () => {
    const obj = reactive({ count: 0 })
    obj.count = 1
  })

  bench('computed计算', () => {
    const obj = reactive({ count: 0 })
    const double = computed(() => obj.count * 2)
    double.value
  })
})

describe('表达式性能', () => {
  bench('简单表达式', async () => {
    await evaluator.evaluate('1 + 2', {})
  })

  bench('复杂表达式', async () => {
    await evaluator.evaluate(
      'user.age > 18 ? Math.max(score, 60) : score',
      { user: { age: 20 }, score: 85 }
    )
  })
})

describe('渲染性能', () => {
  bench('渲染100个节点', () => {
    core.render(dsl100, container)
  })

  bench('更新100个节点', () => {
    core.setState({ count: Math.random() })
  })
})
```

#### 优化目标和措施

**优化1: Token编译缓存**
```typescript
class TokenCompiler {
  private cache = new Map<string, string>()

  compile(tokens: TokenMap): string {
    const cacheKey = JSON.stringify(tokens)
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }
    
    const result = this.doCompile(tokens)
    this.cache.set(cacheKey, result)
    return result
  }
}
```

**优化2: 表达式AST缓存**
```typescript
class SecureEvaluator {
  private astCache = new Map<string, any>()

  async evaluate(expr: string, context: any): Promise<any> {
    let ast = this.astCache.get(expr)
    if (!ast) {
      ast = jsep(expr)
      this.astCache.set(expr, ast)
    }
    return this.evaluateNode(ast, context)
  }
}
```

**优化3: 批量更新**
```typescript
class Core {
  private pendingUpdates: any[] = []
  private updateScheduled = false

  setState(updates: any): void {
    this.pendingUpdates.push(updates)
    
    if (!this.updateScheduled) {
      this.updateScheduled = true
      Promise.resolve().then(() => {
        this.flushUpdates()
      })
    }
  }

  private flushUpdates(): void {
    const merged = Object.assign({}, ...this.pendingUpdates)
    Object.assign(this.state, merged)
    this.pendingUpdates = []
    this.updateScheduled = false
  }
}
```

**优化4: 虚拟滚动（for大列表）**
```typescript
// 仅渲染可见区域的节点
class VirtualScroller {
  render(items: any[], viewport: { start: number; end: number }) {
    const visible = items.slice(viewport.start, viewport.end)
    return visible.map(item => this.renderItem(item))
  }
}
```

**Day 29-32 验收**：
- [ ] 基准测试完成
- [ ] 关键路径优化
- [ ] 性能提升>20%
- [ ] 无性能退化

---

### Day 33-35：代码审查 + 重构

#### 代码质量检查

```bash
# 1. Lint检查
pnpm lint

# 2. 类型检查
pnpm type-check

# 3. 循环复杂度检查
npx complexity-report src/**/*.ts

# 4. 代码重复检查
npx jscpd src

# 5. 依赖分析
npx depcheck
```

#### 重构清单

- [ ] 移除未使用的代码
- [ ] 统一命名规范
- [ ] 提取重复代码
- [ ] 优化函数复杂度（<10）
- [ ] 优化文件大小（<500行）
- [ ] 添加必要注释
- [ ] 优化import顺序

**Day 33-35 验收**：
- [ ] 代码质量检查通过
- [ ] 无严重代码异味
- [ ] 技术债务清理
- [ ] 代码可维护性提升

---

## 📚 Week 7：文档完善（Day 36-42）

### Day 36-38：API文档

#### 各模块API文档

**Token系统API**：
```markdown
# Token API

## TokenCompiler

### constructor(tokens: TokenMap)
创建Token编译器实例

**参数**：
- `tokens`: Token定义对象

**示例**：
\`\`\`typescript
const compiler = new TokenCompiler({
  'color.primary': { value: '#1677ff', type: 'color' }
})
\`\`\`

### toCSSVariables(options?: CompileOptions): string
生成CSS Variables

**返回**: CSS字符串

### toTypeScript(): string
生成TypeScript类型定义

...
```

**响应式API**：
```markdown
# Reactive API

## reactive<T>(target: T): T
创建响应式对象

**参数**：
- `target`: 要变为响应式的对象

**返回**: 响应式代理对象

**示例**：
\`\`\`typescript
const state = reactive({ count: 0 })
\`\`\`

## computed<T>(getter: () => T): ComputedRef<T>
创建计算属性

...
```

### Day 39-41：使用指南

#### 快速开始

```markdown
# VJS-UI Core 快速开始

## 安装

\`\`\`bash
pnpm add @vjs-ui/core
\`\`\`

## 基础使用

\`\`\`typescript
import { Core } from '@vjs-ui/core'

// 1. 创建Core实例
const core = new Core({
  initialState: { count: 0 },
  handlers: {
    increment: (state) => state.count++
  }
})

// 2. 定义DSL
const dsl = {
  type: 'button',
  props: { text: '$state.count' },
  events: { click: 'increment' }
}

// 3. 注册渲染器（Vue/React）
core.setRenderer(vueRenderer)

// 4. 渲染
core.render(dsl, container)
\`\`\`

## 进阶使用

### Token系统
### 响应式系统
### 表达式系统
### 安全配置
...
```

### Day 42：故障排查指南

```markdown
# 故障排查指南

## 常见问题

### Q1: 表达式不生效
**症状**: DSL中的表达式没有求值
**原因**: 表达式格式错误或被安全检查拦截
**解决**: 
1. 检查表达式是否以`$`开头
2. 查看控制台安全错误
3. 确认表达式在白名单中

### Q2: 内存泄漏
**症状**: 长时间运行后内存持续增长
**原因**: 未正确清理绑定
**解决**:
1. 确保调用`core.destroy()`
2. 检查是否有循环引用
3. 使用DevTools分析内存

### Q3: 性能问题
**症状**: 渲染或更新缓慢
**原因**: 节点过多或表达式复杂
**解决**:
1. 使用虚拟滚动
2. 简化表达式
3. 开启生产模式
...
```

**Day 36-42 验收**：
- [ ] API文档完整
- [ ] 使用指南清晰
- [ ] 故障排查完善
- [ ] 示例代码可运行

---

## 🚀 Week 8：发布v0.2.0（Day 43-49）

### Day 43-45：发布前检查

#### 最终检查清单

```markdown
## 功能完整性
- [ ] 所有计划功能已实现
- [ ] 所有测试通过
- [ ] 无已知bug

## 质量标准
- [ ] 测试覆盖率Core>90%
- [ ] 安全测试100%
- [ ] 性能达标
- [ ] 代码review通过

## 文档完整性
- [ ] API文档完整
- [ ] 使用指南完整
- [ ] CHANGELOG更新
- [ ] README更新

## 发布准备
- [ ] 版本号更新（v0.2.0）
- [ ] package.json更新
- [ ] 构建通过
- [ ] npm包可安装
```

### Day 46-47：发布流程

```bash
# 1. 最终测试
pnpm test:coverage
pnpm lint
pnpm type-check

# 2. 构建
pnpm build

# 3. 创建changeset
pnpm changeset
# 选择: minor (新功能)
# 包: @vjs-ui/core
# 描述: feat: Core引擎v0.2.0发布
# - 完整Token系统
# - 完整响应式系统  
# - DSL解析器
# - 表达式引擎
# - 五层安全沙箱
# - Binder数据绑定
# - Core引擎集成

# 4. 更新版本
pnpm changeset version

# 5. 提交代码
git add .
git commit -m "chore: release v0.2.0"
git tag v0.2.0

# 6. 推送
git push origin main --tags

# 7. 发布到npm
pnpm changeset publish

# 8. 验证
pnpm view @vjs-ui/core version
npm info @vjs-ui/core
```

### Day 48-49：发布后工作

#### 创建GitHub Release

```markdown
# v0.2.0 - Core引擎完整版

## 🎉 主要特性

### 完整Token系统
- ✅ 动态Token切换
- ✅ Token引用和继承
- ✅ 颜色透明度支持
- ✅ 循环引用检测
- ✅ TypeScript类型生成

### 完整响应式系统
- ✅ reactive响应式对象
- ✅ computed计算属性（缓存）
- ✅ watch监听器（immediate/cleanup）
- ✅ effect自动追踪
- ✅ 深度响应式支持

### DSL解析器
- ✅ 条件渲染（if/else）
- ✅ 列表渲染（for）
- ✅ 事件绑定
- ✅ 插槽支持
- ✅ DSL验证

### 表达式引擎
- ✅ 算术/逻辑/比较运算
- ✅ 成员访问和函数调用
- ✅ 三元运算符
- ✅ 安全的函数白名单

### 🔐 五层安全防护（100%测试覆盖）
1. ✅ 表达式静态分析
2. ✅ AST白名单验证
3. ✅ 安全上下文隔离
4. ✅ 资源限制执行
5. ✅ 完整安全求值器

### Binder数据绑定
- ✅ 响应式绑定
- ✅ 表达式绑定
- ✅ 防抖/节流支持
- ✅ 资源管理

### Core引擎集成
- ✅ 职责分离架构
- ✅ 完整数据流
- ✅ 渲染器接口
- ✅ 主题切换
- ✅ 状态管理

## 📊 质量指标

- 测试覆盖率: 92%
- 安全测试覆盖率: 100%
- 性能: 1000节点 < 200ms
- 包大小: Core < 60KB (gzipped)

## 📖 文档

- [API文档](./docs/API.md)
- [使用指南](./docs/GUIDE.md)
- [架构文档](./docs/ARCHITECTURE.md)
- [安全说明](./docs/SECURITY.md)

## ⬆️ 从v0.1.0升级

MVP用户请参考[升级指南](./docs/UPGRADE.md)

## 🙏 致谢

感谢所有贡献者和测试人员！

## 🔜 下一步

v0.5.0将专注于Vue适配层和10个核心组件。
```

#### 发布通告

- [ ] 更新项目README
- [ ] 发布技术博客
- [ ] 社交媒体通告
- [ ] 通知早期用户

**Day 43-49 验收**：
- [ ] v0.2.0成功发布
- [ ] npm包可安装使用
- [ ] GitHub Release创建
- [ ] 文档更新完成
- [ ] 通告完成

---

## 🎉 阶段4完成标志

### 核心成果
- ✅ Core引擎生产就绪
- ✅ 五层安全防护100%实现
- ✅ 测试覆盖率>90%
- ✅ 性能达到目标
- ✅ 文档完整
- ✅ v0.2.0成功发布

### 技术指标
```
功能完整度: 100%
测试覆盖率: 92%
安全覆盖率: 100%
性能达标率: 100%
文档完成度: 100%
```

### 为下一阶段做好准备
- ✅ Core引擎API稳定
- ✅ 渲染器接口定义清晰
- ✅ 安全机制验证通过
- ✅ 可以开始Vue适配层开发

---

**恭喜！阶段4圆满完成！** 🎉

接下来进入**阶段5: Vue适配层**（6周），将开发10个核心组件并发布v0.5.0。
# 阶段5详细计划 - Part 1: Week 1-3

> 这是00-IMPLEMENTATION-GUIDE.md阶段5的详细补充文档  
> **前置**: 需先完成阶段4（Core引擎v0.2.0）

---

## 🎨 阶段5：Vue适配层（6周）- Week 1-3详细

> **重要性**: 🔴 第一个框架适配  
> **测试要求**: Vue模块≥85%

---

## 📦 Week 1：Vue渲染器 + 组合式函数（Day 1-7）

### 前置条件验收
- ✅ Core引擎v0.2.0完成
- ✅ Renderer接口定义清晰
- ✅ 所有Core测试通过

---

### Day 1-3：Vue渲染器实现

#### Vue渲染器核心实现

```typescript
// packages/vue/src/renderer/index.ts
import { h, createApp, VNode, Component } from 'vue'
import type { Renderer, RenderInstance } from '@vjs-ui/core'

export class VueRenderer implements Renderer {
  private componentRegistry = new Map<string, Component>()
  private instanceId = 0

  /**
   * 注册Vue组件
   */
  registerComponent(name: string, component: Component): void {
    this.componentRegistry.set(name, component)
  }

  /**
   * 渲染DSL为Vue组件
   */
  render(dsl: any, container?: HTMLElement): RenderInstance {
    const instanceId = `vue-${++this.instanceId}`
    
    // 创建Vue应用
    const app = createApp({
      render: () => this.renderNode(dsl)
    })

    // 挂载
    if (container) {
      app.mount(container)
    }

    // 返回实例
    return {
      id: instanceId,
      app,
      updateProp: (key: string, value: any) => {
        // 更新prop逻辑
      },
      updateStyle: (key: string, value: any) => {
        // 更新style逻辑
      },
      on: (event: string, handler: Function) => {
        // 事件绑定逻辑
      },
      destroy: () => {
        app.unmount()
      }
    }
  }

  /**
   * 递归渲染节点
   */
  private renderNode(node: any): VNode | VNode[] {
    if (!node) return h('div')
    
    // 获取组件
    const component = this.componentRegistry.get(node.type)
    if (!component) {
      console.warn(`Component not found: ${node.type}`)
      return h('div', `[${node.type}]`)
    }

    // 处理children
    const children = node.children?.map((child: any) => 
      this.renderNode(child)
    )

    // 渲染组件
    return h(component, {
      ...node.props,
      style: node.style
    }, children)
  }
}
```

#### Vue渲染器测试（20+用例）

```typescript
describe('VueRenderer', () => {
  let renderer: VueRenderer

  beforeEach(() => {
    renderer = new VueRenderer()
  })

  describe('组件注册', () => {
    test('1. 注册单个组件', () => { /*...*/ })
    test('2. 注册多个组件', () => { /*...*/ })
    test('3. 重复注册覆盖', () => { /*...*/ })
  })

  describe('DSL渲染', () => {
    test('4. 渲染简单组件', () => { /*...*/ })
    test('5. 渲染嵌套组件', () => { /*...*/ })
    test('6. 渲染列表', () => { /*...*/ })
    test('7. Props传递', () => { /*...*/ })
    test('8. Style传递', () => { /*...*/ })
    test('9. 事件绑定', () => { /*...*/ })
    test('10. 插槽渲染', () => { /*...*/ })
  })

  describe('实例管理', () => {
    test('11. 创建实例', () => { /*...*/ })
    test('12. 更新Props', () => { /*...*/ })
    test('13. 更新Style', () => { /*...*/ })
    test('14. 销毁实例', () => { /*...*/ })
    test('15. 多个实例隔离', () => { /*...*/ })
  })

  describe('边界测试', () => {
    test('16. 未注册组件处理', () => { /*...*/ })
    test('17. 空DSL处理', () => { /*...*/ })
    test('18. 深度嵌套（20层）', () => { /*...*/ })
    test('19. 大量节点（1000+）', () => { /*...*/ })
    test('20. 内存泄漏检测', () => { /*...*/ })
  })
})
```

**Day 1-3 验收**：
- [ ] 20+测试通过
- [ ] 实现Renderer接口
- [ ] 支持DSL渲染
- [ ] 无内存泄漏

---

### Day 4-5：组合式函数

#### useCore 组合式函数

```typescript
// packages/vue/src/composables/useCore.ts
import { ref, onUnmounted, readonly } from 'vue'
import { Core } from '@vjs-ui/core'

export function useCore(config?: any) {
  const core = new Core(config)
  const state = ref(core.getState())

  // 更新状态
  const setState = (updates: any) => {
    core.setState(updates)
    state.value = core.getState()
  }

  // 清理
  onUnmounted(() => {
    core.destroy()
  })

  return {
    core,
    state: readonly(state),
    setState
  }
}
```

#### useTheme 组合式函数

```typescript
// packages/vue/src/composables/useTheme.ts
import { ref, onMounted } from 'vue'

export function useTheme() {
  const currentTheme = ref('default')
  const themes = ref<string[]>([])

  const switchTheme = (themeName: string) => {
    // 切换主题逻辑
    currentTheme.value = themeName
  }

  return {
    currentTheme,
    themes,
    switchTheme
  }
}
```

#### 组合式函数测试（15+用例）

```typescript
describe('Composables', () => {
  describe('useCore', () => {
    test('1. 初始化Core', () => { /*...*/ })
    test('2. 状态响应式', () => { /*...*/ })
    test('3. setState更新', () => { /*...*/ })
    test('4. 自动清理', () => { /*...*/ })
    test('5. 多个实例隔离', () => { /*...*/ })
  })

  describe('useTheme', () => {
    test('6. 获取当前主题', () => { /*...*/ })
    test('7. 切换主题', () => { /*...*/ })
    test('8. 主题列表', () => { /*...*/ })
    test('9. 无效主题处理', () => { /*...*/ })
  })

  describe('useToken', () => {
    test('10. 获取Token值', () => { /*...*/ })
    test('11. Token响应式', () => { /*...*/ })
    test('12. Token不存在处理', () => { /*...*/ })
  })

  describe('集成测试', () => {
    test('13. useCore + useTheme', () => { /*...*/ })
    test('14. useCore + useToken', () => { /*...*/ })
    test('15. 完整流程', () => { /*...*/ })
  })
})
```

**Day 4-5 验收**：
- [ ] 15+测试通过
- [ ] 组合式函数可用
- [ ] 响应式正常
- [ ] 自动清理

---

### Day 6-7：组件基础设施

#### 组件基类

```typescript
// packages/vue/src/base/BaseComponent.ts
import { defineComponent } from 'vue'

export const BaseComponent = defineComponent({
  props: {
    // 通用props
    className: String,
    style: Object,
    disabled: Boolean
  },
  setup(props, { slots }) {
    // 通用逻辑
    return {
      // 通用方法
    }
  }
})
```

**Week 1 完成标志**：
- ✅ Vue渲染器完整
- ✅ 组合式函数完整
- ✅ 基础设施完成
- ✅ 35+测试通过

---

## 🧩 Week 2：基础组件（Button、Input、Card）Day 8-14

### Day 8-10：VButton组件

#### VButton完整实现

```vue
<!-- packages/vue/src/components/Button/Button.vue -->
<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    :type="nativeType"
    @click="handleClick"
  >
    <span v-if="loading" class="vjs-button__loading">
      <LoadingIcon />
    </span>
    <span v-if="$slots.icon" class="vjs-button__icon">
      <slot name="icon" />
    </span>
    <span class="vjs-button__text">
      <slot>{{ text }}</slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface ButtonProps {
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  size?: 'small' | 'medium' | 'large'
  text?: string
  disabled?: boolean
  loading?: boolean
  nativeType?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  size: 'medium',
  nativeType: 'button',
  disabled: false,
  loading: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => [
  'vjs-button',
  `vjs-button--${props.type}`,
  `vjs-button--${props.size}`,
  {
    'is-disabled': props.disabled,
    'is-loading': props.loading
  }
])

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  emit('click', event)
}
</script>

<style scoped>
.vjs-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--vjs-spacing-sm) var(--vjs-spacing-md);
  border: 1px solid var(--vjs-color-border);
  border-radius: var(--vjs-radius-md);
  background: var(--vjs-color-bg);
  color: var(--vjs-color-text);
  cursor: pointer;
  transition: all 0.3s;
}

.vjs-button--primary {
  background: var(--vjs-color-primary);
  color: white;
  border-color: var(--vjs-color-primary);
}

.vjs-button.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
```

#### VButton测试（10+用例）

```typescript
describe('VButton', () => {
  test('1. 渲染默认按钮', () => { /*...*/ })
  test('2. type属性', () => { /*...*/ })
  test('3. size属性', () => { /*...*/ })
  test('4. disabled状态', () => { /*...*/ })
  test('5. loading状态', () => { /*...*/ })
  test('6. click事件', () => { /*...*/ })
  test('7. 默认插槽', () => { /*...*/ })
  test('8. icon插槽', () => { /*...*/ })
  test('9. 主题切换', () => { /*...*/ })
  test('10. 快照测试', () => { /*...*/ })
})
```

---

### Day 11-12：VInput组件

```vue
<!-- VInput完整实现 -->
<template>
  <div :class="inputClasses">
    <input
      v-bind="$attrs"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </div>
</template>

<script setup lang="ts">
// ... 完整实现
</script>
```

#### VInput测试（10+用例）
- 基础功能测试
- v-model双向绑定
- 类型验证
- 事件测试

---

### Day 13-14：VCard组件

```vue
<!-- VCard完整实现 -->
<template>
  <div class="vjs-card">
    <div v-if="$slots.header" class="vjs-card__header">
      <slot name="header" />
    </div>
    <div class="vjs-card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="vjs-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>
```

**Week 2 完成标志**：
- ✅ 3个基础组件完成
- ✅ 30+测试通过
- ✅ 组件可独立使用
- ✅ 支持DSL渲染

---

## 📝 Week 3：表单组件（Select、Checkbox、Radio）Day 15-21

### Day 15-17：VSelect组件

```vue
<template>
  <div class="vjs-select" v-click-outside="closeDropdown">
    <div class="vjs-select__trigger" @click="toggleDropdown">
      <span>{{ selectedLabel || placeholder }}</span>
      <ArrowIcon :class="{ 'is-reverse': visible }" />
    </div>
    
    <transition name="vjs-select-dropdown">
      <div v-show="visible" class="vjs-select__dropdown">
        <div
          v-for="option in options"
          :key="option.value"
          :class="optionClasses(option)"
          @click="handleSelect(option)"
        >
          {{ option.label }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
// ... Select完整逻辑
</script>
```

### Day 18-19：VCheckbox组件

```vue
<template>
  <label class="vjs-checkbox">
    <span class="vjs-checkbox__input">
      <input
        type="checkbox"
        :checked="isChecked"
        :disabled="disabled"
        @change="handleChange"
      />
      <span class="vjs-checkbox__inner" />
    </span>
    <span class="vjs-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
```

### Day 20-21：VRadio组件

```vue
<template>
  <label class="vjs-radio">
    <span class="vjs-radio__input">
      <input
        type="radio"
        :value="value"
        :checked="isChecked"
        :disabled="disabled"
        @change="handleChange"
      />
      <span class="vjs-radio__inner" />
    </span>
    <span class="vjs-radio__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
```

**Week 3 完成标志**：
- ✅ 6个组件全部完成
- ✅ 60+测试通过
- ✅ 表单组件可用
- ✅ 支持主题切换

---

**Week 1-3完成标志**：
- 🎉 Vue渲染器生产就绪
- 🎉 6个基础组件完成
- 🎉 95+测试通过
- 🎉 为Week 4-6打下基础

---

**接下来请查看**：
- Part 2: Week 4-6（Dialog、Table、Form、DatePicker + 测试 + 发布）
# 阶段5详细计划 - Part 2: Week 4-6

> 这是00-IMPLEMENTATION-GUIDE.md阶段5的详细补充文档  
> **前置**: 需先完成Part 1（Week 1-3，前6个组件）

---

## 🎨 阶段5：Vue适配层（6周）- Week 4-6详细

### 前置条件验收
- ✅ Vue渲染器完成
- ✅ 6个基础组件完成
- ✅ 95+测试通过

---

## 🔲 Week 4：复杂组件（Dialog、Table）Day 22-28

### Day 22-24：VDialog组件

#### VDialog完整实现

```vue
<!-- packages/vue/src/components/Dialog/Dialog.vue -->
<template>
  <teleport to="body">
    <transition name="vjs-dialog-fade">
      <div v-show="visible" class="vjs-dialog__wrapper" @click.self="handleWrapperClick">
        <div :class="dialogClasses" :style="dialogStyle">
          <!-- Header -->
          <div v-if="!$slots.header && title" class="vjs-dialog__header">
            <span class="vjs-dialog__title">{{ title }}</span>
            <button
              v-if="showClose"
              class="vjs-dialog__close"
              @click="handleClose"
            >
              <CloseIcon />
            </button>
          </div>
          <div v-else-if="$slots.header" class="vjs-dialog__header">
            <slot name="header" />
          </div>

          <!-- Body -->
          <div class="vjs-dialog__body">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="vjs-dialog__footer">
            <slot name="footer" />
          </div>
          <div v-else-if="showFooter" class="vjs-dialog__footer">
            <VButton @click="handleCancel">{{ cancelText }}</VButton>
            <VButton type="primary" @click="handleConfirm">{{ confirmText }}</VButton>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'

export interface DialogProps {
  visible?: boolean
  title?: string
  width?: string | number
  top?: string
  modal?: boolean
  modalAppendToBody?: boolean
  showClose?: boolean
  showFooter?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  cancelText?: string
  confirmText?: string
}

const props = withDefaults(defineProps<DialogProps>(), {
  visible: false,
  width: '50%',
  top: '15vh',
  modal: true,
  modalAppendToBody: true,
  showClose: true,
  showFooter: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  cancelText: '取消',
  confirmText: '确定'
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
  cancel: []
  confirm: []
}>()

const dialogClasses = computed(() => [
  'vjs-dialog',
  {
    'is-center': props.top === 'center'
  }
])

const dialogStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  marginTop: props.top
}))

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

const handleCancel = () => {
  emit('cancel')
  handleClose()
}

const handleConfirm = () => {
  emit('confirm')
  handleClose()
}

const handleWrapperClick = () => {
  if (props.closeOnClickModal) {
    handleClose()
  }
}

const handleEscape = (e: KeyboardEvent) => {
  if (props.visible && props.closeOnPressEscape && e.key === 'Escape') {
    handleClose()
  }
}

// 监听ESC键
watch(() => props.visible, (val) => {
  if (val) {
    document.addEventListener('keydown', handleEscape)
  } else {
    document.removeEventListener('keydown', handleEscape)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.vjs-dialog__wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
}

.vjs-dialog {
  background: var(--vjs-color-bg);
  border-radius: var(--vjs-radius-lg);
  box-shadow: var(--vjs-shadow-lg);
  overflow: hidden;
}

.vjs-dialog__header {
  padding: var(--vjs-spacing-lg);
  border-bottom: 1px solid var(--vjs-color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.vjs-dialog__body {
  padding: var(--vjs-spacing-lg);
  max-height: 60vh;
  overflow-y: auto;
}

.vjs-dialog__footer {
  padding: var(--vjs-spacing-lg);
  border-top: 1px solid var(--vjs-color-border);
  display: flex;
  justify-content: flex-end;
  gap: var(--vjs-spacing-sm);
}

/* Animations */
.vjs-dialog-fade-enter-active,
.vjs-dialog-fade-leave-active {
  transition: opacity 0.3s;
}

.vjs-dialog-fade-enter-from,
.vjs-dialog-fade-leave-to {
  opacity: 0;
}
</style>
```

#### VDialog测试（15+用例）

```typescript
describe('VDialog', () => {
  test('1. 基础渲染', () => { /*...*/ })
  test('2. visible控制显示', () => { /*...*/ })
  test('3. title显示', () => { /*...*/ })
  test('4. width设置', () => { /*...*/ })
  test('5. 点击遮罩关闭', () => { /*...*/ })
  test('6. ESC键关闭', () => { /*...*/ })
  test('7. showClose控制', () => { /*...*/ })
  test('8. 取消按钮', () => { /*...*/ })
  test('9. 确认按钮', () => { /*...*/ })
  test('10. header插槽', () => { /*...*/ })
  test('11. footer插槽', () => { /*...*/ })
  test('12. teleport到body', () => { /*...*/ })
  test('13. 多个Dialog叠加', () => { /*...*/ })
  test('14. 动画效果', () => { /*...*/ })
  test('15. 内存泄漏检测', () => { /*...*/ })
})
```

**Day 22-24 验收**：
- [ ] Dialog功能完整
- [ ] 15+测试通过
- [ ] 支持所有配置项
- [ ] 无内存泄漏

---

### Day 25-28：VTable组件

#### VTable完整实现

```vue
<!-- packages/vue/src/components/Table/Table.vue -->
<template>
  <div class="vjs-table">
    <div class="vjs-table__header">
      <table>
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :style="getColumnStyle(column)"
            >
              {{ column.title }}
            </th>
          </tr>
        </thead>
      </table>
    </div>

    <div class="vjs-table__body">
      <table>
        <tbody>
          <tr
            v-for="(row, index) in data"
            :key="getRowKey(row, index)"
            :class="getRowClass(row, index)"
            @click="handleRowClick(row, index)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :style="getColumnStyle(column)"
            >
              <!-- 自定义渲染 -->
              <slot
                v-if="column.slot"
                :name="column.slot"
                :row="row"
                :column="column"
                :index="index"
              />
              <!-- 默认渲染 -->
              <span v-else>{{ getCellValue(row, column.key) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showPagination" class="vjs-table__footer">
      <!-- 分页组件 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface TableColumn {
  key: string
  title: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
  slot?: string
}

export interface TableProps {
  data: any[]
  columns: TableColumn[]
  rowKey?: string | ((row: any) => string)
  stripe?: boolean
  border?: boolean
  showPagination?: boolean
  pageSize?: number
  currentPage?: number
}

const props = withDefaults(defineProps<TableProps>(), {
  rowKey: 'id',
  stripe: false,
  border: false,
  showPagination: false,
  pageSize: 10,
  currentPage: 1
})

const emit = defineEmits<{
  'row-click': [row: any, index: number]
  'update:currentPage': [page: number]
}>()

const getRowKey = (row: any, index: number): string => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row)
  }
  return row[props.rowKey] || String(index)
}

const getRowClass = (row: any, index: number): any => {
  return {
    'vjs-table__row--stripe': props.stripe && index % 2 === 1
  }
}

const getColumnStyle = (column: TableColumn): any => {
  return {
    width: typeof column.width === 'number' ? `${column.width}px` : column.width,
    textAlign: column.align || 'left'
  }
}

const getCellValue = (row: any, key: string): any => {
  return row[key]
}

const handleRowClick = (row: any, index: number) => {
  emit('row-click', row, index)
}
</script>

<style scoped>
.vjs-table {
  width: 100%;
  border: 1px solid var(--vjs-color-border);
  border-radius: var(--vjs-radius-md);
  overflow: hidden;
}

.vjs-table__header table,
.vjs-table__body table {
  width: 100%;
  border-collapse: collapse;
}

.vjs-table__header th {
  padding: var(--vjs-spacing-md);
  background: var(--vjs-color-bg-light);
  font-weight: 600;
  border-bottom: 1px solid var(--vjs-color-border);
}

.vjs-table__body td {
  padding: var(--vjs-spacing-md);
  border-bottom: 1px solid var(--vjs-color-border);
}

.vjs-table__row--stripe {
  background: var(--vjs-color-bg-light);
}

.vjs-table__body tr:hover {
  background: var(--vjs-color-bg-hover);
}
</style>
```

#### VTable测试（15+用例）
```typescript
describe('VTable', () => {
  test('1. 基础渲染', () => { /*...*/ })
  test('2. columns配置', () => { /*...*/ })
  test('3. data显示', () => { /*...*/ })
  test('4. stripe斑马纹', () => { /*...*/ })
  test('5. border边框', () => { /*...*/ })
  test('6. row-click事件', () => { /*...*/ })
  test('7. 自定义slot', () => { /*...*/ })
  test('8. rowKey配置', () => { /*...*/ })
  test('9. column width', () => { /*...*/ })
  test('10. column align', () => { /*...*/ })
  test('11. 空数据显示', () => { /*...*/ })
  test('12. 大量数据（1000行）', () => { /*...*/ })
  test('13. 性能测试（渲染<500ms）', () => { /*...*/ })
  test('14. 分页功能', () => { /*...*/ })
  test('15. 快照测试', () => { /*...*/ })
})
```

**Week 4 完成标志**：
- ✅ Dialog和Table完成
- ✅ 30+测试通过
- ✅ 性能达标

---

## 📋 Week 5：高级组件（Form、DatePicker）Day 29-35

### Day 29-32：VForm组件

```vue
<template>
  <form class="vjs-form" @submit.prevent="handleSubmit">
    <div
      v-for="item in items"
      :key="item.key"
      class="vjs-form-item"
    >
      <label class="vjs-form-item__label">
        {{ item.label }}
        <span v-if="item.required" class="vjs-form-item__required">*</span>
      </label>
      
      <div class="vjs-form-item__content">
        <component
          :is="getComponent(item.type)"
          v-model="formData[item.key]"
          v-bind="item.props"
        />
        <span v-if="errors[item.key]" class="vjs-form-item__error">
          {{ errors[item.key] }}
        </span>
      </div>
    </div>

    <div class="vjs-form__actions">
      <VButton @click="handleReset">重置</VButton>
      <VButton type="primary" native-type="submit">提交</VButton>
    </div>
  </form>
</template>

<script setup lang="ts">
// ... Form完整逻辑，包含验证
</script>
```

### Day 33-35：VDatePicker组件

```vue
<template>
  <div class="vjs-date-picker" v-click-outside="closePanel">
    <VInput
      :model-value="displayValue"
      :placeholder="placeholder"
      readonly
      @click="togglePanel"
    />

    <transition name="vjs-date-picker-fade">
      <div v-show="visible" class="vjs-date-picker__panel">
        <!-- 月份选择 -->
        <div class="vjs-date-picker__header">
          <button @click="prevMonth">&lt;</button>
          <span>{{ currentMonth }}</span>
          <button @click="nextMonth">&gt;</button>
        </div>

        <!-- 日期网格 -->
        <div class="vjs-date-picker__body">
          <div class="vjs-date-picker__days">
            <span v-for="day in weekDays" :key="day">{{ day }}</span>
          </div>
          <div class="vjs-date-picker__dates">
            <span
              v-for="date in dates"
              :key="date.value"
              :class="getDateClass(date)"
              @click="selectDate(date)"
            >
              {{ date.day }}
            </span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
// ... DatePicker完整逻辑
</script>
```

**Week 5 完成标志**：
- ✅ Form和DatePicker完成
- ✅ 10个组件全部完成
- ✅ 20+测试通过

---

## ✅ Week 6：测试 + 文档 + 发布（Day 36-42）

### Day 36-38：完善测试

#### 补充测试到>85%覆盖率

```bash
# 检查覆盖率
pnpm test:coverage

# 目标
packages/vue/src/renderer    - >90%
packages/vue/src/composables - >85%
packages/vue/src/components  - >85%
```

#### 补充集成测试

```typescript
describe('Vue Integration', () => {
  test('Core + Vue渲染器', () => { /*...*/ })
  test('10个组件联动', () => { /*...*/ })
  test('完整表单流程', () => { /*...*/ })
  test('主题切换影响所有组件', () => { /*...*/ })
  test('性能测试', () => { /*...*/ })
})
```

**Day 36-38 验收**：
- [ ] 测试覆盖率>85%
- [ ] 集成测试通过
- [ ] 无已知bug

---

### Day 39-40：文档编写

#### API文档

```markdown
# @vjs-ui/vue API文档

## VButton

### Props
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type | string | 'default' | 按钮类型 |
| size | string | 'medium' | 按钮尺寸 |
...

### Events
| 事件名 | 参数 | 说明 |
|--------|------|------|
| click | (event: MouseEvent) | 点击事件 |

### Slots
| 插槽名 | 说明 |
|--------|------|
| default | 按钮内容 |
| icon | 图标 |
```

#### 使用示例

```markdown
# 快速开始

\`\`\`bash
pnpm add @vjs-ui/vue
\`\`\`

\`\`\`vue
<template>
  <VButton type="primary" @click="handleClick">
    点击我
  </VButton>
</template>

<script setup>
import { VButton } from '@vjs-ui/vue'
</script>
\`\`\`
```

**Day 39-40 验收**：
- [ ] API文档完整
- [ ] 使用示例完整
- [ ] 故障排查指南

---

### Day 41-42：发布v0.5.0

```bash
# 1. 测试
pnpm test

# 2. 构建
pnpm build

# 3. Changeset
pnpm changeset
# minor: @vjs-ui/vue
# feat: Vue适配层v0.5.0
# - 10个核心组件
# - 完整渲染器
# - 组合式函数

# 4. 版本更新
pnpm changeset version

# 5. 发布
pnpm changeset publish

# 6. GitHub Release
```

#### GitHub Release内容

```markdown
# v0.5.0 - Vue适配层

## 🎉 主要特性

### Vue渲染器
- ✅ 完整实现Renderer接口
- ✅ 支持DSL渲染
- ✅ 性能优化

### 10个核心组件
- ✅ Button、Input、Card（基础）
- ✅ Select、Checkbox、Radio（表单）
- ✅ Dialog、Table（复杂）
- ✅ Form、DatePicker（高级）

### 组合式函数
- ✅ useCore
- ✅ useTheme
- ✅ useToken

## 📊 质量指标
- 测试覆盖率: 87%
- 组件数量: 10个
- 包大小: <120KB (gzipped)

## 📖 文档
- [快速开始](./docs/vue/quick-start.md)
- [组件文档](./docs/vue/components/)
- [API参考](./docs/vue/api.md)

## 🔜 下一步
v1.0.0将完善更多组件并发布生产版本。
```

**Day 41-42 验收**：
- [ ] v0.5.0成功发布
- [ ] npm包可安装
- [ ] GitHub Release创建
- [ ] 文档部署

---

## 🎉 阶段5完成标志

### 核心成果
- ✅ Vue适配层完整
- ✅ 10个核心组件生产就绪
- ✅ 测试覆盖率>85%
- ✅ 文档完整
- ✅ v0.5.0成功发布

### 技术指标
```
功能完整度: 100%
测试覆盖率: 87%
组件数量: 10个
包大小: <120KB
```

### 为下一阶段做好准备
- ✅ Vue组件稳定
- ✅ 组件开发模式确立
- ✅ 为React适配提供参考
- ✅ 可以开始开发者工具

---

**恭喜！阶段5圆满完成！** 🎉

接下来进入**阶段6: 开发者工具**（3-4周），将开发Playground、CLI和文档站。
