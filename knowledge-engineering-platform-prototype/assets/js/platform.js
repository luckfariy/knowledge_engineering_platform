import { renderShell } from './shell.js';

const content = document.querySelector('template[data-page-template]');
renderShell();
if (content) document.querySelector('[data-page-content]').append(content.content.cloneNode(true));

const themeSwitch = document.querySelector('#theme-switch');
const savedTheme = localStorage.getItem('kep-theme');
if (savedTheme === 'dark') {
  document.documentElement.dataset.theme = 'dark';
  themeSwitch.checked = true;
}
themeSwitch?.addEventListener('change', event => {
  const theme = event.target.checked ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('kep-theme', theme);
});

const navButton = document.querySelector('[data-nav-toggle]');
const sidebar = document.querySelector('#sidebar');
navButton?.addEventListener('click', () => {
  const open = sidebar.classList.toggle('is-open');
  navButton.setAttribute('aria-expanded', String(open));
});

const toast = document.querySelector('[data-toast-node]');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-toast]');
  if (trigger) showToast(trigger.dataset.toast);

  const dialogOpen = event.target.closest('[data-dialog-open]');
  if (dialogOpen) {
    const dialog = document.querySelector(dialogOpen.dataset.dialogOpen);
    dialog?.removeAttribute('hidden');
    dialog?.querySelector('button, input, select, textarea')?.focus();
  }

  const dialogClose = event.target.closest('[data-dialog-close]');
  if (dialogClose) dialogClose.closest('.dialog-mask')?.setAttribute('hidden', '');
});

document.querySelectorAll('[data-filter-group]').forEach(group => {
  group.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    group.querySelectorAll('[data-filter]').forEach(item => item.classList.remove('is-active'));
    button.classList.add('is-active');
    const target = document.querySelector(group.dataset.target);
    if (!target) return;
    const value = button.dataset.filter;
    target.querySelectorAll('[data-status]').forEach(row => {
      row.hidden = value !== 'all' && row.dataset.status !== value;
    });
  });
});

document.querySelectorAll('[data-table-search]').forEach(input => {
  input.addEventListener('input', () => {
    const table = document.querySelector(input.dataset.tableSearch);
    const query = input.value.trim().toLowerCase();
    table?.querySelectorAll('tbody tr[data-search]').forEach(row => {
      row.hidden = !row.dataset.search.toLowerCase().includes(query);
    });
  });
});

document.querySelectorAll('[role="tablist"]').forEach(tablist => {
  tablist.addEventListener('click', event => {
    const tab = event.target.closest('[role="tab"]');
    if (!tab || tab.disabled) return;
    tablist.querySelectorAll('[role="tab"]').forEach(item => {
      item.classList.toggle('is-active', item === tab);
      item.setAttribute('aria-selected', String(item === tab));
    });
    const scope = tablist.closest('[data-tabs-scope]') || document;
    scope.querySelectorAll('[role="tabpanel"]').forEach(panel => {
      panel.hidden = panel.id !== tab.getAttribute('aria-controls');
    });
  });
});

document.querySelectorAll('[data-progress]').forEach(bar => {
  bar.style.width = `${Math.max(0, Math.min(100, Number(bar.dataset.progress)))}%`;
  bar.setAttribute('aria-valuenow', bar.dataset.progress);
});

document.querySelectorAll('[data-bar]').forEach(bar => {
  bar.style.height = `${Math.max(6, Math.min(100, Number(bar.dataset.bar)))}%`;
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') document.querySelectorAll('.dialog-mask:not([hidden])').forEach(dialog => dialog.setAttribute('hidden', ''));
});
