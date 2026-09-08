(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  $$('.fusion-actions button').filter(button => button.textContent.trim() === '暂不处理').forEach(button => button.remove());

  const extractionTab = $('.detail-tab[data-tab="extraction"]');
  const extractionPanel = $('.detail-panel[data-panel="extraction"]');
  const commitTab = $('.detail-tab[data-tab="commit"]');
  const commitPanel = $('.detail-panel[data-panel="commit"]');

  if (!commitPanel || !commitTab) return;

  // 抽取仍是后台能力，但不再作为用户可见的独立步骤。
  if (extractionTab) extractionTab.hidden = true;
  if (extractionPanel) extractionPanel.hidden = true;
  commitTab.innerHTML = '入图 <span class="tab-badge">900</span>';
  $$('[data-open-tab="extraction"]').forEach(node => { node.dataset.openTab = 'commit'; });
  $$('[data-doc-go="extraction"]').forEach(node => {
    node.dataset.docGo = 'commit';
    node.textContent = '查看全部入图知识';
  });
  $$('[data-jump="extraction"]').forEach(node => { node.dataset.jump = 'commit'; });

  const knowledgeRows = [
    {
      id: 'K-001', type: 'object', subject: '供电台区', relation: '统计', object: '月度售电量', objectType: 'metric',
      method: 'ai', methodLabel: 'AI 抽取', confidence: 94, source: '营销业务规程 §3.2', status: '可入图',
      evidence: {
        sourceName: '营销业务规程.docx', location: '第 3 章 §3.2 · 第 12 页 · 切片 C-086',
        quote: '供电台区应按月统计结算售电量，形成月度售电量指标，并与台区编码保持一致。',
        conclusion: '识别实体“供电台区”“月度售电量”，关系方向为“供电台区 —统计→ 月度售电量”。',
        model: 'GraphExtract-Pro', rule: '合同领域技能包 / 关系方向校验', batch: 'T-20260810-05',
        trace: ['文档版面解析', '切片 C-086 定位', '实体关系识别 0.94', '方向与本体约束通过']
      }
    },
    {
      id: 'K-002', type: 'object', subject: '电力客户', relation: '归属', object: '供电台区', objectType: 'object',
      method: 'human', methodLabel: '人工确认', confidence: 100, source: '业务规程 §2.1', status: '可入图',
      evidence: {
        sourceName: '知识融合人工裁决', location: '裁决记录 R-430 · 2026-08-11 16:28',
        quote: '领域专家确认客户档案中的台区编码表示客户当前归属的供电台区。',
        conclusion: '人工确认“电力客户 —归属→ 供电台区”，置信度按 100% 记入。',
        model: '人工确认', rule: '实体对齐 / 关系方向裁决', batch: 'T-20260810-05',
        trace: ['候选关系生成', '方向冲突识别', '领域专家确认', '形成最终三元组']
      }
    },
    {
      id: 'K-003', type: 'organization', subject: '供电服务中心', relation: '管理', object: '供电台区', objectType: 'object',
      method: 'import', methodLabel: '批量导入', confidence: 100, source: '组织实体知识集.xlsx · 关系表第 12 行', status: '可入图',
      evidence: {
        sourceName: '组织实体知识集.xlsx', location: '关系工作表 · 第 12 行',
        quote: 'subject_code=ORG-20018；relation=管理；object_code=PMS-TQ-XXXXX。',
        conclusion: '模板、本体字段映射和关系端点引用均校验通过。',
        model: '用户批量导入', rule: '模板结构检查 / 引用完整性检查', batch: 'IMP-20260811-03',
        trace: ['读取导入模板', '本体字段映射', '端点引用校验', '进入待入图区']
      }
    },
    {
      id: 'K-004', type: 'object', subject: '供电台区', relation: '关联', object: '营销客户主表', objectType: 'table',
      method: 'ai', methodLabel: 'AI 抽取', confidence: 96, source: 'SQL 血缘 · T_CUST_MAIN', status: '可入图',
      evidence: {
        sourceName: 'rpt_customer_tg.sql', location: 'SQL 血缘分析 · JOIN 条件第 18 行',
        quote: 'JOIN T_CUST_MAIN c ON a.tg_code = c.tg_code AND c.valid_flag = 1',
        conclusion: '根据 tg_code 等值连接识别业务对象与数据表的关联关系。',
        model: 'SQL 口径解析器', rule: '血缘解析 / 字段等值约束', batch: 'T-20260810-05',
        trace: ['SQL AST 展开', 'JOIN 端点识别', '字段语义映射', '探针校验通过']
      }
    },
    {
      id: 'K-005', type: 'object', subject: '电网线路', relation: '连接', object: '变电站', objectType: 'object',
      method: 'manual', methodLabel: '手工创建', confidence: 100, source: '手工批次 M-20260811-001', status: '可入图',
      evidence: {
        sourceName: '手工知识批次 M-20260811-001', location: 'Admin · 2026-08-11 15:40',
        quote: '用户通过关系表单创建：电网线路 —连接→ 变电站；依据为设备拓扑台账。',
        conclusion: '本体类型、必填属性和目标实体引用校验通过。',
        model: '手工创建', rule: '本体校验 / 重复检测', batch: 'M-20260811-001',
        trace: ['表单创建实体', '添加目标关系', '本体约束校验', '用户提交批次']
      }
    },
    {
      id: 'K-006', type: 'metric', subject: '线路负载率', relation: '描述', object: '电网线路', objectType: 'object',
      method: 'ai', methodLabel: 'AI 抽取', confidence: 88, source: '指标口径说明.pdf · 第 4 页', status: '待复核',
      evidence: {
        sourceName: '指标口径说明.pdf', location: '第 4 页 · 切片 C-144',
        quote: '线路负载率用于描述线路在统计周期内的最大负荷水平，计算结果与线路额定容量相关。',
        conclusion: '关系语义匹配，但“描述”关系是否应改为“衡量”仍需人工复核。',
        model: 'GraphExtract-Pro', rule: '低置信度人工复核', batch: 'T-20260810-05',
        trace: ['PDF 文本识别', '候选关系召回', '本体关系匹配 0.88', '进入待复核队列']
      }
    },
    {
      id: 'K-007', type: 'table', subject: '营销客户主表', relation: '包含', object: '客户统一编号', objectType: 'field',
      method: 'import', methodLabel: '批量导入', confidence: 100, source: '营销数据模型.xlsx · 关系表第 25 行', status: '可入图',
      evidence: {
        sourceName: '营销数据模型.xlsx', location: '关系工作表 · 第 25 行',
        quote: 'T_CUST_MAIN 包含字段 CUST_UNIFIED_ID，字段类型 VARCHAR(32)，非空。',
        conclusion: '数据表与字段的包含关系通过结构和唯一性校验。',
        model: '用户批量导入', rule: '模板结构检查 / 数据类型检查', batch: 'IMP-20260811-04',
        trace: ['读取实体工作表', '读取关系工作表', '数据类型校验', '端点引用通过']
      }
    },
    {
      id: 'K-008', type: 'organization', subject: '供电单位', relation: '统计', object: '月度售电量', objectType: 'metric',
      method: 'ai', methodLabel: 'AI 抽取', confidence: 91, source: '营销业务规程 §3.4', status: '可入图',
      evidence: {
        sourceName: '营销业务规程.docx', location: '第 3 章 §3.4 · 第 14 页',
        quote: '各供电单位按自然月汇总本单位售电量，并形成统一报送口径。',
        conclusion: '识别“供电单位 —统计→ 月度售电量”。',
        model: 'GraphExtract-Pro', rule: '组织实体识别 / 指标关系抽取', batch: 'T-20260810-05',
        trace: ['标题层级定位', '组织实体识别', '指标关系抽取', '证据位置绑定']
      }
    },
    {
      id: 'K-009', type: 'object', subject: '电力客户', relation: '签约', object: '供电合同.2026版', objectType: 'object',
      method: 'ai', methodLabel: 'AI 抽取', confidence: 84, source: '供电合同模板 · 第 1 页', status: '待复核',
      evidence: {
        sourceName: '供电合同模板.docx', location: '第 1 页 · 合同主体段',
        quote: '甲方（供电人）与乙方（用电客户）就供用电事项签订本合同。',
        conclusion: '识别客户与合同的签约关系；合同版本实体需要确认。',
        model: 'GraphExtract-Pro', rule: '合同主体识别 / 新概念复核', batch: 'T-20260810-05',
        trace: ['合同版面识别', '甲乙方角色解析', '签约关系生成', '版本实体待确认']
      }
    },
    {
      id: 'K-010', type: 'field', subject: 'sale_qty', relation: '映射到', object: '月度售电量', objectType: 'metric',
      method: 'human', methodLabel: '人工确认', confidence: 100, source: 'SQL 血缘 + 探针校验', status: '可入图',
      evidence: {
        sourceName: 'rpt_sale_month_v2.sql', location: '度量字段 sale_qty · 探针记录 P-028',
        quote: 'SUM(sale_qty) WHERE settle_status = 正式 AND biz_type <> 趸售',
        conclusion: '人工确认物理字段 sale_qty 映射到业务指标“月度售电量”。',
        model: '人工确认', rule: 'SQL 血缘 / 量级与单位探针', batch: 'T-20260810-05',
        trace: ['SQL 度量识别', '字段语义召回', '量级单位探针', '人工确认映射']
      }
    }
  ];

  const typeMeta = [
    ['all', '全部知识', 900],
    ['object', '业务对象', 286],
    ['metric', '业务指标', 164],
    ['organization', '组织机构', 82],
    ['table', '数据表', 154],
    ['field', '数据字段', 214]
  ];

  commitPanel.innerHTML = `
    <div class="ingraph-page">
      <div class="source-banner">
        <span class="source-badge ai">统一入图</span>
        <div><b>抽取结果已合并到入图流程</b><br>AI 抽取、人工确认、批量导入和手工创建的知识均在此复核、追溯证据并确认入图。</div>
      </div>
      <div class="ingraph-summary" aria-label="入图质量与处理指标">
        <article class="ingraph-summary-card"><span>实体完整性</span><b style="color:var(--color-lime-900)">96.8%</b><small>满足质量门槛</small></article>
        <article class="ingraph-summary-card"><span>实体唯一性</span><b style="color:var(--color-lime-900)">99.2%</b><small>重复实体已融合</small></article>
        <article class="ingraph-summary-card"><span>未解决冲突</span><b style="color:var(--color-orange-900)">7</b><small>禁止自动入图</small></article>
        <article class="ingraph-summary-card"><span>可追溯情况</span><b style="color:var(--color-lime-900)">100%</b><small>全部关联来源证据</small></article>
        <article class="ingraph-summary-card"><span>待入图知识</span><b>900</b><small>实体 286 · 关系 614</small></article>
        <article class="ingraph-summary-card"><span>可直接入图</span><b style="color:var(--color-lime-900)">876</b><small>满足当前质量门槛</small></article>
      </div>
      <div class="ingraph-workspace">
        <aside class="ingraph-types" aria-label="实体类型筛选">
          <div class="ingraph-types-head">实体类型</div>
          ${typeMeta.map(([value, label, count], index) => `<button class="ingraph-type ${index === 0 ? 'active' : ''}" data-ingraph-type="${value}">${label}<span>${count}</span></button>`).join('')}
        </aside>
        <section class="ingraph-main">
          <div class="ingraph-head">
            <div class="ingraph-title"><h3 id="ingraphListTitle">全部待入图知识</h3><p>三元组列表与图可视化共享筛选条件和证据数据</p></div>
            <div class="ingraph-view-switch" role="tablist" aria-label="入图结果视图">
              <button class="active" data-ingraph-view="list" role="tab" aria-selected="true">三元组列表</button>
              <button data-ingraph-view="graph" role="tab" aria-selected="false">图可视化</button>
            </div>
          </div>
          <div class="ingraph-view active" data-ingraph-panel="list">
            <div class="ingraph-toolbar">
              <input id="ingraphSearch" placeholder="搜索源实体、目标实体、来源证据" aria-label="搜索待入图知识">
              <select id="ingraphConfidence" aria-label="置信度筛选"><option value="all">全部置信度</option><option value="100">100%</option><option value="90">90% 及以上</option><option value="under90">低于 90%</option></select>
              <select id="ingraphMethod" aria-label="来源方式筛选"><option value="all">全部方式</option><option value="ai">AI 抽取</option><option value="human">人工确认</option><option value="import">批量导入</option><option value="manual">手工创建</option></select>
              <span class="ingraph-selected">已选择 <b id="ingraphSelectedCount">0</b> 条</span>
            </div>
            <div class="ingraph-table-wrap">
              <table class="table ingraph-table" aria-label="待入图三元组列表">
                <thead><tr><th><input type="checkbox" id="ingraphSelectAll" aria-label="选择当前页全部知识"></th><th>源实体</th><th>关系</th><th>目标实体</th><th>方式</th><th>置信度</th><th>来源证据</th></tr></thead>
                <tbody id="ingraphRows"></tbody>
              </table>
            </div>
            <div class="ingraph-pagination">
              <span class="pagination-info" id="ingraphPageInfo"></span>
              <button class="page-button" id="ingraphPrev" aria-label="上一页">‹</button>
              <span id="ingraphPageButtons"></span>
              <button class="page-button" id="ingraphNext" aria-label="下一页">›</button>
              <button class="btn danger" id="rejectIngraph" disabled style="margin-left:10px">拒绝入图</button>
              <button class="btn primary" id="commitGraph" disabled>确认选中项入图</button>
            </div>
          </div>
          <div class="ingraph-view" data-ingraph-panel="graph">
            <div class="ingraph-graph-toolbar">
              <div class="ingraph-legend"><span><i style="background:#2b79ff"></i>业务实体</span><span><i style="background:#8b5cf6"></i>数据实体</span><span><i style="background:#14a58b"></i>组织机构</span></div>
              <span id="ingraphGraphCount"></span>
              <div class="ingraph-graph-actions"><button class="btn sm" id="ingraphZoomOut" aria-label="缩小图谱">－</button><button class="btn sm" id="ingraphZoomFit">适配</button><button class="btn sm" id="ingraphZoomIn" aria-label="放大图谱">＋</button></div>
            </div>
            <div class="ingraph-graph-canvas" id="ingraphGraphCanvas">
              <svg id="ingraphGraphSvg" viewBox="0 0 900 500" role="img" aria-label="待入图知识可视化图谱"></svg>
              <aside class="ingraph-graph-detail" id="ingraphGraphDetail" hidden></aside>
            </div>
          </div>
        </section>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal evidence-modal" id="ingraphEvidenceModal" role="dialog" aria-modal="true" aria-labelledby="ingraphEvidenceTitle">
      <header class="modal-head"><h2 id="ingraphEvidenceTitle">来源证据详情</h2><button class="close" id="closeIngraphEvidence" aria-label="关闭">×</button></header>
      <div class="modal-body" id="ingraphEvidenceBody"></div>
      <footer class="modal-foot"><button class="btn" id="closeIngraphEvidenceFoot">关闭</button><button class="btn primary" id="locateIngraphEvidence">定位原文</button></footer>
    </div>
    <div class="modal" id="rejectIngraphModal" role="alertdialog" aria-modal="true" aria-labelledby="rejectIngraphTitle">
      <header class="modal-head"><h2 id="rejectIngraphTitle">确认拒绝入图</h2><button class="close" id="closeRejectIngraph" aria-label="关闭">×</button></header>
      <div class="modal-body"><div class="delete-warning"><b>选中的知识将不会进入正式图谱。</b>本次拒绝只处理当前任务中的待入图结果，不会删除原始数据资源和来源证据。</div><div class="delete-resource-name">即将拒绝：<b id="rejectIngraphCount">0</b> 条知识</div></div>
      <footer class="modal-foot"><button class="btn" id="cancelRejectIngraph">取消</button><button class="btn danger-solid" id="confirmRejectIngraph">确认拒绝入图</button></footer>
    </div>`);

  const typeLabel = Object.fromEntries(typeMeta.map(([value, label]) => [value, label]));
  const selectedIds = new Set();
  let activeType = 'all';
  let activeView = 'list';
  let page = 1;
  const pageSize = 6;
  let graphScale = 1;

  const methodClass = method => method === 'ai' ? 'ai' : method === 'import' ? 'import' : 'human';
  const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

  function filteredRows() {
    const keyword = $('#ingraphSearch').value.trim().toLowerCase();
    const confidence = $('#ingraphConfidence').value;
    const method = $('#ingraphMethod').value;
    return knowledgeRows.filter(row => {
      const typeMatched = activeType === 'all' || row.type === activeType || row.objectType === activeType;
      const keywordMatched = !keyword || [row.subject, row.relation, row.object, row.source, row.methodLabel].some(value => value.toLowerCase().includes(keyword));
      const confidenceMatched = confidence === 'all' || confidence === '100' && row.confidence === 100 || confidence === '90' && row.confidence >= 90 || confidence === 'under90' && row.confidence < 90;
      return typeMatched && keywordMatched && confidenceMatched && (method === 'all' || row.method === method);
    });
  }

  function visibleRows() {
    return filteredRows().slice((page - 1) * pageSize, page * pageSize);
  }

  function renderList() {
    const rows = filteredRows();
    const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
    page = Math.min(page, pageCount);
    const visible = visibleRows();
    $('#ingraphRows').innerHTML = visible.length ? visible.map(row => `
      <tr data-knowledge-id="${row.id}">
        <td><input class="ingraph-check" type="checkbox" data-id="${row.id}" ${selectedIds.has(row.id) ? 'checked' : ''} aria-label="选择 ${escapeHtml(row.subject)} ${escapeHtml(row.relation)} ${escapeHtml(row.object)}"></td>
        <td><span class="ingraph-node">${escapeHtml(row.subject)}</span></td>
        <td><span class="ingraph-relation">${escapeHtml(row.relation)}</span></td>
        <td><span class="ingraph-node">${escapeHtml(row.object)}</span></td>
        <td><span class="source-badge ${methodClass(row.method)}">${escapeHtml(row.methodLabel)}</span></td>
        <td class="confidence-value ${row.confidence < 90 ? 'pending' : 'confidence'}">${row.confidence}%</td>
        <td><button class="ingraph-evidence" data-evidence="${row.id}">${escapeHtml(row.source)} →</button></td>
      </tr>`).join('') : '<tr><td colspan="7"><div class="empty" style="padding:48px 20px"><h2>没有匹配的待入图知识</h2><p>请调整实体类型或筛选条件。</p></div></td></tr>';
    $('#ingraphPageInfo').textContent = `共 ${rows.length} 条 · 每页 ${pageSize} 条`;
    $('#ingraphPrev').disabled = page === 1;
    $('#ingraphNext').disabled = page === pageCount;
    $('#ingraphPageButtons').innerHTML = Array.from({ length: pageCount }, (_, index) => `<button class="page-button ${index + 1 === page ? 'active' : ''}" data-ingraph-page="${index + 1}">${index + 1}</button>`).join('');
    $$('[data-ingraph-page]').forEach(button => button.onclick = () => { page = Number(button.dataset.ingraphPage); renderList(); });
    $$('.ingraph-check').forEach(check => check.onchange = () => {
      check.checked ? selectedIds.add(check.dataset.id) : selectedIds.delete(check.dataset.id);
      updateSelection();
    });
    $$('.ingraph-evidence').forEach(button => button.onclick = () => openEvidence(button.dataset.evidence));
    updateSelection();
  }

  function updateSelection() {
    const visible = visibleRows();
    const selectedVisible = visible.filter(row => selectedIds.has(row.id)).length;
    $('#ingraphSelectedCount').textContent = selectedIds.size;
    $('#commitGraph').disabled = selectedIds.size === 0;
    $('#rejectIngraph').disabled = selectedIds.size === 0;
    $('#ingraphSelectAll').checked = visible.length > 0 && selectedVisible === visible.length;
    $('#ingraphSelectAll').indeterminate = selectedVisible > 0 && selectedVisible < visible.length;
  }

  function openEvidence(id) {
    const row = knowledgeRows.find(item => item.id === id);
    if (!row) return;
    const e = row.evidence;
    $('#ingraphEvidenceTitle').textContent = `${row.subject} —${row.relation}→ ${row.object}`;
    $('#ingraphEvidenceBody').innerHTML = `
      <div class="evidence-summary">
        <div><span>来源方式</span><b>${escapeHtml(row.methodLabel)}</b></div>
        <div><span>置信度</span><b>${row.confidence}%</b></div>
        <div><span>构图批次</span><b>${escapeHtml(e.batch)}</b></div>
        <div><span>处理状态</span><b>${escapeHtml(row.status)}</b></div>
      </div>
      <section class="evidence-section"><h3>原始证据内容</h3><div class="evidence-quote">${escapeHtml(e.quote)}</div><div class="evidence-location">${escapeHtml(e.sourceName)} · ${escapeHtml(e.location)}</div></section>
      <section class="evidence-section"><h3>系统识别结论</h3><div class="task-confirm">${escapeHtml(e.conclusion)}<br><span class="task-meta">处理模型：${escapeHtml(e.model)}　·　校验策略：${escapeHtml(e.rule)}</span></div></section>
      <section class="evidence-section"><h3>证据处理轨迹</h3><div class="evidence-trace">${e.trace.map((item, index) => `<div><b>${index + 1}. ${escapeHtml(item)}</b>${index === e.trace.length - 1 ? '形成当前待入图结果' : '处理完成并传递到下一步'}</div>`).join('')}</div></section>`;
    window.openModal('#ingraphEvidenceModal');
  }

  const graphNodes = [
    ['供电台区', 390, 250, 'object'], ['月度售电量', 620, 175, 'metric'], ['电力客户', 150, 275, 'object'],
    ['供电服务中心', 300, 85, 'organization'], ['营销客户主表', 690, 315, 'table'], ['电网线路', 340, 420, 'object'],
    ['变电站', 125, 410, 'object'], ['线路负载率', 550, 430, 'metric'], ['客户统一编号', 790, 410, 'field'],
    ['供电单位', 520, 70, 'organization'], ['供电合同.2026版', 70, 145, 'object'], ['sale_qty', 790, 125, 'field']
  ].map(([id, x, y, type]) => ({ id, x, y, type }));

  const nodeColor = type => type === 'table' || type === 'field' ? '#8b5cf6' : type === 'organization' ? '#14a58b' : '#2b79ff';
  const nodeRadius = type => type === 'object' ? 25 : type === 'metric' ? 22 : 19;

  function renderGraph() {
    const rows = filteredRows();
    const usedIds = new Set(rows.flatMap(row => [row.subject, row.object]));
    const nodes = graphNodes.filter(node => usedIds.has(node.id));
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    const edges = rows.filter(row => nodeMap.has(row.subject) && nodeMap.has(row.object));
    const edgeMarkup = edges.map(row => {
      const start = nodeMap.get(row.subject), end = nodeMap.get(row.object);
      const mx = (start.x + end.x) / 2, my = (start.y + end.y) / 2;
      return `<line class="ingraph-edge" x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}"></line><text class="ingraph-edge-label" x="${mx}" y="${my - 5}">${escapeHtml(row.relation)}</text>`;
    }).join('');
    const nodeMarkup = nodes.map(node => `<g class="ingraph-graph-node" data-node-id="${escapeHtml(node.id)}"><circle cx="${node.x}" cy="${node.y}" r="${nodeRadius(node.type)}" fill="${nodeColor(node.type)}"></circle><text class="ingraph-node-label" x="${node.x}" y="${node.y + nodeRadius(node.type) + 17}">${escapeHtml(node.id.length > 12 ? node.id.slice(0, 11) + '…' : node.id)}</text></g>`).join('');
    $('#ingraphGraphSvg').innerHTML = `<defs><marker id="ingraphArrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#9aabc0"></path></marker></defs><g id="ingraphZoomLayer">${edgeMarkup}${nodeMarkup}</g>`;
    $('#ingraphGraphCount').textContent = `当前显示 ${nodes.length} 个实体 · ${edges.length} 条关系`;
    applyGraphScale();
    $$('.ingraph-graph-node').forEach(node => node.onclick = () => showNodeDetail(node.dataset.nodeId));
  }

  function applyGraphScale() {
    const layer = $('#ingraphZoomLayer');
    if (layer) layer.setAttribute('transform', `translate(450 250) scale(${graphScale}) translate(-450 -250)`);
  }

  function showNodeDetail(nodeId) {
    $$('.ingraph-graph-node').forEach(node => node.classList.toggle('active', node.dataset.nodeId === nodeId));
    const related = filteredRows().filter(row => row.subject === nodeId || row.object === nodeId);
    const detail = $('#ingraphGraphDetail');
    const node = graphNodes.find(item => item.id === nodeId);
    detail.hidden = false;
    detail.innerHTML = `<h4>${escapeHtml(nodeId)}</h4><span class="pill">${escapeHtml(typeLabel[node?.type] || '业务对象')}</span><p>关联 ${related.length} 条待入图关系</p>${related.slice(0, 4).map(row => `<p><b>${escapeHtml(row.subject)}</b> —${escapeHtml(row.relation)}→ <b>${escapeHtml(row.object)}</b></p>`).join('')}${related[0] ? `<button class="btn sm primary" id="openNodeEvidence">查看来源证据</button>` : ''}`;
    const button = $('#openNodeEvidence');
    if (button) button.onclick = () => openEvidence(related[0].id);
  }

  function refresh() {
    page = 1;
    $('#ingraphListTitle').textContent = activeType === 'all' ? '全部待入图知识' : `${typeLabel[activeType]}待入图知识`;
    renderList();
    if (activeView === 'graph') renderGraph();
  }

  $$('.ingraph-type').forEach(button => button.onclick = () => {
    $$('.ingraph-type').forEach(item => item.classList.toggle('active', item === button));
    activeType = button.dataset.ingraphType;
    refresh();
  });

  $$('[data-ingraph-view]').forEach(button => button.onclick = () => {
    activeView = button.dataset.ingraphView;
    $$('[data-ingraph-view]').forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-selected', String(selected));
    });
    $$('[data-ingraph-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.ingraphPanel === activeView));
    if (activeView === 'graph') renderGraph();
  });

  $('#ingraphSearch').oninput = refresh;
  $('#ingraphConfidence').onchange = refresh;
  $('#ingraphMethod').onchange = refresh;
  $('#ingraphPrev').onclick = () => { if (page > 1) { page--; renderList(); } };
  $('#ingraphNext').onclick = () => { const pages = Math.ceil(filteredRows().length / pageSize); if (page < pages) { page++; renderList(); } };
  $('#ingraphSelectAll').onchange = event => {
    visibleRows().forEach(row => event.target.checked ? selectedIds.add(row.id) : selectedIds.delete(row.id));
    renderList();
  };
  $('#commitGraph').onclick = () => {
    window.toast(`已提交 ${selectedIds.size} 条选中知识入图`);
    selectedIds.clear();
    renderList();
  };
  $('#rejectIngraph').onclick = () => {
    $('#rejectIngraphCount').textContent = selectedIds.size;
    window.openModal('#rejectIngraphModal');
  };
  $('#closeRejectIngraph').onclick = window.closeModal;
  $('#cancelRejectIngraph').onclick = window.closeModal;
  $('#confirmRejectIngraph').onclick = () => {
    const rejectedCount = selectedIds.size;
    for (let index = knowledgeRows.length - 1; index >= 0; index -= 1) {
      if (selectedIds.has(knowledgeRows[index].id)) knowledgeRows.splice(index, 1);
    }
    selectedIds.clear();
    window.closeModal();
    refresh();
    window.toast(`已拒绝 ${rejectedCount} 条知识入图`);
  };
  $('#ingraphZoomIn').onclick = () => { graphScale = Math.min(1.6, graphScale + .15); applyGraphScale(); };
  $('#ingraphZoomOut').onclick = () => { graphScale = Math.max(.65, graphScale - .15); applyGraphScale(); };
  $('#ingraphZoomFit').onclick = () => { graphScale = 1; applyGraphScale(); };
  $('#closeIngraphEvidence').onclick = window.closeModal;
  $('#closeIngraphEvidenceFoot').onclick = window.closeModal;
  $('#locateIngraphEvidence').onclick = () => window.toast('已定位到对应文档页码与切片位置');

  renderList();
})();
