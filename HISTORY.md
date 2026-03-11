# 历史记录

## 版本历史

### v2.0.1 (2026-03-11)

#### 修复内容
- Watermark 模块：移除构造函数中重复的配置合并代码
- Watermark 模块：删除未使用的私有方法 `#getDefaultOptions`
- Watermark 模块：移除未使用的变量 `modalHeight`
- Watermark 模块入口：修复 `Watermark` 未定义的引用问题
- Utils 模块：修复 `addMonths` 函数的 JSDoc 注释格式错误
- Utils 模块：补充完整的日期工具函数导出
- Utils 模块：更新使用示例注释
- I18n 模块：统一引号风格为单引号
- 配置文件：修复 package.json 中缺失的仓库信息
- 配置文件：修复 lint 脚本，移除不兼容的 --ext 选项
- 配置文件：简化 eslint.config.js 配置，移除未安装的依赖
- 配置文件：安装缺失的 globals 包

#### 代码质量
- Lint 检查：0 错误，12 警告（警告为调试用 console 语句）

---

### v2.0.0 (2024-03-11)

#### 新增
- 项目重构，采用工程化目录结构
- 新增 Vite 构建配置
- 新增 ESLint + Prettier 代码规范

#### 改进
- Watermark 模块重构：
  - 修复 XSS 安全问题（URL 编码 dataURL）
  - 修复内存泄漏（打印事件监听器未移除）
  - 修复单例模式元素引用问题
  - 修复打印透明度值无效问题
  - 添加外部依赖防御性检查
  - 改进 deepMerge 函数

- Language (i18n) 模块重构：
  - 修复 XSS 安全问题（innerHTML 默认转义）
  - 移除重复变量定义
  - 改进状态管理
  - 使用单例模式

#### 目录结构
```
flowtoolkit/
├── src/
│   ├── modules/
│   │   ├── watermark/
│   │   ├── language/
│   │   └── utils/
│   └── index.js
├── dist/
├── package.json
├── vite.config.js
└── ...
```

---

### v1.x.x (历史版本)

#### 原始版本
- 从 flowtonic_sql 迁移
- Watermark 模块 v1.3.0
- Language 模块 v1.1.0

---

## 贡献记录

### 2026-03-11
- 代码审查和错误修复
- 更新文档和版本号

### 2024-03-11
- 项目重构 v2.0.0
- 工程化改进

---

## 迁移指南

### 从 v1.x 升级到 v2.x
1. 更新导入路径
2. 检查 API 变更
3. 运行 lint 检查确保代码兼容

### 从 v2.0.0 升级到 v2.0.1
- 兼容升级，无需代码改动
