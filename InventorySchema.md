# Skema Data: Inventory Stock (FIFO)

Dokumen ini mendeskripsikan entity dan relasi untuk aplikasi inventory dengan aturan:
- Stok tidak boleh negatif.
- Semua pengurangan stok selalu FIFO costing.
- Transfer memindahkan cost apa adanya.
- Qty integer, single currency.

## Entity Inti

### `User`
- Tujuan: audit siapa yang membuat dan mem-posting transaksi.
- Relasi: `User 1..n InventoryTx`

### `Product`
- Kolom umum: `id`, `sku` (unique), `name`, `unit` (contoh: `pcs`).
- Relasi: `Product 1..n InventoryTxLine`, `Product 1..n StockLayer`

### `Warehouse`
- Kolom umum: `id`, `name` (unique).
- Relasi: `Warehouse 1..n StockLayer`, `Warehouse 1..n InventoryTxLine` (via from/to)

## Transaksi (Header dan Line)

### `InventoryTx`
- Tujuan: header transaksi inventory.
- Kolom umum:
  - `id`
  - `type`: `PURCHASE | SALE | TRANSFER | ADJUSTMENT_IN | ADJUSTMENT_OUT`
  - `status`: `DRAFT | POSTED | VOID`
  - `postedAt` (waktu transaksi efektif, dipakai untuk FIFO ordering)
  - `refNo` (opsional, sebaiknya unique)
  - `createdByUserId`
- Relasi: `InventoryTx 1..n InventoryTxLine`

### `InventoryTxLine`
- Tujuan: detail item per transaksi.
- Kolom umum:
  - `id`, `txId`, `productId`
  - `qty` (integer, selalu `> 0`)
  - `fromWarehouseId` (wajib untuk `SALE | TRANSFER | ADJUSTMENT_OUT`)
  - `toWarehouseId` (wajib untuk `PURCHASE | TRANSFER | ADJUSTMENT_IN`)
  - `unitCost` (wajib untuk `PURCHASE | ADJUSTMENT_IN`)
  - `unitPrice` (opsional untuk `SALE`, kalau butuh revenue)
- Relasi:
  - `InventoryTxLine 1..n FifoConsumption` (khusus transaksi OUT: `SALE | TRANSFER | ADJUSTMENT_OUT`)

## FIFO Layer (Sumber Stok)

### `StockLayer`
- Tujuan: “lot” FIFO per product per warehouse.
- Kolom umum:
  - `id`, `productId`, `warehouseId`
  - `receivedAt` (biasanya sama dengan `InventoryTx.postedAt`)
  - `qtyRemaining` (integer, `>= 0`)
  - `unitCost` (Decimal)
  - `sourceTxLineId` (asal layer dari purchase/adjustment_in)
  - `sourceConsumptionId` (opsional: asal layer transfer-in dari konsumsi FIFO di gudang asal)
- Relasi: `StockLayer 1..n FifoConsumption`
- Index penting (untuk FIFO pick): `(productId, warehouseId, receivedAt, id)`

## Audit Konsumsi FIFO (COGS)

### `FifoConsumption`
- Tujuan: mencatat layer mana yang dipakai untuk sebuah transaksi OUT dan berapa qty-nya.
- Kolom umum:
  - `id`, `txLineId`, `stockLayerId`
  - `qty` (integer, `> 0`)
  - `unitCostSnapshot` (Decimal; snapshot dari cost layer saat konsumsi)
  - `consumedAt`
- Relasi:
  - `InventoryTxLine 1..n FifoConsumption`
  - `StockLayer 1..n FifoConsumption`
- Catatan: COGS untuk sebuah `InventoryTxLine` bisa dihitung dari `SUM(qty * unitCostSnapshot)`.

## Aturan Posting (Ringkas)

- Saat `PURCHASE` atau `ADJUSTMENT_IN` diposting: buat `StockLayer` baru (`qtyRemaining = qty`, `unitCost = unitCost`).
- Saat `SALE` atau `ADJUSTMENT_OUT` diposting:
  - Cek stok cukup (akumulasi layer FIFO di warehouse terkait).
  - Konsumsi layer FIFO paling tua dulu, buat record `FifoConsumption`, dan kurangi `StockLayer.qtyRemaining`.
  - Jika stok tidak cukup: reject (stok tidak boleh negatif).
- Saat `TRANSFER` diposting:
  - Di gudang asal: konsumsi FIFO sama seperti `SALE` (buat `FifoConsumption`).
  - Di gudang tujuan: buat `StockLayer` baru untuk setiap konsumsi, dengan `unitCost` yang sama seperti `unitCostSnapshot` (cost pindah apa adanya).

## Opsional (Kalau Dibutuhkan)

- `Supplier` dan relasi ke `InventoryTx` untuk `PURCHASE`.
- `Customer` dan relasi ke `InventoryTx` untuk `SALE`.
- `OnHandSnapshot` / `ProductWarehouseBalance` untuk performa (MVP cukup hitung dari `SUM(StockLayer.qtyRemaining)`).

