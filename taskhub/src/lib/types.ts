// NOTE:
// Brand dipakai untuk membuat type yang terlihat seperti string,
// tapi dianggap berbeda oleh TypeScript di level domain.
// Ini berguna saat aplikasi berkembang dan punya banyak entity.
type Brand<T, TBrand extends string> = T & { readonly __brand: TBrand };

export type Qty = number;
export type Price = number;
export type Unit = string;

// NOTE:
// Sebelumnya kita punya Id = string yang dipakai untuk semua entity.
// Itu mudah dibaca, tapi ProductId dan WarehouseId masih bisa tertukar.
// Sekarang tiap entity utama punya ID-nya sendiri agar lebih aman dan scalable.
export type ProductId = Brand<string, "ProductId">;
export type WarehouseId = Brand<string, "WarehouseId">;

export type Product = {
  // NOTE:
  // id product sekarang spesifik ke ProductId, bukan string umum.
  id: ProductId;
  sku: string;
  name: string;
  price: Price;
  unit: Unit;
};

export type Warehouse = {
  // NOTE:
  // id warehouse sekarang spesifik ke WarehouseId.
  id: WarehouseId;
  name: string;
  location: string;
};

export type TxType =
  | "purchase"
  | "sale"
  | "transfer"
  | "adjustment_in"
  | "adjustment_out";

export function txTypeLabel(type: TxType): string {
  switch (type) {
    case "purchase":
      return "Purchase";
    case "sale":
      return "Sale";
    case "transfer":
      return "Transfer";
    case "adjustment_in":
      return "Adjustment (In)";
    case "adjustment_out":
      return "Adjustment (Out)";
    default: {
      // NOTE:
      // Exhaustive check memastikan semua nilai TxType ditangani.
      // Kalau nanti ada TxType baru tapi switch ini belum diperbarui,
      // TypeScript akan memunculkan error di sini.
      const exhaustive: never = type;
      return exhaustive;
    }
  }
}
