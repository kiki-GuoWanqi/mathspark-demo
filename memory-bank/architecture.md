# Architecture Map — MathSpark Parent Weekly Report

## 当前状态：Bootstrap 完成，尚未写代码

## 已有文件

| 文件 | 职责 |
|------|------|
| `memory-bank/design-document.md` | 完整功能设计、数据模型、AI 接口规范、视觉规范 |
| `memory-bank/tech-stack.md` | 技术选型决策与依赖清单 |
| `memory-bank/implementation-plan.md` | 10 步实施计划，含每步验证条件 |
| `memory-bank/progress.md` | 执行日志（本文件） |
| `memory-bank/architecture.md` | 本文件，代码结构地图 |
| `PRD.md` | 初始需求捕获（已被 design-document 超越，可保留参考） |

## 待建立的代码结构（执行后更新）

```
demo/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── report/page.tsx          # 周报主页面
│   └── api/
│       └── generate-commentary/
│           └── route.ts         # AI 多路由接口
├── components/
│   ├── Header.tsx
│   ├── ChildSelector.tsx
│   ├── WeekPicker.tsx
│   ├── HeroCard.tsx
│   ├── MathProgressChart.tsx
│   ├── FocusGauge.tsx
│   ├── TopicsMastery.tsx
│   ├── AICommentary.tsx
│   ├── Suggestions.tsx
│   └── FooterCTA.tsx
├── data/
│   ├── children.json
│   └── weekly-reports.json
├── lib/
│   ├── ai-providers.ts          # Claude/GPT/DeepSeek 封装
│   └── mock-data.ts
└── types/
    └── index.ts
```

> 每完成一个 Step，在此更新对应文件的实际职责描述。
