/* ============================================================
   Hamed Khademi Khaledi — Wing pages (Forge / Observatory)
   Vanilla JS: theme toggle, scene motes (sparks or stars),
   scroll reveals, scrollspy, footer year. No external calls.
   All effects respect reduced-motion. The scene element is
   detected by presence (.forge-sparks / .observatory-stars) so
   the same script serves both sub-themes.
   ============================================================ */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.remove("no-js");
  document.body.classList.add("js-loaded");

  var crest = document.querySelector(".wing-header .crest");
  if (crest) crest.classList.add("is-loaded");

  /* ---------- Illuminate each section: gold-leaf corner flourishes
     + a centered ornamental node, mirroring the entrance-hall book.
     Injected once so the markup of each wing stays identical. */
  var cornerSVG =
    '<svg viewBox="0 0 48 48" fill="none">' +
    '<path d="M4 44V8a4 4 0 0 1 4-4h36" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>' +
    '<path d="M10 42V14a4 4 0 0 1 4-4h24" stroke="currentColor" stroke-width="0.6" opacity="0.35"/>' +
    '<circle cx="12" cy="12" r="1.8" fill="currentColor" opacity="0.45"/>' +
    '<path d="M14 12c3 0 5-2 8-2s5 2 8 2" stroke="currentColor" stroke-width="0.6" opacity="0.4" fill="none"/>' +
    '<path d="M8 8l4 4" stroke="currentColor" stroke-width="0.5" opacity="0.3"/></svg>';
  var nodeSVG =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<path d="M12 2l2.4 6.8H22l-6 4.4 2.3 7-6.3-4.6L5.7 20l2.3-7-6-4.4h7.6Z" ' +
    'stroke="currentColor" stroke-width="1.1" stroke-linejoin="round" fill="currentColor" fill-opacity="0.12"/>' +
    '<circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>';
  Array.prototype.forEach.call(document.querySelectorAll(".shelf-section"), function (sec) {
    ["tl", "tr", "bl", "br"].forEach(function (pos) {
      var c = document.createElement("span");
      c.className = "corner corner-" + pos;
      c.setAttribute("aria-hidden", "true");
      c.innerHTML = cornerSVG;
      sec.insertBefore(c, sec.firstChild);
    });
    var head = sec.querySelector(".shelf-head");
    if (head) {
      var node = document.createElement("span");
      node.className = "leaf-node";
      node.setAttribute("aria-hidden", "true");
      node.innerHTML = nodeSVG;
      head.insertBefore(node, head.querySelector("h2"));
    }
  });

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

  /* ---------- Scene motes: forge sparks OR observatory stars ---------- */
  var forge = document.querySelector(".forge-sparks");
  var dome = document.querySelector(".observatory-stars");
  if (forge && !prefersReduced) {
    var fcount = isTouch ? 16 : 34;
    for (var i = 0; i < fcount; i++) {
      var s = document.createElement("span");
      s.className = "spark";
      var sz = 1.5 + Math.random() * 2.5;
      s.style.width = s.style.height = sz + "px";
      s.style.left = Math.random() * 100 + "vw";
      s.style.animationDuration = 9 + Math.random() * 11 + "s";
      s.style.animationDelay = -Math.random() * 20 + "s";
      s.style.opacity = 0.4 + Math.random() * 0.5;
      forge.appendChild(s);
    }
    /* Rare drifting comets across the forge sky. */
    var comets = document.querySelector(".forge-comets");
    if (comets && !isTouch) {
      for (var c = 0; c < 3; c++) {
        var cm = document.createElement("span");
        cm.className = "comet";
        cm.style.top = (10 + Math.random() * 50) + "vh";
        cm.style.left = (60 + Math.random() * 40) + "vw";
        cm.style.animationDuration = (14 + Math.random() * 10) + "s";
        cm.style.animationDelay = "-" + (Math.random() * 20) + "s";
        comets.appendChild(cm);
      }
    }
  } else if (dome && !prefersReduced) {
    var scount = isTouch ? 60 : 140;
    var starPts = [];
    for (var j = 0; j < scount; j++) {
      var st = document.createElement("span");
      st.className = "star";
      var ssz = 1 + Math.random() * 1.8;
      st.style.width = st.style.height = ssz + "px";
      var sx = Math.random() * 100, sy = Math.random() * 100;
      st.style.left = sx + "vw";
      st.style.top = sy + "vh";
      st.style.animationDuration = 2.5 + Math.random() * 4 + "s";
      st.style.animationDelay = -Math.random() * 6 + "s";
      st.style.opacity = 0.3 + Math.random() * 0.7;
      dome.appendChild(st);
      starPts.push([sx, sy]);
    }
    /* Faint constellation: connect a few nearby star pairs. */
    var constel = document.querySelector(".observatory-constellation");
    if (constel && !isTouch && "SVGElement" in window) {
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      var vw = window.innerWidth, vh = window.innerHeight;
      var pxPts = starPts.map(function (p) { return [p[0] / 100 * vw, p[1] / 100 * vh]; });
      var maxConn = 26;
      for (var p = 0; p < pxPts.length && maxConn > 0; p++) {
        for (var q = p + 1; q < pxPts.length; q++) {
          var dx = pxPts[p][0] - pxPts[q][0];
          var dy = pxPts[p][1] - pxPts[q][1];
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 70 && dist < 150) {
            var ln = document.createElementNS("http://www.w3.org/2000/svg", "line");
            ln.setAttribute("x1", pxPts[p][0]);
            ln.setAttribute("y1", pxPts[p][1]);
            ln.setAttribute("x2", pxPts[q][0]);
            ln.setAttribute("y2", pxPts[q][1]);
            if (q % 3 === 0) ln.style.animationDelay = -(Math.random() * 10) + "s";
            svg.appendChild(ln);
            if (--maxConn <= 0) break;
          }
        }
      }
      constel.appendChild(svg);
    }
    /* Rare bright shooting stars arcing across the scholar's dome. */
    if (!isTouch) {
      var shooters = 3;
      for (var sh = 0; sh < shooters; sh++) {
        var met = document.createElement("span");
        met.className = "shooting-star";
        met.style.top = (4 + Math.random() * 40) + "vh";
        met.style.left = (10 + Math.random() * 40) + "vw";
        met.style.animationDuration = (7 + Math.random() * 7) + "s";
        met.style.animationDelay = "-" + (Math.random() * 14) + "s";
        dome.appendChild(met);
      }
    }
  }

  /* ---------- Cursor glow (mirrors the main page candle glow) ---------- */
  var glow = document.querySelector(".wing-cursor-glow");
  if (glow && !prefersReduced && !isTouch) {
    var gx = window.innerWidth / 2, gy = window.innerHeight / 2, gtx = gx, gty = gy;
    window.addEventListener("pointermove", function (e) {
      gtx = e.clientX; gty = e.clientY;
      glow.style.opacity = "1";
    });
    window.addEventListener("pointerleave", function () { glow.style.opacity = "0"; });
    (function glowLoop() {
      gx += (gtx - gx) * 0.12; gy += (gty - gy) * 0.12;
      glow.style.transform = "translate(" + gx + "px," + gy + "px)";
      requestAnimationFrame(glowLoop);
    })();
  }

  /* ---------- Wand sigil trail: a small glowing rune follows the pointer,
      tinted to the wing's own accent. Touch / reduced-motion safe. ---------- */
  if (!prefersReduced && !isTouch) {
    var accentColor = isScholar ? "var(--teal)" : "var(--ember)";
    var wisp = document.createElement("span");
    wisp.className = "wand-sigil";
    wisp.setAttribute("aria-hidden", "true");
    wisp.style.color = accentColor;
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

  /* ---------- Floating rune field ---------- */
  var runeField = document.querySelector(".rune-field");
  if (runeField && !prefersReduced) {
    /* Scholar's Archive runes: crescent moon, star, constellation. */
    var scholarRunes = [
      '<svg viewBox="0 0 32 32" fill="none"><path d="M21 4a12 12 0 1 0 0 24 10 10 0 0 1 0-24Z" stroke="currentColor" stroke-width="1.4"/></svg>',
      '<svg viewBox="0 0 32 32" fill="none"><path d="M16 3v26M3 16h26M7 7l18 18M25 7L7 25" stroke="currentColor" stroke-width="1"/></svg>',
      '<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="3" fill="currentColor"/><path d="M16 5v5M16 22v5M5 16h5M22 16h5" stroke="currentColor" stroke-width="1.2"/></svg>',
      '<svg viewBox="0 0 32 32" fill="none"><path d="M6 10l10 4 10-4M16 14v14" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>',
      '<svg viewBox="0 0 32 32" fill="none"><path d="M16 5l4 9 9 4-9 4-4 9-4-9-9-4 9-4Z" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/></svg>'
    ];
    /* Engineer's Wing runes: anvil, hammer, ember, gear, bolt. */
    var forgeRunes = [
      '<svg viewBox="0 0 32 32" fill="none"><path d="M8 11h16l2 4H6Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M10 15v10h12V15" stroke="currentColor" stroke-width="1.3"/><path d="M14 15V7c0-1 .5-2 2-3" stroke="currentColor" stroke-width="1.1"/></svg>',
      '<svg viewBox="0 0 32 32" fill="none"><path d="M14 7l10-3-3 12-9 4Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M14 7v14" stroke="currentColor" stroke-width="1.3"/></svg>',
      '<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="5" fill="currentColor"/><circle cx="16" cy="16" r="11" stroke="currentColor" stroke-width="1.1" opacity="0.5"/></svg>',
      '<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="10" stroke="currentColor" stroke-width="1.3"/><circle cx="16" cy="16" r="3" fill="currentColor"/><path d="M16 6v4M16 22v4M6 16h4M22 16h4M9 9l3 3M20 20l3 3M23 9l-3 3M12 20l-3 3" stroke="currentColor" stroke-width="1.1"/></svg>',
      '<svg viewBox="0 0 32 32" fill="none"><path d="M18 3 8 18h7l-2 11 12-16h-7Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" fill="currentColor" fill-opacity="0.12"/></svg>'
    ];
    var isScholar = !!document.querySelector(".wing[data-wing=\"scholar\"]");
    var runeSet = isScholar ? scholarRunes : forgeRunes;
    var rcount = isTouch ? 6 : 12;
    for (var ri = 0; ri < rcount; ri++) {
      var rf = document.createElement("span");
      rf.className = "rune-float";
      rf.innerHTML = runeSet[Math.floor(Math.random() * runeSet.length)];
      var rsize = 14 + Math.random() * 18;
      rf.style.width = rf.style.height = rsize + "px";
      rf.style.left = Math.random() * 100 + "vw";
      rf.style.animationDuration = (22 + Math.random() * 20) + "s";
      rf.style.animationDelay = "-" + (Math.random() * 40) + "s";
      rf.style.opacity = (0.25 + Math.random() * 0.3).toFixed(2);
      runeField.appendChild(rf);
    }
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
    /* Page-turn flourish when flipping to a leaf via the TOC. */
    if (!prefersReduced) {
      tocLinks.forEach(function (link) {
        link.addEventListener("click", function () {
          var target = document.getElementById(link.getAttribute("href").slice(1));
          if (!target) return;
          target.classList.remove("is-turning");
          void target.offsetWidth; /* restart the animation */
          target.classList.add("is-turning");
        });
      });
    }
  }

  /* ---------- Pointer parallax: crisp tilt on cards (hover-capable only) ---------- */
  if (!prefersReduced && !isTouch) {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".entry.lit, .ledger .row"));
    var crestEl = document.querySelector(".wing-header .crest");
    var raf = null, px = 0, py = 0;
    window.addEventListener("pointermove", function (e) {
      px = (e.clientX / window.innerWidth - 0.5);
      py = (e.clientY / window.innerHeight - 0.5);
      if (!raf) raf = requestAnimationFrame(applyParallax);
    });
    function applyParallax() {
      raf = null;
      cards.forEach(function (card) {
        var r = card.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var cx = (r.left + r.width / 2);
        var cy = (r.top + r.height / 2);
        var lx = (px * window.innerWidth - cx) / window.innerWidth;
        var ly = (py * window.innerHeight - cy) / window.innerHeight;
        card.style.transform =
          "perspective(900px) rotateY(" + (lx * 3).toFixed(2) + "deg) rotateX(" + (-ly * 3).toFixed(2) + "deg) translateY(-2px)";
      });
      if (crestEl) {
        crestEl.style.transform = "translate(" + (px * 10).toFixed(1) + "px," + (py * 10).toFixed(1) + "px)";
      }
    }
    /* Reset transforms when the pointer leaves. */
    window.addEventListener("pointerleave", function () {
      cards.forEach(function (c) { c.style.transform = ""; });
      if (crestEl) crestEl.style.transform = "";
    });
  }

  /* ---------- Footer year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
