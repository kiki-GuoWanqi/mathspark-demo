# Design Document — MathSpark Parent Weekly Report

## 1. Scope & Non-Goals

### In Scope
- 单页 Web App，家长打开链接即可查看孩子的本周学习周报
- 支持切换不同孩子和不同周次（Mock 数据）
- 至少一个真实 AI 接口调用（后端统一路由，前端无需 API Key）
- 多 AI 提供商支持：Claude / GPT-4o / DeepSeek（后端配置，前端通过 UI 切换 provider 用于 Demo 演示）
- ECharts 可视化图表
- 英文界面，面向欧美海外家长

### Non-Goals
- 不做真实登录注册（Demo 直接访问即可）
- 不做邮件推送系统
- 不做真实数据库（JSON Mock 数据）
- 不做 PDF 导出
- 不做多语言切换（英文即可）

---

## 2. 目标用户特征（海外家长 + 儿童视角）

### 家长侧（数据接收方）
| 特征 | 设计含义 |
|------|----------|
| 欧美父母注重 **transparency**，要看真实数据 | 图表数据要具体，不能只有模糊描述 |
| 时间有限，**60 秒内需要感知核心价值** | 首屏必须有 1 句话总结 + 3 个关键数字 |
| 信任来自**具体的进步证据** | 本周 vs 上周对比是核心设计点 |
| 对订阅续费敏感，需要感知 **ROI（学习回报）** | 每周报告要体现"钱花得值" |
| 习惯 mobile 端浏览（美国 60%+ 邮件在手机上打开） | 响应式设计，移动优先 |

### 儿童侧（数据生成方，会影响报告语气）
| 特征 | 设计含义 |
|------|----------|
| 6–12 岁，欧美学校数学课程体系（加减乘除、分数、几何等） | 知识点标签用英文学术词汇（Addition, Fractions, Geometry） |
| 喜欢 gamification（徽章、等级、连胜） | 加入 streak / badge 展示元素 |
| 进步要被正向强化 | AI 文案语气积极、具体、鼓励为主 |

---

## 3. 页面结构与用户旅程

### 页面整体布局（从上到下）

```
┌────────────────────────────────────────────────┐
│  Header: App Logo + Child Selector + Week Picker │
├────────────────────────────────────────────────┤
│  Hero Card: 孩子头像 + AI生成本周亮点一句话       │
│             + 3个核心数字（得分/专注/知识点）     │
├────────────────────────────────────────────────┤
│  Section 1: Math Progress Chart（ECharts折线图） │
│             本周每日正确率 vs 上周同期           │
├────────────────────────────────────────────────┤
│  Section 2: Focus Score（ECharts环形仪表盘）     │
│             本周平均专注时长 + 趋势箭头           │
├────────────────────────────────────────────────┤
│  Section 3: Topics Mastered（标签 + 进度条）     │
│             Mastered / Practicing / Needs Work  │
├────────────────────────────────────────────────┤
│  Section 4: AI Commentary（AI 生成详细点评）     │
│             可切换 AI Provider（Demo 用）        │
├────────────────────────────────────────────────┤
│  Section 5: Next Week Suggestions（3条建议）     │
├────────────────────────────────────────────────┤
│  Footer CTA: Renew Subscription + Share Report  │
└────────────────────────────────────────────────┘
```

---

## 4. 功能行为细节

### 4.1 Child Selector + Week Picker
- **Child Selector**：顶部下拉，显示孩子头像+姓名+年级（Demo 预置 3 个孩子 Mock 数据）
- **Week Picker**：左右箭头切换周次，显示 "Week of May 12 – May 18, 2025"，可回溯 4 周
- 切换后页面数据整体刷新（包括重新触发 AI 文案生成或从缓存读取）

### 4.2 Hero Card
- 孩子头像（彩色卡通 avatar）
- AI 生成的一句话亮点（30 字以内英文，如 *"Emma crushed it this week — her accuracy jumped 15% and she stayed focused for 28 minutes straight!"*）
- 3 个核心 Stat Pill：
  - 📐 Math Score：本周平均分（如 87/100）+ 趋势（↑12%）
  - 🎯 Focus Score：专注评分（如 82/100）+ 趋势
  - ✅ Topics Mastered：本周新掌握知识点数量（如 5 topics）

### 4.3 Math Progress Chart（ECharts）
- **类型**：折线面积图，双线对比（This Week vs Last Week）
- **X 轴**：周一到周日（Mon–Sun）
- **Y 轴**：正确率（0–100%）
- **交互**：hover tooltip 显示当天得分 + 练习题数量
- **颜色**：本周蓝紫色渐变，上周浅灰色

### 4.4 Focus Score（ECharts）
- **类型**：仪表盘（Gauge chart），0–100 分
- **辅助指标**（文字展示）：
  - Avg session duration（平均单次学习时长，分钟）
  - Sessions this week（本周学习次数）
  - Longest focus streak（最长不间断专注，分钟）
- 旁边小折线图：本周每天专注时长趋势

### 4.5 Topics Mastered
- 三列卡片或标签组：
  - **Mastered**（绿色）：已完全掌握的知识点
  - **Practicing**（蓝色）：正在练习中
  - **Needs Work**（橙色）：需要加强
- 每个 Topic 标签可 hover 显示详情（练习题数 + 正确率）

### 4.6 AI Commentary
- 卡片标题："AI Weekly Insight"
- 内容：3–5 句话的个性化点评（由后端调用 AI 生成）
- **Provider 切换 UI**（Demo 专用）：右上角三个 tab：Claude / GPT-4o / DeepSeek
  - 切换后重新请求对应 AI，展示生成内容
  - 加载中显示 skeleton loader
  - 每次切换显示不同 provider 的图标徽章
- **Prompt 设计**：传入结构化周报数据 → AI 输出自然语言点评

### 4.7 Next Week Suggestions
- 3 条卡片，每条包含：
  - 图标（📚 📝 🏆）
  - 一句话建议标题
  - 1–2 句具体说明
- 由同一个 AI 接口一起返回

### 4.8 Footer CTA
- 主按钮：**"Keep Emma's Streak Going → Renew"**（绿色，醒目）
- 次按钮：**"Share This Report"**（复制链接 / 社交分享）
- 小字：当前订阅状态（如 "Active until Jun 30, 2025"）

---

## 5. 数据模型（Mock）

### Child Profile
```json
{
  "id": "child_001",
  "name": "Emma",
  "age": 8,
  "grade": "Grade 3",
  "avatar": "/avatars/emma.png",
  "parentName": "Sarah"
}
```

### Weekly Data
```json
{
  "childId": "child_001",
  "weekId": "2025-W20",
  "weekLabel": "May 12 – May 18, 2025",
  "mathScores": {
    "daily": [72, 78, 85, 80, 91, 88, 87],
    "avgThisWeek": 83,
    "avgLastWeek": 74,
    "changePercent": 12
  },
  "focusScore": {
    "score": 82,
    "avgSessionMinutes": 24,
    "sessionsCount": 6,
    "longestFocusMinutes": 31,
    "dailyMinutes": [18, 25, 30, 22, 28, 26, 20],
    "lastWeekScore": 71
  },
  "topics": {
    "mastered": ["Addition", "Subtraction", "Place Value"],
    "practicing": ["Multiplication", "Word Problems"],
    "needsWork": ["Division", "Fractions"]
  },
  "streak": 12,
  "badges": ["Week Champion", "Focus Master"]
}
```

---

## 6. AI 接口设计

### 后端路由：`POST /api/generate-commentary`

**请求体：**
```json
{
  "childData": { ...weeklyData },
  "provider": "claude" | "gpt4o" | "deepseek"
}
```

**返回体：**
```json
{
  "headline": "Emma had a breakthrough week...",
  "commentary": "This week, Emma demonstrated remarkable...",
  "suggestions": [
    { "icon": "📚", "title": "...", "detail": "..." },
    { "icon": "📝", "title": "...", "detail": "..." },
    { "icon": "🏆", "title": "...", "detail": "..." }
  ],
  "provider": "claude"
}
```

**Prompt 模板：**
系统角色设定为教育数据分析师，用温暖鼓励的语气向西方家长解读孩子的学习数据，避免负面措辞，聚焦成长与进步，给出具体可执行建议。

---

## 7. 视觉设计规范

### 配色
| 角色 | 颜色 | 用途 |
|------|------|------|
| Primary | `#6366F1`（Indigo） | 主按钮、图表主线、强调色 |
| Accent | `#F59E0B`（Amber） | 勋章、streak、高亮 |
| Success | `#10B981`（Emerald） | Mastered 标签、正向趋势 |
| Warning | `#F97316`（Orange） | Needs Work 标签 |
| Background | `#F8FAFC` | 页面底色 |
| Card | `#FFFFFF` + shadow | 卡片背景 |

### 字体
- **Inter**（Google Fonts）：清晰现代，国际通用
- 标题：`font-bold`，数字用 `tabular-nums`

### 动效
- 卡片 fade-in + 上移 0.3s（Framer Motion）
- 图表 ECharts 内置动画
- AI 生成内容：打字机效果（streaming）

### 风格关键词
**Clean · Warm · Data-driven · Trustworthy · Playful（without being childish）**
参考：Duolingo 家长报告、Khan Academy 进度报告、Linear app 的卡片风格

---

## 8. 验收标准

- [ ] 可切换 3 个孩子，数据独立
- [ ] 可切换 4 周历史数据，图表动态更新
- [ ] ECharts 折线图和仪表盘正常渲染
- [ ] AI 点评接口真实调用（至少 Claude 或 GPT-4o 其中之一）
- [ ] Provider 切换后显示不同来源的 AI 内容
- [ ] 移动端适配（375px 最小宽度可用）
- [ ] 首屏加载时间 < 3s（不含 AI 生成延迟）
- [ ] AI 生成过程有 loading 状态提示
