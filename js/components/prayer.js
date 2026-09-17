/* ============================================================
   prayer.js — مكوّن قسم الصلاة (عربي فقط)
   ============================================================
   ▸ هذا الملف مستقل تمامًا.
   ▸ لإزالة قسم الصلاة بالكامل:
       1) احذف هذا الملف.
       2) احذف وسم <script src="js/components/prayer.js"> من index.html.
       3) احذف <section id="screen-prayer"> ... </section> من index.html.
       4) اجعل APP_CONFIG.enablePrayerScreen = false.
   ============================================================ */
(function () {
  "use strict";

  var enabled = !!(window.APP_CONFIG && window.APP_CONFIG.enablePrayerScreen);

  window.PrayerComponent = {
    enabled: enabled,
    /**
     * هل يجب عرض قسم الصلاة للغة الحالية؟
     * @param {string} langCode - كود اللغة (ar / he ... إلخ)
     */
    shouldShow: function (langCode) {
      return enabled && langCode === "ar";
    }
  };
})();