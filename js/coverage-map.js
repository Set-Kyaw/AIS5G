// Coverage Map JavaScript

// Get saved language from localStorage or detect default
function getInitialLanguage(allowedLangs) {
  try {
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang && allowedLangs?.includes(savedLang)) {
      return savedLang;
    }
  } catch (e) {
    console.error('Failed to get saved language:', e);
  }
  
  // If no saved language, detect from browser
  const detectedLang = detectDefaultLang();
  if (allowedLangs?.includes(detectedLang)) {
    return detectedLang;
  }
  
  // Fallback to first allowed language
  return allowedLangs?.[0] || "en_US";
}

const CoverageMapObj = {
  init: function (data) {
    this.loadJson(data);
    setTimeout(function () {
      $("#body_loading").addClass("hide");
    }, 1000);

    this.initEvents();
  },

  loadJson: function (data) {
    const allowedLangs = data?.custom_html?.lang;
    
    // Get saved language or detect default
    const initialLang = getInitialLanguage(allowedLangs);
    
    // Set the current language
    I18nObj.currentLang = initialLang;

    I18nObj.init(data);
    I18nObj.renderHtmlLang();
  },

  initEvents: function () {
    const self = this;

    // Refresh map button
    $("#refresh_map").on("click", function () {
      self.refreshMap();
    });

    // Fullscreen button
    $("#fullscreen_map").on("click", function () {
      self.toggleFullscreen();
    });

    // Add animation to info cards
    this.animateInfoCards();
  },

  refreshMap: function () {
    const iframe = document.getElementById("coverage_map");
    if (iframe) {
      // Reload iframe
      iframe.src = iframe.src;

      // Show loading feedback
      const btn = $("#refresh_map");
      const originalText = btn.find(".text").text();
      btn.find(".text").text("Refreshing...");
      btn.prop("disabled", true);

      setTimeout(function () {
        btn.find(".text").text(originalText);
        btn.prop("disabled", false);
      }, 1500);
    }
  },

  toggleFullscreen: function () {
    const mapWrapper = document.querySelector(".map-wrapper");

    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (mapWrapper.requestFullscreen) {
        mapWrapper.requestFullscreen();
      } else if (mapWrapper.webkitRequestFullscreen) {
        mapWrapper.webkitRequestFullscreen();
      } else if (mapWrapper.msRequestFullscreen) {
        mapWrapper.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  },

  animateInfoCards: function () {
    // Animate numbers on scroll/load
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll(".info-card").forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      card.style.transition = "all 0.6s ease";
      observer.observe(card);
    });
  },
};

// Initialize when config loads
function loadConfig(data) {
  CoverageMapObj.init(data);
}

// Language detection function (same as main portal)
function detectDefaultLang() {
  const lang = navigator.language || navigator.userLanguage || "";

  if (lang.toLowerCase().startsWith("th")) {
    return "th_TH";
  }

  return "en_US"; // fallback
}
