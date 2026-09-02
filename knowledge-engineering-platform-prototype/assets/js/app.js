import { renderShell } from './shell.js?v=1';

const platformStylesheet = document.querySelector('link[href$="platform.css"]');
if (platformStylesheet) platformStylesheet.href = `${platformStylesheet.href}?v=2`;

renderShell();
const template = document.querySelector('template[data-page-template]');
if (template) document.querySelector('[data-page-content]').append(template.content.cloneNode(true));

const themeSwitch = document.querySelector('#theme-switch');
const savedTheme = localStorage.getItem('kep-theme') || 'light';
document.documentElement.dataset.theme = savedTheme;
themeSwitch.checked = savedTheme === 'dark';
themeSwitch.addEventListener('change', () => {
  const theme = themeSwitch.checked ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('kep-theme', theme);
});

const sidebar = document.querySelector('#sidebar');
document.querySelector('[data-nav-toggle]')?.addEventListener('click', event => {
  const open = sidebar.classList.toggle('is-open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
});

document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-toast]');
  if (!trigger) return;
  const toast = document.querySelector('[data-toast-node]');
  toast.textContent = trigger.dataset.toast;
  toast.classList.add('is-visible');
  window.clearTimeout(window.toastTimer);
  window.toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3000);
});

document.querySelectorAll('[data-table-search]').forEach(input => input.addEventListener('input', () => {
  const table = document.querySelector(input.dataset.tableSearch);
  const query = input.value.trim().toLowerCase();
  table?.querySelectorAll('tbody tr').forEach(row => { row.hidden = !row.textContent.toLowerCase().includes(query); });
}));

document.querySelectorAll('[data-tabs]').forEach(scope => {
  const tabs = scope.querySelectorAll('[role="tab"]');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(item => { item.classList.toggle('is-active', item === tab); item.setAttribute('aria-selected', String(item === tab)); });
    scope.querySelectorAll('[role="tabpanel"]').forEach(panel => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
  }));
});

document.querySelectorAll('[data-bar]').forEach(bar => { bar.style.width = `${bar.dataset.bar}%`; });
