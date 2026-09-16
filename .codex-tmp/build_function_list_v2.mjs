import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const sourcePath = "/Users/lucky/海致/知识工程平台/outputs/20260915-actual-product-function-list/知识工程图谱平台功能清单-实际产品设计版.xlsx";
const outputDir = "/Users/lucky/海致/知识工程平台/outputs/20260915-v2-function-list";
const outputPath = `${outputDir}/知识工程图谱平台功能清单-V2.xlsx`;

const source = await SpreadsheetFile.importXlsx(await FileBlob.load(sourcePath));
const sourceValues = source.worksheets.getItem("平台功能清单").getUsedRange().values;

const moduleOrder = [
  "一、工作台与全局能力",
  "二、资源纳管",
  "三、知识生产",
  "四、知识管理",
  "五、知识服务",
  "六、业务门户",
  "七、系统配置",
];

const moduleMeta = {
  "一、工作台与全局能力": ["汇总知识建设待办、异常、搜索和任务通知", "已有原型", "现有基础"],
  "二、资源纳管": ["接入、登记和组织知识原料，不承担知识发布", "已详细设计", "现有基础"],
  "三、知识生产": ["加工资源、确认候选成果，建设并发布知识库与语义图谱", "待详细设计", "P0 基础闭环"],
  "四、知识管理": ["管理知识库和语义知识图谱两类正式资产及目录关系", "待详细设计", "P0 基础闭环"],
  "五、知识服务": ["把已发布资产配置为可测试、可授权、可接入的知识能力", "待详细设计", "P1 服务闭环"],
  "六、业务门户": ["面向普通业务人员提供搜索、问答、资产浏览、场景助手和反馈", "待详细设计", "P1 使用闭环"],
  "七、系统配置": ["提供组织、用户、权限、审计及跨模块治理能力", "已有原型", "现有基础"],
};

const baseRows = [];
let currentModule = "";
let currentGroup = "";
for (const row of sourceValues.slice(1)) {
  if (!row[3]) continue;
  if (row[1]) currentModule = String(row[1]);
  if (row[2]) currentGroup = String(row[2]);
  const [, defaultStatus, defaultPhase] = moduleMeta[currentModule];
  baseRows.push({
    module: currentModule,
    group: currentGroup,
    feature: String(row[3]),
    description: String(row[4] ?? ""),
    planning: defaultStatus,
    phase: defaultPhase,
    isNew: false,
  });
}

const future = [];
const add = (module, group, feature, description, phase) => future.push({
  module,
  group,
  feature,
  description,
  planning: "V2 建议新增",
  phase,
  isNew: true,
});

const P = "三、知识生产";
add(P, "生产项目管理", "创建生产项目", "围绕一个知识库或语义图谱建设目标建立独立生产项目", "P0 基础闭环");
add(P, "生产项目管理", "生产目标", "明确业务场景、目标资产、计划周期、交付标准和验收指标", "P0 基础闭环");
add(P, "生产项目管理", "项目角色", "配置资产建设负责人、知识工程师、业务专家和审核人", "P0 基础闭环");
add(P, "输入与依赖", "输入快照", "固定资源ID、资源版本、目录范围、权限和元数据标准版本", "P0 基础闭环");
add(P, "输入与依赖", "输入变更提示", "资源更新、删除、撤权或目录范围变化时提示受影响任务", "P1 持续运营");
add(P, "候选成果中心", "候选成果列表", "集中查看分段、问答、规则、实体、关系、事件和术语等加工结果", "P0 基础闭环");
add(P, "候选成果中心", "候选成果详情", "展示结果内容、置信度、质量分、证据和处理过程", "P0 基础闭环");
add(P, "候选成果中心", "成果差异对比", "对比不同批次、模型版本及资源版本产生的结果差异", "P0 基础闭环");
add(P, "候选成果中心", "批量处理", "批量通过、驳回、转交或标记需要裁决的候选成果", "P0 基础闭环");
add(P, "审核与质量门禁", "审核策略", "支持全量审核、抽样审核、双人复核和按置信度分级审核", "P0 基础闭环");
add(P, "审核与质量门禁", "证据核对工作台", "在候选结果与原文证据之间定位、修改和确认", "P0 基础闭环");
add(P, "审核与质量门禁", "质量门禁规则", "配置必须通过的指标、阈值、阻断条件和人工例外", "P0 基础闭环");
add(P, "审核与质量门禁", "冲突裁决", "对不同来源或版本的冲突结果选择、合并或保留多版本", "P0 基础闭环");
add(P, "资产版本装配", "待发布版本装配", "将已确认成果组合为一个待发布知识库版本或图谱版本", "P0 基础闭环");
add(P, "资产版本装配", "交付检查", "检查内容、来源、质量、权限、责任人和变更说明是否完整", "P0 基础闭环");
add(P, "资产版本装配", "交付知识管理", "将待发布版本及审核记录交付正式资产管理", "P0 基础闭环");
add(P, "生产运行管理", "沙箱试运行", "使用少量样本验证流程、模型输出、预计耗时和成本", "P1 持续运营");
add(P, "生产运行管理", "任务优先级与并发", "配置执行优先级、并发额度、执行窗口和资源配额", "P1 持续运营");
add(P, "生产运行管理", "生产成本统计", "统计模型调用、Token、向量、存储、运行时间和任务成本", "P1 持续运营");
add(P, "生产运行管理", "模型效果基线", "使用标准样本比较模型、Prompt和参数的加工效果", "P1 持续运营");

const M = "四、知识管理";
add(M, "资产台账", "统一资产台账", "统一登记知识库和语义知识图谱的编号、责任人、目录、版本和状态", "P0 基础闭环");
add(M, "资产台账", "资产关系视图", "展示资产的来源、生产项目、目录、服务和业务应用关系", "P1 持续运营");
add(M, "资产发布管理", "发布审核单", "集中展示版本内容、质量结果、变更范围、权限和审核意见", "P0 基础闭环");
add(M, "资产发布管理", "生效版本管理", "区分最新建设版本、待发布版本和当前线上生效版本", "P0 基础闭环");
add(M, "资产发布管理", "版本差异对比", "比较内容、图谱结构、来源、权限和适用范围变化", "P0 基础闭环");
add(M, "资产发布管理", "发布回滚", "新版本异常时恢复历史生效版本并记录影响范围", "P0 基础闭环");
add(M, "资产生命周期", "定期复审", "按有效期或复审周期提醒负责人确认资产是否继续有效", "P1 持续运营");
add(M, "资产生命周期", "过期与废止", "管理即将过期、已过期、已下线和已废止状态，并指定替代资产", "P1 持续运营");
add(M, "资产生命周期", "责任人移交", "人员离职或岗位变化时转移资产负责人、审核人和维护责任", "P1 持续运营");
add(M, "资产生命周期", "归档与恢复", "归档长期不用但需保留的资产，并支持受控恢复", "P2 能力增强");
add(M, "资产权限运营", "权限申请", "用户无权访问资产时发起申请并说明用途和期限", "P1 持续运营");
add(M, "资产权限运营", "权限审批", "由资产授权管理员审批使用范围、有效期和附加条件", "P1 持续运营");
add(M, "资产权限运营", "授权到期复核", "授权到期后自动收回或进入复核流程", "P1 持续运营");
add(M, "资产影响与使用", "变更影响分析", "发布、取消发布、删除或调整权限前展示受影响服务和用户", "P1 持续运营");
add(M, "资产影响与使用", "资产使用分析", "查看引用资产的服务、应用、组织、用户和使用频次", "P2 能力增强");
add(M, "资产影响与使用", "资产变更订阅", "订阅资产版本、发布状态、有效期和权限变化通知", "P2 能力增强");

const S = "五、知识服务";
add(S, "服务设计", "服务模板", "提供知识搜索、知识问答、图谱查询和RAG上下文等标准模板", "P0 基础闭环");
add(S, "服务设计", "输入输出契约", "定义请求参数、返回结构、引用格式、错误码和无答案规则", "P0 基础闭环");
add(S, "服务设计", "资产版本快照", "服务版本明确绑定资产及其生效版本，避免运行范围漂移", "P0 基础闭环");
add(S, "服务设计", "服务策略继承", "从模板继承检索、回答和安全策略，并允许受控调整", "P1 持续运营");
add(S, "服务评测", "评测用例管理", "维护标准问题、期望答案、必须命中来源和禁止回答内容", "P0 基础闭环");
add(S, "服务评测", "评测版本", "评测结果关联服务版本、资产版本、模型和检索配置", "P0 基础闭环");
add(S, "服务评测", "失败案例分析", "查看召回、重排、回答、引用和权限判断的完整过程", "P0 基础闭环");
add(S, "服务评测", "回归评测", "资产或配置更新后自动重跑核心用例并比较差异", "P1 持续运营");
add(S, "服务发布管理", "多环境管理", "区分开发、测试和生产环境及对应配置", "P1 持续运营");
add(S, "服务发布管理", "灰度发布", "按调用方、组织或流量比例验证新服务版本", "P1 持续运营");
add(S, "服务发布管理", "服务回滚", "异常时恢复上一服务配置和资产版本快照", "P1 持续运营");
add(S, "服务发布管理", "接口弃用管理", "维护旧版本停用时间、迁移说明和调用方通知", "P2 能力增强");
add(S, "调用方与安全", "调用范围", "按调用方分配服务、版本、资产范围、用户范围和有效期", "P0 基础闭环");
add(S, "调用方与安全", "限流与配额", "按调用方配置并发、频率、日额度和资源消耗上限", "P1 持续运营");
add(S, "调用方与安全", "凭据轮换", "创建、轮换、禁用和审计API密钥或应用凭据", "P1 持续运营");
add(S, "服务运行", "调用链追踪", "追踪一次请求经过的权限、召回、图谱、重排、模型和引用过程", "P1 持续运营");
add(S, "服务运行", "服务告警", "按可用性、延迟、错误率、零结果率和成本设置告警", "P1 持续运营");
add(S, "服务运行", "服务故障管理", "记录故障影响、处理进度、恢复时间和复盘结果", "P2 能力增强");
add(S, "服务运营", "服务目录", "让应用建设人员查看、试用和申请可复用知识服务", "P2 能力增强");
add(S, "服务运营", "服务成本分析", "按服务和调用方统计模型、检索、图谱、存储及流量成本", "P2 能力增强");

const B = "六、业务门户";
add(B, "门户个性化", "角色化首页", "按组织、岗位、权限和使用习惯展示常用知识与场景助手", "P1 使用闭环");
add(B, "门户个性化", "最近使用", "展示最近搜索、问答、资产浏览和场景应用记录", "P1 使用闭环");
add(B, "搜索体验", "搜索范围选择", "选择全部知识、业务域、知识库、图谱或专题范围", "P0 基础闭环");
add(B, "搜索体验", "搜索纠错与建议", "提供错别字纠正、同义词、业务术语和相关问题建议", "P1 使用闭环");
add(B, "搜索体验", "结果排序", "支持相关性、权威性、时效性和更新时间排序", "P1 使用闭环");
add(B, "搜索体验", "结果命中解释", "说明结果命中的关键词、实体、关系或业务范围", "P1 使用闭环");
add(B, "可信问答", "冲突答案提示", "不同来源结论冲突时展示来源差异，不合成唯一结论", "P0 基础闭环");
add(B, "可信问答", "无答案处理", "区分无相关知识、无权限、问题不明确和服务异常", "P0 基础闭环");
add(B, "可信问答", "追问与范围调整", "追问时允许收窄知识库、业务域、时间和组织范围", "P0 基础闭环");
add(B, "可信问答", "适用范围提示", "明确答案适用的业务范围、组织、时间和资产版本", "P0 基础闭环");
add(B, "个人知识使用", "保存搜索", "保存常用查询条件并快速重新执行", "P2 能力增强");
add(B, "个人知识使用", "个人知识集", "收藏结果、资产和问答，并整理为个人知识集", "P1 使用闭环");
add(B, "个人知识使用", "知识订阅", "订阅资产更新、制度变化、专题新增和失效提醒", "P2 能力增强");
add(B, "权限协同", "访问权限申请", "从无权结果或资产入口发起访问申请", "P1 使用闭环");
add(B, "权限协同", "受限分享", "分享答案或资产入口时不扩大接收人的访问权限", "P1 使用闭环");
add(B, "反馈闭环", "结构化反馈", "区分答案错误、内容过期、知识缺失、引用错误和权限问题", "P0 基础闭环");
add(B, "反馈闭环", "反馈处理进度", "查看反馈是否受理、责任人、处理进度和结果", "P1 使用闭环");
add(B, "反馈闭环", "修复结果通知", "知识修复并完成回归评测后通知原反馈用户", "P1 使用闭环");
add(B, "反馈闭环", "反馈关联治理任务", "将有效反馈转为资产、服务或权限治理任务", "P1 使用闭环");
add(B, "场景助手", "任务化交互", "围绕制度查询、合同审查和风险分析组织输入、步骤和结果", "P1 使用闭环");
add(B, "场景助手", "高风险操作确认", "涉及外部状态变更时展示影响并要求人工确认", "P2 能力增强");

const C = "七、系统配置";
add(C, "平台横向治理", "统一对象标识", "资源、任务、资产、服务和应用使用稳定ID与版本关联", "P0 基础闭环");
add(C, "平台横向治理", "全链路血缘", "从门户答案追踪到服务、资产、生产任务、候选成果和原始资源", "P0 基础闭环");
add(C, "平台横向治理", "统一权限决策", "统一判断用户、组织、目录、资产、服务、调用方和源端约束", "P0 基础闭环");
add(C, "平台横向治理", "统一任务模型", "规范长任务的阶段、进度、结果、失败、取消和重试状态", "P0 基础闭环");
add(C, "平台横向治理", "统一治理工单", "承接知识缺失、过期、冲突、权限和服务异常并形成处理闭环", "P1 持续运营");
add(C, "平台横向治理", "指标口径管理", "维护资源、资产、发布、调用、反馈和质量指标的统计定义", "P1 持续运营");
add(C, "平台横向治理", "审计保留策略", "配置不同操作日志、调用记录和审批记录的保留期限", "P1 持续运营");

const allRows = [...baseRows, ...future];
const moduleMap = new Map();
for (const module of moduleOrder) moduleMap.set(module, new Map());
for (const row of allRows) {
  const groups = moduleMap.get(row.module);
  if (!groups.has(row.group)) groups.set(row.group, []);
  groups.get(row.group).push(row);
}

const orderedRows = [];
for (const module of moduleOrder) {
  for (const rows of moduleMap.get(module).values()) orderedRows.push(...rows);
}

const workbook = Workbook.create();
const summary = workbook.worksheets.add("版本与模块汇总");
const detail = workbook.worksheets.add("V2功能清单");
const additions = workbook.worksheets.add("V2新增功能");
summary.showGridLines = false;
detail.showGridLines = false;
additions.showGridLines = false;

const font = "Arial";
const dark = "#26364A";
const blue = "#1F6FEB";
const paleBlue = "#EAF2FF";
const paleAmber = "#FFF4D6";
const paleGreen = "#EAF7EE";
const paleGray = "#F6F8FA";
const line = "#D8E0EA";
const body = "#1F2937";
const muted = "#5F6B7A";

summary.getRange("A1:F1").merge();
summary.getRange("A1").values = [["知识工程图谱平台功能清单 V2"]];
summary.getRange("A2:F2").merge();
summary.getRange("A2").values = [["V2在实际产品设计版基础上，补充知识生产、知识管理、知识服务、业务门户及平台横向治理的未来建设内容。"]];
summary.getRange("A3:F3").values = [["核心模块", "模块定位", "原清单项", "V2新增项", "V2合计", "主要建设阶段"]];

const summaryRows = moduleOrder.map(module => {
  const originalCount = baseRows.filter(r => r.module === module).length;
  const newCount = future.filter(r => r.module === module).length;
  return [module, moduleMeta[module][0], originalCount, newCount, originalCount + newCount, moduleMeta[module][2]];
});
summary.getRange(`A4:F${3 + summaryRows.length}`).values = summaryRows;
summary.getRange(`A${4 + summaryRows.length}:F${4 + summaryRows.length}`).values = [["合计", "", baseRows.length, future.length, orderedRows.length, ""]];
summary.getRange(`A${5 + summaryRows.length}:F${5 + summaryRows.length}`).merge();
summary.getRange(`A${5 + summaryRows.length}`).values = [["规划属性说明：已有原型表示当前静态原型已表达主要形态；已详细设计表示已有较完整需求说明；待详细设计表示方向已明确但业务规则仍需展开；V2建议新增表示本次加入的未来建设内容。静态原型不代表后端、真实权限、任务调度或服务运行已经实现。"]];
summary.getRange(`A${6 + summaryRows.length}:F${6 + summaryRows.length}`).merge();
summary.getRange(`A${6 + summaryRows.length}`).values = [["编制依据：项目产品口径、原型页面及说明、资源纳管详细需求，以及本次四模块未来能力补充。"]];

const detailHeaders = [["序号", "核心模块", "一级功能", "二级功能", "功能说明", "规划属性", "建设阶段"]];
detail.getRange("A1:G1").values = detailHeaders;
let seq = 1;
const detailRows = [];
let previousModule = "";
let previousGroup = "";
for (const row of orderedRows) {
  const moduleValue = row.module === previousModule ? null : row.module;
  const groupValue = row.module === previousModule && row.group === previousGroup ? null : row.group;
  detailRows.push([seq++, moduleValue, groupValue, row.feature, row.description, row.planning, row.phase]);
  previousModule = row.module;
  previousGroup = row.group;
}
detail.getRange(`A2:G${detailRows.length + 1}`).values = detailRows;

additions.getRange("A1:G1").values = detailHeaders;
const newRows = future.map((row, index) => [index + 1, row.module, row.group, row.feature, row.description, row.planning, row.phase]);
additions.getRange(`A2:G${newRows.length + 1}`).values = newRows;

const styleHeader = range => {
  range.format = {
    fill: dark,
    font: { name: font, size: 10, bold: true, color: "#FFFFFF" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    rowHeight: 28,
    borders: { preset: "all", style: "thin", color: "#FFFFFF" },
  };
};
const styleBody = (sheet, lastRow) => {
  sheet.getRange(`A2:G${lastRow}`).format = {
    font: { name: font, size: 10, color: body },
    verticalAlignment: "center",
    wrapText: true,
    rowHeight: 36,
    borders: { preset: "all", style: "thin", color: line },
  };
  sheet.getRange(`A2:A${lastRow}`).format.horizontalAlignment = "center";
  sheet.getRange(`F2:G${lastRow}`).format.horizontalAlignment = "center";
  sheet.getRange(`F2:G${lastRow}`).format.font = { name: font, size: 9, bold: true, color: dark };
  sheet.getRange(`A1:A${lastRow}`).format.columnWidth = 8;
  sheet.getRange(`B1:B${lastRow}`).format.columnWidth = 24;
  sheet.getRange(`C1:C${lastRow}`).format.columnWidth = 25;
  sheet.getRange(`D1:D${lastRow}`).format.columnWidth = 27;
  sheet.getRange(`E1:E${lastRow}`).format.columnWidth = 70;
  sheet.getRange(`F1:F${lastRow}`).format.columnWidth = 18;
  sheet.getRange(`G1:G${lastRow}`).format.columnWidth = 18;
  sheet.freezePanes.freezeRows(1);
  sheet.freezePanes.freezeColumns(1);
};

summary.getRange("A1:F1").format = { font: { name: font, size: 16, bold: true, color: dark }, rowHeight: 30, verticalAlignment: "center" };
summary.getRange("A2:F2").format = { font: { name: font, size: 10, italic: true, color: muted }, rowHeight: 34, wrapText: true, verticalAlignment: "center" };
styleHeader(summary.getRange("A3:F3"));
summary.getRange(`A4:F${3 + summaryRows.length}`).format = { font: { name: font, size: 10, color: body }, wrapText: true, verticalAlignment: "center", rowHeight: 38, borders: { preset: "all", style: "thin", color: line } };
summary.getRange(`A${4 + summaryRows.length}:F${4 + summaryRows.length}`).format = { fill: paleBlue, font: { name: font, size: 10, bold: true, color: dark }, borders: { preset: "all", style: "thin", color: line }, rowHeight: 28 };
summary.getRange(`A${5 + summaryRows.length}:F${6 + summaryRows.length}`).format = { fill: paleGray, font: { name: font, size: 9, color: muted }, wrapText: true, verticalAlignment: "center", rowHeight: 54 };
summary.getRange("A1:A20").format.columnWidth = 24;
summary.getRange("B1:B20").format.columnWidth = 62;
summary.getRange("C1:E20").format.columnWidth = 13;
summary.getRange("F1:F20").format.columnWidth = 20;
summary.getRange(`C4:E${4 + summaryRows.length}`).format.horizontalAlignment = "center";
summary.freezePanes.freezeRows(3);

styleHeader(detail.getRange("A1:G1"));
styleBody(detail, detailRows.length + 1);
detail.getRange(`B2:B${detailRows.length + 1}`).format.font = { name: font, size: 10, bold: true, color: blue };
detail.getRange(`C2:C${detailRows.length + 1}`).format.font = { name: font, size: 10, bold: true, color: dark };
detail.getRange(`B2:C${detailRows.length + 1}`).format.horizontalAlignment = "center";

let rowCursor = 2;
for (const module of moduleOrder) {
  const moduleRows = orderedRows.filter(r => r.module === module);
  if (moduleRows.length > 1) detail.getRange(`B${rowCursor}:B${rowCursor + moduleRows.length - 1}`).merge();
  detail.getRange(`A${rowCursor}:G${rowCursor}`).format.borders = { top: { style: "medium", color: blue } };
  const groupMap = new Map();
  for (const row of moduleRows) groupMap.set(row.group, (groupMap.get(row.group) ?? 0) + 1);
  let groupCursor = rowCursor;
  for (const count of groupMap.values()) {
    if (count > 1) detail.getRange(`C${groupCursor}:C${groupCursor + count - 1}`).merge();
    groupCursor += count;
  }
  rowCursor += moduleRows.length;
}

for (let i = 0; i < orderedRows.length; i++) {
  if (orderedRows[i].isNew) detail.getRange(`F${i + 2}:G${i + 2}`).format.fill = paleAmber;
}

styleHeader(additions.getRange("A1:G1"));
styleBody(additions, newRows.length + 1);
additions.getRange(`B2:B${newRows.length + 1}`).format.font = { name: font, size: 10, bold: true, color: blue };
additions.getRange(`C2:C${newRows.length + 1}`).format.font = { name: font, size: 10, bold: true, color: dark };
additions.getRange(`F2:F${newRows.length + 1}`).format.fill = paleAmber;
additions.getRange(`G2:G${newRows.length + 1}`).format.fill = paleGreen;
additions.getRange(`B2:G${newRows.length + 1}`).format.verticalAlignment = "top";

detail.getRange(`F2:F${detailRows.length + 1}`).dataValidation = { rule: { type: "list", values: ["已有原型", "已详细设计", "待详细设计", "V2 建议新增"] } };
detail.getRange(`G2:G${detailRows.length + 1}`).dataValidation = { rule: { type: "list", values: ["现有基础", "P0 基础闭环", "P1 持续运营", "P1 服务闭环", "P1 使用闭环", "P2 能力增强"] } };

await fs.mkdir(outputDir, { recursive: true });
const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(outputPath);

const checks = [];
checks.push((await workbook.inspect({ kind: "table", range: "版本与模块汇总!A1:F12", include: "values,formulas", tableMaxRows: 15, tableMaxCols: 7, maxChars: 9000 })).ndjson);
checks.push((await workbook.inspect({ kind: "table", range: `V2新增功能!A1:G${Math.min(newRows.length + 1, 18)}`, include: "values,formulas", tableMaxRows: 18, tableMaxCols: 7, maxChars: 12000 })).ndjson);
checks.push((await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, summary: "final formula error scan" })).ndjson);
console.log(checks.join("\n"));

for (const [sheetName, range, fileName] of [
  ["版本与模块汇总", "A1:F13", "summary.png"],
  ["V2功能清单", "A1:G32", "full-list.png"],
  ["V2新增功能", "A1:G28", "additions-top.png"],
  ["V2新增功能", `A${Math.max(2, newRows.length - 22)}:G${newRows.length + 1}`, "additions-bottom.png"],
]) {
  const rendered = await workbook.render({ sheetName, range, scale: 1.2, format: "png" });
  await fs.writeFile(`${outputDir}/${fileName}`, new Uint8Array(await rendered.arrayBuffer()));
}

console.log(JSON.stringify({ outputPath, baseCount: baseRows.length, newCount: future.length, totalCount: orderedRows.length }));
