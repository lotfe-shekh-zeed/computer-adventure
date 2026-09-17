/* ============================================================
   app.js — محرك التطبيق الرئيسي
   ============================================================
   يدير:
     • التنقل بين الشاشات
     • اختيار اللغة + اتجاه الصفحة (RTL/LTR)
     • حالة اللاعب + التخزين
     • محرك الأسئلة والنتائج
     • الشهادة + زر الرجوع
   ============================================================ */
(function () {
  "use strict";

  var CONFIG = window.APP_CONFIG;
  var Storage = window.AppStorage;

  /* =========================================================
     الحالة العامة للتطبيق
     ========================================================= */
  var state = {
    lang: null,                 // "ar" | "he"
    currentScreen: "screen-language",
    name: "",
    avatar: CONFIG.avatars[0],

    currentLevelId: null,
    currentQ: 0,
    levelCorrect: 0,
    answeredThisQ: false,

    levelStars: {},   // { levelId: 1|2|3 }
    levelScores: {},  // { levelId: correctCount }
    levelDone: {},    // { levelId: true }
    totalStars: 0,
    totalCorrect: 0
  };

  /* =========================================================
     أدوات مساعدة
     ========================================================= */
  function $(id) { return document.getElementById(id); }
  function $all(sel) { return document.querySelectorAll(sel); }

  /** إزالة الأحرف الخطيرة من نص المستخدم لمنع XSS */
  function sanitize(raw) {
    if (typeof raw !== "string") return "";
    return raw
      .replace(/[<>"'`\\]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 20);
  }

  /** الـ i18n للغة الحالية */
  function t() { return window.I18N[state.lang]; }

  /** إظهار شاشة معينة + تحديث حالة زر الرجوع */
  function showScreen(id) {
    $all(".screen").forEach(function (s) { s.classList.add("hidden"); });
    var el = $(id);
    if (el) el.classList.remove("hidden");
    state.currentScreen = id;
    updateBackButton();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* =========================================================
     اتجاه اللغة + الخطوط
     ========================================================= */
  function applyLanguage(langCode) {
    if (!window.I18N[langCode]) langCode = CONFIG.defaultLang;
    var i18n = window.I18N[langCode];
    state.lang = langCode;

    // اتجاه الصفحة
    document.documentElement.lang = i18n.lang;
    document.documentElement.dir = i18n.dir;

    // سهم زر الرجوع يتغير حسب الاتجاه
    $("backArrow").textContent = (i18n.dir === "rtl") ? "→" : "←";

    // ترجمة العناصر المعلّمة بـ data-i18n
    $all("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = getByPath(i18n, key);
      if (typeof val === "string" && val !== "") {
        el.textContent = val;
      }
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

    // إخفاء خيارات قسم الصلاة إذا كانت اللغة عبرية
    if (!window.PrayerComponent.shouldShow(langCode)) {
      // لا نحذف الـ section، فقط نضمن عدم الوصول إليها
    }

    // إعادة بناء الـ UI الديناميكي
    buildAvatarGrid();
    renderMap();
    updateChip();
  }

  /** قراءة قيمة nested من object بواسطة "a.b.c" */
  function getByPath(obj, path) {
    return path.split(".").reduce(function (acc, k) {
      return (acc && acc[k] !== undefined) ? acc[k] : undefined;
    }, obj);
  }

  /* =========================================================
     زر الرجوع
     ========================================================= */
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
      case "screen-about":       return "screen-language";
      case "screen-prayer":      return "screen-about";
      case "screen-setup":       return prayerLangMatches() ? "screen-prayer" : "screen-about";
      case "screen-map":         return "screen-about";
      case "screen-quiz":        return "screen-map";
      case "screen-result":      return "screen-map";
      case "screen-certificate": return "screen-map";
      default:                   return null;
    }
  }

  function prayerLangMatches() {
    return window.PrayerComponent.shouldShow(state.lang);
  }

  function handleBack() {
    var btn = $("backBtn");
    var target = btn.getAttribute("data-target");
    if (!target) return;

    // تأكيد عند مغادرة الاختبار
    if (state.currentScreen === "screen-quiz") {
      var i18n = t();
      var confirmMsg = (i18n.dir === "rtl")
        ? "هل تريد الخروج من المرحلة والعودة للخريطة؟"
        : "האם לצאת מהשלב ולחזור למפה?";
      if (!window.confirm(confirmMsg)) return;
    }

    if (target === "screen-map") renderMap();
    if (target === "screen-about") {/* لا حاجة لإعادة البناء */}
    showScreen(target);
  }

  /* =========================================================
     شريط اللاعب
     ========================================================= */
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

  /* =========================================================
     شبكة الشخصيات
     ========================================================= */
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

  /* =========================================================
     خريطة المراحل
     ========================================================= */
  function renderMap() {
    var wrap = $("levelNodes");
    if (!wrap) return;
    var i18n = t();
    var LEVELS = i18n.levels;
    wrap.innerHTML = "";
    var doneCount = 0;

    LEVELS.forEach(function (level, idx) {
      var isDone = !!state.levelDone[level.id];
      var isLocked = idx > 0 && !state.levelDone[LEVELS[idx - 1].id];
      if (isDone) doneCount++;

      var node = document.createElement("div");
      node.className = "level-node" + (isLocked ? " locked" : "") + (isDone ? " done" : "");
      node.setAttribute("role", "button");
      node.setAttribute("tabindex", isLocked ? "-1" : "0");
      node.setAttribute("aria-label",
        isLocked
          ? (i18n.map.stage + " " + level.id + " " + i18n.map.locked)
          : (i18n.map.open + " " + level.id + ": " + level.title));

      var stars = state.levelStars[level.id] || 0;
      var starsHtml = "";
      for (var s = 1; s <= 3; s++) starsHtml += (s <= stars ? "⭐" : "☆");

      // نبني الـ DOM بأمان (بدون innerHTML مع محتوى المستخدم)
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
        lock.textContent = "🔒";
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
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            startLevel(level.id);
          }
        });
      }
      wrap.appendChild(node);
    });

    $("mapProgressLabel").textContent = doneCount + " / " + LEVELS.length;
    $("mapProgressFill").style.width = (doneCount / LEVELS.length * 100) + "%";
    $("mapStarsLabel").textContent = "⭐ " + state.totalStars;

    if (doneCount === LEVELS.length) {
      renderCertificate();
    }
  }

  /* =========================================================
     محرك الاختبار
     ========================================================= */
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

    $("quizLevelTag").textContent = i18n.quiz.stage + " " + level.id + " · " + level.title;
    $("quizQuestionLabel").textContent =
      i18n.quiz.question + " " + (state.currentQ + 1) + " " + i18n.quiz.of + " " + level.questions.length;

    var prog = $("quizProgress");
    prog.innerHTML = "";
    level.questions.forEach(function (_, i) {
      var dot = document.createElement("span");
      dot.className = "quiz-dot" +
        (i < state.currentQ ? " done" : (i === state.currentQ ? " active" : ""));
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
    $("nextQBtn").textContent = (state.currentQ === level.questions.length - 1)
      ? i18n.quiz.finish : i18n.quiz.next;
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
    if (isCorrect) {
      btnEl.classList.add("correct");
      state.levelCorrect++;
    } else {
      btnEl.classList.add("wrong");
      if (all[q.correct]) all[q.correct].classList.add("correct");
    }

    var fb = $("feedbackBox");
    fb.classList.add("show", isCorrect ? "good" : "bad");
    $("feedbackIcon").textContent = isCorrect ? "✅" : "💡";
    $("feedbackText").textContent =
      (isCorrect ? i18n.quiz.correctPrefix : i18n.quiz.wrongPrefix) + q.explain;

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
    var stars = correct >= 4 ? 3 : (correct === 3 ? 2 : 1);

    var prevStars = state.levelStars[level.id] || 0;
    if (stars > prevStars) {
      state.totalStars += (stars - prevStars);
      state.levelStars[level.id] = stars;
    }
    state.levelScores[level.id] = correct;
    recalcTotalCorrect();
    state.levelDone[level.id] = true;
    persist();

    $("resultBadge").textContent = stars === 3 ? i18n.result.excellent
                               : stars === 2 ? i18n.result.good
                                             : i18n.result.keepGoing;
    $("resultTitle").textContent = i18n.result.completed + " " + level.title;
    $("resultScore").textContent = correct + " " + i18n.result.correctOf + " " + total;

    var starSpans = document.querySelectorAll("#resultStars span");
    starSpans.forEach(function (s, i) {
      s.classList.toggle("earned", i < stars);
    });

    var nextLevel = i18n.levels.find(function (l) { return l.id === level.id + 1; });
    var nextBtn = $("resultNextBtn");
    if (nextLevel) {
      nextBtn.textContent = i18n.result.nextBtn;
      nextBtn.onclick = function () { startLevel(nextLevel.id); };
    } else {
      nextBtn.textContent = i18n.result.certBtn;
      nextBtn.onclick = function () {
        renderCertificate();
        showScreen("screen-certificate");
      };
    }

    updateChip();
    showScreen("screen-result");
  }

  /* =========================================================
     الشهادة
     ========================================================= */
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
    var titles = i18n.certificate["titles" + tier];
    var title = titles[Math.floor(Math.random() * titles.length)];

    $("certName").textContent = state.avatar + "  " + state.name;
    $("certStars").textContent = state.totalStars;
    $("certScore").textContent = pct + "%";
    $("certLevel").textContent = title;

    var msgKey = pct >= 85 ? "msgHigh" : (pct >= 60 ? "msgMid" : "msgLow");
    $("certMessage").textContent = i18n.certificate[msgKey];
  }

  /* =========================================================
     التخزين
     ========================================================= */
  function persist() {
    Storage.save({
      lang: state.lang,
      name: state.name,
      avatar: state.avatar,
      levelStars: state.levelStars,
      levelScores: state.levelScores,
      levelDone: state.levelDone,
      totalStars: state.totalStars
    });
  }

  function restore() {
    var data = Storage.load();
    if (!data || !data.name) return false;
    if (!window.I18N[data.lang]) return false;

    state.lang = data.lang;
    state.name = sanitize(data.name);
    state.avatar = CONFIG.avatars.indexOf(data.avatar) >= 0 ? data.avatar : CONFIG.avatars[0];
    state.levelStars = isPlainObject(data.levelStars) ? data.levelStars : {};
    state.levelScores = isPlainObject(data.levelScores) ? data.levelScores : {};
    state.levelDone = isPlainObject(data.levelDone) ? data.levelDone : {};
    state.totalStars = Number(data.totalStars) || 0;
    recalcTotalCorrect();
    return true;
  }

  function isPlainObject(x) {
    return x && typeof x === "object" && !Array.isArray(x);
  }

  /* =========================================================
     أحداث التنقل
     ========================================================= */
  function bindEvents() {
    // شاشة اللغة
    document.querySelectorAll(".lang-card-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lang = btn.getAttribute("data-lang");
        state.lang = lang;
        applyLanguage(lang);
        persist();
        showScreen("screen-about");
      });
    });

    // "ابدأ الآن" من شاشة التعريف
    $("aboutContinueBtn").addEventListener("click", function () {
      if (prayerLangMatches()) {
        showScreen("screen-prayer");
      } else {
        showScreen("screen-setup");
      }
    });

    // زر "تابعت الصلاة"
    $("prayerContinueBtn").addEventListener("click", function () {
      showScreen("screen-setup");
    });

    // زر بدء المغامرة
    $("setupContinueBtn").addEventListener("click", function () {
      var raw = $("playerName").value || "";
      var clean = sanitize(raw);
      var i18n = t();
      if (!clean) {
        $("nameError").textContent = i18n.setup.errorEmpty;
        $("playerName").focus();
        return;
      }
      if (clean.length < 2) {
        $("nameError").textContent = i18n.setup.errorShort;
        $("playerName").focus();
        return;
      }
      $("nameError").textContent = "";
      state.name = clean;
      updateChip();
      persist();
      renderMap();
      showScreen("screen-map");
    });

    // Enter في حقل الاسم
    $("playerName").addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); $("setupContinueBtn").click(); }
    });

    // زر التالي في الاختبار
    $("nextQBtn").addEventListener("click", nextQuestion);

    // زر خريطة المراحل من النتيجة
    $("resultMapBtn").addEventListener("click", function () {
      renderMap();
      showScreen("screen-map");
    });

    // زر الرجوع
    $("backBtn").addEventListener("click", handleBack);

    // زر تغيير اللغة
    $("langBtn").addEventListener("click", function () {
      if (window.confirm(state.lang === "ar"
        ? "هل تريد تغيير اللغة؟ ستعود لشاشة البداية."
        : "לשנות את השפה? תחזור למסך ההתחלה.")) {
        showScreen("screen-language");
      }
    });

    // طباعة الشهادة
    $("printCertBtn").addEventListener("click", function () { window.print(); });

    // إعادة اللعب من الصفر
    $("restartBtn").addEventListener("click", function () {
      var msg = state.lang === "ar"
        ? "هل أنت متأكد من إعادة اللعب؟ سيتم حذف التقدّم."
        : "לאפס את המשחק? ההתקדמות תימחק.";
      if (!window.confirm(msg)) return;
      state.levelStars = {};
      state.levelScores = {};
      state.levelDone = {};
      state.totalStars = 0;
      state.totalCorrect = 0;
      persist();
      updateChip();
      renderMap();
      showScreen("screen-map");
    });

    // اختصار: Esc = رجوع
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !document.querySelector(".modal:not(.hidden)")) {
        if (!$("backBtn").classList.contains("hidden")) handleBack();
      }
    });
  }

  /* =========================================================
     التهيئة
     ========================================================= */
  function init() {
    bindEvents();

    if (restore()) {
      applyLanguage(state.lang);
      updateChip();
      renderMap();
      showScreen("screen-map");
    } else {
      // لا يوجد تقدّم محفوظ: ابدأ من شاشة اللغة
      // نضع فقط الاتجاه الافتراضي حتى يختار المستخدم لغته
      state.lang = CONFIG.defaultLang;
      document.documentElement.lang = "ar";
      document.documentElement.dir = "rtl";
      showScreen("screen-language");
    }
  }

  // الوصول من خارج الموديول (يستخدمه help.js)
  window.App = {
    getI18N: function () { return t(); },
    getLang: function () { return state.lang; }
  };

  document.addEventListener("DOMContentLoaded", init);
})();