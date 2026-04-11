import type { Product } from "../types/models";


export const PRODUCT_SORT_OPTIONS: { label: string; value: keyof Product }[] = [
  { label: "Nombre", value: "name" },
  { label: "SKU", value: "sku" },
  { label: "Precio", value: "price" },
];