# 知识工程平台原型

按照最新产品框架重新构建的独立多页面原型，不包含旧版菜单和兼容跳转。

## 产品框架

- 资源纳管
  - 资源概览
  - 文档中心
  - 数据表
  - 图数据
- 知识加工
- 知识管理
- 知识服务

当前阶段已详细构建资源纳管模块。其余三个一级模块保留独立工作台页面，后续采用“少菜单、强页面”的方式逐步建设。

## 项目结构

- `index.html`：资源概览，也是项目直接入口
- `pages/documents.html`：文档中心
- `pages/data-tables.html`：数据表
- `pages/graph-data.html`：图数据
- `pages/processing.html`：知识加工工作台
- `pages/management.html`：知识管理工作台
- `pages/services.html`：知识服务工作台
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
