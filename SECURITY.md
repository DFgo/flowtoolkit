# 安全政策

## 支持的版本

此项目的以下版本目前正在接受安全更新：

| 版本 | 支持状态 |
| ------- | ------------------ |
| 2.0.x | :white_check_mark: |
| 1.x.x | :x: |

## 报告漏洞

我们非常重视安全性。如果您发现了安全漏洞，请通过以下方式报告：

### 报告方式

1. **GitHub Security Advisories**（推荐）：
   - 在 [GitHub Security Advisories](https://github.com/DFgo/flowtoolkit/security/advisories) 中提交漏洞报告
   - 选择 "Report a vulnerability"
   - 提供详细的漏洞描述和复现步骤

2. **GitHub Issues**：
   - 在 [GitHub Issues](https://github.com/DFgo/flowtoolkit/issues) 中提交
   - 标题请标注 `[SECURITY]` 前缀
   - 提供详细的漏洞信息

### 报告内容

请在报告中包含以下信息：

- 漏洞的类型（例如：XSS、内存泄漏、注入攻击等）
- 受影响的版本范围
- 复现步骤（最小化示例代码）
- 漏洞的影响（可能导致什么后果）
- 可能的修复建议（如果有）

### 响应时间

我们承诺：
- **24 小时内**确认收到您的报告
- **7 天内**提供初步评估
- **30 天内**发布修复（如果漏洞被确认）

### 漏洞处理流程

1. **确认阶段**：确认漏洞的有效性和严重程度
2. **修复阶段**：开发并测试修复方案
3. **发布阶段**：发布安全更新和公告
4. **致谢阶段**：在公告中感谢报告者

## 安全最佳实践

### 使用建议

- **保持最新**：始终使用最新版本的 flowtoolkit
- **输入验证**：在传递用户输入到库函数前进行验证
- **安全配置**：根据需要调整安全相关配置选项

### 已知安全特性

- **XSS 防护**：Watermark 和 i18n 模块默认进行 HTML 转义
- **输入验证**：所有公共 API 进行参数验证
- **内存安全**：正确清理事件监听器和 DOM 元素

## 安全公告

所有安全公告将发布在：
- [GitHub Releases](https://github.com/DFgo/flowtoolkit/releases)
- [GitHub Security Advisories](https://github.com/DFgo/flowtoolkit/security/advisories)

## 致谢

感谢以下安全研究人员和贡献者帮助我们提高项目的安全性：

- （待添加）

---

**最后更新**：2026-03-11
