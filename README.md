# xhs-ai-probe

小红书小工具「AI 能力探针」——用于检测小工具容器内 `window.xhs.AI`（AI 文本生成，能力清单 §3.10）是否可用。

## 用法

1. 将本仓库打包为符合小红书小工具规范的 zip（外置脚本、无内联事件、Chrome 61 基线）后上传 Builder Hub。
2. 手机扫码进入预览，点「开始检测」。
3. 输出：window.xhs / miniTool / AI 注入状态、buildVersion、generateText 调用结果（成功回复 / AI_NOT_ALLOWED / 其他错误）。

## 实测记录（2026-11-06）

- buildVersion 9521801：`window.xhs.AI` 注入 ✓，`createModel('deepseek-v4-flash')` ✓
- `generateText()` ✗「无权访问或功能不可用」（疑似错误码 10003 容器白名单拒绝，未加白）
- 加白申请渠道：官方通知群已满，详见 redengineer/redmini issue。
