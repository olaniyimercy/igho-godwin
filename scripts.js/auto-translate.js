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
  const flags = { en: "🇬🇧", sv: "🇸🇪" };
  const codes = { en: "EN", sv: "SV" };

  if (!document.getElementById("google-translate-script")) {
    const gtScript = document.createElement("script");
    gtScript.id = "google-translate-script";
    gtScript.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.head.appendChild(gtScript);
  }

  // Hide top banner and tooltips underground
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

  // Strict English default
  function getStoredLanguage() {
    const saved = localStorage.getItem("preferred_lang");
    return saved === "sv" ? "sv" : "en";
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
    if (selectEl && selectEl.value !== langCode) {
      selectEl.value = langCode;
      selectEl.dispatchEvent(new Event("change"));
    }
  }

  function updateDropdownUI(lang) {
    const flagEl = document.getElementById("currentLangFlag");
    const codeEl = document.getElementById("currentLangCode");
    if (flagEl) flagEl.textContent = flags[lang];
    if (codeEl) codeEl.textContent = codes[lang];

    document.querySelectorAll(".lang-option").forEach((opt) => {
      opt.classList.toggle("active", opt.getAttribute("data-lang") === lang);
    });
  }

  window.switchLanguage = function (lang) {
    if (lang !== "en" && lang !== "sv") return;
    localStorage.setItem("preferred_lang", lang);
    updateDropdownUI(lang);
    applyTranslation(lang);
  };

  document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".lang-dropdown-container");
    const triggerBtn = document.getElementById("langDropdownBtn");
    const options = document.querySelectorAll(".lang-option");

    triggerBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = container.classList.toggle("is-open");
      triggerBtn.setAttribute("aria-expanded", isOpen);
    });

    options.forEach((opt) => {
      opt.addEventListener("click", () => {
        const lang = opt.getAttribute("data-lang");
        window.switchLanguage(lang);
        container?.classList.remove("is-open");
        triggerBtn?.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (e) => {
      if (container && !container.contains(e.target)) {
        container.classList.remove("is-open");
        triggerBtn?.setAttribute("aria-expanded", "false");
      }
    });

    const activeLang = getStoredLanguage();
    updateDropdownUI(activeLang);

    let attempts = 0;
    const checkGoogleInterval = setInterval(() => {
      attempts++;
      const selectEl = document.querySelector(".goog-te-combo");
      if (selectEl || attempts > 20) {
        clearInterval(checkGoogleInterval);
        applyTranslation(activeLang);
      }
    }, 150);

    setInterval(suppressGoogleUI, 300);
  });
})();
