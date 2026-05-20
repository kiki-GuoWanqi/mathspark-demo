# Implementation Plan — MathSpark Parent Weekly Report

每步必须独立可验证，执行前读取 architecture.md + progress.md。

---

## Step 1 — 项目初始化
**目标**：创建 Next.js 14 + TypeScript + Tailwind CSS + ECharts 项目骨架

**任务**：
- 用 `create-next-app` 初始化项目（App Router，TypeScript，Tailwind）
- 安装所有依赖：echarts, echarts-for-react, framer-motion, @anthropic-ai/sdk, openai, swr, lucide-react, clsx
- 创建 `.env.local` 和 `.env.example`
- 创建目录结构：`/components`, `/data`, `/lib`, `/types`
- 配置 Tailwind，引入 Inter 字体（Google Fonts）

**验证**：`pnpm dev` 启动成功，浏览器访问 localhost:3000 显示默认页面，无报错

---

## Step 2 — Mock 数据 + 类型定义
**目标**：准备所有前端展示所需的 Mock 数据和 TypeScript 类型

**任务**：
- 创建 `/types/index.ts`：定义 `Child`, `WeeklyReport`, `AICommentary`, `TopicStatus` 等类型
- 创建 `/data/children.json`：3 个孩子（Emma 8岁/Grade 3, Liam 10岁/Grade 5, Sophia 7岁/Grade 2）各自的 Profile
- 创建 `/data/weekly-reports.json`：每个孩子 × 4 周 = 12 份完整周报数据（含 mathScores, focusScore, topics, streak, badges）
- 创建 `/lib/mock-data.ts`：提供 `getChildren()`, `getWeeklyReport(childId, weekId)`, `getAvailableWeeks()` 工具函数

**验证**：在 Next.js 任意 Server Component 中 import mock-data.ts，能正确读取并 console.log 出数据结构，类型无报错

---

## Step 3 — 基础页面框架 + 导航栏
**目标**：搭建报告页面的整体骨架，实现 Child Selector + Week Picker 交互

**任务**：
- 创建 `/app/report/page.tsx`：客户端页面，管理 `selectedChild` 和 `selectedWeek` 状态
- 创建 `/components/Header.tsx`：包含 App Logo（MathSpark 文字 Logo + 数学图标）、Child Selector 下拉（显示孩子头像+姓名+年级）、Week Picker（左右箭头 + 当前周文字）
- 子组件 `ChildSelector.tsx`：接收 children 列表 + 当前选中 id + onChange，渲染 Tailwind 样式下拉
- 子组件 `WeekPicker.tsx`：接收 weeks 列表 + 当前 weekId + onChange，渲染左右翻页
- 页面整体背景色 `#F8FAFC`，顶部 Header 白色带底部阴影
- 响应式：移动端 Header 竖排布局

**验证**：打开 localhost:3000/report，Header 正确显示，切换孩子和周次后 console.log 出对应的 childId + weekId

---

## Step 4 — Hero Card（首屏亮点卡片）
**目标**：实现首屏核心展示区，包含头像、基础 Stat Pills

**任务**：
- 创建 `/components/HeroCard.tsx`：接收 child + weeklyReport 数据
- 左侧：孩子卡通 Avatar（用 Tailwind + 文字首字母 fallback，或 placeholder 图片），姓名、年级、当前连胜天数（🔥 12-day streak）
- 右侧：3 个 Stat Pills，每个显示图标 + 数值 + 趋势（↑12% in green / ↓5% in red）
  - 📐 Math Score（本周平均分）
  - 🎯 Focus Score（本周专注分）
  - ✅ Topics Mastered（本周新掌握数）
- AI 生成的 Headline 文字区域：暂时显示 Skeleton Loader（灰色占位条），AI 接口完成后替换
- Framer Motion：卡片从下方 20px 处 fade-in（delay 0.1s）

**验证**：切换孩子后 HeroCard 数据更新，3 个 Stat Pills 数字正确，趋势方向正确（本周 > 上周 → ↑绿色）

---

## Step 5 — Math Progress Chart（ECharts 折线图）
**目标**：实现数学得分趋势对比图表

**任务**：
- 创建 `/components/MathProgressChart.tsx`：接收 weeklyReport 的 mathScores 数据
- ECharts 配置：
  - 双折线：This Week（蓝紫渐变面积线）vs Last Week（浅灰虚线）
  - X 轴：Mon / Tue / Wed / Thu / Fri / Sat / Sun
  - Y 轴：0–100，带 % 单位
  - Tooltip：显示具体日期、分数、本周练习题数
  - Legend：右上角两个图例
  - 动画：ECharts 内置入场动画
- 图表外包裹 Card 组件（白色背景、圆角、shadow）
- 标题："Math Performance" + 副标题 "Daily accuracy this week vs. last week"
- 响应式：图表高度移动端 200px，桌面端 280px

**验证**：切换不同孩子/周次，折线图数据同步更新，hover tooltip 正确显示，移动端图表可正常渲染不溢出

---

## Step 6 — Focus Score（ECharts 仪表盘）
**目标**：实现专注力评分的可视化展示

**任务**：
- 创建 `/components/FocusGauge.tsx`：接收 focusScore 数据
- 左侧：ECharts Gauge（仪表盘）：
  - 0–100 分制
  - 颜色分段：0–60 橙色，60–80 蓝色，80–100 绿色
  - 指针指向当前分数
  - 中心显示分数数字 + "Focus Score" 文字
- 右侧：3 个辅助指标（文字 + 图标）：
  - ⏱ Avg Session：24 min
  - 📅 Sessions This Week：6
  - 🔥 Longest Focus：31 min
- 底部：本周每日专注时长小折线（Sparkline 风格，简单 ECharts line）
- 上周对比文字："↑11 pts from last week"

**验证**：切换孩子后仪表盘分数变化，颜色分段正确（82分对应蓝色区间），辅助指标数据准确

---

## Step 7 — Topics Mastery（知识点掌握情况）
**目标**：展示本周知识点三分类状态

**任务**：
- 创建 `/components/TopicsMastery.tsx`：接收 topics 数据（mastered / practicing / needsWork 数组）
- 三列布局（桌面端），移动端竖排：
  - **Mastered**（绿色背景标签）：✅ + topic name
  - **Practicing**（蓝色背景标签）：📝 + topic name
  - **Needs Work**（橙色背景标签）：💪 + topic name
- 每列有标题 + 数量 Badge（如 "Mastered · 3"）
- 标签 hover：tooltip 显示该 topic 的练习题数和正确率（来自 Mock 数据）
- 顶部有 Section 标题："Topics This Week" + 简短说明文字

**验证**：3 列标签正确分类显示，颜色与分类匹配，hover tooltip 出现，切换孩子数据更新

---

## Step 8 — AI 后端接口
**目标**：实现真实 AI 调用的服务端 API Route，支持 Claude / GPT-4o / DeepSeek 三路由

**任务**：
- 创建 `/app/api/generate-commentary/route.ts`（Next.js App Router API Route）
- 创建 `/lib/ai-providers.ts`：
  - `generateWithClaude(prompt)`：使用 `@anthropic-ai/sdk`，Messages API
  - `generateWithGPT(prompt)`：使用 `openai` SDK，Chat Completions
  - `generateWithDeepSeek(prompt)`：使用 `openai` SDK（baseURL 换为 DeepSeek endpoint）
- `route.ts` 逻辑：
  1. 接收 `{ childData, provider }` 请求体
  2. 构建 Prompt（System Prompt 固定 + User Prompt 注入结构化数据）
  3. 根据 provider 参数分发到对应函数
  4. 要求 AI 返回 JSON：`{ headline, commentary, suggestions: [{icon, title, detail}] }`
  5. 解析 AI 输出，返回 `NextResponse.json()`
- 错误处理：provider 无效、API 调用失败时返回 500 + 友好错误信息
- `.env.example` 列出所需 Key 名称

**验证**：用 curl 或 Postman 调用 `POST /api/generate-commentary`，传入 provider="claude"，返回合法 JSON；换 provider="deepseek" 也能正常返回

---

## Step 9 — AI Commentary 组件（前端）
**目标**：实现 AI 点评展示区域，包含 Provider 切换交互

**任务**：
- 创建 `/components/AICommentary.tsx`：
  - 接收 `childData` + `weekId`，内部管理 `provider` 状态（默认 "claude"）
  - Provider 切换 UI：三个 Tab 按钮，图标 + 文字（Claude / GPT-4o / DeepSeek）
    - 激活状态：填充色背景
    - 非激活：边框样式
  - 点击 Tab → 触发 `fetch('/api/generate-commentary', { childData, provider })`
  - 加载中：显示 Skeleton Loader（3 行灰色占位）
  - 加载完成：显示 AI 点评文字，右上角显示小 Badge 标明 Provider 来源
  - SWR 缓存：同一 childId + weekId + provider 的组合，已加载过的不重复请求
  - 页面进入时自动用默认 provider（claude）加载一次

**验证**：页面打开后 AI Commentary 自动调用接口加载，显示 Loading 后出现内容；点击 GPT-4o Tab 后重新加载显示新内容；Badge 显示对应 provider 名称

---

## Step 10 — Suggestions + Footer CTA + 动效收尾
**目标**：完成剩余组件，添加全局动画，整体页面完善

**任务**：
- 创建 `/components/Suggestions.tsx`：
  - 接收 AI 返回的 suggestions 数组
  - 3 张卡片横排（移动端竖排），每张：emoji 图标 + 标题 + 详情文字
  - 卡片有 hover 微上移效果
- 创建 `/components/FooterCTA.tsx`：
  - 主按钮："Keep [Name]'s Streak Going → Renew"（点击 alert 演示用）
  - 次按钮："Share This Report"（复制当前 URL 到剪贴板 + Toast 提示）
  - 订阅状态小字（来自 Mock 数据的 subscriptionStatus）
- 全局动效：
  - 各 Section 用 Framer Motion `whileInView` 实现滚动入场
  - HeroCard 数字用 `animate` 做数字滚动效果（从 0 到目标值）
- HeroCard 的 AI Headline：在 Step 9 接口返回后，将 headline 同步传给 HeroCard 展示，替换 Skeleton
- 响应式最终检查：375px / 768px / 1280px 三个断点验证
- 页面 `<title>` 和 meta 设置

**验证**：
- 完整流程：打开页面 → Header 选择孩子和周次 → 所有图表更新 → AI 点评自动加载 → Provider 切换正常 → Renew 按钮有响应 → Share 复制成功有 Toast → 移动端 375px 无横向溢出

---

## 执行顺序汇总

| Step | 内容 | 依赖 |
|------|------|------|
| 1 | 项目初始化 | 无 |
| 2 | Mock 数据 + 类型 | Step 1 |
| 3 | 页面框架 + Header | Step 2 |
| 4 | Hero Card | Step 3 |
| 5 | Math Progress Chart | Step 3 |
| 6 | Focus Gauge | Step 3 |
| 7 | Topics Mastery | Step 3 |
| 8 | AI 后端接口 | Step 1 |
| 9 | AI Commentary 前端 | Step 4, 8 |
| 10 | Suggestions + CTA + 动效 | Step 9 |
