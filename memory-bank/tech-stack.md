# Tech Stack — MathSpark Parent Weekly Report

## 技术选型原则
Demo 级别：快速可运行、视觉完整、AI 接口真实调用，不过度工程化。

---

## 各层选型

### 应用框架：Next.js 14（App Router）
- **理由**：前后端一体，API Routes 直接处理 AI 调用（无需单独服务器），Vercel 免费部署，React 生态
- **路由方式**：App Router（`/app` 目录）
- **渲染方式**：客户端组件（`'use client'`）为主，AI 接口为服务端 API Route

### 样式：Tailwind CSS v3 + shadcn/ui
- **理由**：快速搭建高保真 UI，shadcn/ui 提供现成的 Card/Select/Badge 组件，设计一致性好
- **动效**：Framer Motion（卡片入场动画、数字滚动）

### 图表：Apache ECharts（via `echarts-for-react`）
- **理由**：用户指定，功能丰富，折线图 + 仪表盘 + 工具提示开箱即用
- **版本**：`echarts@5.x` + `echarts-for-react@3.x`

### AI 接口层：Next.js API Routes（服务端）
- **路由**：`/api/generate-commentary`（POST）
- **Provider 抽象**：单一接口，根据 `provider` 参数分发到不同 SDK
  - Claude：`@anthropic-ai/sdk`
  - GPT-4o：`openai`（npm）
  - DeepSeek：`openai`（兼容 OpenAI SDK，改 baseURL 即可）
- **API Key 管理**：`.env.local`（`ANTHROPIC_API_KEY` / `OPENAI_API_KEY` / `DEEPSEEK_API_KEY`）
- **Streaming**：使用 `ReadableStream` 支持 AI 打字机效果输出

### Mock 数据存储：本地 JSON
- **位置**：`/data/children.json` + `/data/weekly-reports.json`
- **理由**：Demo 不需要数据库，JSON 文件足够，且修改灵活
- **Mock 内容**：3 个孩子 × 4 周数据 = 12 份周报

### 状态管理：React useState + SWR
- **useStore**：无需 Redux，useState 管理当前选中 child + week
- **SWR**：`swr` 包处理 AI 接口的数据 fetching + 缓存（避免重复调用同一 provider）

### 开发环境
- Node.js 18+
- `pnpm`（包管理）
- TypeScript（类型安全）

### 部署（可选演示）
- Vercel（零配置，Next.js 原生支持）
- `.env` 在 Vercel Dashboard 配置 AI API Keys

---

## 目录结构预览

```
demo/
├── app/
│   ├── layout.tsx          # 全局 Layout，引入字体
│   ├── page.tsx            # 首页（重定向或默认孩子）
│   └── report/
│       └── page.tsx        # 周报主页面
├── api/
│   └── generate-commentary/
│       └── route.ts        # AI 接口（服务端）
├── components/
│   ├── ChildSelector.tsx   # 孩子切换下拉
│   ├── WeekPicker.tsx      # 周次选择器
│   ├── HeroCard.tsx        # 首屏亮点卡片
│   ├── MathProgressChart.tsx  # ECharts 折线图
│   ├── FocusGauge.tsx      # ECharts 仪表盘
│   ├── TopicsMastery.tsx   # 知识点掌握标签
│   ├── AICommentary.tsx    # AI 点评 + Provider 切换
│   ├── Suggestions.tsx     # 下周建议
│   └── FooterCTA.tsx       # 行动按钮
├── data/
│   ├── children.json       # 孩子 Profile Mock 数据
│   └── weekly-reports.json # 周报 Mock 数据
├── lib/
│   ├── ai-providers.ts     # Claude/GPT/DeepSeek 调用封装
│   └── mock-data.ts        # Mock 数据读取工具
├── types/
│   └── index.ts            # TypeScript 类型定义
├── .env.local              # API Keys（不提交 Git）
├── .env.example            # Keys 模板
└── package.json
```

---

## 依赖清单

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "typescript": "5.x",
    "tailwindcss": "3.x",
    "framer-motion": "11.x",
    "echarts": "5.x",
    "echarts-for-react": "3.x",
    "@anthropic-ai/sdk": "latest",
    "openai": "latest",
    "swr": "2.x",
    "lucide-react": "latest",
    "clsx": "latest"
  }
}
```

---

## AI Prompt 策略

**System Prompt（固定）：**
> You are a warm, encouraging educational analyst writing weekly progress reports for parents of children aged 6–12. Your tone is positive, specific, and data-driven. Always focus on growth and improvement. Write in clear, conversational English suitable for busy Western parents. Avoid educational jargon.

**User Prompt（动态注入结构化数据）：**
传入孩子姓名、年级、本周 vs 上周数学得分、专注时长、掌握知识点列表等，要求返回 JSON 格式（headline + commentary + suggestions[]）。

**返回格式控制：**
要求 AI 返回 JSON，前端解析展示，避免 markdown 格式污染。
