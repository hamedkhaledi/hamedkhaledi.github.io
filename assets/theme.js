(function () {
  var root = document.documentElement;
  var stored = localStorage.getItem("theme");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", stored || (prefersDark ? "dark" : "light"));

  window.applyTheme = function (theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    var current = root.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });
})();
