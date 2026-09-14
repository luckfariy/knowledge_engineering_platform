import { createTaskFileResult } from './task-file-results.js?v=1';
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const demoId = 'TASK-R-20260911-0129';
const demoFiles = ['对公授信审查办法', '固定资产贷款管理办法'];
const demoTasks = {
  [demoId]: { id: demoId, taskName: '元数据补充', sourceName: '制度文档空间', title: '制度文件元数据补充', status: '已完成', fileNames: demoFiles, fileCount: 2 },
  'TASK-R-20260905-0128': { taskName: '文件上传', title: '制度文件批量接入', sourceName: '本地上传', status: '执行中', result: '68 / 100', fileCount: 100 },
  'TASK-R-20260905-0127': { taskName: '知识源同步', title: '飞书知识库增量同步', sourceName: '飞书知识库', status: '执行中', result: '1,842 / 2,316', fileCount: 2316 },
  'TASK-R-20260905-0126': { taskName: '自动入目', title: '信贷制度资源自动入目', sourceName: '企业空间', status: '已完成', result: '326 / 326', fileCount: 326 },
  'TASK-R-20260905-0125': { taskName: '知识源同步', title: 'Wiki 全量同步', sourceName: 'Wiki 连接器', status: '执行失败', result: '凭证已失效' }
};
const reviewsKey = 'kep-task-file-reviews-v1';
const fields = [
  ['summary', '内容摘要', '业务属性'], ['domain', '业务域', '业务属性'], ['category', '业务分类', '业务属性'], ['scenario', '业务使用场景', '业务属性'],
  ['department', '责任部门', '管理属性'], ['security', '密级', '管理属性']
];

if (document.body.dataset.page === 'resource-tasks') {
  // Both the task title and its explicit action open the same detail route.
  document.querySelectorAll('[data-resource-task-row]').forEach(row => {
    const id = row.dataset.sourceTaskId || row.querySelector('.cell-secondary')?.textContent.trim();
    if (!id) return;
    const href = `resource-task-detail.html?task=${encodeURIComponent(id)}`;
    const cell = row.cells[0];
    const title = [...cell.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join('').trim();
    if (title) {
      [...cell.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).forEach(node => node.remove());
      const link = document.createElement('a'); link.className = 'document-link'; link.href = href; link.textContent = title; cell.prepend(link);
    }
    const oldAction = row.querySelector('[data-toast="已打开任务详情"]');
    if (oldAction) { const link = document.createElement('a'); link.className = oldAction.className; link.href = href; link.textContent = '查看'; oldAction.replaceWith(link); }
    if (!row.cells[7].querySelector('a')) { const link = document.createElement('a'); link.className = 'btn btn-dense btn-text'; link.href = href; link.textContent = '查看'; row.cells[7].prepend(link); }
    const storedTasks = read('kep-source-processing-tasks', []);
    const storedTask = Array.isArray(storedTasks) ? storedTasks.find(task => task.id === id) : null;
    const reviewedNames = id === demoId ? demoFiles : (storedTask?.fileResults || []).map(file => file.name);
    if (reviewedNames.length) {
      const saved = read(reviewsKey, {})[id] || {};
      const confirmed = reviewedNames.filter(name => saved[name]?.confirmed).length;
      row.cells[5].textContent = `${reviewedNames.length} 个文件 · 已确认 ${confirmed} / ${reviewedNames.length}`;
    }
  });
  const legacyId = new URLSearchParams(location.search).get('task');
  if (legacyId) location.replace(`resource-task-detail.html?task=${encodeURIComponent(legacyId)}`);
}

if (document.body.dataset.page === 'resource-task-detail') {
  const id = new URLSearchParams(location.search).get('task');
  const savedTasks = read('kep-source-processing-tasks', []);
  const task = (Array.isArray(savedTasks) && savedTasks.find(item => item.id === id)) || demoTasks[id];
  const root = document.querySelector('[data-review-root]');
  if (!task) {
    root.innerHTML = '<section class="panel task-review-empty"><h2 class="text-medium-bold">未找到该任务</h2><p>任务可能已被清除，请返回任务中心选择任务。</p></section>';
  } else {
    const metadata = task.taskType === 'metadata' || task.taskType === 'tag' || task.taskName === '元数据补充';
    const type = metadata ? '元数据补充' : task.taskName;
    document.querySelector('[data-review-title]').textContent = task.title || `${task.sourceName} · ${type}`;
    document.querySelector('[data-review-summary]').textContent = `${id} · ${type} · ${task.sourceName} · 执行状态：${task.status}`;
    // Only actual per-file snapshots (or the explicit prototype example) are reviewable.
    const results = id === demoId ? demoFiles.map(createTaskFileResult) : (Array.isArray(task.fileResults) ? task.fileResults : []);
    const names = results.length ? results.map(file => file.name) : (task.fileNames || []);
    const canReview = metadata && task.status === '已完成' && results.length > 0;
    let selected = names.includes(new URLSearchParams(location.search).get('file')) ? names.indexOf(new URLSearchParams(location.search).get('file')) : 0;
    let dirty = false;
    const saved = read(reviewsKey, {});
    let fileReviews = saved[id] || {};
    root.innerHTML = `<div class="task-review-layout"><aside class="panel task-review-sidebar"><h2 class="text-medium-bold">处理文件 <span class="text-number">${names.length}</span></h2><p class="text-small" data-review-count></p><label class="input-wrap input-middle"><input class="input" type="search" placeholder="搜索文件名称" aria-label="搜索处理文件" data-review-search /></label><div class="task-review-files" data-review-files></div></aside><section class="panel task-review-editor" data-review-editor></section></div>`;
    const list = root.querySelector('[data-review-files]');
    const editor = root.querySelector('[data-review-editor]');
    function renderList() {
      const query = root.querySelector('[data-review-search]').value.trim().toLowerCase();
      list.innerHTML = names.map((name, index) => ({ name, index })).filter(file => file.name.toLowerCase().includes(query)).map(({ name, index }) => `<button class="task-review-file ${index === selected ? 'is-active' : ''}" type="button" data-review-file="${index}" aria-pressed="${index === selected}"><strong class="text-normal">${escape(name)}</strong><span class="tag tag-status ${fileReviews[name]?.confirmed ? 'tag-status-lime' : 'tag-status-secondary'}">${canReview ? fileReviews[name]?.confirmed ? '已确认' : '待确认' : task.status === '执行中' ? '处理中' : '暂无补充结果'}</span></button>`).join('') || '<p class="text-small">暂无匹配文件</p>';
      root.querySelector('[data-review-count]').textContent = canReview ? `已确认 ${names.filter(name => fileReviews[name]?.confirmed).length} / ${names.length} · 切换文件自动保存草稿` : `任务处理范围：${task.fileCount ?? names.length} 个文件`;
    }
    function message(text) { const node = editor.querySelector('[data-review-message]'); if (node) node.textContent = text; }
    function valuesFromForm() {
      const data = new FormData(editor.querySelector('form'));
      return { ...Object.fromEntries(fields.map(([key]) => [key, String(data.get(key) || '').trim()])), tags: [...new Set(String(data.get('tags') || '').split(/[,，、\n]/).map(tag => tag.trim()).filter(Boolean))] };
    }
    function persist(confirm = false) {
      if (!canReview) return true;
      const form = editor.querySelector('form');
      if (confirm && !form.reportValidity()) return false;
      const name = names[selected];
      const value = { values: valuesFromForm(), confirmed: confirm || (!dirty && Boolean(fileReviews[name]?.confirmed)), updatedAt: new Date().toISOString() };
      try {
        const all = read(reviewsKey, {});
        const next = { ...fileReviews, [name]: value };
        localStorage.setItem(reviewsKey, JSON.stringify({ ...all, [id]: next }));
        fileReviews = next; dirty = false; renderList();
        editor.querySelector('[data-file-review-status]').textContent = value.confirmed ? '已确认' : '待确认';
        message(confirm ? '当前文件的元数据与标签已确认。' : '修改已保存，等待确认。');
        return true;
      } catch { message('保存失败，浏览器存储不可用。请保留当前页面后重试。'); return false; }
    }
    function renderEditor() {
      if (!canReview) {
        editor.innerHTML = `<h2 class="text-medium-bold">${escape(names[selected] || '任务执行结果')}</h2><p class="task-review-message">${escape(task.result || task.status)}</p><p class="text-normal">${!metadata ? '该任务不产生元数据补充和标签结果。' : task.status !== '已完成' ? '任务尚未成功完成，暂不能确认处理结果。' : '该任务未记录逐文件补充结果，暂不能确认。'}</p>${!names.length ? '<p class="text-small">暂无逐文件处理清单。</p>' : ''}${task.taskType === 'catalog' || type === '自动入目' ? '<a class="btn btn-medium btn-primary" href="asset-catalogs.html?review=classification">查看目录分类结果</a>' : ''}`;
        return;
      }
      const file = results[selected];
      const state = fileReviews[file.name];
      const values = state?.values || file.values;
      editor.innerHTML = `<header><div><h2 class="text-medium-bold">${escape(file.name)}</h2><p class="text-small">元数据补充与标签 · 文件 ${selected + 1} / ${names.length}</p></div><span class="tag tag-status tag-status-secondary" data-file-review-status>${state?.confirmed ? '已确认' : '待确认'}</span></header><form><p class="task-review-message text-small">核对补充结果后可直接修改，确认仅作用于当前文件。</p>${['业务属性', '管理属性'].map(group => `<section class="task-review-section"><h3 class="text-medium-bold">${group}</h3><div class="task-review-fields">${fields.filter(([, , section]) => section === group).map(([key, label]) => `<div class="task-review-field"><label class="text-normal" for="review-${key}">${label}</label><div><span class="input-wrap input-middle"><input class="input" id="review-${key}" name="${key}" value="${escape(values[key])}" required maxlength="500" /></span><p class="task-review-evidence text-small">原建议：${escape(file.values[key] || '未补充')}</p></div></div>`).join('')}</div></section>`).join('')}<section class="task-review-section"><h3 class="text-medium-bold">标签</h3><div class="task-review-tags">${(file.values.tags || []).map(tag => `<span class="tag tag-small">${escape(tag)}</span>`).join('')}</div><label class="field task-review-section"><span class="text-small">修改标签（以逗号分隔，可添加或删除）</span><span class="input-wrap input-middle"><input class="input" name="tags" value="${escape((values.tags || []).join('，'))}" maxlength="500" /></span></label></section><details class="task-review-section"><summary class="text-normal">查看补充依据</summary><p class="task-review-evidence text-small">${escape(file.evidence || '暂无原文证据，请核对文件后确认。')}</p></details><div class="task-review-actions"><p class="text-small" role="status" aria-live="polite" data-review-message>${state ? '已载入上次保存的结果。' : '待核对并确认'}</p><div class="page-actions"><button class="btn btn-medium btn-secondary" type="button" data-review-save>保存修改</button><button class="btn btn-medium btn-primary" type="submit">确认当前文件</button></div></div></form>`;
      editor.querySelector('form').addEventListener('input', () => { dirty = true; editor.querySelector('[data-file-review-status]').textContent = '待确认'; message('有未保存的修改'); });
      editor.querySelector('[data-review-save]').addEventListener('click', () => persist());
      editor.querySelector('form').addEventListener('submit', event => { event.preventDefault(); persist(true); });
    }
    root.querySelector('[data-review-search]').addEventListener('input', renderList);
    list.addEventListener('click', event => {
      const button = event.target.closest('[data-review-file]');
      if (!button || (dirty && !persist())) return;
      selected = Number(button.dataset.reviewFile);
      const url = new URL(location.href); url.searchParams.set('file', names[selected]); history.replaceState(null, '', url);
      renderList(); renderEditor();
    });
    window.addEventListener('beforeunload', event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } });
    renderList(); renderEditor();
  }
}
