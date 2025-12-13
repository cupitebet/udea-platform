# START_HERE

Panduan ini menjelaskan cara membuat ulang aplikasi UDEA (Next.js + Supabase) sampai bisa dijalankan lokal. Repo ini kosong kecuali dokumentasi, jadi Anda perlu _membangun atau menyalin_ kode aplikasi terlebih dahulu.

## 0) Gambaran singkat
- **Target stack**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase.
- **Fitur inti**: auth & role (Member, Agent, SPV, Manager, Sponsor), 3 tier membership, referral & komisi 5%, kursus/basecamp, mock pembayaran siap Xendit, notifikasi admin, sertifikat BKSU.
- **Aksi utama**: buat kerangka Next.js, hubungkan ke Supabase, lalu isi halaman/endpoint sesuai daftar fitur.

## 1) Siapkan kerangka Next.js
```bash
npx create-next-app@latest udea-platform --typescript --tailwind --eslint --app
cd udea-platform
rm -rf .git          # opsional jika ingin memakai repo ini sebagai remote utama
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs lucide-react zustand
```

## 2) Buat file environment
Buat `.env.local` di root proyek (jangan commit) dengan kredensial Supabase Anda:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_SECRET=your_random_secret # jika memakai NextAuth
```

## 3) Skema Supabase (contoh minimum)
Di Supabase SQL editor, jalankan contoh tabel berikut untuk memulai. Sesuaikan sesuai kebutuhan (kolom tambahan dipersilakan):
```sql
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text not null check (role in ('member','agent','spv','manager','sponsor')),
  full_name text,
  created_at timestamptz default now()
);

create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  tier text not null check (tier in ('basic','exclusive','vip')),
  price integer not null,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references users(id),
  referred_email text not null,
  status text default 'pending',
  commission_pct numeric default 0.05,
  created_at timestamptz default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  amount integer not null,
  status text default 'pending',
  provider text default 'xendit-mock',
  metadata jsonb,
  created_at timestamptz default now()
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  level text,
  created_at timestamptz default now()
);

create table if not exists basecamps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  latitude numeric,
  longitude numeric,
  capacity integer,
  created_at timestamptz default now()
);

create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  sponsor_id uuid references users(id),
  recipient_name text not null,
  download_url text,
  created_at timestamptz default now()
);
```
Tambahkan RLS sesuai peran (mis. owner-only untuk data sensitif). Aktifkan OTP/Magic Link di Supabase auth.

## 4) Rangka dasar folder Next.js
Tambahkan struktur awal berikut:
```
app/
  layout.tsx
  page.tsx              # landing
  dashboard/page.tsx
  courses/page.tsx
  referrals/page.tsx
  basecamps/page.tsx
  certificates/page.tsx
  api/
    payments/route.ts   # mock endpoint siap Xendit
    basecamp/route.ts
    notifications/route.ts
    signup/route.ts
components/
  ui/...
lib/
  supabaseClient.ts
  auth.ts
```

## 5) Implementasi fitur (urutan saran)
1. **Auth & role**: gunakan `@supabase/auth-helpers-nextjs` di `middleware.ts` untuk proteksi dashboard.
2. **Membership**: simpan tier/expired di tabel `memberships`; buat komponen upgrade plan.
3. **Referral**: generate link/QR (pakai `qrcode` jika perlu), endpoint untuk mencatat referral + komisi 5% ke tabel `referrals`.
4. **Kursus & basecamp**: render daftar dari Supabase, form pendaftaran basecamp (lat/long + kapasitas).
5. **Pembayaran mock**: endpoint `api/payments` menerima payload, simpan ke `payments`, return status sukses; mudah disambung ke Xendit.
6. **Notifikasi**: di endpoint pembayaran/basecamp, panggil webhook bot Telegram (opsional) memakai `fetch` ke URL bot.
7. **Sertifikat BKSU**: halaman sponsor untuk membuat entri `certificates` dan menyediakan tautan unduhan (bisa mulai dari template PDF/static).

## 6) Jalankan & uji
```bash
npm run dev
# buka http://localhost:3000
```
Verifikasi alur: login/registrasi, upgrade plan, buat referral, daftar kursus/basecamp, coba mock pembayaran, dan unduh sertifikat.

## 7) Jika sudah punya kode di VS Code
Salin seluruh isi proyek (termasuk folder `app/`, `components/`, `lib/`, konfigurasi Tailwind) ke repo ini. Lalu:
```bash
npm install
npm run dev
```
Pastikan `.env.local` berisi kredensial Supabase yang benar. Commit perubahan setelah aplikasi berjalan.
