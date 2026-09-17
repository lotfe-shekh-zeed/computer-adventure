/* ============================================================
   storage.js — إدارة التخزين المحلي بشكل آمن
   ============================================================ */
(function () {
  "use strict";

  var KEY = window.APP_CONFIG.storageKey;
  var AVAILABLE = (function () {
    try {
      var t = "__test__";
      localStorage.setItem(t, "1");
      localStorage.removeItem(t);
      return true;
    } catch (e) {
      return false;
    }
  })();

  // ذاكرة مؤقتة في حال عدم توفر localStorage
  var memoryStore = null;

  function save(data) {
    var json;
    try { json = JSON.stringify(data); } catch (e) { return; }
    if (AVAILABLE) {
      try { localStorage.setItem(KEY, json); } catch (e) { /* ممتلئ؟ */ }
    } else {
      memoryStore = json;
    }
  }

  function load() {
    var raw = AVAILABLE ? localStorage.getItem(KEY) : memoryStore;
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function clear() {
    if (AVAILABLE) {
      try { localStorage.removeItem(KEY); } catch (e) {}
    } else {
      memoryStore = null;
    }
  }

  window.AppStorage = { save: save, load: load, clear: clear, available: AVAILABLE };
})();