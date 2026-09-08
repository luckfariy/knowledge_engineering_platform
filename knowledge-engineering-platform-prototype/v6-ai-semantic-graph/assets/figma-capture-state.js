(function () {
  const params = new URLSearchParams(window.location.search);
  const captureView = params.get('figmaView');
  const captureDialog = params.get('figmaDialog');
  const captureStep = params.get('figmaStep');
  if (!captureView && !captureDialog) return;

  function showIndexState() {
    const pages = Array.from(document.querySelectorAll('.page'));
    const showPage = (id) => {
      pages.forEach((page) => page.classList.remove('active'));
      const page = document.getElementById(id);
      if (page) page.classList.add('active');
    };

    const panelMap = {
      'task-overview': 'overview',
      'task-documents': 'documents',
      'task-fusion': 'fusion',
      'task-ingraph': 'commit'
    };
    if (captureView === 'workspace') showPage('workspacePage');
    if (captureView === 'resources') showPage('resourcesPage');
    if (captureView === 'empty') showPage('emptyPage');
    if (captureView === 'manual') showPage('manualKnowledgePage');
    if (captureView === 'manual-detail') showPage('manualEntityDetailPage');
    if (panelMap[captureView]) {
      showPage('taskPage');
      document.querySelectorAll('.detail-tab').forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.tab === panelMap[captureView]);
      });
      document.querySelectorAll('.detail-panel').forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.panel === panelMap[captureView]);
      });
    }

    if (captureDialog) {
      const mask = document.getElementById('mask');
      if (mask) mask.classList.add('show');
      document.querySelectorAll('.modal').forEach((modal) => modal.classList.remove('show'));
      const dialog = document.getElementById(captureDialog);
      if (dialog) dialog.classList.add('show');
      if (captureDialog === 'newTaskModal' && captureStep) {
        document.querySelectorAll('[data-new-step]').forEach((step) => {
          const active = step.dataset.newStep === captureStep;
          step.classList.toggle('active', active);
          step.classList.toggle('done', Number(step.dataset.newStep) < Number(captureStep));
        });
        document.querySelectorAll('[data-new-panel]').forEach((panel) => {
          panel.classList.toggle('active', panel.dataset.newPanel === captureStep);
        });
      }
    }
  }

  function showGraphState() {
    if (captureView === 'graph-canvas') {
      const button = document.querySelector('[data-view="graph"]');
      if (button) button.click();
    }
    if (captureView === 'graph-list') {
      const button = document.querySelector('[data-view="list"]');
      if (button) button.click();
    }
    if (captureDialog) {
      const mask = document.getElementById('modalMask');
      if (mask) mask.classList.add('show');
      document.querySelectorAll('.relation-modal,.figma-dialog').forEach((dialog) => dialog.classList.remove('show'));
      const dialog = document.getElementById(captureDialog);
      if (dialog) dialog.classList.add('show');
    }
  }

  function applyHertzCapturePolish() {
    const style = document.createElement('style');
    style.textContent = `
      :root{--hertz-primary:#2b79ff;--hertz-page:#eef0f4;--hertz-card:#fff;--hertz-type:rgba(21,22,24,.92);--hertz-line:rgba(15,34,67,.11)}
      html,body{font-family:"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif!important;font-size:14px!important;background:var(--hertz-page)!important}
      .btn,.page-button,.graph-actions button,.header-actions button,.modal-foot button,.figma-dialog footer button,.relation-modal footer button{border-radius:4px!important}
      .section,.stat,.manual-batch,.manual-layout,.editor-card,.type-item,.canvas-tools,.minimap{border-radius:8px!important}
      input,select,textarea,.search-box,.type-search,.list-filter label{border-radius:4px 4px 0 0!important;background:rgba(15,34,67,.05)!important;border-color:transparent!important;border-bottom:1px solid rgba(15,34,67,.2)!important}
      input:focus,select:focus,textarea:focus{border-bottom:2px solid var(--hertz-primary)!important;outline:0!important}
      .modal,.figma-dialog,.relation-modal{border-radius:8px!important}
      .status,.tag,.pill,.source-mode{border-radius:4px!important}
    `;
    document.head.appendChild(style);
  }

  window.addEventListener('load', () => {
    window.setTimeout(() => {
      applyHertzCapturePolish();
      if (document.querySelector('.kg-app')) showGraphState();
      else showIndexState();
    }, 120);
  });
})();
