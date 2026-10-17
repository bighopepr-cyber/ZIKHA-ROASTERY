# ZIKHA ROASTERY

Katalog kopi statis dengan Next.js App Router, konten Markdown, dan antarmuka berbahasa Indonesia.

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

## Deployment

Proyek dikonfigurasi untuk static export Next.js dan Vercel. Deploy output `out/` atau hubungkan repository ke Vercel agar build dijalankan saat push. Gambar katalog menggunakan URL gambar jarak jauh sehingga memerlukan koneksi internet.