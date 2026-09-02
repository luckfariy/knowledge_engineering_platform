const icons = {
  resource: '<path d="M4 6h6l2 2h8v11H4z"/>',
  overview: '<path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z"/>',
  document: '<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7"/>',
  table: '<path d="M4 5h16v14H4zM4 10h16M9 5v14"/>',
  graph: '<circle cx="6" cy="7" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="m8 7 8-1m-9 3 4 7m6-8-4 8"/>',
  processing: '<path d="m5 5 4 4-4 4m7-4h7M5 17h14"/>',
  management: '<path d="m12 3 8 4-8 4-8-4 8-4Zm-8 8 8 4 8-4m-16 4 8 4 8-4"/>',
  service: '<path d="M5 7h14v10H5zM8 4v3m8-3v3M8 17v3m8-3v3"/>',
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

const primaryMenus = [
  ['resource', '资源纳管', 'index.html', 'resource'],
  ['processing', '知识加工', 'pages/processing.html', 'processing'],
  ['management', '知识管理', 'pages/management.html', 'management'],
  ['services', '知识服务', 'pages/services.html', 'service']
];

function href(path, root) {
  if (root) return path;
  return path === 'index.html' ? '../index.html' : path.replace('pages/', '');
}

export function renderShell() {
  const page = document.body.dataset.page;
  const root = document.body.dataset.root === 'true';
  const resourcePage = resourceChildren.find(item => item[0] === page);
  const primary = resourcePage ? primaryMenus[0] : primaryMenus.find(item => item[0] === page) || primaryMenus[0];
  const resourceSubmenu = resourceChildren.map(([key, label, path, iconName]) => `<a class="nav-subitem ${key === page ? 'is-active' : ''}" href="${href(path, root)}" ${key === page ? 'aria-current="page"' : ''}>${icon(iconName, 'nav-icon')}<span>${label}</span></a>`).join('');
  const navigation = primaryMenus.map(([key, label, path, iconName]) => key === 'resource'
    ? `<div class="nav-group is-open"><a class="nav-item nav-primary ${resourcePage ? 'is-active' : ''}" href="${href(path, root)}">${icon(iconName, 'nav-icon')}<span>${label}</span></a><div class="nav-submenu">${resourceSubmenu}</div></div>`
    : `<a class="nav-item nav-primary ${key === page ? 'is-active' : ''}" href="${href(path, root)}" ${key === page ? 'aria-current="page"' : ''}>${icon(iconName, 'nav-icon')}<span>${label}</span></a>`).join('');

  document.querySelector('[data-shell]').innerHTML = `<a class="skip-link" href="#main-content">跳到主内容</a><div class="app-shell"><aside class="sidebar" id="sidebar" aria-label="平台导航"><a class="brand" href="${href('index.html', root)}"><span class="brand-mark">${icon('graph')}</span><span><strong class="brand-title text-normal-bold">知识工程平台</strong><small class="brand-subtitle text-small">Knowledge Engineering</small></span></a><nav class="primary-nav">${navigation}</nav><div class="sidebar-footer"><label class="control"><span class="switch"><input class="switch-input" id="theme-switch" type="checkbox"/><span class="switch-track"></span></span><span class="control-label">深色模式</span></label></div></aside><div class="app-column"><header class="topbar"><button class="icon-button mobile-nav-button" type="button" data-nav-toggle aria-label="打开导航" aria-expanded="false">${icon('menu')}</button><span class="topbar-product text-normal-bold">${primary[1]}</span><label class="global-search">${icon('search', 'global-search-icon')}<span class="input-wrap input-large"><input class="input" type="search" placeholder="搜索资源、知识或服务" aria-label="全局搜索"/></span></label><div class="topbar-actions"><button class="icon-button" type="button" aria-label="通知" data-toast="暂无新通知">${icon('bell')}</button><span class="user-avatar text-normal-bold">知</span></div></header><main class="main-content" id="main-content" tabindex="-1"><div class="breadcrumb text-small"><a href="${href('index.html', root)}">知识工程平台</a><span>/</span><span>${primary[1]}</span>${resourcePage ? `<span>/</span><span>${resourcePage[1]}</span>` : ''}</div><div data-page-content></div></main></div></div><div class="toast" role="status" aria-live="polite" data-toast-node></div>`;
}
