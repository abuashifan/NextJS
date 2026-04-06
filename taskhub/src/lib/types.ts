export type id = string;

export type qty = number;
export type price = number;
export type unit = string;
export  type product = {
  id: id;
  sku: string;
  name: string;
  price: price;
  unit: unit;
};

export type warehouse = {
  id: id;
  name: string;
  location: string;
};
export type txType =
    | "purchas"
    | "sale"
    | "transfer"
    | "adjustment_in"
    | "adjustment_out";

export function txTypeLabel (type:txType): string {
  switch (type) {
    case "purchas":
        return "Purchase";
    case "sale":
        return "Sale";
    case "transfer":
        return "Transfer";
    case "adjustment_in":
        return "Adjustment (In)";
    case "adjustment_out":
        return "Adjustment (Out)";
   default:{
    const _exhaustive: never = type;
    return _exhaustive;
        }
    }
}