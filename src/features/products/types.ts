import type { ProductTypeName } from "../../constants/product-types";
import type { UnitMeasureName } from "../../constants/unit-measure";

export interface CreateProductDTO {
	sku: string;
	name: string;
	description?: string;
	price: number;
	type?: ProductTypeName;
	unit?: UnitMeasureName;
	isSalable?: boolean;
	active?: boolean;
}

export interface UpdateProductDTO extends Partial<Omit<CreateProductDTO, 'active'>> {}

export interface ChangeProductStatusDTO {
	active: boolean;
}