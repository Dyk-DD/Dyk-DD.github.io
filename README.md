# 临床决策辅助系统 - 前端

基于 React + Vite + TypeScript 的临床决策辅助前端界面，通过 SSE 流式通信与 [Agentic-RAG](https://github.com/Dyk-DD/Agentic-RAG) 后端 API 交互。

## 技术栈

- React 19 + TypeScript
- Vite 8（开发/构建）
- Zustand（状态管理）
- React Router 7（路由）
- SSE（服务端推送流式响应）

## 功能

- **对话问答**：流式输出，支持医疗症状、药物禁忌、临床推理等查询
- **路由可视化**：展示后端智能路由的决策策略、复杂度评估
- **会话管理**：新建/切换/删除对话会话
- **历史记录**：浏览和查看历史会话详情

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev
```

开发时 Vite 会将 `/api` 请求代理到后端 `http://localhost:8000`。

## 生产构建

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

## 部署

推送代码后 GitHub Actions 自动构建并部署到 GitHub Pages。需在仓库 Settings → Pages 中将 Source 设为 **GitHub Actions**。

## 项目结构

```text
src/
├── api/client.ts          # API 客户端（REST + SSE）
├── store/chatStore.ts     # Zustand 状态管理
├── types/index.ts         # TypeScript 类型定义
├── components/
│   ├── ChatLayout.tsx     # 侧边栏 + 主布局
│   ├── ChatMessage.tsx    # 消息气泡
│   ├── ChatInput.tsx      # 输入框
│   └── RoutingCard.tsx    # 路由决策卡片
└── pages/
    ├── ChatPage.tsx       # 对话页
    └── HistoryPage.tsx    # 历史记录页
```
