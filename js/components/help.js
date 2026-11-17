(function () {
  "use strict";
  var modal, form, thanks, errorEl, typeEl, msgEl, emailEl, sendBtn;

  function open() {
    if (!modal) init();
    modal.classList.remove("hidden");
    thanks.classList.add("hidden");
    form.classList.remove("hidden");
    errorEl.textContent = "";
    sendBtn.disabled = false;
    document.body.style.overflow = "hidden";
    setTimeout(function () { typeEl && typeEl.focus(); }, 50);
  }
  function close() {
    if (!modal) return;
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
  function validEmail(v) {
    if (!v) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }
  function handleSubmit(ev) {
    ev.preventDefault();
    if (sendBtn.disabled) return;
    errorEl.textContent = "";
    var i18n = (window.App && App.getI18N()) || (window.I18N && window.I18N.ar);
    var msg = (msgEl.value || "").trim();
    var email = (emailEl.value || "").trim();
    if (!msg) { errorEl.textContent = i18n.help.errorMsg; msgEl.focus(); return; }
    if (!validEmail(email)) { errorEl.textContent = i18n.help.errorEmail; emailEl.focus(); return; }
    sendBtn.disabled = true;
    var subject = "[Computer Adventure v" + (window.APP_CONFIG.version || "") + "] " +
                  (typeEl.options[typeEl.selectedIndex].text || typeEl.value);
    var bodyLines = [msg, "", "---", "Lang: " + (document.documentElement.lang || "?"), "UA: " + navigator.userAgent, "Time: " + new Date().toISOString()];
    if (email) bodyLines.unshift("Reply-To: " + email, "");
    var mailto = "mailto:" + encodeURIComponent(window.APP_CONFIG.supportEmail) +
                 "?subject=" + encodeURIComponent(subject) +
                 "&body=" + encodeURIComponent(bodyLines.join("\n"));
    try { window.location.href = mailto; } catch (e) {}
    form.classList.add("hidden");
    thanks.classList.remove("hidden");
  }
  function init() {
    modal = document.getElementById("helpModal");
    form = document.getElementById("helpForm");
    thanks = document.getElementById("helpThanks");
    errorEl = document.getElementById("helpError");
    typeEl = document.getElementById("helpType");
    msgEl = document.getElementById("helpMessage");
    emailEl = document.getElementById("helpEmail");
    sendBtn = document.getElementById("helpSendBtn");
    modal.addEventListener("click", function (e) {
      if (e.target.matches("[data-close-modal]")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) close();
    });
    form.addEventListener("submit", handleSubmit);
  }
  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("helpBtn");
    if (btn) btn.addEventListener("click", open);
  });
  window.HelpComponent = { open: open, close: close };
})();