(function () {
  'use strict';
  var key = 'middle5-appearance';
  var root = document.documentElement;
  var system = window.matchMedia('(prefers-color-scheme: dark)');
  var mode = 'auto';
  var allowed = ['light', 'dark', 'auto'];
  try { var saved = localStorage.getItem(key); if (allowed.includes(saved)) mode = saved; } catch (_) {}
  function apply() {
    var theme = mode === 'auto' ? (system.matches ? 'dark' : 'light') : mode;
    root.dataset.theme = theme;
    root.dataset.appearance = mode;
    root.style.colorScheme = theme;
    document.querySelectorAll('[data-appearance-select]').forEach(function (select) { select.value = mode; });
  }
  function onSystemChange() { if (mode === 'auto') apply(); }
  if (system.addEventListener) system.addEventListener('change', onSystemChange);
  else if (system.addListener) system.addListener(onSystemChange);
  window.addEventListener('storage', function (event) {
    if (event.key !== key && event.key !== null) return;
    mode = allowed.includes(event.newValue) ? event.newValue : 'auto';
    apply();
  });
  function restoreMode() {
    try {
      var persisted = localStorage.getItem(key);
      mode = allowed.includes(persisted) ? persisted : 'auto';
    } catch (_) {}
    apply();
  }
  window.addEventListener('pageshow', restoreMode);
  window.addEventListener('focus', restoreMode);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') restoreMode();
  });
  apply();
  document.addEventListener('DOMContentLoaded', function () {
    apply();
    document.querySelectorAll('[data-appearance-select]').forEach(function (select) {
      select.addEventListener('change', function () {
        mode = allowed.includes(select.value) ? select.value : 'auto';
        try { localStorage.setItem(key, mode); } catch (_) {}
        apply();
      });
    });
  });
}());
