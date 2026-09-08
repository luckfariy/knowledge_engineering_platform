const toastNode = document.querySelector('[data-portal-toast]');
let toastTimer;
const portalPage = document.body.dataset.portalPage;
const portalNavigation = document.querySelector('.portal-nav');
if (portalNavigation && !portalNavigation.querySelector('[href="frontend-apps.html"]')) {
  const applicationLink = document.createElement('a');
  applicationLink.href = 'frontend-apps.html';
  applicationLink.textContent = '应用中心';
  if (portalPage === 'apps') {
    applicationLink.classList.add('is-active');
    applicationLink.setAttribute('aria-current', 'page');
  }
  portalNavigation.append(applicationLink);
}
const portalSearchButton = document.querySelector('[data-portal-search-toggle]');
if (portalSearchButton) {
  portalSearchButton.classList.add('portal-search-button');
  portalSearchButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m16 16 5 5"></path></svg>';
}
function showToast(message) {
  if (!toastNode) return;
  toastNode.textContent = message;
  toastNode.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastNode.classList.remove('is-visible'), 2200);
}

const searchLayer = document.querySelector('[data-portal-search-layer]');
document.querySelector('[data-portal-search-toggle]')?.addEventListener('click', () => {
  searchLayer.hidden = false;
  searchLayer.querySelector('input')?.focus();
});
document.querySelector('[data-portal-search-close]')?.addEventListener('click', () => { searchLayer.hidden = true; });
searchLayer?.addEventListener('click', event => { if (event.target === searchLayer) searchLayer.hidden = true; });
searchLayer?.querySelector('form')?.addEventListener('submit', event => {
  event.preventDefault();
  const query = new FormData(event.currentTarget).get('query')?.trim();
  if (!query) return;
  searchLayer.hidden = true;
  showToast(`正在全局搜索“${query}”`);
});

const historyList = document.querySelector('[data-chat-history-list]');
const selectedAgent = new URLSearchParams(location.search).get('agent');
if (selectedAgent && portalPage === 'chat') {
  const agentState = document.querySelector('.portal-agent-state');
  const currentTitle = document.querySelector('[data-current-chat-title]');
  if (agentState) agentState.innerHTML = `<i></i>${selectedAgent}在线`;
  if (currentTitle) currentTitle.textContent = `与${selectedAgent}对话`;
  const messageStream = document.querySelector('[data-message-stream]');
  if (messageStream) messageStream.innerHTML = `<div class="portal-chat-empty"><span class="portal-agent-avatar">◇</span><h2 class="text-big-bold">${selectedAgent}</h2><p>您好，我将围绕对应业务场景，结合您有权访问的企业知识提供专业协助。</p></div>`;
  historyList?.querySelectorAll('[data-chat-title]').forEach(node => node.classList.remove('is-active'));
}
historyList?.addEventListener('click', event => {
  const more = event.target.closest('[data-chat-more]');
  if (more) {
    event.stopPropagation();
    showToast('对话可重命名、归档或删除');
    return;
  }
  const item = event.target.closest('[data-chat-title]');
  if (!item) return;
  historyList.querySelectorAll('[data-chat-title]').forEach(node => node.classList.toggle('is-active', node === item));
  document.querySelector('[data-current-chat-title]').textContent = item.dataset.chatTitle;
});
document.querySelector('[data-chat-history-search]')?.addEventListener('input', event => {
  const query = event.currentTarget.value.trim().toLowerCase();
  historyList.querySelectorAll('[data-chat-title]').forEach(item => { item.hidden = Boolean(query) && !item.textContent.toLowerCase().includes(query); });
});
document.querySelector('[data-new-chat]')?.addEventListener('click', () => {
  document.querySelector('[data-current-chat-title]').textContent = '新对话';
  document.querySelector('[data-message-stream]').innerHTML = '<div class="portal-chat-empty"><span class="portal-agent-avatar">◇</span><h2 class="text-big-bold">想了解什么？</h2><p>我会基于您有权访问的企业知识进行回答。</p></div>';
  historyList.querySelectorAll('[data-chat-title]').forEach(node => node.classList.remove('is-active'));
  document.querySelector('[name="message"]')?.focus();
});
document.querySelector('[data-clear-chat]')?.addEventListener('click', () => {
  document.querySelector('[data-message-stream]').innerHTML = '<div class="portal-chat-empty"><p>对话已清空，可以开始新的提问。</p></div>';
  showToast('已清空当前对话');
});
document.querySelectorAll('[data-suggestion]').forEach(button => button.addEventListener('click', () => {
  const field = document.querySelector('[name="message"]');
  field.value = button.dataset.suggestion;
  field.focus();
}));
const chatForm = document.querySelector('[data-chat-form]');
function sendChatMessage() {
  const field = chatForm.elements.message;
  const message = field.value.trim();
  if (!message) return;
  const stream = document.querySelector('[data-message-stream]');
  stream.querySelector('.portal-chat-empty')?.remove();
  stream.insertAdjacentHTML('beforeend', `<div class="portal-message is-user"><span class="user-avatar">王</span><div><p>${message.replace(/[&<>]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[character]))}</p><small>刚刚</small></div></div><div class="portal-message is-agent"><span class="portal-agent-avatar">◇</span><div><p>已收到您的问题。我正在检索有权访问的业务制度、知识库和语义图谱，将在结果中标注参考来源。</p><small>刚刚 · AI 生成</small></div></div>`);
  field.value = '';
  stream.scrollTop = stream.scrollHeight;
}
chatForm?.addEventListener('submit', event => { event.preventDefault(); sendChatMessage(); });
chatForm?.elements.message?.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendChatMessage(); }
});

const assetTrees = {
  business: { name: '企业业务目录', nodes: [['all','全部资产'],['credit','公司金融'],['retail','零售金融'],['risk','风险管理'],['legal','法务合规'],['operations','运营管理']] },
  organization: { name: '总分行组织目录', nodes: [['all','全部资产'],['head','总行知识'],['branch','分行共享知识']] },
  product: { name: '产品服务目录', nodes: [['all','全部资产'],['corporate','对公产品'],['retail','零售产品'],['shared','公共服务']] }
};
const treeNode = document.querySelector('[data-portal-directory-tree]');
let activeTree = 'business';
let activeDirectory = 'all';
let activeAssetType = 'all';
function updateAssets() {
  const query = document.querySelector('[data-asset-search]')?.value.trim().toLowerCase() || '';
  let visibleCount = 0;
  document.querySelectorAll('[data-portal-asset-grid] article').forEach(card => {
    const paths = card.dataset.treePaths.split(' ');
    const directoryMatch = activeDirectory === 'all' || paths.includes(`${activeTree}:${activeDirectory}`);
    const typeMatch = activeAssetType === 'all' || card.dataset.type === activeAssetType;
    const searchMatch = !query || card.textContent.toLowerCase().includes(query);
    const visible = directoryMatch && typeMatch && searchMatch;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  const tree = assetTrees[activeTree];
  const directoryName = tree.nodes.find(([id]) => id === activeDirectory)?.[1] || '全部资产';
  document.querySelector('[data-asset-title]').textContent = directoryName;
  document.querySelector('[data-asset-path]').textContent = `${tree.name} / ${directoryName}`;
  document.querySelector('[data-asset-count]').textContent = `${visibleCount} 项知识资产`;
  document.querySelector('[data-asset-empty]').hidden = visibleCount > 0;
}
function renderTree() {
  const tree = assetTrees[activeTree];
  treeNode.innerHTML = tree.nodes.map(([id, name]) => {
    const count = id === 'all' ? document.querySelectorAll('[data-portal-asset-grid] article').length : [...document.querySelectorAll('[data-portal-asset-grid] article')].filter(card => card.dataset.treePaths.split(' ').includes(`${activeTree}:${id}`)).length;
    return `<button class="${id === activeDirectory ? 'is-active' : ''}" type="button" data-directory-id="${id}"><span>▸</span><span>${name}</span><small class="text-number">${count}</small></button>`;
  }).join('');
  updateAssets();
}
document.querySelector('[data-portal-tree]')?.addEventListener('change', event => {
  activeTree = event.currentTarget.value;
  activeDirectory = 'all';
  renderTree();
});
treeNode?.addEventListener('click', event => {
  const button = event.target.closest('[data-directory-id]');
  if (!button) return;
  activeDirectory = button.dataset.directoryId;
  renderTree();
});
document.querySelectorAll('[data-asset-type]').forEach(button => button.addEventListener('click', () => {
  activeAssetType = button.dataset.assetType;
  document.querySelectorAll('[data-asset-type]').forEach(node => node.classList.toggle('is-active', node === button));
  updateAssets();
}));
document.querySelector('[data-asset-search]')?.addEventListener('input', updateAssets);
if (treeNode) renderTree();

const completeAll = document.querySelector('[data-toast-allToast]');
if (completeAll) {
  completeAll.textContent = '全部标记完成';
  completeAll.addEventListener('click', () => {
    document.querySelectorAll('.portal-task-list input').forEach(input => { input.checked = true; });
    showToast('已将待办标记为完成');
  });
}

document.querySelector('[data-complete-all]')?.addEventListener('click', () => {
  document.querySelectorAll('.portal-task-list input').forEach(input => { input.checked = true; });
  showToast('已将待办标记为完成');
});

let activeAppCategory = 'all';
function updateApplications() {
  const query = document.querySelector('[data-app-search]')?.value.trim().toLowerCase() || '';
  let visibleCount = 0;
  document.querySelectorAll('[data-app-card]').forEach(card => {
    const categoryMatches = activeAppCategory === 'all' || card.dataset.category === activeAppCategory;
    const queryMatches = !query || card.textContent.toLowerCase().includes(query);
    card.hidden = !(categoryMatches && queryMatches);
    if (!card.hidden) visibleCount += 1;
  });
  const emptyNode = document.querySelector('[data-app-empty]');
  if (emptyNode) emptyNode.hidden = visibleCount > 0;
}
document.querySelectorAll('[data-app-category]').forEach(button => button.addEventListener('click', () => {
  activeAppCategory = button.dataset.appCategory;
  document.querySelectorAll('[data-app-category]').forEach(node => node.classList.toggle('is-active', node === button));
  updateApplications();
}));
document.querySelector('[data-app-search]')?.addEventListener('input', updateApplications);
