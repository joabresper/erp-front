import { useEffect } from 'react';
import { TextInput, NumberInput, Select, Switch, Stack, SimpleGrid } from '@mantine/core';
import { useForm } from '@mantine/form';
import { CrudFormModal } from '../../../components/layout/CrudFormModal'; // Ajustá la ruta
import { useCreateProduct, useUpdateProduct } from '../useProducts'; // Tus hooks de productos
import { ProductTypeLabels, type ProductTypeName} from '../../../constants/product-types';
import { UnitMeasure, UnitMeasureLabels, type UnitMeasureName } from '../../../constants/unit-measure';

interface Props {
opened: boolean;
close: () => void;
productToEdit?: any | null;
}

export const ProductFormModal = ({ opened, close, productToEdit }: Props) => {
const isEditing = !!productToEdit;
const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

// 1. Configuración del formulario
const form = useForm({
	initialValues: {
		sku: '',
		name: '',
		price: 0,
		description: '',
		type: '',
		unit: '',
		isSalable: true,
		active: true,
	},
	validate: {
		name: (val) => (val.length < 3 ? 'El nombre debe tener al menos 3 caracteres' : null),
		price: (val) => (val <= 0 ? 'El precio debe ser mayor a 0' : null),
		type: (val) => (!val ? 'Seleccioná un tipo' : null),
	},
});

// 2. Efecto para cargar datos o resetear
useEffect(() => {
	if (opened && productToEdit) {
		form.setValues({
			sku: productToEdit.sku || '',
			name: productToEdit.name,
			price: Number(productToEdit.price), // Convertimos Decimal de Prisma a Number
			description: productToEdit.description || '',
			type: productToEdit.type,
			unit: productToEdit.unit || '',
			isSalable: productToEdit.isSalable,
			active: productToEdit.active,
		});
	} else if (opened && !productToEdit) {
		form.reset();
	}
}, [opened, productToEdit]);

// 3. Manejo del envío
const handleSubmit = (values: typeof form.values) => {
	const payload = {
		...values,
		type: values.type as ProductTypeName,
		unit: values.unit as UnitMeasureName,
	};
	if (isEditing) {
		const { active, ...updatePayload } = payload; // Excluimos 'active' del payload de actualización
		updateProduct(
			{ id: productToEdit.id, data: updatePayload }, 
			{ onSuccess: handleCancelAndClear }
		);
	} else {
		createProduct(payload, { onSuccess: handleCancelAndClear });
	}
};

// 4. Limpieza y cierre
const handleCancelAndClear = () => {
	form.reset();
	close();
};

return (
	<CrudFormModal
	opened={opened}
	onClose={handleCancelAndClear}
	title={isEditing ? "Editar Producto" : "Crear Nuevo Producto"}
	isEditing={isEditing}
	isSaving={isCreating || isUpdating}
	onSubmit={form.onSubmit(handleSubmit)}
	>
	<Stack gap="sm">
		<SimpleGrid cols={2}>
		<TextInput 
			label="SKU / Código" 
			placeholder="Ej: PAN-001" 
			{...form.getInputProps('sku')} 
		/>
		<TextInput 
			label="Nombre" 
			placeholder="Ej: Pan Francés" 
			required 
			{...form.getInputProps('name')} 
		/>
		</SimpleGrid>

		<SimpleGrid cols={2}>
		<NumberInput 
			label="Precio" 
			placeholder="0.00" 
			required 
			min={0}
			decimalScale={2}
			{...form.getInputProps('price')} 
		/>
		<Select 
			label="Unidad de Medida" 
			placeholder="Por defecto: Unidad"
			allowDeselect={false}
			data={[
				{ value: UnitMeasure.UNIT, label: UnitMeasureLabels[UnitMeasure.UNIT] },
				{ value: UnitMeasure.KILOGRAM, label: UnitMeasureLabels[UnitMeasure.KILOGRAM] },
				{ value: UnitMeasure.LITER, label: UnitMeasureLabels[UnitMeasure.LITER] },
			]}
			{...form.getInputProps('unit')} 
		/>
		</SimpleGrid>

		<Select 
			label="Tipo" 
			placeholder="Seleccioná" 
			required
			data={Object.entries(ProductTypeLabels).map(([v, l]) => ({ value: v, label: l.label }))}
			{...form.getInputProps('type')} 
		/>

		<TextInput 
		label="Descripción" 
		placeholder="Notas internas..." 
		{...form.getInputProps('description')} 
		/>

		{!isEditing && (
			<Switch 
				label="Disponible para la venta" 
				mt="xs"		
				disabled={isEditing} // Solo se puede configurar al crear
				{...form.getInputProps('isSalable', { type: 'checkbox' })} 
			/>
		)}
	</Stack>
	</CrudFormModal>
);
};