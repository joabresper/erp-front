import { AMOUNT_SHORTCUT_ROWS, DEFAULT_BY_UNIT, KILOGRAM_SHORTCUT_ROWS, QUICK_ADD_BY_UNIT, UNIT_SHORTCUT_ROWS } from "./pos.constants";
import { ProductType } from "../../constants/product-types";
import { UnitMeasure, type UnitMeasureName } from "../../constants/unit-measure";
import type { Shortcut, TicketItem } from "./types";
import type { Product } from "../../types/models";

export const getProductSubtotal = (item: TicketItem) => Number(item.product.price) * Number(item.quantity);

export const normalizeTicketQuantity = (product: Product, quantity: number) => {
  if (product.unit === UnitMeasure.UNIT) {
    return Math.max(1, Math.round(quantity));
  }

  return Number(quantity.toFixed(3));
};

export const getTileTone = (product: Product) => {
  const name = product.name.toLowerCase();

  // 1. SALADO (Panificados, bizcochos, snacks) -> Tonos Marrones / Pan horneado
  if (/pan|biz|chipa|mignon|frances|galleta|salado|mixto|sandwich|miga/.test(name)) {
    return { bg: '#f0d4b3', border: '#ebb17a', chip: '#8c5b30' };
  }

  // 2. DULCE (Pastelería, facturas, postres) -> Tonos Rosa / Azúcar / Glaseado
  if (/factura|medialuna|azucar|pepa|pastel|torta|alfajor|dulce|crema|choc|budin|repost|donas/.test(name)) {
    return { bg: '#ffe3eb', border: '#f57fa8', chip: '#a61e4d' };
  }

  // 3. REVENTA (Bebidas, lácteos, almacén) -> Tonos Azules / Frío / Comercial
  if (product.type === ProductType.RESALE || /gaseosa|coca|agua|jugo|leche|yogur|fernet|cerveza|hielo/.test(name)) {
    return { bg: '#c4fbff', border: '#7bd3ea', chip: '#0b7285' };
  }

  // 4. OTROS -> Tonos grises neutros
  return { bg: '#f8f9fa', border: '#dee2e6', chip: '#495057' };
};

export const calculateQuantityFromAmount = (product: Product, amount: number) => {
  const unitPrice = Number(product.price || 0);

  if (!Number.isFinite(amount) || amount <= 0) return null;
  if (!Number.isFinite(unitPrice) || unitPrice <= 0) return null;

  const rawQuantity = amount / unitPrice;

  if (product.unit === UnitMeasure.UNIT) {
	const roundedDownQuantity = Math.floor(rawQuantity);
	return roundedDownQuantity > 0 ? roundedDownQuantity : null;
  }

  const quantity = Number(rawQuantity.toFixed(3));
  return quantity > 0 ? quantity : null;
};

export const formatQuantity = (item: TicketItem) => {
  const usesIntegerQuantity = item.product.unit === UnitMeasure.UNIT;
  return usesIntegerQuantity
	? String(Math.round(item.quantity))
	: item.quantity.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
};

export const resolveQuantity = (product: Product, typedValue: string) => {
  const parsed = Number(typedValue);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;

  if (product.unit === UnitMeasure.UNIT) {
	return Math.max(1, Math.round(parsed));
  }

  return Number(parsed.toFixed(3));
};

export const getQuickButtonRows = (unit: UnitMeasureName): number[][] => {
  if (unit === UnitMeasure.UNIT) {
	return [[1, 2, 3], [6, 12]];
  }

  if (unit === UnitMeasure.KILOGRAM) {
	return [[0.1, 0.25], [0.5, 1]];
  }

  const fallback = QUICK_ADD_BY_UNIT[unit] ?? [DEFAULT_BY_UNIT[unit] ?? 1];
  return [fallback];
};

export const getShortcutRows = (unit: UnitMeasureName): Shortcut[][] => {
  if (unit === UnitMeasure.UNIT) return UNIT_SHORTCUT_ROWS;
  if (unit === UnitMeasure.KILOGRAM) return KILOGRAM_SHORTCUT_ROWS;
  return AMOUNT_SHORTCUT_ROWS;
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(value);

export const formatDate = (value?: string, includeTime = false) => {
  if (!value) return '-';
  const date = new Date(value);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  return date.toLocaleDateString('es-AR', options);
};

export const getNowAsInputValue = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localISOTime = new Date(now.getTime() - offset).toISOString().slice(0, 16);
  return localISOTime;
};

export const toInputDateTime = (value?: string) => {
    if (!value) return getNowAsInputValue();
    
    const date = new Date(value);
    const offset = date.getTimezoneOffset() * 60000;

    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export const normalizeOptionalAmount = (value: number) => (value > 0 ? value : 0);
