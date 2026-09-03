import { renderShell } from './shell.js?v=8';

const platformStylesheet = document.querySelector('link[href$="platform.css"]');
if (platformStylesheet) platformStylesheet.href = `${platformStylesheet.href}?v=2`;

renderShell();
const template = document.querySelector('template[data-page-template]');
if (template) document.querySelector('[data-page-content]').append(template.content.cloneNode(true));

document.querySelectorAll('[data-ai-chat-open], [data-ai-chat-dialog]').forEach(node => node.remove());
const aiAssistant = document.createElement('div');
aiAssistant.className = 'ai-assistant';
aiAssistant.innerHTML = `
  <button class="ai-chat-fab" type="button" aria-label="打开知识工程 AI 助手" aria-controls="ai-assistant-drawer" aria-expanded="false" data-ai-chat-open>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 5h14v11H9l-4 4V5Z"/><path d="M9 10h.01M12 10h.01M15 10h.01"/></svg><span>AI 助手</span>
  </button>
  <aside class="ai-assistant-drawer" id="ai-assistant-drawer" aria-labelledby="ai-chat-title" aria-hidden="true" data-ai-chat-dialog>
    <header class="ai-assistant-header"><div><h2 class="text-medium-bold" id="ai-chat-title">知识工程 AI 助手</h2><p class="text-small">正在理解：<span data-ai-context>当前页面</span></p></div><button class="dialog-close" type="button" aria-label="关闭 AI 助手" data-ai-chat-close></button></header>
    <div class="ai-chat-messages" data-ai-chat-messages aria-live="polite">
      <div class="ai-message ai-message-assistant"><span class="ai-message-avatar">AI</span><div><strong class="text-small-bold">知识助手</strong><p class="text-normal">你好，我会结合你当前所在的页面，协助完成资源纳管、知识加工、知识管理和知识服务工作。</p></div></div>
      <button class="ai-suggestion" type="button" data-ai-suggestion="你先帮我初步构建一个资源管理的目录">帮我初步构建资源管理目录</button>
    </div>
    <form class="ai-chat-composer" data-ai-chat-form><label class="input-wrap"><textarea class="input ai-chat-input" rows="3" data-ai-chat-input placeholder="描述你希望 AI 协助完成的工作" aria-label="输入给知识工程 AI 助手的消息"></textarea></label><div class="ai-composer-foot"><span class="text-small">Enter 发送 · Shift + Enter 换行</span><button class="btn btn-medium btn-primary" type="submit">发送</button></div></form>
  </aside>`;
document.body.append(aiAssistant);

const themeSwitch = document.querySelector('#theme-switch');
const savedTheme = localStorage.getItem('kep-theme') || 'light';
document.documentElement.dataset.theme = savedTheme;
themeSwitch.checked = savedTheme === 'dark';
themeSwitch.addEventListener('change', () => {
  const theme = themeSwitch.checked ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('kep-theme', theme);
});

const sidebar = document.querySelector('#sidebar');
document.querySelector('[data-nav-toggle]')?.addEventListener('click', event => {
  const open = sidebar.classList.toggle('is-open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
});

document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-toast]');
  if (!trigger) return;
  const toast = document.querySelector('[data-toast-node]');
  toast.textContent = trigger.dataset.toast;
  toast.classList.add('is-visible');
  window.clearTimeout(window.toastTimer);
  window.toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3000);
});

document.querySelectorAll('[data-table-search]').forEach(input => input.addEventListener('input', () => {
  const table = document.querySelector(input.dataset.tableSearch);
  const query = input.value.trim().toLowerCase();
  table?.querySelectorAll('tbody tr').forEach(row => { row.hidden = !row.textContent.toLowerCase().includes(query); });
}));

document.querySelectorAll('[data-tabs]').forEach(scope => {
  const tabs = scope.querySelectorAll('[role="tab"]');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(item => { item.classList.toggle('is-active', item === tab); item.setAttribute('aria-selected', String(item === tab)); });
    scope.querySelectorAll('[role="tabpanel"]').forEach(panel => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
  }));
});

document.querySelectorAll('[data-bar]').forEach(bar => { bar.style.width = `${bar.dataset.bar}%`; });

const notificationPanelNode = document.querySelector('[data-notification-panel]');
if (notificationPanelNode) {
  notificationPanelNode.setAttribute('aria-label', '任务消息中心');
  notificationPanelNode.innerHTML = '<div class="notification-header"><div><strong class="text-normal-bold">任务消息</strong><span class="text-small notification-summary" data-task-summary>暂无进行中任务</span></div></div><div class="task-category-tabs" role="group" aria-label="任务分类"><button class="task-category is-active" type="button" data-task-filter="all" aria-pressed="true">全部</button><button class="task-category" type="button" data-task-filter="upload" aria-pressed="false">上传任务</button><button class="task-category" type="button" data-task-filter="catalog" aria-pressed="false">自动入目任务</button></div><div class="task-center-list"><section class="task-section" data-task-section="upload"><div class="task-section-title text-small-bold">上传任务</div><div class="upload-task-list" data-upload-task-list><div class="upload-empty text-small" data-upload-empty>暂无上传任务</div></div></section><section class="task-section" data-task-section="catalog"><div class="task-section-title text-small-bold">自动入目任务</div><div class="catalog-task-list" data-catalog-task-list><div class="upload-empty text-small" data-catalog-empty>暂无自动入目任务</div></div></section></div>';
}

const notificationToggle = document.querySelector('[data-notification-toggle]');
const notificationPanel = document.querySelector('[data-notification-panel]');
notificationToggle?.addEventListener('click', event => {
  event.stopPropagation();
  const open = notificationPanel.hidden;
  notificationPanel.hidden = !open;
  notificationToggle.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', event => {
  if (!notificationPanel || notificationPanel.hidden || event.target.closest('.notification-wrap')) return;
  notificationPanel.hidden = true;
  notificationToggle?.setAttribute('aria-expanded', 'false');
});
document.querySelectorAll('[data-task-filter]').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.taskFilter;
  document.querySelectorAll('[data-task-filter]').forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-task-section]').forEach(section => { section.hidden = filter !== 'all' && section.dataset.taskSection !== filter; });
}));

const sourceLabels = {
  all: ['全部文件', '共 126 个文件，展示所有知识源内容'],
  local: ['本地上传', '来自用户手工上传的文件'],
  external: ['外部对接', '来自 NFS、S3 和 API 的同步文件'],
  connector: ['连接器', '来自 Wiki、网盘和业务系统连接器的文件']
};

document.querySelectorAll('[data-source-filter]').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.sourceFilter;
  document.querySelectorAll('[data-source-filter]').forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  let visibleCount = 0;
  document.querySelectorAll('#document-table tbody tr').forEach(row => {
    const visible = filter === 'all' || row.dataset.sourceGroup === filter;
    row.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  const [title, summary] = sourceLabels[filter];
  const titleNode = document.querySelector('[data-file-title]');
  const summaryNode = document.querySelector('[data-file-summary]');
  const countNode = document.querySelector('[data-file-count]');
  const uploadActions = document.querySelector('[data-local-upload-actions]');
  const externalActions = document.querySelector('[data-external-actions]');
  const connectorActions = document.querySelector('[data-connector-actions]');
  const fileListRegion = document.querySelector('[data-file-list-region]');
  const integrationRegion = document.querySelector('[data-integration-region]');
  const showIntegrations = filter === 'external' || filter === 'connector';
  if (titleNode) titleNode.textContent = title;
  if (summaryNode) summaryNode.textContent = summary;
  if (countNode) countNode.textContent = `${visibleCount} 条结果`;
  if (uploadActions) uploadActions.hidden = filter !== 'local';
  if (externalActions) externalActions.hidden = filter !== 'external';
  if (connectorActions) connectorActions.hidden = filter !== 'connector';
  if (fileListRegion) fileListRegion.hidden = showIntegrations;
  if (integrationRegion) {
    integrationRegion.hidden = !showIntegrations;
    integrationRegion.querySelectorAll('[data-integration-type]').forEach(card => { card.hidden = card.dataset.integrationType !== filter; });
  }
}));

const localUploadButton = document.querySelector('[data-local-upload]');
const localFileInput = document.querySelector('[data-local-file-input]');
localUploadButton?.addEventListener('click', () => localFileInput?.click());
localFileInput?.addEventListener('change', () => {
  const files = [...localFileInput.files];
  if (!files.length) return;
  files.forEach(startUploadTask);
  localFileInput.value = '';
  notificationPanel.hidden = false;
  notificationToggle?.setAttribute('aria-expanded', 'true');
});

function startUploadTask(file) {
  const taskList = document.querySelector('[data-upload-task-list]');
  document.querySelector('[data-upload-empty]')?.remove();
  const task = document.createElement('article');
  task.className = 'upload-task';
  task.innerHTML = '<div class="upload-task-head"><strong class="upload-task-name text-small-bold"></strong><span class="tag tag-status tag-status-blue" data-task-status>上传中</span></div><div class="upload-progress" role="progressbar" aria-label="文件上传进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div><div class="upload-task-meta text-small"><span data-task-size></span><span data-task-percent>0%</span></div>';
  task.querySelector('.upload-task-name').textContent = file.name;
  task.querySelector('[data-task-size]').textContent = formatFileSize(file.size);
  taskList?.prepend(task);

  let progress = 0;
  updateUploadSummary();
  const timer = window.setInterval(() => {
    progress = Math.min(100, progress + Math.max(4, Math.round(18 - file.size / 10000000)));
    const progressNode = task.querySelector('.upload-progress');
    progressNode.setAttribute('aria-valuenow', String(progress));
    progressNode.querySelector('span').style.width = `${progress}%`;
    task.querySelector('[data-task-percent]').textContent = `${progress}%`;
    if (progress === 100) {
      window.clearInterval(timer);
      task.classList.add('is-complete');
      const status = task.querySelector('[data-task-status]');
      status.className = 'tag tag-status tag-status-lime';
      status.textContent = '已完成';
      appendUploadedFile(file);
      updateUploadSummary();
    }
  }, 260);
}

function updateUploadSummary() {
  const tasks = [...document.querySelectorAll('.upload-task')];
  const active = tasks.filter(task => !task.classList.contains('is-complete')).length;
  const badge = document.querySelector('[data-notification-badge]');
  updateTaskCenterSummary();
}

function updateTaskCenterSummary() {
  const uploading = [...document.querySelectorAll('.upload-task')].filter(task => !task.classList.contains('is-complete')).length;
  const cataloging = [...document.querySelectorAll('.catalog-task')].filter(task => !task.classList.contains('is-complete')).length;
  const active = uploading + cataloging;
  const badge = document.querySelector('[data-notification-badge]');
  const summary = document.querySelector('[data-task-summary]');
  if (badge) { badge.hidden = active === 0; badge.textContent = String(active); }
  if (summary) summary.textContent = active ? `${active} 个任务正在执行` : '暂无进行中任务';
}

document.querySelector('[data-auto-catalog]')?.addEventListener('click', () => {
  startCatalogTask();
  notificationPanel.hidden = false;
  notificationToggle?.setAttribute('aria-expanded', 'true');
  document.querySelector('[data-task-filter="all"]')?.click();
});

function startCatalogTask() {
  const taskList = document.querySelector('[data-catalog-task-list]');
  document.querySelector('[data-catalog-empty]')?.remove();
  const task = document.createElement('article');
  task.className = 'catalog-task';
  task.innerHTML = '<div class="catalog-task-head"><span class="catalog-task-title"><strong class="text-small-bold">资源自动入目</strong><small>待入目文档 3 份</small></span><span class="tag tag-status tag-status-blue" data-catalog-status>执行中</span></div><div class="upload-progress" role="progressbar" aria-label="自动入目进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div><div class="catalog-stages"><div class="catalog-stage is-active"><i class="catalog-stage-mark">1</i><span>抽取文件基础元数据</span><small>0/3</small></div><div class="catalog-stage"><i class="catalog-stage-mark">2</i><span>填充业务属性与管理属性</span><small>0/10</small></div><div class="catalog-stage"><i class="catalog-stage-mark">3</i><span>分析文件摘要与知识主题</span><small>等待</small></div><div class="catalog-stage"><i class="catalog-stage-mark">4</i><span>匹配资源目录</span><small>等待</small></div></div>';
  taskList?.prepend(task);
  const stages = [...task.querySelectorAll('.catalog-stage')];
  let progress = 0;
  updateTaskCenterSummary();
  const timer = window.setInterval(() => {
    progress = Math.min(100, progress + 5);
    const progressNode = task.querySelector('.upload-progress');
    progressNode.setAttribute('aria-valuenow', String(progress));
    progressNode.querySelector('span').style.width = `${progress}%`;
    const stageIndex = Math.min(3, Math.floor(progress / 25));
    stages.forEach((stage, index) => {
      stage.classList.toggle('is-active', index === stageIndex && progress < 100);
      stage.classList.toggle('is-finish', index < stageIndex || progress === 100);
      if (index < stageIndex || progress === 100) { stage.querySelector('.catalog-stage-mark').textContent = '✓'; stage.querySelector('small').textContent = index === 1 ? '10/10' : '完成'; }
    });
    if (progress === 100) {
      window.clearInterval(timer);
      task.classList.add('is-complete');
      const status = task.querySelector('[data-catalog-status]');
      status.className = 'tag tag-status tag-status-lime';
      status.textContent = '待确认目录';
      const recommendation = document.createElement('div');
      recommendation.className = 'catalog-recommendation';
      recommendation.innerHTML = '<strong class="text-small-bold">未匹配到现有目录</strong><span class="text-small">建议归属到“授信政策解读”目录</span><button class="btn btn-dense btn-primary" type="button" data-create-recommended-directory="授信政策解读">创建并入目</button>';
      task.append(recommendation);
      updateTaskCenterSummary();
    }
  }, 180);
}

document.querySelector('[data-catalog-task-list]')?.addEventListener('click', event => {
  const button = event.target.closest('[data-create-recommended-directory]');
  if (!button) return;
  const name = button.dataset.createRecommendedDirectory;
  const directory = document.createElement('button');
  directory.className = 'directory-item';
  directory.type = 'button';
  directory.innerHTML = '<span class="directory-caret" aria-hidden="true">›</span><span></span><span class="source-count">3</span>';
  directory.querySelector('span:nth-child(2)').textContent = name;
  document.querySelector('.directory-tree')?.append(directory);
  button.closest('.catalog-recommendation').innerHTML = `<strong class="text-small-bold">目录已创建</strong><span class="text-small">3 份文档已自动归属到“${name}”</span>`;
  const status = button.closest('.catalog-task').querySelector('[data-catalog-status]');
  status.textContent = '已完成';
  showToast(`已创建“${name}”并完成入目`);
});

function appendUploadedFile(file) {
  const body = document.querySelector('#document-table tbody');
  if (!body) return;
  const row = document.createElement('tr');
  row.dataset.sourceGroup = 'local';
  const extension = file.name.includes('.') ? file.name.split('.').pop().toUpperCase() : '文件';
  row.innerHTML = '<td class="cell-primary"><a class="document-link" href="document-detail.html" data-uploaded-name></a><span class="cell-secondary text-small" data-uploaded-meta></span></td><td data-uploaded-type></td><td><span class="tag tag-status tag-status-lime">已解析</span></td><td class="text-number">v1.0</td><td data-uploaded-created></td><td data-uploaded-time></td><td>当前用户</td><td class="cell-actions"><button class="btn btn-dense btn-text" data-update-file>更新</button><button class="btn btn-dense btn-text" data-archive-file>归档</button></td>';
  const nameLink = row.querySelector('[data-uploaded-name]');
  nameLink.textContent = file.name;
  nameLink.href = `document-detail.html?file=${encodeURIComponent(file.name)}`;
  row.querySelector('[data-uploaded-meta]').textContent = `${extension} · ${formatFileSize(file.size)}`;
  row.querySelector('[data-uploaded-type]').textContent = extension;
  const time = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date());
  row.querySelector('[data-uploaded-created]').textContent = time;
  row.querySelector('[data-uploaded-time]').textContent = time;
  body.prepend(row);
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

const directoryTitles = {
  all: '全部资源', system: '制度规范', credit: '授信管理', risk: '风险管理', guide: '业务指引', faq: '问答知识'
};

document.querySelectorAll('[data-directory-filter]').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.directoryFilter;
  document.querySelectorAll('[data-directory-filter]').forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  let visibleCount = 0;
  document.querySelectorAll('#resource-table tbody tr').forEach(row => {
    const systemMatch = filter === 'system' && ['system', 'credit', 'risk'].includes(row.dataset.directory);
    const visible = filter === 'all' || systemMatch || row.dataset.directory === filter;
    row.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  const titleNode = document.querySelector('[data-resource-title]');
  const countNode = document.querySelector('[data-resource-count]');
  if (titleNode) titleNode.textContent = directoryTitles[filter];
  if (countNode) countNode.textContent = `${visibleCount} 条结果`;
}));

const directoryForm = document.querySelector('[data-directory-form]');
document.querySelector('[data-new-directory]')?.addEventListener('click', () => {
  directoryForm.hidden = false;
  directoryForm.querySelector('input')?.focus();
});
document.querySelector('[data-cancel-directory]')?.addEventListener('click', () => { directoryForm.hidden = true; });
directoryForm?.addEventListener('submit', event => {
  event.preventDefault();
  const input = directoryForm.querySelector('input');
  const name = input.value.trim();
  if (!name) return;
  const button = document.createElement('button');
  button.className = 'directory-item';
  button.type = 'button';
  button.innerHTML = `<span class="directory-caret" aria-hidden="true">›</span><span></span><span class="source-count">0</span>`;
  button.querySelector('span:nth-child(2)').textContent = name;
  document.querySelector('.directory-tree')?.append(button);
  input.value = '';
  directoryForm.hidden = true;
  showToast(`已创建目录“${name}”`);
});

const attributeDialog = document.querySelector('[data-attribute-dialog]');
const attributeTrigger = document.querySelector('[data-open-attributes]');
function setAttributeDialog(open) {
  attributeDialog.hidden = !open;
  if (open) window.setTimeout(() => attributeDialog.querySelector('input[name="attributeName"]')?.focus(), 0);
  else attributeTrigger?.focus();
}
attributeTrigger?.addEventListener('click', () => setAttributeDialog(true));
document.querySelectorAll('[data-close-attributes]').forEach(button => button.addEventListener('click', () => setAttributeDialog(false)));
attributeDialog?.addEventListener('click', event => { if (event.target === attributeDialog) setAttributeDialog(false); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && attributeDialog && !attributeDialog.hidden) setAttributeDialog(false); });
document.querySelectorAll('[data-attribute-category]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-attribute-category]').forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.classList.toggle('tag-primary', active);
    item.setAttribute('aria-pressed', String(active));
  });
}));
document.querySelector('[data-add-attribute-row]')?.addEventListener('click', () => {
  const templateRow = document.querySelector('[data-attribute-row]');
  const row = templateRow.cloneNode(true);
  row.querySelector('input').value = '';
  row.querySelector('select').selectedIndex = 0;
  document.querySelector('[data-attribute-rows]')?.append(row);
  row.querySelector('input').focus();
});
document.querySelector('[data-attribute-rows]')?.addEventListener('click', event => {
  const removeButton = event.target.closest('[data-remove-attribute-row]');
  if (!removeButton) return;
  const rows = document.querySelectorAll('[data-attribute-row]');
  const row = removeButton.closest('[data-attribute-row]');
  if (rows.length === 1) {
    row.querySelector('input').value = '';
    row.querySelector('select').selectedIndex = 0;
  } else row.remove();
});
document.querySelector('[data-save-attribute]')?.addEventListener('click', () => {
  const category = document.querySelector('[data-attribute-category].is-active')?.dataset.attributeCategory || '业务属性';
  const rows = [...document.querySelectorAll('[data-attribute-row]')];
  const validRows = rows.filter(row => row.querySelector('input').value.trim());
  if (!validRows.length) { rows[0]?.querySelector('input').focus(); return; }
  setAttributeDialog(false);
  showToast(`已保存 ${validRows.length} 个${category}`);
});

function showToast(message) {
  const toast = document.querySelector('[data-toast-node]');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(window.toastTimer);
  window.toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3000);
}

let updateTarget = null;
const fileVersionInput = document.querySelector('[data-file-version-input]');
document.addEventListener('click', event => {
  const updateButton = event.target.closest('[data-update-file]');
  if (!updateButton || !fileVersionInput) return;
  updateTarget = updateButton.closest('tr')?.querySelector('.document-link')?.textContent.trim() || document.querySelector('[data-detail-title]')?.textContent.trim() || '当前文件';
  fileVersionInput.click();
});
document.addEventListener('click', event => {
  const archiveButton = event.target.closest('[data-archive-file]');
  if (!archiveButton) return;
  const row = archiveButton.closest('tr');
  const status = row?.querySelector('td:nth-child(3) .tag-status');
  const name = row?.querySelector('.document-link')?.textContent.trim() || '当前文件';
  if (status) {
    status.className = 'tag tag-status tag-status-secondary';
    status.textContent = '已归档';
  }
  archiveButton.disabled = true;
  archiveButton.textContent = '已归档';
  showToast(`“${name}”已归档`);
});
fileVersionInput?.addEventListener('change', () => {
  const file = fileVersionInput.files[0];
  if (!file) return;
  showToast(`已选择“${file.name}”更新${updateTarget}`);
  fileVersionInput.value = '';
});

const detailTitle = document.querySelector('[data-detail-title]');
if (detailTitle) {
  const fileName = new URLSearchParams(window.location.search).get('file');
  if (fileName) {
    detailTitle.textContent = fileName;
    const detailName = document.querySelector('[data-detail-name]');
    if (detailName) detailName.textContent = fileName;
    document.title = `${fileName} - 文件详情`;
  }
}

const resourceDetailTitle = document.querySelector('[data-resource-detail-title]');
if (resourceDetailTitle) {
  const fileName = new URLSearchParams(window.location.search).get('file');
  if (fileName) {
    resourceDetailTitle.textContent = fileName;
    const nameNode = document.querySelector('[data-resource-detail-name]');
    if (nameNode) nameNode.textContent = fileName;
    document.title = `${fileName} - 知识资产详情`;
  }
}

const relationTitle = document.querySelector('[data-relation-title]');
if (relationTitle) {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name') || '关联知识';
  const isGraph = params.get('type') === 'graph';
  relationTitle.textContent = name;
  document.querySelector('[data-relation-type]').textContent = isGraph ? '语义知识图谱详情' : '知识库详情';
  document.querySelector('[data-relation-description]').textContent = isGraph ? '查看语义知识图谱的实体、关系与关联资源。' : '查看知识库的内容范围、运行状态与关联资源。';
  document.title = `${name} - ${isGraph ? '图谱详情' : '知识库详情'}`;
}

const compareButton = document.querySelector('[data-compare-versions]');
document.querySelectorAll('[data-version-check]').forEach(checkbox => checkbox.addEventListener('change', () => {
  const selected = [...document.querySelectorAll('[data-version-check]:checked')];
  if (selected.length > 3) {
    checkbox.checked = false;
    showToast('最多选择 3 个版本进行对比');
  }
  const count = document.querySelectorAll('[data-version-check]:checked').length;
  compareButton.disabled = count < 2;
  compareButton.textContent = count >= 2 ? `版本对比 (${count})` : '版本对比';
}));
compareButton?.addEventListener('click', () => {
  const selected = [...document.querySelectorAll('[data-version-check]:checked')].map(item => item.value);
  const panel = document.querySelector('[data-comparison-panel]');
  document.querySelector('[data-comparison-summary]').textContent = `正在对比 ${selected.join(' / ')}`;
  panel.hidden = false;
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
document.querySelector('[data-close-comparison]')?.addEventListener('click', () => { document.querySelector('[data-comparison-panel]').hidden = true; });

const knowledgeSearchInput = document.querySelector('[data-knowledge-search-input]');
let knowledgeDirectory = 'all';
const knowledgeDirectoryLabels = {
  all: '全部知识', policy: '制度与规范', business: '经营与客户', risk: '风险与合规', product: '产品与服务'
};

function filterKnowledgeResults() {
  if (!knowledgeSearchInput) return;
  const query = knowledgeSearchInput.value.trim().toLowerCase();
  let visibleCount = 0;
  document.querySelectorAll('[data-search-result]').forEach(result => {
    const directoryMatch = knowledgeDirectory === 'all' || result.dataset.directory === knowledgeDirectory;
    const keywordMatch = !query || result.textContent.toLowerCase().includes(query);
    const visible = directoryMatch && keywordMatch;
    result.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  const title = document.querySelector('[data-search-result-title]');
  const summary = document.querySelector('[data-search-result-summary]');
  const count = document.querySelector('[data-search-result-count]');
  const empty = document.querySelector('[data-search-empty]');
  if (title) title.textContent = query ? `“${knowledgeSearchInput.value.trim()}”的搜索结果` : knowledgeDirectoryLabels[knowledgeDirectory];
  if (summary) summary.textContent = query ? `在${knowledgeDirectoryLabels[knowledgeDirectory]}中检索` : `已为你整理 ${visibleCount} 条相关知识`;
  if (count) count.textContent = `${visibleCount} 条结果`;
  if (empty) empty.hidden = visibleCount !== 0;
}

document.querySelector('[data-knowledge-search-form]')?.addEventListener('submit', event => {
  event.preventDefault();
  filterKnowledgeResults();
});
knowledgeSearchInput?.addEventListener('input', filterKnowledgeResults);
document.querySelectorAll('[data-search-directory]').forEach(button => button.addEventListener('click', () => {
  knowledgeDirectory = button.dataset.searchDirectory;
  document.querySelectorAll('[data-search-directory]').forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  filterKnowledgeResults();
}));

const aiChatDialog = document.querySelector('[data-ai-chat-dialog]');
const aiChatOpen = document.querySelector('[data-ai-chat-open]');
const aiChatInput = document.querySelector('[data-ai-chat-input]');

const aiContext = document.querySelector('[data-ai-context]');
if (aiContext) aiContext.textContent = document.querySelector('.topbar-product')?.textContent.trim() || document.querySelector('.page-title')?.textContent.trim() || '当前页面';

function setAiChatDialog(open) {
  if (!aiChatDialog) return;
  aiChatDialog.classList.toggle('is-open', open);
  aiChatDialog.setAttribute('aria-hidden', String(!open));
  aiChatOpen?.setAttribute('aria-expanded', String(open));
  if (open) window.setTimeout(() => aiChatInput?.focus(), 0);
  else aiChatOpen?.focus();
}

aiChatOpen?.addEventListener('click', () => setAiChatDialog(true));
document.querySelector('[data-ai-chat-close]')?.addEventListener('click', () => setAiChatDialog(false));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && aiChatDialog?.classList.contains('is-open')) setAiChatDialog(false); });

function appendAiMessage(role, message) {
  const messages = document.querySelector('[data-ai-chat-messages]');
  if (!messages) return;
  const item = document.createElement('div');
  item.className = `ai-message ai-message-${role}`;
  const avatar = document.createElement('span');
  avatar.className = 'ai-message-avatar';
  avatar.textContent = role === 'user' ? '我' : 'AI';
  const content = document.createElement('div');
  const label = document.createElement('strong');
  label.className = 'text-small-bold';
  label.textContent = role === 'user' ? '我' : '知识助手';
  const paragraph = document.createElement('p');
  paragraph.className = 'text-normal';
  paragraph.textContent = message;
  content.append(label, paragraph);
  item.append(avatar, content);
  messages.append(item);
  messages.scrollTop = messages.scrollHeight;
}

function appendDirectoryPlan() {
  const messages = document.querySelector('[data-ai-chat-messages]');
  if (!messages) return;
  const item = document.createElement('div');
  item.className = 'ai-message ai-message-assistant';
  item.innerHTML = '<span class="ai-message-avatar">AI</span><div class="ai-plan-card"><strong class="text-small-bold">资源目录初步方案</strong><p class="text-normal">我结合企业知识常见的业务域、知识类型和使用场景，建议先建立以下一级目录：</p><ol><li><strong>制度规范</strong><span>授信管理、风险管理、合规管理</span></li><li><strong>业务指引</strong><span>客户服务、业务操作、岗位手册</span></li><li><strong>产品知识</strong><span>产品说明、办理流程、常见问题</span></li><li><strong>问答知识</strong><span>客户问答、内部咨询</span></li><li><strong>培训与案例</strong><span>培训材料、优秀案例、风险案例</span></li></ol><p class="text-small">后续可依据已入目资源的业务域、知识类型与主题分布继续优化。</p><button class="btn btn-medium btn-primary" type="button" data-apply-directory-plan>应用到资源目录</button></div>';
  messages.append(item);
  messages.scrollTop = messages.scrollHeight;
}

function applyDirectoryPlan(button) {
  const directoryNames = ['制度规范', '业务指引', '产品知识', '问答知识', '培训与案例'];
  localStorage.setItem('kep-ai-directory-plan', JSON.stringify(directoryNames));
  const tree = document.querySelector('.directory-tree');
  document.querySelector('[aria-controls="resource-panel"]')?.click();
  if (tree) {
    const existing = [...tree.querySelectorAll('.directory-item')].map(item => item.textContent.trim());
    directoryNames.filter(name => !existing.some(label => label.includes(name))).forEach(name => {
      const node = document.createElement('button');
      node.className = 'directory-item';
      node.type = 'button';
      node.innerHTML = '<span class="directory-caret">›</span><span></span><span class="source-count">0</span>';
      node.querySelector('span:nth-child(2)').textContent = name;
      tree.append(node);
    });
    button.textContent = '已应用到资源目录';
    button.disabled = true;
    showToast('目录方案已应用，可在资源管理中继续调整');
  } else {
    button.textContent = '方案已保存';
    button.disabled = true;
    appendAiMessage('assistant', '目录方案已保存。进入“资源纳管 > 文档中心 > 资源管理”后即可继续调整。');
  }
}

function answerAiQuestion(question) {
  if (/目录|分类|入目/.test(question)) appendDirectoryPlan();
  else appendAiMessage('assistant', `我已结合当前页面分析“${question}”。你可以继续让我检查元数据完整度、规划加工流程、解释任务状态，或生成可执行的管理建议。`);
}

document.querySelector('[data-ai-chat-form]')?.addEventListener('submit', event => {
  event.preventDefault();
  const question = aiChatInput.value.trim();
  if (!question) { aiChatInput.focus(); return; }
  appendAiMessage('user', question);
  aiChatInput.value = '';
  answerAiQuestion(question);
});

aiChatInput?.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  }
});
document.querySelector('[data-ai-suggestion]')?.addEventListener('click', event => {
  const question = event.currentTarget.dataset.aiSuggestion;
  appendAiMessage('user', question);
  event.currentTarget.remove();
  answerAiQuestion(question);
});
document.addEventListener('click', event => {
  const button = event.target.closest('[data-apply-directory-plan]');
  if (button) applyDirectoryPlan(button);
});

function setDialogState(dialog, open, focusSelector, returnFocus) {
  if (!dialog) return;
  dialog.hidden = !open;
  if (open) window.setTimeout(() => dialog.querySelector(focusSelector)?.focus(), 0);
  else returnFocus?.focus();
}

const modelDialog = document.querySelector('[data-model-dialog]');
const modelDialogTrigger = document.querySelector('[data-open-model-dialog]');
modelDialogTrigger?.addEventListener('click', () => setDialogState(modelDialog, true, '[name="modelName"]'));
document.querySelectorAll('[data-close-model-dialog]').forEach(button => button.addEventListener('click', () => setDialogState(modelDialog, false, '', modelDialogTrigger)));
modelDialog?.addEventListener('click', event => { if (event.target === modelDialog) setDialogState(modelDialog, false, '', modelDialogTrigger); });

const modelSearch = document.querySelector('[data-model-search]');
modelSearch?.addEventListener('input', () => {
  const query = modelSearch.value.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll('[data-model-card]').forEach(card => {
    card.hidden = !card.textContent.toLowerCase().includes(query);
    if (!card.hidden) visible += 1;
  });
  const count = document.querySelector('[data-model-count]');
  if (count) count.textContent = `共 ${visible} 个模型`;
});

function getCustomModels() {
  try {
    const models = JSON.parse(localStorage.getItem('kep-custom-processing-models') || '[]');
    return Array.isArray(models) ? models : [];
  }
  catch { return []; }
}

function appendCustomModelCard(model, prepend = false) {
  const grid = document.querySelector('[data-model-grid]');
  if (!grid) return;
  const card = document.createElement('article');
  card.className = 'model-card';
  card.dataset.modelCard = '';
  card.innerHTML = '<div class="model-card-head"><span class="model-glyph text-medium-bold">自</span><span class="tag tag-status tag-status-secondary">草稿</span></div><h2 class="text-medium-bold"></h2><p class="text-normal"></p><div class="model-tags"></div><div class="model-card-foot text-small"><span>版本 v0.1</span><span>使用 0 次</span></div><button class="btn btn-dense btn-text model-card-action" type="button" data-toast="已打开自定义抽取模型详情">查看模型</button>';
  card.querySelector('h2').textContent = model.name;
  card.querySelector('p').textContent = model.description;
  const tags = card.querySelector('.model-tags');
  (model.fields.length ? model.fields : [model.type]).forEach(field => {
    const tag = document.createElement('span');
    tag.className = 'tag tag-small';
    tag.textContent = field;
    tags.append(tag);
  });
  grid[prepend ? 'prepend' : 'append'](card);
}

getCustomModels().forEach(model => appendCustomModelCard(model));
if (document.querySelector('[data-model-count]')) document.querySelector('[data-model-count]').textContent = `共 ${document.querySelectorAll('[data-model-card]').length} 个模型`;

document.querySelector('[data-model-form]')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const name = data.get('modelName').trim();
  const description = data.get('modelDescription').trim();
  const fields = data.get('modelFields').split(/[,，]/).map(item => item.trim()).filter(Boolean).slice(0, 3);
  const model = { name, description, fields, type: data.get('modelType') };
  appendCustomModelCard(model, true);
  localStorage.setItem('kep-custom-processing-models', JSON.stringify([model, ...getCustomModels()]));
  form.reset();
  setDialogState(modelDialog, false, '', modelDialogTrigger);
  const total = document.querySelectorAll('[data-model-card]').length;
  const count = document.querySelector('[data-model-count]');
  if (count) count.textContent = `共 ${total} 个模型`;
  showToast(`已创建抽取模型“${name}”`);
});

const taskDialog = document.querySelector('[data-task-dialog]');
const taskDialogTrigger = document.querySelector('[data-open-task-dialog]');
const taskForm = document.querySelector('[data-task-form]');
const processingModelSelect = taskForm?.querySelector('[name="processingModel"]');
getCustomModels().forEach(model => {
  const option = document.createElement('option');
  option.textContent = model.name;
  processingModelSelect?.append(option);
});

function taskIdentity() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).formatToParts(now);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  const date = `${values.year}${values.month}${values.day}`;
  const time = `${values.hour}${values.minute}${values.second}`;
  return { name: `知识加工任务-${date}-${time}`, id: `TASK-${date}-${time}` };
}

function openTaskDialog() {
  taskForm?.reset();
  const identity = taskIdentity();
  const name = document.querySelector('[data-task-name]');
  if (name) name.value = identity.name;
  const error = document.querySelector('[data-resource-error]');
  if (error) error.hidden = true;
  setDialogState(taskDialog, true, '[data-task-name]');
}

taskDialogTrigger?.addEventListener('click', openTaskDialog);
document.querySelectorAll('[data-close-task-dialog]').forEach(button => button.addEventListener('click', () => setDialogState(taskDialog, false, '', taskDialogTrigger)));
taskDialog?.addEventListener('click', event => { if (event.target === taskDialog) setDialogState(taskDialog, false, '', taskDialogTrigger); });
taskForm?.querySelectorAll('[name="resource"]').forEach(checkbox => checkbox.addEventListener('change', () => {
  const error = document.querySelector('[data-resource-error]');
  if (error) error.hidden = taskForm.querySelectorAll('[name="resource"]:checked').length > 0;
}));

taskForm?.addEventListener('submit', event => {
  event.preventDefault();
  const resources = [...taskForm.querySelectorAll('[name="resource"]:checked')];
  const error = document.querySelector('[data-resource-error]');
  if (!resources.length) {
    if (error) error.hidden = false;
    taskForm.querySelector('[name="resource"]')?.focus();
    return;
  }
  if (!taskForm.reportValidity()) return;
  const data = new FormData(taskForm);
  const identity = taskIdentity();
  const row = document.createElement('tr');
  row.innerHTML = '<td class="cell-primary"><span data-new-task-name></span><span class="cell-secondary text-small" data-new-task-id></span></td><td data-new-task-resource></td><td data-new-task-model></td><td data-new-large-model></td><td data-new-task-time></td><td><span class="tag tag-status tag-status-blue">排队中</span></td><td><button class="btn btn-dense btn-text" data-toast="已打开任务详情">查看</button></td>';
  row.querySelector('[data-new-task-name]').textContent = data.get('taskName');
  row.querySelector('[data-new-task-id]').textContent = identity.id;
  row.querySelector('[data-new-task-resource]').textContent = resources.length === 1 ? resources[0].value : `${resources[0].value} 等 ${resources.length} 个文件`;
  row.querySelector('[data-new-task-model]').textContent = data.get('processingModel');
  row.querySelector('[data-new-large-model]').textContent = data.get('largeModel');
  row.querySelector('[data-new-task-time]').textContent = new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
  document.querySelector('[data-task-rows]')?.prepend(row);
  const total = document.querySelector('[data-task-total]');
  if (total) total.textContent = String(Number(total.textContent.replaceAll(',', '')) + 1);
  setDialogState(taskDialog, false, '', taskDialogTrigger);
  showToast(`加工任务“${data.get('taskName')}”已创建`);
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (modelDialog && !modelDialog.hidden) setDialogState(modelDialog, false, '', modelDialogTrigger);
  if (taskDialog && !taskDialog.hidden) setDialogState(taskDialog, false, '', taskDialogTrigger);
});
