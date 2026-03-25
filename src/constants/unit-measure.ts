export const UnitMeasure = {
	UNIT: 'UNIT',
	KILOGRAM: 'KILOGRAM',
	LITER: 'LITER',
} as const;

export type UnitMeasureName = typeof UnitMeasure[keyof typeof UnitMeasure];

export const UnitMeasureLabels: Record<UnitMeasureName, string> = {
    [UnitMeasure.UNIT]: 'Unidades',
    [UnitMeasure.KILOGRAM]: 'Kilogramos',
    [UnitMeasure.LITER]: 'Litros',
};

export const UnitMeasureTags: Record<UnitMeasureName, string> = {
	[UnitMeasure.UNIT]: 'U',
	[UnitMeasure.KILOGRAM]: 'Kg',
	[UnitMeasure.LITER]: 'L',
};