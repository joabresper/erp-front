import { PaymentMethods, type PaymentMethodName } from "../../constants/payment-methods";
import { UnitMeasure, type UnitMeasureName } from "../../constants/unit-measure";
import type { Shortcut } from "./types";

export const CURRENCY = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
});

export const POS_PAYMENT_METHODS: PaymentMethodName[] = [
  PaymentMethods.CASH,
  PaymentMethods.DEBIT_CARD,
  PaymentMethods.TRANSFER,
];

export const DEFAULT_BY_UNIT: Record<string, number> = {
  [UnitMeasure.UNIT]: 1,
  [UnitMeasure.KILOGRAM]: 1,
  [UnitMeasure.LITER]: 1,
};

export const QUICK_ADD_BY_UNIT: Partial<Record<UnitMeasureName, number[]>> = {
  [UnitMeasure.UNIT]: [1, 2, 3, 6, 12],
  [UnitMeasure.KILOGRAM]: [0.1, 0.25, 0.5, 1],
};

export const AMOUNT_SHORTCUT_ROWS: Shortcut[][] = [[
  { label: '$500', value: 500, mode: 'amount' },
  { label: '$1000', value: 1000, mode: 'amount' },
  { label: '$2000', value: 2000, mode: 'amount' },
]];

export const UNIT_SHORTCUT_ROWS: Shortcut[][] = [
  [
    { label: '1', value: 1, mode: 'quantity' },
    { label: '2', value: 2, mode: 'quantity' },
    { label: '3', value: 3, mode: 'quantity' },
  ],
  [
    { label: '6', value: 6, mode: 'quantity' },
    { label: '12', value: 12, mode: 'quantity' },
  ],
];

export const KILOGRAM_SHORTCUT_ROWS: Shortcut[][] = [
  [
    { label: '100g', value: 0.1, mode: 'quantity' },
    { label: '250g', value: 0.25, mode: 'quantity' },
  ],
  [
    { label: '500g', value: 0.5, mode: 'quantity' },
    { label: '1kg', value: 1, mode: 'quantity' },
  ],
];