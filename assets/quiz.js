/* =========================================================================
   God Bless Bitcoin — Quiz engine
   Per-question: pick → instant feedback (benar/salah + jawaban benar) → next.
   Score ring at the end. Progress persists in localStorage.
   ========================================================================= */
(function () {
  "use strict";

  var QUESTIONS = [
    { bab: 1, q: "Apa motivasi utama Presiden Nixon melepas dolar dari standar emas pada 1971?",
      o: ["Mendorong ekspor", "Membiayai Perang Vietnam", "Melawan resesi global", "Menstabilkan harga emas"], a: 1,
      e: "Nixon menangguhkan konvertibilitas emas demi mencetak uang tanpa batas untuk membiayai Perang Vietnam yang mahal." },
    { bab: 1, q: "Istilah “sound money” berasal dari…",
      o: ["Nama seorang ekonom", "Suara koin murni saat diuji", "Singkatan teknis perbankan", "Bahasa Latin untuk emas"], a: 1,
      e: "Koin emas murni menghasilkan resonansi (suara) khas saat dijatuhkan — dari sinilah istilah “sound money” lahir." },
    { bab: 2, q: "Berapa persen inflasi dunia yang menurut film tergolong inflasi moneter?",
      o: ["50%", "75%", "98%", "100%"], a: 2,
      e: "Film menegaskan ~98% inflasi adalah moneter — buatan manusia lewat ekspansi pasokan uang, bukan kelangkaan alami." },
    { bab: 2, q: "Apa yang dimaksud “Cantillon effect”?",
      o: ["Pajak progresif", "Keuntungan pihak terdekat dengan uang baru", "Teori deflasi", "Efek suku bunga negatif"], a: 1,
      e: "Cantillon effect: pihak yang paling dekat dengan sumber uang baru menikmati keuntungan sebelum harga naik." },
    { bab: 3, q: "Fitur CBDC yang paling mengancam menurut film adalah…",
      o: ["Kecepatan transaksi", "Biaya rendah", "Programmability", "Desain antarmuka"], a: 2,
      e: "Programmability memungkinkan negara membatasi apa, di mana, dan kapan uang boleh dibelanjakan secara algoritmik." },
    { bab: 3, q: "Dalam skenario utopia film, bagaimana warga Taiwan menyelamatkan kekayaan?",
      o: ["Emas batangan", "Seed phrase Bitcoin yang dihafal", "Rekening luar negeri", "Properti"], a: 1,
      e: "Kekayaan tersimpan dalam seed phrase yang dihafal — tak bisa disita penjaga perbatasan saat mengungsi." },
    { bab: 4, q: "Masalah komputer apa yang dipecahkan blockchain Bitcoin?",
      o: ["Overflow memori", "Double-spend problem", "Enkripsi password", "Kompresi data"], a: 1,
      e: "Blockchain memecahkan double-spend — mencegah satu unit uang digital disalin & dibelanjakan dua kali — tanpa otoritas pusat." },
    { bab: 4, q: "Berapa batas mutlak pasokan Bitcoin?",
      o: ["1 juta", "21 juta", "100 juta", "Tak terbatas"], a: 1,
      e: "Maksimum 21 juta koin — batas matematis yang tak bisa diubah siapa pun, bahkan pencipta Bitcoin." },
    { bab: 5, q: "Berapa perkiraan persentase populasi global tanpa akses perbankan?",
      o: ["10%", "25%", "~50%", "75%"], a: 2,
      e: "Hampir 50% populasi global tidak punya akses perbankan tradisional — terkunci dari ekonomi formal." },
    { bab: 5, q: "Peristiwa di Kanada yang dikutip film sebagai ‘weaponization’ perbankan adalah…",
      o: ["Krisis perumahan", "Trucker Protests", "Pemilu federal", "Reformasi pajak"], a: 1,
      e: "Selama Canadian Trucker Protests, rekening pengemudi truk dibekukan tanpa due process — contoh persenjataan perbankan di negara demokrasi." },
    { bab: 6, q: "Mengapa Bitcoin disebut “mata uang perdamaian”?",
      o: ["Logonya simbol damai", "Membuat perang terlalu mahal & transparan", "Dilarang untuk militer", "Hanya dipakai LSM"], a: 1,
      e: "Tanpa kemampuan mencetak uang, perang harus didanai transparan lewat pajak — dan rakyat jarang menyetujuinya." },
    { bab: 6, q: "Bagaimana biaya perang disembunyikan dalam sistem fiat?",
      o: ["Lewat pajak eksplisit", "Lewat inflasi (pajak siluman)", "Lewat utang luar negeri saja", "Tidak disembunyikan"], a: 1,
      e: "Biaya perang disamarkan sebagai inflasi — pajak siluman yang mendevaluasi tabungan kelas menengah & bawah." },
    { bab: 7, q: "Konsep Yahudi ‘shalshelet’ dianalogikan film dengan…",
      o: ["Kunci privat", "Blockchain", "Satoshi", "Node"], a: 1,
      e: "Shalshelet (rantai transmisi tradisi tak terputus) identik konseptual dengan blockchain yang menautkan setiap blok ke riwayatnya." },
    { bab: 7, q: "Prinsip Buddhis ‘jangan percaya, verifikasi’ sejalan dengan…",
      o: ["KYC", "Konsensus proof-of-work", "Price-fixing", "Inflasi target"], a: 1,
      e: "“Don’t trust, verify” mencerminkan konsensus proof-of-work: tiap peserta memvalidasi sendiri, bukan percaya otoritas." },
    { bab: 8, q: "Apa itu ‘Bitcoinisasi’?",
      o: ["Menambang Bitcoin", "Transisi global fiat → standar Bitcoin", "Regulasi kripto", "Pajak Bitcoin"], a: 1,
      e: "Bitcoinisasi = proyeksi transisi di mana fiat runtuh dan Bitcoin menjadi standar moneter global yang dominan." },
    { bab: 8, q: "Siklus sejarah yang dijelaskan film adalah…",
      o: ["Lahir-tumbuh-mati", "Kebebasan-Penindasan-Revolusi", "Boom-bust", "Inflasi-deflasi"], a: 1,
      e: "Film menutup dengan siklus: Kebebasan → Penindasan → Revolusi → kembali ke Kebebasan." },
  ];

  var KEY = "gbb_quiz_v1";
  var state = { i: 0, answered: [], score: 0 };
  try {
    var saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && saved.answered && saved.answered.length === QUESTIONS.length) state = saved;
  } catch (e) {}

  var root = document.getElementById("quizRoot");
  var LETTERS = ["A", "B", "C", "D"];
  var TICK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>';
  var CROSS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  function meter() {
    var done = state.answered.filter(function (x) { return x != null; }).length;
    return '<span class="quiz-meter">Terjawab <b>' + done + '</b> / ' + QUESTIONS.length +
           ' · Skor <b>' + state.score + '</b></span>';
  }

  function renderQuestion() {
    var idx = state.i;
    var Q = QUESTIONS[idx];
    var picked = state.answered[idx]; // null/undefined = unanswered, else index
    var locked = picked != null;

    var opts = Q.o.map(function (text, oi) {
      var cls = "opt";
      var mark = "";
      if (locked) {
        if (oi === Q.a) { cls += " correct"; mark = TICK; }
        else if (oi === picked) { cls += " wrong"; mark = CROSS; }
        else cls += " dim";
      }
      return '<button class="' + cls + '" data-opt="' + oi + '"' + (locked ? " disabled" : "") + '>' +
               '<span class="opt__key">' + LETTERS[oi] + '</span>' +
               '<span class="opt__txt">' + text + '</span>' +
               '<span class="opt__mark">' + mark + '</span>' +
             '</button>';
    }).join("");

    var expl = locked
      ? '<div class="qexpl show"><b>' + (picked === Q.a ? "Benar ✓" : "Belum tepat") + '</b>' + Q.e + '</div>'
      : '<div class="qexpl"></div>';

    var prevDis = idx === 0 ? " disabled" : "";
    var isLast = idx === QUESTIONS.length - 1;
    var nextLabel = isLast ? "Lihat Hasil" : "Soal Berikutnya ›";
    var nextDis = locked ? "" : " disabled";

    root.innerHTML =
      '<div class="quiz-head">' +
        '<div class="quiz-filter"><span class="chip is-active">Bab ' + Q.bab + '</span></div>' +
        meter() +
      '</div>' +
      '<div class="qcard" data-reveal>' +
        '<div class="qcard__top">' +
          '<span class="qcard__badge">BAB ' + Q.bab + '</span>' +
          '<span class="qcard__count mono">Soal ' + (idx + 1) + ' / ' + QUESTIONS.length + '</span>' +
        '</div>' +
        '<h2 class="qcard__q">' + Q.q + '</h2>' +
        '<div class="opts">' + opts + '</div>' +
        expl +
      '</div>' +
      '<div class="quiz-nav">' +
        '<button class="btn btn--ghost" id="qPrev"' + prevDis + '>‹ Sebelumnya</button>' +
        '<button class="btn btn--primary" id="qNext"' + nextDis + '>' + nextLabel + '</button>' +
      '</div>';

    root.querySelectorAll(".opt").forEach(function (b) {
      b.addEventListener("click", function () {
        if (state.answered[idx] != null) return;
        var oi = parseInt(b.getAttribute("data-opt"), 10);
        state.answered[idx] = oi;
        if (oi === Q.a) state.score++;
        save();
        renderQuestion();
      });
    });
    document.getElementById("qPrev").addEventListener("click", function () {
      if (state.i > 0) { state.i--; save(); renderQuestion(); }
    });
    document.getElementById("qNext").addEventListener("click", function () {
      if (state.answered[idx] == null) return;
      if (isLast) { renderResult(); }
      else { state.i++; save(); renderQuestion(); }
    });

    var el = root.querySelector("[data-reveal]");
    if (window.GBBwatch) { window.GBBwatch(el, function (e) { e.classList.add("in"); }, 0); window.GBBwatchKick(); }
    else el.classList.add("in");
  }

  function renderResult() {
    var total = QUESTIONS.length;
    var score = state.score;
    var pct = Math.round(score / total * 100);
    var verdict, sub;
    if (pct >= 85) { verdict = "Luar Biasa!"; sub = "Pemahaman Anda terhadap argumen film sangat solid. Saatnya berbagi diskusi."; }
    else if (pct >= 60) { verdict = "Bagus!"; sub = "Fondasi Anda kuat. Tinjau ulang bab yang masih terasa kabur untuk menyempurnakan."; }
    else { verdict = "Terus Belajar"; sub = "Beberapa konsep inti masih perlu diperdalam. Coba baca ulang bab terkait, lalu ulangi kuis."; }

    var R = 78, C = 2 * Math.PI * R, off = C * (1 - pct / 100);

    root.innerHTML =
      '<div class="result" data-reveal>' +
        '<div class="ring">' +
          '<svg viewBox="0 0 180 180">' +
            '<circle cx="90" cy="90" r="' + R + '" fill="none" stroke="#26231f" stroke-width="12"/>' +
            '<circle cx="90" cy="90" r="' + R + '" fill="none" stroke="#F7931A" stroke-width="12" stroke-linecap="round" ' +
              'stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '" id="ringFill"/>' +
          '</svg>' +
          '<div class="val">' + pct + '%</div>' +
        '</div>' +
        '<h2>' + verdict + '</h2>' +
        '<p class="score-line mono">Skor akhir: ' + score + ' / ' + total + ' benar</p>' +
        '<p>' + sub + '</p>' +
        '<div class="hero__cta" style="justify-content:center;margin-top:30px">' +
          '<button class="btn btn--primary" id="qRetry">Ulangi Kuis</button>' +
          '<a class="btn btn--ghost" href="bab-1.html">Tinjau Materi</a>' +
        '</div>' +
      '</div>';

    var el = root.querySelector("[data-reveal]");
    if (window.GBBwatch) { window.GBBwatch(el, function (e) { e.classList.add("in"); }, 0); window.GBBwatchKick(); }
    else el.classList.add("in");

    setTimeout(function () {
      var ring = document.getElementById("ringFill");
      if (ring) ring.style.transition = "stroke-dashoffset 1.1s cubic-bezier(.2,.7,.2,1)", ring.style.strokeDashoffset = off;
    }, 200);

    document.getElementById("qRetry").addEventListener("click", function () {
      state = { i: 0, answered: [], score: 0 };
      save();
      renderQuestion();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!root) return;
    var allDone = state.answered.length === QUESTIONS.length &&
                  state.answered.every(function (x) { return x != null; });
    if (allDone && state.i >= QUESTIONS.length - 1) renderResult();
    else renderQuestion();
  });
})();
