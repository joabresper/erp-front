import type { ProductTypeName, UnitMeasureName } from "../constants/product-types";
import type { RoleName } from "../constants/roles";

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