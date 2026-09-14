import { createTaskFileResult } from './task-file-results.js?v=1';
import { renderShell } from './shell.js?v=43';

const platformStylesheet = document.querySelector('link[href*="platform.css"]');
if (platformStylesheet) {
  const stylesheetUrl = new URL(platformStylesheet.href);
  stylesheetUrl.searchParams.set('v', '44');
  platformStylesheet.href = stylesheetUrl.href;
}

renderShell();
document.querySelector('[data-resource-directory-nav-toggle]')?.addEventListener('click',event=>{
  const group=event.currentTarget.closest('.resource-directory-nav-group');
  const expanded=group.classList.toggle('is-expanded');
  event.currentTarget.setAttribute('aria-expanded',String(expanded));
});
const template = document.querySelector('template[data-page-template]');
if (template) document.querySelector('[data-page-content]').append(template.content.cloneNode(true));
import('./publishing.js?v=2');

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
      <div class="ai-message ai-message-assistant"><span class="ai-message-avatar">AI</span><div><strong class="text-small-bold">知识助手</strong><p class="text-normal">你好，我会结合你当前所在的页面，协助完成资源纳管、知识生产、知识资产和知识应用工作。</p></div></div>
      <button class="ai-suggestion" type="button" data-ai-suggestion="你先帮我初步构建一个资源管理的目录">帮我初步构建资源管理目录</button>
    </div>
    <form class="ai-chat-composer" data-ai-chat-form><label class="input-wrap"><textarea class="input ai-chat-input" rows="3" data-ai-chat-input placeholder="描述你希望 AI 协助完成的工作" aria-label="输入给知识工程 AI 助手的消息"></textarea></label><div class="ai-composer-foot"><span class="text-small">Enter 发送 · Shift + Enter 换行</span><button class="btn btn-medium btn-primary" type="submit">发送</button></div></form>
  </aside>`;
document.body.append(aiAssistant);

const themeSwitch = document.querySelector('#theme-switch');
const savedTheme = localStorage.getItem('kep-theme') || 'light';
document.documentElement.dataset.theme = savedTheme;
if (themeSwitch) themeSwitch.checked = savedTheme === 'dark';
themeSwitch?.addEventListener('change', () => {
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
  if (table?.id === 'resource-table') {
    applyResourceFileFilters();
    return;
  }
  const query = input.value.trim().toLowerCase();
  table?.querySelectorAll('tbody tr').forEach(row => { row.hidden = !row.textContent.toLowerCase().includes(query); });
}));
document.querySelectorAll('[data-category-mode]').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('[data-category-mode]').forEach(x=>{const on=x===tab;x.classList.toggle('is-active',on);x.setAttribute('aria-selected',String(on))});document.querySelectorAll('[data-category-tree]').forEach(x=>x.hidden=x.dataset.categoryTree!==tab.dataset.categoryMode)}));
document.querySelector('[data-data-category-search]')?.addEventListener('input',e=>{const q=e.currentTarget.value.trim().toLowerCase();document.querySelectorAll('[data-category-tree]:not([hidden]) .data-category-item').forEach(x=>x.hidden=!x.textContent.toLowerCase().includes(q))});
document.querySelectorAll('[data-data-category]').forEach(button=>button.addEventListener('click',()=>{const c=button.dataset.dataCategory;document.querySelectorAll('[data-data-category]').forEach(x=>x.classList.toggle('is-active',x===button));document.querySelectorAll('[data-category-row]').forEach(row=>row.hidden=c!=='all'&&!row.dataset.categoryRow.split(' ').includes(c))}));
document.querySelectorAll('[data-data-view]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-data-view]').forEach(x=>x.classList.toggle('is-active',x===button));document.querySelector('.data-list-panel')?.classList.toggle('is-card-view',button.dataset.dataView==='card')}));

document.querySelectorAll('[data-tabs]').forEach(scope => {
  const tablist = scope.querySelector(':scope > [role="tablist"]');
  const tabs = [...(tablist?.querySelectorAll(':scope > [role="tab"]') || [])];
  const activateTab = tab => {
    tabs.forEach(item => { item.classList.toggle('is-active', item === tab); item.setAttribute('aria-selected', String(item === tab)); });
    tabs.forEach(item => { item.tabIndex = item === tab ? 0 : -1; });
    scope.querySelectorAll(':scope > [role="tabpanel"]').forEach(panel => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
  };
  tabs.forEach(tab => {
    tab.tabIndex = tab.classList.contains('is-active') ? 0 : -1;
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', event => {
      const currentIndex = tabs.indexOf(tab);
      const nextIndex = event.key === 'ArrowRight' ? (currentIndex + 1) % tabs.length : event.key === 'ArrowLeft' ? (currentIndex - 1 + tabs.length) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1;
      if (nextIndex < 0) return;
      event.preventDefault();
      activateTab(tabs[nextIndex]);
      tabs[nextIndex].focus();
    });
  });
});

const personalFolderTitles = {
  all: '全部文件', work: '工作资料', study: '学习资料', draft: '临时文件',
  'shared-project': '零售项目资料', 'shared-policy': '制度研究资料'
};

function activatePersonalFolder(button) {
  const folder = button.dataset.personalFolder;
  document.querySelectorAll('[data-personal-folder]').forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  let visible = 0;
  document.querySelectorAll('[data-personal-folder-row]').forEach(row => {
    const show = folder === 'all' || row.dataset.personalFolderRow === folder;
    row.hidden = !show;
    if (show) visible += 1;
  });
  const title = document.querySelector('[data-personal-folder-title]');
  const count = document.querySelector('[data-file-count]');
  if (title) title.textContent = personalFolderTitles[folder] || button.querySelector('span')?.textContent || '文件夹';
  if (count) count.textContent = `${visible} 条结果`;
}

document.querySelector('.personal-folder-tree')?.addEventListener('click',event=>{
  const button=event.target.closest('[data-personal-folder]');
  if(button)activatePersonalFolder(button);
});

const personalOwnedFolderContainer=document.querySelector('.folder-root-group:first-child .folder-children');
const personalFolderDialog=document.querySelector('[data-personal-folder-dialog]');
const personalFolderForm=document.querySelector('[data-personal-folder-form]');
const personalFolderStorageKey='kep-personal-folder-tree';
let pendingPersonalFolderParent=null;
let personalCustomFolders=[{id:'work',name:'工作资料',count:34,children:[]},{id:'study',name:'学习资料',count:27,children:[]},{id:'draft',name:'临时文件',count:12,children:[]}];
try{const saved=JSON.parse(localStorage.getItem(personalFolderStorageKey)||'null');if(Array.isArray(saved))personalCustomFolders=saved}catch{}
const escapePersonalFolder=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function personalFolderNodeMarkup(folder){return `<div class="personal-folder-node" data-personal-folder-node="${folder.id}"><div class="personal-folder-row"><button class="personal-folder-item" type="button" data-personal-folder="${folder.id}" aria-pressed="false"><span>${escapePersonalFolder(folder.name)}</span><span class="source-count">${folder.count||0}</span></button><button class="personal-folder-add-child" type="button" data-add-personal-folder="${folder.id}" aria-label="在${escapePersonalFolder(folder.name)}下新建子文件夹">＋</button></div><div class="personal-folder-subtree">${(folder.children||[]).map(personalFolderNodeMarkup).join('')}</div></div>`}
function renderPersonalCustomFolders(){if(!personalOwnedFolderContainer)return;personalOwnedFolderContainer.querySelectorAll('[data-personal-folder-node]').forEach(node=>node.remove());personalCustomFolders.forEach(folder=>personalOwnedFolderContainer.insertAdjacentHTML('beforeend',personalFolderNodeMarkup(folder)));const register=folders=>folders.forEach(folder=>{personalFolderTitles[folder.id]=folder.name;register(folder.children||[])});register(personalCustomFolders)}
function findPersonalFolder(folders,id){for(const folder of folders){if(folder.id===id)return folder;const child=findPersonalFolder(folder.children||[],id);if(child)return child}return null}
function openPersonalFolderDialog(parentId=null){pendingPersonalFolderParent=parentId;personalFolderForm.reset();const parent=parentId?findPersonalFolder(personalCustomFolders,parentId):null;document.querySelector('[data-personal-folder-dialog-title]').textContent=parent?'新建子文件夹':'新建文件夹';document.querySelector('[data-personal-folder-parent]').textContent=parent?.name||'我的文件夹';setDialogState(personalFolderDialog,true,'[name="personalFolderName"]')}
document.querySelector('[data-open-personal-folder]')?.addEventListener('click',()=>openPersonalFolderDialog());
personalOwnedFolderContainer?.addEventListener('click',event=>{const trigger=event.target.closest('[data-add-personal-folder]');if(trigger){event.stopPropagation();openPersonalFolderDialog(trigger.dataset.addPersonalFolder)}});
document.querySelectorAll('[data-personal-folder-close]').forEach(button=>button.addEventListener('click',()=>setDialogState(personalFolderDialog,false)));
personalFolderDialog?.addEventListener('click',event=>{if(event.target===personalFolderDialog)setDialogState(personalFolderDialog,false)});
personalFolderForm?.addEventListener('submit',event=>{event.preventDefault();if(!personalFolderForm.reportValidity())return;const name=String(new FormData(personalFolderForm).get('personalFolderName')||'').trim(),parent=pendingPersonalFolderParent?findPersonalFolder(personalCustomFolders,pendingPersonalFolderParent):null,siblings=parent?(parent.children||(parent.children=[])):personalCustomFolders;if(siblings.some(folder=>folder.name===name))return showToast('同级文件夹名称已存在');const folder={id:`personal-folder-${Date.now()}`,name,children:[]};siblings.push(folder);localStorage.setItem(personalFolderStorageKey,JSON.stringify(personalCustomFolders));renderPersonalCustomFolders();setDialogState(personalFolderDialog,false);const button=document.querySelector(`[data-personal-folder="${folder.id}"]`);if(button)activatePersonalFolder(button);showToast(`已创建文件夹“${name}”`)});
renderPersonalCustomFolders();

document.querySelectorAll('[data-folder-root]').forEach(button => button.addEventListener('click', () => {
  const expanded = button.classList.toggle('is-expanded');
  button.setAttribute('aria-expanded', String(expanded));
}));

document.querySelector('[data-folder-search]')?.addEventListener('input', event => {
  const query = event.currentTarget.value.trim().toLowerCase();
  document.querySelectorAll('.personal-folder-node').forEach(node=>{node.hidden=Boolean(query)&&!node.textContent.toLowerCase().includes(query)});
  document.querySelectorAll('.personal-folder-item:not(.personal-folder-row .personal-folder-item)').forEach(item => { item.hidden = Boolean(query)&&!item.textContent.toLowerCase().includes(query); });
});

document.querySelectorAll('[data-bar]').forEach(bar => { bar.style.width = `${bar.dataset.bar}%`; });

const notificationPanelNode = document.querySelector('[data-notification-panel]');
if (notificationPanelNode) {
  notificationPanelNode.setAttribute('aria-label', '任务消息中心');
  notificationPanelNode.innerHTML = '<div class="notification-header"><div><strong class="text-normal-bold">任务消息</strong><span class="text-small notification-summary" data-task-summary>暂无任务消息</span></div><a class="btn btn-dense btn-text" href="resource-tasks.html">进入任务中心</a></div><div class="task-category-tabs" role="group" aria-label="任务分类"><button class="task-category is-active" type="button" data-task-filter="all" aria-pressed="true">全部</button><button class="task-category" type="button" data-task-filter="upload" aria-pressed="false">上传任务</button><button class="task-category" type="button" data-task-filter="catalog" aria-pressed="false">智能处理</button></div><div class="task-center-list"><section class="task-section" data-task-section="upload"><div class="task-section-title text-small-bold">上传任务通知</div><div class="upload-task-list" data-upload-task-list><div class="upload-empty text-small" data-upload-empty>暂无上传任务</div></div></section><section class="task-section" data-task-section="catalog"><div class="task-section-title text-small-bold">知识源处理通知</div><div class="catalog-task-list" data-catalog-task-list><div class="upload-empty text-small" data-catalog-empty>暂无处理任务</div></div></section></div>';
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

document.querySelectorAll('[data-local-upload]').forEach(button => button.addEventListener('click', () => {
  button.closest('.page-actions')?.querySelector('[data-local-file-input]')?.click();
}));
document.querySelectorAll('[data-local-file-input]').forEach(input => input.addEventListener('change', () => {
  const files = [...input.files];
  if (!files.length) return;
  const targetSpace = document.body.dataset.page === 'documents-personal' || input.closest('#personal-space-panel') ? 'personal' : document.body.dataset.page === 'documents-team' || input.closest('#team-space-panel') ? 'team' : 'enterprise';
  files.forEach(file => startUploadTask(file, targetSpace));
  input.value = '';
  notificationPanel.hidden = false;
  notificationToggle?.setAttribute('aria-expanded', 'true');
}));

function startUploadTask(file, targetSpace = 'enterprise') {
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
      appendUploadedFile(file, targetSpace);
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
  const cataloging = [...document.querySelectorAll('.catalog-task,.task-notice')].filter(task => !task.classList.contains('is-complete')).length;
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
  const sourceName = document.querySelector('[data-knowledge-source].is-active .source-label strong')?.textContent || '全部知识源';
  button.closest('.catalog-recommendation').innerHTML = `<strong class="text-small-bold">已完成入目</strong><span class="text-small">3 份内容已归属到“${sourceName} / ${name}”</span>`;
  const status = button.closest('.catalog-task').querySelector('[data-catalog-status]');
  status.textContent = '已完成';
  showToast(`已创建“${name}”并完成入目`);
});

function appendUploadedFile(file, targetSpace = 'enterprise') {
  const personalSpace = targetSpace === 'personal';
  const teamSpace = targetSpace === 'team';
  const body = document.querySelector(personalSpace ? '#personal-document-table tbody' : teamSpace ? '#team-document-table tbody' : '#document-table tbody');
  if (!body) return;
  const row = document.createElement('tr');
  row.dataset.sourceGroup = 'local';
  const extension = file.name.includes('.') ? file.name.split('.').pop().toUpperCase() : '文件';
  if (teamSpace) {
    row.dataset.teamFolderRow = 'plan';
    row.innerHTML = '<td class="cell-primary"><a class="document-link" href="document-detail.html" data-uploaded-name></a><span class="cell-secondary text-small" data-uploaded-meta></span></td><td data-uploaded-type></td><td><span class="tag tag-status tag-status-blue">团队共享</span></td><td class="text-number">v1.0</td><td data-uploaded-time></td><td>当前用户</td><td class="cell-actions"><button class="btn btn-dense btn-text" data-update-file>更新</button></td>';
    const nameLink = row.querySelector('[data-uploaded-name]');
    nameLink.textContent = file.name;
    nameLink.href = `space-file-detail.html?file=${encodeURIComponent(file.name)}&space=team`;
    row.querySelector('[data-uploaded-meta]').textContent = `${extension} · ${formatFileSize(file.size)}`;
    row.querySelector('[data-uploaded-type]').textContent = extension;
    row.querySelector('[data-uploaded-time]').textContent = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date());
    body.prepend(row);
    ensureFileMoreMenu(row);
    const count = document.querySelector('[data-team-file-count]');
    if (count) count.textContent = `${body.querySelectorAll('tr').length} 条结果`;
    return;
  }
  row.dataset.personalFolderRow = personalSpace ? 'work' : '';
  row.innerHTML = `<td class="cell-primary"><a class="document-link" href="document-detail.html" data-uploaded-name></a><span class="cell-secondary text-small" data-uploaded-meta></span></td><td data-uploaded-type></td><td><span class="tag tag-status ${personalSpace ? 'tag-status-secondary' : 'tag-status-lime'}">${personalSpace ? '仅自己' : '已解析'}</span></td><td class="text-number">v1.0</td><td data-uploaded-created></td><td data-uploaded-time></td><td>当前用户</td><td class="cell-actions"><button class="btn btn-dense btn-text" ${personalSpace ? 'data-open-share-dialog' : 'data-toast="分享设置已打开"'}>分享</button><button class="btn btn-dense btn-text" data-update-file>更新</button></td>`;
  const nameLink = row.querySelector('[data-uploaded-name]');
  nameLink.textContent = file.name;
  nameLink.href = personalSpace
    ? `personal-file-detail.html?file=${encodeURIComponent(file.name)}`
    : `space-file-detail.html?file=${encodeURIComponent(file.name)}&space=enterprise`;
  row.querySelector('[data-uploaded-meta]').textContent = `${extension} · ${formatFileSize(file.size)}`;
  row.querySelector('[data-uploaded-type]').textContent = extension;
  const time = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date());
  row.querySelector('[data-uploaded-created]').textContent = time;
  row.querySelector('[data-uploaded-time]').textContent = time;
  body.prepend(row);
  if (personalSpace) ensureFileMoreMenu(row);
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function filterKnowledgeSource(button) {
  const tree = button.closest('[data-knowledge-source-tree]');
  if (!tree) return;
  const sourceId = button.dataset.knowledgeSource;
  const sourceKind = button.dataset.sourceKind || button.closest('[data-source-kind]')?.dataset.sourceKind || 'unstructured';
  tree.querySelectorAll('[data-knowledge-source]').forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  const visibleCount = applyResourceFileFilters();
  const titleNode = document.querySelector('[data-resource-title]');
  const summaryNode = document.querySelector('[data-resource-summary]');
  const countNode = document.querySelector('[data-resource-count]');
  const emptyNode = document.querySelector('[data-resource-source-empty]');
  const emptyMessage = document.querySelector('[data-resource-empty-message]');
  const sourceName = button.querySelector('.source-label strong')?.textContent || '全部知识源';
  const kindLabel = sourceKind === 'structured' ? '结构化数据' : sourceKind === 'graph' ? '图数据' : '非结构化数据';
  if (titleNode) titleNode.textContent = sourceId === 'all' ? `全部${kindLabel}` : sourceName;
  if (summaryNode) summaryNode.textContent = sourceId === 'all' ? `展示已配置知识源下的${kindLabel}` : `当前展示“${sourceName}”下的内容`;
  if (countNode) countNode.textContent = `${visibleCount} 条结果`;
  if (emptyNode) emptyNode.hidden = visibleCount !== 0;
  if (emptyMessage && sourceId === 'oracle') emptyMessage.textContent = '该知识源尚未完成认证，完成连接并同步后将在此展示内容。';
}

function applyResourceFileFilters() {
  const table = document.querySelector('#resource-table');
  if (!table) return 0;
  const activeSource = document.querySelector('[data-knowledge-source-tree] [data-knowledge-source].is-active');
  const sourceId = activeSource?.dataset.knowledgeSource || 'all';
  const sourceKind = activeSource?.dataset.sourceKind || activeSource?.closest('[data-source-kind]')?.dataset.sourceKind || 'unstructured';
  const fileType = document.querySelector('[data-file-type-filter]')?.value || 'all';
  const query = document.querySelector('[data-table-search="#resource-table"]')?.value.trim().toLowerCase() || '';
  let visibleCount = 0;
  table.querySelectorAll('tbody tr[data-knowledge-source-row]').forEach(row => {
    const sourceMatches = row.dataset.sourceKind === sourceKind && (sourceId === 'all' || row.dataset.knowledgeSourceRow === sourceId);
    const typeMatches = fileType === 'all' || row.dataset.fileType === fileType;
    const queryMatches = !query || row.textContent.toLowerCase().includes(query);
    const visible = sourceMatches && typeMatches && queryMatches;
    row.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  const countNode = document.querySelector('[data-resource-count]');
  if (countNode) countNode.textContent = `${visibleCount} 条结果`;
  return visibleCount;
}

function setupDocumentFileTypes() {
  const rows = [...document.querySelectorAll('#resource-table tbody tr[data-knowledge-source-row]')];
  if (!rows.length) return;
  const examples = [
    ['对公授信审查办法.pdf', 'PDF'],
    ['固定资产贷款管理办法.docx', 'Word'],
    ['客户风险评级服务设计.txt', 'TXT'],
    ['征信接口流程图.png', '图片'],
    ['授信规则培训视频.mp4', '视频'],
    ['2025年授信档案汇编.pdf', 'PDF'],
    ['历史合同扫描件.jpg', '图片'],
    ['风险模型说明.txt', 'TXT']
  ];
  rows.forEach((row, index) => {
    const [name, type] = examples[index] || [row.querySelector('.document-link')?.textContent.trim(), row.children[1]?.textContent.trim()];
    const link = row.querySelector('.document-link');
    if (link && name) {
      link.textContent = name;
      link.href = `space-file-detail.html?file=${encodeURIComponent(name)}`;
    }
    row.dataset.fileType = type;
    if (row.children[1]) row.children[1].innerHTML = `<span class="tag tag-small">${type}</span>`;
  });
  const toolbar = document.querySelector('.source-content-panel .personal-file-toolbar');
  const spacer = toolbar?.querySelector('.toolbar-spacer');
  if (!toolbar || !spacer || toolbar.querySelector('[data-file-type-filter]')) return;
  const field = document.createElement('label');
  field.className = 'field file-type-filter';
  field.innerHTML = '<span class="input-wrap input-middle"><select class="input" data-file-type-filter aria-label="按文件类型筛选"><option value="all">全部类型</option><option value="PDF">PDF</option><option value="Word">Word</option><option value="TXT">TXT</option><option value="图片">图片</option><option value="视频">视频</option></select></span>';
  toolbar.insertBefore(field, spacer);
  field.querySelector('[data-file-type-filter]').addEventListener('change', applyResourceFileFilters);
}

setupDocumentFileTypes();

const sourceKindTabs = document.querySelector('[data-source-kind-tabs]');

function activateSourceKind(kind) {
  const tree = document.querySelector('[data-knowledge-source-tree]');
  if (!tree) return;
  sourceKindTabs?.querySelectorAll('[data-source-kind-tab]').forEach(tab => {
    const active = tab.dataset.sourceKindTab === kind;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  tree.querySelectorAll('[data-source-kind]').forEach(item => { item.hidden = item.dataset.sourceKind !== kind; });
  const search = document.querySelector('[data-source-directory-search]');
  if (search) search.value = '';
  const count = document.querySelector('[data-connected-source-count]');
  if (count) count.textContent = kind === 'structured' ? '3' : '6';
  closeSourceFunctionMenus();
  const allButton = tree.querySelector(`[data-knowledge-source="all"][data-source-kind="${kind}"]`);
  if (allButton) filterKnowledgeSource(allButton);
}

sourceKindTabs?.addEventListener('click', event => {
  const tab = event.target.closest('[data-source-kind-tab]');
  if (tab) activateSourceKind(tab.dataset.sourceKindTab);
});
if (sourceKindTabs) activateSourceKind('unstructured');

document.querySelector('.source-panel')?.addEventListener('click', event => {
  const button = event.target.closest('[data-knowledge-source]');
  if (button) filterKnowledgeSource(button);
});

function closeSourceFunctionMenus(except = null) {
  document.querySelectorAll('[data-source-function]').forEach(trigger => {
    const menu = trigger.parentElement.querySelector('.source-function-menu');
    const open = trigger === except;
    trigger.setAttribute('aria-expanded', String(open));
    if (menu) menu.hidden = !open;
  });
}

function getClassificationResults() {
  try {
    const results = JSON.parse(localStorage.getItem('kep-source-classification-results') || '[]');
    return Array.isArray(results) ? results : [];
  } catch { return []; }
}

const sourceClassificationPaths = {
  gitlab: ['客户风险评级服务设计', '征信接口变更记录'],
  confluence: ['对公授信审查办法', '固定资产贷款管理办法'],
  postgresql: ['customer_profile', 'customer_risk_rating'],
  mysql: ['transaction_summary', 'account_flow'],
  jira: ['CREDIT-2841 授信审查规则异常'],
  s3: ['2025年授信档案汇编', '历史合同归档'],
  github: ['风险模型说明'],
  's3-docs': ['2025年授信档案汇编'],
  's3-images': ['客户尽调影像包'],
  's3-videos': ['授信业务审查培训视频']
};
const suggestedCatalogPath = name => /风险|征信|授信/.test(name) ? '金融业务 / 信贷业务 / 风险管理' : /合同|档案/.test(name) ? '企业治理 / 法律合规 / 合同管理' : /customer|客户/.test(name) ? '金融业务 / 零售金融 / 客户服务' : '信息科技 / 数据治理';
// Keep historical tagging tasks in the merged metadata task category.
function normalizeSourceTask(task) {
  const taskName = task.taskName === '自动打标' || task.taskType === 'tag'
    ? '元数据补充'
    : task.taskName === '连接器同步' ? '知识源同步' : task.taskName;
  return { ...task, taskName };
}
function getSourceTasks(){try{const tasks=JSON.parse(localStorage.getItem('kep-source-processing-tasks')||'[]');return Array.isArray(tasks)?tasks.map(normalizeSourceTask):[]}catch{return[]}}
function saveSourceTasks(tasks){localStorage.setItem('kep-source-processing-tasks',JSON.stringify(tasks))}
function renderSourceTaskNotices(){const list=document.querySelector('[data-catalog-task-list]'),tasks=getSourceTasks().slice(0,5);if(!list||!tasks.length)return;document.querySelector('[data-catalog-empty]')?.remove();list.innerHTML=tasks.map(item=>`<article class="task-notice ${item.status==='已完成'?'is-complete':''}"><div class="task-notice-head"><div><strong class="text-small-bold">${item.taskName}</strong><p class="text-small">${item.sourceName} · ${item.fileCount} 个文件</p></div><span class="tag tag-status ${item.status==='已完成'?'tag-status-lime':'tag-status-blue'}">${item.status}</span></div><a class="btn btn-dense btn-text task-notice-link" href="resource-task-detail.html?task=${encodeURIComponent(item.id)}">${item.status==='已完成'?'任务已完成，查看详情':'进入任务中心查看'}</a></article>`).join('');updateTaskCenterSummary()}
function renderSourceTasks(){const body=document.querySelector('[data-resource-task-rows]');if(!body)return;getSourceTasks().slice().reverse().forEach(item=>{const row=document.createElement('tr'),completed=item.status==='已完成';row.dataset.sourceTaskId=item.id;row.dataset.resourceTaskRow=item.taskName;row.innerHTML=`<td class="cell-primary">${item.sourceName} · ${item.taskName}<span class="cell-secondary text-small">${item.id}</span></td><td>${item.taskName}</td><td>${item.sourceName}</td><td>当前用户</td><td>${item.startedAt}</td><td>${item.result}</td><td><span class="tag tag-status ${completed?'tag-status-lime':'tag-status-blue'}">${item.status}</span></td><td><a class="btn btn-dense btn-text" href="resource-task-detail.html?task=${encodeURIComponent(item.id)}">查看</a></td>`;body.prepend(row)});const taskId=new URLSearchParams(location.search).get('task'),task=taskId&&getSourceTasks().find(item=>item.id===taskId),detail=document.querySelector('[data-source-task-detail]');if(!task||!detail)return;detail.hidden=false;detail.innerHTML=`<header><div><h2 class="text-medium-bold">${task.sourceName} · ${task.taskName}</h2><p class="text-small">${task.id}</p></div><span class="tag tag-status ${task.status==='已完成'?'tag-status-lime':'tag-status-blue'}">${task.status}</span></header><div class="source-task-detail-grid"><div><span class="text-small">任务维度</span><strong>知识源</strong></div><div><span class="text-small">处理范围</span><strong>${task.fileCount} 个文件</strong></div><div><span class="text-small">开始时间</span><strong>${task.startedAt}</strong></div><div><span class="text-small">执行结果</span><strong>${task.result}</strong></div></div>${task.taskType==='catalog'&&task.status==='已完成'?'<div class="asset-section-actions"><a class="btn btn-medium btn-primary" href="asset-catalogs.html?review=classification">查看并确认分类结果</a></div>':''}`;document.querySelector(`[data-source-task-id="${CSS.escape(taskId)}"]`)?.classList.add('is-highlighted')}
renderSourceTaskNotices();renderSourceTasks();

document.querySelectorAll('[data-resource-task-type]').forEach(button => button.addEventListener('click', () => {
  const type = button.dataset.resourceTaskType;
  document.querySelectorAll('[data-resource-task-type]').forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('[data-resource-task-row]').forEach(row => {
    row.hidden = type !== 'all' && row.dataset.resourceTaskRow !== type;
  });
}));

function startSourceTask(row, taskType) {
  const sourceButton = row.querySelector('[data-knowledge-source]');
  const sourceId = sourceButton.dataset.knowledgeSource;
  const sourceName = sourceButton.querySelector('.source-label strong')?.textContent.trim() || '当前知识源';
  const fileNames = sourceClassificationPaths[sourceId] || [];
  const taskNames = { metadata: '元数据补充', tag: '元数据补充', catalog: '自动入目' };
  const taskName = taskNames[taskType] || '知识源处理';
  const taskId = `TASK-S-${Date.now()}`;
  const startedAt = new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
  const savedTasks = getSourceTasks();
  savedTasks.unshift({ id: taskId, taskType, taskName, sourceId, sourceName, fileNames: [...fileNames], fileCount: fileNames.length, startedAt, status: '执行中', result: '正在处理知识源下的全部文件' });
  saveSourceTasks(savedTasks);
  const taskList = document.querySelector('[data-catalog-task-list]');
  document.querySelector('[data-catalog-empty]')?.remove();
  const task = document.createElement('article');
  task.className = 'task-notice';
  task.innerHTML = `<div class="task-notice-head"><div><strong class="text-small-bold">${taskName}</strong><p class="text-small">${sourceName} · ${fileNames.length} 个文件</p></div><span class="tag tag-status tag-status-blue" data-catalog-status>执行中</span></div><a class="btn btn-dense btn-text task-notice-link" href="resource-task-detail.html?task=${taskId}">进入任务中心查看</a>`;
  taskList?.prepend(task);
  notificationPanel.hidden = false;
  notificationToggle?.setAttribute('aria-expanded', 'true');
  document.querySelector('[data-task-filter="catalog"]')?.click();
  updateTaskCenterSummary();
  let progress = 0;
  const timer = window.setInterval(() => {
    progress = Math.min(100, progress + 20);
    if (progress < 100) return;
    window.clearInterval(timer);
    task.classList.add('is-complete');
    const status = task.querySelector('[data-catalog-status]');
    status.className = 'tag tag-status tag-status-lime';
    if (taskType === 'metadata' || taskType === 'tag') {
      status.textContent = '已完成';
      document.querySelectorAll(`#resource-table tr[data-knowledge-source-row="${sourceId}"] .metadata-completeness`).forEach(node => {
        node.querySelector('.text-number').textContent = '10/10';
        node.querySelector('[data-bar]').style.width = '100%';
        node.querySelector('small').textContent = '100%';
      });
    } else if (taskType === 'catalog') {
      status.textContent = '已完成';
      const current = getClassificationResults().filter(item => item.sourceId !== sourceId);
      const results = fileNames.map((fileName, index) => ({ id: `${sourceId}-${Date.now()}-${index}`, sourceId, sourceName, fileName, path: suggestedCatalogPath(fileName), status: 'pending' }));
      localStorage.setItem('kep-source-classification-results', JSON.stringify([...current, ...results]));
    } else {
      status.textContent = '已完成';
    }
    const tasks = getSourceTasks();
    const savedTask = tasks.find(item => item.id === taskId);
    if (savedTask) {
      savedTask.status = '已完成';
      if (taskType === 'metadata' || taskType === 'tag') {
        savedTask.fileResults = fileNames.map(createTaskFileResult);
      }
      savedTask.result = (taskType === 'metadata' || taskType === 'tag')
        ? `${fileNames.length} 个文件已处理，请核对元数据与标签结果`
        : taskType === 'catalog'
          ? `已生成 ${fileNames.length} 项目录分类建议，等待用户确认`
          : `${fileNames.length} 个文件已完成自动打标，共生成 ${fileNames.length * 3} 个标签关联`;
      saveSourceTasks(tasks);
    }
    task.querySelector('.task-notice-link').textContent = '任务已完成，查看详情';
    updateTaskCenterSummary();
    showToast(`${sourceName}的${taskName}任务已完成`);
  }, 240);
}

document.querySelector('[data-knowledge-source-tree]')?.addEventListener('click', event => {
  const trigger = event.target.closest('[data-source-function]');
  if (trigger) {
    event.stopPropagation();
    closeSourceFunctionMenus(trigger.getAttribute('aria-expanded') === 'true' ? null : trigger);
    return;
  }
  const action = event.target.closest('[data-source-task]');
  if (!action) return;
  event.stopPropagation();
  const row = action.closest('.source-tree-row');
  closeSourceFunctionMenus();
  startSourceTask(row, action.dataset.sourceTask);
});
document.querySelector('[data-source-directory-search]')?.addEventListener('input', event => {
  const query = event.currentTarget.value.trim().toLowerCase();
  const tree = document.querySelector('[data-knowledge-source-tree]');
  const activeKind = sourceKindTabs?.querySelector('[data-source-kind-tab].is-active')?.dataset.sourceKindTab || tree?.querySelector('[data-knowledge-source="all"]')?.dataset.sourceKind || 'unstructured';
  tree?.querySelectorAll(':scope > .source-tree-row').forEach(row => {
    row.hidden = row.dataset.sourceKind !== activeKind || !row.textContent.toLowerCase().includes(query);
  });
  tree?.querySelectorAll(':scope > .source-tree-item:not([data-knowledge-source="all"])').forEach(item => {
    item.hidden = item.dataset.sourceKind !== activeKind || !item.textContent.toLowerCase().includes(query);
  });
  const allSources = tree?.querySelector(`:scope > [data-knowledge-source="all"][data-source-kind="${activeKind}"]`);
  if (allSources) allSources.hidden = Boolean(query);
});
document.addEventListener('click', event => { if (!event.target.closest('.source-tree-row')) closeSourceFunctionMenus(); });

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
  document.querySelector('[aria-controls="resource-panel"]')?.click();
  button.textContent = '已保存为知识源目录方案';
  button.disabled = true;
  appendAiMessage('assistant', '目录方案已保存，可进入企业空间后按知识源分别应用。');
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
const processingTypeSelect = taskForm?.querySelector('[name="processingType"]');
let scheduledTimeField;
let scheduledTimeInput;
if (taskForm) {
  const schedulePicker = document.createElement('fieldset');
  schedulePicker.className = 'task-schedule-picker task-form-full';
  schedulePicker.innerHTML = `<legend class="field-label">任务执行时间</legend><div class="task-schedule-options"><label class="control"><input class="radio" type="radio" name="executionMode" value="now" checked/><span class="control-label"><strong>立即执行</strong><small>任务创建后立即进入队列</small></span></label><label class="control"><input class="radio" type="radio" name="executionMode" value="scheduled"/><span class="control-label"><strong>预约执行</strong><small>到达指定时间后自动开始</small></span></label></div><label class="field task-scheduled-time" data-scheduled-time hidden><span class="field-label">预约日期与时间</span><span class="input-wrap input-middle"><input class="input" type="datetime-local" name="scheduledAt"/></span><span class="field-hint">只能选择当前时间之后的时间</span></label>`;
  taskForm.querySelector('.task-form-grid')?.append(schedulePicker);
  scheduledTimeField = schedulePicker.querySelector('[data-scheduled-time]');
  scheduledTimeInput = schedulePicker.querySelector('[name="scheduledAt"]');
  const executionHeader = document.querySelector('#processing-task-table thead th:nth-child(6)');
  if (executionHeader) executionHeader.textContent = '执行时间';
}

function localDateTimeValue(date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function updateExecutionSchedule() {
  if (!taskForm || !scheduledTimeField || !scheduledTimeInput) return;
  const scheduled = taskForm.elements.executionMode?.value === 'scheduled';
  scheduledTimeField.hidden = !scheduled;
  scheduledTimeInput.disabled = !scheduled;
  scheduledTimeInput.required = scheduled;
  const earliest = new Date(Date.now() + 5 * 60 * 1000);
  scheduledTimeInput.min = localDateTimeValue(earliest);
  if (scheduled && (!scheduledTimeInput.value || new Date(scheduledTimeInput.value) < earliest)) {
    scheduledTimeInput.value = localDateTimeValue(new Date(Date.now() + 60 * 60 * 1000));
  }
}
taskForm?.querySelectorAll('[name="executionMode"]').forEach(radio => radio.addEventListener('change', updateExecutionSchedule));

const processingResourceSpaces = {
  enterprise: { name: '企业空间', nodes: [{ id: 'enterprise-root', name: '企业共享资源', parentId: null }, { id: 'enterprise-policy', name: '制度规范', parentId: 'enterprise-root' }, { id: 'enterprise-product', name: '产品与服务', parentId: 'enterprise-root' }], files: [['enterprise-policy','信贷业务管理办法.pdf'],['enterprise-policy','合规审查操作指引.docx'],['enterprise-product','零售客户服务手册.docx']] },
  team: { name: '团队空间', nodes: [{ id: 't-corporate', name: '公司金融', parentId: null }, { id: 't-credit', name: '对公授信', parentId: 't-corporate' }, { id: 't-retail', name: '零售金融', parentId: null }, { id: 't-risk', name: '风险管理', parentId: null }], files: [['t-credit','对公授信审查办法.pdf'],['t-retail','零售客户分层方案.pptx'],['t-risk','客户风险评级规则.xlsx']] },
  personal: { name: '个人空间', nodes: [{ id: 'p-work', name: '工作资料', parentId: null }, { id: 'p-plan', name: '产品规划', parentId: 'p-work' }, { id: 'p-study', name: '学习资料', parentId: null }], files: [['p-work','客户需求调研记录.docx'],['p-plan','知识工程产品规划.pptx'],['p-study','知识图谱学习笔记.pdf']] }
};
try {
  const savedSpaces = JSON.parse(localStorage.getItem('kep-resource-directory-spaces') || 'null');
  if (savedSpaces?.team?.nodes) processingResourceSpaces.team.nodes = savedSpaces.team.nodes.filter(node => !node.permissions || Object.values(node.permissions).some(subjects => subjects.length));
  if (savedSpaces?.personal?.nodes) processingResourceSpaces.personal.nodes = savedSpaces.personal.nodes;
  const savedMounts = JSON.parse(localStorage.getItem('kep-resource-directory-mounts') || 'null');
  if (Array.isArray(savedMounts)) {
    ['team', 'personal'].forEach(spaceId => {
      processingResourceSpaces[spaceId].files = savedMounts.filter(item => item[0] === spaceId && item[5] !== 'table').map(item => [item[1], item[2]]);
    });
  }
} catch {}
let activeProcessingSpace = 'enterprise';
let activeProcessingDirectory = 'enterprise-policy';
const originalResourcePicker = taskForm?.querySelector('.task-picker');
if (originalResourcePicker) {
  originalResourcePicker.innerHTML = `<legend class="field-label">选择加工资源 <span class="field-hint">仅展示当前用户有权限的空间和目录</span></legend><div class="processing-resource-mode"><label class="control"><input class="radio" type="radio" name="resourceSelectionType" value="files" checked/><span class="control-label">选择文件</span></label><label class="control"><input class="radio" type="radio" name="resourceSelectionType" value="directory"/><span class="control-label">选择目录节点</span></label></div><div class="processing-resource-browser"><aside><div class="processing-space-tabs" data-processing-space-tabs></div><nav class="processing-directory-tree" data-processing-directory-tree></nav></aside><section><div class="processing-resource-context"><div><span class="text-small">当前目录</span><strong class="text-normal-bold" data-processing-directory-name></strong></div><span class="tag tag-status tag-status-lime">已授权</span></div><div class="task-choice-list processing-file-list" data-processing-file-list></div><div class="processing-directory-selection" data-processing-directory-selection hidden><span class="processing-directory-icon" aria-hidden="true">▱</span><strong class="text-medium-bold" data-processing-selected-directory></strong><p class="text-normal">将加工当前目录及其子目录中已有文件，并持续感知后续文件变化。</p><label class="control"><input class="checkbox" type="checkbox" name="watchDirectory" checked/><span class="control-label">自动感知新增、更新和删除的文件</span></label><input type="hidden" name="directorySelection" data-directory-selection-input/></div></section></div><span class="field-error" data-resource-error hidden>请选择文件或目录节点</span>`;
}

function processingDirectoryDescendants(space, directoryId) {
  const ids = new Set([directoryId]);
  let changed = true;
  while (changed) {
    changed = false;
    space.nodes.forEach(node => { if (node.parentId && ids.has(node.parentId) && !ids.has(node.id)) { ids.add(node.id); changed = true; } });
  }
  return ids;
}
function escapeProcessingResourceText(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}
function renderProcessingResourceBrowser() {
  if (!taskForm || !originalResourcePicker) return;
  const space = processingResourceSpaces[activeProcessingSpace];
  originalResourcePicker.querySelector('[data-processing-space-tabs]').innerHTML = Object.entries(processingResourceSpaces).map(([id, item]) => `<button class="${id === activeProcessingSpace ? 'is-active' : ''}" type="button" data-processing-space="${id}">${escapeProcessingResourceText(item.name)}</button>`).join('');
  originalResourcePicker.querySelector('[data-processing-directory-tree]').innerHTML = space.nodes.map(node => `<button class="${node.id === activeProcessingDirectory ? 'is-active' : ''} ${node.parentId ? 'is-child' : ''}" type="button" data-processing-directory="${escapeProcessingResourceText(node.id)}"><span>▱</span><strong>${escapeProcessingResourceText(node.name)}</strong><small>${space.files.filter(([directoryId]) => directoryId === node.id).length}</small></button>`).join('');
  const directory = space.nodes.find(node => node.id === activeProcessingDirectory) || space.nodes[0];
  originalResourcePicker.querySelector('[data-processing-directory-name]').textContent = `${space.name} / ${directory.name}`;
  originalResourcePicker.querySelector('[data-processing-selected-directory]').textContent = `${space.name} / ${directory.name}`;
  const directoryInput = originalResourcePicker.querySelector('[data-directory-selection-input]');
  directoryInput.value = `${activeProcessingSpace}:${directory.id}`;
  directoryInput.dataset.label = `${space.name} / ${directory.name}`;
  const descendants = processingDirectoryDescendants(space, directory.id);
  const files = space.files.filter(([directoryId]) => descendants.has(directoryId));
  originalResourcePicker.querySelector('[data-processing-file-list]').innerHTML = files.length ? files.map(([, name]) => `<label class="task-choice"><input class="checkbox" type="checkbox" name="resource" value="${escapeProcessingResourceText(name)}"/><span><strong class="text-normal-bold">${escapeProcessingResourceText(name)}</strong><small class="text-small">${escapeProcessingResourceText(space.name)} · ${escapeProcessingResourceText(directory.name)}</small></span></label>`).join('') : '<p class="processing-resource-empty text-small">当前目录暂无文件</p>';
}
function updateProcessingResourceMode() {
  if (!taskForm || !originalResourcePicker) return;
  const directoryMode = taskForm.elements.resourceSelectionType?.value === 'directory';
  originalResourcePicker.querySelector('[data-processing-file-list]').hidden = directoryMode;
  originalResourcePicker.querySelector('[data-processing-directory-selection]').hidden = !directoryMode;
  originalResourcePicker.querySelectorAll('[name="resource"]').forEach(input => { input.disabled = directoryMode; if (directoryMode) input.checked = false; });
  originalResourcePicker.querySelector('[name="directorySelection"]').disabled = !directoryMode;
  originalResourcePicker.querySelector('[name="watchDirectory"]').disabled = !directoryMode;
  const error = originalResourcePicker.querySelector('[data-resource-error]');
  if (error) error.hidden = true;
}
originalResourcePicker?.addEventListener('click', event => {
  const spaceButton = event.target.closest('[data-processing-space]');
  if (spaceButton) { activeProcessingSpace = spaceButton.dataset.processingSpace; activeProcessingDirectory = processingResourceSpaces[activeProcessingSpace].nodes[0].id; renderProcessingResourceBrowser(); updateProcessingResourceMode(); return; }
  const directoryButton = event.target.closest('[data-processing-directory]');
  if (directoryButton) { activeProcessingDirectory = directoryButton.dataset.processingDirectory; renderProcessingResourceBrowser(); updateProcessingResourceMode(); }
});
originalResourcePicker?.addEventListener('change', event => {
  if (event.target.matches('[name="resource"]')) originalResourcePicker.querySelector('[data-resource-error]').hidden = true;
});
taskForm?.querySelectorAll('[name="resourceSelectionType"]').forEach(radio => radio.addEventListener('change', updateProcessingResourceMode));
renderProcessingResourceBrowser();
updateProcessingResourceMode();
window.addEventListener('storage', event => {
  if (event.key !== 'kep-resource-directory-mounts') return;
  let subscriptions = [];
  try { subscriptions = JSON.parse(localStorage.getItem('kep-processing-directory-subscriptions') || '[]'); } catch {}
  if (!Array.isArray(subscriptions)) return;
  const activeSubscriptions = subscriptions.filter(subscription => subscription.watch);
  if (!activeSubscriptions.length) return;
  activeSubscriptions.forEach(subscription => { subscription.lastChangeDetectedAt = new Date().toISOString(); subscription.pendingIncrementalProcessing = true; });
  localStorage.setItem('kep-processing-directory-subscriptions', JSON.stringify(subscriptions));
  showToast(`已感知目录文件变化，${activeSubscriptions.length} 个持续加工任务将自动增量执行`);
});
getCustomModels().forEach(model => {
  const option = document.createElement('option');
  option.textContent = model.name;
  processingModelSelect?.append(option);
});

function updateProcessingTarget() {
  if (!taskForm) return;
  const type = processingTypeSelect?.value || 'model';
  taskForm.querySelectorAll('[data-processing-target]').forEach(field => {
    const active = field.dataset.processingTarget === type;
    field.hidden = !active;
    const select = field.querySelector('select');
    if (select) {
      select.disabled = !active;
      select.required = active;
      if (!active) select.value = '';
    }
  });
}

processingTypeSelect?.addEventListener('change', updateProcessingTarget);

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
  updateProcessingTarget();
  updateExecutionSchedule();
  renderProcessingResourceBrowser();
  updateProcessingResourceMode();
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
  const directoryMode = taskForm.elements.resourceSelectionType?.value === 'directory';
  const resources = [...taskForm.querySelectorAll('[name="resource"]:checked')];
  const directoryInput = taskForm.querySelector('[name="directorySelection"]');
  const error = document.querySelector('[data-resource-error]');
  if ((!directoryMode && !resources.length) || (directoryMode && !directoryInput?.value)) {
    if (error) error.hidden = false;
    taskForm.querySelector(directoryMode ? '[data-processing-directory]' : '[name="resource"]')?.focus();
    return;
  }
  if (!taskForm.reportValidity()) return;
  const data = new FormData(taskForm);
  const identity = taskIdentity();
  const row = document.createElement('tr');
  row.innerHTML = '<td class="cell-primary"><span data-new-task-name></span><span class="cell-secondary text-small" data-new-task-id></span></td><td data-new-task-resource></td><td data-new-task-type></td><td data-new-task-config></td><td data-new-large-model></td><td data-new-task-time></td><td><span class="tag tag-status" data-new-task-status></span></td><td><button class="btn btn-dense btn-text" data-toast="已打开任务详情">查看</button></td>';
  row.querySelector('[data-new-task-name]').textContent = data.get('taskName');
  row.querySelector('[data-new-task-id]').textContent = identity.id;
  const resourceCell = row.querySelector('[data-new-task-resource]');
  resourceCell.textContent = directoryMode ? directoryInput.dataset.label : resources.length === 1 ? resources[0].value : `${resources[0].value} 等 ${resources.length} 个文件`;
  if (directoryMode) {
    const modeLabel = document.createElement('span');
    modeLabel.className = 'cell-secondary text-small';
    modeLabel.textContent = data.get('watchDirectory') ? '目录持续加工 · 自动感知变化' : '目录批量加工';
    resourceCell.append(modeLabel);
  }
  const processingType = data.get('processingType');
  row.querySelector('[data-new-task-type]').textContent = processingType === 'flow' ? '流程加工' : '模型加工';
  row.querySelector('[data-new-task-config]').textContent = processingType === 'flow' ? data.get('processingFlow') : data.get('processingModel');
  row.querySelector('[data-new-large-model]').textContent = data.get('largeModel');
  const scheduled = data.get('executionMode') === 'scheduled';
  const executionDate = scheduled ? new Date(data.get('scheduledAt')) : new Date();
  row.querySelector('[data-new-task-time]').textContent = scheduled
    ? new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(executionDate)
    : '立即执行';
  const status = row.querySelector('[data-new-task-status]');
  const watchingDirectory = directoryMode && data.get('watchDirectory');
  status.textContent = scheduled ? '待执行' : watchingDirectory ? '监听中' : '排队中';
  status.classList.add(scheduled ? 'tag-status-secondary' : watchingDirectory ? 'tag-status-lime' : 'tag-status-blue');
  if (directoryMode) {
    let subscriptions = [];
    try { subscriptions = JSON.parse(localStorage.getItem('kep-processing-directory-subscriptions') || '[]'); } catch {}
    if (!Array.isArray(subscriptions)) subscriptions = [];
    subscriptions.unshift({ taskId: identity.id, taskName: data.get('taskName'), spaceId: activeProcessingSpace, directoryId: activeProcessingDirectory, directoryLabel: directoryInput.dataset.label, watch: Boolean(data.get('watchDirectory')), processingType, processingConfig: processingType === 'flow' ? data.get('processingFlow') : data.get('processingModel'), largeModel: data.get('largeModel'), scheduledAt: scheduled ? data.get('scheduledAt') : null, lastSynchronizedAt: new Date().toISOString() });
    localStorage.setItem('kep-processing-directory-subscriptions', JSON.stringify(subscriptions));
  }
  document.querySelector('[data-task-rows]')?.prepend(row);
  const total = document.querySelector('[data-task-total]');
  if (total) total.textContent = String(Number(total.textContent.replaceAll(',', '')) + 1);
  setDialogState(taskDialog, false, '', taskDialogTrigger);
  showToast(scheduled ? `加工任务“${data.get('taskName')}”已预约` : watchingDirectory ? `目录加工任务已创建，将自动感知文件变化` : `加工任务“${data.get('taskName')}”已创建`);
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (modelDialog && !modelDialog.hidden) setDialogState(modelDialog, false, '', modelDialogTrigger);
  if (taskDialog && !taskDialog.hidden) setDialogState(taskDialog, false, '', taskDialogTrigger);
});

const graphGrid = document.querySelector('[data-graph-grid]');
const graphSearch = document.querySelector('[data-graph-search]');
function filterGraphCards() {
  if (!graphGrid) return;
  const query = graphSearch?.value.trim().toLowerCase() || '';
  let visible = 0;
  graphGrid.querySelectorAll('[data-graph-card]').forEach(card => {
    card.hidden = !card.textContent.toLowerCase().includes(query);
    if (!card.hidden) visible += 1;
  });
  const empty = document.querySelector('[data-graph-empty]');
  if (empty) empty.hidden = visible > 0;
}
graphSearch?.addEventListener('input', filterGraphCards);
document.querySelectorAll('[data-graph-view]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-graph-view]').forEach(item => item.classList.toggle('is-active', item === button));
  graphGrid?.classList.toggle('is-compact', button.dataset.graphView === 'compact');
}));

const graphDialog = document.querySelector('[data-graph-dialog]');
const graphDialogTrigger = document.querySelector('[data-open-graph-dialog]');
graphDialogTrigger?.addEventListener('click', () => setDialogState(graphDialog, true, '[name="graphName"]'));
document.querySelectorAll('[data-close-graph-dialog]').forEach(button => button.addEventListener('click', () => setDialogState(graphDialog, false, '', graphDialogTrigger)));
graphDialog?.addEventListener('click', event => { if (event.target === graphDialog) setDialogState(graphDialog, false, '', graphDialogTrigger); });
document.querySelector('[data-graph-form]')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  sessionStorage.setItem('kep-v6-semantic-graph-draft', JSON.stringify({
    name: data.get('graphName').trim(),
    description: data.get('graphDescription').trim(),
    createdAt: new Date().toISOString()
  }));
  window.location.assign('../v6-ai-semantic-graph/index.html');
});

const knowledgeBaseGrid = document.querySelector('[data-kb-grid]');
const knowledgeBaseSearch = document.querySelector('[data-kb-search]');
function filterKnowledgeBaseCards() {
  if (!knowledgeBaseGrid) return;
  const query = knowledgeBaseSearch?.value.trim().toLowerCase() || '';
  let visible = 0;
  knowledgeBaseGrid.querySelectorAll('[data-kb-card]').forEach(card => {
    card.hidden = !card.textContent.toLowerCase().includes(query);
    if (!card.hidden) visible += 1;
  });
  const empty = document.querySelector('[data-kb-empty]');
  if (empty) empty.hidden = visible > 0;
}
knowledgeBaseSearch?.addEventListener('input', filterKnowledgeBaseCards);
document.querySelector('[data-kb-sort]')?.addEventListener('click', event => {
  if (!knowledgeBaseGrid) return;
  const button = event.currentTarget;
  const descending = button.dataset.direction !== 'desc';
  button.dataset.direction = descending ? 'desc' : 'asc';
  [...knowledgeBaseGrid.querySelectorAll('[data-kb-card]')]
    .sort((left, right) => left.dataset.kbName.localeCompare(right.dataset.kbName, 'zh-CN') * (descending ? -1 : 1))
    .forEach(card => knowledgeBaseGrid.append(card));
});
document.querySelector('[data-kb-view]')?.addEventListener('click', event => {
  const active = knowledgeBaseGrid?.classList.toggle('is-list') || false;
  event.currentTarget.classList.toggle('is-active', active);
});

const knowledgeBaseDialog = document.querySelector('[data-kb-dialog]');
const knowledgeBaseDialogTrigger = document.querySelector('[data-open-kb-dialog]');
knowledgeBaseDialogTrigger?.addEventListener('click', () => setDialogState(knowledgeBaseDialog, true, '[name="knowledgeBaseName"]'));
document.querySelectorAll('[data-close-kb-dialog]').forEach(button => button.addEventListener('click', () => setDialogState(knowledgeBaseDialog, false, '', knowledgeBaseDialogTrigger)));
knowledgeBaseDialog?.addEventListener('click', event => { if (event.target === knowledgeBaseDialog) setDialogState(knowledgeBaseDialog, false, '', knowledgeBaseDialogTrigger); });
document.querySelector('[data-kb-form]')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity() || !knowledgeBaseGrid) return;
  const data = new FormData(form);
  const name = data.get('knowledgeBaseName').trim();
  const description = data.get('knowledgeBaseDescription').trim();
  const card = document.createElement('article');
  card.className = 'knowledge-base-card';
  card.dataset.kbCard = '';
  card.dataset.kbName = name;
  card.innerHTML = '<div class="knowledge-base-card-main"><h2 class="text-medium-bold"><span class="knowledge-base-glyph">▥</span><span data-new-kb-name></span></h2><p class="text-normal" data-new-kb-description></p></div><div class="knowledge-base-metrics"><span><img src="../assets/images/knowledge-base/documents.svg" alt=""/>0</span><span><img src="../assets/images/knowledge-base/characters.svg" alt=""/>0</span></div><div class="knowledge-base-card-actions"><button class="btn btn-medium btn-primary" type="button">发布</button><button class="btn btn-medium btn-secondary" type="button">命中测试</button><button class="knowledge-base-more" type="button" aria-label="更多"><img src="../assets/images/knowledge-base/more.svg" alt=""/></button></div>';
  card.querySelector('[data-new-kb-name]').textContent = name;
  card.querySelector('[data-new-kb-description]').textContent = description;
  knowledgeBaseGrid.prepend(card);
  form.reset();
  filterKnowledgeBaseCards();
  setDialogState(knowledgeBaseDialog, false, '', knowledgeBaseDialogTrigger);
  showToast(`已创建知识库“${name}”`);
});

function activateTeam(button) {
  document.querySelectorAll('[data-team-name]').forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  const name = document.querySelector('[data-current-team-name]');
  const leader = document.querySelector('[data-current-team-leader]');
  const members = document.querySelector('[data-current-team-members]');
  const description = document.querySelector('[data-current-team-description]');
  if (name) name.textContent = button.dataset.teamName;
  if (leader) leader.textContent = button.dataset.teamLeader;
  if (members) members.textContent = button.dataset.teamMembers;
  if (description) description.textContent = button.dataset.teamDescription;
}

document.querySelectorAll('[data-team-name]').forEach(button => button.addEventListener('click', () => activateTeam(button)));
document.querySelector('[data-team-search]')?.addEventListener('input', event => {
  const query = event.currentTarget.value.trim().toLowerCase();
  document.querySelectorAll('[data-team-name]').forEach(item => { item.hidden = !item.textContent.toLowerCase().includes(query); });
});
document.querySelectorAll('[data-team-folder]').forEach(button => button.addEventListener('click', () => {
  const folder = button.dataset.teamFolder;
  document.querySelectorAll('[data-team-folder]').forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  let visible = 0;
  document.querySelectorAll('[data-team-folder-row]').forEach(row => {
    const show = folder === 'all' || row.dataset.teamFolderRow === folder;
    row.hidden = !show;
    if (show) visible += 1;
  });
  const count = document.querySelector('[data-team-file-count]');
  if (count) count.textContent = `${visible} 条结果`;
}));

const teamDialog = document.querySelector('[data-team-dialog]');
const teamDialogTrigger = document.querySelector('[data-open-team-dialog]');
teamDialogTrigger?.addEventListener('click', () => setDialogState(teamDialog, true, '[name="teamName"]'));
document.querySelectorAll('[data-close-team-dialog]').forEach(button => button.addEventListener('click', () => setDialogState(teamDialog, false, '', teamDialogTrigger)));
teamDialog?.addEventListener('click', event => { if (event.target === teamDialog) setDialogState(teamDialog, false, '', teamDialogTrigger); });
document.querySelector('[data-team-form]')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const teamName = data.get('teamName').trim();
  const leader = data.get('teamLeader').trim();
  const memberNames = data.get('teamMembers').split(/[,，]/).map(name => name.trim()).filter(Boolean);
  const description = data.get('teamDescription').trim() || '团队负责人及成员共同维护本团队知识资源。';
  const memberCount = new Set([leader, ...memberNames]).size;
  const item = document.createElement('button');
  item.className = 'team-list-item';
  item.type = 'button';
  item.dataset.teamName = teamName;
  item.dataset.teamLeader = leader;
  item.dataset.teamMembers = String(memberCount);
  item.dataset.teamDescription = description;
  item.setAttribute('aria-pressed', 'false');
  item.innerHTML = '<span class="team-avatar"></span><span><strong></strong><small></small></span>';
  item.querySelector('.team-avatar').textContent = teamName.slice(0, 1);
  item.querySelector('strong').textContent = teamName;
  item.querySelector('small').textContent = `${memberCount} 名成员 · ${leader}负责`;
  item.addEventListener('click', () => activateTeam(item));
  document.querySelector('.team-list')?.prepend(item);
  const total = document.querySelectorAll('[data-team-name]').length;
  const count = document.querySelector('[data-team-list-count]');
  if (count) count.textContent = `共 ${total} 个团队`;
  activateTeam(item);
  form.reset();
  setDialogState(teamDialog, false, '', teamDialogTrigger);
  showToast(`团队“${teamName}”已创建`);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && teamDialog && !teamDialog.hidden) setDialogState(teamDialog, false, '', teamDialogTrigger);
});

function bindPeoplePicker(form, checkboxName, countNode, submitButton) {
  const update = () => {
    const count = form?.querySelectorAll(`[name="${checkboxName}"]:checked`).length || 0;
    if (countNode) countNode.textContent = `已选择 ${count} 人`;
    if (submitButton) submitButton.disabled = count === 0;
  };
  form?.addEventListener('change', update);
  update();
  return update;
}

function bindPeopleSearch(input, container) {
  input?.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    container?.querySelectorAll('.people-option').forEach(option => { option.hidden = !option.textContent.toLowerCase().includes(query); });
  });
}

const memberDialog = document.querySelector('[data-member-dialog]');
const memberDialogTrigger = document.querySelector('[data-open-member-dialog]');
const memberForm = document.querySelector('[data-member-form]');
const updateMemberSelection = bindPeoplePicker(memberForm, 'teamMember', document.querySelector('[data-member-selected-count]'), document.querySelector('[data-add-members]'));
bindPeopleSearch(document.querySelector('[data-member-search]'), document.querySelector('[data-member-options]'));
memberDialogTrigger?.addEventListener('click', () => {
  memberForm?.reset();
  const activeTeam = document.querySelector('[data-team-name].is-active');
  const addedMembers = new Set((activeTeam?.dataset.addedMembers || '').split(',').filter(Boolean));
  document.querySelectorAll('[data-member-options] .people-option').forEach(option => {
    option.hidden = false;
    const checkbox = option.querySelector('[name="teamMember"]');
    checkbox.disabled = addedMembers.has(checkbox.value);
  });
  const teamName = document.querySelector('[data-current-team-name]')?.textContent || '当前团队';
  const nameNode = document.querySelector('[data-member-team-name]');
  if (nameNode) nameNode.textContent = teamName;
  updateMemberSelection();
  setDialogState(memberDialog, true, '[data-member-search]');
});
document.querySelectorAll('[data-close-member-dialog]').forEach(button => button.addEventListener('click', () => setDialogState(memberDialog, false, '', memberDialogTrigger)));
memberDialog?.addEventListener('click', event => { if (event.target === memberDialog) setDialogState(memberDialog, false, '', memberDialogTrigger); });
memberForm?.addEventListener('submit', event => {
  event.preventDefault();
  const selected = [...memberForm.querySelectorAll('[name="teamMember"]:checked')].map(item => item.value);
  if (!selected.length) return;
  const activeTeam = document.querySelector('[data-team-name].is-active');
  const addedMembers = new Set((activeTeam?.dataset.addedMembers || '').split(',').filter(Boolean));
  const newMembers = selected.filter(name => !addedMembers.has(name));
  if (!newMembers.length) { showToast('所选成员已在当前团队中'); return; }
  const currentCount = Number(activeTeam?.dataset.teamMembers || document.querySelector('[data-current-team-members]')?.textContent || 0);
  const nextCount = currentCount + newMembers.length;
  if (activeTeam) {
    activeTeam.dataset.teamMembers = String(nextCount);
    activeTeam.dataset.addedMembers = [...addedMembers, ...newMembers].join(',');
    const summary = activeTeam.querySelector('small');
    if (summary) summary.textContent = `${nextCount} 名成员 · ${activeTeam.dataset.teamLeader}负责`;
  }
  const countNode = document.querySelector('[data-current-team-members]');
  if (countNode) countNode.textContent = String(nextCount);
  setDialogState(memberDialog, false, '', memberDialogTrigger);
  showToast(`已将 ${newMembers.length} 人加入团队：${newMembers.join('、')}`);
});

const shareDialog = document.querySelector('[data-share-dialog]');
const shareForm = document.querySelector('[data-share-form]');
let shareTargetRow = null;
let shareDialogTrigger = null;
const updateShareSelection = bindPeoplePicker(shareForm, 'shareUser', document.querySelector('[data-share-selected-count]'), document.querySelector('[data-confirm-share]'));
bindPeopleSearch(document.querySelector('[data-share-search]'), document.querySelector('[data-share-options]'));
document.addEventListener('click', event => {
  const button = event.target.closest('[data-open-share-dialog]');
  if (!button) return;
  shareDialogTrigger = button;
  shareTargetRow = button.closest('tr');
  shareForm?.reset();
  const sharedUsers = new Set((shareTargetRow?.dataset.sharedUsers || '').split(',').filter(Boolean));
  document.querySelectorAll('[data-share-options] .people-option').forEach(option => {
    option.hidden = false;
    const checkbox = option.querySelector('[name="shareUser"]');
    checkbox.disabled = sharedUsers.has(checkbox.value);
  });
  const fileName = shareTargetRow?.querySelector('.document-link')?.textContent.trim() || '当前文件';
  const nameNode = document.querySelector('[data-share-file-name]');
  if (nameNode) nameNode.textContent = fileName;
  updateShareSelection();
  setDialogState(shareDialog, true, '[data-share-search]');
});
document.querySelectorAll('[data-close-share-dialog]').forEach(button => button.addEventListener('click', () => setDialogState(shareDialog, false, '', shareDialogTrigger)));
shareDialog?.addEventListener('click', event => { if (event.target === shareDialog) setDialogState(shareDialog, false, '', shareDialogTrigger); });
shareForm?.addEventListener('submit', event => {
  event.preventDefault();
  const selected = [...shareForm.querySelectorAll('[name="shareUser"]:checked')].map(item => item.value);
  if (!selected.length || !shareTargetRow) return;
  const sharedUsers = new Set((shareTargetRow.dataset.sharedUsers || '').split(',').filter(Boolean));
  selected.forEach(name => sharedUsers.add(name));
  shareTargetRow.dataset.sharedUsers = [...sharedUsers].join(',');
  const status = shareTargetRow.querySelector('td:nth-child(3) .tag-status');
  if (status) { status.className = 'tag tag-status tag-status-blue'; status.textContent = '已共享'; }
  const fileName = shareTargetRow.querySelector('.document-link')?.textContent.trim() || '当前文件';
  setDialogState(shareDialog, false, '', shareDialogTrigger);
  showToast(`已将“${fileName}”分享给 ${selected.length} 人`);
});

function ensureFileMoreMenu(row) {
  const actions = row.querySelector('.cell-actions');
  if (!actions || actions.querySelector('[data-file-more]')) return;
  const wrap = document.createElement('span');
  wrap.className = 'file-more-wrap';
  const favoriteAction=row.matches('[data-personal-folder-row]')?'':'<button class="file-more-item" type="button" role="menuitem" data-file-action="favorite">收藏</button>';
  wrap.innerHTML = `<button class="btn btn-dense btn-text" type="button" aria-haspopup="menu" aria-expanded="false" data-file-more>更多</button><span class="file-more-menu" role="menu" hidden><button class="file-more-item" type="button" role="menuitem" data-file-action="rename">重命名</button><button class="file-more-item" type="button" role="menuitem" data-file-action="move">移动</button>${favoriteAction}<button class="file-more-item file-more-item-danger" type="button" role="menuitem" data-file-action="delete">删除</button></span>`;
  actions.append(wrap);
}

document.querySelectorAll('[data-team-folder-row], [data-personal-folder-row]').forEach(ensureFileMoreMenu);

function closeFileMoreMenus(except = null) {
  document.querySelectorAll('.file-more-menu').forEach(menu => {
    if (menu === except) return;
    menu.hidden = true;
    menu.closest('.file-more-wrap')?.querySelector('[data-file-more]')?.setAttribute('aria-expanded', 'false');
  });
}

const fileActionDialog = document.querySelector('[data-file-action-dialog]');
const fileActionForm = document.querySelector('[data-file-action-form]');
let fileActionTarget = null;
let fileActionTrigger = null;
let pendingFileAction = '';

function refreshSpaceFileCount(teamSpace) {
  if (teamSpace) {
    const visible = [...document.querySelectorAll('#team-document-table tbody tr')].filter(item => !item.hidden).length;
    const count = document.querySelector('[data-team-file-count]');
    if (count) count.textContent = `${visible} 条结果`;
  } else {
    const visible = [...document.querySelectorAll('#personal-document-table tbody tr')].filter(item => !item.hidden).length;
    const count = document.querySelector('#personal-space-panel [data-file-count]');
    if (count) count.textContent = `${visible} 条结果`;
  }
}

function openFileActionDialog(action, row, trigger) {
  pendingFileAction = action;
  fileActionTarget = row;
  fileActionTrigger = trigger;
  const fileName = row.querySelector('.document-link')?.textContent.trim() || '当前文件';
  const title = document.querySelector('[data-file-action-title]');
  const description = document.querySelector('[data-file-action-description]');
  const renameField = document.querySelector('[data-rename-field]');
  const moveField = document.querySelector('[data-move-field]');
  const confirm = document.querySelector('[data-confirm-file-action]');
  renameField.hidden = action !== 'rename';
  moveField.hidden = action !== 'move';
  confirm.className = `btn btn-medium ${action === 'delete' ? 'btn-danger' : 'btn-primary'}`;
  const configs = {
    rename: ['重命名文件', `修改“${fileName}”的文件名称。`, '保存'],
    move: ['移动文件', `将“${fileName}”移动到其他文件夹。`, '确认移动'],
    delete: ['删除文件', `删除“${fileName}”后将从当前空间移除，是否继续？`, '删除']
  };
  [title.textContent, description.textContent, confirm.textContent] = configs[action];
  const nameInput = fileActionForm.querySelector('[name="fileName"]');
  nameInput.value = fileName;
  const folderSelect = document.querySelector('[data-target-folder]');
  const options = row.closest('#team-document-table')
    ? [['plan', '产品规划'], ['design', '设计方案'], ['research', '调研资料'], ['archive', '历史归档']]
    : [['work', '工作资料'], ['study', '学习资料'], ['draft', '临时文件']];
  folderSelect.innerHTML = options.map(([value, label]) => `<option value="${value}">${label}</option>`).join('');
  setDialogState(fileActionDialog, true, action === 'rename' ? '[name="fileName"]' : action === 'move' ? '[name="targetFolder"]' : '[data-confirm-file-action]');
}

document.addEventListener('click', event => {
  const moreButton = event.target.closest('[data-file-more]');
  if (moreButton) {
    event.stopPropagation();
    const menu = moreButton.nextElementSibling;
    const opening = menu.hidden;
    closeFileMoreMenus(opening ? menu : null);
    menu.hidden = !opening;
    moreButton.setAttribute('aria-expanded', String(opening));
    if (opening) {
      const rect = moreButton.getBoundingClientRect();
      menu.style.top = `${rect.bottom + 4}px`;
      menu.style.left = `${Math.max(8, Math.min(window.innerWidth - menu.offsetWidth - 8, rect.right - menu.offsetWidth))}px`;
      menu.querySelector('[role="menuitem"]')?.focus();
    }
    return;
  }
  const actionButton = event.target.closest('[data-file-action]');
  if (actionButton) {
    const row = actionButton.closest('tr');
    const action = actionButton.dataset.fileAction;
    closeFileMoreMenus();
    if (action === 'favorite') {
      const favorite = row.dataset.favorite !== 'true';
      row.dataset.favorite = String(favorite);
      actionButton.textContent = favorite ? '取消收藏' : '收藏';
      let mark = row.querySelector('[data-favorite-mark]');
      if (favorite && !mark) {
        mark = document.createElement('span');
        mark.className = 'tag tag-small favorite-mark';
        mark.dataset.favoriteMark = '';
        mark.textContent = '已收藏';
        row.querySelector('.cell-primary')?.append(mark);
      } else if (!favorite) mark?.remove();
      showToast(favorite ? '文件已收藏' : '已取消收藏');
    } else openFileActionDialog(action, row, actionButton.closest('.file-more-wrap')?.querySelector('[data-file-more]'));
    return;
  }
  if (!event.target.closest('.file-more-wrap')) closeFileMoreMenus();
});

document.querySelectorAll('[data-close-file-action-dialog]').forEach(button => button.addEventListener('click', () => setDialogState(fileActionDialog, false, '', fileActionTrigger)));
fileActionDialog?.addEventListener('click', event => { if (event.target === fileActionDialog) setDialogState(fileActionDialog, false, '', fileActionTrigger); });
fileActionForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!fileActionTarget || !fileActionForm.reportValidity()) return;
  const link = fileActionTarget.querySelector('.document-link');
  const oldName = link?.textContent.trim() || '当前文件';
  if (pendingFileAction === 'rename') {
    const name = fileActionForm.querySelector('[name="fileName"]').value.trim();
    link.textContent = name;
    link.href = fileActionTarget.closest('#personal-document-table')
      ? `personal-file-detail.html?file=${encodeURIComponent(name)}`
      : `space-file-detail.html?file=${encodeURIComponent(name)}`;
    showToast(`已将“${oldName}”重命名为“${name}”`);
  } else if (pendingFileAction === 'move') {
    const select = fileActionForm.querySelector('[name="targetFolder"]');
    const teamRow = fileActionTarget.closest('#team-document-table');
    if (teamRow) fileActionTarget.dataset.teamFolderRow = select.value;
    else fileActionTarget.dataset.personalFolderRow = select.value;
    showToast(`已将“${oldName}”移动到“${select.selectedOptions[0].textContent}”`);
  } else if (pendingFileAction === 'delete') {
    const row = fileActionTarget;
    const teamSpace = Boolean(row.closest('#team-document-table'));
    row.remove();
    refreshSpaceFileCount(teamSpace);
    showToast(`已删除“${oldName}”`);
  }
  setDialogState(fileActionDialog, false, '', fileActionTrigger);
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  closeFileMoreMenus();
  if (fileActionDialog && !fileActionDialog.hidden) setDialogState(fileActionDialog, false, '', fileActionTrigger);
  if (memberDialog && !memberDialog.hidden) setDialogState(memberDialog, false, '', memberDialogTrigger);
  if (shareDialog && !shareDialog.hidden) setDialogState(shareDialog, false, '', shareDialogTrigger);
});

const permissionDialog = document.querySelector('[data-permission-dialog]');
const permissionDialogTrigger = document.querySelector('[data-open-permission-dialog]');
const permissionForm = document.querySelector('[data-permission-form]');
permissionDialogTrigger?.addEventListener('click', () => setDialogState(permissionDialog, true, '[name="permissionUser"]'));
document.querySelectorAll('[data-close-permission-dialog]').forEach(button => button.addEventListener('click', () => setDialogState(permissionDialog, false, '', permissionDialogTrigger)));
permissionDialog?.addEventListener('click', event => { if (event.target === permissionDialog) setDialogState(permissionDialog, false, '', permissionDialogTrigger); });

function updatePermissionCount(change) {
  const count = document.querySelector('[data-permission-count]');
  if (count) count.textContent = String(Math.max(0, Number(count.textContent) + change));
}

function appendManualPermission(name, policy) {
  const directory = {
    '赵楠': ['法律合规部', '合规经理'],
    '刘敏': ['风险管理部门', '风险审查专员'],
    '周俊': ['公司金融部', '产品经理']
  };
  const [department, role] = directory[name] || ['其他部门', '单独授权用户'];
  const row = document.createElement('tr');
  row.dataset.manualPermissionRow = '';
  row.innerHTML = '<td class="cell-primary"><span class="permission-subject"><span class="permission-avatar" data-permission-avatar></span><span><strong data-permission-name></strong><small class="cell-secondary text-small" data-permission-department></small></span></span></td><td data-permission-role></td><td><span class="tag tag-small" data-permission-policy></span></td><td><span class="permission-source permission-source-manual text-small">单独授权</span></td><td class="cell-actions"><button class="btn btn-dense btn-text" type="button" data-revoke-permission>撤销</button></td>';
  row.querySelector('[data-permission-avatar]').textContent = name.slice(0, 1);
  row.querySelector('[data-permission-name]').textContent = name;
  row.querySelector('[data-permission-department]').textContent = department;
  row.querySelector('[data-permission-role]').textContent = role;
  row.querySelector('[data-permission-policy]').textContent = policy;
  document.querySelector('[data-permission-rows]')?.append(row);
}

permissionForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!permissionForm.reportValidity()) return;
  const data = new FormData(permissionForm);
  const name = data.get('permissionUser').trim();
  const existing = [...document.querySelectorAll('[data-permission-rows] strong')].some(item => item.textContent === name);
  if (existing) {
    showToast(`“${name}”已在当前授权范围中`);
    return;
  }
  appendManualPermission(name, data.get('permissionPolicy'));
  updatePermissionCount(1);
  permissionForm.reset();
  setDialogState(permissionDialog, false, '', permissionDialogTrigger);
  showToast(`已向“${name}”单独授权`);
});

document.querySelector('[data-permission-rows]')?.addEventListener('click', event => {
  const button = event.target.closest('[data-revoke-permission]');
  if (!button) return;
  const row = button.closest('tr');
  const name = row?.querySelector('strong')?.textContent || '该用户';
  row?.remove();
  updatePermissionCount(-1);
  showToast(`已撤销“${name}”的单独授权`);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && permissionDialog && !permissionDialog.hidden) setDialogState(permissionDialog, false, '', permissionDialogTrigger);
});

// System settings: organization selection and per-user additional grants.
const orgTree = document.querySelector('[data-org-tree]');
const orgSearch = document.querySelector('[data-org-search]');
orgSearch?.addEventListener('input', () => {
  const query = orgSearch.value.trim().toLowerCase();
  orgTree?.querySelectorAll('[data-org-name]').forEach(item => { item.hidden = !item.dataset.orgName.toLowerCase().includes(query); });
});
orgTree?.addEventListener('click', event => {
  const item = event.target.closest('[data-org-name]');
  if (!item) return;
  orgTree.querySelectorAll('[data-org-name]').forEach(node => {
    const active = node === item;
    node.classList.toggle('is-active', active);
    node.setAttribute('aria-selected', String(active));
  });
  const values = { '[data-org-title]': item.dataset.orgName, '[data-org-code]': item.dataset.orgCode, '[data-org-leader]': item.dataset.orgLeader, '[data-org-count]': item.dataset.orgCount };
  Object.entries(values).forEach(([selector, value]) => { const node = document.querySelector(selector); if (node) node.textContent = value; });
});

const userGrantDialog = document.querySelector('[data-user-grant-dialog]');
let userGrantTrigger = null;
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-user-grant]');
  if (!trigger) return;
  userGrantTrigger = trigger;
  const userName = document.querySelector('[data-grant-user]');
  if (userName) userName.textContent = trigger.dataset.userGrant;
  setDialogState(userGrantDialog, true, '.user-grant-grid input');
});
document.querySelectorAll('[data-close-user-grant]').forEach(button => button.addEventListener('click', () => setDialogState(userGrantDialog, false, '', userGrantTrigger)));
userGrantDialog?.addEventListener('click', event => { if (event.target === userGrantDialog) setDialogState(userGrantDialog, false, '', userGrantTrigger); });
document.querySelector('[data-save-user-grant]')?.addEventListener('click', () => {
  const userName = document.querySelector('[data-grant-user]')?.textContent || '当前用户';
  const count = userGrantDialog.querySelectorAll('input:checked').length;
  setDialogState(userGrantDialog, false, '', userGrantTrigger);
  showToast(`已为“${userName}”保存 ${count} 项额外授权`);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && userGrantDialog && !userGrantDialog.hidden) setDialogState(userGrantDialog, false, '', userGrantTrigger);
});

// Knowledge source management: connector catalog, configuration and synchronization states.
const sourceDialog = document.querySelector('[data-source-dialog]');
const sourceDialogTrigger = document.querySelector('[data-open-source-dialog]');
const sourceForm = document.querySelector('[data-source-form]');
const sourceFields = document.querySelector('[data-source-fields]');
const sourceSaveButton = document.querySelector('[data-save-source]');
const sourceTestResult = document.querySelector('[data-source-test-result]');
const sourceMoreMenu = document.querySelector('[data-source-more-menu]');
const sourceIsFileCenter = document.body.dataset.page === 'documents';
let activeSourceType = 'confluence';
let editingSourceRow = null;

const sourceConnectorConfigs = {
  confluence: { name: 'Confluence', mark: 'CF', description: '同步 Confluence 空间、页面与附件。', fields: [
    ['name', '连接名称', '例如：制度文档空间', 'text', true, true], ['baseUrl', 'Wiki 基础地址', 'https://wiki.example.com', 'url', true, true],
    ['username', 'Confluence 用户名', 'name@example.com', 'text', true], ['token', '访问令牌', '输入访问令牌', 'password', true],
    ['spaceKey', '空间 Key', '可选；多个值用英文逗号分隔', 'text', false, true]
  ]},
  s3: { name: 'S3', mark: 'S3', description: '连接 AWS S3 或 S3 兼容对象存储。', fields: [
    ['name', '连接名称', '例如：归档文件存储', 'text', true, true], ['endpoint', 'Endpoint', 'https://s3.example.com', 'url', true, true],
    ['bucket', 'Bucket', '例如：bank-knowledge-prod', 'text', true], ['region', '区域', '例如：cn-north-1', 'text', true],
    ['accessKey', 'Access Key', '输入 Access Key', 'text', true], ['secretKey', 'Secret Key', '输入 Secret Key', 'password', true],
    ['prefix', '路径前缀', '可选，例如：policies/', 'text', false, true]
  ]},
  oracle: { name: 'Oracle', mark: 'OR', description: '连接 Oracle 数据库并同步表、视图与结构信息。', fields: [
    ['name', '连接名称', '例如：核心业务库', 'text', true, true], ['host', '主机地址', '10.24.8.9', 'text', true],
    ['port', '端口', '1521', 'number', true], ['service', 'Service Name / SID', '例如：ORCL', 'text', true],
    ['schema', 'Schema', '例如：CREDIT', 'text', false], ['username', '用户名', '数据库用户', 'text', true],
    ['password', '密码', '输入密码', 'password', true]
  ]},
  jira: { name: 'Jira', mark: 'JR', description: '同步 Jira 项目、问题、评论与附件。', fields: [
    ['name', '连接名称', '例如：授信问题跟踪', 'text', true, true], ['baseUrl', 'Jira 基础地址', 'https://jira.example.com', 'url', true, true],
    ['username', '邮箱或用户名', 'name@example.com', 'text', true], ['token', 'API Token', '输入 API Token', 'password', true],
    ['projectKey', '项目 Key', '可选，例如：CREDIT', 'text', false], ['jql', 'JQL 范围', '可选，例如：project = CREDIT', 'text', false]
  ]},
  gitlab: { name: 'GitLab', mark: 'GL', description: '同步 GitLab 仓库、Issue、合并请求与 Wiki。', fields: [
    ['name', '连接名称', '例如：研发协作空间', 'text', true, true], ['baseUrl', 'GitLab 地址', 'https://gitlab.example.com', 'url', true, true],
    ['token', 'Personal Access Token', '输入访问令牌', 'password', true], ['project', '群组 / 项目路径', '例如：risk/credit-engine', 'text', true],
    ['branch', '默认分支', 'main', 'text', false], ['scope', '同步范围', '仓库、Issue、Wiki', 'text', false]
  ]},
  github: { name: 'GitHub', mark: 'GH', description: '同步 GitHub 仓库、Issue 与项目文档。', fields: [
    ['name', '连接名称', '例如：开源项目资料', 'text', true, true], ['baseUrl', 'GitHub 地址', 'https://github.com', 'url', true, true],
    ['token', 'Personal Access Token', '输入访问令牌', 'password', true], ['repository', '仓库', 'owner/repository', 'text', true],
    ['branch', '默认分支', 'main', 'text', false], ['scope', '同步范围', '代码、Issue、README', 'text', false]
  ]},
  mysql: { name: 'MySQL', mark: 'MY', description: '连接 MySQL 并同步表、视图与结构信息。', fields: [
    ['name', '连接名称', '例如：营销业务库', 'text', true, true], ['host', '主机地址', '10.24.18.16', 'text', true],
    ['port', '端口', '3306', 'number', true], ['database', '数据库', '数据库名称', 'text', true],
    ['username', '用户名', '数据库用户', 'text', true], ['password', '密码', '输入密码', 'password', true]
  ]},
  postgresql: { name: 'PostgreSQL', mark: 'PG', description: '连接 PostgreSQL 并同步表、视图与结构信息。', fields: [
    ['name', '连接名称', '例如：客户数据仓', 'text', true, true], ['host', '主机地址', '10.24.18.16', 'text', true],
    ['port', '端口', '5432', 'number', true], ['database', '数据库', '数据库名称', 'text', true],
    ['schema', 'Schema', 'public', 'text', false], ['username', '用户名', '数据库用户', 'text', true],
    ['password', '密码', '输入密码', 'password', true]
  ]},
  hive: { name: 'Hive', mark: 'HV', description: '连接 HiveServer2 并同步库表与数据仓元数据。', fields: [
    ['name', '连接名称', '例如：离线数据仓', 'text', true, true], ['host', 'HiveServer2 地址', 'hive.example.com', 'text', true],
    ['port', '端口', '10000', 'number', true], ['database', '数据库', 'default', 'text', true],
    ['auth', '认证方式', 'NONE / LDAP / KERBEROS', 'text', true], ['username', '用户名', '输入用户名', 'text', false],
    ['password', '密码', '输入密码', 'password', false]
  ]},
  neo4j: { name: 'Neo4j', mark: 'N4', description: '连接 Neo4j 并同步节点、边与属性。', fields: [
    ['name', '连接名称', '例如：客户关系图', 'text', true, true], ['uri', '连接地址', 'bolt://graph.example.com:7687', 'text', true, true],
    ['database', '数据库', 'neo4j', 'text', true], ['username', '用户名', '图数据库用户', 'text', true], ['password', '密码', '输入密码', 'password', true],
    ['labels', '标签范围', '可选；多个标签用逗号分隔', 'text', false, true]
  ]},
  janusgraph: { name: 'JanusGraph', mark: 'JG', description: '连接 JanusGraph 并同步图模式和图数据。', fields: [
    ['name', '连接名称', '例如：产品关系库', 'text', true, true], ['endpoint', 'Gremlin Server 地址', 'wss://graph.example.com/gremlin', 'url', true, true],
    ['graph', '图空间', '例如：product_graph', 'text', true], ['username', '用户名', '图数据库用户', 'text', true], ['password', '密码', '输入密码', 'password', true]
  ]},
  csvgraph: { name: '图文件', mark: 'CSV', description: '接入包含节点表和边表的图数据文件。', fields: [
    ['name', '连接名称', '例如：组织机构关系', 'text', true, true], ['path', '文件地址', 'https://files.example.com/organization-graph.zip', 'url', true, true],
    ['nodeKey', '节点主键字段', '例如：node_id', 'text', true], ['sourceKey', '边起点字段', '例如：source_id', 'text', true], ['targetKey', '边终点字段', '例如：target_id', 'text', true]
  ]}
};

function sourceFieldMarkup(field) {
  const [key, label, placeholder, type, required, wide] = field;
  return `<label class="source-config-field ${wide ? 'is-wide' : ''}"><span class="field-label text-small-bold">${label}${required ? ' *' : ''}</span><span class="input-wrap input-middle"><input class="input" name="${key}" type="${type}" placeholder="${placeholder}" ${required ? 'required' : ''} autocomplete="off" /></span></label>`;
}

function escapeSourceText(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function setSourceAccessMode(mode = 'sync') {
  const normalized = mode === 'direct' ? 'direct' : 'sync';
  document.querySelectorAll('[data-source-access-mode] input[name="accessMode"]').forEach(input => {
    input.checked = input.value === normalized;
    input.closest('.source-access-mode-option')?.classList.toggle('is-active', input.checked);
  });
  const title = document.querySelector('[data-source-mode-note-title]');
  const description = document.querySelector('[data-source-mode-note-description]');
  if (title) title.textContent = normalized === 'direct' ? '直连远端知识源' : '同步并保存内容';
  if (description) description.textContent = normalized === 'direct'
    ? '系统通过网络协议实时访问远端内容，不保存文件副本；内容可用性依赖远端服务和网络状态。'
    : '连接成功后，可配置同步范围和同步频率；远端文件将复制到本系统。';
  const syncFrequencyField = document.querySelector('[data-source-sync-frequency]');
  if (syncFrequencyField) {
    syncFrequencyField.hidden = normalized !== 'sync';
    const select = syncFrequencyField.querySelector('[name="syncFrequency"]');
    if (select) select.disabled = normalized !== 'sync';
  }
}

function renderSourceConfig(type, values = {}) {
  const config = sourceConnectorConfigs[type];
  if (!config || !sourceFields) return;
  activeSourceType = type;
  document.querySelectorAll('[data-source-type]').forEach(item => item.classList.toggle('is-active', item.dataset.sourceType === type));
  const title = document.querySelector('[data-config-title]');
  const description = document.querySelector('[data-config-description]');
  const mark = document.querySelector('[data-config-mark]');
  if (title) title.textContent = `${editingSourceRow ? '编辑' : '配置'} ${config.name}`;
  if (description) description.textContent = config.description;
  if (mark) { mark.textContent = config.mark; mark.className = `connector-mark connector-${type}`; }
  const fileCenterFields = sourceIsFileCenter ? `
    <label class="source-config-field is-wide"><span class="field-label text-small-bold">所属业务系统 *</span><span class="input-wrap input-middle"><input class="input" name="businessSystem" type="text" placeholder="例如：信贷管理系统" required autocomplete="off" /></span></label>
    <label class="source-config-field is-wide" data-source-sync-frequency><span class="field-label text-small-bold">同步频率 *</span><span class="input-wrap input-middle"><select class="input" name="syncFrequency" required><option value="">请选择同步频率</option><option value="manual">仅手动同步</option><option value="15m">每 15 分钟</option><option value="hourly">每小时</option><option value="daily">每天</option><option value="weekly">每周</option></select></span></label>` : '';
  sourceFields.innerHTML = config.fields.map(sourceFieldMarkup).join('') + fileCenterFields;
  Object.entries(values).forEach(([key, value]) => { const input = sourceFields.querySelector(`[name="${key}"]`); if (input) input.value = value; });
  setSourceAccessMode(values.accessMode || sourceForm?.querySelector('input[name="accessMode"]:checked')?.value || 'sync');
  if (sourceTestResult) { sourceTestResult.textContent = ''; sourceTestResult.className = 'source-test-result text-small'; }
  if (sourceSaveButton) sourceSaveButton.disabled = true;
}

function openSourceDialog(type = null, row = null) {
  editingSourceRow = row;
  type = type || document.querySelector('[data-source-type]')?.dataset.sourceType || 'confluence';
  const config = sourceConnectorConfigs[type] || sourceConnectorConfigs.confluence;
  const sourceTitle = row?.querySelector('.source-name-cell strong')?.textContent || '';
  renderSourceConfig(type, sourceTitle ? { name: sourceTitle, accessMode: row?.dataset.accessMode || 'sync', businessSystem: row?.dataset.businessSystem || '', syncFrequency: row?.dataset.syncFrequency || '' } : { accessMode: 'sync' });
  const dialogTitle = document.querySelector('#source-dialog-title');
  if (dialogTitle) dialogTitle.textContent = row ? '编辑知识源' : '新增知识源';
  setDialogState(sourceDialog, true, '[data-source-fields] input');
}

sourceDialogTrigger?.addEventListener('click', () => openSourceDialog());
document.querySelectorAll('[data-close-source-dialog]').forEach(button => button.addEventListener('click', () => setDialogState(sourceDialog, false, '', sourceDialogTrigger)));
sourceDialog?.addEventListener('click', event => { if (event.target === sourceDialog) setDialogState(sourceDialog, false, '', sourceDialogTrigger); });
document.querySelectorAll('[data-connector]').forEach(button => button.addEventListener('click', () => openSourceDialog(button.dataset.connector)));
document.querySelector('[data-source-type-list]')?.addEventListener('click', event => {
  const item = event.target.closest('[data-source-type]');
  if (item) renderSourceConfig(item.dataset.sourceType);
});
document.querySelector('[data-source-access-mode]')?.addEventListener('change', event => {
  if (event.target.matches('input[name="accessMode"]')) {
    setSourceAccessMode(event.target.value);
    if (sourceTestResult) { sourceTestResult.textContent = ''; sourceTestResult.className = 'source-test-result text-small'; }
    if (sourceSaveButton) sourceSaveButton.disabled = true;
  }
});
document.querySelector('[data-connector-search]')?.addEventListener('input', event => {
  const query = event.currentTarget.value.trim().toLowerCase();
  document.querySelectorAll('[data-source-type]').forEach(item => { item.hidden = !item.textContent.toLowerCase().includes(query); });
});

document.querySelector('[data-test-source]')?.addEventListener('click', () => {
  if (!sourceForm?.reportValidity()) return;
  sourceTestResult.textContent = '正在测试连接…';
  sourceTestResult.className = 'source-test-result text-small';
  sourceSaveButton.disabled = true;
  window.setTimeout(() => {
    const accessMode = sourceForm.querySelector('input[name="accessMode"]:checked')?.value || 'sync';
    sourceTestResult.textContent = accessMode === 'direct' ? '直连成功，远端服务可访问' : '连接成功，可以同步并保存远端内容';
    sourceTestResult.className = 'source-test-result text-small is-success';
    sourceSaveButton.disabled = false;
  }, 700);
});

sourceSaveButton?.addEventListener('click', () => {
  if (!sourceForm?.reportValidity() || sourceSaveButton.disabled) return;
  const data = new FormData(sourceForm);
  const config = sourceConnectorConfigs[activeSourceType];
  const name = String(data.get('name') || `${config.name} 知识源`).trim();
  const accessMode = String(data.get('accessMode') || 'sync');
  const accessModeLabel = accessMode === 'direct' ? '直连' : '同步';
  const businessSystem = String(data.get('businessSystem') || '').trim();
  const syncFrequency = accessMode === 'sync' ? String(data.get('syncFrequency') || '') : '';
  if (editingSourceRow) {
    editingSourceRow.querySelector('.source-name-cell strong').textContent = name;
    editingSourceRow.dataset.name = `${name} ${config.name}`;
    editingSourceRow.dataset.accessMode = accessMode;
    if (sourceIsFileCenter) {
      editingSourceRow.dataset.businessSystem = businessSystem;
      editingSourceRow.dataset.syncFrequency = syncFrequency;
    }
    showToast(`已保存“${name}”的连接配置`);
  } else {
    const row = document.createElement('tr');
    row.dataset.sourceRow = '';
    row.dataset.name = `${name} ${config.name}`;
    row.dataset.status = 'normal';
    row.dataset.accessMode = accessMode;
    if (sourceIsFileCenter) {
      row.dataset.businessSystem = businessSystem;
      row.dataset.syncFrequency = syncFrequency;
    }
    row.innerHTML = `<td><div class="source-name-cell"><span class="connector-mark connector-${activeSourceType}">${config.mark}</span><span><strong>${escapeSourceText(name)}</strong><small>${config.name} · ${accessModeLabel}</small></span></div></td><td><span class="tag tag-status tag-status-lime">已连接</span></td><td><span class="sync-state"><i class="sync-dot"></i>${accessMode === 'direct' ? '实时访问' : '尚未同步'}</span></td><td>未关联</td><td>${accessModeLabel}</td><td>—</td><td>当前用户</td><td class="cell-actions">${accessMode === 'sync' ? '<button class="btn btn-dense btn-text" type="button" data-sync-source>立即同步</button>' : ''}<button class="btn btn-dense btn-text" type="button" data-edit-source>编辑</button><button class="btn btn-dense btn-text" type="button" data-source-more>更多</button></td>`;
    document.querySelector('[data-source-instance-list]')?.prepend(row);
    const sidebar = document.querySelector('[data-knowledge-source-tree]');
    const isContentCenter = sidebar && !document.querySelector('[data-source-instance-list]');
    if (isContentCenter) {
      const allSource = sidebar.querySelector('[data-knowledge-source="all"]');
      const kind = allSource?.dataset.sourceKind || 'unstructured';
      const item = document.createElement('button');
      item.className = 'source-tree-item';
      item.type = 'button';
      item.dataset.knowledgeSource = `${activeSourceType}-${Date.now()}`;
      item.dataset.sourceKind = kind;
      item.dataset.businessSystem = businessSystem;
      item.dataset.syncFrequency = syncFrequency;
      item.setAttribute('aria-pressed', 'false');
      item.innerHTML = `<span class="connector-mark connector-${activeSourceType}">${config.mark}</span><span class="source-label"><strong>${escapeSourceText(name)}</strong><small>${config.name} · ${accessMode === 'direct' ? '直连' : '尚未同步'}</small></span><span class="source-count">0</span>`;
      sidebar.append(item);
    }
    const total = document.querySelector('[data-source-total]');
    if (total) total.textContent = String(Number(total.textContent) + 1);
    showToast(isContentCenter ? `已创建“${name}”（${accessModeLabel}方式）` : `已创建“${name}”（${accessModeLabel}方式）`);
  }
  setDialogState(sourceDialog, false, '', sourceDialogTrigger);
});

let sourceStatusFilter = 'all';
function filterSourceRows() {
  const query = document.querySelector('[data-source-search]')?.value.trim().toLowerCase() || '';
  let visible = 0;
  document.querySelectorAll('[data-source-row]').forEach(row => {
    const matchesQuery = (row.dataset.name || row.textContent).toLowerCase().includes(query);
    const matchesStatus = sourceStatusFilter === 'all' || row.dataset.status === sourceStatusFilter;
    row.hidden = !(matchesQuery && matchesStatus);
    if (!row.hidden) visible += 1;
  });
  const empty = document.querySelector('[data-source-empty]');
  if (empty) empty.hidden = visible > 0;
}
document.querySelector('[data-source-search]')?.addEventListener('input', filterSourceRows);
document.querySelectorAll('[data-source-status]').forEach(button => button.addEventListener('click', () => {
  sourceStatusFilter = button.dataset.sourceStatus;
  document.querySelectorAll('[data-source-status]').forEach(item => { const active = item === button; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)); });
  filterSourceRows();
}));

document.querySelector('[data-source-instance-list]')?.addEventListener('click', event => {
  const syncButton = event.target.closest('[data-sync-source], [data-test-row]');
  const editButton = event.target.closest('[data-edit-source]');
  const moreButton = event.target.closest('[data-source-more]');
  const row = event.target.closest('[data-source-row]');
  if (syncButton && row) {
    const name = row.querySelector('.source-name-cell strong')?.textContent;
    syncButton.textContent = '同步中';
    syncButton.disabled = true;
    showToast(`“${name}”同步任务已加入任务中心`);
    window.setTimeout(() => { syncButton.textContent = '立即同步'; syncButton.disabled = false; }, 1200);
  }
  if (editButton && row) {
    const className = row.querySelector('.connector-mark')?.className || '';
    const type = Object.keys(sourceConnectorConfigs).find(key => className.includes(`connector-${key}`)) || 'confluence';
    openSourceDialog(type, row);
  }
  if (moreButton && sourceMoreMenu) {
    const rect = moreButton.getBoundingClientRect();
    sourceMoreMenu.hidden = false;
    sourceMoreMenu.style.inset = `${Math.min(rect.bottom + 4, window.innerHeight - sourceMoreMenu.offsetHeight - 8)}px ${Math.max(8, window.innerWidth - rect.right)}px auto auto`;
  }
});
document.addEventListener('click', event => {
  if (!sourceMoreMenu || sourceMoreMenu.hidden || event.target.closest('[data-source-more], [data-source-more-menu]')) return;
  sourceMoreMenu.hidden = true;
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && sourceDialog && !sourceDialog.hidden) setDialogState(sourceDialog, false, '', sourceDialogTrigger);
  if (event.key === 'Escape' && sourceMoreMenu) sourceMoreMenu.hidden = true;
});

// 文件标签：AI 自动标签与文件详情人工补充使用同一份聚合数据。
const fileTagStorageKey='kep-file-manual-tags';
const fileAnalysisStatusStorageKey='kep-file-analysis-statuses';
const defaultFileTagRecords=[
  {name:'对公授信审查办法.pdf',aliases:['对公授信审查办法'],type:'PDF',source:'制度文档空间',status:'已确认',updatedAt:'2026-09-08 09:30',autoTags:['对公授信','风险管理','制度办法','企业客户','授信审查','内部公开']},
  {name:'固定资产贷款管理办法.docx',aliases:['固定资产贷款管理办法'],type:'Word',source:'制度文档空间',status:'解析失败',updatedAt:'2026-09-07 10:18',autoTags:['固定资产贷款','制度办法','风险管理']},
  {name:'客户风险评级服务设计.txt',aliases:['客户风险评级服务设计'],type:'TXT',source:'研发协作空间',status:'元数据补充中',updatedAt:'2026-09-08 08:18',autoTags:['客户评级','风险管理','服务设计']},
  {name:'征信接口流程图.png',aliases:['征信接口变更记录'],type:'图片',source:'研发协作空间',status:'元数据补充失败',updatedAt:'2026-09-08 08:12',autoTags:['征信接口','流程设计','研发资料']},
  {name:'授信规则培训视频.mp4',aliases:['CREDIT-2841'],type:'视频',source:'授信问题跟踪',status:'元数据补充中',updatedAt:'2026-09-08 07:10',autoTags:['授信规则','业务培训','风险管理']},
  {name:'2025年授信档案汇编.pdf',aliases:['2025年授信档案汇编'],type:'PDF',source:'归档文档库',status:'元数据补充失败',updatedAt:'2026-09-07 06:02',autoTags:['授信档案','年度汇编','企业客户']},
  {name:'历史合同扫描件.jpg',aliases:['历史合同归档'],type:'图片',source:'归档文档库',status:'待确认',updatedAt:'2026-09-06 16:20',autoTags:['合同管理','历史档案','扫描件']},
  {name:'风险模型说明.txt',aliases:['风险模型说明'],type:'TXT',source:'开源项目资料',status:'已确认',updatedAt:'2026-09-06 14:20',autoTags:['风险模型','模型说明','研发资料']}
];
const readManualFileTags=()=>{try{const value=JSON.parse(localStorage.getItem(fileTagStorageKey)||'{}');return value&&typeof value==='object'?value:{}}catch{return {}}};
const saveManualFileTags=value=>localStorage.setItem(fileTagStorageKey,JSON.stringify(value));
const findFileTagRecord=name=>defaultFileTagRecords.find(item=>item.name===name||item.aliases.includes(name));
const readFileAnalysisStatuses=()=>{try{const value=JSON.parse(localStorage.getItem(fileAnalysisStatusStorageKey)||'{}');return value&&typeof value==='object'?value:{}}catch{return {}}};
const getFileAnalysisStatus=record=>readFileAnalysisStatuses()[record?.name]||record?.status||'已确认';
const confirmFileAnalysis=record=>{if(!record)return;const statuses=readFileAnalysisStatuses();statuses[record.name]='已确认';localStorage.setItem(fileAnalysisStatusStorageKey,JSON.stringify(statuses))};
const allFileTagRecords=()=>{const manual=readManualFileTags();return defaultFileTagRecords.map(item=>({...item,status:getFileAnalysisStatus(item),manualTags:manual[item.name]||[]}))};
function renderDocumentListTags(){
  const table=document.querySelector('#resource-table');
  if(!table||table.querySelector('[data-file-tag-column]'))return;
  const heading=document.createElement('th');heading.dataset.fileTagColumn='';heading.textContent='标签';table.querySelector('thead tr')?.children[4]?.before(heading);
  table.querySelectorAll('tbody tr[data-knowledge-source-row]').forEach(row=>{const name=row.querySelector('.document-link')?.textContent.trim()||'',record=findFileTagRecord(name),manual=readManualFileTags()[record?.name]||[],tags=[...new Set([...(record?.autoTags||[]),...manual])],cell=document.createElement('td');cell.dataset.fileTagColumn='';cell.innerHTML=tags.length?`<div class="file-list-tag-summary">${tags.slice(0,2).map(tag=>`<span class="tag tag-small">${escapeTagCategoryText(tag)}</span>`).join('')}${tags.length>2?`<span class="text-small">+${tags.length-2}</span>`:''}</div>`:'<span class="text-small">待自动打标</span>';row.children[4]?.before(cell);const status=getFileAnalysisStatus(record),statusNode=row.querySelector('.tag-status'),actionCell=row.lastElementChild;if(statusNode&&record){statusNode.textContent=status;statusNode.className=`tag tag-status ${status==='已确认'?'tag-status-lime':'tag-status-secondary'}`}if(actionCell&&status==='待确认'){actionCell.innerHTML=`<button class="btn btn-dense btn-primary" type="button" data-confirm-file-analysis-row>确认</button><a class="btn btn-dense btn-text" href="space-file-detail.html?file=${encodeURIComponent(name)}&space=${sourceSpace}">查看并修改</a>`;actionCell.querySelector('[data-confirm-file-analysis-row]')?.addEventListener('click',()=>{confirmFileAnalysis(record);statusNode.textContent='已确认';statusNode.className='tag tag-status tag-status-lime';actionCell.innerHTML='<span class="text-small">已确认</span>';showToast('已确认当前文件的元数据和标签')})}});
}
renderDocumentListTags();

const fileDetailTagList=document.querySelector('[data-file-detail-tags]');
if(fileDetailTagList){
  const queryName=new URLSearchParams(location.search).get('file')||document.querySelector('[data-query-file]')?.textContent.trim()||'文件详情';
  const baseRecord=findFileTagRecord(queryName)||{name:queryName,aliases:[],type:'文件',source:'文件中心',status:'已确认',updatedAt:'2026-09-08 09:30',autoTags:['待分类']};
  const canonicalName=baseRecord.name;
  const analysisStatusNode=document.querySelector('[data-file-analysis-status]'),confirmAnalysisButton=document.querySelector('[data-confirm-file-analysis]'),confirmHint=document.querySelector('[data-file-confirm-hint]');
  const renderFileAnalysisStatus=()=>{const status=getFileAnalysisStatus(baseRecord),pending=status==='待确认';if(analysisStatusNode){analysisStatusNode.textContent=status;analysisStatusNode.className=`tag tag-status ${pending?'tag-status-secondary':'tag-status-lime'}`}if(confirmAnalysisButton)confirmAnalysisButton.hidden=!pending;if(confirmHint)confirmHint.textContent=pending?'AI 已完成元数据补充和自动打标，请核对后确认':'当前元数据和标签已确认'};
  const renderFileDetailTags=()=>{const manual=readManualFileTags(),manualTags=manual[canonicalName]||[],tags=[...new Set([...baseRecord.autoTags,...manualTags])];fileDetailTagList.innerHTML=tags.map(tag=>`<span class="tag ${manualTags.includes(tag)?'tag-primary':''}" title="${manualTags.includes(tag)?'用户手动添加':'AI 自动生成'}">${escapeTagCategoryText(tag)}</span>`).join('');const suggestions=document.querySelector('[data-file-tag-suggestions]');if(suggestions)suggestions.innerHTML=[...new Set(allFileTagRecords().flatMap(item=>[...item.autoTags,...item.manualTags]))].sort().map(tag=>`<option value="${escapeTagCategoryText(tag)}"></option>`).join('')};
  const fileTagDialog=document.querySelector('[data-file-tag-dialog]'),fileTagForm=document.querySelector('[data-file-tag-form]');
  document.querySelector('[data-open-file-tag-dialog]')?.addEventListener('click',()=>{fileTagForm.reset();renderFileDetailTags();setDialogState(fileTagDialog,true,'[name="fileTagName"]')});
  document.querySelectorAll('[data-file-tag-dialog-close]').forEach(button=>button.addEventListener('click',()=>setDialogState(fileTagDialog,false)));
  fileTagDialog?.addEventListener('click',event=>{if(event.target===fileTagDialog)setDialogState(fileTagDialog,false)});
  fileTagForm?.addEventListener('submit',event=>{event.preventDefault();const tag=String(new FormData(fileTagForm).get('fileTagName')||'').trim();if(!tag)return;const manual=readManualFileTags(),current=manual[canonicalName]||[];if(baseRecord.autoTags.includes(tag)||current.includes(tag)){showToast(`标签“${tag}”已存在`);return}manual[canonicalName]=[...current,tag];saveManualFileTags(manual);setDialogState(fileTagDialog,false);renderFileDetailTags();showToast(`已为当前文件添加标签“${tag}”`)});
  confirmAnalysisButton?.addEventListener('click',()=>{confirmFileAnalysis(baseRecord);renderFileAnalysisStatus();showToast('已确认当前文件的元数据和标签')});
  renderFileDetailTags();
  renderFileAnalysisStatus();
}

const fileTagBrowser=document.querySelector('[data-file-tag-list]');
if(fileTagBrowser){
  const categoryStorageKey='kep-file-tag-categories',categoryMapStorageKey='kep-file-tag-category-map',defaultCategories=['业务主题','文档类型','使用场景','安全等级'];
  const readTagCategories=()=>{try{const value=JSON.parse(localStorage.getItem(categoryStorageKey)||'null');return Array.isArray(value)&&value.length?value:defaultCategories}catch{return defaultCategories}};
  const readTagCategoryMap=()=>{try{const value=JSON.parse(localStorage.getItem(categoryMapStorageKey)||'{}');return value&&typeof value==='object'?value:{}}catch{return {}}};
  let categories=[...readTagCategories()],categoryMap=readTagCategoryMap(),activeFileTag='all',activeCategoryFilter='all';
  const updateCategorySelects=()=>{const filter=document.querySelector('[data-file-tag-category-filter]'),assign=document.querySelector('[data-tag-category-assign-select]'),options=categories.map(category=>`<option value="${escapeTagCategoryText(category)}">${escapeTagCategoryText(category)}</option>`).join('');filter.innerHTML=`<option value="all">全部分类</option><option value="uncategorized">未分类</option>${options}`;filter.value=categories.includes(activeCategoryFilter)||['all','uncategorized'].includes(activeCategoryFilter)?activeCategoryFilter:'all';assign.innerHTML=`<option value="">未分类</option>${options}`};
  const renderTagBrowser=()=>{const records=allFileTagRecords(),tagQuery=document.querySelector('[data-file-tag-search]').value.trim().toLowerCase(),fileQuery=document.querySelector('[data-tag-file-search]').value.trim().toLowerCase(),tags=[...new Set(records.flatMap(item=>[...item.autoTags,...item.manualTags]))].sort(),visibleTags=tags.filter(tag=>tag.toLowerCase().includes(tagQuery)&&(activeCategoryFilter==='all'||(activeCategoryFilter==='uncategorized'?!categoryMap[tag]:categoryMap[tag]===activeCategoryFilter)));if(activeFileTag!=='all'&&!tags.includes(activeFileTag))activeFileTag='all';fileTagBrowser.innerHTML=`<button class="tag-browser-item ${activeFileTag==='all'?'is-active':''}" type="button" data-file-tag="all"><span>全部标签</span><small class="text-number">${visibleTags.length}</small></button>${visibleTags.map(tag=>{const count=records.filter(item=>item.autoTags.includes(tag)||item.manualTags.includes(tag)).length,category=categoryMap[tag]||'未分类';return `<div class="tag-browser-row ${activeFileTag===tag?'is-active':''}"><button class="tag-browser-item" type="button" data-file-tag="${escapeTagCategoryText(tag)}"><span><strong>${escapeTagCategoryText(tag)}</strong><small>${escapeTagCategoryText(category)}</small></span><small class="text-number">${count}</small></button><button class="btn btn-dense btn-text tag-assign-button" type="button" data-assign-tag-category="${escapeTagCategoryText(tag)}">加入分类</button></div>`}).join('')}`;const selected=activeFileTag==='all'?records:records.filter(item=>item.autoTags.includes(activeFileTag)||item.manualTags.includes(activeFileTag)),visibleFiles=selected.filter(item=>`${item.name} ${item.type} ${item.source}`.toLowerCase().includes(fileQuery)),rows=document.querySelector('[data-tag-file-rows]');rows.innerHTML=visibleFiles.map(item=>{const source=activeFileTag==='all'?(item.manualTags.length?'AI 自动 + 用户补充':'AI 自动'):item.manualTags.includes(activeFileTag)?'用户补充':'AI 自动';return `<tr><td class="cell-primary"><a class="document-link" href="space-file-detail.html?file=${encodeURIComponent(item.name)}">${escapeTagCategoryText(item.name)}</a></td><td><span class="tag tag-small">${escapeTagCategoryText(item.type)}</span></td><td>${escapeTagCategoryText(item.source)}</td><td><span class="tag tag-status ${source==='用户补充'?'tag-status-blue':'tag-status-secondary'}">${source}</span></td><td>${escapeTagCategoryText(item.status)}</td><td>${escapeTagCategoryText(item.updatedAt)}</td><td class="cell-actions"><a class="btn btn-dense btn-text" href="space-file-detail.html?file=${encodeURIComponent(item.name)}">查看</a></td></tr>`}).join('');const category=activeFileTag==='all'?'':categoryMap[activeFileTag]||'未分类';document.querySelector('[data-selected-file-tag]').textContent=activeFileTag==='all'?'全部标签':activeFileTag;document.querySelector('[data-selected-file-tag-description]').textContent=activeFileTag==='all'?'展示文件中心中的全部已打标文件':`分类：${category} · 展示该标签关联的文件`;document.querySelector('[data-tag-file-count]').textContent=`${visibleFiles.length} 个文件`;document.querySelector('[data-tag-file-empty]').hidden=visibleFiles.length>0};
  const managerDialog=document.querySelector('[data-tag-category-manager]'),assignDialog=document.querySelector('[data-tag-category-assign-dialog]');
  const renderCategoryManager=()=>{const tags=[...new Set(allFileTagRecords().flatMap(item=>[...item.autoTags,...item.manualTags]))],rows=document.querySelector('[data-tag-category-manager-rows]');rows.innerHTML=categories.map((category,index)=>`<tr><td><span class="input-wrap input-middle"><input class="input" value="${escapeTagCategoryText(category)}" maxlength="30" required data-tag-category-name="${index}" aria-label="分类名称" /></span></td><td class="text-number">${tags.filter(tag=>categoryMap[tag]===category).length}</td><td class="cell-actions"><button class="btn btn-dense btn-text" type="button" data-delete-tag-category="${index}">删除</button></td></tr>`).join('')||'<tr><td colspan="3" class="text-small">暂无分类，可在上方新建。</td></tr>'};
  fileTagBrowser.addEventListener('click',event=>{const assignButton=event.target.closest('[data-assign-tag-category]');if(assignButton){activeFileTag=assignButton.dataset.assignTagCategory;document.querySelector('[data-assign-tag-name]').textContent=activeFileTag;updateCategorySelects();document.querySelector('[data-tag-category-assign-select]').value=categoryMap[activeFileTag]||'';setDialogState(assignDialog,true,'[name="tagCategory"]');return}const button=event.target.closest('[data-file-tag]');if(!button)return;activeFileTag=button.dataset.fileTag;renderTagBrowser()});
  document.querySelector('[data-file-tag-search]').addEventListener('input',renderTagBrowser);
  document.querySelector('[data-tag-file-search]').addEventListener('input',renderTagBrowser);
  document.querySelector('[data-file-tag-category-filter]').addEventListener('change',event=>{activeCategoryFilter=event.currentTarget.value;activeFileTag='all';renderTagBrowser()});
  document.querySelector('[data-open-tag-category-manager]').addEventListener('click',()=>{renderCategoryManager();setDialogState(managerDialog,true,'[name="categoryName"]')});
  document.querySelectorAll('[data-tag-category-manager-close]').forEach(button=>button.addEventListener('click',()=>setDialogState(managerDialog,false)));
  managerDialog.addEventListener('click',event=>{if(event.target===managerDialog)setDialogState(managerDialog,false)});
  document.querySelector('[data-tag-category-create-form]').addEventListener('submit',event=>{event.preventDefault();const name=String(new FormData(event.currentTarget).get('categoryName')||'').trim();if(!name)return;if(categories.includes(name))return showToast('分类名称已存在');categories.push(name);event.currentTarget.reset();renderCategoryManager()});
  document.querySelector('[data-tag-category-manager-rows]').addEventListener('click',event=>{const button=event.target.closest('[data-delete-tag-category]');if(!button)return;const category=categories[Number(button.dataset.deleteTagCategory)];categories.splice(Number(button.dataset.deleteTagCategory),1);Object.keys(categoryMap).forEach(tag=>{if(categoryMap[tag]===category)delete categoryMap[tag]});renderCategoryManager()});
  document.querySelector('[data-tag-category-manager-save]').addEventListener('click',()=>{const inputs=[...document.querySelectorAll('[data-tag-category-name]')],renames=new Map();inputs.forEach((input,index)=>{const old=categories[index],name=input.value.trim();if(name&&old!==name)renames.set(old,name)});categories=inputs.map(input=>input.value.trim()).filter((name,index,list)=>name&&list.indexOf(name)===index);Object.keys(categoryMap).forEach(tag=>{if(renames.has(categoryMap[tag]))categoryMap[tag]=renames.get(categoryMap[tag]);if(!categories.includes(categoryMap[tag]))delete categoryMap[tag]});localStorage.setItem(categoryStorageKey,JSON.stringify(categories));localStorage.setItem(categoryMapStorageKey,JSON.stringify(categoryMap));updateCategorySelects();setDialogState(managerDialog,false);renderTagBrowser();showToast('标签分类已保存')});
  document.querySelectorAll('[data-tag-category-assign-close]').forEach(button=>button.addEventListener('click',()=>setDialogState(assignDialog,false)));
  assignDialog.addEventListener('click',event=>{if(event.target===assignDialog)setDialogState(assignDialog,false)});
  document.querySelector('[data-tag-category-assign-form]').addEventListener('submit',event=>{event.preventDefault();const category=String(new FormData(event.currentTarget).get('tagCategory')||'');if(category)categoryMap[activeFileTag]=category;else delete categoryMap[activeFileTag];localStorage.setItem(categoryMapStorageKey,JSON.stringify(categoryMap));setDialogState(assignDialog,false);renderTagBrowser();showToast(category?`已将“${activeFileTag}”加入“${category}”`:`已将“${activeFileTag}”设为未分类`)});
  updateCategorySelects();
  renderTagBrowser();
}

// 旧版标签分类管理逻辑仅在旧页面结构存在时启用。
const tagCategoryTree = document.querySelector('[data-category-tree]');
const newTagDialog = document.querySelector('[data-tag-dialog]');
const newTagDialogTrigger = document.querySelector('[data-open-tag-dialog]');
const newTagForm = document.querySelector('[data-tag-form]');
const tagCategoryDialog = document.querySelector('[data-category-dialog]');
const tagCategoryDeleteDialog = document.querySelector('[data-category-delete-dialog]');
const tagCategoryForm = document.querySelector('[data-category-form]');
let activeTagCategory = 'all';
let editingTagCategoryNode = null;
let parentTagCategoryNode = null;
let deletingTagCategoryNode = null;

function filterTagRows() {
  const query = document.querySelector('[data-tag-search]')?.value.trim().toLowerCase() || '';
  let visible = 0;
  document.querySelectorAll('[data-tag-rows] tr').forEach(row => {
    const matchesCategory = activeTagCategory === 'all' || (row.dataset.tagCategoryPath || '').split(' ').includes(activeTagCategory);
    const matchesQuery = row.textContent.toLowerCase().includes(query);
    row.hidden = !(matchesCategory && matchesQuery);
    if (!row.hidden) visible += 1;
  });
  const resultCount = document.querySelector('[data-tag-result-count]');
  const empty = document.querySelector('[data-tag-empty]');
  if (resultCount) resultCount.textContent = `共 ${visible} 个标签`;
  if (empty) empty.hidden = visible > 0;
}

function selectTagCategory(node) {
  activeTagCategory = node.dataset.categoryId;
  document.querySelectorAll('[data-category-select]').forEach(button => {
    const active = button.closest('[data-category-node]') === node;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const title = document.querySelector('[data-tag-list-title]');
  if (title) title.textContent = node.dataset.categoryName;
  filterTagRows();
}

function openTagCategoryDialog({ parent = null, editing = null } = {}) {
  parentTagCategoryNode = parent;
  editingTagCategoryNode = editing;
  const input = tagCategoryForm?.elements.categoryName;
  const description = tagCategoryForm?.elements.categoryDescription;
  const depth = editing ? Number(editing.dataset.categoryDepth) : parent ? Number(parent.dataset.categoryDepth) + 1 : 1;
  const title = document.querySelector('[data-category-dialog-title]');
  const parentName = document.querySelector('[data-category-parent-name]');
  const level = document.querySelector('[data-category-level]');
  if (title) title.textContent = editing ? '修改业务分类' : parent ? '新增子分类' : '新增一级分类';
  if (parentName) parentName.textContent = parent?.dataset.categoryName || editing?.parentElement.closest('[data-category-node]')?.dataset.categoryName || '无（一级分类）';
  if (level) level.textContent = `${['一', '二', '三'][depth - 1]}级目录`;
  if (input) input.value = editing?.dataset.categoryName || '';
  if (description) description.value = editing?.dataset.categoryDescription || '';
  setDialogState(tagCategoryDialog, true, '[name="categoryName"]');
}

function escapeTagCategoryText(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function createTagCategoryNode(name, description, depth) {
  const node = document.createElement('div');
  const id = `category-${Date.now()}`;
  const addAction = depth < 3 ? `<button type="button" data-category-add aria-label="在${escapeTagCategoryText(name)}下新增子分类">＋</button>` : '';
  node.className = 'tag-category-node';
  node.setAttribute('role', 'treeitem');
  node.setAttribute('aria-level', String(depth));
  node.dataset.categoryNode = '';
  node.dataset.categoryId = id;
  node.dataset.categoryName = name;
  node.dataset.categoryDescription = description;
  node.dataset.categoryDepth = String(depth);
  node.innerHTML = `<div class="tag-category-row"><button class="tag-category-item" type="button" data-category-select aria-pressed="false"><span class="tag-category-caret"></span><span data-category-label>${escapeTagCategoryText(name)}</span><small class="text-number" data-category-count>0</small></button><span class="tag-category-actions">${addAction}<button type="button" data-category-edit aria-label="修改${escapeTagCategoryText(name)}">✎</button><button type="button" data-category-delete aria-label="删除${escapeTagCategoryText(name)}">×</button></span></div>`;
  return node;
}

document.querySelector('[data-category-create-root]')?.addEventListener('click', () => openTagCategoryDialog());
newTagDialogTrigger?.addEventListener('click', () => {
  newTagForm?.reset();
  const category = document.querySelector(`[data-category-id="${activeTagCategory}"]`);
  const categoryName = document.querySelector('[data-new-tag-category]');
  if (categoryName) categoryName.textContent = activeTagCategory === 'all' ? '未分类' : category?.dataset.categoryName || '未分类';
  setDialogState(newTagDialog, true, '[name="tagName"]', newTagDialogTrigger);
});
document.querySelectorAll('[data-tag-dialog-close]').forEach(button => button.addEventListener('click', () => setDialogState(newTagDialog, false, '', newTagDialogTrigger)));
document.querySelectorAll('[data-category-dialog-close]').forEach(button => button.addEventListener('click', () => setDialogState(tagCategoryDialog, false)));
document.querySelectorAll('[data-category-delete-close]').forEach(button => button.addEventListener('click', () => setDialogState(tagCategoryDeleteDialog, false)));
document.querySelector('[data-tag-search]')?.addEventListener('input', filterTagRows);

tagCategoryTree?.addEventListener('click', event => {
  const node = event.target.closest('[data-category-node]');
  if (!node) return;
  if (event.target.closest('[data-category-select]')) selectTagCategory(node);
  if (event.target.closest('[data-category-add]')) {
    if (Number(node.dataset.categoryDepth) >= 3) return showToast('业务分类最多支持三级目录');
    openTagCategoryDialog({ parent: node });
  }
  if (event.target.closest('[data-category-edit]')) openTagCategoryDialog({ editing: node });
  if (event.target.closest('[data-category-delete]')) {
    deletingTagCategoryNode = node;
    const name = document.querySelector('[data-category-delete-name]');
    if (name) name.textContent = node.dataset.categoryName;
    setDialogState(tagCategoryDeleteDialog, true, '[data-category-delete-confirm]');
  }
});

tagCategoryForm?.addEventListener('submit', event => {
  event.preventDefault();
  const formData = new FormData(tagCategoryForm);
  const name = String(formData.get('categoryName') || '').trim();
  const description = String(formData.get('categoryDescription') || '').trim();
  if (!name || !description) return;
  if (editingTagCategoryNode) {
    editingTagCategoryNode.dataset.categoryName = name;
    editingTagCategoryNode.dataset.categoryDescription = description;
    editingTagCategoryNode.querySelector('[data-category-label]').textContent = name;
    editingTagCategoryNode.querySelector('[data-category-edit]').setAttribute('aria-label', `修改${name}`);
    editingTagCategoryNode.querySelector('[data-category-delete]').setAttribute('aria-label', `删除${name}`);
    if (activeTagCategory === editingTagCategoryNode.dataset.categoryId) document.querySelector('[data-tag-list-title]').textContent = name;
    showToast(`已将业务分类修改为“${name}”`);
  } else {
    const depth = parentTagCategoryNode ? Number(parentTagCategoryNode.dataset.categoryDepth) + 1 : 1;
    const node = createTagCategoryNode(name, description, depth);
    if (parentTagCategoryNode) {
      let group = parentTagCategoryNode.querySelector(':scope > .tag-category-children');
      if (!group) {
        group = document.createElement('div');
        group.className = 'tag-category-children';
        group.setAttribute('role', 'group');
        parentTagCategoryNode.append(group);
      }
      group.append(node);
      parentTagCategoryNode.setAttribute('aria-expanded', 'true');
      parentTagCategoryNode.querySelector('.tag-category-caret').textContent = '⌄';
    } else {
      tagCategoryTree.append(node);
    }
    selectTagCategory(node);
    showToast(`已新增${depth}级业务分类“${name}”`);
  }
  setDialogState(tagCategoryDialog, false);
});

function getTagCategoryPath(node) {
  const ids = [];
  const names = [];
  let current = node;
  while (current && current.dataset.categoryId !== 'all') {
    ids.unshift(current.dataset.categoryId);
    names.unshift(current.dataset.categoryName);
    current = current.parentElement?.closest('[data-category-node]');
  }
  return { ids, names };
}

newTagForm?.addEventListener('submit', event => {
  event.preventDefault();
  const formData = new FormData(newTagForm);
  const name = String(formData.get('tagName') || '').trim();
  const description = String(formData.get('tagDescription') || '').trim();
  if (!name || !description) return;
  const selectedNode = document.querySelector(`[data-category-id="${activeTagCategory}"]`);
  const { ids, names } = getTagCategoryPath(selectedNode);
  const row = document.createElement('tr');
  row.dataset.tagCategoryPath = ids.join(' ');
  const code = `TAG-${Date.now().toString().slice(-8)}`;
  const time = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date());
  row.innerHTML = `<td class="cell-primary">${escapeTagCategoryText(name)}</td><td>${escapeTagCategoryText(description)}</td><td class="text-number">${code}</td><td>${escapeTagCategoryText(names.join(' / ') || '未分类')}</td><td class="text-number">0</td><td>当前用户</td><td>${time}</td><td class="cell-actions"><button class="btn btn-dense btn-text" data-toast="标签编辑功能已打开">编辑</button></td>`;
  document.querySelector('[data-tag-rows]')?.prepend(row);
  ['all', ...ids].forEach(id => {
    const count = document.querySelector(`[data-category-id="${id}"] [data-category-count]`);
    if (count) count.textContent = String(Number(count.textContent || 0) + 1);
  });
  filterTagRows();
  setDialogState(newTagDialog, false, '', newTagDialogTrigger);
  showToast(`已创建标签“${name}”`);
});

document.querySelector('[data-category-delete-confirm]')?.addEventListener('click', () => {
  if (!deletingTagCategoryNode) return;
  const name = deletingTagCategoryNode.dataset.categoryName;
  const containsActive = deletingTagCategoryNode.dataset.categoryId === activeTagCategory || deletingTagCategoryNode.querySelector(`[data-category-id="${activeTagCategory}"]`);
  deletingTagCategoryNode.remove();
  deletingTagCategoryNode = null;
  if (containsActive) selectTagCategory(document.querySelector('[data-category-id="all"]'));
  setDialogState(tagCategoryDeleteDialog, false);
  showToast(`已删除业务分类“${name}”`);
});

document.querySelector('[data-category-search]')?.addEventListener('input', event => {
  const query = event.currentTarget.value.trim().toLowerCase();
  tagCategoryTree?.querySelectorAll(':scope > [data-category-node]').forEach(node => {
    node.hidden = node.dataset.categoryId !== 'all' && Boolean(query) && !node.textContent.toLowerCase().includes(query);
  });
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (newTagDialog && !newTagDialog.hidden) setDialogState(newTagDialog, false, '', newTagDialogTrigger);
  if (tagCategoryDialog && !tagCategoryDialog.hidden) setDialogState(tagCategoryDialog, false);
  if (tagCategoryDeleteDialog && !tagCategoryDeleteDialog.hidden) setDialogState(tagCategoryDeleteDialog, false);
});

// 资产目录：多目录树、三级目录与文件列表联动。
const assetTreeNode = document.querySelector('[data-asset-directory-tree]');
const assetTreeSelect = document.querySelector('[data-tree-switch]');
const assetFileRows = document.querySelector('[data-asset-file-rows]');
const assetTreeDialog = document.querySelector('[data-tree-dialog]');
const assetFolderDialog = document.querySelector('[data-folder-dialog]');
const assetTrees = {
  business:{name:'业务分类目录',description:'按业务领域组织企业正式知识资产',folders:[{id:'finance',name:'金融业务',children:[{id:'credit',name:'信贷业务',children:[{id:'risk',name:'风险管理'},{id:'approval',name:'授信审批'}]},{id:'retail',name:'零售金融',children:[{id:'customer',name:'客户服务'}]}]},{id:'governance',name:'企业治理',children:[{id:'legal',name:'法律合规',children:[{id:'contract',name:'合同管理'}]},{id:'hr',name:'人力资源'}]},{id:'technology',name:'信息科技',children:[{id:'architecture',name:'系统架构'},{id:'security',name:'信息安全'}]}]},
  organization:{name:'组织机构目录',description:'按资产责任部门与管理机构组织',folders:[{id:'head-office',name:'总行部门',children:[{id:'risk-dept',name:'风险管理部'},{id:'tech-dept',name:'金融科技部'}]},{id:'branches',name:'分支机构',children:[{id:'east-branch',name:'华东分行'},{id:'south-branch',name:'华南分行'}]}]},
  topic:{name:'专题资产目录',description:'按重点项目与专题场景灵活编目',folders:[{id:'inclusive',name:'普惠金融专题',children:[{id:'small-business',name:'小微企业服务'}]},{id:'digital',name:'数字化转型专题',children:[{id:'ai',name:'人工智能应用'},{id:'data',name:'数据治理'}]}]}
};
const catalogAssets = [
 ['对公授信审查办法','PDF',['finance','credit','approval','head-office','risk-dept'],'金融业务 / 信贷业务 / 授信审批','v3.2','王翠','2026-09-05 10:26'],['固定资产贷款管理办法','DOCX',['finance','credit','risk','head-office','risk-dept'],'金融业务 / 信贷业务 / 风险管理','v2.0','李程','2026-09-04 16:48'],['客户风险评级规则','规则集',['finance','credit','risk','head-office','risk-dept'],'金融业务 / 信贷业务 / 风险管理','v5.1','陈曦','2026-09-03 11:12'],['零售客户服务规范','PDF',['finance','retail','customer','branches','east-branch'],'金融业务 / 零售金融 / 客户服务','v1.8','赵楠','2026-09-02 14:30'],['标准采购合同模板','DOCX',['governance','legal','contract','head-office'],'企业治理 / 法律合规 / 合同管理','v4.0','刘敏','2026-09-01 09:18'],['数据安全分类分级指引','PDF',['technology','security','head-office','tech-dept','digital','data'],'信息科技 / 信息安全','v2.3','陈曦','2026-08-30 17:42'],['核心系统架构说明','Markdown',['technology','architecture','head-office','tech-dept','digital'],'信息科技 / 系统架构','v1.6','周明','2026-08-28 14:18'],['员工行为管理办法','PDF',['governance','hr','head-office'],'企业治理 / 人力资源','v2.1','何静','2026-08-25 10:05'],['华东区域客户运营报告','XLSX',['finance','retail','branches','east-branch'],'金融业务 / 零售金融','v1.2','赵楠','2026-08-21 16:35'],['小微企业授信知识手册','PDF',['finance','credit','inclusive','small-business'],'金融业务 / 信贷业务','v3.0','王翠','2026-08-18 11:26'],['智能客服知识图谱','知识图谱',['finance','retail','digital','ai'],'金融业务 / 零售金融','v2.5','周明','2026-08-15 15:08'],['南方区域合规检查清单','XLSX',['governance','legal','branches','south-branch'],'企业治理 / 法律合规','v1.4','刘敏','2026-08-12 09:30']
];
let activeAssetTree='business', activeAssetFolder=null, pendingAssetParent=null;
const safeAssetText=value=>String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
function renderClassificationReview(){const panel=document.querySelector('[data-classification-review]'),list=document.querySelector('[data-classification-review-list]');if(!panel||!list)return;const pending=getClassificationResults().filter(item=>item.status==='pending');panel.hidden=pending.length===0;document.querySelector('[data-classification-review-count]').textContent=`${pending.length} 项待确认`;list.innerHTML=pending.map(item=>`<article class="classification-review-item" data-classification-result="${safeAssetText(item.id)}"><div class="classification-review-file"><strong class="text-normal-bold">${safeAssetText(item.fileName)}</strong><small class="text-small">来源：${safeAssetText(item.sourceName)}</small></div><div class="classification-review-path"><span class="classification-path-label text-small">建议业务目录</span><strong class="text-normal">${safeAssetText(item.path)}</strong></div><div class="classification-review-actions"><button class="btn btn-dense btn-secondary" type="button" data-classification-reject>不接受</button><button class="btn btn-dense btn-primary" type="button" data-classification-accept>接受分类</button></div></article>`).join('')}
document.querySelector('[data-classification-review-list]')?.addEventListener('click',event=>{const action=event.target.closest('[data-classification-accept],[data-classification-reject]');if(!action)return;const row=action.closest('[data-classification-result]'),results=getClassificationResults(),result=results.find(item=>item.id===row.dataset.classificationResult);if(!result)return;result.status=action.hasAttribute('data-classification-accept')?'accepted':'rejected';localStorage.setItem('kep-source-classification-results',JSON.stringify(results));showToast(result.status==='accepted'?`已接受“${result.fileName}”的目录分类`:`已拒绝“${result.fileName}”的目录分类`);renderClassificationReview()});
const allAssetFolders=(folders,result=[])=>{folders.forEach(folder=>{result.push(folder);allAssetFolders(folder.children||[],result)});return result};
const assetCount=id=>catalogAssets.filter(asset=>asset[2].includes(id)).length;
function assetFolderHtml(folder,depth=1){const children=folder.children||[];return `<div class="asset-folder-node" role="treeitem" aria-level="${depth}" data-asset-folder data-folder-id="${safeAssetText(folder.id)}" data-folder-name="${safeAssetText(folder.name)}" data-folder-depth="${depth}"><div class="asset-folder-row"><button class="asset-folder-select" type="button" data-asset-folder-select aria-pressed="false"><span class="asset-folder-caret">${children.length?'⌄':''}</span><span class="asset-folder-icon">▱</span><span class="asset-folder-label">${safeAssetText(folder.name)}</span><small class="asset-folder-count text-number">${assetCount(folder.id)}</small></button><button class="source-function-trigger" type="button" aria-haspopup="menu" aria-expanded="false" data-asset-folder-function aria-label="${safeAssetText(folder.name)}功能组">⋮</button><div class="source-function-menu" role="menu" hidden>${depth<3?'<button type="button" role="menuitem" data-add-asset-folder>新建子目录</button>':''}<button type="button" role="menuitem" data-add-directory-file>添加文件</button><button type="button" role="menuitem" data-rename-asset-folder>修改目录</button><button class="is-danger" type="button" role="menuitem" data-delete-asset-folder>删除目录</button></div></div>${children.length?`<div class="asset-folder-children" role="group">${children.map(child=>assetFolderHtml(child,depth+1)).join('')}</div>`:''}</div>`}
function renderAssetTree(){if(!assetTreeNode)return;const tree=assetTrees[activeAssetTree];assetTreeNode.setAttribute('aria-label',tree.name);assetTreeNode.innerHTML=tree.folders.map(folder=>assetFolderHtml(folder)).join('')||'<p class="source-empty-state text-small">尚无目录，请新建一级目录</p>'}
function renderCatalogAssets(){if(!assetFileRows)return;const query=document.querySelector('[data-asset-file-search]')?.value.trim().toLowerCase()||'';const rows=catalogAssets.filter(asset=>(!activeAssetFolder||asset[2].includes(activeAssetFolder.id))&&asset.join(' ').toLowerCase().includes(query));assetFileRows.innerHTML=rows.map(asset=>`<tr><td class="cell-primary"><a class="document-link" href="resource-catalog-detail.html?file=${encodeURIComponent(asset[0])}">${safeAssetText(asset[0])}</a></td><td>${asset[1]}</td><td>${asset[3]}</td><td class="text-number">${asset[4]}</td><td>${asset[5]}</td><td>${asset[6]}</td><td><span class="tag tag-status tag-status-lime">已发布</span></td><td class="cell-actions"><a class="btn btn-dense btn-text" href="resource-catalog-detail.html?file=${encodeURIComponent(asset[0])}">查看</a></td></tr>`).join('');document.querySelector('[data-asset-empty]').hidden=rows.length>0;document.querySelector('[data-asset-result-count]').textContent=`${rows.length} 个文件`}
function selectCatalogFolder(node){document.querySelectorAll('[data-asset-folder-select]').forEach(button=>{const chosen=button.closest('[data-asset-folder]')===node;button.classList.toggle('is-active',chosen);button.setAttribute('aria-pressed',String(chosen))});activeAssetFolder=node?{id:node.dataset.folderId,name:node.dataset.folderName}:null;const title=activeAssetFolder?.name||'全部资产';document.querySelector('[data-asset-file-title]').textContent=title;document.querySelector('[data-selected-path]').textContent=title;document.querySelector('[data-asset-file-summary]').textContent=`展示${activeAssetFolder?`“${title}”目录`:assetTrees[activeAssetTree].name}下的资产`;renderCatalogAssets()}
function switchCatalogTree(id){activeAssetTree=id;activeAssetFolder=null;const tree=assetTrees[id];document.querySelector('[data-tree-description]').textContent=tree.description;document.querySelector('[data-select-tree-root]').textContent=tree.name;if(assetTreeSelect)assetTreeSelect.value=id;renderAssetTree();selectCatalogFolder(null)}
assetTreeSelect?.addEventListener('change',event=>switchCatalogTree(event.currentTarget.value));document.querySelector('[data-select-tree-root]')?.addEventListener('click',()=>selectCatalogFolder(null));document.querySelector('[data-asset-file-search]')?.addEventListener('input',renderCatalogAssets);document.querySelector('[data-asset-tree-search]')?.addEventListener('input',event=>{const query=event.currentTarget.value.trim().toLowerCase();assetTreeNode.querySelectorAll('[data-asset-folder]').forEach(node=>node.hidden=Boolean(query)&&!node.textContent.toLowerCase().includes(query))});
function openAssetFolderDialog(parent=null){pendingAssetParent=parent;const depth=parent?Number(parent.dataset.folderDepth)+1:1;document.querySelector('[data-folder-dialog-title]').textContent=parent?'新建子目录':'新建一级目录';document.querySelector('[data-folder-parent-name]').textContent=parent?.dataset.folderName||assetTrees[activeAssetTree].name;document.querySelector('[data-folder-level]').textContent=`${['一','二','三'][depth-1]}级目录`;document.querySelector('[data-folder-form]').reset();setDialogState(assetFolderDialog,true,'[name="folderName"]')}
function closeAssetFolderMenus(except=null){document.querySelectorAll('[data-asset-folder-function]').forEach(trigger=>{const open=trigger===except;trigger.setAttribute('aria-expanded',String(open));const menu=trigger.parentElement.querySelector('.source-function-menu');if(menu)menu.hidden=!open})}
document.querySelector('[data-open-folder-dialog]')?.addEventListener('click',()=>openAssetFolderDialog());assetTreeNode?.addEventListener('click',event=>{const node=event.target.closest('[data-asset-folder]');if(!node)return;const trigger=event.target.closest('[data-asset-folder-function]');if(trigger){const willOpen=trigger.getAttribute('aria-expanded')!=='true';closeAssetFolderMenus(willOpen?trigger:null);return}if(event.target.closest('[data-asset-folder-select]'))selectCatalogFolder(node);if(event.target.closest('[data-add-asset-folder]'))openAssetFolderDialog(node);if(event.target.closest('[data-rename-asset-folder]'))showToast(`已打开“${node.dataset.folderName}”修改面板`);if(event.target.closest('[data-add-directory-file]'))openDirectoryFilePicker(node);if(event.target.closest('[data-delete-asset-folder]')){const target=allAssetFolders(assetTrees[activeAssetTree].folders).find(folder=>folder.id===node.dataset.folderId);if((target?.children||[]).length||assetCount(node.dataset.folderId))return showToast('请先移走目录中的文件和子目录');const removeFrom=list=>{const index=list.findIndex(item=>item.id===node.dataset.folderId);if(index>=0){list.splice(index,1);return true}return list.some(item=>removeFrom(item.children||[]))};removeFrom(assetTrees[activeAssetTree].folders);renderAssetTree();selectCatalogFolder(null);showToast(`已删除目录“${node.dataset.folderName}”`)}closeAssetFolderMenus()});
document.addEventListener('click',event=>{if(!event.target.closest('[data-asset-folder-function],.asset-folder-row .source-function-menu'))closeAssetFolderMenus()});
document.querySelector('[data-folder-form]')?.addEventListener('submit',event=>{event.preventDefault();const formData=new FormData(event.currentTarget),name=String(formData.get('folderName')||'').trim(),description=String(formData.get('folderDescription')||'').trim();if(!name||!description)return;const parentData=pendingAssetParent?allAssetFolders(assetTrees[activeAssetTree].folders).find(folder=>folder.id===pendingAssetParent.dataset.folderId):null;const siblings=parentData?(parentData.children||(parentData.children=[])):assetTrees[activeAssetTree].folders;if(siblings.some(folder=>folder.name===name))return showToast('同级目录名称已存在');siblings.push({id:`folder-${Date.now()}`,name,description});renderAssetTree();setDialogState(assetFolderDialog,false);showToast(`已新建目录“${name}”`)});
document.querySelector('[data-open-tree-dialog]')?.addEventListener('click',()=>{document.querySelector('[data-tree-form]').reset();setDialogState(assetTreeDialog,true,'[name="treeName"]')});document.querySelector('[data-tree-form]')?.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget),name=String(data.get('treeName')||'').trim(),description=String(data.get('treeDescription')||'').trim();if(!name||!description)return;if(Object.values(assetTrees).some(tree=>tree.name===name))return showToast('目录树名称已存在');const id=`tree-${Date.now()}`;assetTrees[id]={name,description,folders:[]};const option=document.createElement('option');option.value=id;option.textContent=name;assetTreeSelect.append(option);document.querySelector('[data-catalog-tree-count]').textContent=String(Object.keys(assetTrees).length);setDialogState(assetTreeDialog,false);switchCatalogTree(id);showToast(`已创建并切换到“${name}”`)});
document.querySelectorAll('[data-tree-dialog-close]').forEach(button=>button.addEventListener('click',()=>setDialogState(assetTreeDialog,false)));document.querySelectorAll('[data-folder-dialog-close]').forEach(button=>button.addEventListener('click',()=>setDialogState(assetFolderDialog,false)));
const directoryFileDialog=document.querySelector('[data-add-file-dialog]'),sourceFiles=[['对公授信审查办法','PDF','confluence','2026-09-05'],['零售业务管理规范','DOCX','confluence','2026-09-03'],['监管政策汇编','PDF','confluence','2026-09-01'],['客户风险评级服务设计','Markdown','gitlab','2026-09-04'],['接口变更记录','Wiki','gitlab','2026-09-02'],['2025年授信档案','PDF','s3','2026-08-30'],['历史合同清单','XLSX','s3','2026-08-28'],['客户尽调影像索引','JSON','s3','2026-08-26']];let pickerSource='all',pickerTarget=null;
function updatePickedFiles(){const count=document.querySelectorAll('[data-picker-file]:checked').length;document.querySelector('[data-picker-selected-count]').textContent=`已选 ${count} 个`;document.querySelector('[data-add-file-confirm]').disabled=count===0}function renderSourceFiles(){const query=document.querySelector('[data-picker-file-search]')?.value.trim().toLowerCase()||'',body=document.querySelector('[data-picker-file-rows]');if(!body)return;body.innerHTML=sourceFiles.filter(file=>(pickerSource==='all'||file[2]===pickerSource)&&file[0].toLowerCase().includes(query)).map(file=>`<tr><td><input class="checkbox" type="checkbox" data-picker-file value="${safeAssetText(file[0])}" aria-label="选择${safeAssetText(file[0])}" /></td><td class="cell-primary">${safeAssetText(file[0])}</td><td>${file[1]}</td><td>${file[3]}</td></tr>`).join('');updatePickedFiles()}function openDirectoryFilePicker(node){pickerTarget=node;pickerSource='all';document.querySelector('[data-add-file-target]').textContent=node.dataset.folderName;document.querySelectorAll('[data-source-filter]').forEach((button,index)=>button.classList.toggle('is-active',index===0));document.querySelector('[data-picker-file-search]').value='';renderSourceFiles();setDialogState(directoryFileDialog,true,'[data-picker-file-search]')}
document.querySelector('[data-source-picker]')?.addEventListener('click',event=>{const button=event.target.closest('[data-source-filter]');if(!button)return;pickerSource=button.dataset.sourceFilter;document.querySelectorAll('[data-source-filter]').forEach(item=>item.classList.toggle('is-active',item===button));renderSourceFiles()});document.querySelector('[data-picker-file-search]')?.addEventListener('input',renderSourceFiles);document.querySelector('[data-picker-file-rows]')?.addEventListener('change',updatePickedFiles);document.querySelectorAll('[data-add-file-close]').forEach(button=>button.addEventListener('click',()=>setDialogState(directoryFileDialog,false)));document.querySelector('[data-add-file-confirm]')?.addEventListener('click',()=>{const count=document.querySelectorAll('[data-picker-file]:checked').length;if(!count)return;setDialogState(directoryFileDialog,false);showToast(`已将 ${count} 个文件添加到“${pickerTarget.dataset.folderName}”`)});if(assetTreeNode){switchCatalogTree(activeAssetTree);renderClassificationReview()}
const permissionAddDialog=document.querySelector('[data-permission-add-dialog]');document.querySelector('[data-open-permission-add]')?.addEventListener('click',event=>setDialogState(permissionAddDialog,true,'input',event.currentTarget));document.querySelectorAll('[data-permission-add-close]').forEach(button=>button.addEventListener('click',()=>setDialogState(permissionAddDialog,false)));document.querySelectorAll('[data-query-file]').forEach(node=>{const file=new URLSearchParams(location.search).get('file');if(file)node.textContent=file});
const resourceCatalogBack=document.querySelector('[data-resource-catalog-back]');if(resourceCatalogBack){const params=new URLSearchParams(location.search);if(params.get('context')==='directory'){const selectedSpace=params.get('space')||'all';resourceCatalogBack.href=`resource-catalog-design.html?space=${encodeURIComponent(selectedSpace)}`}}

// 资源目录设计：文档分类体系与分类专属抽取属性。
const catalogDesignSelect=document.querySelector('[data-design-tree-select]'),catalogCategoryList=document.querySelector('[data-document-category-list]'),catalogPropertyRows=document.querySelector('[data-category-property-rows]');
const catalogDesignTrees={document:{name:'文档库分类管理',description:'按照企业文档的业务载体类型进行分类',categories:{policy:{name:'制度类',description:'企业正式发布的制度、办法、细则及操作规范。',properties:[['制度名称','policy_name','文本',true,'识别标题中的正式制度名称'],['发文机构','issuing_org','文本',true,'识别落款或文号中的机构'],['发文字号','document_no','文本',false,'识别正文首页的发文字号'],['发布日期','publish_date','日期',true,'识别签发或发布日期'],['生效日期','effective_date','日期',false,'识别生效条款中的日期'],['适用范围','scope','多选',false,'概括适用部门、岗位或业务']]},plan:{name:'规划类',description:'战略规划、专项规划、建设方案和阶段性计划。',properties:[['规划名称','plan_name','文本',true,'识别规划文件标题'],['规划周期','plan_period','文本',true,'识别起止年份或阶段'],['牵头部门','lead_department','文本',false,'识别编制或牵头单位'],['规划目标','objectives','多选',true,'抽取核心目标'],['重点任务','key_tasks','多选',false,'抽取任务章节要点']]},contract:{name:'合同类',description:'业务合同、协议、补充协议和标准合同模板。',properties:[['合同名称','contract_name','文本',true,'识别合同首页标题'],['甲方','party_a','文本',true,'识别合同主体甲方'],['乙方','party_b','文本',true,'识别合同主体乙方'],['合同金额','amount','数字',false,'识别金额及币种'],['签订日期','signed_date','日期',false,'识别落款签署日期'],['履行期限','term','文本',false,'识别合同有效期'],['违约责任','liability','文本',false,'概括违约责任条款']]},credit:{name:'征信类',description:'企业与个人征信报告、信用评价和风险信息。',properties:[['报告主体','subject','文本',true,'识别被查询企业或个人'],['报告编号','report_no','文本',true,'识别征信报告编号'],['查询日期','query_date','日期',true,'识别报告生成日期'],['信用等级','credit_level','单选',false,'识别信用评级'],['风险事件','risk_events','多选',false,'抽取逾期及异常事件'],['数据来源','data_source','文本',false,'识别征信机构']]},report:{name:'报告类',description:'研究报告、经营分析、审计报告和专题报告。',properties:[['报告名称','report_name','文本',true,'识别报告标题'],['报告类型','report_type','单选',true,'判断研究、经营或审计类型'],['报告期','report_period','文本',false,'识别数据统计区间'],['编制部门','authoring_dept','文本',false,'识别编制单位'],['核心结论','conclusions','多选',true,'提炼摘要与结论章节']]},judicial:{name:'司法类',description:'裁判文书、案件材料、司法公告及执行信息。',properties:[['案件名称','case_name','文本',true,'识别文书标题'],['案号','case_no','文本',true,'识别法院案号'],['审理法院','court','文本',true,'识别出具文书的法院'],['案件类型','case_type','单选',false,'判断民事、刑事或行政'],['裁判日期','judgment_date','日期',false,'识别裁判落款日期'],['裁判结果','judgment_result','文本',true,'概括判决或裁定结果']]}}}};
const catalogDesignStorageKey='kep-resource-catalog-design-trees';
try{const savedTrees=JSON.parse(localStorage.getItem(catalogDesignStorageKey)||'{}');if(savedTrees&&typeof savedTrees==='object')Object.assign(catalogDesignTrees,savedTrees)}catch{}
Object.values(catalogDesignTrees).forEach(tree=>Object.values(tree.categories||{}).forEach(item=>{item.parentId=item.parentId||null;item.depth=item.depth||1;item.properties=Array.isArray(item.properties)?item.properties:[]}));
const saveCatalogDesignTrees=()=>localStorage.setItem(catalogDesignStorageKey,JSON.stringify(catalogDesignTrees));
if(catalogDesignSelect){Object.entries(catalogDesignTrees).forEach(([id,tree])=>{if(catalogDesignSelect.querySelector(`option[value="${id}"]`))return;const option=document.createElement('option');option.value=id;option.textContent=tree.name;catalogDesignSelect.append(option)});document.querySelector('[data-design-tree-count]').textContent=String(Object.keys(catalogDesignTrees).length);saveCatalogDesignTrees()}
let activeDesignTree='document',activeDesignCategory='policy',pendingDesignParent=null;const safeDesignText=value=>String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
function designCategoryHtml(id,item,categories){const children=Object.entries(categories).filter(([,child])=>child.parentId===id);return `<div class="catalog-type-node" role="treeitem" aria-level="${item.depth}"><div class="catalog-type-row"><button class="catalog-type-item ${id===activeDesignCategory?'is-active':''}" type="button" data-document-category="${id}"><span><i class="catalog-type-caret">${children.length?'⌄':'›'}</i> ${safeDesignText(item.name)}</span><small>${item.properties.length} 个属性</small></button><button class="source-function-trigger" type="button" aria-haspopup="menu" aria-expanded="false" data-design-node-menu aria-label="${safeDesignText(item.name)}功能组">⋮</button><div class="source-function-menu" role="menu" hidden>${item.depth<5?'<button type="button" role="menuitem" data-add-design-child>新建子目录</button>':'<button class="is-disabled" type="button" role="menuitem" disabled>已达到五层</button>'}<button type="button" role="menuitem" data-toast="目录修改已打开">修改目录</button></div></div>${children.length?`<div class="catalog-type-children" role="group">${children.map(([childId,child])=>designCategoryHtml(childId,child,categories)).join('')}</div>`:''}</div>`}
function renderDesignCategories(){if(!catalogCategoryList)return;const categories=catalogDesignTrees[activeDesignTree].categories;const roots=Object.entries(categories).filter(([,item])=>!item.parentId);catalogCategoryList.innerHTML=roots.map(([id,item])=>designCategoryHtml(id,item,categories)).join('')||'<p class="source-empty-state text-small">尚无目录，请新建一级目录</p>'}
function renderDesignProperties(){if(!catalogPropertyRows)return;const item=catalogDesignTrees[activeDesignTree].categories[activeDesignCategory];document.querySelector('[data-category-title]').textContent=item?.name||'尚未选择分类';document.querySelector('[data-category-description]').textContent=item?.description||'请先新增一个分类。';catalogPropertyRows.innerHTML=(item?.properties||[]).map(property=>`<tr><td class="cell-primary">${safeDesignText(property[0])}</td><td class="text-number">${safeDesignText(property[1])}</td><td>${property[2]}</td><td><span class="tag tag-status ${property[3]?'tag-status-blue':'tag-status-secondary'}">${property[3]?'必填':'选填'}</span></td><td>${safeDesignText(property[4])}</td><td class="cell-actions"><button class="btn btn-dense btn-text" type="button" data-toast="属性编辑已打开">编辑</button></td></tr>`).join('');renderDesignCategories()}
function activateDesignTree(id){activeDesignTree=id;const tree=catalogDesignTrees[id];activeDesignCategory=Object.keys(tree.categories)[0]||null;document.querySelector('[data-design-tree-title]').textContent=tree.name;document.querySelector('[data-design-tree-description]').textContent=tree.description;renderDesignProperties()}
catalogDesignSelect?.addEventListener('change',event=>activateDesignTree(event.currentTarget.value));catalogCategoryList?.addEventListener('click',event=>{const menuTrigger=event.target.closest('[data-design-node-menu]');if(menuTrigger){const open=menuTrigger.getAttribute('aria-expanded')!=='true';document.querySelectorAll('[data-design-node-menu]').forEach(trigger=>{trigger.setAttribute('aria-expanded',String(open&&trigger===menuTrigger));trigger.parentElement.querySelector('.source-function-menu').hidden=!(open&&trigger===menuTrigger)});return}const childAction=event.target.closest('[data-add-design-child]');if(childAction){const id=childAction.closest('.catalog-type-node').querySelector('[data-document-category]').dataset.documentCategory;openDesignCategoryDialog(id);return}const button=event.target.closest('[data-document-category]');if(!button)return;activeDesignCategory=button.dataset.documentCategory;renderDesignProperties()});
const designTreeDialog=document.querySelector('[data-design-tree-dialog]'),designPropertyDialog=document.querySelector('[data-property-dialog]'),designCategoryDialog=document.querySelector('[data-design-category-dialog]');document.querySelector('[data-open-design-tree]')?.addEventListener('click',()=>setDialogState(designTreeDialog,true,'[name="treeName"]'));document.querySelectorAll('[data-design-tree-close]').forEach(button=>button.addEventListener('click',()=>setDialogState(designTreeDialog,false)));document.querySelector('[data-design-tree-form]')?.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget),name=String(data.get('treeName')||'').trim(),description=String(data.get('treeDescription')||'').trim();if(Object.values(catalogDesignTrees).some(tree=>tree.name===name))return showToast('目录树名称已存在');const id=`design-${Date.now()}`;catalogDesignTrees[id]={name,description,categories:{}};saveCatalogDesignTrees();const option=document.createElement('option');option.value=id;option.textContent=name;catalogDesignSelect.append(option);catalogDesignSelect.value=id;document.querySelector('[data-design-tree-count]').textContent=String(Object.keys(catalogDesignTrees).length);setDialogState(designTreeDialog,false);activateDesignTree(id);showToast(`已创建目录树“${name}”`)});
function openDesignCategoryDialog(parentId=null){pendingDesignParent=parentId;const parent=parentId?catalogDesignTrees[activeDesignTree].categories[parentId]:null,depth=parent?parent.depth+1:1;document.querySelector('[data-design-category-title]').textContent=parent?'新建子目录':'新建一级目录';document.querySelector('[data-design-parent-name]').textContent=parent?.name||catalogDesignTrees[activeDesignTree].name;document.querySelector('[data-design-category-level]').textContent=`${['一','二','三','四','五'][depth-1]}级目录`;document.querySelector('[data-design-category-form]').reset();setDialogState(designCategoryDialog,true,'[name="categoryName"]')}
document.querySelector('[data-add-design-category]')?.addEventListener('click',()=>openDesignCategoryDialog());document.querySelectorAll('[data-design-category-close]').forEach(button=>button.addEventListener('click',()=>setDialogState(designCategoryDialog,false)));document.querySelector('[data-design-category-form]')?.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget),name=String(data.get('categoryName')||'').trim(),description=String(data.get('categoryDescription')||'').trim(),categories=catalogDesignTrees[activeDesignTree].categories,parent=pendingDesignParent?categories[pendingDesignParent]:null,depth=parent?parent.depth+1:1;if(depth>5)return showToast('目录树最多支持五层');if(Object.values(categories).some(item=>item.parentId===pendingDesignParent&&item.name===name))return showToast('同级目录名称已存在');const id=`category-${Date.now()}`;categories[id]={name,description,properties:[],parentId:pendingDesignParent,depth};activeDesignCategory=id;saveCatalogDesignTrees();setDialogState(designCategoryDialog,false);event.currentTarget.reset();renderDesignProperties();showToast(`已新增${depth}级目录“${name}”`)});
document.querySelector('[data-open-property-dialog]')?.addEventListener('click',()=>activeDesignCategory?setDialogState(designPropertyDialog,true,'[name="propertyName"]'):showToast('请先新增分类'));document.querySelectorAll('[data-property-close]').forEach(button=>button.addEventListener('click',()=>setDialogState(designPropertyDialog,false)));document.querySelector('[data-property-form]')?.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget),item=catalogDesignTrees[activeDesignTree].categories[activeDesignCategory],code=String(data.get('propertyCode')||'').trim();if(item.properties.some(property=>property[1]===code))return showToast('字段编码已存在');item.properties.push([String(data.get('propertyName')).trim(),code,String(data.get('propertyType')),data.get('required')==='on',String(data.get('propertyPrompt')).trim()]);saveCatalogDesignTrees();setDialogState(designPropertyDialog,false);event.currentTarget.reset();renderDesignProperties();showToast('已新增分类属性')});if(catalogCategoryList)renderDesignProperties();

const sourceSpace = document.body.dataset.page === 'documents-personal' ? 'personal' : document.body.dataset.page === 'documents-team' ? 'team' : 'enterprise';
document.querySelectorAll('[data-source-task="tag"]').forEach(button => button.remove());
document.querySelectorAll('a[href^="space-file-detail.html"]').forEach(link => {
  const url = new URL(link.href, location.href);
  if (!url.searchParams.has('space')) url.searchParams.set('space', sourceSpace);
  link.href = `${url.pathname.split('/').pop()}?${url.searchParams.toString()}`;
});

const enterpriseAttributeSections = document.querySelectorAll('[data-enterprise-attributes]');
if (enterpriseAttributeSections.length) {
  const params = new URLSearchParams(location.search);
  const space = params.get('space') || 'enterprise';
  const spaces = {
    enterprise: { name: '企业空间', page: 'documents.html', description: '企业空间文件的内容与属性信息' },
    personal: { name: '个人空间', page: 'personal-documents.html', description: '个人空间文件的内容与基本信息' },
    team: { name: '团队空间', page: 'team-documents.html', description: '团队空间文件的内容与基本信息' }
  };
  const context = spaces[space] || spaces.enterprise;
  const enterprise = space === 'enterprise';
  const back = document.querySelector('[data-space-back]');
  if (back) { back.href = context.page; back.textContent = `‹ 返回${context.name}`; }
  const description = document.querySelector('[data-space-description]');
  if (description) description.textContent = context.description;
  document.querySelectorAll('[data-space-name]').forEach(node => { node.textContent = context.name; });
  enterpriseAttributeSections.forEach(section => { section.hidden = !enterprise; });
  const standardInfo = document.querySelector('[data-standard-file-info]');
  if (standardInfo) standardInfo.hidden = enterprise;
  document.querySelectorAll('[data-edit-file-attributes]').forEach(button => { button.hidden = !enterprise; });

  const basicInfoList = document.querySelector('[data-file-basic-info]');
  if (basicInfoList) {
    const fileName = params.get('file') || '对公授信审查办法.pdf';
    const tagRecord = findFileTagRecord(fileName);
    const extension = (fileName.match(/\.([^.]+)$/)?.[1] || '').toLowerCase();
    const type = tagRecord?.type || ({ pdf: 'PDF', doc: 'Word', docx: 'Word', txt: 'TXT', png: '图片', jpg: '图片', jpeg: '图片', gif: '图片', webp: '图片', mp4: '视频', mov: '视频', avi: '视频' }[extension] || 'PDF');
    const format = extension ? extension.toUpperCase() : ({ PDF: 'PDF', Word: 'DOCX', TXT: 'TXT', 图片: 'PNG', 视频: 'MP4' }[type] || type);
    const common = [
      ['文件ID', `FILE_${String(fileName).length.toString().padStart(4, '0')}_20260908`],
      ['文件名称', fileName], ['所属空间', context.name], ['知识源', tagRecord?.source || '制度文档空间'],
      ['文件类型', type], ['文件格式', format], ['文件大小', type === '视频' ? '286 MB' : type === '图片' ? '4.6 MB' : '2.8 MB'],
      ['来源系统', type === '图片' || type === '视频' ? '业务采集系统' : '文件中心'],
      ['源端文件ID', `SOURCE_${String(fileName).length.toString().padStart(4, '0')}`],
      ['创建人', '李程'], ['创建时间', '2026-08-12 09:30'],
      ['最后更新时间', '2026-09-08 09:30'], ['入库时间', '2026-08-12 09:30']
    ];
    const extensions = {
      PDF: [['页数', '28 页'], ['字符数', '18,500 字'], ['语言', '中文']],
      Word: [['页数', '16 页'], ['字符数', '12,680 字'], ['语言', '中文']],
      TXT: [['字符数', '8,426 字'], ['语言', '中文'], ['编码格式', 'UTF-8']],
      图片: [['分辨率', '3840 × 2160'], ['拍摄时间', '2026-09-08 08:20'], ['拍摄设备', '移动巡检终端']],
      视频: [['分辨率', '1920 × 1080'], ['视频时长', '00:12:35'], ['帧率', '25 fps'], ['开始时间', '2026-09-08 08:20'], ['结束时间', '2026-09-08 08:32']]
    };
    const escapeBasic = value => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
    basicInfoList.innerHTML = [...common, ...(extensions[type] || [])].map(([label, value]) => `<div><dt>${escapeBasic(label)}</dt><dd>${escapeBasic(value)}</dd></div>`).join('');
    const typeBadge = document.querySelector('[data-basic-file-type]');
    if (typeBadge) typeBadge.textContent = type;
  }

  const attributeRows = [...document.querySelectorAll('[data-file-attribute]')];
  const actions = document.querySelector('[data-file-attribute-actions]');
  const storageKey = `kep-file-attributes:${params.get('file') || '默认文件'}`;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    attributeRows.forEach((row, index) => {
      if (!saved[index]) return;
      row.querySelector('[data-attribute-value]').textContent = saved[index];
      row.querySelector('input').value = saved[index];
    });
  } catch {}
  const setAttributeEditing = editing => {
    document.documentElement.classList.toggle('is-file-attribute-editing', editing);
    enterpriseAttributeSections.forEach(section => section.classList.toggle('is-editing', editing));
    attributeRows.forEach(row => {
      row.querySelector('[data-attribute-value]').hidden = editing;
      row.querySelector('.input-wrap').hidden = !editing;
      if (!editing) row.querySelector('input').value = row.querySelector('[data-attribute-value]').textContent;
    });
    if (actions) actions.hidden = !editing;
    document.querySelectorAll('[data-edit-file-attributes]').forEach(button => { button.disabled = editing; });
    if (editing) attributeRows[0]?.querySelector('input')?.focus();
  };
  document.querySelectorAll('[data-edit-file-attributes]').forEach(button => button.addEventListener('click', () => {
    document.querySelector('#file-info-tab')?.click();
    setAttributeEditing(true);
  }));
  document.querySelector('[data-cancel-file-attributes]')?.addEventListener('click', () => setAttributeEditing(false));
  document.querySelector('[data-save-file-attributes]')?.addEventListener('click', () => {
    const values = attributeRows.map(row => row.querySelector('input').value.trim());
    if (values.some(value => !value)) return showToast('请完整填写属性值');
    attributeRows.forEach((row, index) => { row.querySelector('[data-attribute-value]').textContent = values[index]; });
    localStorage.setItem(storageKey, JSON.stringify(values));
    setAttributeEditing(false);
    showToast('文件属性已保存');
  });
  document.querySelectorAll('[data-show-file-evidence]').forEach(button => button.addEventListener('click', () => {
    document.querySelector('#file-preview-tab')?.click();
    document.querySelector('.document-paper')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
}

const knowledgeAssetTreeSelect = document.querySelector('[data-knowledge-asset-tree-select]');
const knowledgeAssetTreeNode = document.querySelector('[data-knowledge-asset-tree]');
const organizationAssetTree = {
  name: '机构目录',
  description: '按企业组织机构体系组织知识资产',
  categories: {
    'head-office': { name: '总行', description: '总行级共享知识资产', parentId: null, depth: 1, properties: [] },
    'customer-business': { name: '公司业务部', description: '客户经营与公司业务知识资产', parentId: 'head-office', depth: 2, properties: [] },
    'risk-compliance': { name: '风险与合规部', description: '风险管理与合规知识资产', parentId: 'head-office', depth: 2, properties: [] },
    'technology': { name: '信息科技部', description: '信息科技与数据管理知识资产', parentId: 'head-office', depth: 2, properties: [] }
  }
};
const organizationAssetTreeStorageKey = 'kep-knowledge-asset-organization-tree';
try {
  const savedOrganizationAssetTree = JSON.parse(localStorage.getItem(organizationAssetTreeStorageKey) || 'null');
  if (savedOrganizationAssetTree?.categories) Object.assign(organizationAssetTree, savedOrganizationAssetTree);
} catch {}
Object.values(organizationAssetTree.categories).forEach(item => {
  item.parentId = item.parentId || null;
  item.depth = item.depth || 1;
  item.properties = Array.isArray(item.properties) ? item.properties : [];
});
const knowledgeAssetTrees = { ...catalogDesignTrees, organization: organizationAssetTree };
let activeKnowledgeAssetTree = 'document';
let activeKnowledgeAssetDirectory = 'all';
let pendingKnowledgeAssetDirectory = null;
let pendingKnowledgeAssetParent = null;
let pendingKnowledgeAssetDelete = null;

function knowledgeAssetPaths(card) {
  return String(card.dataset.assetPaths || '').split(',').map(path => path.trim()).filter(Boolean);
}

function knowledgeAssetDescendants(categories, id) {
  const descendants = new Set([id]);
  let changed = true;
  while (changed) {
    changed = false;
    Object.entries(categories).forEach(([childId, item]) => {
      if (item.parentId && descendants.has(item.parentId) && !descendants.has(childId)) {
        descendants.add(childId);
        changed = true;
      }
    });
  }
  return descendants;
}

function knowledgeAssetCardMatches(card, treeId, directoryId) {
  const treePaths = knowledgeAssetPaths(card).filter(path => path.startsWith(`${treeId}:`));
  if (directoryId === 'all') return treePaths.length > 0;
  const descendants = knowledgeAssetDescendants(knowledgeAssetTrees[treeId].categories, directoryId);
  return treePaths.some(path => descendants.has(path.split(':')[1]));
}

function knowledgeAssetDirectoryCount(treeId, directoryId) {
  return [...document.querySelectorAll('[data-knowledge-asset-card]')].filter(card => knowledgeAssetCardMatches(card, treeId, directoryId)).length;
}

function knowledgeAssetCategoryMarkup(treeId, id, item, categories) {
  const children = Object.entries(categories).filter(([, child]) => child.parentId === id);
  const addChildAction = item.depth < 5
    ? '<button type="button" role="menuitem" data-knowledge-asset-add-child>新建子目录</button>'
    : '<button class="is-disabled" type="button" role="menuitem" disabled>已达到五级</button>';
  return `<div class="knowledge-asset-tree-branch" role="treeitem" aria-level="${item.depth}" data-knowledge-asset-node="${safeDesignText(id)}"><div class="knowledge-asset-tree-row"><button class="knowledge-asset-tree-item" type="button" data-knowledge-asset-directory="${safeDesignText(id)}" aria-pressed="false"><span class="knowledge-asset-tree-caret">${children.length ? '▾' : '›'}</span><span class="knowledge-asset-tree-folder">▰</span><span>${safeDesignText(item.name)}</span><span class="knowledge-asset-tree-count text-number">${knowledgeAssetDirectoryCount(treeId, id)}</span></button><button class="source-function-trigger" type="button" aria-haspopup="menu" aria-expanded="false" data-knowledge-asset-node-menu aria-label="${safeDesignText(item.name)}目录操作">⋮</button><div class="source-function-menu" role="menu" hidden>${addChildAction}<button type="button" role="menuitem" data-knowledge-asset-edit-directory>编辑目录</button><button class="is-danger" type="button" role="menuitem" data-knowledge-asset-delete-directory>删除目录</button></div></div>${children.length ? `<div class="knowledge-asset-tree-children" role="group">${children.map(([childId, child]) => knowledgeAssetCategoryMarkup(treeId, childId, child, categories)).join('')}</div>` : ''}</div>`;
}

function updateKnowledgeAssetCards() {
  const tree = knowledgeAssetTrees[activeKnowledgeAssetTree];
  const category = tree.categories[activeKnowledgeAssetDirectory];
  let visibleCount = 0;
  document.querySelectorAll('[data-knowledge-asset-card]').forEach(card => {
    const visible = knowledgeAssetCardMatches(card, activeKnowledgeAssetTree, activeKnowledgeAssetDirectory);
    card.hidden = !visible;
    if (!visible) return;
    visibleCount += 1;
    const matchingPath = knowledgeAssetPaths(card).find(path => path.startsWith(`${activeKnowledgeAssetTree}:`));
    const categoryName = matchingPath ? tree.categories[matchingPath.split(':')[1]]?.name : null;
    const location = card.querySelector('.knowledge-asset-card-footer > span:first-child');
    if (location && categoryName) location.textContent = categoryName;
  });
  document.querySelector('[data-knowledge-asset-list-empty]')?.remove();
  if (!visibleCount) {
    const empty = document.createElement('div');
    empty.className = 'knowledge-asset-list-empty';
    empty.dataset.knowledgeAssetListEmpty = '';
    empty.innerHTML = '<strong class="text-medium-bold">当前目录暂无知识资产</strong><p class="text-normal">可在后续资产发布或移动时挂载到该目录节点。</p>';
    document.querySelector('[data-knowledge-asset-list]')?.append(empty);
  }
  const label = activeKnowledgeAssetDirectory === 'all' ? '全部资产' : category?.name || '目录';
  document.querySelector('[data-knowledge-asset-title]').textContent = label;
  document.querySelector('[data-knowledge-asset-directory-label]').textContent = label;
  document.querySelector('[data-knowledge-asset-summary]').textContent = `当前目录共挂载 ${visibleCount} 项知识资产`;
  document.querySelectorAll('[data-knowledge-asset-directory]').forEach(button => {
    const active = button.dataset.knowledgeAssetDirectory === activeKnowledgeAssetDirectory;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function renderKnowledgeAssetTree(treeId) {
  activeKnowledgeAssetTree = treeId;
  activeKnowledgeAssetDirectory = 'all';
  const tree = knowledgeAssetTrees[treeId];
  const categories = tree.categories || {};
  const roots = Object.entries(categories).filter(([, item]) => !item.parentId);
  document.querySelector('[data-knowledge-asset-tree-title]').textContent = tree.name;
  document.querySelector('[data-knowledge-asset-tree-description]').textContent = treeId === 'organization' ? tree.description : `同步资源目录设计 · ${tree.description}`;
  document.querySelector('[data-knowledge-asset-path-tree]').textContent = tree.name;
  const total = knowledgeAssetDirectoryCount(treeId, 'all');
  knowledgeAssetTreeNode.innerHTML = `<button class="knowledge-asset-tree-item is-active" type="button" data-knowledge-asset-directory="all" aria-pressed="true"><span class="knowledge-asset-tree-caret">▾</span><span class="knowledge-asset-tree-folder">▰</span><span>全部资产</span><span class="knowledge-asset-tree-count text-number">${total}</span></button>${roots.map(([id, item]) => knowledgeAssetCategoryMarkup(treeId, id, item, categories)).join('') || '<p class="knowledge-asset-tree-empty text-small">该目录树还没有目录节点</p>'}`;
  updateKnowledgeAssetCards();
}

function saveKnowledgeAssetTree() {
  if (activeKnowledgeAssetTree === 'organization') {
    localStorage.setItem(organizationAssetTreeStorageKey, JSON.stringify(organizationAssetTree));
  } else {
    saveCatalogDesignTrees();
  }
}

function closeKnowledgeAssetNodeMenus(except = null) {
  document.querySelectorAll('[data-knowledge-asset-node-menu]').forEach(trigger => {
    const open = trigger === except;
    trigger.setAttribute('aria-expanded', String(open));
    const menu = trigger.parentElement.querySelector('.source-function-menu');
    if (menu) menu.hidden = !open;
  });
}

const knowledgeAssetDirectoryDialog = document.querySelector('[data-knowledge-asset-directory-dialog]');
const knowledgeAssetDirectoryForm = document.querySelector('[data-knowledge-asset-directory-form]');
const knowledgeAssetDeleteDialog = document.querySelector('[data-knowledge-asset-delete-dialog]');

function openKnowledgeAssetDirectoryDialog(directoryId = null, parentId = null) {
  const categories = knowledgeAssetTrees[activeKnowledgeAssetTree].categories;
  const directory = directoryId ? categories[directoryId] : null;
  const parent = parentId ? categories[parentId] : directory?.parentId ? categories[directory.parentId] : null;
  const depth = directory?.depth || (parent ? parent.depth + 1 : 1);
  if (depth > 5) return showToast('资产目录最多支持五级');
  pendingKnowledgeAssetDirectory = directoryId;
  pendingKnowledgeAssetParent = directory ? directory.parentId : parentId;
  knowledgeAssetDirectoryForm.reset();
  document.querySelector('[data-knowledge-asset-directory-dialog-title]').textContent = directory ? '编辑目录' : parent ? '新建子目录' : '新建一级目录';
  document.querySelector('[data-knowledge-asset-directory-parent]').textContent = parent?.name || knowledgeAssetTrees[activeKnowledgeAssetTree].name;
  document.querySelector('[data-knowledge-asset-directory-level]').textContent = `${['一', '二', '三', '四', '五'][depth - 1]}级目录`;
  document.querySelector('[data-knowledge-asset-directory-submit]').textContent = directory ? '保存修改' : '确认新建';
  knowledgeAssetDirectoryForm.elements.directoryName.value = directory?.name || '';
  knowledgeAssetDirectoryForm.elements.directoryDescription.value = directory?.description || '';
  setDialogState(knowledgeAssetDirectoryDialog, true, '[name="directoryName"]');
}

function requestKnowledgeAssetDirectoryDelete(directoryId) {
  const categories = knowledgeAssetTrees[activeKnowledgeAssetTree].categories;
  const directory = categories[directoryId];
  const hasChildren = Object.values(categories).some(item => item.parentId === directoryId);
  const mountedAssetCount = knowledgeAssetDirectoryCount(activeKnowledgeAssetTree, directoryId);
  if (hasChildren || mountedAssetCount) {
    const reason = hasChildren && mountedAssetCount ? '子目录和已挂载资产' : hasChildren ? '子目录' : '已挂载资产';
    return showToast(`请先迁移该目录下的${reason}`);
  }
  pendingKnowledgeAssetDelete = directoryId;
  document.querySelector('[data-knowledge-asset-delete-name]').textContent = directory.name;
  setDialogState(knowledgeAssetDeleteDialog, true, '[data-knowledge-asset-delete-confirm]');
}

if (knowledgeAssetTreeSelect && knowledgeAssetTreeNode) {
  knowledgeAssetTreeSelect.innerHTML = Object.entries(knowledgeAssetTrees).map(([id, tree]) => `<option value="${safeDesignText(id)}">${safeDesignText(tree.name)}</option>`).join('');
  document.querySelector('[data-knowledge-asset-tree-count]').textContent = String(Object.keys(knowledgeAssetTrees).length);
  knowledgeAssetTreeSelect.addEventListener('change', event => renderKnowledgeAssetTree(event.currentTarget.value));
  document.querySelector('[data-knowledge-asset-create-root]')?.addEventListener('click', () => openKnowledgeAssetDirectoryDialog());
  knowledgeAssetTreeNode.addEventListener('click', event => {
    const branch = event.target.closest('[data-knowledge-asset-node]');
    const menuTrigger = event.target.closest('[data-knowledge-asset-node-menu]');
    if (menuTrigger) {
      const willOpen = menuTrigger.getAttribute('aria-expanded') !== 'true';
      closeKnowledgeAssetNodeMenus(willOpen ? menuTrigger : null);
      return;
    }
    if (branch && event.target.closest('[data-knowledge-asset-add-child]')) {
      openKnowledgeAssetDirectoryDialog(null, branch.dataset.knowledgeAssetNode);
    } else if (branch && event.target.closest('[data-knowledge-asset-edit-directory]')) {
      openKnowledgeAssetDirectoryDialog(branch.dataset.knowledgeAssetNode);
    } else if (branch && event.target.closest('[data-knowledge-asset-delete-directory]')) {
      requestKnowledgeAssetDirectoryDelete(branch.dataset.knowledgeAssetNode);
    } else {
      const button = event.target.closest('[data-knowledge-asset-directory]');
      if (!button) return;
      activeKnowledgeAssetDirectory = button.dataset.knowledgeAssetDirectory;
      updateKnowledgeAssetCards();
    }
    closeKnowledgeAssetNodeMenus();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('[data-knowledge-asset-node-menu], .knowledge-asset-tree-row .source-function-menu')) closeKnowledgeAssetNodeMenus();
  });
  document.querySelectorAll('[data-knowledge-asset-directory-dialog-close]').forEach(button => button.addEventListener('click', () => setDialogState(knowledgeAssetDirectoryDialog, false)));
  knowledgeAssetDirectoryForm?.addEventListener('submit', event => {
    event.preventDefault();
    const categories = knowledgeAssetTrees[activeKnowledgeAssetTree].categories;
    const current = pendingKnowledgeAssetDirectory ? categories[pendingKnowledgeAssetDirectory] : null;
    const parent = pendingKnowledgeAssetParent ? categories[pendingKnowledgeAssetParent] : null;
    const name = String(new FormData(event.currentTarget).get('directoryName') || '').trim();
    const description = String(new FormData(event.currentTarget).get('directoryDescription') || '').trim();
    const duplicate = Object.entries(categories).some(([id, item]) => id !== pendingKnowledgeAssetDirectory && item.parentId === (current?.parentId || pendingKnowledgeAssetParent || null) && item.name === name);
    if (duplicate) return showToast('同级目录名称已存在');
    let savedDirectoryId = pendingKnowledgeAssetDirectory;
    if (current) {
      current.name = name;
      current.description = description;
    } else {
      savedDirectoryId = `asset-directory-${Date.now()}`;
      categories[savedDirectoryId] = { name, description, parentId: pendingKnowledgeAssetParent || null, depth: parent ? parent.depth + 1 : 1, properties: [] };
    }
    saveKnowledgeAssetTree();
    setDialogState(knowledgeAssetDirectoryDialog, false);
    renderKnowledgeAssetTree(activeKnowledgeAssetTree);
    activeKnowledgeAssetDirectory = savedDirectoryId;
    updateKnowledgeAssetCards();
    showToast(current ? `已更新目录“${name}”` : `已新建目录“${name}”`);
  });
  document.querySelectorAll('[data-knowledge-asset-delete-close]').forEach(button => button.addEventListener('click', () => setDialogState(knowledgeAssetDeleteDialog, false)));
  document.querySelector('[data-knowledge-asset-delete-confirm]')?.addEventListener('click', () => {
    const categories = knowledgeAssetTrees[activeKnowledgeAssetTree].categories;
    const directoryName = categories[pendingKnowledgeAssetDelete]?.name;
    if (!directoryName) return;
    delete categories[pendingKnowledgeAssetDelete];
    saveKnowledgeAssetTree();
    pendingKnowledgeAssetDelete = null;
    setDialogState(knowledgeAssetDeleteDialog, false);
    renderKnowledgeAssetTree(activeKnowledgeAssetTree);
    showToast(`已删除目录“${directoryName}”`);
  });
  renderKnowledgeAssetTree(activeKnowledgeAssetTree);
}

const knowledgeAssetDetailName = document.querySelector('[data-knowledge-asset-detail-name]');
if (knowledgeAssetDetailName) {
  const assetName = new URLSearchParams(window.location.search).get('name');
  if (assetName) {
    knowledgeAssetDetailName.textContent = assetName;
    document.title = `${assetName} - 知识工程平台`;
  }
}

const teamSpaceGrid=document.querySelector('[data-team-space-grid]');
if(teamSpaceGrid){
  const dialog=document.querySelector('[data-team-space-dialog]'),form=document.querySelector('[data-team-space-form]'),search=document.querySelector('[data-team-space-search]');
  const storageKey='kep-resource-team-spaces';let customSpaces=[];try{const saved=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(saved))customSpaces=saved}catch{}
  const appendSpace=space=>{const card=document.createElement('article');card.className='resource-space-card';card.dataset.teamSpaceCard='';card.dataset.searchText=`${space.name} ${space.owner} ${space.visibility}`;card.innerHTML=`<div class="resource-space-card-art" aria-hidden="true"><span class="space-art-orbit"></span><span class="space-art-core">${esc(space.name.slice(0,1))}</span></div><div class="resource-space-card-body"><div class="resource-space-card-title"><h2 class="text-medium-bold">${esc(space.name)}</h2><span class="tag tag-small">${esc(space.visibility)}</span></div><p class="text-small">${esc(space.description)}</p><div class="resource-space-card-meta text-small"><span>0 个目录</span><span>0 项资源</span><span>负责人：${esc(space.owner)}</span></div></div><footer class="resource-space-card-footer"><span class="text-small">${space.createdAt?'创建于 '+esc(space.createdAt):'刚刚创建'}</span><a class="btn btn-dense btn-primary" href="resource-catalog-design.html?space=${encodeURIComponent(space.name)}">进入空间 →</a></footer>`;teamSpaceGrid.appendChild(card)};
  const updateSpaceCount=()=>{const count=document.querySelector('[data-team-space-count]');if(count)count.textContent=teamSpaceGrid.querySelectorAll('[data-team-space-card]').length};
  const filterSpaces=()=>{const query=search.value.trim().toLowerCase();let visible=0;teamSpaceGrid.querySelectorAll('[data-team-space-card]').forEach(card=>{const matched=!query||card.dataset.searchText.toLowerCase().includes(query);card.hidden=!matched;if(matched)visible+=1});teamSpaceGrid.querySelector('.resource-space-create-card').hidden=Boolean(query);document.querySelector('[data-team-space-empty]').hidden=visible>0};
  document.querySelectorAll('[data-open-team-space]').forEach(button=>button.addEventListener('click',()=>{form.reset();setDialogState(dialog,true,'[name="spaceName"]')}));
  document.querySelectorAll('[data-team-space-close]').forEach(button=>button.addEventListener('click',()=>setDialogState(dialog,false)));
  dialog.addEventListener('click',event=>{if(event.target===dialog)setDialogState(dialog,false)});
  search.addEventListener('input',filterSpaces);
  customSpaces.forEach(appendSpace);
  form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const data=new FormData(form),space={name:String(data.get('spaceName')).trim(),owner:String(data.get('spaceOwner')).trim(),description:String(data.get('spaceDescription')).trim(),visibility:String(data.get('visibility')),managers:String(data.get('spaceManagers')||''),editors:String(data.get('spaceEditors')||''),viewers:String(data.get('spaceViewers')||''),createdAt:new Date().toLocaleDateString('zh-CN')};if([...teamSpaceGrid.querySelectorAll('[data-team-space-card] h2')].some(title=>title.textContent.trim()===space.name))return showToast('空间名称已存在');customSpaces.push(space);localStorage.setItem(storageKey,JSON.stringify(customSpaces));appendSpace(space);updateSpaceCount();setDialogState(dialog,false);showToast(`已创建团队空间“${space.name}”`)});
  updateSpaceCount();
}

const resourceDirectoryTreeNode=document.querySelector('[data-resource-directory-tree]');
if(resourceDirectoryTreeNode){
const directoryKey='kep-resource-directory-spaces',defaults={personal:{name:'个人空间',summary:'管理我的文件夹',note:'个人目录仅由当前用户管理。',nodes:[{id:'p-work',name:'工作资料',description:'日常工作文档与项目材料。',parentId:null,depth:1},{id:'p-plan',name:'产品规划',description:'产品方案和版本规划。',parentId:'p-work',depth:2},{id:'p-study',name:'学习资料',description:'个人学习笔记与参考文档。',parentId:null,depth:1},{id:'p-draft',name:'临时文件',description:'待整理的临时内容。',parentId:null,depth:1}]},team:{name:'团队空间',summary:'企业业务分类目录',note:'团队目录按企业业务视角组织，子目录默认继承父目录权限。',nodes:[{id:'t-corporate',name:'公司金融',description:'面向企业客户的金融业务资源。',parentId:null,depth:1,inherit:false,permissions:{manage:['团队负责人'],edit:['公司金融产品组'],view:['团队全员']}},{id:'t-credit',name:'对公授信',description:'授信制度、审查规范和业务案例。',parentId:'t-corporate',depth:2,inherit:true,permissions:{manage:['团队负责人'],edit:['公司金融产品组'],view:['团队全员']}},{id:'t-retail',name:'零售金融',description:'个人客户、零售产品与营销资源。',parentId:null,depth:1,inherit:false,permissions:{manage:['团队负责人'],edit:['零售产品组'],view:['团队全员']}},{id:'t-risk',name:'风险管理',description:'风险政策、合规规则与风险案例。',parentId:null,depth:1,inherit:false,permissions:{manage:['风险管理部'],edit:['风险策略组'],view:['团队全员']}}]}};
let spaces=defaults;try{const saved=JSON.parse(localStorage.getItem(directoryKey)||'null');if(saved?.personal?.nodes&&saved?.team?.nodes)spaces=saved}catch{}
const directoryResourceKey='kep-resource-directory-mounts',defaultFiles=[['personal','p-work','客户需求调研记录','DOCX','当前用户','file'],['personal','p-plan','知识工程产品规划','PPTX','当前用户','file'],['personal','p-study','知识图谱学习笔记','PDF','当前用户','file'],['personal','p-draft','未整理会议纪要','DOCX','当前用户','file'],['team','t-credit','对公授信审查办法','PDF','王翠','file'],['team','t-credit','授信客户风险汇总','数据表','陈曦','table'],['team','t-corporate','公司金融产品手册','DOCX','李程','file'],['team','t-corporate','企业客户主数据','数据表','赵峰','table'],['team','t-retail','零售客户分层方案','PPTX','张明','file'],['team','t-risk','客户风险评级规则','XLSX','刘敏','file']];
let files=defaultFiles;try{const savedFiles=JSON.parse(localStorage.getItem(directoryResourceKey)||'null');if(Array.isArray(savedFiles))files=savedFiles}catch{}
const saveFiles=()=>localStorage.setItem(directoryResourceKey,JSON.stringify(files));
const directoryResourceCandidates={file:[{id:'f-credit-policy',name:'对公授信审查办法.pdf',type:'PDF',source:'制度文档空间'},{id:'f-loan-policy',name:'固定资产贷款管理办法.docx',type:'Word',source:'制度文档空间'},{id:'f-risk-note',name:'客户风险评级服务设计.txt',type:'TXT',source:'研发协作空间'},{id:'f-credit-flow',name:'征信接口流程图.png',type:'图片',source:'研发协作空间'},{id:'f-training',name:'授信规则培训视频.mp4',type:'视频',source:'归档文档库'}],table:[{id:'t-customer-master',name:'企业客户主数据',type:'数据表',source:'客户数据仓'},{id:'t-credit-summary',name:'授信客户风险汇总',type:'数据表',source:'客户数据仓'},{id:'t-contract-index',name:'合同档案索引表',type:'数据表',source:'核心业务库'},{id:'t-risk-indicator',name:'风险指标明细表',type:'数据表',source:'风险数据集市'}]};
const defaultPermissionEntries={team:[{kind:'user',name:'王浩杰',path:'总行 / 产品部',level:'manage'},{kind:'user',name:'陈曦',path:'总行 / 公司金融部',level:'edit'},{kind:'group',name:'公司金融产品组',path:'总行 / 产品中心',level:'edit'},{kind:'group',name:'团队全员',path:'当前团队',level:'view'},{kind:'org',name:'风险管理部',path:'总行 / 风险管理部',level:'view'}],personal:[{kind:'user',name:'当前用户',path:'我的空间',level:'manage'}]},permissionEntries={};
const permissionCandidates={user:[{id:'u-liudan',name:'刘丹',account:'liudan',detail:'liu.dan@haizhi.com',path:'总行 / 产品部'},{id:'u-liuhuan',name:'刘焕',account:'liuhuan',detail:'liu.huan@haizhi.com',path:'总行 / 公司金融部'},{id:'u-wanghaojie',name:'王浩杰',account:'wanghaojie',detail:'wang.haojie@haizhi.com',path:'总行 / 产品部'},{id:'u-liujie',name:'刘捷',account:'liujie',detail:'liu.jie@haizhi.com',path:'总行 / 风险管理部'},{id:'u-liuyize',name:'刘漪泽',account:'liuyize',detail:'liu.yize@haizhi.com',path:'总行 / 数据中心'},{id:'u-liuxianglong',name:'刘翔龙',account:'liuxianglong',detail:'liu.xianglong@haizhi.com',path:'分行 / 信息科技部'}],group:[{id:'g-product',name:'产品经理组',account:'12 名成员',detail:'用户组',path:'总行 / 产品部'},{id:'g-corporate',name:'公司金融产品组',account:'18 名成员',detail:'用户组',path:'总行 / 公司金融部'},{id:'g-risk',name:'风险策略组',account:'9 名成员',detail:'用户组',path:'总行 / 风险管理部'},{id:'g-data',name:'数据治理组',account:'15 名成员',detail:'用户组',path:'总行 / 数据中心'}],org:[{id:'o-product',name:'产品部',account:'一级部门',detail:'36 人',path:'总行 / 产品部'},{id:'o-corporate',name:'公司金融部',account:'一级部门',detail:'52 人',path:'总行 / 公司金融部'},{id:'o-risk',name:'风险管理部',account:'一级部门',detail:'41 人',path:'总行 / 风险管理部'},{id:'o-data',name:'数据中心',account:'一级部门',detail:'68 人',path:'总行 / 数据中心'}]};
let activeSpace='team',activeId=null,pendingParent=null,activePermissionKind='user',permissionDraft=[];const dialog=document.querySelector('[data-resource-directory-dialog]'),form=document.querySelector('[data-resource-directory-form]'),permissionDialog=document.querySelector('[data-directory-permission-dialog]'),permissionForm=document.querySelector('[data-directory-permission-form]'),esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),space=()=>spaces[activeSpace],node=id=>space().nodes.find(item=>item.id===id),children=id=>space().nodes.filter(item=>item.parentId===id),save=()=>localStorage.setItem(directoryKey,JSON.stringify(spaces));
const permissionList=()=>{const key=`${activeSpace}:${activeId||'root'}`;if(permissionEntries[key])return permissionEntries[key];const current=node(activeId),levels=['manage','edit','view'],subjectKind=name=>name.endsWith('部')?'org':/(组|全员)$/.test(name)?'group':'user';permissionEntries[key]=activeSpace==='team'&&current?.permissions?levels.flatMap(level=>(current.permissions[level]||[]).map(name=>({kind:subjectKind(name),name,path:current.inherit?'继承父目录':'当前目录',level}))):JSON.parse(JSON.stringify(defaultPermissionEntries[activeSpace]));return permissionEntries[key]};
function syncNodePermissions(){const current=node(activeId);if(activeSpace!=='team'||!current)return;const list=permissionList();current.permissions={manage:list.filter(item=>item.level==='manage').map(item=>item.name),edit:list.filter(item=>item.level==='edit').map(item=>item.name),view:list.filter(item=>item.level==='view').map(item=>item.name)};current.inherit=false;save();renderTree();renderFiles()}
function nodeMarkup(item){const subs=children(item.id),count=files.filter(file=>file[0]===activeSpace&&file[1]===item.id).length,permissions=item.permissions||{manage:[],edit:[],view:[]},permissionSummary=activeSpace==='team'?`<small class="resource-directory-permission-meta"><span class="tag tag-small">${item.inherit?'继承':'独立'}</span><span>管 ${permissions.manage.length}</span><span>编 ${permissions.edit.length}</span><span>看 ${permissions.view.length}</span></small>`:'';return `<div class="resource-directory-node" role="treeitem" aria-level="${item.depth}"><div class="resource-directory-row"><button class="resource-directory-select ${activeId===item.id?'is-active':''}" type="button" data-resource-directory-id="${item.id}"><span class="resource-directory-caret">${subs.length?'⌄':'›'}</span><span class="asset-folder-icon">□</span><span class="resource-directory-node-main"><span>${esc(item.name)}</span>${permissionSummary}</span><span class="resource-directory-count text-number">${count}</span></button><button class="resource-directory-add-child" type="button" data-resource-directory-child="${item.id}" aria-label="在${esc(item.name)}下新建子目录">+</button></div>${subs.length?`<div class="resource-directory-children" role="group">${subs.map(nodeMarkup).join('')}</div>`:''}</div>`}
function renderTree(){resourceDirectoryTreeNode.innerHTML=children(null).map(nodeMarkup).join('')||'<p class="source-empty-state text-small">暂无目录，请新建一级目录</p>'}
function renderFiles(){const selected=activeId?node(activeId):null,query=document.querySelector('[data-resource-directory-file-search]').value.trim().toLowerCase(),folderRows=children(selected?.id||null).map(item=>({name:item.name,type:'文件夹',owner:activeSpace==='team'?'目录管理员':'当前用户',kind:'folder',id:item.id})),resourceRows=files.filter(file=>file[0]===activeSpace&&file[1]===(selected?.id||null)).map(file=>({name:file[2],type:file[3],owner:file[4],kind:file[5]})),visible=[...folderRows,...resourceRows].filter(item=>`${item.name} ${item.type} ${item.owner}`.toLowerCase().includes(query)),rows=document.querySelector('[data-resource-directory-file-rows]');rows.innerHTML=visible.map(item=>{const detailHref=`resource-catalog-detail.html?context=directory&space=${encodeURIComponent(new URLSearchParams(location.search).get('space')||activeSpace)}&file=${encodeURIComponent(item.name)}`,name=item.kind==='folder'?`<button class="document-link resource-folder-link" type="button" data-open-directory-node="${item.id}">${esc(item.name)}</button>`:`<a class="document-link" href="${detailHref}">${esc(item.name)}</a>`,action=item.kind==='folder'?`<button class="btn btn-dense btn-text" type="button" data-open-directory-node="${item.id}">进入</button>`:`<a class="btn btn-dense btn-text" href="${detailHref}">查看</a>`;return `<tr><td class="cell-primary">${name}</td><td><span class="resource-kind-badge resource-kind-${item.kind}">${esc(item.type)}</span></td><td>${esc(selected?.name||space().name)}</td><td>${esc(item.owner)}</td><td>2026-09-08 16:42</td><td class="cell-actions">${action}</td></tr>`}).join('');document.querySelector('[data-resource-directory-empty]').hidden=visible.length>0;document.querySelector('[data-resource-directory-file-count]').textContent=`${visible.length} 项资源`;document.querySelector('[data-resource-directory-path]').textContent=selected?.name||'全部资源';document.querySelector('[data-resource-directory-title]').textContent=selected?.name||'全部资源';document.querySelector('[data-resource-directory-description]').textContent=selected?.description||`展示${space().name}的顶级目录`;const summary=document.querySelector('[data-directory-permission-summary]');summary.hidden=activeSpace!=='team'||!selected;if(activeSpace==='team'&&selected){document.querySelector('[data-directory-manage-count]').textContent=selected.permissions?.manage?.length||0;document.querySelector('[data-directory-edit-count]').textContent=selected.permissions?.edit?.length||0;document.querySelector('[data-directory-view-count]').textContent=selected.permissions?.view?.length||0}}
function renderPermissions(){const query=document.querySelector('[data-directory-permission-search]').value.trim().toLowerCase(),labels={user:'用户',group:'用户组',org:'组织机构'},entries=permissionList().filter(item=>item.kind===activePermissionKind&&`${item.name} ${item.path}`.toLowerCase().includes(query)),rows=document.querySelector('[data-directory-permission-rows]');rows.innerHTML=entries.map((item,index)=>`<tr><td class="cell-primary"><span class="permission-subject"><span class="permission-avatar">${esc(item.name.slice(0,1))}</span><strong>${esc(item.name)}</strong></span></td><td>${labels[item.kind]}</td><td>${esc(item.path)}</td><td><select class="select select-small" aria-label="设置${esc(item.name)}的权限" data-permission-entry="${index}"><option value="view" ${item.level==='view'?'selected':''}>查看权限</option><option value="edit" ${item.level==='edit'?'selected':''}>编辑权限</option><option value="manage" ${item.level==='manage'?'selected':''}>管理权限</option></select></td><td><span class="tag tag-status tag-status-secondary">${node(activeId)?.inherit?'继承父目录':'当前目录'}</span></td><td class="cell-actions"><button class="btn btn-dense btn-text" type="button" data-remove-permission="${index}" aria-label="移除${esc(item.name)}">移除</button></td></tr>`).join('');document.querySelector('[data-directory-permission-empty]').hidden=entries.length>0}
function renderPermissionPicker(){const query=document.querySelector('[data-permission-candidate-search]').value.trim().toLowerCase(),candidates=permissionCandidates[activePermissionKind].filter(item=>`${item.name} ${item.account} ${item.detail} ${item.path}`.toLowerCase().includes(query)),selectedIds=new Set(permissionDraft.map(item=>item.id)),candidateNode=document.querySelector('[data-permission-candidates]'),selectedNode=document.querySelector('[data-permission-selected]'),typeLabels={user:'用户',group:'用户组',org:'组织机构'};candidateNode.innerHTML=candidates.map(item=>`<label class="permission-candidate-item ${selectedIds.has(item.id)?'is-selected':''}"><input class="checkbox" type="checkbox" value="${item.id}" data-permission-candidate ${selectedIds.has(item.id)?'checked':''}/><span class="permission-avatar">${esc(item.name.slice(0,1))}</span><span class="permission-candidate-main"><strong>${esc(item.name)}</strong><small>${esc(item.path)}</small></span><span class="permission-candidate-meta"><span>${esc(item.account)}</span><small>${esc(item.detail)}</small></span></label>`).join('')||'<div class="source-empty-state text-small">未找到匹配对象</div>';selectedNode.innerHTML=permissionDraft.map(item=>`<div class="permission-selected-item"><span class="permission-avatar">${esc(item.name.slice(0,1))}</span><span class="permission-selected-main"><strong>${esc(item.name)}</strong><small>${typeLabels[activePermissionKind]} · ${esc(item.path)}</small></span><select class="select select-small" aria-label="设置${esc(item.name)}的权限" data-draft-permission="${item.id}"><option value="view" ${item.level==='view'?'selected':''}>查看权限</option><option value="edit" ${item.level==='edit'?'selected':''}>编辑权限</option><option value="manage" ${item.level==='manage'?'selected':''}>管理权限</option></select><button class="permission-selected-remove" type="button" data-remove-draft-permission="${item.id}" aria-label="取消选择${esc(item.name)}">×</button></div>`).join('')||'<div class="permission-picker-empty"><strong>尚未选择对象</strong><span class="text-small">在左侧勾选后，可在此逐个设置权限。</span></div>';document.querySelector('[data-permission-candidate-count]').textContent=`${candidates.length} 个结果`;document.querySelector('[data-permission-selected-count]').textContent=`${permissionDraft.length} 个对象`;document.querySelector('[data-confirm-directory-permission]').disabled=permissionDraft.length===0;document.querySelector('[data-permission-picker-note]').textContent=permissionDraft.length?`将添加 ${permissionDraft.length} 个权限对象`:'请至少选择一个权限对象'}
const resourceDialog=document.querySelector('[data-directory-resource-dialog]'),resourceForm=document.querySelector('[data-directory-resource-form]');
let activeResourceType='file',selectedResourceIds=new Set();
function renderResourcePicker(){
  const query=document.querySelector('[data-directory-resource-search]').value.trim().toLowerCase();
  const candidates=directoryResourceCandidates[activeResourceType].filter(item=>`${item.name} ${item.type} ${item.source}`.toLowerCase().includes(query));
  const rows=document.querySelector('[data-directory-resource-candidates]');
  rows.innerHTML=candidates.map(item=>{const mounted=files.some(file=>file[0]===activeSpace&&file[1]===activeId&&file[2]===item.name&&file[5]===activeResourceType);return `<tr class="${mounted?'is-disabled':''}"><td class="directory-resource-check"><input class="checkbox" type="checkbox" value="${esc(item.id)}" data-directory-resource-candidate ${selectedResourceIds.has(item.id)?'checked':''} ${mounted?'disabled':''} aria-label="选择${esc(item.name)}"/></td><td class="cell-primary">${esc(item.name)}</td><td><span class="tag tag-small">${esc(item.type)}</span></td><td>${esc(item.source)}</td><td><span class="tag tag-status ${mounted?'tag-status-secondary':'tag-status-lime'}">${mounted?'已挂载':'可添加'}</span></td></tr>`}).join('');
  document.querySelector('[data-directory-resource-candidate-count]').textContent=`${candidates.length} 个结果`;
  document.querySelector('[data-directory-resource-candidate-empty]').hidden=candidates.length>0;
  document.querySelector('[data-directory-resource-selected-count]').textContent=selectedResourceIds.size?`已选择 ${selectedResourceIds.size} 项资源`:'请选择要添加的资源';
  document.querySelector('[data-confirm-directory-resource]').disabled=selectedResourceIds.size===0;
}
function openResourcePicker(){
  if(!activeId)return showToast('请先选择一个目录节点');
  activeResourceType='file';selectedResourceIds=new Set();resourceForm.reset();
  document.querySelector('[data-directory-resource-target]').textContent=node(activeId)?.name||space().name;
  document.querySelectorAll('[data-directory-resource-type]').forEach(button=>{const on=button.dataset.directoryResourceType==='file';button.classList.toggle('is-active',on);button.setAttribute('aria-selected',String(on))});
  renderResourcePicker();setDialogState(resourceDialog,true,'[data-directory-resource-search]');
}
function activateSpace(id){activeSpace=id;activeId=children(null)[0]?.id||null;document.querySelectorAll('[data-directory-space]').forEach(button=>{const on=button.dataset.directorySpace===id;button.classList.toggle('is-active',on);button.setAttribute('aria-selected',String(on))});const permissionTab=document.querySelector('[data-team-permission-tab]');permissionTab.hidden=id!=='team';if(id!=='team'){document.querySelectorAll('[data-directory-content-tab]').forEach(button=>{const on=button.dataset.directoryContentTab==='resources';button.classList.toggle('is-active',on);button.setAttribute('aria-selected',String(on))});document.querySelectorAll('[data-directory-content-panel]').forEach(panel=>panel.hidden=panel.dataset.directoryContentPanel!=='resources')}document.querySelector('[data-directory-space-summary]').textContent=space().summary;document.querySelector('[data-directory-space-note]').textContent=space().note;document.querySelector('[data-resource-directory-root]').textContent=space().name;document.querySelector('[data-open-resource-directory]').textContent=id==='personal'?'新建文件夹':'新建业务目录';document.querySelector('[data-resource-directory-search]').value='';document.querySelector('[data-resource-directory-file-search]').value='';document.querySelector('[data-directory-permission-search]').value='';renderTree();renderFiles();renderPermissions()}
function disablePermissions(disabled){['managePermission','editPermission','viewPermission'].forEach(name=>{form.elements[name].disabled=disabled;form.elements[name].required=activeSpace==='team'&&!disabled})}
function openDirectory(parentId=null){pendingParent=parentId;const parent=parentId?node(parentId):null,depth=parent?parent.depth+1:1;form.reset();document.querySelector('[data-resource-directory-dialog-title]').textContent=activeSpace==='personal'?'新建文件夹':'新建业务目录';document.querySelector('[data-resource-directory-dialog-subtitle]').textContent=activeSpace==='personal'?'在个人空间中创建自有文件夹':'创建业务目录并配置目录授权';document.querySelector('[data-resource-directory-parent]').textContent=parent?.name||space().name;document.querySelector('[data-resource-directory-level]').textContent=`${['一','二','三','四','五'][depth-1]||depth}级目录`;document.querySelector('[data-team-directory-permissions]').hidden=activeSpace!=='team';document.querySelector('.resource-directory-inherit').hidden=activeSpace!=='team'||!parent;const inherit=document.querySelector('[data-inherit-directory-permissions]');inherit.checked=Boolean(parent);const permissions=parent?.permissions||{manage:[],edit:[],view:[]};form.elements.managePermission.value=permissions.manage.join('，');form.elements.editPermission.value=permissions.edit.join('，');form.elements.viewPermission.value=permissions.view.join('，');disablePermissions(activeSpace==='team'&&Boolean(parent));setDialogState(dialog,true,'[name="directoryName"]')}
document.querySelectorAll('[data-directory-space]').forEach(button=>button.addEventListener('click',()=>activateSpace(button.dataset.directorySpace)));
document.querySelectorAll('[data-directory-content-tab]').forEach(button=>button.addEventListener('click',()=>{const target=button.dataset.directoryContentTab;document.querySelectorAll('[data-directory-content-tab]').forEach(item=>{const on=item===button;item.classList.toggle('is-active',on);item.setAttribute('aria-selected',String(on))});document.querySelectorAll('[data-directory-content-panel]').forEach(panel=>panel.hidden=panel.dataset.directoryContentPanel!==target);if(target==='permissions')renderPermissions()}));
document.querySelectorAll('[data-permission-subject-tab]').forEach(button=>button.addEventListener('click',()=>{activePermissionKind=button.dataset.permissionSubjectTab;document.querySelectorAll('[data-permission-subject-tab]').forEach(item=>{const on=item===button;item.classList.toggle('is-active',on);item.setAttribute('aria-selected',String(on))});renderPermissions()}));
document.querySelector('[data-open-resource-directory]').addEventListener('click',()=>openDirectory());
document.querySelector('[data-resource-directory-root]').addEventListener('click',()=>{activeId=null;renderTree();renderFiles();renderPermissions()});
resourceDirectoryTreeNode.addEventListener('click',event=>{const child=event.target.closest('[data-resource-directory-child]');if(child)return openDirectory(child.dataset.resourceDirectoryChild);const select=event.target.closest('[data-resource-directory-id]');if(select){activeId=select.dataset.resourceDirectoryId;renderTree();renderFiles();renderPermissions()}});
document.querySelector('[data-resource-directory-file-rows]').addEventListener('click',event=>{const folder=event.target.closest('[data-open-directory-node]');if(folder){activeId=folder.dataset.openDirectoryNode;renderTree();renderFiles();renderPermissions()}});
document.querySelector('[data-resource-directory-search]').addEventListener('input',event=>{const query=event.currentTarget.value.trim().toLowerCase();resourceDirectoryTreeNode.querySelectorAll('.resource-directory-node').forEach(item=>item.hidden=Boolean(query)&&!item.textContent.toLowerCase().includes(query))});
document.querySelector('[data-resource-directory-file-search]').addEventListener('input',renderFiles);
document.querySelector('[data-open-directory-resource]').addEventListener('click',openResourcePicker);
document.querySelectorAll('[data-directory-resource-close]').forEach(button=>button.addEventListener('click',()=>setDialogState(resourceDialog,false)));
resourceDialog.addEventListener('click',event=>{if(event.target===resourceDialog)setDialogState(resourceDialog,false)});
document.querySelectorAll('[data-directory-resource-type]').forEach(button=>button.addEventListener('click',()=>{activeResourceType=button.dataset.directoryResourceType;selectedResourceIds=new Set();document.querySelectorAll('[data-directory-resource-type]').forEach(item=>{const on=item===button;item.classList.toggle('is-active',on);item.setAttribute('aria-selected',String(on))});renderResourcePicker()}));
document.querySelector('[data-directory-resource-search]').addEventListener('input',renderResourcePicker);
document.querySelector('[data-directory-resource-candidates]').addEventListener('change',event=>{const checkbox=event.target.closest('[data-directory-resource-candidate]');if(!checkbox)return;if(checkbox.checked)selectedResourceIds.add(checkbox.value);else selectedResourceIds.delete(checkbox.value);renderResourcePicker()});
resourceForm.addEventListener('submit',event=>{event.preventDefault();if(!selectedResourceIds.size||!activeId)return;const candidates=directoryResourceCandidates[activeResourceType],selected=candidates.filter(item=>selectedResourceIds.has(item.id));selected.forEach(item=>{if(!files.some(file=>file[0]===activeSpace&&file[1]===activeId&&file[2]===item.name&&file[5]===activeResourceType))files.push([activeSpace,activeId,item.name,item.type,'当前用户',activeResourceType])});saveFiles();setDialogState(resourceDialog,false);renderTree();renderFiles();showToast(`已向“${node(activeId)?.name}”添加 ${selected.length} 项资源`)});
document.querySelector('[data-directory-permission-search]').addEventListener('input',renderPermissions);
document.querySelector('[data-directory-permission-rows]').addEventListener('change',event=>{const select=event.target.closest('[data-permission-entry]');if(!select)return;const visible=permissionList().filter(item=>item.kind===activePermissionKind&&`${item.name} ${item.path}`.toLowerCase().includes(document.querySelector('[data-directory-permission-search]').value.trim().toLowerCase()));if(visible[Number(select.dataset.permissionEntry)]){visible[Number(select.dataset.permissionEntry)].level=select.value;syncNodePermissions()}showToast('权限已更新')});
document.querySelector('[data-directory-permission-rows]').addEventListener('click',event=>{const remove=event.target.closest('[data-remove-permission]');if(!remove)return;const list=permissionList(),visible=list.filter(item=>item.kind===activePermissionKind&&`${item.name} ${item.path}`.toLowerCase().includes(document.querySelector('[data-directory-permission-search]').value.trim().toLowerCase())),target=visible[Number(remove.dataset.removePermission)];if(target){list.splice(list.indexOf(target),1);syncNodePermissions();renderPermissions();showToast(`已移除“${target.name}”的权限`)}});
document.querySelector('[data-open-directory-permission]').addEventListener('click',()=>{permissionForm.reset();permissionDraft=[];const labels={user:'用户',group:'用户组',org:'组织机构'};document.querySelector('[data-permission-picker-title]').textContent=`添加${labels[activePermissionKind]}`;document.querySelector('[data-permission-candidate-search]').value='';renderPermissionPicker();setDialogState(permissionDialog,true,'[data-permission-candidate-search]')});
document.querySelectorAll('[data-directory-permission-close]').forEach(button=>button.addEventListener('click',()=>setDialogState(permissionDialog,false)));
permissionDialog.addEventListener('click',event=>{if(event.target===permissionDialog)setDialogState(permissionDialog,false)});
document.querySelector('[data-permission-candidate-search]').addEventListener('input',renderPermissionPicker);
document.querySelector('[data-permission-candidates]').addEventListener('change',event=>{const checkbox=event.target.closest('[data-permission-candidate]');if(!checkbox)return;const candidate=permissionCandidates[activePermissionKind].find(item=>item.id===checkbox.value);if(!candidate)return;if(checkbox.checked&&!permissionDraft.some(item=>item.id===candidate.id))permissionDraft.push({...candidate,level:'view'});if(!checkbox.checked)permissionDraft=permissionDraft.filter(item=>item.id!==candidate.id);renderPermissionPicker()});
document.querySelector('[data-permission-selected]').addEventListener('change',event=>{const select=event.target.closest('[data-draft-permission]'),item=permissionDraft.find(entry=>entry.id===select?.dataset.draftPermission);if(item)item.level=select.value});
document.querySelector('[data-permission-selected]').addEventListener('click',event=>{const remove=event.target.closest('[data-remove-draft-permission]');if(remove){permissionDraft=permissionDraft.filter(item=>item.id!==remove.dataset.removeDraftPermission);renderPermissionPicker()}});
permissionForm.addEventListener('submit',event=>{event.preventDefault();if(!permissionDraft.length)return;const list=permissionList();permissionDraft.forEach(item=>{const entry={kind:activePermissionKind,name:item.name,path:item.path,level:item.level},matched=list.find(current=>current.kind===entry.kind&&current.name===entry.name);if(matched)matched.level=entry.level;else list.push(entry)});const count=permissionDraft.length;syncNodePermissions();setDialogState(permissionDialog,false);renderPermissions();showToast(`已添加 ${count} 个权限对象`)});
document.querySelector('[data-inherit-directory-permissions]').addEventListener('change',event=>disablePermissions(event.currentTarget.checked));document.querySelectorAll('[data-resource-directory-close]').forEach(button=>button.addEventListener('click',()=>setDialogState(dialog,false)));dialog.addEventListener('click',event=>{if(event.target===dialog)setDialogState(dialog,false)});
form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const data=new FormData(form),parent=pendingParent?node(pendingParent):null,inherit=activeSpace==='team'&&Boolean(parent)&&document.querySelector('[data-inherit-directory-permissions]').checked,list=value=>String(value||'').split(/[,，]/).map(item=>item.trim()).filter(Boolean),name=String(data.get('directoryName')).trim();if(space().nodes.some(item=>item.parentId===pendingParent&&item.name===name))return showToast('同级目录名称已存在');const item={id:`${activeSpace}-${Date.now()}`,name,description:String(data.get('directoryDescription')).trim(),parentId:pendingParent,depth:parent?parent.depth+1:1};if(activeSpace==='team'){item.inherit=inherit;item.permissions=inherit?JSON.parse(JSON.stringify(parent.permissions)):{manage:list(data.get('managePermission')),edit:list(data.get('editPermission')),view:list(data.get('viewPermission'))}}space().nodes.push(item);activeId=item.id;save();setDialogState(dialog,false);renderTree();renderFiles();showToast(`已创建目录“${name}”`)});const selectedTeamSpace=new URLSearchParams(location.search).get('space');if(selectedTeamSpace){document.querySelector('.page-title').textContent=selectedTeamSpace==='all'?'全员空间':selectedTeamSpace==='finance'?'金融空间':selectedTeamSpace==='risk'?'风险管理空间':selectedTeamSpace;document.querySelector('.page-description').textContent='管理当前团队空间的目录、资源与继承权限。'}activateSpace(selectedTeamSpace?'team':document.body.dataset.directoryDefaultSpace||'team');
}

const metadataStandardDialog = document.querySelector('[data-metadata-standard-dialog]');
const metadataStandardForm = document.querySelector('[data-metadata-standard-form]');
if (metadataStandardDialog && metadataStandardForm) {
  const defaults = {
    business: [
      ['business-domain', '业务领域', 'business_domain', '枚举', true, '文件所属的一级业务领域'],
      ['product-line', '产品线', 'product_line', '枚举', true, '文件适用的产品或服务条线'],
      ['customer-segment', '适用客群', 'customer_segment', '枚举', false, '文件面向的客户群体'],
      ['applicable-org', '适用机构', 'applicable_org', '文本', false, '制度或材料的适用机构范围']
    ],
    management: [
      ['resource-owner', '资源负责人', 'resource_owner', '人员', true, '负责文件维护与内容准确性的人员'],
      ['security-level', '保密等级', 'security_level', '枚举', true, '文件访问和传播的保密级别'],
      ['retention-period', '保存期限', 'retention_period', '枚举', false, '文件应保留的期限要求'],
      ['archive-status', '归档状态', 'archive_status', '枚举', false, '文件当前归档管理状态']
    ]
  };
  const key = 'kep-metadata-standards';
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const normalize = source => Object.fromEntries(Object.entries(source).map(([category, items]) => [category, items.map(item => Array.isArray(item) ? { id: item[0], name: item[1], code: item[2], type: item[3], required: item[4], description: item[5], updatedAt: '2026-09-08 10:20' } : item)]));
  let standards;
  try { const saved = JSON.parse(localStorage.getItem(key) || 'null'); standards = saved?.business && saved?.management ? saved : normalize(defaults); } catch { standards = normalize(defaults); }
  let activeCategory = 'business';
  let editingId = null;
  const save = () => localStorage.setItem(key, JSON.stringify(standards));
  const render = category => {
    const body = document.querySelector(`[data-metadata-standard-list="${category}"]`);
    body.innerHTML = standards[category].map(item => `<tr data-metadata-standard-id="${esc(item.id)}" data-metadata-standard-category="${category}"><td class="cell-primary">${esc(item.name)}</td><td class="text-number">${esc(item.code)}</td><td>${esc(item.type)}</td><td><span class="tag tag-status ${item.required ? 'tag-status-blue' : 'tag-status-secondary'}">${item.required ? '必填' : '选填'}</span></td><td>${esc(item.description)}</td><td>${esc(item.updatedAt)}</td><td class="cell-actions"><button class="btn btn-dense btn-text" type="button" data-edit-metadata-standard>编辑</button><button class="btn btn-dense btn-text" type="button" data-delete-metadata-standard>删除</button></td></tr>`).join('');
    document.querySelector(`[data-standard-count="${category}"]`).textContent = `${standards[category].length} 个属性`;
  };
  const openDialog = (category, item = null) => {
    activeCategory = category;
    editingId = item?.id || null;
    metadataStandardForm.reset();
    document.querySelector('#metadata-standard-dialog-title').textContent = `${item ? '编辑' : '新增'}${category === 'business' ? '业务属性' : '管理属性'}`;
    document.querySelector('[data-metadata-standard-subtitle]').textContent = category === 'business' ? '定义文件的业务语义字段标准' : '定义文件的治理与管理字段标准';
    if (item) ['name', 'code', 'type', 'description'].forEach(name => { metadataStandardForm.elements[name].value = item[name]; });
    if (item) metadataStandardForm.elements.required.checked = item.required;
    setDialogState(metadataStandardDialog, true, '[name="name"]');
  };
  document.querySelectorAll('[data-open-metadata-standard]').forEach(button => button.addEventListener('click', () => openDialog(button.dataset.openMetadataStandard)));
  document.querySelectorAll('[data-close-metadata-standard]').forEach(button => button.addEventListener('click', () => setDialogState(metadataStandardDialog, false)));
  metadataStandardDialog.addEventListener('click', event => { if (event.target === metadataStandardDialog) setDialogState(metadataStandardDialog, false); });
  document.querySelectorAll('[data-metadata-standard-list]').forEach(body => body.addEventListener('click', event => {
    const row = event.target.closest('[data-metadata-standard-id]');
    if (!row) return;
    const category = row.dataset.metadataStandardCategory;
    const item = standards[category].find(candidate => candidate.id === row.dataset.metadataStandardId);
    if (event.target.closest('[data-edit-metadata-standard]')) openDialog(category, item);
    if (event.target.closest('[data-delete-metadata-standard]')) {
      standards[category] = standards[category].filter(candidate => candidate.id !== item.id);
      save(); render(category); showToast(`已删除属性“${item.name}”`);
    }
  }));
  metadataStandardForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!metadataStandardForm.reportValidity()) return;
    const data = new FormData(metadataStandardForm);
    const code = String(data.get('code')).trim();
    if (standards[activeCategory].some(item => item.code === code && item.id !== editingId)) return showToast('属性编码已存在');
    const value = { id: editingId || `metadata-${Date.now()}`, name: String(data.get('name')).trim(), code, type: String(data.get('type')), required: data.get('required') === 'on', description: String(data.get('description')).trim(), updatedAt: new Intl.DateTimeFormat('zh-CN', { dateStyle: 'short', timeStyle: 'short', hour12: false }).format(new Date()) };
    const index = standards[activeCategory].findIndex(item => item.id === editingId);
    if (index >= 0) standards[activeCategory][index] = value; else standards[activeCategory].unshift(value);
    save(); render(activeCategory); setDialogState(metadataStandardDialog, false); showToast(`已${index >= 0 ? '更新' : '新增'}属性“${value.name}”`);
  });
  render('business');
  render('management');
}

if (['resource-tasks', 'resource-task-detail'].includes(document.body.dataset.page)) {
  import('./resource-task-detail.js?v=1');
}
