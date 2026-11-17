(function () {
  "use strict";
  var enabled = !!(window.APP_CONFIG && window.APP_CONFIG.enablePrayerScreen);
  window.PrayerComponent = {
    enabled: enabled,
    shouldShow: function (langCode) {
      return enabled && langCode === "ar";
    }
  };
})();