const storageKey = 'kep-published-knowledge-assets';
const trees = {
  document: { name: '文档库分类管理', nodes: [['policy', '制度类'], ['plan', '规划类'], ['contract', '合同类'], ['credit', '征信类'], ['report', '报告类'], ['judicial', '司法类']] },
  organization: { name: '机构目录', nodes: [['head-office', '总行'], ['customer-business', '公司业务部'], ['risk-compliance', '风险与合规部'], ['technology', '信息科技部']] },
  product: { name: '产品与服务目录', nodes: [['corporate-credit', '对公授信'], ['retail-finance', '零售金融'], ['risk-management', '风险管理'], ['shared-service', '共享服务']] }
};
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const readRecords = () => { try { const value = JSON.parse(localStorage.getItem(storageKey) || '[]'); return Array.isArray(value) ? value : []; } catch { return []; } };
const writeRecords = records => localStorage.setItem(storageKey, JSON.stringify(records));
const mountKey = mount => `${mount.treeId}:${mount.directoryId}`;
const mountsOf = record => {
  if (Array.isArray(record.mounts) && record.mounts.length) return record.mounts;
  if (!record.treeId || !record.directoryId) return [];
  const tree = trees[record.treeId];
  return [{
    treeId: record.treeId,
    treeName: tree?.name || '',
    directoryId: record.directoryId,
    directoryName: record.directoryName || tree?.nodes.find(([id]) => id === record.directoryId)?.[1] || ''
  }];
};
const notify = message => {
  const toast = document.querySelector('[data-toast-node]');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  setTimeout(() => toast.classList.remove('is-visible'), 2400);
};

function appendPublishedCards() {
  const list = document.querySelector('[data-knowledge-asset-list]');
  if (!list) return;
  readRecords().forEach(record => {
    if (list.querySelector(`[data-published-id="${record.id}"]`)) return;
    const mounts = mountsOf(record);
    const card = document.createElement('a');
    const isLibrary = record.type === 'knowledge-base';
    const mountSummary = mounts.length === 1 ? mounts[0].directoryName : `${mounts.length} 个目录`;
    card.className = 'knowledge-asset-card';
    card.href = `${isLibrary ? 'knowledge-base-detail.html' : 'unified-semantic-graph-detail.html'}?name=${encodeURIComponent(record.name)}`;
    card.dataset.knowledgeAssetCard = '';
    card.dataset.publishedId = record.id;
    card.dataset.assetPaths = mounts.map(mountKey).join(' ');
    card.innerHTML = `<span class="knowledge-asset-card-icon ${isLibrary ? 'is-library' : 'is-unified'}" aria-hidden="true">${isLibrary ? '▤' : '◇'}</span><div class="knowledge-asset-card-main"><span class="tag tag-status ${isLibrary ? 'tag-status-lime' : 'tag-status-blue'}">${isLibrary ? '知识库' : '统一语义知识图谱'}</span><h3 class="text-medium-bold">${escapeHtml(record.name)}</h3><p class="text-normal">${escapeHtml(record.description || '由知识生产发布的正式知识资产。')}</p></div><footer class="knowledge-asset-card-footer text-small"><span>已挂载至 ${escapeHtml(mountSummary)}</span><span class="knowledge-asset-card-link">查看详情 →</span></footer>`;
    list.append(card);
  });
  window.setTimeout(() => document.querySelector('[data-knowledge-asset-directory].is-active')?.click(), 0);
}

function enablePublishing() {
  const cards = [...document.querySelectorAll('[data-kb-card], [data-graph-card]')];
  if (!cards.length) return;
  const mask = document.createElement('div');
  mask.className = 'dialog-mask';
  mask.hidden = true;
  mask.innerHTML = `<div class="dialog dialog-form dialog-wide asset-publish-dialog" role="dialog" aria-modal="true" aria-labelledby="publish-dialog-title"><div class="dialog-header"><div><h2 class="dialog-title" id="publish-dialog-title">发布到知识资产</h2><p class="text-small asset-publish-subtitle">可跨目录树选择多个挂载目录</p></div><button class="dialog-close" type="button" aria-label="关闭" data-publish-close></button></div><form data-publish-form><div class="dialog-body form-stack"><div class="asset-publish-current"><span class="text-small">待发布资产</span><strong class="text-normal-bold" data-publish-name></strong></div><div class="asset-publish-mount-layout"><section class="asset-publish-tree-picker"><header class="asset-publish-section-heading"><div><h3 class="text-normal-bold">选择挂载目录</h3><p class="text-small">同一资产可挂载到不同目录树的多个节点</p></div></header><div data-publish-tree-list>${Object.entries(trees).map(([treeId, tree]) => `<section class="asset-publish-tree-group"><header><strong class="text-small-bold">${tree.name}</strong><span class="text-small">${tree.nodes.length} 个节点</span></header>${tree.nodes.map(([directoryId, directoryName]) => `<label class="asset-publish-node"><input type="checkbox" name="mount" value="${treeId}:${directoryId}"><span>${directoryName}</span><small>${tree.name}</small></label>`).join('')}</section>`).join('')}</div></section><section class="asset-publish-selected"><header class="asset-publish-section-heading"><div><h3 class="text-normal-bold">已选挂载目录</h3><p class="text-small"><span data-publish-count>0</span> 个目录节点</p></div></header><div class="asset-publish-selected-list" data-publish-selected-list></div></section></div><span class="field-help">挂载仅建立目录关联，不会复制知识资产；后续可继续调整挂载位置。</span></div><div class="dialog-actions"><span class="text-small asset-publish-validation" data-publish-validation>请至少选择一个目录节点</span><button class="btn btn-medium btn-secondary" type="button" data-publish-close>取消</button><button class="btn btn-medium btn-primary" type="submit" data-publish-submit disabled>确认发布</button></div></form></div>`;
  document.body.append(mask);
  const form = mask.querySelector('[data-publish-form]');
  const checkboxes = [...form.querySelectorAll('input[name="mount"]')];
  const selectedList = form.querySelector('[data-publish-selected-list]');
  const countNode = form.querySelector('[data-publish-count]');
  const submitButton = form.querySelector('[data-publish-submit]');
  const validation = form.querySelector('[data-publish-validation]');
  let activeCard;

  const getMount = value => {
    const [treeId, directoryId] = value.split(':');
    const tree = trees[treeId];
    return { treeId, treeName: tree.name, directoryId, directoryName: tree.nodes.find(([id]) => id === directoryId)[1] };
  };
  const selectedMounts = () => checkboxes.filter(checkbox => checkbox.checked).map(checkbox => getMount(checkbox.value));
  const renderSelected = () => {
    const mounts = selectedMounts();
    countNode.textContent = mounts.length;
    submitButton.disabled = !mounts.length;
    validation.hidden = Boolean(mounts.length);
    selectedList.innerHTML = mounts.length
      ? mounts.map(mount => `<div class="asset-publish-selected-item"><span><strong class="text-small-bold">${mount.directoryName}</strong><small>${mount.treeName}</small></span><button class="btn btn-dense btn-text" type="button" data-remove-mount="${mountKey(mount)}">移除</button></div>`).join('')
      : '<div class="asset-publish-empty"><strong class="text-small-bold">暂未选择目录</strong><span class="text-small">在左侧勾选一个或多个目录节点</span></div>';
  };
  checkboxes.forEach(checkbox => checkbox.addEventListener('change', renderSelected));
  selectedList.addEventListener('click', event => {
    const button = event.target.closest('[data-remove-mount]');
    if (!button) return;
    const checkbox = checkboxes.find(item => item.value === button.dataset.removeMount);
    if (checkbox) checkbox.checked = false;
    renderSelected();
  });
  const close = () => { mask.hidden = true; document.body.classList.remove('is-dialog-open'); };
  const open = card => {
    activeCard = card;
    const type = card.matches('[data-kb-card]') ? 'knowledge-base' : 'semantic-graph';
    const name = card.dataset.kbName || card.querySelector('h2').textContent.trim();
    const existing = readRecords().find(record => record.id === `${type}:${name}`);
    const currentKeys = new Set(existing ? mountsOf(existing).map(mountKey) : []);
    mask.querySelector('[data-publish-name]').textContent = name;
    mask.querySelector('.asset-publish-subtitle').textContent = existing ? '调整该资产在多个目录树中的挂载位置' : '可跨目录树选择多个挂载目录';
    checkboxes.forEach(checkbox => { checkbox.checked = currentKeys.has(checkbox.value); });
    renderSelected();
    mask.hidden = false;
    document.body.classList.add('is-dialog-open');
    checkboxes[0]?.focus();
  };
  cards.forEach(card => {
    const isLibrary = card.matches('[data-kb-card]');
    let button = isLibrary ? card.querySelector('.knowledge-base-card-actions .btn-primary') : card.querySelector('.semantic-card-action');
    if (!button && !isLibrary) {
      button = document.createElement('button');
      button.className = 'semantic-card-action btn btn-medium btn-primary';
      button.type = 'button';
      card.append(button);
    }
    if (!button) return;
    const type = isLibrary ? 'knowledge-base' : 'semantic-graph';
    const name = card.dataset.kbName || card.querySelector('h2').textContent.trim();
    const mounted = readRecords().some(record => record.id === `${type}:${name}`);
    button.removeAttribute('data-toast');
    button.textContent = mounted ? '调整目录' : '发布';
    button.dataset.publishBound = 'true';
    button.addEventListener('click', event => { event.stopPropagation(); open(card); });
  });
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-kb-card] .knowledge-base-card-actions .btn-primary');
    if (!button || button.dataset.publishBound === 'true') return;
    event.preventDefault();
    event.stopPropagation();
    open(button.closest('[data-kb-card]'));
  });
  mask.querySelectorAll('[data-publish-close]').forEach(button => button.addEventListener('click', close));
  mask.addEventListener('click', event => { if (event.target === mask) close(); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const mounts = selectedMounts();
    if (!mounts.length) return;
    const type = activeCard.matches('[data-kb-card]') ? 'knowledge-base' : 'semantic-graph';
    const name = activeCard.dataset.kbName || activeCard.querySelector('h2').textContent.trim();
    const id = `${type}:${name}`;
    const records = readRecords().filter(record => record.id !== id);
    records.push({ id, type, name, description: activeCard.querySelector('p')?.textContent.trim() || '', mounts });
    writeRecords(records);
    const status = activeCard.querySelector('.semantic-graph-card-head .tag');
    if (status) { status.textContent = '已发布'; status.className = 'tag tag-small semantic-status-published'; }
    const button = activeCard.querySelector('.knowledge-base-card-actions .btn-primary, .semantic-card-action');
    if (button) button.textContent = '调整目录';
    close();
    notify(`已发布“${name}”并挂载到 ${mounts.length} 个目录`);
  });
}

appendPublishedCards();
enablePublishing();
