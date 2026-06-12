/* ===== djch portal — shared: icons, theme, data ===== */
window.ICONS = {
  "hard-drive": '<rect x="3" y="13" width="18" height="7" rx="2"/><path d="M5.5 13 8 4.5h8L18.5 13"/><circle cx="8" cy="16.5" r="1"/><line x1="12" y1="16.5" x2="16" y2="16.5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3c2.5 2.5 3.8 5.7 3.8 9S14.5 18.5 12 21"/><path d="M12 3C9.5 5.5 8.2 8.7 8.2 12S9.5 18.5 12 21"/>',
  hexagon: '<path d="M12 2.5l7.5 4.3v8.4L12 19.5 4.5 15.2V6.8z"/><circle cx="12" cy="11" r="2.4"/>',
  server: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><circle cx="7" cy="7.5" r=".8" fill="currentColor" stroke="none"/><circle cx="7" cy="16.5" r=".8" fill="currentColor" stroke="none"/>',
  shield: '<path d="M12 3l7.5 3v5.5c0 4.2-3.2 7.6-7.5 9.5-4.3-1.9-7.5-5.3-7.5-9.5V6z"/>',
  book: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5V21h13"/>',
  activity: '<polyline points="3 12 7 12 10 5 14 19 17 12 21 12"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="16" x2="12" y2="20"/>',
  sliders: '<line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/><circle cx="9" cy="8" r="2.2" fill="var(--card)"/><circle cx="15" cy="16" r="2.2" fill="var(--card)"/>',
  "bar-chart": '<rect x="3" y="11" width="4" height="9" rx="1" fill="currentColor" stroke="none"/><rect x="10" y="5" width="4" height="15" rx="1" fill="currentColor" stroke="none"/><rect x="17" y="14" width="4" height="6" rx="1" fill="currentColor" stroke="none"/>',
  grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4.5"/><line x1="12" y1="19.5" x2="12" y2="22"/><line x1="2" y1="12" x2="4.5" y2="12"/><line x1="19.5" y1="12" x2="22" y2="12"/><line x1="4.9" y1="4.9" x2="6.7" y2="6.7"/><line x1="17.3" y1="17.3" x2="19.1" y2="19.1"/><line x1="4.9" y1="19.1" x2="6.7" y2="17.3"/><line x1="17.3" y1="6.7" x2="19.1" y2="4.9"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  "arrow-left": '<line x1="20" y1="12" x2="4.5" y2="12"/><polyline points="10.5 5.5 4 12 10.5 18.5"/>',
  external: '<path d="M14 4h6v6"/><line x1="20" y1="4" x2="11" y2="13"/><path d="M18 13v5.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H11"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  layers: '<path d="M12 2.5L2.5 7.5 12 12.5l9.5-5z"/><path d="M2.5 12L12 17l9.5-5"/><path d="M2.5 16.5L12 21.5l9.5-5"/>',
  box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.3 7 12 12 20.7 7"/><line x1="12" y1="22" x2="12" y2="12"/>'
};

window.svgIcon = function (name, cls) {
  const inner = window.ICONS[name] || window.ICONS.grid;
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" ' +
    'stroke-linecap="round" stroke-linejoin="round" class="' + (cls || 'ic') + '">' + inner + '</svg>';
};

/* ---- theme (light/dark) ---- */
window.initTheme = function () {
  const saved = localStorage.getItem('portal-theme');
  const dark = saved ? saved === 'dark' : true; // dark-first
  document.documentElement.classList.toggle('dark', dark);
};
window.toggleTheme = function () {
  const dark = !document.documentElement.classList.contains('dark');
  document.documentElement.classList.toggle('dark', dark);
  localStorage.setItem('portal-theme', dark ? 'dark' : 'light');
  document.dispatchEvent(new CustomEvent('themechange', { detail: { dark } }));
};
window.themeIcon = function () {
  return window.svgIcon(document.documentElement.classList.contains('dark') ? 'sun' : 'moon');
};

window.loadPortal = function () {
  return fetch('portal.json?_=' + Date.now()).then(r => r.json());
};

// apply theme ASAP to avoid flash
window.initTheme();
