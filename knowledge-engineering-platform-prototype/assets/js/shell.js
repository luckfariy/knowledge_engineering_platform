const icons = {
  resource: '<path d="M4 6h6l2 2h8v11H4z"/>',
  overview: '<path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z"/>',
  document: '<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7"/>',
  table: '<path d="M4 5h16v14H4zM4 10h16M9 5v14"/>',
  graph: '<circle cx="6" cy="7" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="m8 7 8-1m-9 3 4 7m6-8-4 8"/>',
  processing: '<path d="m5 5 4 4-4 4m7-4h7M5 17h14"/>',
  management: '<path d="m12 3 8 4-8 4-8-4 8-4Zm-8 8 8 4 8-4m-16 4 8 4 8-4"/>',
  service: '<path d="M5 7h14v10H5zM8 4v3m8-3v3M8 17v3m8-3v3"/>',
  workspace: '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
  agent: '<path d="M8 9h8a4 4 0 0 1 4 4v5H4v-5a4 4 0 0 1 4-4ZM9 14h.01M15 14h.01M12 9V5m-2-2h4"/>',
  sdk: '<path d="m8 8-4 4 4 4m8-8 4 4-4 4m-2-11-4 14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 12h4"/>'
};

export function icon(name, className = '') {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
}

const resourceChildren = [
  ['resource-overview', '资源概览', 'index.html', 'overview'],
  ['documents', '文档中心', 'pages/documents.html', 'document'],
  ['data-tables', '数据表', 'pages/data-tables.html', 'table'],
  ['graph-data', '图数据', 'pages/graph-data.html', 'graph']
];

const processingChildren = [
  ['processing-overview', '概览', 'pages/processing-overview.html', 'overview'],
  ['processing-models', '加工模型', 'pages/processing-models.html', 'processing'],
  ['processing-flows', '流程加工', 'pages/processing-flows.html', 'table'],
  ['processing-tasks', '加工任务', 'pages/processing-tasks.html', 'document']
];

const managementChildren = [
  ['management-overview', '概览', 'pages/management-overview.html', 'overview'],
  ['semantic-graphs', '语义知识图谱', 'pages/semantic-graphs.html', 'graph'],
  ['knowledge-bases', '知识库', 'pages/knowledge-bases.html', 'management']
];

const serviceChildren = [
  ['services', '工作台', 'pages/services.html', 'workspace'],
  ['knowledge-search', '搜索界面', 'pages/knowledge-search.html', 'search'],
  ['agent-access', '智能体对接', 'pages/agent-access.html', 'agent'],
  ['sdk-services', 'SDK 服务', 'pages/sdk-services.html', 'sdk']
];

const primaryMenus = [
  ['resource', '资源纳管', 'index.html', 'resource', resourceChildren],
  ['processing', '知识加工', 'pages/processing-overview.html', 'processing', processingChildren],
  ['management', '知识管理', 'pages/management-overview.html', 'management', managementChildren],
  ['services', '知识服务', 'pages/services.html', 'service', serviceChildren]
];

function href(path, root) {
  if (root) return path;
  return path === 'index.html' ? '../index.html' : path.replace('pages/', '');
}

export function renderShell() {
  const page = document.body.dataset.page;
  const root = document.body.dataset.root === 'true';
  const primary = primaryMenus.find(([, , , , children]) => children.some(item => item[0] === page))
    || primaryMenus.find(item => item[0] === page)
    || primaryMenus[0];
  const currentChild = primary[4].find(item => item[0] === page);
  const navigation = primaryMenus.map(([key, label, path, iconName, children]) => {
    const groupActive = key === primary[0];
    const submenu = children.map(([childKey, childLabel, childPath, childIcon]) => `<a class="nav-subitem ${childKey === page ? 'is-active' : ''}" href="${href(childPath, root)}" ${childKey === page ? 'aria-current="page"' : ''}>${icon(childIcon, 'nav-icon')}<span>${childLabel}</span></a>`).join('');
    if (children.length) return `<div class="nav-group ${groupActive ? 'is-open' : ''}"><a class="nav-item nav-primary ${groupActive ? 'is-active' : ''}" href="${href(path, root)}">${icon(iconName, 'nav-icon')}<span>${label}</span></a>${groupActive ? `<div class="nav-submenu">${submenu}</div>` : ''}</div>`;
    return `<a class="nav-item nav-primary ${groupActive ? 'is-active' : ''}" href="${href(path, root)}" ${groupActive ? 'aria-current="page"' : ''}>${icon(iconName, 'nav-icon')}<span>${label}</span></a>`;
  }).join('');

  document.querySelector('[data-shell]').innerHTML = `<a class="skip-link" href="#main-content">跳到主内容</a><div class="app-shell"><aside class="sidebar" id="sidebar" aria-label="平台导航"><a class="brand" href="${href('index.html', root)}"><span class="brand-mark">${icon('graph')}</span><span><strong class="brand-title text-normal-bold">知识工程平台</strong><small class="brand-subtitle text-small">Knowledge Engineering</small></span></a><nav class="primary-nav">${navigation}</nav><div class="sidebar-footer"><label class="control"><span class="switch"><input class="switch-input" id="theme-switch" type="checkbox"/><span class="switch-track"></span></span><span class="control-label">深色模式</span></label></div></aside><div class="app-column"><header class="topbar"><button class="icon-button mobile-nav-button" type="button" data-nav-toggle aria-label="打开导航" aria-expanded="false">${icon('menu')}</button><span class="topbar-product text-normal-bold">${primary[1]}</span><label class="global-search">${icon('search', 'global-search-icon')}<span class="input-wrap input-large"><input class="input" type="search" placeholder="搜索资源、知识或服务" aria-label="全局搜索"/></span></label><div class="topbar-actions"><div class="notification-wrap"><button class="icon-button notification-button" type="button" aria-label="上传通知" aria-expanded="false" data-notification-toggle>${icon('bell')}<span class="notification-badge text-small-bold" data-notification-badge hidden>0</span></button><section class="notification-panel" aria-label="文件上传进度" data-notification-panel hidden><div class="notification-header"><strong class="text-normal-bold">上传任务</strong><span class="text-small" data-upload-summary>暂无上传任务</span></div><div class="upload-task-list" data-upload-task-list><div class="upload-empty text-small" data-upload-empty>选择本地文件后，可在这里查看上传进度</div></div></section></div><span class="user-avatar text-normal-bold">知</span></div></header><main class="main-content" id="main-content" tabindex="-1"><div class="breadcrumb text-small"><a href="${href('index.html', root)}">知识工程平台</a><span>/</span><a href="${href(primary[2], root)}">${primary[1]}</a>${currentChild ? `<span>/</span><span>${currentChild[1]}</span>` : ''}</div><div data-page-content></div></main></div></div><div class="toast" role="status" aria-live="polite" data-toast-node></div>`;
}
