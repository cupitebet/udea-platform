# TODO UDEA Platform

Daftar tugas prioritas untuk mulai membangun aplikasi (urut disarankan). Tandai setelah selesai dan update `STATUS.md` bila ada kemajuan.

## Tahap 1 — Bootstrap kode
- [ ] Inisialisasi Next.js 14 App Router (TypeScript, Tailwind, ESLint): `npx create-next-app@latest udea-platform --typescript --tailwind --eslint --app`.
- [ ] Tambahkan skrip dasar lint/test di `package.json` (mis. `lint`, `test` placeholder).
- [ ] Commit kerangka awal ke repo ini.

## Tahap 2 — Konfigurasi & lingkungan
- [ ] Buat `.env.local` mengikuti template di `START_HERE.md` (Supabase URL/keys, secret).
- [ ] Tambah `lib/supabaseClient.ts` dan helper auth (middleware proteksi dashboard).
- [ ] Buat konfigurasi Tailwind (warna brand UDEA, font, komponen utilitas).

## Tahap 3 — Database Supabase
- [ ] Jalankan skema contoh di Supabase SQL editor (tabel users, memberships, referrals, payments, courses, basecamps, certificates).
- [ ] Aktifkan RLS dan policy per peran (Member, Agent, SPV, Manager, Sponsor).
- [ ] Siapkan seed minimal (1 admin/manager, 1 sponsor, 1 member) untuk uji lokal.

## Tahap 4 — Fitur minimum
- [ ] Landing page + auth (login/magic link) dengan kartu ringkasan membership.
- [ ] Dashboard protected: data user, saldo komisi, hitung referral.
- [ ] Referral link + QR + endpoint pencatatan komisi 5%.
- [ ] Kursus & basecamp: daftar dari Supabase, form daftar basecamp (lat/long, kapasitas).
- [ ] Pembayaran mock `api/payments` siap disambungkan ke Xendit.
- [ ] Notifikasi (opsional) ke Telegram di alur pembayaran/basecamp.
- [ ] Sertifikat BKSU untuk sponsor (buat/unduh entri certificates).

## Tahap 5 — QA & rilis
- [ ] Tambah lint/prettier CI (GitHub Actions) dan uji minimal.
- [ ] Uji manual alur utama (`npm run dev`), catat hasil di `STATUS.md`.
- [ ] Siapkan dokumen deploy (Vercel/Supabase) setelah alur dasar stabil.
