import { useEffect } from 'react';
import { SimpleGrid, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { CrudFormModal } from '../../../components/layout/CrudFormModal';
import { useCreateCustomer, useUpdateCustomer } from '../useCustomers';
import type { CreateCustomerDTO } from '../types';
import type { Customer } from '../../../types/models';

interface Props {
	opened: boolean;
	close: () => void;
	customerToEdit?: Customer | null;
}

const normalizeOptional = (value: string) => {
	const trimmed = value.trim();
	return trimmed === '' ? undefined : trimmed;
};

const keepOnlyDigits = (value: string) => value.replace(/\D/g, '');

export const CustomerFormModal = ({ opened, close, customerToEdit }: Props) => {
	const isEditing = !!customerToEdit;
	const { mutate: createCustomer, isPending: isCreating } = useCreateCustomer();
	const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer();

	const form = useForm({
		initialValues: {
			name: '',
			email: '',
			phone: '',
			address: '',
			city: '',
			postalCode: '',
			taxId: '',
			taxCondition: '',
		},
		validate: {
			name: (value) => (value.trim().length < 2 ? 'El nombre debe tener al menos 2 caracteres' : null),
			email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Email inválido'),
			phone: (value) => {
				if (!value) return null;
				return /^\d{7,15}$/.test(value) ? null : 'El teléfono debe tener entre 7 y 15 dígitos';
			},
			postalCode: (value) => {
				if (!value) return null;
				return /^\d{1,6}$/.test(value) ? null : 'El código postal debe tener hasta 6 dígitos';
			},
			taxCondition: (value) => (value.length > 50 ? 'Máximo 50 caracteres' : null),
		},
	});

	useEffect(() => {
		if (opened && customerToEdit) {
			form.setValues({
				name: customerToEdit.name || '',
				email: customerToEdit.email || '',
				phone: customerToEdit.phone || '',
				address: customerToEdit.address || '',
				city: customerToEdit.city || '',
				postalCode: customerToEdit.postalCode || '',
				taxId: customerToEdit.taxId || '',
				taxCondition: customerToEdit.taxCondition || '',
			});
		} else if (opened && !customerToEdit) {
			form.reset();
		}
	}, [opened, customerToEdit]);

	const handleSubmit = (values: typeof form.values) => {
		const payload: CreateCustomerDTO = {
			name: values.name.trim(),
			email: values.email.trim(),
			phone: normalizeOptional(values.phone),
			address: normalizeOptional(values.address),
			city: normalizeOptional(values.city),
			postalCode: normalizeOptional(values.postalCode),
			taxId: normalizeOptional(values.taxId),
			taxCondition: normalizeOptional(values.taxCondition),
		};

		if (isEditing && customerToEdit) {
			updateCustomer(
				{ id: customerToEdit.id, data: payload },
				{ onSuccess: handleCancelAndClear }
			);
			return;
		}

		createCustomer(payload, { onSuccess: handleCancelAndClear });
	};

	const handleCancelAndClear = () => {
		form.reset();
		close();
	};

	return (
		<CrudFormModal
			opened={opened}
			onClose={handleCancelAndClear}
			title={isEditing ? 'Editar Cliente' : 'Crear Nuevo Cliente'}
			isEditing={isEditing}
			isSaving={isCreating || isUpdating}
			onSubmit={form.onSubmit(handleSubmit)}
		>
			<Stack gap="sm">
				<SimpleGrid cols={2}>
					<TextInput
						label="Nombre"
						placeholder="Ej: Panadería Central"
						required
						{...form.getInputProps('name')}
					/>
					<TextInput
						label="Email"
						placeholder="cliente@empresa.com"
						required
						{...form.getInputProps('email')}
					/>
				</SimpleGrid>

				<SimpleGrid cols={2}>
					<TextInput
						label="Teléfono"
						placeholder="Opcional"
						inputMode="numeric"
						pattern="[0-9]*"
						maxLength={15}
						{...form.getInputProps('phone')}
						onChange={(event) => form.setFieldValue('phone', keepOnlyDigits(event.currentTarget.value))}
					/>
					<TextInput
						label="Ciudad"
						placeholder="Opcional"
						{...form.getInputProps('city')}
					/>
				</SimpleGrid>

				<SimpleGrid cols={2}>
					<TextInput
						label="Código Postal"
						placeholder="Opcional"
						inputMode="numeric"
						pattern="[0-9]*"
						maxLength={6}
						{...form.getInputProps('postalCode')}
						onChange={(event) => form.setFieldValue('postalCode', keepOnlyDigits(event.currentTarget.value))}
					/>
					<TextInput
						label="CUIT / Identificación Fiscal"
						placeholder="Opcional"
						{...form.getInputProps('taxId')}
					/>
				</SimpleGrid>

				<TextInput
					label="Dirección"
					placeholder="Opcional"
					{...form.getInputProps('address')}
				/>

				<TextInput
					label="Condición Fiscal"
					placeholder="Opcional"
					{...form.getInputProps('taxCondition')}
				/>
			</Stack>
		</CrudFormModal>
	);
};
