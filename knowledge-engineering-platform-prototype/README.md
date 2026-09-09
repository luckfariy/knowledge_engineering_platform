# 知识工程平台原型

基于 Hertz Design System 的独立多页面产品原型，用于讨论信息架构、业务规则与交互，不代表后端服务或真实授权已经实现。

## 产品框架

产品口径以[项目根 README](../README.md)为准（2026-09-08 更新）：

| 模块 | 产品职责 |
| --- | --- |
| 资源纳管 | 接入并组织文件、数据表和原始图数据等知识原料 |
| 知识生产 | 加工知识、建设知识库和语义知识图谱，并完成资产自身发布 |
| 知识管理 | 管理知识库和语义知识图谱两类资产，以及目录和资产挂载关系 |
| 知识服务 | 配置可供业务门户或外部应用使用的知识能力，提供测试、接入与授权 |

目录合并空间职责，承载成员、协作与管理权限。资产自行发布，目录当前不再增加发布流程；挂载不自动扩大资产权限，多目录挂载引用同一资产。

业务门户服务普通业务人员；完整智能体构建不是其默认工作。知识服务配置与专业建设能力面向相应配置人员。

## 当前实现与待对齐内容

当前页面仍含“知识应用／智能体构建”等旧入口；知识资产管理页仍有文件列表语义，发布交互仍将发布与目录挂载结合。上述部分待按根 README 对齐，本次文档更新不代表页面已经完成调整。

服务管理、测试评估、目录与资产权限联动等是后续设计方向。部分资产详情与应用侧页面为占位页，静态交互和示例数据不代表真实发布、权限校验或服务运行。

主要后台页面使用顶部一级导航与左侧二级菜单；系统配置通过用户头像进入。前台业务门户单独组织搜索、问答和资产浏览等使用入口。

## 项目结构

- `index.html`：平台工作台，采用顶部生命周期导航与知识工作台布局
- `pages/resource-overview.html`：资源概览
- `pages/documents.html`：企业文件中心，按文档类知识源组织文件
- `pages/resource-tasks.html`：资源接入与自动入目任务中心
- `pages/data-tables.html`：数据表
- `pages/graph-data.html`：图数据
- `pages/asset-catalogs.html`：知识资产管理页，当前文件列表语义待调整为资产挂载管理
- `pages/resource-catalog-design.html`：资源目录及目录权限管理
- `pages/metadata-standards.html`：业务与管理属性标准
- `pages/resource-tags.html`：标签管理
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
- `pages/agent-access.html`：现有智能体构建占位页，后续按知识服务方向整理
- `pages/skill-management.html`：技能管理页
- `pages/mcp-management.html`：MCP 管理页
- `pages/sdk-services.html`：SDK 服务页
- `pages/system-user-org.html`：组织机构、用户列表与产品功能权限管理
- `pages/system-roles.html`：角色管理
- `pages/system-logs.html`：操作日志
- `pages/frontend-home.html`、`pages/frontend-assets.html`、`pages/frontend-chat.html`、`pages/frontend-apps.html`：业务门户、资产浏览、聊天与场景助手页面
- `assets/js/publishing.js`：当前发布与目录挂载交互
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
