export const ProductType = {
	FINISHED_GOOD: 'FINISHED_GOOD',
	RAW_MATERIAL: 'RAW_MATERIAL',
	RESALE: 'RESALE',
	GENERIC: 'GENERIC'
} as const;

export type ProductTypeName = typeof ProductType[keyof typeof ProductType];

export const ProductTypeLabels: Record<ProductTypeName, { label: string; short: string }> = {
	[ProductType.FINISHED_GOOD]: { label: 'Producto Terminado', short: 'PT' },
	[ProductType.RAW_MATERIAL]: { label: 'Materia Prima', short: 'MP' },
	[ProductType.RESALE]: { label: 'Reventa', short: 'REV' },
	[ProductType.GENERIC]: { label: 'Genérico', short: 'GEN' },
};