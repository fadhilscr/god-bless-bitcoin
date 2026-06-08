# God Bless Bitcoin — Website Pembelajaran Interaktif

Situs web statis (HTML/CSS/JS murni, tanpa framework & tanpa backend) berisi materi
pembelajaran lengkap berdasarkan film dokumenter *God Bless Bitcoin* (2024).

## Struktur

```
index.html        → Beranda / hero + daftar kurikulum
bab-1.html … bab-8.html → 8 bab materi inti
glosarium.html    → 28 istilah + pencarian langsung
timeline.html     → Garis waktu sejarah moneter
tabel.html        → Perbandingan Fiat vs CBDC vs Bitcoin
kuis.html         → 16 soal interaktif + skor
faq.html          → Tanya jawab + disclaimer
assets/
  styles.css      → Seluruh desain (dark mode, oranye Bitcoin)
  app.js          → Navigasi, progres baca, reveal, mode fokus
  quiz.js         → Mesin kuis
```

## Fitur
- **Progres kursus** — tombol "Tandai sudah dibaca" per bab, persen progres tersimpan di `localStorage`.
- **Mode fokus** — sembunyikan navigasi untuk membaca tanpa distraksi.
- **Kuis** — umpan balik benar/salah langsung + penjelasan, skor akhir, progres tersimpan.
- **Glosarium** — pencarian & sorot kata kunci secara langsung.
- Animasi reveal saat scroll, timeline yang menggambar, statistik count-up.

## Deploy ke Vercel
Situs ini 100% statis — tidak perlu build step.

1. Push folder ini ke repository GitHub.
2. Di Vercel: **Add New → Project → Import** repo tersebut.
3. Framework Preset: **Other** (atau "No Framework"). Build Command: kosongkan. Output Directory: `./` (root).
4. **Deploy.**

Atau via CLI:
```bash
npm i -g vercel
vercel
```

> Materi bersifat **edukatif**, memaparkan sudut pandang film. **Bukan nasihat keuangan/investasi.**
