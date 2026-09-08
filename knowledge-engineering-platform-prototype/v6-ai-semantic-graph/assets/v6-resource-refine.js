(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const visualizationNav = $$('.top-nav button').find(button => button.textContent.trim() === '图谱可视化');
  if (visualizationNav) visualizationNav.onclick = () => { window.location.href = 'graph-visualization.html'; };

  const resourcePage = $('#resourcesPage');
  if (resourcePage) {
    const description = $('.page-head p', resourcePage);
    const listDescription = $('.section-head > span', resourcePage);
    const overview = $(':scope > .overview-grid', resourcePage);
    if (description) description.textContent = '统一查看文档、数据表和外部数据源的解析状态及图谱关联';
    if (listDescription) listDescription.textContent = '查看资源解析情况、来源方式和图谱关联结果';
    const parsingMetric = $$('.stat', overview).find(stat => stat.textContent.includes('正在解析'));
    parsingMetric?.remove();
    overview?.classList.add('resource-overview-three');
  }

  // Keep only the resource count below each task name.
  $$('#workspacePage .task-row .task-meta').forEach(meta => {
    const text = meta.textContent;
    const resourceCount = text.match(/\d+\s*项资源/) || text.match(/\d+\s*个文件/);
    if (resourceCount) meta.textContent = resourceCount[0];
  });

  // Remove redundant helper labels from overview, fusion and ingestion panels.
  const attentionSort = $$('#workspacePage .section-head > span').find(span => span.textContent.trim() === '按影响程度排序');
  attentionSort?.remove();
  $$('.fusion-side-title span').forEach(span => {
    if (span.textContent.trim() === '图本体') span.remove();
  });
  $('.ingraph-types-head')?.remove();
  $('#appendResource')?.remove();

  // Task detail retains creation time only.
  const taskDetailMeta = $('#taskPage .detail-title p');
  if (taskDetailMeta) taskDetailMeta.textContent = '创建于 2026-08-10 09:20';

  // Entity comparison groups start collapsed and use a persistent highlighted toggle.
  $$('.compare-group').forEach(group => group.classList.remove('expanded'));
  $$('.show-compare').forEach(button => {
    button.classList.add('primary');
    button.textContent = '展开';
    button.addEventListener('click', () => {
      requestAnimationFrame(() => {
        button.textContent = button.closest('.compare-group')?.classList.contains('expanded') ? '收起' : '展开';
      });
    });
  });

  const firstTaskPanel = $('#newTaskModal [data-new-panel="1"]');
  if (!firstTaskPanel) return;
  const choices = $$('.source-box', firstTaskPanel);
  const systemChoice = choices.find(button => button.textContent.includes('从系统中选择'));
  const bulkKnowledgeChoice = choices.find(button => button.textContent.includes('批量导入实体知识集'));
  if (bulkKnowledgeChoice) bulkKnowledgeChoice.remove();

  if (systemChoice) {
    systemChoice.id = 'newTaskChooseSystem';
    systemChoice.onclick = () => {
      window.closeModal();
      const firstTab = $('.system-tab[data-system-tab="businessObject"]') || $('.system-tab');
      $$('.system-tab').forEach(tab => tab.classList.toggle('active', tab === firstTab));
      firstTab?.click();
      const search = $('#systemResourceSearch');
      if (search) search.value = '';
      window.openModal('#systemResourceModal');
    };
  }

  function returnToTaskResources(message) {
    window.closeModal();
    window.openModal('#newTaskModal');
    const summary = $('#newResourceSummary');
    if (summary && message) summary.innerHTML = message;
  }

  const cancelSystem = $('#cancelSystemResources');
  if (cancelSystem) cancelSystem.onclick = () => returnToTaskResources();
  const confirmSystem = $('#confirmSystemResources');
  if (confirmSystem) confirmSystem.onclick = () => {
    const count = Number($('#systemSelectedCount')?.textContent || 0);
    const names = $$('.system-resource-check:checked').map(input => input.dataset.name);
    returnToTaskResources(`<b>已从系统选择 ${count} 项资源</b><br>${names.length ? names.join('、') : '已保留跨分类选择的系统资源'}`);
    window.toast('系统资源已加入当前构图任务');
  };
})();

/* Browser review round: workspace layout, task pagination and resource-state rules. */
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function addCompletedTask() {
    const taskList = $('#workspacePage .task-list');
    if (!taskList || $('[data-task-id="T-20260812-06"]', taskList)) return;
    const attention = taskList.querySelector(':scope > .section');
    const task = document.createElement('div');
    task.className = 'task-row';
    task.dataset.taskState = 'done';
    task.dataset.taskId = 'T-20260812-06';
    task.innerHTML = `
      <div>
        <button class="task-name open-task" type="button">客户服务知识构图</button>
        <div class="task-meta">4 项资源</div>
      </div>
      <span class="status done"><i class="dot"></i>可入图</span>
      <div>
        <div class="progress"><i style="width:100%;background:var(--color-lime-900)"></i></div>
        <div class="progress-text">任务已完成</div>
      </div>
      <div class="result-mini">实体 <b>168</b><br>关系 <b>326</b></div>
      <div>08-12</div>
      <button class="task-action open-task" type="button" data-open-tab="commit">查看结果</button>`;
    $$('.open-task', task).forEach(button => {
      button.onclick = () => window.openTask?.(button.dataset.openTab || 'commit');
    });
    if (attention) taskList.insertBefore(task, attention);
    else taskList.append(task);
  }

  function refineTaskListCopy() {
    const title = $('#workspacePage > .section > .section-head > h2');
    if (title) title.textContent = '任务列表';
  }

  function refineFailedTask() {
    const taskList = $('#workspacePage .task-list');
    if (!taskList) return;
    const failedRow = $$('.task-row', taskList).find(row =>
      row.dataset.taskState === 'error' && row.textContent.includes('历史项目资料补充')
    );
    if (!failedRow) return;

    const status = $('.status', failedRow);
    const progress = $('.progress i', failedRow);
    const progressText = $('.progress-text', failedRow);
    const result = $('.result-mini', failedRow);
    const stateHint = failedRow.children[4];
    const action = $('.task-action', failedRow);
    if (!status || !progress || !progressText || !result || !stateHint || !action) return;

    const originalDetailHandler = action.onclick;
    failedRow.dataset.taskState = 'failed';
    status.className = 'status err';
    status.innerHTML = '<i class="dot"></i>任务失败';
    progress.style.background = 'var(--color-red-900)';
    progressText.textContent = '任务执行失败';
    stateHint.className = 'pending';
    stateHint.textContent = '可重新运行';
    action.textContent = '重新运行任务';
    action.removeAttribute('data-open-tab');
    action.title = '复用原数据资源和构图配置重新执行任务';
    const firstTask = $('.task-row', taskList);
    if (firstTask && firstTask !== failedRow) firstTask.after(failedRow);

    action.onclick = () => {
      failedRow.dataset.taskState = 'running';
      status.className = 'status run';
      status.innerHTML = '<i class="dot"></i>AI 构图中';
      progress.style.width = '8%';
      progress.style.background = 'var(--color-primary-900)';
      progressText.textContent = '资源检查与解析 · 8%';
      result.innerHTML = '实体 <b>0</b><br>关系 <b>0</b>';
      stateHint.className = '';
      stateHint.style.color = 'var(--color-primary-900)';
      stateHint.textContent = '已重新运行';
      action.textContent = '查看详情';
      action.removeAttribute('title');
      action.onclick = originalDetailHandler || (() => window.openTask?.('overview'));
      taskList.prepend(failedRow);

      const runningMetric = $('#workspacePage .overview-grid .stat:first-child');
      const metricValue = $(':scope > b', runningMetric);
      const metricHint = $(':scope > small', runningMetric);
      if (metricValue) metricValue.textContent = '2';
      if (metricHint) metricHint.textContent = '2 个任务正在运行';
      window.toast('任务已重新运行，将复用原数据资源和构图配置');
    };
  }

  function refineWorkspace() {
    const workspace = $('#workspacePage');
    const pageHead = workspace?.querySelector(':scope > .page-head');
    const pageActions = $('.page-actions', pageHead);
    const topActions = $('.top-actions');
    const overview = workspace?.querySelector(':scope > .overview-grid');
    const taskList = workspace?.querySelector(':scope > .section .task-list');
    const taskSection = taskList?.closest('.section');
    const attention = taskList?.querySelector(':scope > .section');
    if (!workspace || !overview || !taskList || !taskSection || !attention) return;

    $('.avatar', topActions)?.remove();
    const accountName = $(':scope > span', topActions);
    if (accountName?.textContent.trim() === 'Admin') accountName.remove();
    if (pageActions && topActions) {
      pageActions.classList.add('top-workspace-actions');
      topActions.prepend(pageActions);
    }
    pageHead?.remove();

    const summaryRow = document.createElement('div');
    summaryRow.className = 'workspace-summary-row';
    taskSection.before(summaryRow);
    summaryRow.append(overview, attention);
    attention.classList.add('attention-section');

    const runtimeStatus = $('#taskRuntimeStatus');
    if (runtimeStatus) {
      runtimeStatus.classList.add('loading-status');
      const dot = $('.dot', runtimeStatus);
      if (dot) dot.className = 'status-spinner';
    }

    const pagination = document.createElement('nav');
    pagination.className = 'task-pagination';
    pagination.setAttribute('aria-label', '当前任务分页');
    taskSection.append(pagination);

    const filterButtons = $$('.section-head .seg button', taskSection);
    let activeFilter = 'all';
    let currentPage = 1;
    const pageSize = 3;

    function matchesFilter(row) {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'running') return row.dataset.taskState === 'running';
      return ['pending', 'error', 'failed', 'stopped'].includes(row.dataset.taskState);
    }

    function renderTasks() {
      const rows = $$('.task-row', taskList).filter(row => row.parentElement === taskList);
      const filtered = rows.filter(matchesFilter);
      const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
      currentPage = Math.min(currentPage, pages);
      rows.forEach(row => { row.hidden = true; });
      filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).forEach(row => { row.hidden = false; });

      pagination.innerHTML = '';
      const count = document.createElement('span');
      count.className = 'task-pagination-count';
      count.textContent = `共 ${filtered.length} 条`;
      pagination.append(count);

      const previous = document.createElement('button');
      previous.className = 'task-page-button';
      previous.textContent = '‹';
      previous.disabled = currentPage === 1;
      previous.setAttribute('aria-label', '上一页');
      previous.onclick = () => { currentPage -= 1; renderTasks(); };
      pagination.append(previous);

      for (let page = 1; page <= pages; page += 1) {
        const button = document.createElement('button');
        button.className = `task-page-button${page === currentPage ? ' active' : ''}`;
        button.textContent = String(page);
        button.setAttribute('aria-label', `第 ${page} 页`);
        button.onclick = () => { currentPage = page; renderTasks(); };
        pagination.append(button);
      }

      const next = document.createElement('button');
      next.className = 'task-page-button';
      next.textContent = '›';
      next.disabled = currentPage === pages;
      next.setAttribute('aria-label', '下一页');
      next.onclick = () => { currentPage += 1; renderTasks(); };
      pagination.append(next);
    }

    filterButtons.forEach(button => button.addEventListener('click', () => {
      const label = button.textContent.trim();
      activeFilter = label === '运行中' ? 'running' : label === '待处理' ? 'pending' : 'all';
      currentPage = 1;
      renderTasks();
    }));
    new MutationObserver(renderTasks).observe(taskList, { childList: true });
    renderTasks();
  }

  function refineTaskDocuments() {
    const panel = $('[data-panel="documents"]');
    $('.doc-toolbar select', panel)?.remove();
    const rows = $$('tbody tr', panel);
    const completionTimes = [
      '2026-08-10 10:38:00',
      '2026-08-10 10:42:00',
      '2026-08-10 10:30:00',
      '2026-08-10 10:24:00'
    ];
    rows.forEach((row, index) => {
      if (row.children[4] && completionTimes[index]) row.children[4].textContent = completionTimes[index];
    });

    const failedRow = rows.find(row => row.textContent.includes('文件失败'));
    const retryButton = failedRow?.querySelector('td:last-child button');
    if (failedRow && retryButton) {
      const extractionCell = failedRow.children[3];
      const completionCell = failedRow.children[4];
      retryButton.textContent = '重新解析';
      retryButton.classList.remove('danger');
      retryButton.onclick = () => {
        if (extractionCell) extractionCell.textContent = '等待重新抽取';
        if (completionCell) completionCell.textContent = '2026-08-10 10:45:00';
        retryButton.textContent = '解析中';
        retryButton.disabled = true;
        window.toast('已重新提交解析任务');
      };
    }

    const table = $('table', panel);
    const headerCells = $$('thead th', table);
    [2, 1].forEach(index => headerCells[index]?.remove());
    rows.forEach(row => {
      [2, 1].forEach(index => row.children[index]?.remove());
    });
    headerCells.at(-1)?.remove();
    rows.forEach(row => row.lastElementChild?.remove());
  }

  function refineDocumentDetailModal() {
    const detailGrid = $('#docModal .doc-detail-grid');
    if (!detailGrid) return;
    $('.doc-outline', detailGrid)?.remove();
    $('.doc-info', detailGrid)?.remove();
    detailGrid.classList.add('is-content-only');
  }

  function refineNewTaskFooter() {
    const modal = $('#newTaskModal');
    const previous = $('#newPrev');
    if (!modal || !previous) return;
    $('#usePromptTemplate', modal)?.remove();
    $('#savePromptTemplate', modal)?.remove();
    const sync = () => {
      previous.hidden = Boolean($('[data-new-panel="1"].active', modal));
    };
    new MutationObserver(sync).observe(modal, { subtree: true, attributes: true, attributeFilter: ['class'] });
    sync();
  }

  function refineNewTaskResourcePanel() {
    const panel = $('#newTaskModal [data-new-panel="1"]');
    if (!panel) return;
    const sourceChoice = $('.source-choice', panel);
    const choices = $$('.source-box', sourceChoice);
    const systemChoice = $('#newTaskChooseSystem', panel) || choices.find(choice => choice.textContent.includes('从系统中选择'));
    const uploadChoice = choices.find(choice => choice.textContent.includes('上传文件'));

    $(':scope > .drop', panel)?.remove();
    $('#newResourceSummary', panel)?.remove();

    if (systemChoice) {
      systemChoice.classList.add('new-source-card');
      const description = $('p', systemChoice);
      if (description) description.textContent = '业务对象、业务规则、数据表、知识库或插件';
      systemChoice.insertAdjacentHTML('beforeend', `
        <div class="new-source-stats" aria-label="已添加系统资源统计">
          <div><span>业务对象</span><b data-new-system-count="businessObject">0</b></div>
          <div><span>业务规则</span><b data-new-system-count="businessRule">0</b></div>
          <div><span>数据表</span><b data-new-system-count="table">0</b></div>
          <div><span>知识库</span><b data-new-system-count="kb">0</b></div>
          <div><span>插件</span><b data-new-system-count="plugin">0</b></div>
        </div>`);
    }

    if (uploadChoice) {
      uploadChoice.classList.add('new-source-card');
      uploadChoice.insertAdjacentHTML('beforeend', '<div class="new-upload-feedback" id="newTaskFileFeedback"><span>暂未上传文件</span></div>');
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.id = 'newTaskFileInput';
      fileInput.multiple = true;
      fileInput.accept = '.doc,.docx,.pdf,.md,.markdown,.txt,.xls,.xlsx,.csv,.zip,.rar,.7z';
      fileInput.hidden = true;
      panel.append(fileInput);
      uploadChoice.onclick = () => {
        fileInput.value = '';
        fileInput.click();
      };
      fileInput.onchange = event => {
        const files = [...event.target.files];
        const feedback = $('#newTaskFileFeedback');
        if (!feedback || !files.length) return;
        feedback.innerHTML = '';
        files.forEach(file => {
          const size = file.size >= 1048576 ? `${(file.size / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`;
          const item = document.createElement('div');
          item.className = 'new-upload-file';
          const icon = document.createElement('span');
          icon.textContent = '文';
          const name = document.createElement('b');
          name.textContent = file.name;
          const meta = document.createElement('small');
          meta.textContent = size;
          item.append(icon, name, meta);
          feedback.append(item);
        });
        window.toast(`已选择 ${files.length} 个文件`);
      };
    }
  }

  function refineResourceTable() {
    const rows = $$('#resourcesPage [data-resource-row]');
    const accessTimes = [
      '2026-08-10 10:38:00',
      '2026-08-10 10:42:00',
      '2026-08-09 16:20:00',
      '2026-08-08 08:00:00'
    ];

    rows.forEach((row, index) => {
      $('.task-meta', row.children[1])?.remove();
      if (accessTimes[index] && row.children[5]) row.children[5].textContent = accessTimes[index];

      const statusText = row.children[3]?.textContent.trim() || '';
      const actions = $('.row-actions', row);
      const deleteButton = $('.delete-resource', row);
      if (!actions || !deleteButton) return;

      if (statusText.includes('解析中')) {
        $$('button:not(.delete-resource)', actions).forEach(button => button.remove());
        deleteButton.disabled = true;
        deleteButton.classList.add('is-disabled');
        deleteButton.title = '解析完成或解析失败后可删除';
      } else {
        deleteButton.disabled = false;
        deleteButton.classList.remove('is-disabled');
        deleteButton.removeAttribute('title');
        const detailButton = $$('button:not(.delete-resource)', actions).find(button => button.textContent.trim() === '查看详情');
        if (detailButton && !detailButton.classList.contains('open-doc')) {
          detailButton.onclick = () => window.openModal('#docModal');
        }
      }
    });

    const importedSource = rows[2]?.children[2]?.querySelector('.source-mode');
    if (importedSource) {
      importedSource.textContent = '文档上传';
      importedSource.classList.remove('import');
      importedSource.classList.add('upload');
    }
  }

  function buildResourceCategoryTabs() {
    const page = $('#resourcesPage');
    const tabs = $('.resource-seg', page);
    const tableWrap = $('.resource-table', page);
    const tableBody = $('.resource-table tbody', page);
    const tableHeaders = $$('.resource-table thead th', page);
    const selectAll = $('input[type="checkbox"]', tableHeaders[0]);
    const bulkBar = $('#bulkBar', page);
    const search = $('.resource-toolbar .search-box input', page);
    const toolbarSelects = $$('.resource-toolbar .select', page);
    const statusFilterControl = toolbarSelects.find(select => select.textContent.includes('解析状态'));
    const graphFilterControl = toolbarSelects.find(select => select.textContent.includes('构图状态'));
    if (!page || !tabs || !tableWrap || !tableBody || !search) return;
    search.placeholder = '搜索资源名称、来源或关联任务';
    if (tableHeaders[3]) tableHeaders[3].textContent = '抽取结果';
    if (tableHeaders[4]) tableHeaders[4].textContent = '入图情况';
    if (tableHeaders[6]) tableHeaders[6].textContent = '关联任务';
    statusFilterControl?.remove();
    if (graphFilterControl) graphFilterControl.innerHTML = '<option>全部入图情况</option><option>已入图</option><option>部分入图</option>';

    const categories = [
      ['all', '全部'],
      ['document', '文档'],
      ['knowledgeBase', '知识库'],
      ['dataTable', '数据表'],
      ['businessObject', '业务对象'],
      ['businessRule', '业务规则'],
      ['plugin', '插件']
    ];
    const resourceCatalog = {
      document: [
        { name: '营销业务规程.docx', source: '文档上传', sourceClass: 'upload', status: '解析完成', statusClass: 'done', graph: '42 实体 / 68 关系', time: '2026-08-10 10:38:00', entities: 42, relations: 68, tasks: 3, detail: 'document' },
        { name: '指标口径说明.pdf', source: '文档上传', sourceClass: 'upload', status: '解析中 68%', statusClass: 'run', graph: '尚未入图', time: '2026-08-10 10:42:00', entities: 0, relations: 0, tasks: 1 },
        { name: '历史项目资料.zip', source: '文档上传', sourceClass: 'upload', status: '解析失败', statusClass: 'err', graph: '尚未入图', time: '2026-08-09 18:16:00', entities: 0, relations: 0, tasks: 1, retry: true }
      ],
      knowledgeBase: [
        { name: '企业术语知识库', source: '系统接入', sourceClass: 'system', status: '同步完成', statusClass: 'done', graph: '386 实体 / 742 关系', time: '2026-08-09 16:20:00', entities: 386, relations: 742, tasks: 4 },
        { name: '电力行业标准知识库', source: '系统接入', sourceClass: 'system', status: '同步完成', statusClass: 'done', graph: '218 实体 / 436 关系', time: '2026-08-08 11:06:00', entities: 218, relations: 436, tasks: 2 }
      ],
      dataTable: [
        { name: '客户主数据表', source: '系统接入', sourceClass: 'system', status: '同步完成', statusClass: 'done', graph: '1,286 实体 / 3,410 关系', time: '2026-08-08 08:00:00', entities: 1286, relations: 3410, tasks: 5 },
        { name: '营销主题数据表', source: '系统接入', sourceClass: 'system', status: '同步中 42%', statusClass: 'run', graph: '尚未入图', time: '2026-08-07 14:30:00', entities: 0, relations: 0, tasks: 1 }
      ],
      businessObject: [
        { name: '客户', source: '系统接入', sourceClass: 'system', status: '同步完成', statusClass: 'done', graph: '628 实体 / 1,204 关系', time: '2026-08-07 10:20:00', entities: 628, relations: 1204, tasks: 6 },
        { name: '变电站', source: '系统接入', sourceClass: 'system', status: '同步完成', statusClass: 'done', graph: '186 实体 / 420 关系', time: '2026-08-06 17:42:00', entities: 186, relations: 420, tasks: 3 }
      ],
      businessRule: [
        { name: '供电服务响应规则', source: '系统接入', sourceClass: 'system', status: '同步完成', statusClass: 'done', graph: '24 实体 / 56 关系', time: '2026-08-06 15:18:00', entities: 24, relations: 56, tasks: 2 },
        { name: '数据质量管理规则', source: '系统接入', sourceClass: 'system', status: '同步完成', statusClass: 'done', graph: '18 实体 / 38 关系', time: '2026-08-05 09:46:00', entities: 18, relations: 38, tasks: 2 }
      ],
      plugin: [
        { name: 'SQL 解析插件', source: '系统接入', sourceClass: 'system', status: '连接正常', statusClass: 'done', graph: '已启用 · 关联 3 个任务', time: '2026-08-05 08:30:00', entities: 0, relations: 0, tasks: 3 },
        { name: '文档结构化插件', source: '系统接入', sourceClass: 'system', status: '连接正常', statusClass: 'done', graph: '已启用 · 关联 5 个任务', time: '2026-08-04 16:12:00', entities: 0, relations: 0, tasks: 5 }
      ]
    };
    const definitionDetails = {
      '客户': { code: 'BO-10001', domain: '市场营销', description: '描述电力服务中的客户主体及其统一身份、用电关系和服务信息。', contentLabel: '核心属性', content: '客户统一编号、客户名称、客户类型、所属供电单位、服务状态' },
      '变电站': { code: 'BO-10008', domain: '设备运维', description: '描述承担电压变换、电能汇集和分配职责的电力设施。', contentLabel: '核心属性', content: '变电站编码、变电站名称、电压等级、所属单位、运行状态' },
      '供电服务响应规则': { code: 'BR-2003', domain: '市场营销', description: '定义供电服务诉求在不同等级和业务场景下的响应时限。', contentLabel: '规则内容', content: '当服务等级为紧急时，受理后 30 分钟内响应；一般诉求在 2 小时内响应。' },
      '数据质量管理规则': { code: 'BR-2032', domain: '企业管理', description: '定义数据完整性、唯一性和一致性问题的识别与处置要求。', contentLabel: '规则内容', content: '关键字段完整率低于 98% 或主键重复率高于 0.1% 时，生成质量问题并进入治理流程。' }
    };
    if (!$('#resourceDefinitionModal')) {
      document.body.insertAdjacentHTML('beforeend', `
        <div class="modal wide resource-definition-modal" id="resourceDefinitionModal" role="dialog" aria-modal="true" aria-labelledby="resourceDefinitionTitle">
          <header class="modal-head"><h2 id="resourceDefinitionTitle">查看资源</h2><button class="close resource-definition-close" type="button" aria-label="关闭">×</button></header>
          <div class="modal-body">
            <div class="resource-definition-summary"><span class="tag tag-status tag-status-blue" id="resourceDefinitionType"></span><div><b id="resourceDefinitionName"></b><p>来源：系统接入 · 外部独立管理模块</p></div></div>
            <dl class="resource-definition-grid"><div><dt>资源编码</dt><dd id="resourceDefinitionCode"></dd></div><div><dt>业务域</dt><dd id="resourceDefinitionDomain"></dd></div><div><dt>管理状态</dt><dd>已发布</dd></div><div><dt>入图情况</dt><dd>已入图</dd></div></dl>
            <section class="resource-definition-section"><h3>定义说明</h3><p id="resourceDefinitionDescription"></p></section>
            <section class="resource-definition-section"><h3 id="resourceDefinitionContentLabel"></h3><p id="resourceDefinitionContent"></p></section>
          </div>
          <footer class="modal-foot"><button class="btn btn-medium btn-secondary resource-definition-close" type="button">关闭</button></footer>
        </div>`);
      $$('.resource-definition-close').forEach(button => { button.onclick = () => window.closeModal(); });
    }
    let activeCategory = 'all';
    let pendingDelete = null;
    let currentPage = 1;
    const pageSize = 8;
    const selectedResources = new Set();
    const taskNames = {
      document: '营销域知识构图 · 2026Q3',
      knowledgeBase: '营销主数据首次构图',
      dataTable: '营销主数据首次构图',
      businessObject: '业务对象知识构图',
      businessRule: '业务规则知识构图',
      plugin: '图谱构建能力配置'
    };
    const noExtractionCategories = new Set(['dataTable', 'plugin', 'businessObject', 'businessRule']);

    const allResources = () => Object.entries(resourceCatalog).flatMap(([category, resources]) =>
      resources.map(resource => ({ ...resource, category }))
    );
    const categoryResources = () => activeCategory === 'all'
      ? allResources()
      : (resourceCatalog[activeCategory] || []).map(resource => ({ ...resource, category: activeCategory }));
    const extractionText = resource => noExtractionCategories.has(resource.category)
      ? ''
      : `实体 ${resource.entities.toLocaleString()} / 关系 ${resource.relations.toLocaleString()}`;
    const ingraphText = resource => resource.graph.includes('尚未入图') ? '部分入图' : '已入图';
    const taskName = resource => {
      if (resource.name === '历史项目资料.zip') return '历史项目资料补充';
      if (resource.name === '指标口径说明.pdf') return '监管指标专项构图';
      return taskNames[resource.category] || '图谱构建任务';
    };
    const resourceKey = resource => `${resource.category}::${resource.name}`;

    function openResourceDefinition(resource) {
      const detail = definitionDetails[resource.name];
      if (!detail) return;
      const typeLabel = resource.category === 'businessObject' ? '业务对象' : '业务规则';
      $('#resourceDefinitionTitle').textContent = `查看${typeLabel}`;
      $('#resourceDefinitionType').textContent = typeLabel;
      $('#resourceDefinitionName').textContent = resource.name;
      $('#resourceDefinitionCode').textContent = detail.code;
      $('#resourceDefinitionDomain').textContent = detail.domain;
      $('#resourceDefinitionDescription').textContent = detail.description;
      $('#resourceDefinitionContentLabel').textContent = detail.contentLabel;
      $('#resourceDefinitionContent').textContent = detail.content;
      window.openModal('#resourceDefinitionModal');
    }

    const pagination = document.createElement('nav');
    pagination.className = 'resource-pagination pagination pagination-dense';
    pagination.setAttribute('aria-label', '资源列表分页');
    tableWrap.after(pagination);

    if (bulkBar) {
      bulkBar.innerHTML = '<b>已选择 <span id="selectedResourceCount">0</span> 项资源</b><span>删除后相关实体与关系将一并删除</span><button type="button" class="btn btn-dense btn-danger" id="bulkDeleteResources">批量删除</button>';
    }

    function updateSelectionUI() {
      const count = selectedResources.size;
      const countNode = $('#selectedResourceCount');
      if (countNode) countNode.textContent = String(count);
      bulkBar?.classList.toggle('show', count > 0);
      const checkboxes = $$('.resource-check:not(:disabled)', tableBody);
      const checkedCount = checkboxes.filter(checkbox => checkbox.checked).length;
      if (selectAll) {
        selectAll.checked = checkboxes.length > 0 && checkedCount === checkboxes.length;
        selectAll.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
      }
      const bulkDelete = $('#bulkDeleteResources');
      if (bulkDelete) bulkDelete.disabled = count === 0;
    }

    function openDeleteConfirmation(items) {
      if (!items.length) return;
      const entities = items.reduce((sum, item) => sum + item.entities, 0);
      const relations = items.reduce((sum, item) => sum + item.relations, 0);
      const tasks = items.reduce((sum, item) => sum + item.tasks, 0);
      pendingDelete = { items, entities, relations, tasks };
      const isBatch = items.length > 1;
      const deleteTitle = $('#deleteResourceTitle');
      const confirmDelete = $('#confirmDeleteResource');
      if (deleteTitle) deleteTitle.textContent = isBatch ? '确认批量删除数据资源' : '确认删除数据资源';
      if (confirmDelete) confirmDelete.textContent = isBatch ? `删除 ${items.length} 项资源及关联知识` : '删除资源及关联知识';
      $('#deleteResourceName').textContent = items.length === 1 ? items[0].name : `已选择 ${items.length} 项资源`;
      $('#deleteEntityCount').textContent = entities.toLocaleString();
      $('#deleteRelationCount').textContent = relations.toLocaleString();
      $('#deleteTaskCount').textContent = tasks.toLocaleString();
      window.openModal('#deleteResourceModal');
    }

    function bindRowActions() {
      $$('.resource-detail', tableBody).forEach(button => {
        button.onclick = () => {
          const resource = categoryResources().find(item => item.name === button.dataset.name);
          if (resource?.detail === 'document') window.openModal('#docModal');
          else if (resource && ['businessObject', 'businessRule'].includes(resource.category)) openResourceDefinition(resource);
          else window.toast(`已打开“${button.dataset.name}”的资源详情`);
        };
      });
      $$('.resource-task-link', tableBody).forEach(button => {
        button.onclick = () => {
          const detailTitle = $('#taskPage .detail-title h1');
          if (detailTitle) detailTitle.textContent = button.dataset.taskName;
          window.openTask?.('overview');
        };
      });
      $$('.delete-resource', tableBody).forEach(button => {
        button.onclick = () => {
          if (button.disabled) return;
          openDeleteConfirmation([{
            category: button.dataset.category,
            name: button.dataset.name,
            entities: Number(button.dataset.entities),
            relations: Number(button.dataset.relations),
            tasks: Number(button.dataset.tasks)
          }]);
        };
      });
      $$('.resource-check', tableBody).forEach(checkbox => {
        checkbox.onchange = () => {
          if (checkbox.checked) selectedResources.add(checkbox.dataset.resourceKey);
          else selectedResources.delete(checkbox.dataset.resourceKey);
          updateSelectionUI();
        };
      });
    }

    function renderPagination(total) {
      const pages = Math.max(1, Math.ceil(total / pageSize));
      currentPage = Math.min(currentPage, pages);
      pagination.innerHTML = '';
      const summary = document.createElement('span');
      summary.className = 'resource-pagination-summary';
      summary.textContent = `共 ${total} 条 · 第 ${currentPage} / ${pages} 页`;
      pagination.append(summary);

      const createButton = (label, page, disabled = false, active = false) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `pagination-item resource-page-button${active ? ' active' : ''}`;
        button.textContent = label;
        button.disabled = disabled;
        button.onclick = () => { currentPage = page;render(); };
        return button;
      };
      pagination.append(createButton('‹', Math.max(1, currentPage - 1), currentPage === 1));
      for (let pageNumber = 1; pageNumber <= pages; pageNumber += 1) {
        pagination.append(createButton(String(pageNumber), pageNumber, false, pageNumber === currentPage));
      }
      pagination.append(createButton('›', Math.min(pages, currentPage + 1), currentPage === pages));
    }

    function render() {
      const keyword = search.value.trim();
      const graphFilter = graphFilterControl?.value || '全部入图情况';
      const resources = categoryResources().filter(resource => {
        const keywordMatched = !keyword || resource.name.includes(keyword) || resource.source.includes(keyword) || extractionText(resource).includes(keyword) || taskName(resource).includes(keyword);
        const graphMatched = graphFilter === '全部入图情况' || ingraphText(resource) === graphFilter;
        return keywordMatched && graphMatched;
      });
      const pages = Math.max(1, Math.ceil(resources.length / pageSize));
      currentPage = Math.min(currentPage, pages);
      const visibleResources = resources.slice((currentPage - 1) * pageSize, currentPage * pageSize);

      tableBody.innerHTML = visibleResources.map(resource => {
        const processing = resource.status.includes('解析中') || resource.status.includes('同步中');
        const relatedTask = taskName(resource);
        const moreTasks = resource.tasks > 1 ? `<span class="resource-task-more">+${resource.tasks - 1}</span>` : '';
        const key = resourceKey(resource);
        return `<tr data-resource-row data-resource-category="${resource.category}">
          <td><input class="resource-check" type="checkbox" data-resource-key="${key}" aria-label="选择${resource.name}" ${selectedResources.has(key) ? 'checked' : ''} ${processing ? 'disabled title="资源处理中，暂不可删除"' : ''}></td>
          <td><button class="link resource-detail" data-name="${resource.name}">${resource.name}</button></td>
          <td><span class="source-mode ${resource.sourceClass}">${resource.source}</span></td>
          <td>${extractionText(resource)}</td>
          <td><span class="tag tag-status ${ingraphText(resource) === '已入图' ? 'tag-status-lime' : 'tag-status-blue'}">${ingraphText(resource)}</span></td>
          <td>${resource.time}</td>
          <td><button class="link resource-task-link" data-task-name="${relatedTask}">${relatedTask}</button>${moreTasks}</td>
          <td><div class="row-actions"><button class="btn sm danger delete-resource" data-category="${resource.category}" data-name="${resource.name}" data-entities="${resource.entities}" data-relations="${resource.relations}" data-tasks="${resource.tasks}">删除</button></div></td>
        </tr>`;
      }).join('') || '<tr><td colspan="8"><div class="resource-empty">当前分类下没有匹配的资源</div></td></tr>';
      bindRowActions();
      renderPagination(resources.length);
      updateSelectionUI();
    }

    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', '资源类型');
    tabs.innerHTML = categories.map(([key, label], index) =>
      `<button type="button" role="tab" aria-selected="${index === 0}" data-resource-category="${key}" class="${index === 0 ? 'active' : ''}">${label}</button>`
    ).join('');
    $$('[data-resource-category]', tabs).forEach(button => {
      button.onclick = () => {
        activeCategory = button.dataset.resourceCategory;
        currentPage = 1;
        $$('button', tabs).forEach(item => item.classList.toggle('active', item === button));
        $$('button', tabs).forEach(item => item.setAttribute('aria-selected', String(item === button)));
        render();
      };
    });
    search.addEventListener('input', () => { currentPage = 1;render(); });
    graphFilterControl?.addEventListener('change', () => { currentPage = 1;render(); });
    if (selectAll) selectAll.onchange = () => {
      $$('.resource-check:not(:disabled)', tableBody).forEach(checkbox => {
        checkbox.checked = selectAll.checked;
        if (selectAll.checked) selectedResources.add(checkbox.dataset.resourceKey);
        else selectedResources.delete(checkbox.dataset.resourceKey);
      });
      updateSelectionUI();
    };
    const bulkDelete = $('#bulkDeleteResources');
    if (bulkDelete) bulkDelete.onclick = () => {
      const items = allResources().filter(resource => selectedResources.has(resourceKey(resource)));
      openDeleteConfirmation(items);
    };

    const confirmDelete = $('#confirmDeleteResource');
    if (confirmDelete) confirmDelete.onclick = () => {
      if (!pendingDelete) return;
      pendingDelete.items.forEach(item => {
        const resources = resourceCatalog[item.category] || [];
        const index = resources.findIndex(resource => resource.name === item.name);
        if (index >= 0) resources.splice(index, 1);
        selectedResources.delete(`${item.category}::${item.name}`);
      });
      const deleted = pendingDelete;
      pendingDelete = null;
      window.closeModal();
      render();
      window.toast(`已删除 ${deleted.items.length} 项资源及关联的 ${deleted.entities} 个实体、${deleted.relations} 条关系`);
    };
    render();
  }

  function buildSystemResourceBrowser() {
    const modal = $('#systemResourceModal');
    const body = $('.modal-body', modal);
    const note = $('.system-note', body);
    const tools = $('.system-tools', body);
    const search = $('#systemResourceSearch');
    const list = $('#systemResourceList');
    if (!modal || !body || !tools || !search || !list) return;

    $('.system-tab[data-system-tab="mcp"]', modal)?.remove();
    $$('.system-tab', modal).forEach(tab => {
      tab.dataset.tabLabel = tab.textContent.trim();
      tab.insertAdjacentHTML('beforeend', '<span class="tag-small system-tab-count">0</span>');
    });

    $('select', tools)?.remove();
    if (note) note.innerHTML = '<b>系统资源来自语义知识图谱外部的独立管理模块。</b>请先在左侧选择业务分类，再从右侧选择需要接入的系统资源；接入后将形成可追溯的资源记录。';

    const browser = document.createElement('div');
    browser.className = 'system-resource-browser';
    const tree = document.createElement('aside');
    tree.className = 'system-category-tree';
    tree.innerHTML = `
      <div class="system-tree-title">业务分类</div>
      <div class="system-tree-branch is-open" data-tree-branch="all">
        <div class="system-tree-row active" data-domain="all" data-subdomain="all">
          <button class="system-tree-label" type="button"><span class="tree-spacer"></span><span>全部业务</span><b>24</b></button>
          <input class="system-tree-check" type="checkbox" aria-label="选择全部业务下的所有资源">
        </div>
      </div>
      <div class="system-tree-branch is-open" data-tree-branch="marketing">
        <div class="system-tree-row" data-domain="marketing" data-subdomain="all">
          <button class="system-tree-toggle" type="button" aria-label="展开或收起市场营销">⌄</button>
          <button class="system-tree-label" type="button"><span>市场营销</span><b>6</b></button>
          <input class="system-tree-check" type="checkbox" aria-label="选择市场营销下的所有资源">
        </div>
        <div class="system-tree-children"><div class="system-tree-row child" data-domain="marketing" data-subdomain="customer"><button class="system-tree-label" type="button"><span>客户服务</span><b>3</b></button><input class="system-tree-check" type="checkbox" aria-label="选择客户服务下的所有资源"></div><div class="system-tree-row child" data-domain="marketing" data-subdomain="operation"><button class="system-tree-label" type="button"><span>经营分析</span><b>3</b></button><input class="system-tree-check" type="checkbox" aria-label="选择经营分析下的所有资源"></div></div>
      </div>
      <div class="system-tree-branch" data-tree-branch="grid">
        <div class="system-tree-row" data-domain="grid" data-subdomain="all"><button class="system-tree-toggle" type="button" aria-label="展开或收起电网运行">›</button><button class="system-tree-label" type="button"><span>电网运行</span><b>5</b></button><input class="system-tree-check" type="checkbox" aria-label="选择电网运行下的所有资源"></div>
        <div class="system-tree-children"><div class="system-tree-row child" data-domain="grid" data-subdomain="transmission"><button class="system-tree-label" type="button"><span>输电运行</span><b>2</b></button><input class="system-tree-check" type="checkbox" aria-label="选择输电运行下的所有资源"></div><div class="system-tree-row child" data-domain="grid" data-subdomain="distribution"><button class="system-tree-label" type="button"><span>配电运行</span><b>3</b></button><input class="system-tree-check" type="checkbox" aria-label="选择配电运行下的所有资源"></div></div>
      </div>
      <div class="system-tree-branch" data-tree-branch="equipment"><div class="system-tree-row" data-domain="equipment" data-subdomain="all"><button class="system-tree-toggle" type="button" aria-label="展开或收起设备运维">›</button><button class="system-tree-label" type="button"><span>设备运维</span><b>7</b></button><input class="system-tree-check" type="checkbox" aria-label="选择设备运维下的所有资源"></div><div class="system-tree-children"><div class="system-tree-row child" data-domain="equipment" data-subdomain="ledger"><button class="system-tree-label" type="button"><span>设备台账</span><b>4</b></button><input class="system-tree-check" type="checkbox" aria-label="选择设备台账下的所有资源"></div><div class="system-tree-row child" data-domain="equipment" data-subdomain="inspection"><button class="system-tree-label" type="button"><span>检修巡检</span><b>3</b></button><input class="system-tree-check" type="checkbox" aria-label="选择检修巡检下的所有资源"></div></div></div>
      <div class="system-tree-branch" data-tree-branch="governance"><div class="system-tree-row" data-domain="governance" data-subdomain="all"><button class="system-tree-toggle" type="button" aria-label="展开或收起企业管理">›</button><button class="system-tree-label" type="button"><span>企业管理</span><b>6</b></button><input class="system-tree-check" type="checkbox" aria-label="选择企业管理下的所有资源"></div><div class="system-tree-children"><div class="system-tree-row child" data-domain="governance" data-subdomain="organization"><button class="system-tree-label" type="button"><span>组织管理</span><b>3</b></button><input class="system-tree-check" type="checkbox" aria-label="选择组织管理下的所有资源"></div><div class="system-tree-row child" data-domain="governance" data-subdomain="data"><button class="system-tree-label" type="button"><span>数据治理</span><b>3</b></button><input class="system-tree-check" type="checkbox" aria-label="选择数据治理下的所有资源"></div></div></div>`;
    const entities = document.createElement('section');
    entities.className = 'system-entity-panel';
    entities.append(tools, list);
    const selectedPanel = document.createElement('aside');
    selectedPanel.className = 'system-selected-panel';
    selectedPanel.innerHTML = '<div class="system-selected-head"><span>已选择</span><b id="systemSelectedPanelCount">0</b><button type="button" id="clearSystemSelected">清空</button></div><div class="system-selected-list" id="systemSelectedList"><div class="system-selected-empty">暂未选择资源</div></div>';
    browser.append(tree, entities, selectedPanel);
    body.append(browser);

    const datasets = {
      businessObject: [
        ['客户', 'BO-10001 · 市场营销', 'marketing', 'customer'], ['供电单位', 'BO-10003 · 企业管理', 'governance', 'organization'],
        ['变电站', 'BO-10008 · 设备运维', 'equipment', 'ledger'], ['电网线路', 'BO-10021 · 电网运行', 'grid', 'transmission']
      ],
      businessRule: [
        ['供电服务响应规则', 'BR-2003 · 市场营销', 'marketing', 'customer'], ['设备巡检周期规则', 'BR-2015 · 设备运维', 'equipment', 'inspection'],
        ['线路负载率告警规则', 'BR-2021 · 电网运行', 'grid', 'distribution'], ['数据质量管理规则', 'BR-2032 · 企业管理', 'governance', 'data']
      ],
      table: [
        ['营销主题数据表', 'dw_prod · 126 张表', 'marketing', 'operation'], ['客户主数据', 'mdm_customer · 38 张表', 'marketing', 'customer'],
        ['设备资产数据', 'pms_asset · 84 张表', 'equipment', 'ledger'], ['电网运行明细', 'ods_grid · 56 张表', 'grid', 'distribution']
      ],
      kb: [
        ['企业术语知识库', '2,310 个知识片段 · 企业管理', 'governance', 'data'], ['电力行业标准知识库', '1,280 个知识片段 · 电网运行', 'grid', 'transmission'],
        ['营销服务知识库', '926 个知识片段 · 市场营销', 'marketing', 'customer'], ['设备运维知识库', '760 个知识片段 · 设备运维', 'equipment', 'inspection']
      ],
      plugin: [
        ['SQL 解析插件', '识别血缘、指标口径和表关系', 'governance', 'data'], ['文档结构化插件', '还原标题、表格和段落', 'governance', 'data'],
        ['设备编码解析插件', '识别设备台账编码', 'equipment', 'ledger'], ['营销指标解析插件', '识别营销指标口径', 'marketing', 'operation']
      ]
    };
    const selected = new Set();
    const selectedItems = new Map();
    let activeTab = $('.system-tab.active', modal)?.dataset.systemTab || 'businessObject';
    let activeDomain = 'all';
    let activeSubdomain = 'all';

    const tabLabel = () => $('.system-tab.active', modal)?.dataset.tabLabel || '系统资源';
    const keyFor = item => `${activeTab}-${item[0]}`;
    const matchesCategory = item => (activeDomain === 'all' || item[2] === activeDomain) && (activeSubdomain === 'all' || item[3] === activeSubdomain);

    function renderSelected() {
      const selectedList = $('#systemSelectedList');
      $('#systemSelectedPanelCount').textContent = String(selected.size);
      $('#systemSelectedCount').textContent = String(selected.size);
      $$('.system-tab', modal).forEach(tab => {
        const count = [...selected].filter(key => key.startsWith(`${tab.dataset.systemTab}-`)).length;
        const badge = $('.system-tab-count', tab);
        if (badge) badge.textContent = String(count);
      });
      selectedList.innerHTML = selected.size ? [...selected].map(key => {
        const item = selectedItems.get(key);
        return `<div class="system-selected-item"><span><b>${item.name}</b><small>${item.type}</small></span><button type="button" data-remove-system="${key}" aria-label="移除 ${item.name}">×</button></div>`;
      }).join('') : '<div class="system-selected-empty">暂未选择资源</div>';
      $$('[data-remove-system]', selectedList).forEach(button => button.onclick = () => {
        selected.delete(button.dataset.removeSystem);
        selectedItems.delete(button.dataset.removeSystem);
        render();
      });
      $$('.system-tree-row', tree).forEach(row => {
        const checkbox = $('.system-tree-check', row);
        if (!checkbox) return;
        const domain = row.dataset.domain;
        const subdomain = row.dataset.subdomain;
        const categoryItems = (datasets[activeTab] || []).filter(item => (domain === 'all' || item[2] === domain) && (subdomain === 'all' || item[3] === subdomain));
        const selectedCount = categoryItems.filter(item => selected.has(keyFor(item))).length;
        checkbox.checked = categoryItems.length > 0 && selectedCount === categoryItems.length;
        checkbox.indeterminate = selectedCount > 0 && selectedCount < categoryItems.length;
      });
    }

    function render() {
      const keyword = search.value.trim();
      const rows = (datasets[activeTab] || []).filter(item =>
        matchesCategory(item) &&
        (!keyword || item[0].includes(keyword) || item[1].includes(keyword))
      );
      list.innerHTML = rows.map(item => {
        const key = `${activeTab}-${item[0]}`;
        return `<label class="system-resource-row"><input type="checkbox" class="system-resource-check" data-key="${key}" data-name="${item[0]}" ${selected.has(key) ? 'checked' : ''}><span><b>${item[0]}</b><small>${item[1]}</small></span></label>`;
      }).join('') || '<div class="system-empty">当前分类下没有匹配资源</div>';
      $$('.system-resource-check', list).forEach(checkbox => checkbox.onchange = () => {
        const item = (datasets[activeTab] || []).find(entry => keyFor(entry) === checkbox.dataset.key);
        if (checkbox.checked) {
          selected.add(checkbox.dataset.key);
          selectedItems.set(checkbox.dataset.key, { name: checkbox.dataset.name, type: tabLabel(), item });
        } else {
          selected.delete(checkbox.dataset.key);
          selectedItems.delete(checkbox.dataset.key);
        }
        renderSelected();
      });
      renderSelected();
    }

    $$('.system-tab', modal).forEach(tab => tab.onclick = () => {
      activeTab = tab.dataset.systemTab;
      $$('.system-tab', modal).forEach(item => item.classList.toggle('active', item === tab));
      activeDomain = 'all';
      activeSubdomain = 'all';
      $$('.system-tree-row', tree).forEach(item => item.classList.toggle('active', item.dataset.domain === 'all'));
      render();
    });
    $$('.system-tree-label', tree).forEach(button => button.onclick = () => {
      const node = button.closest('.system-tree-row');
      activeDomain = node.dataset.domain;
      activeSubdomain = node.dataset.subdomain;
      $$('.system-tree-row', tree).forEach(item => item.classList.toggle('active', item === node));
      render();
    });
    $$('.system-tree-toggle', tree).forEach(button => button.onclick = () => {
      const branch = button.closest('.system-tree-branch');
      branch.classList.toggle('is-open');
      button.textContent = branch.classList.contains('is-open') ? '⌄' : '›';
    });
    $$('.system-tree-check', tree).forEach(checkbox => checkbox.onchange = () => {
      const node = checkbox.closest('.system-tree-row');
      const domain = node.dataset.domain;
      const subdomain = node.dataset.subdomain;
      (datasets[activeTab] || []).filter(item => (domain === 'all' || item[2] === domain) && (subdomain === 'all' || item[3] === subdomain)).forEach(item => {
        const key = keyFor(item);
        if (checkbox.checked) {
          selected.add(key);
          selectedItems.set(key, { name: item[0], type: tabLabel(), item });
        } else {
          selected.delete(key);
          selectedItems.delete(key);
        }
      });
      render();
    });
    $('#clearSystemSelected').onclick = () => { selected.clear();selectedItems.clear();render(); };
    $('#confirmSystemResources').onclick = () => {
      const names = [...selected].map(key => selectedItems.get(key)?.name).filter(Boolean);
      $$('[data-new-system-count]').forEach(countNode => {
        countNode.textContent = String([...selected].filter(key => key.startsWith(`${countNode.dataset.newSystemCount}-`)).length);
      });
      window.closeModal();
      window.openModal('#newTaskModal');
      window.toast(names.length ? `已添加 ${names.length} 项系统资源` : '未选择系统资源');
    };
    search.oninput = render;
    render();
  }

  refineTaskListCopy();
  addCompletedTask();
  refineFailedTask();
  refineWorkspace();
  refineTaskDocuments();
  refineDocumentDetailModal();
  refineNewTaskFooter();
  refineNewTaskResourcePanel();
  refineResourceTable();
  buildResourceCategoryTabs();
  buildSystemResourceBrowser();
})();
