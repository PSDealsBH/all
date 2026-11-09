(function (window, document) {
  "use strict";

  var LANGUAGE_KEY = "psDealsLanguage";
  var CHOSEN_KEY = "psDealsLanguageChosen";
  var currentLanguage = "ar";
  var readyCallback = null;
  var changeCallback = null;
  var readySent = false;
  var initialized = false;
  var overlay = null;
  var switchButton = null;
  var messageGuard = false;
  var alertInstalled = false;

  var text = {
    ar: {
      title: "اختر اللغة",
      subtitle: "اختر لغة واجهة PS_DEALS_BH",
      arabic: "العربية",
      english: "English",
      change: "English",
      changeTitle: "تغيير اللغة إلى الإنجليزية",
      hostKicker: "PS4 / مضيف متعدد الإصدارات",
      activationStatus: "حالة التفعيل",
      loading: "جارٍ تحميل GoldHEN v2.4b18.13... يرجى الانتظار",
      automaticSelection: "اختيار إصدار النظام تلقائيًا · GoldHEN v2.4b18.13",
      credits: "شكر خاص للمساهمين:",
      instagram: "تابعنا على Instagram",
      onlyPS4: "متاح فقط لجهاز PS4 بإصدارات النظام 5.05 و7.00 إلى 14.00",
      unsupportedFirmware: "إصدار النظام غير مدعوم:",
      contentMissing: "تعذر العثور على المحتوى. امسح بيانات المتصفح ثم أعد تثبيت الكاش.",
      previewSafe: "وضع المعاينة الآمن — لن يتم تشغيل الاستغلال أو تحميل GoldHEN.",
      loaded: "تم تحميل GoldHEN v2.4b18.13 بنجاح.",
      alreadyLoaded: "GoldHEN محمّل بالفعل.",
      failedRestart: "فشل التحميل. أعد تشغيل جهاز PS4 ثم حاول مرة أخرى.",
      failedReopen: "فشل التحميل. أغلق المتصفح وأعد فتحه ثم حاول مرة أخرى.",
      noOffsets: "لا تتوفر offsets لهذا الإصدار:",
      cacheStarting: "جارٍ بدء تثبيت الكاش دون إنترنت لـ GoldHEN v2.4b18.13...",
      cacheInstalling: "جارٍ تثبيت الكاش دون إنترنت:",
      cacheSuccess: "✅ تم تثبيت الكاش بنجاح",
      cacheReady: "يمكنك الآن استخدام الصفحة دون اتصال بالإنترنت.",
      cacheReopen: "أغلق المتصفح ثم أعد فتحه.",
      cacheError: "تعذر تثبيت الكاش الجديد. تم الاحتفاظ بالكاش السابق السليم. أعد فتح المتصفح وحاول مرة أخرى.",
      technicalPrefix: "الحالة التقنية"
    },
    en: {
      title: "Choose Language",
      subtitle: "Choose the PS_DEALS_BH interface language",
      arabic: "العربية",
      english: "English",
      change: "العربية",
      changeTitle: "Change language to Arabic",
      hostKicker: "PS4 / MULTI-FIRMWARE HOST",
      activationStatus: "ACTIVATION STATUS",
      loading: "Loading GoldHEN v2.4b18.13... Please wait",
      automaticSelection: "Automatic firmware selection · GoldHEN v2.4b18.13",
      credits: "Special thanks to contributors:",
      instagram: "Follow us on Instagram",
      onlyPS4: "Only for PS4 with Firmware 5.05 and 7.00 to 14.00",
      unsupportedFirmware: "Unsupported Firmware:",
      contentMissing: "Content not found. Clear browser data and reinstall the cache.",
      previewSafe: "Safe preview mode — exploit routing and GoldHEN loading are disabled.",
      loaded: "GoldHEN v2.4b18.13 loaded successfully.",
      alreadyLoaded: "GoldHEN is already loaded.",
      failedRestart: "Loading failed. Restart your PS4 and try again.",
      failedReopen: "Loading failed. Close and reopen the browser, then try again.",
      noOffsets: "No offsets are available for this firmware:",
      cacheStarting: "Starting offline cache installation for GoldHEN v2.4b18.13...",
      cacheInstalling: "Installing Offline Cache:",
      cacheSuccess: "✅ Cache installed successfully",
      cacheReady: "You can now use this page without an Internet connection.",
      cacheReopen: "Close and reopen your browser.",
      cacheError: "The new cache could not be installed. The previous working cache was kept. Reopen the browser and try again.",
      technicalPrefix: "Technical status"
    }
  };

  var exactMessages = {
    "GoldHEN v2.4b18.13 Loaded ...": "loaded",
    "GoldHEN is Already Loaded ...": "alreadyLoaded",
    "Failed to Load! Restart Your Console ...": "failedRestart",
    "Failed to Load! Reopen the Browser ...": "failedReopen",
    "Content not Found! - Clear Browser Data and Re-Install Cache ...": "contentMissing",
    "Only for PS4 with Firmware 5.05 and 7.00 to 14.00": "onlyPS4",
    "Loading GoldHEN v2.4b18.13... Please Wait": "loading"
  };

  var technicalMessages = {
    "running the primitive...": "جارٍ تشغيل المرحلة الأولية",
    "scanning libkernel for syscall stubs...": "جارٍ فحص libkernel",
    "wiring the worker...": "جارٍ تجهيز worker",
    "setting up the aio batches...": "جارٍ تجهيز دفعات AIO",
    "dry run: everything but the racing delete...": "جارٍ إجراء فحص تمهيدي",
    "racing...": "جارٍ تنفيذ محاولة الاستغلال",
    "leaking kernel addresses...": "جارٍ الحصول على عناوين kernel",
    "stage 3: crafting the aio queue entry...": "المرحلة 3: تجهيز قائمة AIO",
    "stage 4: kernel read...": "المرحلة 4: قراءة kernel",
    "stage 5: kernel write...": "المرحلة 5: كتابة kernel",
    "stage 6: locating the kernel base...": "المرحلة 6: تحديد قاعدة kernel",
    "building KernelView...": "جارٍ تجهيز KernelView",
    "stage 7: repairing the aliases...": "المرحلة 7: إصلاح الحالة المؤقتة",
    "stage 8: jailbreak...": "المرحلة 8: تنفيذ jailbreak",
    "stage 9: kernel patches...": "المرحلة 9: تطبيق kernel patches",
    "sweeping...": "جارٍ فحص الذاكرة",
    "setting up...": "جارٍ الإعداد",
    "leaking a kqueue...": "جارٍ تجهيز kqueue",
    "kread_slow...": "جارٍ تنفيذ kread_slow",
    "make_karw...": "جارٍ تجهيز kernel read/write",
    "sandbox escape...": "جارٍ تجاوز sandbox",
    "remove_uaf_file...": "جارٍ تنظيف ملف UAF",
    "kernel patches...": "جارٍ تطبيق kernel patches",
    "payload...": "جارٍ تحميل payload",
    "testing WebKit primitive...": "جارٍ اختبار WebKit primitive",
    "not a PS4 browser - debug mode": "ليس متصفح PS4 — وضع التشخيص",
    "no offsets for this firmware": "لا تتوفر offsets لهذا الإصدار",
    "threw": "حدث خطأ تقني",
    "FAILED -- see log": "فشلت العملية — راجع السجل التقني",
    "ALL DONE": "اكتملت جميع المراحل",
    "KERNEL R/W -- REBOOT NEEDED": "تم الوصول إلى kernel R/W — يلزم إعادة التشغيل",
    "FAILED IN make_karw -- REBOOT": "فشل make_karw — يلزم إعادة التشغيل",
    "REBOOT FIRST -- this kernel is still poisoned": "أعد التشغيل أولًا — حالة kernel غير سليمة"
  };

  function validLanguage(language) {
    return language === "ar" || language === "en";
  }

  function t(key) {
    var group = text[currentLanguage] || text.ar;
    return group[key] !== undefined ? group[key] : (text.en[key] !== undefined ? text.en[key] : key);
  }

  function localizeMessage(value) {
    var raw = value === null || value === undefined ? "" : String(value);
    var key = exactMessages[raw];
    if (key) return t(key);
    var unsupported = raw.match(/^Unsupported Firmware:\s*(.*)$/i);
    if (unsupported) return t("unsupportedFirmware") + " " + unsupported[1];
    var offsets = raw.match(/^No offsets for this firmware:\s*(.*)$/i);
    if (offsets) return t("noOffsets") + " " + offsets[1];
    if (currentLanguage === "ar" && technicalMessages[raw]) {
      return technicalMessages[raw] + " — " + t("technicalPrefix") + ": " + raw;
    }
    if (currentLanguage === "ar") {
      var attempt = raw.match(/^attempt\s+(\d+)\.\.\.$/i);
      if (attempt) return "المحاولة " + attempt[1] + "... — " + t("technicalPrefix") + ": " + raw;
      var workers = raw.match(/^bringing up\s+(\d+)\s+workers\.\.\.$/i);
      if (workers) return "جارٍ تشغيل " + workers[1] + " workers — " + t("technicalPrefix") + ": " + raw;
    }
    return raw;
  }

  function translateElement(element) {
    if (!element || element.nodeType !== 1) return;
    var key = element.getAttribute("data-i18n");
    if (key) element.innerHTML = t(key);
    var ariaKey = element.getAttribute("data-i18n-aria");
    if (ariaKey) element.setAttribute("aria-label", t(ariaKey));
  }

  function translateStaticText() {
    if (!document.querySelectorAll) return;
    var nodes = document.querySelectorAll("[data-i18n],[data-i18n-aria]");
    var i;
    for (i = 0; i < nodes.length; i++) translateElement(nodes[i]);
    var output = document.getElementById("msgs");
    if (output) {
      var original = output.getAttribute("data-i18n-original") || output.textContent || output.innerText || "";
      output.setAttribute("data-i18n-original", original);
      var translated = localizeMessage(original);
      if (translated !== (output.textContent || output.innerText || "")) {
        messageGuard = true;
        output.textContent = translated;
        messageGuard = false;
      }
    }
  }

  function watchVisibleMessages() {
    if (!window.MutationObserver || !document.body) return;
    var observer = new window.MutationObserver(function (changes) {
      if (messageGuard) return;
      var i;
      for (i = 0; i < changes.length; i++) {
        var node = changes[i].target;
        var element = node.nodeType === 1 ? node : node.parentNode;
        if (!element) continue;
        if (element.id === "msgs" || element.id === "state" || /(^|\s)state(\s|$)/.test(element.className || "")) {
          var raw = element.textContent || element.innerText || "";
          if (element.id === "msgs") element.setAttribute("data-i18n-original", raw);
          var translated = localizeMessage(raw);
          if (translated !== raw) {
            messageGuard = true;
            element.textContent = translated;
            messageGuard = false;
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function installAlertLocalization() {
    if (alertInstalled || typeof window.alert !== "function") return;
    alertInstalled = true;
    var nativeAlert = window.alert;
    window.alert = function (message) {
      var raw = message === null || message === undefined ? "" : String(message);
      var translated = localizeMessage(raw);
      if (currentLanguage === "ar" && translated === raw && raw) {
        translated = "حدث خطأ تقني. احتفظ بالتفاصيل التالية عند طلب الدعم:\n\n" + raw;
      }
      return nativeAlert.call(window, translated);
    };
  }

  function storageGet(key) {
    try {
      return window.localStorage ? window.localStorage.getItem(key) : null;
    } catch (ignore) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      if (window.localStorage) window.localStorage.setItem(key, value);
    } catch (ignore) {}
  }

  function storageRemove(key) {
    try {
      if (window.localStorage) window.localStorage.removeItem(key);
    } catch (ignore) {}
  }

  function injectStyles() {
    if (document.getElementById("ps-language-styles")) return;
    var style = document.createElement("style");
    style.id = "ps-language-styles";
    style.type = "text/css";
    style.textContent =
      "#ps-language-overlay{position:fixed;top:0;right:0;bottom:0;left:0;z-index:10000;display:table;width:100%;height:100%;background:rgba(1,8,17,.92);}" +
      ".ps-language-center{display:table-cell;vertical-align:middle;text-align:center;padding:20px;}" +
      ".ps-language-card{box-sizing:border-box;width:86%;max-width:540px;margin:0 auto;padding:38px 34px 32px;border:1px solid #497da1;border-radius:16px;background:#061626;box-shadow:0 22px 65px rgba(0,0,0,.65);color:#edf7ff;font-family:Arial,sans-serif;}" +
      ".ps-language-logo{margin:0 0 8px;color:#fff;font-size:31px;font-weight:bold;letter-spacing:2px;direction:ltr;}" +
      ".ps-language-title{margin:24px 0 8px;color:#e7c68f;font-size:28px;}" +
      ".ps-language-subtitle{margin:0 0 26px;color:#9ac9e4;font-size:16px;}" +
      ".ps-language-actions{direction:ltr;}" +
      ".ps-language-button{box-sizing:border-box;display:inline-block;width:44%;min-height:54px;margin:6px 2%;padding:13px 10px;border:1px solid #497da1;border-radius:8px;background:#0b2840;color:#edf7ff;font-size:18px;font-weight:bold;cursor:pointer;}" +
      ".ps-language-button-primary{border-color:#d5ad72;background:#124777;box-shadow:0 0 0 2px rgba(213,173,114,.22);}" +
      "#ps-language-switch{position:fixed;left:18px;bottom:18px;z-index:9000;min-width:92px;padding:9px 14px;border:1px solid #497da1;border-radius:7px;background:#061626;color:#e7c68f;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;cursor:pointer;}" +
      "html[dir=rtl] body{direction:rtl;}" +
      "html[dir=rtl] .stage{text-align:right;}" +
      "html[dir=rtl] .activation{border-left:1px solid #34617d;border-right:4px solid #cfa666;}" +
      "html[dir=rtl] .brand,html[dir=rtl] .subtitle{direction:ltr;text-align:left;}" +
      "html[dir=rtl] .kicker,html[dir=rtl] .activation-label,html[dir=rtl] #msgs,html[dir=rtl] .meta,html[dir=rtl] .credits{direction:rtl;text-align:right;}" +
      "html[dir=rtl] .qr-panel{direction:rtl;}" +
      "@media(max-width:650px){.ps-language-card{width:94%;padding:30px 18px 25px}.ps-language-button{display:block;width:100%;margin:10px 0}.ps-language-logo{font-size:25px}.ps-language-title{font-size:24px}#ps-language-switch{left:10px;bottom:10px;}}";
    document.getElementsByTagName("head")[0].appendChild(style);
  }

  function setDirection(language) {
    var html = document.documentElement;
    html.setAttribute("lang", language);
    html.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
    if (document.body) document.body.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
  }

  function updateSwitchButton() {
    if (!switchButton) return;
    switchButton.innerHTML = text[currentLanguage].change;
    switchButton.title = text[currentLanguage].changeTitle;
    switchButton.setAttribute("aria-label", text[currentLanguage].changeTitle);
  }

  function ensureSwitchButton() {
    if (switchButton || !document.body) return;
    switchButton = document.createElement("button");
    switchButton.id = "ps-language-switch";
    switchButton.type = "button";
    switchButton.onclick = function () {
      applyLanguage(currentLanguage === "ar" ? "en" : "ar", true);
    };
    document.body.appendChild(switchButton);
    updateSwitchButton();
  }

  function applyLanguage(language, persist) {
    if (!validLanguage(language)) language = "ar";
    currentLanguage = language;
    setDirection(language);
    if (persist) {
      storageSet(LANGUAGE_KEY, language);
      storageSet(CHOSEN_KEY, "1");
    }
    ensureSwitchButton();
    updateSwitchButton();
    translateStaticText();
    if (persist && typeof changeCallback === "function") changeCallback(language);
  }

  function removeOverlay() {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    overlay = null;
  }

  function notifyReady() {
    if (readySent) return;
    readySent = true;
    if (typeof readyCallback === "function") readyCallback();
  }

  function choose(language) {
    applyLanguage(language, true);
    removeOverlay();
    notifyReady();
  }

  function showFirstChoice() {
    removeOverlay();
    overlay = document.createElement("div");
    overlay.id = "ps-language-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    var center = document.createElement("div");
    center.className = "ps-language-center";
    var card = document.createElement("div");
    card.className = "ps-language-card";
    card.setAttribute("dir", "rtl");

    var logo = document.createElement("div");
    logo.className = "ps-language-logo";
    logo.innerHTML = "PS_DEALS_BH";
    var title = document.createElement("h2");
    title.className = "ps-language-title";
    title.innerHTML = text.ar.title + " / " + text.en.title;
    var subtitle = document.createElement("p");
    subtitle.className = "ps-language-subtitle";
    subtitle.innerHTML = text.ar.subtitle + "<br>" + text.en.subtitle;
    var actions = document.createElement("div");
    actions.className = "ps-language-actions";

    var arabic = document.createElement("button");
    arabic.type = "button";
    arabic.className = "ps-language-button ps-language-button-primary";
    arabic.innerHTML = text.ar.arabic;
    arabic.onclick = function () { choose("ar"); };

    var english = document.createElement("button");
    english.type = "button";
    english.className = "ps-language-button";
    english.innerHTML = text.en.english;
    english.onclick = function () { choose("en"); };

    actions.appendChild(arabic);
    actions.appendChild(english);
    card.appendChild(logo);
    card.appendChild(title);
    card.appendChild(subtitle);
    card.appendChild(actions);
    center.appendChild(card);
    overlay.appendChild(center);
    document.body.appendChild(overlay);
    setTimeout(function () {
      try { arabic.focus(); } catch (ignore) {}
    }, 0);
  }

  function clearChoice() {
    storageRemove(LANGUAGE_KEY);
    storageRemove(CHOSEN_KEY);
    currentLanguage = "ar";
    readySent = false;
  }

  function initCachePage() {
    injectStyles();
    installAlertLocalization();
    var saved = storageGet(LANGUAGE_KEY);
    var chosen = storageGet(CHOSEN_KEY) === "1";
    applyLanguage(chosen && validLanguage(saved) ? saved : "ar", false);
  }

  function init(options) {
    if (initialized) return;
    initialized = true;
    readyCallback = options && options.onReady;
    changeCallback = options && options.onChange;
    injectStyles();
    watchVisibleMessages();
    installAlertLocalization();

    var saved = storageGet(LANGUAGE_KEY);
    var chosen = storageGet(CHOSEN_KEY) === "1";
    if (chosen && validLanguage(saved)) {
      applyLanguage(saved, false);
      notifyReady();
      return;
    }

    applyLanguage("ar", false);
    showFirstChoice();
  }

  window.PSDealsI18n = {
    init: init,
    applyLanguage: function (language) { applyLanguage(language, true); },
    clearChoice: clearChoice,
    getLanguage: function () { return currentLanguage; },
    t: t,
    localizeMessage: localizeMessage,
    translatePage: translateStaticText,
    initCachePage: initCachePage
  };
})(window, document);
