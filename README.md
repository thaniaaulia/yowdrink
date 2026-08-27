# YowDrink — Website Minuman Kekinian Gen Z

Website satu halaman (full page), responsif & fluid, dibangun dengan HTML, CSS, dan JavaScript murni (tanpa framework/build-step), siap deploy langsung ke **GitHub Pages**.

## Struktur folder

```
yowdrink/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── data/
│   ├── videos.json      ← daftar video carousel (ID YouTube)
│   └── content.json     ← statistik, menu, opsi racik sendiri, fitur, galeri, testimoni, outlet, kontak
└── README.md
```

Semua data diambil dari file JSON di folder `data/` — untuk mengganti isi web cukup edit JSON, tidak perlu menyentuh HTML/JS.

## Video yang dipakai

Kedua link yang diberikan sudah valid dan langsung terpasang di `data/videos.json`:
- `Sn2P-y0BuDE`
- `722d3I_hUB4` (diambil ID-nya dari link radio/playlist YouTube yang diberikan)

Untuk menambah atau mengganti video, edit `data/videos.json`:
```json
{
  "id": "ID_VIDEO_YOUTUBE",
  "title": "Judul Video",
  "category": "Kategori",
  "description": "Deskripsi singkat."
}
```
`ID_VIDEO_YOUTUBE` adalah kode setelah `v=` pada URL biasa, contoh:
`https://www.youtube.com/watch?v=ABC12345XYZ` → id-nya `ABC12345XYZ`.

## Gambar yang dipakai

Semua foto memakai **Pexels** (hotlink gratis, bebas royalti untuk penggunaan komersial, tidak wajib atribusi) — foto asli bertema minuman kekinian, boba, kopi, dan nongkrong. Kode HTML/JS sudah dilengkapi fallback otomatis: jika suatu URL foto gagal dimuat, gambar akan otomatis diganti sementara dengan foto placeholder dari Lorem Picsum agar tampilan tidak rusak.

Untuk hasil terbaik, ganti foto-foto ini secara bertahap dengan foto produk asli YowDrink di `data/content.json` (bagian `menuCategories`, `gallery`) dan di `index.html` (bagian hero).

## Cara deploy ke GitHub Pages

1. Buat repository baru di GitHub, misalnya `yowdrink`.
2. Upload seluruh isi folder ini (bukan foldernya, tapi isinya) ke root repository tersebut.
3. Masuk ke **Settings → Pages**.
4. Pada **Source**, pilih branch `main` dan folder `/ (root)`, lalu **Save**.
5. Tunggu 1–2 menit, situs akan aktif di:
   `https://<username-github-anda>.github.io/yowdrink/`

## Menjalankan secara lokal

Karena JS memuat data lewat `fetch()`, membuka `index.html` langsung via klik dua kali (`file://`) bisa diblokir browser (CORS). Jalankan server lokal sederhana dari dalam folder ini:

```bash
python3 -m http.server 8000
```
lalu buka `http://localhost:8000`.

## Fitur yang sudah tersedia

- Hero dengan sticker harga & "struk mini" dekoratif, statistik dengan animasi angka berjalan.
- **Menu kekinian** bergaya kode kasir (TT-01, KP-02, dst) per kategori: Thai Tea, Kopi Kekinian, Boba Series, Mocktail — data-driven dari JSON.
- **Racik Sendiri** — fitur builder interaktif: pilih base minuman, topping, level gula, dan level es lewat slider; gelas SVG dan struk mini live-update sesuai pilihan, lengkap dengan total harga otomatis. Fitur ini murni JavaScript, tidak butuh backend.
- **Galeri video carousel** (data-driven dari JSON) dengan thumbnail asli YouTube, klik untuk putar di modal, tombol prev/next + dot navigasi + swipe di HP.
- Bagian "Kenapa YowDrink", galeri foto grid dengan lightbox, testimoni pelanggan.
- CTA order & daftar outlet di footer (dari JSON), tombol order via WhatsApp.
- Navigasi sticky dengan menu mobile (hamburger), tombol kembali ke atas, animasi scroll-reveal, mendukung `prefers-reduced-motion`.
- Desain fluid & responsif penuh dari layar kecil ke layar besar (murni CSS Grid/Flexbox, tanpa framework).

## Kustomisasi warna

Semua warna diatur lewat CSS variable di awal `css/style.css` (`:root`):
```css
--ivory: #FBF3E7;
--maroon-deep: #3D0F14;
--maroon: #7A1F2B;
--maroon-bright: #A8303E;
--caramel: #C98A3E; /* aksen kecil untuk tombol & harga */
```

## Kustomisasi nomor WhatsApp & outlet

Edit bagian `contact` dan `outlets` di `data/content.json` — nomor WhatsApp memakai format internasional tanpa tanda `+`, contoh `6281100000000`.
