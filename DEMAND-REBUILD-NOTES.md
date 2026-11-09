# 提出需求幕重建说明（城运双栏）

## 改了什么
- 删除旧「选现场 + 建筑剖面点问题」交互。
- `#demandAct` 改为线上测评组网系统同款信息架构：**左对话 / 右需求栏**。
- 案例固定为已实测城运对话「城市运行视频智能识别与工单联动」，字段与文案对齐 `live-demand-flow-report.md`。
- 脚本驱动演示（无真后端）：填入 → 发送 → 整理 → 右栏填充 → 确认需求 → 匹配组网 → `UX.writeRun` → `UX.goEnrich()`。
- `?demo=site` 改为进入新需求幕并自动跑城运案例（不再点 `.scard[data-k=fire]`）。

## 改动文件
- `step1-领证.html`（`#demandAct` HTML + demo 钩子）
- `demand-act.css`（整页重写）
- `demand-act.js`（整页重写）
- `DEMAND-REBUILD-NOTES.md`（本文件）

未改：`#enrichAct` / `#matchAct` / `#schemeAct` 主体；`shell.js` 的 `goDemand` / `goEnrich` API 保持兼容。

## 如何演示
1. 打开 `http://127.0.0.1:9876/step1-领证.html`（或本地静态打开同目录文件）。
2. 注册 / 「跳过，直接注册」/ 领证后点「开始提出需求」。
3. 左下点 **一键填入案例** 再发送，或点空态 **使用城运案例**（自动发送）。
4. 右侧出现组织信息、概述、任务场景、建议澄清；状态：待整理 → 整理中 → 待确认。
5. 点 **确认需求** → 状态「已确认」→ **匹配组网** 进入完善信息幕。
6. 快捷：`?demo=demand` 进需求空态；`?demo=site` 自动跑案例。

## writeRun 写入字段
`reqId`, `caseId:'city-ops'`, `scene:'城运视频识别'`, `title`, `chatTitle`, `org`, `industry`, `scale`, `summary`, `taskName`, `needCount`, `demandStatus`, `clarAnswers`, `fromDemand`.

## 已知限制
- enrich / match / scheme 已城运化，详见 `MATCH-CITY-OPS-NOTES.md`。
- 「查看」为页内报告抽屉；「导出」仅 toast 演示，不触发真实下载。
- 确认后右栏有业务流程占位；匹配完成后可回填双方案摘要；聊天区有匹配进度卡。
- 语音 / 文件附件按钮为禁用态占位。
