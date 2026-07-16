/* ============================================================
   Hamed Khademi Khaledi — Arcane Library
   Vanilla JS: theme toggle, dust motes, candle cursor, shelf
   parallax, scroll reveals, scrollspy. No external API calls.
   All effects respect reduced-motion.
   ============================================================ */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.remove("no-js");
  document.body.classList.add("js-loaded");

  /* Open-book arrival: swing the tome open from the spine on load. */
  var book = document.querySelector(".book");
  if (book && !prefersReduced) {
    book.classList.add("is-opening");
    book.addEventListener("animationend", function () { book.classList.remove("is-opening"); }, { once: true });
  }

  /* Mark ornate wing crests as loaded so the one-time rise keyframe plays. */
  var crest = document.querySelector(".wing-header .crest");
  if (crest) crest.classList.add("is-loaded");

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ---------- Theme toggle ---------- */
  var stored = localStorage.getItem("theme");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", stored || root.getAttribute("data-default-theme") || (prefersDark ? "dark" : "light"));

  window.applyTheme = function (theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    var cur = root.getAttribute("data-theme");
    applyTheme(cur === "dark" ? "light" : "dark");
  });

  /* ---------- Dust motes ---------- */
  var dust = document.querySelector(".dust");
  if (dust && !prefersReduced) {
    var count = isTouch ? 14 : 30;
    for (var i = 0; i < count; i++) {
      var m = document.createElement("span");
      m.className = "mote";
      var size = 1.5 + Math.random() * 2.5;
      m.style.width = m.style.height = size + "px";
      m.style.left = Math.random() * 100 + "vw";
      m.style.top = Math.random() * 100 + "vh";
      m.style.animationDuration = 14 + Math.random() * 16 + "s";
      m.style.animationDelay = -Math.random() * 24 + "s";
      m.style.opacity = 0.3 + Math.random() * 0.5;
      dust.appendChild(m);
    }
  }

  /* ---------- Candle cursor glow ---------- */
  var candle = document.querySelector(".candle-glow");
  if (candle && !prefersReduced && !isTouch) {
    var cx = window.innerWidth / 2, cy = window.innerHeight / 2, tx = cx, ty = cy;
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
      candle.style.opacity = "1";
    });
    window.addEventListener("pointerleave", function () { candle.style.opacity = "0"; });
    (function loop() {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      candle.style.transform = "translate(" + cx + "px," + cy + "px)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Wand sigil trail: a small glowing rune follows the pointer,
      leaving a fading arcane wisp. Touch / reduced-motion safe. ---------- */
  if (!prefersReduced && !isTouch) {
    var wisp = document.createElement("span");
    wisp.className = "wand-sigil";
    wisp.setAttribute("aria-hidden", "true");
    wisp.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.5L12 17.2 6 21.6l2.4-7.5L2 9.6h7.6Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" fill="currentColor" fill-opacity="0.14"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/></svg>';
    document.body.appendChild(wisp);
    var wx = window.innerWidth / 2, wy = window.innerHeight / 2, wtx = wx, wty = wy;
    window.addEventListener("pointermove", function (e) {
      wtx = e.clientX; wty = e.clientY;
      wisp.style.opacity = "0.9";
    });
    window.addEventListener("pointerleave", function () { wisp.style.opacity = "0"; });
    (function wispLoop() {
      wx += (wtx - wx) * 0.18; wy += (wty - wy) * 0.18;
      wisp.style.transform = "translate(" + (wx - 12) + "px," + (wy - 12) + "px) rotate(" + (wx * 0.05) + "deg)";
      requestAnimationFrame(wispLoop);
    })();
  }

  /* ---------- Shelf parallax (subtle) ---------- */
  var scene = document.querySelector(".shelves");
  if (scene && !prefersReduced && !isTouch) {
    window.addEventListener("pointermove", function (e) {
      var dx = (e.clientX / window.innerWidth - 0.5) * 14;
      var dy = (e.clientY / window.innerHeight - 0.5) * 10;
      scene.style.transform = "translate(" + dx + "px," + dy + "px)";
    });
  }

  /* ---------- Scroll reveals ---------- */
  var revealEls = document.querySelectorAll(".reveal, .stagger");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Scrollspy TOC ---------- */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
  if (tocLinks.length) {
    var secs = tocLinks
      .map(function (l) { return document.getElementById(l.getAttribute("href").slice(1)); })
      .filter(Boolean);
    if ("IntersectionObserver" in window && secs.length) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            var id = en.target.id;
            tocLinks.forEach(function (l) {
              l.classList.toggle("active", l.getAttribute("href") === "#" + id);
            });
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
      secs.forEach(function (s) { spy.observe(s); });
    }
  }

  /* ---------- Footer year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
