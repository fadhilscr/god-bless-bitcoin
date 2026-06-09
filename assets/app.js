/* =========================================================================
   GOD BLESS BITCOIN — shared behaviours
   No framework, no backend. Read-progress persists in localStorage.
   ========================================================================= */
(function () {
  "use strict";

  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- site map (used to build the drawer + chapter nav everywhere) ---- */
  var CHAPTERS = [
    { n: "01", slug: "bab-1", t: "Genealogi Keruntuhan Moneter", s: "Debasement kuno → Nixon 1971" },
    { n: "02", slug: "bab-2", t: "Arsitektur Ketimpangan", s: "Inflasi & perbudakan utang" },
    { n: "03", slug: "bab-3", t: "Distopia Pengawasan Digital", s: "Ancaman CBDC" },
    { n: "04", slug: "bab-4", t: "Anatomi Kriptografi Bitcoin", s: "Cara kerja teknis" },
    { n: "05", slug: "bab-5", t: "Imperatif Hak Asasi Manusia", s: "Studi kasus global" },
    { n: "06", slug: "bab-6", t: "Kompleks Militer-Industri", s: "Mata uang perdamaian" },
    { n: "07", slug: "bab-7", t: "Konsonansi Teologis", s: "Perspektif 5 agama" },
    { n: "08", slug: "bab-8", t: "Cakrawala Masa Depan", s: "Bitcoinisasi" }
  ];
  var EXTRA = [
    { slug: "glosarium", t: "Glosarium", s: "28 istilah penting" },
    { slug: "timeline", t: "Timeline", s: "Sejarah moneter" },
    { slug: "tabel", t: "Tabel Perbandingan", s: "Fiat · CBDC · Bitcoin" },
    { slug: "kuis", t: "Kuis Interaktif", s: "16 soal pilihan ganda" },
    { slug: "faq", t: "FAQ", s: "Pertanyaan umum" }
  ];

  var STORE = "gbb_read_v1";
  function getRead() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; }
    catch (e) { return {}; }
  }
  function setRead(map) {
    try { localStorage.setItem(STORE, JSON.stringify(map)); } catch (e) {}
  }
  function readCount() {
    var m = getRead(), c = 0;
    CHAPTERS.forEach(function (ch) { if (m[ch.slug]) c++; });
    return c;
  }

  /* checkmark svg */
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>';

  /* --------------------------------------------------------- build DRAWER */
  function buildDrawer() {
    var page = document.body.getAttribute("data-page") || "";
    var read = getRead();

    var rows = "";
    rows += '<div class="drawer__group">Materi Inti · 8 Bab</div>';
    CHAPTERS.forEach(function (ch) {
      var active = page === ch.slug ? " is-active" : "";
      var done = read[ch.slug] ? " read" : "";
      rows += '<a class="drawer__item' + active + '" href="' + ch.slug + '.html">' +
                '<span class="drawer__num">' + ch.n + '</span>' +
                '<span class="drawer__txt"><b>' + ch.t + '</b><span>' + ch.s + '</span></span>' +
                '<span class="drawer__check' + done + '">' + CHECK + '</span>' +
              '</a>';
    });
    rows += '<div class="drawer__group">Referensi & Latihan</div>';
    EXTRA.forEach(function (ex) {
      var active = page === ex.slug ? " is-active" : "";
      rows += '<a class="drawer__item' + active + '" href="' + ex.slug + '.html">' +
                '<span class="drawer__num">›</span>' +
                '<span class="drawer__txt"><b>' + ex.t + '</b><span>' + ex.s + '</span></span>' +
              '</a>';
    });
    rows += '<div class="drawer__group">Situs Terkait</div>';
    rows += '<a class="drawer__item" href="https://bitcoin-standard-one.vercel.app" target="_blank" rel="noopener noreferrer">' +
              '<span class="drawer__num" style="color:var(--orange);font-size:1.1rem;line-height:1">&#x20BF;</span>' +
              '<span class="drawer__txt"><b>The Bitcoin Standard</b><span>Buku Saifedean Ammous &middot; Materi Pembelajaran</span></span>' +
              '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="flex:none;color:var(--text-faint)"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>' +
            '</a>';

    var pct = Math.round(readCount() / CHAPTERS.length * 100);
    var html =
      '<div class="drawer-scrim" id="scrim"></div>' +
      '<aside class="drawer" id="drawer" aria-label="Daftar materi">' +
        '<div class="drawer__head"><h3>Daftar Materi</h3>' +
          '<button class="drawer__close" id="drawerClose" aria-label="Tutup">' +
            '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
          '</button></div>' +
        '<div class="drawer__body">' +
          '<div class="drawer__meter"><div class="lbl"><span>Progres kursus</span><b>' + pct + '%</b></div>' +
            '<div class="bar"><i style="width:' + pct + '%"></i></div></div>' +
          rows +
        '</div>' +
      '</aside>';

    var holder = document.createElement("div");
    holder.innerHTML = html;
    document.body.appendChild(holder);

    var scrim = document.getElementById("scrim");
    var drawer = document.getElementById("drawer");
    function open() { scrim.classList.add("open"); drawer.classList.add("open"); document.body.style.overflow = "hidden"; }
    function close() { scrim.classList.remove("open"); drawer.classList.remove("open"); document.body.style.overflow = ""; }
    document.querySelectorAll("[data-open-menu]").forEach(function (b) { b.addEventListener("click", open); });
    document.getElementById("drawerClose").addEventListener("click", close);
    scrim.addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

    // reflect read pct into top-nav dot if present
    var navI = document.querySelector(".nav__dot i");
    var navB = document.querySelector(".nav__progress b");
    if (navI) navI.style.width = pct + "%";
    if (navB) navB.textContent = pct + "%";
  }

  /* ----------------------------------------------------- scroll progress */
  function scrollProgress() {
    var bar = document.querySelector(".scrollbar");
    if (!bar) return;
    function upd() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
      bar.style.width = (p * 100) + "%";
    }
    window.addEventListener("scroll", upd, { passive: true });
    upd();
  }

  /* --------------------------------- visibility helper (rect-based, robust)
     IntersectionObserver is unreliable in some embedded/iframe contexts, so we
     drive everything from a throttled scroll/resize check against the viewport. */
  var watchers = [];
  function registerWatch(el, onShow, ratio) {
    watchers.push({ el: el, onShow: onShow, ratio: ratio || 0 });
  }
  function inView(el, ratio) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.height === 0 && r.width === 0) return false;
    var visibleTop = Math.max(r.top, 0);
    var visibleBot = Math.min(r.bottom, vh);
    var shown = Math.max(0, visibleBot - visibleTop);
    var need = ratio ? Math.min(r.height, vh) * ratio : 1;
    return shown >= need && r.bottom > 0 && r.top < vh;
  }
  var watchScheduled = false;
  function runWatchers() {
    watchScheduled = false;
    for (var i = watchers.length - 1; i >= 0; i--) {
      var w = watchers[i];
      if (inView(w.el, w.ratio)) {
        w.onShow(w.el);
        watchers.splice(i, 1);
      }
    }
  }
  function scheduleWatch() {
    if (watchScheduled) return;
    watchScheduled = true;
    setTimeout(runWatchers, 16);
  }
  window.addEventListener("scroll", scheduleWatch, { passive: true });
  window.addEventListener("resize", scheduleWatch);
  // expose so dynamically-added content (landing grids) can hook in
  window.GBBwatch = registerWatch;
  window.GBBwatchKick = scheduleWatch;

  /* ------------------------------------------------------- reveal on scroll */
  function reveals() {
    var els = document.querySelectorAll("[data-reveal]");
    if (RM) { els.forEach(function (el) { el.classList.add("in"); }); return; }
    els.forEach(function (el) {
      registerWatch(el, function (e) { e.classList.add("in"); }, 0.05);
    });
  }

  /* ------------------------------------------------------------- count up */
  function countUp() {
    var els = document.querySelectorAll("[data-count]");
    if (!els.length) return;
    function run(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
      var dur = 1300, t0 = null;
      if (RM) { el.firstChild.nodeValue = fmt(target, dec); return; }
      // rAF can be throttled in background/offscreen frames; setTimeout keeps it ticking
      var raf = window.requestAnimationFrame || function (cb) { return setTimeout(function () { cb(Date.now()); }, 16); };
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var e = 1 - Math.pow(1 - p, 3);
        el.firstChild.nodeValue = fmt(target * e, dec);
        if (p < 1) raf(step);
        else el.firstChild.nodeValue = fmt(target, dec);
      }
      raf(step);
      // safety: guarantee final value even if frames never fire
      setTimeout(function () { el.firstChild.nodeValue = fmt(target, dec); }, dur + 200);
    }
    function fmt(v, dec) {
      return v.toLocaleString("id-ID", { minimumFractionDigits: dec, maximumFractionDigits: dec });
    }
    els.forEach(function (el) {
      // ensure a leading text node to mutate
      if (!el.firstChild || el.firstChild.nodeType !== 3) el.insertBefore(document.createTextNode("0"), el.firstChild);
      registerWatch(el, function (e) { run(e); }, 0.3);
    });
  }

  /* ------------------------------------------------------ hero ₿ glyphs */
  function heroGlyphs() {
    var box = document.querySelector(".hero__glyphs");
    if (!box || RM) return;
    var conf = [
      { x: 8,  y: 18, s: 130, d: 0,   dur: 13 },
      { x: 72, y: 26, s: 200, d: 2,   dur: 17 },
      { x: 30, y: 64, s: 96,  d: 1,   dur: 11 },
      { x: 86, y: 70, s: 150, d: 3.5, dur: 15 },
      { x: 54, y: 8,  s: 74,  d: 0.8, dur: 12 }
    ];
    conf.forEach(function (c) {
      var sp = document.createElement("span");
      sp.textContent = "₿";
      sp.style.left = c.x + "%";
      sp.style.top = c.y + "%";
      sp.style.fontSize = c.s + "px";
      sp.style.animation = "floatY " + c.dur + "s ease-in-out " + c.d + "s infinite";
      box.appendChild(sp);
    });
  }

  /* ------------------------------------------------- timeline line draw */
  function timeline() {
    var line = document.querySelector(".tl__line i");
    var items = document.querySelectorAll(".tl__item");
    if (!items.length) return;
    if (RM) {
      items.forEach(function (it) { it.classList.add("in"); });
    } else {
      items.forEach(function (it) {
        registerWatch(it, function (e) { e.classList.add("in"); }, 0.25);
      });
    }
    if (line) {
      var tl = document.querySelector(".tl");
      function draw() {
        var r = tl.getBoundingClientRect();
        var vh = window.innerHeight;
        var prog = (vh * 0.5 - r.top) / r.height;
        prog = Math.max(0, Math.min(1, prog));
        line.style.height = (prog * 100) + "%";
      }
      window.addEventListener("scroll", draw, { passive: true });
      window.addEventListener("resize", draw);
      draw();
    }
  }

  /* ------------------------------------------------------ glossary search */
  function glossary() {
    var input = document.getElementById("gloSearch");
    if (!input) return;
    var cards = Array.prototype.slice.call(document.querySelectorAll(".term"));
    var countEl = document.getElementById("gloCount");
    var empty = document.getElementById("gloEmpty");
    function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
    function apply() {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (card) {
        var term = card.getAttribute("data-term");
        var def = card.getAttribute("data-def");
        var hit = !q || term.indexOf(q) > -1 || def.indexOf(q) > -1;
        card.style.display = hit ? "" : "none";
        if (hit) shown++;
        // highlight
        var h3 = card.querySelector("h3"), p = card.querySelector("p");
        var rawT = card.getAttribute("data-rawterm"), rawD = card.getAttribute("data-rawdef");
        if (q && hit) {
          var re = new RegExp("(" + esc(q) + ")", "ig");
          h3.innerHTML = rawT.replace(re, "<mark>$1</mark>");
          p.innerHTML = rawD.replace(re, "<mark>$1</mark>");
        } else {
          h3.innerHTML = rawT; p.innerHTML = rawD;
        }
      });
      if (countEl) countEl.innerHTML = "<b>" + shown + "</b> / " + cards.length + " istilah";
      if (empty) empty.classList.toggle("show", shown === 0);
    }
    input.addEventListener("input", apply);
  }

  /* ------------------------------------------------ mark-as-read button */
  function markRead() {
    var btn = document.getElementById("markRead");
    if (!btn) return;
    var slug = btn.getAttribute("data-slug");
    var read = getRead();
    function paint() {
      var done = !!getRead()[slug];
      btn.classList.toggle("done", done);
      btn.querySelector(".label").textContent = done ? "Sudah dibaca" : "Tandai sudah dibaca";
    }
    paint();
    btn.addEventListener("click", function () {
      var m = getRead();
      if (m[slug]) delete m[slug]; else m[slug] = Date.now();
      setRead(m);
      paint();
    });
  }

  /* --------------------------------------------------------- focus mode */
  function focusMode() {
    var fab = document.getElementById("focusFab");
    if (!fab) return;
    var KEY = "gbb_focus";
    if (sessionStorage.getItem(KEY) === "1") document.body.classList.add("focus");
    function label() {
      fab.querySelector(".label").textContent = document.body.classList.contains("focus") ? "Mode fokus: aktif" : "Mode fokus";
    }
    label();
    fab.addEventListener("click", function () {
      document.body.classList.toggle("focus");
      try { sessionStorage.setItem(KEY, document.body.classList.contains("focus") ? "1" : "0"); } catch (e) {}
      label();
    });
  }

  /* ------------------------------------------------------------- init */
  document.addEventListener("DOMContentLoaded", function () {
    buildDrawer();
    scrollProgress();
    reveals();
    countUp();
    heroGlyphs();
    timeline();
    glossary();
    markRead();
    focusMode();
    scheduleWatch();
    // a couple of delayed kicks cover late layout/font shifts
    setTimeout(scheduleWatch, 120);
    setTimeout(scheduleWatch, 500);
  });

  // expose for the quiz page
  window.GBB = { CHAPTERS: CHAPTERS };
})();
