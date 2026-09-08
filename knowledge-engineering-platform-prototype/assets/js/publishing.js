const storageKey = 'kep-published-knowledge-assets';
const trees = {
  document: { name: '文档库分类管理', nodes: [['policy','制度类'],['plan','规划类'],['contract','合同类'],['credit','征信类'],['report','报告类'],['judicial','司法类']] },
  organization: { name: '机构目录', nodes: [['head-office','总行'],['customer-business','公司业务部'],['risk-compliance','风险与合规部'],['technology','信息科技部']] }
};
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const readRecords = () => { try { const value = JSON.parse(localStorage.getItem(storageKey) || '[]'); return Array.isArray(value) ? value : []; } catch { return []; } };
const writeRecords = records => localStorage.setItem(storageKey, JSON.stringify(records));
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
    const card = document.createElement('a');
    const isLibrary = record.type === 'knowledge-base';
    card.className = 'knowledge-asset-card';
    card.href = `${isLibrary ? 'knowledge-base-detail.html' : 'unified-semantic-graph-detail.html'}?name=${encodeURIComponent(record.name)}`;
    card.dataset.knowledgeAssetCard = '';
    card.dataset.publishedId = record.id;
    card.dataset.assetPaths = `${record.treeId}:${record.directoryId}`;
    card.innerHTML = `<span class="knowledge-asset-card-icon ${isLibrary ? 'is-library' : 'is-unified'}" aria-hidden="true">${isLibrary ? '▤' : '◇'}</span><div class="knowledge-asset-card-main"><span class="tag tag-status ${isLibrary ? 'tag-status-lime' : 'tag-status-blue'}">${isLibrary ? '知识库' : '统一语义知识图谱'}</span><h3 class="text-medium-bold">${escapeHtml(record.name)}</h3><p class="text-normal">${escapeHtml(record.description || '由知识生产发布的正式知识资产。')}</p></div><footer class="knowledge-asset-card-footer text-small"><span>${escapeHtml(record.directoryName)}</span><span class="knowledge-asset-card-link">查看详情 →</span></footer>`;
    list.append(card);
  });
  window.setTimeout(() => {
    const activeDirectory = document.querySelector('[data-knowledge-asset-directory].is-active');
    activeDirectory?.click();
  }, 0);
}

function enablePublishing() {
  const cards = [...document.querySelectorAll('[data-kb-card], [data-graph-card]')];
  if (!cards.length) return;
  const mask = document.createElement('div');
  mask.className = 'dialog-mask';
  mask.hidden = true;
  mask.innerHTML = `<div class="dialog dialog-form" role="dialog" aria-modal="true" aria-labelledby="publish-dialog-title"><div class="dialog-header"><div><h2 class="dialog-title" id="publish-dialog-title">发布到知识资产</h2><p class="text-small asset-publish-subtitle">选择目录节点建立挂载关系</p></div><button class="dialog-close" type="button" aria-label="关闭" data-publish-close></button></div><form data-publish-form><div class="dialog-body form-stack"><div class="asset-publish-current"><span class="text-small">待发布资产</span><strong class="text-normal-bold" data-publish-name></strong></div><label class="field"><span class="field-label">知识资产目录树</span><span class="input-wrap input-middle"><select class="input" name="treeId">${Object.entries(trees).map(([id, tree]) => `<option value="${id}">${tree.name}</option>`).join('')}</select></span></label><label class="field"><span class="field-label">挂载目录节点</span><span class="input-wrap input-middle"><select class="input" name="directoryId"></select></span><span class="field-help">发布后可在知识资产中通过该目录查看。</span></label></div><div class="dialog-actions"><button class="btn btn-medium btn-secondary" type="button" data-publish-close>取消</button><button class="btn btn-medium btn-primary" type="submit">确认发布</button></div></form></div>`;
  document.body.append(mask);
  const form = mask.querySelector('[data-publish-form]');
  const treeSelect = form.elements.treeId;
  const directorySelect = form.elements.directoryId;
  let activeCard;
  const fillNodes = () => { directorySelect.innerHTML = trees[treeSelect.value].nodes.map(([id, name]) => `<option value="${id}">${name}</option>`).join(''); };
  treeSelect.addEventListener('change', fillNodes);
  fillNodes();
  const close = () => { mask.hidden = true; document.body.classList.remove('is-dialog-open'); };
  const open = card => {
    activeCard = card;
    const type = card.matches('[data-kb-card]') ? 'knowledge-base' : 'semantic-graph';
    const name = card.dataset.kbName || card.querySelector('h2').textContent.trim();
    const existing = readRecords().find(record => record.id === `${type}:${name}`);
    mask.querySelector('[data-publish-name]').textContent = name;
    mask.querySelector('.asset-publish-subtitle').textContent = existing ? '调整该资产的目录挂载关系' : '选择目录节点建立挂载关系';
    if (existing) treeSelect.value = existing.treeId;
    fillNodes();
    if (existing) directorySelect.value = existing.directoryId;
    mask.hidden = false;
    document.body.classList.add('is-dialog-open');
    treeSelect.focus();
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
    const type = activeCard.matches('[data-kb-card]') ? 'knowledge-base' : 'semantic-graph';
    const name = activeCard.dataset.kbName || activeCard.querySelector('h2').textContent.trim();
    const id = `${type}:${name}`;
    const directoryName = trees[treeSelect.value].nodes.find(([nodeId]) => nodeId === directorySelect.value)[1];
    const records = readRecords().filter(record => record.id !== id);
    records.push({ id, type, name, description: activeCard.querySelector('p')?.textContent.trim() || '', treeId: treeSelect.value, directoryId: directorySelect.value, directoryName });
    writeRecords(records);
    const status = activeCard.querySelector('.semantic-graph-card-head .tag');
    if (status) { status.textContent = '已发布'; status.className = 'tag tag-small semantic-status-published'; }
    const button = activeCard.querySelector('.knowledge-base-card-actions .btn-primary, .semantic-card-action');
    if (button) button.textContent = '调整目录';
    close();
    notify(`已发布“${name}”并挂载到“${directoryName}”`);
  });
}

appendPublishedCards();
enablePublishing();
