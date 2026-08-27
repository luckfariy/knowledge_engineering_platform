# 知识工程平台原型

面向企业级知识生命周期的多页 HTML 产品原型。产品主链路为：

`知识采集 → 知识资源 → 知识加工 → 知识资产 → 图谱构建 → 知识服务 → 知识应用 → 知识运营`

## 项目结构

- `index.html`：平台总览
- `pages/`：八大产品模块页面
- `assets/css/platform.css`：平台组合样式
- `assets/js/shell.js`：共享平台导航和顶栏
- `assets/js/platform.js`：主题、搜索、筛选、弹窗等交互
- `assets/design-system/`：Hertz v1.3.3 设计令牌与基础组件

## 运行

```bash
python3 -m http.server 4173
```

然后访问 `http://localhost:4173/knowledge-engineering-platform-prototype/`。
