function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: "en",
      includedLanguages: "en,sv",
      autoDisplay: false,
    },
    "google_translate_element",
  );
}

(function () {
  if (!document.getElementById("google-translate-script")) {
    const gtScript = document.createElement("script");
    gtScript.id = "google-translate-script";
    gtScript.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.head.appendChild(gtScript);
  }

  // Hide Google Translate banner & popups underground
  const suppressGoogleUI = () => {
    document.body.style.top = "0px";
    document.body.style.position = "static";
    document.documentElement.style.top = "0px";

    const frames = document.querySelectorAll(
      ".goog-te-banner-frame, iframe.skiptranslate",
    );
    frames.forEach((frame) => {
      frame.style.display = "none";
      frame.style.visibility = "hidden";
      frame.style.height = "0";
    });

    const tooltips = document.querySelectorAll(
      "#goog-gt-tt, .goog-te-balloon-frame",
    );
    tooltips.forEach((tt) => {
      tt.style.display = "none";
      tt.style.visibility = "hidden";
    });
  };

  const observer = new MutationObserver(() => {
    suppressGoogleUI();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class"],
  });

  function getStoredLanguage() {
    return localStorage.getItem("preferred_lang") === "sv" ? "sv" : "en";
  }

  function setTranslateCookie(langCode) {
    const domain = window.location.hostname.replace(/^www\./, "");
    const cookieVal = langCode === "sv" ? "/en/sv" : "/en/en";
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${domain}`;
    document.cookie = `googtrans=${cookieVal}; path=/`;
  }

  function applyTranslation(langCode) {
    setTranslateCookie(langCode);

    const selectEl = document.querySelector(".goog-te-combo");
    if (selectEl) {
      selectEl.value = langCode;
      selectEl.dispatchEvent(new Event("change"));
    }
  }

  // Immediately update active status on buttons
  function updateLinkUI(lang) {
    const btnEn = document.getElementById("btn-lang-en");
    const btnSv = document.getElementById("btn-lang-sv");

    if (btnEn) btnEn.classList.toggle("active", lang === "en");
    if (btnSv) btnSv.classList.toggle("active", lang === "sv");
  }

  // Global handler for clicks - instantaneous execution on single click
  window.switchLanguage = function (lang) {
    if (lang !== "en" && lang !== "sv") return;

    localStorage.setItem("preferred_lang", lang);
    updateLinkUI(lang);
    setTranslateCookie(lang);

    // Trigger select change immediately, then retry if combo element isn't attached yet
    applyTranslation(lang);
    setTimeout(() => applyTranslation(lang), 100);
  };

  document.addEventListener("DOMContentLoaded", () => {
    const activeLang = getStoredLanguage();
    updateLinkUI(activeLang);

    let attempts = 0;
    const checkGoogleInterval = setInterval(() => {
      attempts++;
      const selectEl = document.querySelector(".goog-te-combo");
      if (selectEl || attempts > 25) {
        clearInterval(checkGoogleInterval);
        applyTranslation(activeLang);
      }
    }, 100);

    setInterval(suppressGoogleUI, 250);
  });
})();
