const iconPaths = {
  overview: '<path d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z"/>',
  collection: '<path d="M12 3v12m0 0-4-4m4 4 4-4M5 18h14v3H5z"/>',
  resources: '<path d="M4 5h6l2 2h8v12H4z"/>',
  processing: '<path d="m6 4 4 4-4 4m6-4h6M6 16h12M6 20h8"/>',
  assets: '<path d="m12 3 8 4-8 4-8-4 8-4Zm-8 8 8 4 8-4m-16 4 8 4 8-4"/>',
  graph: '<circle cx="6" cy="7" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="m8 7 8-1m-9 3 4 7m6-8-4 8"/>',
  services: '<path d="M5 7h14v10H5zM8 4v3m8-3v3M8 17v3m8-3v3"/>',
  applications: '<path d="M8 4h8l4 4v8l-4 4H8l-4-4V8l4-4Zm4 4v8m-4-4h8"/>',
  operations: '<path d="M4 18V9m5 9V5m5 13v-7m5 7V3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
  moon: '<path d="M20 15.5A8 8 0 0 1 8.5 4 8 8 0 1 0 20 15.5Z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 12h4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrow: '<path d="m9 18 6-6-6-6"/>',
  bot: '<rect x="5" y="7" width="14" height="12" rx="2"/><path d="M9 11h.01M15 11h.01M9 15h6M12 7V4"/>'
};

export function icon(name, className = '') {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.overview}</svg>`;
}

const navItems = [
  ['overview', '平台总览', '../index.html'],
  ['collection', '知识采集', 'collection.html'],
  ['resources', '知识资源', 'resources.html'],
  ['processing', '知识加工', 'processing.html'],
  ['assets', '知识资产', 'assets.html'],
  ['graph', '图谱构建', 'graphs.html'],
  ['services', '知识服务', 'services.html'],
  ['applications', '应用与 Agent', 'applications.html'],
  ['operations', '知识运营', 'operations.html']
];

function resolveHref(href, root) {
  if (root) return href.replace('../', '');
  return href;
}

export function renderShell() {
  const page = document.body.dataset.page || 'overview';
  const isRoot = page === 'overview';
  const current = navItems.find(item => item[0] === page) || navItems[0];
  const nav = navItems.map(([key, label, href], index) => `
    ${index === 1 ? '<div class="nav-section-label text-small">知识生命周期</div>' : ''}
    <a class="nav-item ${key === page ? 'is-active' : ''}" href="${resolveHref(href, isRoot)}" ${key === page ? 'aria-current="page"' : ''}>
      ${icon(key, 'nav-icon')}<span>${label}</span>${key === 'operations' ? '<span class="tag tag-small nav-badge">6</span>' : ''}
    </a>`).join('');

  const shell = document.querySelector('[data-shell]');
  shell.innerHTML = `
    <a class="skip-link" href="#main-content">跳到主内容</a>
    <div class="app-shell">
      <aside class="sidebar" id="sidebar" aria-label="平台导航">
        <a class="brand" href="${isRoot ? 'index.html' : '../index.html'}">
          <span class="brand-mark">${icon('graph')}</span>
          <span class="brand-copy"><strong class="brand-title text-normal-bold">知识工程平台</strong><span class="brand-subtitle text-small">Knowledge Fabric</span></span>
        </a>
        <nav class="primary-nav">${nav}</nav>
        <div class="sidebar-footer">
          <label class="control"><span class="switch"><input class="switch-input" id="theme-switch" type="checkbox"/><span class="switch-track"></span></span><span class="control-label">深色模式</span></label>
        </div>
      </aside>
      <div class="app-column">
        <header class="topbar">
          <button class="icon-button mobile-nav-button" type="button" data-nav-toggle aria-label="打开导航" aria-expanded="false">${icon('menu')}</button>
          <span class="topbar-product text-normal-bold">${current[1]}</span>
          <label class="global-search">
            ${icon('search', 'global-search-icon')}
            <span class="input-wrap input-large"><input class="input" type="search" placeholder="搜索知识资产、实体、服务或应用" aria-label="全局搜索"/></span>
          </label>
          <div class="topbar-actions">
            <button class="icon-button" type="button" aria-label="通知" data-toast="暂无新的系统通知">${icon('bell')}</button>
            <span class="user-avatar text-normal-bold" aria-label="当前用户：知识管理员">知</span>
          </div>
        </header>
        <main class="main-content" id="main-content" tabindex="-1">
          <div class="breadcrumb text-small"><a href="${isRoot ? 'index.html' : '../index.html'}">知识工程平台</a><span>/</span><span>${current[1]}</span></div>
          <div data-page-content></div>
        </main>
      </div>
    </div>
    <div class="toast" role="status" aria-live="polite" data-toast-node></div>`;
}
