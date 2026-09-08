# 知识工程平台原型

按照最新产品框架重新构建的独立多页面原型，不包含旧版菜单和兼容跳转。

## 产品框架

- 资源纳管
  - 资源概览
  - 文件中心
  - 任务中心
  - 数据表
  - 图数据
  - 资源目录管理
- 知识加工
  - 概览
  - 加工模型
  - 流程加工
  - 加工任务
- 知识管理
  - 知识资产
  - 资产目录管理
- 知识应用
  - 智能体构建
  - 技能管理
  - MCP管理
  - SDK服务
- 系统配置
  - 用户与组织
  - 角色管理
  - 操作日志

当前阶段已细化资源纳管、知识生产、知识资产与知识应用的独立页面及导航路由。所有产品模块统一采用顶部一级 Tab、左侧当前模块二级菜单和右侧主内容区；系统配置通过用户头像进入，不占用产品一级 Tab。

## 项目结构

- `index.html`：平台工作台，采用顶部生命周期导航与知识工作台布局
- `pages/resource-overview.html`：资源概览
- `pages/documents.html`：企业空间，知识源目录按非结构化数据与结构化数据 Tab 切换
- `pages/resource-tasks.html`：资源接入与自动入目任务中心
- `pages/data-tables.html`：数据表
- `pages/graph-data.html`：图数据
- `pages/asset-catalogs.html`：资源目录管理
- `pages/processing-overview.html`：知识加工概览
- `pages/processing-models.html`：加工模型
- `pages/processing-flows.html`：流程加工
- `pages/processing-tasks.html`：加工任务与新建任务流程
- `pages/management-overview.html`：知识资产目录与卡片视图，可切换资源目录设计中的目录树及机构目录，并支持新建、编辑和删除目录节点
- `pages/knowledge-base-detail.html`：知识库详情占位页
- `pages/unified-semantic-graph-detail.html`：统一语义知识图谱详情占位页
- `pages/topic-knowledge-graph-detail.html`：专题知识图谱详情占位页
- `pages/semantic-graphs.html`：语义知识图谱
- `pages/knowledge-bases.html`：知识库
- `pages/processing.html` 与 `pages/management.html`：兼容旧地址的跳转页
- `pages/knowledge-search.html`：全局知识搜索与 AI 搜索对话
- `pages/agent-access.html`：智能体构建页
- `pages/skill-management.html`：技能管理页
- `pages/mcp-management.html`：MCP 管理页
- `pages/sdk-services.html`：SDK 服务页
- `pages/system-user-org.html`：组织机构、用户列表与产品功能权限管理
- `pages/system-roles.html`：角色管理
- `pages/system-logs.html`：操作日志
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
