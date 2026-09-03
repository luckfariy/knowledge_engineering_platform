# 知识工程平台原型

按照最新产品框架重新构建的独立多页面原型，不包含旧版菜单和兼容跳转。

## 产品框架

- 资源纳管
  - 资源概览
  - 文档中心
  - 数据表
  - 图数据
- 知识加工
  - 概览
  - 加工模型
  - 流程加工
  - 加工任务
- 知识管理
  - 概览
  - 语义知识图谱
  - 知识库
- 知识服务
  - 工作台
  - 搜索界面
  - 智能体对接
  - SDK 服务

当前阶段已细化资源纳管、知识加工、知识管理与知识服务的独立页面及导航路由。

## 项目结构

- `index.html`：资源概览，也是项目直接入口
- `pages/documents.html`：文档中心
- `pages/data-tables.html`：数据表
- `pages/graph-data.html`：图数据
- `pages/processing-overview.html`：知识加工概览
- `pages/processing-models.html`：加工模型
- `pages/processing-flows.html`：流程加工
- `pages/processing-tasks.html`：加工任务与新建任务流程
- `pages/management-overview.html`：知识管理概览
- `pages/semantic-graphs.html`：语义知识图谱
- `pages/knowledge-bases.html`：知识库
- `pages/processing.html` 与 `pages/management.html`：兼容旧地址的跳转页
- `pages/services.html`：知识服务工作台
- `pages/knowledge-search.html`：全局知识搜索与 AI 搜索对话
- `pages/agent-access.html`：智能体 Skill / MCP 对接页
- `pages/sdk-services.html`：API 检索接口 / 虚拟文件系统服务页
- `assets/js/shell.js`：新版共享导航与平台框架
- `assets/js/app.js`：新版共享交互
- `assets/css/platform.css`：新版平台组合样式
- `assets/design-system/`：Hertz v1.3.3 设计系统

## 本地运行

```bash
cd knowledge-engineering-platform-prototype
npm run serve
```

访问 `http://localhost:4173/`。
