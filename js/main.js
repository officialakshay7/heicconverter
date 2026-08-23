(function () {
  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Mobile menu toggle
  var menuBtn = document.getElementById("menuBtn");
  var mobileMenu = document.getElementById("mobileMenu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function () {
      var isHidden = mobileMenu.classList.contains("hidden");
      mobileMenu.classList.toggle("hidden");
      menuBtn.setAttribute("aria-expanded", String(isHidden));
    });
  }

  // Desktop "Convert" dropdown
  document.querySelectorAll("[data-dropdown]").forEach(function (wrap) {
    var btn = wrap.querySelector("[data-dropdown-btn]");
    var panel = wrap.querySelector("[data-dropdown-panel]");
    var caret = wrap.querySelector("[data-dropdown-caret]");
    if (!btn || !panel) return;

    function open() {
      panel.classList.remove("hidden");
      btn.setAttribute("aria-expanded", "true");
      if (caret) caret.style.transform = "rotate(180deg)";
    }
    function close() {
      panel.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
      if (caret) caret.style.transform = "rotate(0deg)";
    }
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = !panel.classList.contains("hidden");
      isOpen ? close() : open();
    });
    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  });

  // Mobile "Convert" accordion inside the mobile menu
  document.querySelectorAll("[data-mobile-dropdown-btn]").forEach(function (btn) {
    var panel = btn.parentElement.querySelector("[data-mobile-dropdown-panel]");
    var caret = btn.querySelector("[data-mobile-dropdown-caret]");
    if (!panel) return;
    btn.addEventListener("click", function () {
      var isHidden = panel.classList.contains("hidden");
      panel.classList.toggle("hidden");
      panel.classList.toggle("flex", isHidden);
      btn.setAttribute("aria-expanded", String(isHidden));
      if (caret) caret.style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)";
    });
  });

  // Active nav link
  var path = window.location.pathname;
  document.querySelectorAll("[data-nav] a[data-path]").forEach(function (a) {
    var target = a.getAttribute("data-path");
    var match = target === "/" ? path === "/" || path === "/index" : path.indexOf(target) === 0;
    if (match) {
      a.classList.add("text-ink", "font-semibold");
      a.classList.remove("text-inkmute");
      var dropdownWrap = a.closest("[data-dropdown]");
      if (dropdownWrap) {
        var dropdownBtn = dropdownWrap.querySelector("[data-dropdown-btn]");
        if (dropdownBtn) {
          dropdownBtn.classList.add("text-ink", "font-semibold");
          dropdownBtn.classList.remove("text-inkmute");
        }
      }
    }
  });

  // FAQ accordions
  document.querySelectorAll("[data-accordion-btn]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panel = btn.nextElementSibling;
      var icon = btn.querySelector("[data-accordion-icon]");
      var isOpen = panel.style.maxHeight && panel.style.maxHeight !== "0px";
      document.querySelectorAll("[data-accordion-panel]").forEach(function (p) {
        p.style.maxHeight = "0px";
      });
      document.querySelectorAll("[data-accordion-icon]").forEach(function (i) {
        i.style.transform = "rotate(0deg)";
      });
      if (!isOpen) {
        panel.style.maxHeight = panel.scrollHeight + "px";
        if (icon) icon.style.transform = "rotate(45deg)";
      }
    });
  });
})();
