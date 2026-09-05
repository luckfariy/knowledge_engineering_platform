const icons = {
  resource: '<path d="M4 6h6l2 2h8v11H4z"/>',
  overview: '<path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z"/>',
  document: '<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7"/>',
  table: '<path d="M4 5h16v14H4zM4 10h16M9 5v14"/>',
  graph: '<circle cx="6" cy="7" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="m8 7 8-1m-9 3 4 7m6-8-4 8"/>',
  tag: '<path d="M4 4h7l9 9-7 7-9-9V4Z"/><circle cx="8" cy="8" r="1"/>',
  source: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"/>',
  processing: '<path d="m5 5 4 4-4 4m7-4h7M5 17h14"/>',
  management: '<path d="m12 3 8 4-8 4-8-4 8-4Zm-8 8 8 4 8-4m-16 4 8 4 8-4"/>',
  service: '<path d="M5 7h14v10H5zM8 4v3m8-3v3M8 17v3m8-3v3"/>',
  workspace: '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
  agent: '<path d="M8 9h8a4 4 0 0 1 4 4v5H4v-5a4 4 0 0 1 4-4ZM9 14h.01M15 14h.01M12 9V5m-2-2h4"/>',
  sdk: '<path d="m8 8-4 4 4 4m8-8 4 4-4 4m-2-11-4 14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
  users: '<path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7-2a4 4 0 0 1 0 8m2 4v-2a4 4 0 0 0-3-3.87"/>',
  shield: '<path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Zm-3 9 2 2 4-4"/>',
  log: '<path d="M5 3h14v18H5zM8 8h8M8 12h8M8 16h5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 12h4"/>'
  ,chevron: '<path d="m7 10 5 5 5-5"/>'
};

export function icon(name, className = '') {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
}

const resourceChildren = [
  ['documents-enterprise', '文档中心', 'pages/documents.html', 'document'],
  ['data-tables', '数据表', 'pages/data-tables.html', 'table'],
  ['graph-data', '图数据', 'pages/graph-data.html', 'graph'],
  ['resource-tags', '标签管理', 'pages/resource-tags.html', 'tag'],
  ['knowledge-sources', '知识源管理', 'pages/knowledge-sources.html', 'source']
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
  ['resource', '资源纳管', 'pages/documents.html', 'resource', resourceChildren],
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
  const documentPages = new Set(['documents-enterprise', 'documents-team', 'documents-personal']);
  const resourcePages = new Set(['resource-overview', 'documents', ...documentPages, 'data-tables', 'graph-data', 'resource-tags', 'knowledge-sources']);
  if (page === 'platform-home') {
    document.querySelector('[data-shell]').innerHTML = `<a class="skip-link" href="#main-content">跳到主内容</a><div class="home-shell"><header class="home-topbar"><a class="home-brand" href="index.html"><span class="brand-mark">${icon('graph')}</span><span><strong class="brand-title text-normal-bold">知识工程平台</strong><small class="brand-subtitle text-small">Knowledge Engineering</small></span></a><nav class="home-lifecycle-nav" aria-label="平台主导航"><a class="is-active" href="index.html" aria-current="page">${icon('workspace')}<span>首页</span></a><a href="pages/documents.html">资源纳管</a><a href="pages/processing-overview.html">知识生产</a><a href="pages/management-overview.html">知识资产</a><a href="pages/services.html">知识服务</a><a href="pages/agent-access.html">知识应用</a></nav><div class="home-topbar-actions"><a class="icon-button" href="pages/knowledge-search.html" aria-label="全局搜索">${icon('search')}</a><button class="icon-button" type="button" aria-label="通知" data-toast="暂无新通知">${icon('bell')}</button><a class="user-avatar text-normal-bold" href="pages/system-user-org.html" aria-label="进入系统配置">知</a></div></header><main class="home-main" id="main-content" tabindex="-1"><div data-page-content></div></main></div><div class="toast" role="status" aria-live="polite" data-toast-node></div>`;
    return;
  }
  if (resourcePages.has(page)) {
    const inDocumentCenter = page === 'resource-overview' || page === 'documents' || documentPages.has(page);
    const documentLinks = [
      ['resource-overview', '文档概览', 'resource-overview.html', page === 'resource-overview'],
      ['documents-enterprise', '企业空间', 'documents.html', page === 'documents-enterprise' || page === 'documents'],
      ['documents-team', '团队空间', 'team-documents.html', page === 'documents-team'],
      ['documents-personal', '个人空间', 'personal-documents.html', page === 'documents-personal']
    ];
    const documentNavigation = documentLinks.map(([, label, path, active]) => `<a class="resource-nav-child ${active ? 'is-active' : ''}" href="${path}" ${active ? 'aria-current="page"' : ''}>${label}</a>`).join('');
    const firstLevelLinks = [
      ['data-tables', '数据表', 'data-tables.html', 'table', page === 'data-tables'],
      ['graph-data', '图数据', 'graph-data.html', 'graph', page === 'graph-data'],
      ['resource-tags', '标签管理', 'resource-tags.html', 'tag', page === 'resource-tags'],
      ['knowledge-sources', '知识源管理', 'knowledge-sources.html', 'source', page === 'knowledge-sources']
    ].map(([, label, path, iconName, active]) => `<a class="resource-nav-item ${active ? 'is-active' : ''}" href="${path}" ${active ? 'aria-current="page"' : ''}>${icon(iconName)}<span>${label}</span></a>`).join('');
    const firstLevelLabels = { 'data-tables': '数据表', 'graph-data': '图数据', 'resource-tags': '标签管理', 'knowledge-sources': '知识源管理' };
    const currentLabel = page === 'resource-overview'
      ? '文档概览'
      : documentPages.has(page)
          ? documentLinks.find(([key]) => key === page)?.[1] || '企业空间'
          : firstLevelLabels[page];

    document.querySelector('[data-shell]').innerHTML = `<a class="skip-link" href="#main-content">跳到主内容</a><div class="home-shell resource-workspace-shell"><header class="home-topbar"><a class="home-brand" href="../index.html"><span class="brand-mark">${icon('graph')}</span><span><strong class="brand-title text-normal-bold">知识工程平台</strong><small class="brand-subtitle text-small">Knowledge Engineering</small></span></a><nav class="home-lifecycle-nav" aria-label="平台主导航"><a href="../index.html">${icon('workspace')}<span>首页</span></a><a class="is-active" href="documents.html" aria-current="page">资源纳管</a><a href="processing-overview.html">知识生产</a><a href="management-overview.html">知识资产</a><a href="services.html">知识服务</a><a href="agent-access.html">知识应用</a></nav><div class="home-topbar-actions"><a class="icon-button" href="knowledge-search.html" aria-label="全局搜索">${icon('search')}</a><div class="notification-wrap"><button class="icon-button notification-button" type="button" aria-label="任务通知" aria-expanded="false" data-notification-toggle>${icon('bell')}<span class="notification-badge text-small-bold" data-notification-badge hidden>0</span></button><section class="notification-panel" aria-label="任务进度" data-notification-panel hidden><div class="notification-header"><strong class="text-normal-bold">任务中心</strong><span class="text-small" data-upload-summary>暂无进行中的任务</span></div><div class="upload-task-list" data-upload-task-list><div class="upload-empty text-small" data-upload-empty>上传与自动入目任务将在这里显示</div></div></section></div><a class="user-avatar text-normal-bold" href="system-user-org.html" aria-label="进入系统配置">知</a></div></header><div class="resource-workspace-layout"><aside class="resource-workspace-sidebar" id="sidebar" aria-label="资源纳管菜单"><nav class="resource-workspace-nav"><div class="resource-nav-group ${inDocumentCenter ? 'is-active' : ''}"><a class="resource-nav-item resource-nav-parent ${inDocumentCenter ? 'is-active' : ''}" href="resource-overview.html">${icon('document')}<span>文档中心</span>${icon('chevron', 'resource-nav-chevron')}</a><div class="resource-nav-children">${documentNavigation}</div></div>${firstLevelLinks}</nav><div class="resource-workspace-footer"><label class="control"><span class="switch"><input class="switch-input" id="theme-switch" type="checkbox"/><span class="switch-track"></span></span><span class="control-label">深色模式</span></label></div></aside><main class="resource-workspace-main main-content" id="main-content" tabindex="-1"><div data-page-content></div></main></div></div><div class="toast" role="status" aria-live="polite" data-toast-node></div>`;
    return;
  }
  if (page.startsWith('system-')) {
    const settingsNav = [['system-user-org', '用户与组织', 'system-user-org.html', 'users'], ['system-roles', '角色管理', 'system-roles.html', 'shield'], ['system-logs', '操作日志', 'system-logs.html', 'log']];
    const sideNavigation = settingsNav.map(([key, label, path, iconName]) => `<a class="settings-nav-item ${page === key ? 'is-active' : ''}" href="${path}" ${page === key ? 'aria-current="page"' : ''}>${icon(iconName)}<span>${label}</span></a>`).join('');
    document.querySelector('[data-shell]').innerHTML = `<a class="skip-link" href="#main-content">跳到主内容</a><div class="home-shell settings-shell"><header class="home-topbar"><a class="home-brand" href="../index.html"><span class="brand-mark">${icon('graph')}</span><span><strong class="brand-title text-normal-bold">知识工程平台</strong><small class="brand-subtitle text-small">Knowledge Engineering</small></span></a><nav class="home-lifecycle-nav" aria-label="平台主导航"><a href="../index.html">首页</a><a href="documents.html">资源纳管</a><a href="processing-overview.html">知识生产</a><a href="management-overview.html">知识资产</a><a href="services.html">知识服务</a><a href="agent-access.html">知识应用</a></nav><div class="home-topbar-actions"><a class="icon-button" href="knowledge-search.html" aria-label="全局搜索">${icon('search')}</a><span class="user-avatar text-normal-bold" aria-label="当前用户">知</span></div></header><div class="settings-layout"><aside class="settings-sidebar"><div class="settings-sidebar-heading"><p class="text-small">SYSTEM SETTINGS</p><h1 class="text-big-bold">系统配置</h1></div><nav aria-label="系统配置菜单">${sideNavigation}</nav><a class="settings-back-link text-small" href="../index.html">← 返回产品首页</a></aside><main class="settings-main" id="main-content" tabindex="-1"><div data-page-content></div></main></div></div><div class="toast" role="status" aria-live="polite" data-toast-node></div>`;
    return;
  }
  const primary = primaryMenus.find(([, , , , children]) => children.some(item => item[0] === page))
    || primaryMenus.find(item => item[0] === page)
    || primaryMenus[0];
  const currentChild = primary[4].find(item => item[0] === page);
  const sectionNavigation = primary[4].map(([childKey, childLabel, childPath, childIcon]) => {
      const childActive = childKey === page;
      return `<a class="nav-subitem ${childActive ? 'is-active' : ''}" href="${href(childPath, root)}" ${childActive ? 'aria-current="page"' : ''}>${icon(childIcon, 'nav-icon')}<span>${childLabel}</span></a>`;
  }).join('');
  const topNavigation = `<a href="${href('index.html', root)}">首页</a>${primaryMenus.map(([key, label, path]) => `<a class="${key === primary[0] && !(page === 'agent-access') ? 'is-active' : ''}" href="${href(path, root)}" ${key === primary[0] && !(page === 'agent-access') ? 'aria-current="page"' : ''}>${label === '知识加工' ? '知识生产' : label === '知识管理' ? '知识资产' : label}</a>`).join('')}<a class="${page === 'agent-access' ? 'is-active' : ''}" href="${href('pages/agent-access.html', root)}" ${page === 'agent-access' ? 'aria-current="page"' : ''}>知识应用</a>`;
  document.querySelector('[data-shell]').innerHTML = `<a class="skip-link" href="#main-content">跳到主内容</a><div class="home-shell product-section-shell"><header class="home-topbar"><a class="home-brand" href="${href('index.html', root)}"><span class="brand-mark">${icon('graph')}</span><span><strong class="brand-title text-normal-bold">知识工程平台</strong><small class="brand-subtitle text-small">Knowledge Engineering</small></span></a><nav class="home-lifecycle-nav" aria-label="平台主导航">${topNavigation}</nav><div class="home-topbar-actions"><a class="icon-button" href="${href('pages/knowledge-search.html', root)}" aria-label="全局搜索">${icon('search')}</a><div class="notification-wrap"><button class="icon-button notification-button" type="button" aria-label="任务通知" aria-expanded="false" data-notification-toggle>${icon('bell')}<span class="notification-badge text-small-bold" data-notification-badge hidden>0</span></button><section class="notification-panel" aria-label="任务进度" data-notification-panel hidden><div class="notification-header"><strong class="text-normal-bold">任务中心</strong><span class="text-small" data-upload-summary>暂无进行中任务</span></div><div class="upload-task-list" data-upload-task-list><div class="upload-empty text-small" data-upload-empty>当前暂无任务</div></div></section></div><a class="user-avatar text-normal-bold" href="${root ? 'pages/system-user-org.html' : 'system-user-org.html'}" aria-label="进入系统配置">知</a></div></header><div class="product-section-layout"><aside class="product-section-sidebar" id="sidebar"><div class="product-section-heading"><span class="product-section-icon">${icon(primary[3])}</span><div><p class="text-small">PRODUCT MODULE</p><h1 class="text-big-bold">${primary[1] === '知识加工' ? '知识生产' : primary[1] === '知识管理' ? '知识资产' : primary[1]}</h1></div></div><nav class="product-secondary-nav" aria-label="${primary[1]}二级菜单">${sectionNavigation}</nav><div class="product-sidebar-footer"><label class="control"><span class="switch"><input class="switch-input" id="theme-switch" type="checkbox"/><span class="switch-track"></span></span><span class="control-label">深色模式</span></label></div></aside><main class="section-main" id="main-content" tabindex="-1"><button class="icon-button mobile-nav-button" type="button" data-nav-toggle aria-label="打开二级导航" aria-expanded="false">${icon('menu')}</button><div class="breadcrumb text-small"><a href="${href('index.html', root)}">知识工程平台</a><span>/</span><a href="${href(primary[2], root)}">${primary[1] === '知识加工' ? '知识生产' : primary[1] === '知识管理' ? '知识资产' : primary[1]}</a>${currentChild ? `<span>/</span><span>${currentChild[1]}</span>` : ''}</div><div data-page-content></div></main></div></div><div class="toast" role="status" aria-live="polite" data-toast-node></div>`;
}
