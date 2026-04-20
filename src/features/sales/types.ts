import type { InvoiceTypeName } from '../../constants/invoice-types';
import type { PaymentMethodName } from '../../constants/payment-methods.ts';
import type { PaymentStatusName } from '../../constants/payment-status';

export interface CreateSaleDTO {
  customerId: string;
  paymentMethod: PaymentMethodName;
  paymentStatus: PaymentStatusName;
  invoiceDate: string; // ISO date string
  invoiceType: InvoiceTypeName;
  saleItems: CreateSaleItemDTO[];
}

export interface UpdateSaleDTO extends Partial<Omit<CreateSaleDTO, 'customerId' | 'saleItems' | 'invoiceDate' | 'invoiceType'>> {}

export interface CreateSaleItemDTO {
  productId: string;
  quantity: number;
  discountAmount?: number; // Optional discount amount for the item
}