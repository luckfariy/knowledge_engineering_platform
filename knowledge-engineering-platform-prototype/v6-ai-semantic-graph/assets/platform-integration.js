(() => {
  const backButton = document.querySelector('.brand-back');
  if (backButton) {
    backButton.addEventListener('click', () => {
      window.location.assign('../pages/semantic-graphs.html');
    });
  }

  let draft = null;
  try {
    draft = JSON.parse(sessionStorage.getItem('kep-v6-semantic-graph-draft') || 'null');
  }
  catch {
    draft = null;
  }
  if (!draft?.name) return;

  document.title = `${draft.name} · AI 语义知识图谱`;
  const workspaceHeading = document.querySelector('#workspacePage .page-head h1');
  const workspaceDescription = document.querySelector('#workspacePage .page-head p');
  if (workspaceHeading) workspaceHeading.textContent = draft.name;
  if (workspaceDescription && draft.description) workspaceDescription.textContent = draft.description;
})();
