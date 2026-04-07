import {z} from 'zod';
import type { ProductId, WarehouseId, TxType } from './types';


/**
 * ID schemas (branded)
 * Catatan: pakai .min(1) dulu untuk id general.
 * Kalau nanti id kamu UUID, ganti jadi .uuid().
 */

export const ProductIdSchema = z.string().min(1, "Product ID tidak boleh kosong").transform((val) => val as ProductId); // Branded type untuk ProductId
export const WarehouseIdSchema = z.string().min(1, "Warehouse ID tidak boleh kosong").transform((val) => val as WarehouseId); // Branded type untuk WarehouseId

/**
 * TxType schema (sinkron dengan union di types.ts)
 * Ini memastikan input hanya boleh salah satu value ini.
 */

export const TxTypeSchema = z.enum(["purchase", "sale", "transfer", "adjustment_in", "adjustment_out"] satisfies ReadonlyArray<TxType>); // Enum untuk TxType, memastikan validasi yang ketat

/**
 * Qty schema: integer dan > 0
 * Penting: nilai dari <input> HTML biasanya STRING.
 * Maka untuk form, kita pakai z.coerce.number() agar "10" jadi 10.
 */

export const QtySchema = z.coerce.number().int().positive("Quantity harus berupa angka bulat positif"); // Coerce string ke number, pastikan integer dan > 0

/**
 * Price schema: number dan >= 0
 * Sama seperti Qty, kita coerce dari string ke number.
 */
export const PriceSchema = z.coerce.number().nonnegative("Price harus berupa angka positif atau nol"); // Coerce string ke number, pastikan >= 0

/**
 * PRODUCT
 * 1) Input schema (untuk create/update dari form/API): belum ada id.
 * 2) Entity schema (hasil dari DB): ada id branded.
 */
export const ProductInputSchema = z.object({
  sku: z.string().trim().min(1, "SKU tidak boleh kosong").max(20, "SKU maksimal 20 karakter"), // Validasi SKU: tidak boleh kosong, max 20 karakter
  name: z.string().trim().min(1, "Nama produk tidak boleh kosong").max(100, "Nama produk maksimal 100 karakter"), // Validasi nama: tidak boleh kosong, max 100 karakter
  price: PriceSchema.optional(), // Price bisa optional untuk input, nanti default di backend jadi 0
  unit: z.literal("pcs"),
});

export type ProductInput = z.infer<typeof ProductInputSchema>; // Type untuk input product (tanpa id)

export const ProductEntitySchema = ProductInputSchema.extend({
  id: ProductIdSchema, // Id produk yang sudah branded
});
export type ProductEntity = z.infer<typeof ProductEntitySchema>; // Type untuk entity product (dengan id)

/**
 * WAREHOUSE
 */
export const WarehouseInputSchema = z.object({
  name: z.string().trim().min(1, "Nama warehouse tidak boleh kosong").max(100, "Nama warehouse maksimal 100 karakter"), // Validasi nama warehouse
  location: z.string().trim().min(1, "Lokasi warehouse tidak boleh kosong").max(200, "Lokasi warehouse maksimal 200 karakter"), // Validasi lokasi warehouse
});
export type WarehouseInput = z.infer<typeof WarehouseInputSchema>; // Type untuk input warehouse (tanpa id)

export const WarehouseEntitySchema = WarehouseInputSchema.extend({
  id: WarehouseIdSchema, // Id warehouse yang sudah branded
});
export type WarehouseEntity = z.infer<typeof WarehouseEntitySchema>; // Type untuk entity warehouse (dengan id)