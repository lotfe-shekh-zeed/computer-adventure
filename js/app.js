(function () {
  "use strict";

  var CONFIG = window.APP_CONFIG;
  var Storage = window.AppStorage;

  var state = {
    lang: null,
    currentScreen: "screen-language",
    name: "",
    avatar: CONFIG.avatars[0],
    currentLevelId: null,
    currentQ: 0,
    levelCorrect: 0,
    answeredThisQ: false,
    levelStars: {},
    levelScores: {},
    levelDone: {},
    totalStars: 0,
    totalCorrect: 0,
    certTitle: null
  };

  function $(id) { return document.getElementById(id); }
  function $all(sel) { return document.querySelectorAll(sel); }

  function sanitize(raw) {
    if (typeof raw !== "string") return "";
    return raw.replace(/[^\p{L}\p{N}\s\-_.]/gu, "").replace(/\s+/g, " ").trim().slice(0, 20);
  }

  function t() { return window.I18N[state.lang]; }

  function showScreen(id) {
    $all(".screen").forEach(function (s) { s.classList.add("hidden"); });
    var el = $(id);
    if (el) el.classList.remove("hidden");
    state.currentScreen = id;
    updateBackButton();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function applyLanguage(langCode) {
    if (CONFIG.supportedLangs.indexOf(langCode) < 0 || !window.I18N[langCode]) langCode = CONFIG.defaultLang;
    var i18n = window.I18N[langCode];
    state.lang = langCode;
    document.documentElement.lang = i18n.lang;
    document.documentElement.dir = i18n.dir;
    $("backArrow").textContent = (i18n.dir === "rtl") ? "\u2192" : "\u2190";
    $all("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = getByPath(i18n, key);
      if (typeof val === "string" && val !== "") el.textContent = val;
    });
    $all("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      var val = getByPath(i18n, key);
      if (typeof val === "string") el.setAttribute("aria-label", val);
    });
    $all("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      var val = getByPath(i18n, key);
      if (typeof val === "string") el.setAttribute("placeholder", val);
    });
    buildAvatarGrid();
    renderMap();
    updateChip();
  }

  function getByPath(obj, path) {
    return path.split(".").reduce(function (acc, k) {
      return (acc && acc[k] !== undefined) ? acc[k] : undefined;
    }, obj);
  }

  function updateBackButton() {
    var btn = $("backBtn");
    var target = getBackTarget(state.currentScreen);
    if (target) {
      btn.classList.remove("hidden");
      btn.setAttribute("data-target", target);
    } else {
      btn.classList.add("hidden");
      btn.removeAttribute("data-target");
    }
  }

  function getBackTarget(current) {
    switch (current) {
      case "screen-about": return "screen-language";
      case "screen-setup": return "screen-about";
      case "screen-map": return "screen-about";
      case "screen-quiz": return "screen-map";
      case "screen-result": return "screen-map";
      case "screen-certificate": return "screen-map";
      default: return null;
    }
  }

  function handleBack() {
    var btn = $("backBtn");
    var target = btn.getAttribute("data-target");
    if (!target) return;
    if (state.currentScreen === "screen-quiz") {
      var confirmMsg = t().prompts.exit;
      if (!window.confirm(confirmMsg)) return;
    }
    if (target === "screen-map") renderMap();
    showScreen(target);
  }

  function updateChip() {
    var chip = $("playerChip");
    if (!chip) return;
    if (state.name) {
      chip.classList.add("show");
      $("chipName").textContent = state.name;
      $("chipAvatar").textContent = state.avatar;
      $("chipStars").textContent = state.totalStars;
    } else {
      chip.classList.remove("show");
    }
  }

  function buildAvatarGrid() {
    var grid = $("avatarGrid");
    if (!grid) return;
    grid.innerHTML = "";
    CONFIG.avatars.forEach(function (av, idx) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "avatar-opt" + (av === state.avatar ? " selected" : "");
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", av === state.avatar ? "true" : "false");
      btn.setAttribute("aria-label", "avatar " + (idx + 1));
      btn.textContent = av;
      btn.addEventListener("click", function () {
        grid.querySelectorAll(".avatar-opt").forEach(function (b) {
          b.classList.remove("selected");
          b.setAttribute("aria-checked", "false");
        });
        btn.classList.add("selected");
        btn.setAttribute("aria-checked", "true");
        state.avatar = av;
        updateChip();
        persist();
      });
      grid.appendChild(btn);
    });
  }

  function renderMap() {
    var wrap = $("levelNodes");
    if (!wrap) return;
    var i18n = t();
    var LEVELS = i18n.levels;
    wrap.innerHTML = "";
    var doneCount = 0;
    LEVELS.forEach(function (level, idx) {
      var isDone = !!state.levelDone[level.id];
      var prevStars = idx > 0 ? (state.levelStars[LEVELS[idx - 1].id] || 0) : 3;
      var isLocked = idx > 0 && prevStars === 0;
      if (isDone) doneCount++;
      var node = document.createElement("div");
      node.className = "level-node" + (isLocked ? " locked" : "") + (isDone ? " done" : "");
      node.setAttribute("role", "button");
      node.setAttribute("tabindex", isLocked ? "-1" : "0");
      var stars = state.levelStars[level.id] || 0;
      var starsHtml = "";
      for (var s = 1; s <= 3; s++) starsHtml += (s <= stars ? "\u2B50" : "\u2606");
      var iconEl = document.createElement("div");
      iconEl.className = "node-icon";
      iconEl.textContent = level.icon;
      var infoEl = document.createElement("div");
      infoEl.className = "node-info";
      var b = document.createElement("b");
      b.textContent = i18n.map.stage + " " + level.id + ": " + level.title;
      var span = document.createElement("span");
      span.textContent = level.desc;
      infoEl.appendChild(b);
      infoEl.appendChild(span);
      node.appendChild(iconEl);
      node.appendChild(infoEl);
      if (isLocked) {
        var lock = document.createElement("div");
        lock.className = "node-lock";
        lock.textContent = "\uD83D\uDD12";
        node.appendChild(lock);
      } else {
        var starsBox = document.createElement("div");
        starsBox.className = "node-stars";
        starsBox.textContent = starsHtml;
        node.appendChild(starsBox);
      }
      if (!isLocked) {
        node.addEventListener("click", function () { startLevel(level.id); });
        node.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); startLevel(level.id); }
        });
      }
      wrap.appendChild(node);
    });
    $("mapProgressLabel").textContent = doneCount + " / " + LEVELS.length;
    $("mapProgressFill").style.width = (doneCount / LEVELS.length * 100) + "%";
    $("mapStarsLabel").textContent = "\u2B50 " + state.totalStars;
    if (doneCount === LEVELS.length) renderCertificate();
  }

  function startLevel(levelId) {
    state.currentLevelId = levelId;
    state.currentQ = 0;
    state.levelCorrect = 0;
    state.answeredThisQ = false;
    renderQuestion();
    showScreen("screen-quiz");
  }

  function getCurrentLevel() {
    return t().levels.find(function (l) { return l.id === state.currentLevelId; });
  }

  function renderQuestion() {
    var i18n = t();
    var level = getCurrentLevel();
    var q = level.questions[state.currentQ];
    state.answeredThisQ = false;
    $("quizLevelTag").textContent = i18n.quiz.stage + " " + level.id + " \u00B7 " + level.title;
    $("quizQuestionLabel").textContent = i18n.quiz.question + " " + (state.currentQ + 1) + " " + i18n.quiz.of + " " + level.questions.length;
    var prog = $("quizProgress");
    prog.innerHTML = "";
    level.questions.forEach(function (_, i) {
      var dot = document.createElement("span");
      dot.className = "quiz-dot" + (i < state.currentQ ? " done" : (i === state.currentQ ? " active" : ""));
      prog.appendChild(dot);
    });
    $("questionText").textContent = q.q;
    var grid = $("optionsGrid");
    grid.innerHTML = "";
    q.options.forEach(function (opt, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      var letter = document.createElement("span");
      letter.className = "option-letter";
      letter.textContent = i18n.quiz.letters[i];
      var span = document.createElement("span");
      span.textContent = opt;
      btn.appendChild(letter);
      btn.appendChild(span);
      btn.addEventListener("click", function () { handleAnswer(i, btn); });
      grid.appendChild(btn);
    });
    var fb = $("feedbackBox");
    fb.classList.remove("show", "good", "bad");
    $("feedbackText").textContent = "";
    $("feedbackIcon").textContent = "";
    $("nextQBtn").disabled = true;
    $("nextQBtn").textContent = (state.currentQ === level.questions.length - 1) ? i18n.quiz.finish : i18n.quiz.next;
  }

  function handleAnswer(selectedIdx, btnEl) {
    if (state.answeredThisQ) return;
    state.answeredThisQ = true;
    var i18n = t();
    var level = getCurrentLevel();
    var q = level.questions[state.currentQ];
    var all = document.querySelectorAll("#optionsGrid .option-btn");
    all.forEach(function (b) { b.disabled = true; });
    var isCorrect = selectedIdx === q.correct;
    if (isCorrect) { btnEl.classList.add("correct"); state.levelCorrect++; }
    else { btnEl.classList.add("wrong"); if (all[q.correct]) all[q.correct].classList.add("correct"); }
    var fb = $("feedbackBox");
    fb.classList.add("show", isCorrect ? "good" : "bad");
    $("feedbackIcon").textContent = isCorrect ? "\u2705" : "\uD83D\uDCA1";
    $("feedbackText").textContent = (isCorrect ? i18n.quiz.correctPrefix : i18n.quiz.wrongPrefix) + q.explain;
    $("nextQBtn").disabled = false;
  }

  function nextQuestion() {
    var level = getCurrentLevel();
    if (state.currentQ < level.questions.length - 1) {
      state.currentQ++;
      renderQuestion();
    } else {
      finishLevel();
    }
  }

  function finishLevel() {
    var i18n = t();
    var level = getCurrentLevel();
    var total = level.questions.length;
    var correct = state.levelCorrect;
    var stars = correct >= 5 ? 3 : correct >= 4 ? 2 : correct >= 3 ? 1 : 0;
    var prevStars = state.levelStars[level.id] || 0;
    if (stars > prevStars) {
      state.totalStars += (stars - prevStars);
      state.levelStars[level.id] = stars;
    }
    state.levelScores[level.id] = correct;
    recalcTotalCorrect();
    if (stars >= 1) state.levelDone[level.id] = true;
    persist();
    $("resultBadge").textContent = stars === 3 ? i18n.result.excellent : stars >= 1 ? i18n.result.good : i18n.result.keepGoing;
    $("resultTitle").textContent = i18n.result.completed + " " + level.title;
    $("resultScore").textContent = correct + " " + i18n.result.correctOf + " " + total;
    var starSpans = document.querySelectorAll("#resultStars span");
    starSpans.forEach(function (s, i) { s.classList.toggle("earned", i < stars); });
    var nextLevel = i18n.levels.find(function (l) { return l.id === level.id + 1; });
    var nextBtn = $("resultNextBtn");
    if (stars === 0) {
      nextBtn.textContent = i18n.result.mapBtn;
      nextBtn.onclick = function () { renderMap(); showScreen("screen-map"); };
    } else if (nextLevel) {
      nextBtn.textContent = i18n.result.nextBtn;
      nextBtn.onclick = function () { startLevel(nextLevel.id); };
    } else {
      nextBtn.textContent = i18n.result.certBtn;
      nextBtn.onclick = function () { renderCertificate(); showScreen("screen-certificate"); };
    }
    updateChip();
    showScreen("screen-result");
  }

  function recalcTotalCorrect() {
    state.totalCorrect = Object.keys(state.levelScores).reduce(function (sum, id) {
      return sum + (Number(state.levelScores[id]) || 0);
    }, 0);
  }
  function totalQuestions() {
    return t().levels.reduce(function (s, l) { return s + l.questions.length; }, 0);
  }
  function renderCertificate() {
    var i18n = t();
    var total = totalQuestions() || 1;
    var pct = Math.round((state.totalCorrect / total) * 100);
    var tier = pct >= 85 ? "High" : (pct >= 60 ? "Mid" : "Low");
    if (!state.certTitle) {
      var titles = i18n.certificate["titles" + tier];
      state.certTitle = titles[Math.floor(Math.random() * titles.length)];
    }
    $("certName").textContent = state.avatar + "  " + state.name;
    $("certStars").textContent = state.totalStars;
    $("certScore").textContent = pct + "%";
    $("certLevel").textContent = state.certTitle;
    var msgKey = pct >= 85 ? "msgHigh" : (pct >= 60 ? "msgMid" : "msgLow");
    $("certMessage").textContent = i18n.certificate[msgKey];
  }

  function persist() {
    Storage.save({
      lang: state.lang, name: state.name, avatar: state.avatar,
      levelStars: state.levelStars, levelScores: state.levelScores,
      levelDone: state.levelDone, totalStars: state.totalStars,
      certTitle: state.certTitle
    });
  }
  function restore() {
    var data = Storage.load();
    if (!data || !data.name) return false;
    state.lang = CONFIG.supportedLangs.indexOf(data.lang) >= 0 && window.I18N[data.lang] ? data.lang : CONFIG.defaultLang;
    state.name = sanitize(data.name);
    state.avatar = CONFIG.avatars.indexOf(data.avatar) >= 0 ? data.avatar : CONFIG.avatars[0];
    state.levelStars = isPlainObject(data.levelStars) ? data.levelStars : {};
    state.levelScores = isPlainObject(data.levelScores) ? data.levelScores : {};
    state.levelDone = isPlainObject(data.levelDone) ? data.levelDone : {};
    state.totalStars = Number(data.totalStars) || 0;
    state.certTitle = typeof data.certTitle === "string" ? data.certTitle : null;
    recalcTotalCorrect();
    return true;
  }
  function isPlainObject(x) { return x && typeof x === "object" && !Array.isArray(x); }

  function bindEvents() {
    document.querySelectorAll(".lang-card-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lang = btn.getAttribute("data-lang");
        state.lang = lang;
        applyLanguage(lang);
        persist();
        showScreen("screen-about");
      });
    });
    $("aboutContinueBtn").addEventListener("click", function () {
      showScreen("screen-setup");
    });
    $("setupContinueBtn").addEventListener("click", function () {
      var raw = $("playerName").value || "";
      var clean = sanitize(raw);
      var i18n = t();
      if (!clean) { $("nameError").textContent = i18n.setup.errorEmpty; $("playerName").focus(); return; }
      if (clean.length < 2) { $("nameError").textContent = i18n.setup.errorShort; $("playerName").focus(); return; }
      $("nameError").textContent = "";
      state.name = clean;
      updateChip();
      persist();
      renderMap();
      showScreen("screen-map");
    });
    $("playerName").addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); $("setupContinueBtn").click(); }
    });
    $("nextQBtn").addEventListener("click", nextQuestion);
    $("resultMapBtn").addEventListener("click", function () { renderMap(); showScreen("screen-map"); });
    $("backBtn").addEventListener("click", handleBack);
    $("langBtn").addEventListener("click", function () {
      var confirmMsg = t().prompts.changeLanguage;
      if (window.confirm(confirmMsg)) showScreen("screen-language");
    });
    $("printCertBtn").addEventListener("click", function () {
      var modal = $("helpModal");
      var wasOpen = modal && !modal.classList.contains("hidden");
      if (wasOpen) modal.classList.add("hidden");
      window.print();
      if (wasOpen) modal.classList.remove("hidden");
    });
    $("restartBtn").addEventListener("click", function () {
      var msg = t().prompts.restart;
      if (!window.confirm(msg)) return;
      state.levelStars = {};
      state.levelScores = {};
      state.levelDone = {};
      state.totalStars = 0;
      state.totalCorrect = 0;
      state.certTitle = null;
      persist();
      updateChip();
      renderMap();
      showScreen("screen-map");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !document.querySelector(".modal:not(.hidden)")) {
        if (!$("backBtn").classList.contains("hidden")) handleBack();
      }
    });
  }

  function init() {
    bindEvents();
    if (restore()) {
      applyLanguage(state.lang);
      updateChip();
      renderMap();
      showScreen("screen-map");
    } else {
      state.lang = CONFIG.defaultLang;
      document.documentElement.lang = "ar";
      document.documentElement.dir = "rtl";
      showScreen("screen-language");
    }
  }

  window.App = {
    getI18N: function () { return t(); },
    getLang: function () { return state.lang; }
  };
  document.addEventListener("DOMContentLoaded", init);
})();

