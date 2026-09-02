# 知识工程平台

面向企业结构化与非结构化数据的统一纳管、知识抽取、加工、资产化、图谱构建与智能应用平台。

## 产品体系

1. 资源纳管
2. 知识加工
3. 知识管理
4. 知识服务

## 平台原型

原型代码位于 `knowledge-engineering-platform-prototype/`，页面基于 Hertz Design System 构建，按业务模块拆分为独立页面，并共享平台导航、样式与交互脚本。

本地预览：

```bash
cd knowledge-engineering-platform-prototype
python3 -m http.server 4173
```

浏览器访问 `http://localhost:4173/`。

## 需求文档

- [`docs/知识工程平台产品需求与原型评审说明书.md`](docs/知识工程平台产品需求与原型评审说明书.md)：记录产品原则、模块边界、主流程、原型要求和评审待决项。
