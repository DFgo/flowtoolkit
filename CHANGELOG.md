# 更新日志

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-03-11

### 新增
- **onLangChange 钩子**：语言切换后通知外部业务逻辑
  - 初始化时可通过 `onLangChange` 选项配置
  - 可通过 `setOnLangChange()` 动态设置
  - 回调参数包含 `oldLang` 和 `newLang`

- **防抖功能**：防止频繁调用 `refresh()`/`changeLang()`
  - 默认延迟 200ms（可通过 `debounceDelay` 配置）
  - 避免重复执行 DOM 替换

- **异步加载语言包**：支持 `loadMessagesAsync()`
  - 支持传入函数或 URL 字符串
  - 使用 fetch 自动加载 JSON 格式语言包
  - 返回 Promise<boolean>

- **动态新增元素监听**：使用 MutationObserver
  - 默认启用（可通过 `watchDynamicElements` 配置）
  - 页面初始化后新增的带 `data-i18n` 属性的元素自动替换
  - 智能跳过已缓存元素

- **元素缓存**：优化 DOM 替换性能
  - 使用 `Set` 缓存已处理元素
  - 使用 `Map` 缓存元素与 key 的映射
  - 避免重复处理相同元素

### 改进
- 新增配置选项：
  - `debounceDelay`: 防抖延迟时间（默认 200ms）
  - `watchDynamicElements`: 是否监听动态元素（默认 true）
  - `onLangChange`: 语言切换回调函数

## [2.0.1] - 2026-03-11

### 修复
- **Watermark 模块**
  - 移除构造函数中重复的配置合并代码
  - 删除未使用的私有方法 `#getDefaultOptions`
  - 移除未使用的变量 `modalHeight`

- **Utils 模块**
  - 修复 `addMonths` 函数的 JSDoc 注释格式错误
  - 补充完整的日期工具函数导出（`startOfDay`、`endOfDay`、`isToday`、`isYesterday`、`isTomorrow`、`fromTimestamp`、`toTimestamp`）
  - 更新使用示例注释

- **配置文件**
  - 修复 `package.json` 中缺失的仓库信息（`repository`、`bugs`、`homepage`）
  - 修复 `lint` 脚本，移除不兼容的 `--ext` 选项
  - 简化 `eslint.config.js` 配置，移除未安装的依赖
  - 安装缺失的 `globals` 包

- **Watermark 模块入口**
  - 修复 `Watermark` 未定义的引用问题

- **I18n 模块**
  - 统一引号风格为单引号

### 改进
- 代码质量检查通过，0 错误，12 警告（警告为调试用 console 语句）

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
