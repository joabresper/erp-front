import type { InvoiceTypeName } from "../constants/invoice-types";
import type { ProductTypeName } from "../constants/product-types";
import type { RoleName } from "../constants/roles";
import type { UnitMeasureName } from "../constants/unit-measure";

export interface Role {
    id: string;
    name: RoleName;
    description?: string;
    level: number;
}

export interface RoleWithPermissions extends Role {
	permissions: Permission[];
}

export interface Permission {
	id: string;
	name: string;
	description: string;
}

export interface User {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
	address?: string;
    deletedAt?: string; // ISO Date String
    roleId: string;
}

export interface UserWithRole extends Omit<User, 'roleId'> {
    role: Role;
}

export interface Product {
	id: string;
	sku: string;
	name: string;
	description: string | null;
	price: number;
	type: ProductTypeName;
	unit: UnitMeasureName;
	isSalable: boolean;
	active: boolean;
	createdAt: string;
	updatedAt: string;
	priceChanges?: PriceChange[];
}

export interface PriceChange {
	id: string;
	oldPrice: number;
	newPrice: number;
	date: string;
	productId: string;
}

export interface Customer {
	id: string;
	name: string;
	email: string;
	phone?: string;
	address?: string;
	city?: string;
	postalCode?: string;
	taxId?: string;
	taxCondition?: string;
	active: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface SaleItem {
	id: string;
	productName: string;
	productSku: string;
	quantity: number;
	unitPrice: number;
	discountAmount: number;
	subtotalAmount: number;

	productId: string;
	product?: Product;

	saleId: string;
}

export interface CustomerData {
	name: string;
	email: string;
}

export interface Sale {
	id: string;
	paymentMethod: string;
	paymentStatus: string;
	invoiceNumber: string;
	invoiceDate: string;
	invoiceType: string;
	createdAt: string;
	totalAmount: number;
	totalDiscountAmount: number;

	items: SaleItem[];

	customerId: string;
	customer: CustomerData;

	createdById: string;
}

export interface InvoiceSequence {
	id: string;
	type: InvoiceTypeName;
	prefix: number;
	lastNumber: number;
	updatedAt: string;
}