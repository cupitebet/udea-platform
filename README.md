# UDEA Platform

Saat ini repo hanya berisi berkas README tanpa kode aplikasi. Dokumen ini merangkum kondisi terbaru dan langkah konkret supaya platform UDEA dapat dijalankan sesuai rangkuman fitur yang pernah disebutkan (Next.js 14, TypeScript, Tailwind, Supabase, dsb.).

## Status singkat
- **Kode aplikasi belum ada di repo**: halaman, API, basis data, dan konfigurasi lain yang disebutkan belum tersedia di pohon sumber ini.
- **Struktur yang perlu dibuat**: proyek Next.js 14 App Router dengan TypeScript, Tailwind CSS, dan integrasi Supabase (auth + database).
- **Langkah terperinci ada di `START_HERE.md`**: ikuti panduan tersebut untuk menyiapkan ulang aplikasi dari awal (atau menyalin kode yang sudah ada di VS Code ke repo ini).
- **Ringkasan status terbaru**: lihat `STATUS.md` untuk laporan kemajuan paling mutakhir dan langkah yang direkomendasikan.
- **Daftar pekerjaan berikutnya**: cek `TODO.md` untuk urutan tugas membangun aplikasi dari kerangka hingga rilis.

## Langkah untuk menyiapkan proyek (ringkasan)
Panduan cepat ada di bawah; versi lebih rinci (termasuk checklist) ada di `START_HERE.md`.

1. **Inisialisasi proyek Next.js**
   - `npx create-next-app@latest udea-platform --typescript --tailwind --eslint --app`
   - Hapus `.git` bawaan (`rm -rf .git`) bila ingin memakai repo ini sebagai remote utama.
2. **Pasang dependensi produk**
   - `npm install @supabase/supabase-js @supabase/auth-helpers-nextjs lucide-react zustand` (atau state manager pilihan).
3. **Konfigurasi Tailwind & UI dasar**
   - Atur `tailwind.config.ts` sesuai identitas UDEA; buat komponen global (navbar, kartu, tombol, dashboard widgets).
4. **Setel Supabase**
   - Aktifkan Email OTP/Magic Link; buat tabel `users`, `memberships`, `referrals`, `payments`, `basecamps`, `courses`, `certificates` plus RLS per peran (Member, Agent, SPV, Manager, Sponsor).
   - Isi `.env.local` dengan URL/keys Supabase (lihat contoh di `START_HERE.md`).
5. **Implementasi fitur**
   - Auth & peran, membership tier, referral & komisi 5%, kursus/basecamp, mock pembayaran siap Xendit, notifikasi admin, sertifikat BKSU.
6. **Uji lokal**
   - `npm run dev` lalu cek alur login, upgrade membership, referral, pendaftaran kursus/basecamp, dan unduhan sertifikat.

## Catatan
Jika Anda sebelumnya memiliki kode lengkap di VS Code, salin seluruh struktur proyek (termasuk `app/`, `components/`, `lib/`, `supabase/`) ke repo ini lalu jalankan langkah konfigurasi Supabase dan environment di atas. Setelah tersalin, lakukan `npm install` dan `npm run dev` untuk memastikan semuanya berjalan.
