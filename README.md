# ZIKHA ROASTERY

Katalog kopi statis dengan Next.js App Router, konten Markdown, dan antarmuka Bahasa Indonesia/Inggris.

## Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`. Periksa tipe dengan `npm run lint`, dan hasilkan situs static export dengan `npm run build` atau `npm run export`. Berkas deploy berada di `out/`.

## Mengelola konten

- Ubah kontak, jam operasional, dan SEO di `content/config.md`.
- Ubah cerita dan nilai roastery di `content/about.md`.
- Ubah harga/profil jasa roasting di `content/services.md`.
- Ubah daftar kopi di `content/products/light-roast.md`, `medium-roast.md`, dan `dark-roast.md`.
- Tambah atau ubah artikel di `content/articles.md`.

Setiap berkas memakai YAML frontmatter. Perubahan konten akan masuk ke situs setelah rebuild. Checkout adalah simulasi yang merangkum pesanan dan meneruskannya ke WhatsApp; newsletter membuka draf email di aplikasi pengguna, belum menyimpan pendaftar ke layanan mailing list.

Artikel dapat menyertakan video YouTube dengan properti opsional `youtubeUrl` di item `articles` pada `content/articles.md`:

```yaml
- category: BREW GUIDE
	title: Contoh artikel seduh
	date: '17 OKTOBER 2026'
	image: https://example.com/coffee.jpg
	youtubeUrl: https://www.youtube.com/watch?v=VIDEO_ID_HERE
	body: Isi artikel dalam Markdown.
```

URL `youtube.com`, `youtu.be`, dan link Shorts didukung. Pemutar muncul di detail artikel hanya jika URL memiliki host YouTube dan ID video yang valid.

## Deployment

Proyek dikonfigurasi untuk static export Next.js dan Vercel. Hubungkan repository ke Vercel dengan Framework Preset `Next.js` dan build command `npm run build`; jangan set Output Directory ke `out`, karena integrasi Next.js memerlukan manifest build dari `.next/`. Folder `out/` tetap dihasilkan dan dapat diunggah ke penyedia hosting statis non-Vercel. Gambar katalog menggunakan URL gambar jarak jauh sehingga memerlukan koneksi internet.