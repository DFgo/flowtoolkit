# 更新日志

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-03-11

### 新增
- 项目重构，采用工程化目录结构
- 新增 Vite 构建配置
- 新增 ESLint + Prettier 代码规范

### 改进
- Watermark 模块重构
  - 修复 XSS 安全问题（URL 编码 dataURL）
  - 修复内存泄漏（打印事件监听器未移除）
  - 修复单例模式元素引用问题
  - 修复打印透明度值无效问题
  - 添加外部依赖防御性检查
  - 改进 deepMerge 函数

- Language (i18n) 模块重构
  - 修复 XSS 安全问题（innerHTML 默认转义）
  - 移除重复变量定义
  - 改进状态管理
  - 使用单例模式

### 目录结构
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

## [1.x.x] - 历史版本

### 原始版本
- 从 flowtonic_sql 迁移
- Watermark 模块 v1.3.0
- Language 模块 v1.1.0
