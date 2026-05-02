import type { InvoiceTypeName } from '../../constants/invoice-types';
import type { PaymentMethodName } from '../../constants/payment-methods.ts';
import type { PaymentStatusName } from '../../constants/payment-status';
import type { Product } from '../../types/models.ts';

export interface CreateSaleDTO {
  customerId: string;
  paymentMethod: PaymentMethodName;
  paymentStatus: PaymentStatusName;
  invoiceDate: string; // ISO date string
  invoiceType: InvoiceTypeName;
  saleItems: CreateSaleItemDTO[];
  amountPaid?: number;
  pickupDate?: string; // ISO date string or null
  contactName?: string;
}

export interface UpdateSaleDTO extends Partial<Omit<CreateSaleDTO, 'customerId' | 'saleItems' | 'invoiceDate' | 'invoiceType'>> {}

export interface CreateSaleItemDTO {
  productId: string;
  quantity: number;
  discountAmount?: number; // Optional discount amount for the item
}

export interface TicketItem {
  product: Product;
  quantity: number;
}

type ShortcutMode = 'quantity' | 'amount';

export interface Shortcut {
  label: string;
  value: number;
  mode: ShortcutMode;
}