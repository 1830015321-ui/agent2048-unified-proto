# 测评组网系统 · 融合原型

主路径：**登录/注册 → 工作台或提需求 → 完善（城运）→ 组网 → 方案**（同页连贯）。

对齐高雨晴清单：多任务卡、DAG（含反馈虚线）、组网三态、历史工作台、教育样例。**Prototype 模拟，未接真实后端。**

## 打开

端口 **9876**：

```bash
python3 -m http.server 9876
```

- 完整链路：http://127.0.0.1:9876/step1-领证.html
- 工作台：`?demo=workbench`
- 教育案例：`?demo=edu` / `edu-match` / `edu-partial` / `edu-fail`

详见 `CHECKLIST-FILL-NOTES.md`。
