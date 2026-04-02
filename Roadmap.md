# Roadmap 30 Hari: Next.js Fullstack Developer (App Router) + Project Inventory (FIFO)

Target: dalam 30 hari kamu punya 1 aplikasi fullstack yang rapi (auth, database, dashboard, deployment), plus fondasi yang cukup untuk lanjut bikin project lain tanpa bingung.

Stack yang dipakai (sesuai pilihan kamu): Next.js (App Router) + TypeScript + Tailwind CSS + PostgreSQL + Prisma + Auth.js/NextAuth (session-based) + Zod + React Hook Form + Testing dasar + Deploy Vercel.

Catatan penting:
- Prisma jalan di Node.js runtime (bukan Edge). Route yang akses database jangan diset ke Edge runtime.
- Saat deploy ke serverless, pastikan database provider punya connection pooling, atau kamu bisa kena error “too many connections”.
- Aturan domain inventory (yang kita pakai): stok tidak boleh negatif, semua pengurangan stok selalu FIFO costing, transfer memindahkan cost apa adanya, qty integer, single currency.

## Aturan Main (biar cepat naik level)

- Setiap hari: 60–120 menit fokus + 15 menit catatan.
- Selalu bikin “output”: commit kecil, halaman baru, endpoint baru, atau fitur yang jalan.
- Minimal 1 project yang benar-benar dideploy.

## Project Utama (dibangun bertahap): Inventory Stock + FIFO

Kita akan bikin “StockFlow” (contoh): aplikasi inventory yang punya fitur:
- Master data: product (SKU, nama, unit), warehouse (gudang)
- Pembelian (stock-in): menambah stok + membuat layer FIFO (qtyRemaining, unitCost, receivedAt)
- Penjualan (stock-out): selalu konsumsi layer FIFO untuk COGS, stok tidak boleh negatif
- Transfer antar gudang: konsumsi FIFO di gudang asal, membuat layer baru di gudang tujuan dengan cost yang sama
- Stock adjustment: adjustment-in membuat layer baru, adjustment-out konsumsi FIFO (dan tetap tidak boleh negatif)
- Stock card / audit trail: riwayat per product per warehouse
- Dashboard sederhana + deployment + env vars + migration database

---

## Minggu 1 (Hari 1–7): Fondasi React + Next.js

### Hari 1: Setup & workflow
- Install Node LTS, pilih package manager (pnpm/npm/yarn).
- Buat repo Next.js + TypeScript.
- Setup linting minimal, format (kalau repo sudah punya, ikut saja).
- Output: halaman home rapi + navigasi dasar.

### Hari 2: TypeScript yang kepakai di Next.js
- Type untuk props, union, narrowing, generics sederhana.
- Type untuk data dari database/API.
- Output: komponen UI kecil dengan props typed.

### Hari 3: React fundamentals (yang sering dipakai)
- State, effect, event handling, controlled inputs.
- Derived state vs state beneran.
- Output: halaman “Playground” (counter, form input, list render).

### Hari 4: Next.js App Router: routing & layout
- `app/` structure, `layout.tsx`, `page.tsx`, nested route.
- `Link`, `not-found.tsx`, metadata dasar.
- Output: routing `/`, `/products`, `/warehouses`, `/dashboard` (placeholder).

### Hari 5: Server vs Client Components
- Kapan perlu `"use client"`.
- Passing props dari server ke client.
- Output: halaman server render + widget client (misal theme toggle).

### Hari 6: Styling cepat dengan Tailwind (atau CSS Modules)
- Setup Tailwind, design tokens sederhana (warna, spacing).
- Layout dasar: navbar + container + card + button.
- Output: komponen UI dasar (`Button`, `Input`, `Card`).

### Hari 7: Git workflow + struktur project
- Struktur folder: `app/`, `components/`, `lib/`, `db/` (atau `prisma/`).
- Buat README singkat (cara run).
- Output: repo rapi + struktur siap untuk fitur.

---

## Minggu 2 (Hari 8–14): Database, Master Data, dan Stock Overview

### Hari 8: Fetching di Server + loading/error UI
- `fetch` di server component, `loading.tsx`, `error.tsx`.
- Output: halaman yang render data dummy + skeleton loading.

### Hari 9: Route Handlers (API) dasar
- Buat `GET/POST` sederhana (JSON).
- Status code, error response konsisten.
- Output: endpoint `/api/health` + `/api/products` (dummy).

### Hari 10: Validasi input dengan Zod
- Schema untuk create/update product dan warehouse.
- Validasi di server (Route Handler) dan mapping error.
- Output: endpoint menolak payload invalid dengan error yang rapi.

### Hari 11: Forms di client
- React Hook Form + integrasi Zod resolver.
- Integrasi submit ke API, tampilkan error.
- Output: halaman “New Product” yang benar-benar membuat product.

### Hari 12: Database setup (PostgreSQL) + Prisma
- Setup Prisma + schema awal inventory: `Product`, `Warehouse`, `StockLayer`.
- Tambah schema transaksi: `InventoryTx`, `InventoryTxLine`, `FifoConsumption`.
- Siapkan tabel auth untuk NextAuth (biasanya: `Account`, `Session`, `VerificationToken`) lewat Prisma Adapter.
- Migration pertama + seed minimal (opsional).
- Output: bisa `create/read` product & warehouse dari database, dan siap dipakai auth.

### Hari 13: CRUD Master Data end-to-end
- CRUD `Product` dan `Warehouse`.
- Output: halaman `/products` dan `/warehouses` lengkap.

### Hari 14: Stock Overview (tanpa transaksi dulu)
- Halaman “Stock Overview” per gudang: daftar product + qty on-hand (hasil agregasi `StockLayer.qtyRemaining`).
- Output: kamu bisa lihat stok per gudang (awal masih 0).

---

## Minggu 3 (Hari 15–21): Auth, Pembelian, dan FIFO Costing

### Hari 15: Auth basics (Auth.js/NextAuth session-based)
- Setup NextAuth + Prisma Adapter (session di database atau session strategy yang kamu pilih).
- Mulai dari Credentials untuk dev (paling gampang), nanti bisa tambah OAuth (Google/GitHub) tanpa ubah arsitektur besar.
- Output: login + logout + proteksi route `/dashboard` + session terbaca di server.

### Hari 16: Session & protected data
- Ambil session di server.
- Output: halaman master data hanya bisa diakses user login (minimal proteksi aplikasi).

### Hari 17: Authorization (aturan akses)
- Aturan minimal: semua endpoint inventory butuh session valid.
- Output: server menolak akses ilegal (bukan cuma disembunyikan di UI).

### Hari 18: Pembelian (stock-in) + FIFO layer
- Buat transaksi `PURCHASE`: input product, warehouse, qty (integer), unitCost (single currency), tanggal.
- Posting transaksi membuat `StockLayer` baru (qtyRemaining = qty).
- Output: setelah purchase diposting, stock overview bertambah.

### Hari 19: Caching, revalidation, dan data consistency
- `revalidatePath`, `revalidateTag` (konsep).
- Output: setelah posting purchase, UI konsisten tanpa refresh manual.

### Hari 20: Penjualan (stock-out) + FIFO consumption
- Buat transaksi `SALE`: input product, warehouse, qty (integer), tanggal.
- Saat posting, konsumsi `StockLayer` paling lama dulu dan catat `FifoConsumption` untuk COGS.
- Wajib cek stok cukup (tidak boleh negatif).
- Output: stock berkurang sesuai FIFO, COGS tercatat.

### Hari 21: Refactor dan hardening
- Rapikan `lib/` (db client, auth helpers, validators).
- Standardisasi error handling.
- Output: codebase lebih mudah ditambah transfer/adjustment.

---

## Minggu 4 (Hari 22–30): Testing, Performance, Deployment, dan Capstone

### Hari 22: Testing unit/integration minimal
- Test validator (Zod) + helper logic.
- Output: test runner jalan + beberapa test penting.

### Hari 23: Testing E2E minimal
- Pilih Playwright/Cypress.
- Test login + purchase (stock-in) + sale (stock-out FIFO).
- Output: 1–2 E2E test yang stabil untuk alur inventory.

### Hari 24: Performance dasar
- Image optimization, font, bundle check ringan.
- Output: halaman utama lebih cepat dan rapi.

### Hari 25: Security checklist praktis
- Validasi server, rate limit basic (opsional), sanitize output, CSRF (tergantung metode).
- Jangan simpan secret di client.
- Output: checklist dipenuhi untuk app kamu.

### Hari 26: Observability minimal
- Logging server yang rapi (console yang terstruktur cukup).
- Error boundary yang informatif.
- Output: debugging jadi cepat saat production.

### Hari 27: Deployment ke Vercel
- Setup env vars (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`) + database connection.
- Jalankan migration di production, pastikan pooling/connection strategy aman untuk serverless.
- Output: app live di production.

### Hari 28: Polish UI/UX
- Responsif mobile.
- Perbaiki spacing/typography.
- Output: app terlihat “produk”, bukan “tugas kursus”.

### Hari 29: Capstone scope
- Tambah 1 fitur besar:
  - Transfer antar gudang (dengan cost pindah apa adanya)
  - Stock adjustment (in/out, out tetap FIFO)
  - Stock card (riwayat) + search/pagination sederhana
- Output: fitur selesai end-to-end.

### Hari 30: Final audit + README + demo
- Rapikan README: fitur, stack, cara run, env vars.
- Buat seed/dev data (opsional).
- Output: project siap dipamerin (portfolio-ready).

---

## Checklist Kompetensi (kamu dianggap “siap” kalau ini beres)

- Bisa jelasin bedanya Server Component vs Client Component.
- Bisa bikin route + layout nested dan proteksi route.
- Bisa bikin CRUD ke database dengan Prisma.
- Bisa bikin auth + authorization rules di server.
- Bisa deploy dan nanganin env vars + migration.
- Punya minimal 1–2 test yang jalan.

## Kalau kamu mau, aku bisa lanjut bikinin

- Template repo Next.js fullstack (struktur folder, Prisma, Auth, Tailwind) langsung di project ini.
- Sprint plan yang lebih detail per hari (estimasi waktu + checklist per fitur).
