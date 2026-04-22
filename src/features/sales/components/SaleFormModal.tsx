import { useEffect, useMemo } from 'react';
import {
	ActionIcon,
	Badge,
	Button,
	Divider,
	Grid,
	Group,
	NumberInput,
	Paper,
	Select,
	SimpleGrid,
	Stack,
	Table,
	Text,
	TextInput,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { notificationService } from '../../../utils/notificationService';
import { CrudFormModal } from '../../../components/layout/CrudFormModal';
import { useCreateSale, useUpdateSale } from '../useSales';
import type { CreateSaleDTO, UpdateSaleDTO } from '../types';
import type { Customer, Product, Sale, SaleItem } from '../../../types/models';
import { useCustomers } from '../../customers/useCustomers';
import { useProducts } from '../../products/useProducts';
import {
	InvoiceType,
	InvoiceTypeLabels,
	type InvoiceTypeName,
} from '../../../constants/invoice-types';
import {
	PaymentMethods,
	PaymentMethodLabels,
	type PaymentMethodName,
} from '../../../constants/payment-methods';
import {
	PaymentStatus,
	PaymentStatusLabels,
	type PaymentStatusName,
} from '../../../constants/payment-status';
import { formatCurrency, formatDate, getNowAsInputValue, normalizeOptionalAmount, toInputDateTime } from '../pos-logic.utils';

interface Props {
	opened: boolean;
	close: () => void;
	saleToEdit?: Sale | null;
}

interface SaleItemFormValue {
	productId: string;
	quantity: number;
	discountAmount: number;
}

interface SaleFormValues {
	customerId: string;
	paymentMethod: string;
	paymentStatus: string;
	invoiceDate: string;
	invoiceType: string;
	saleItems: SaleItemFormValue[];
}

const createEmptySaleItem = (): SaleItemFormValue => ({
	productId: '',
	quantity: 1,
	discountAmount: 0,
});

export const SaleFormModal = ({ opened, close, saleToEdit }: Props) => {
	const isEditing = !!saleToEdit;
	const isMobile = useMediaQuery('(max-width: 768px)');
	const { data: customers = [] } = useCustomers();
	const { data: products = [] } = useProducts({ isSalable: true, active: true });
	const { mutate: createSale, isPending: isCreating } = useCreateSale();
	const { mutate: updateSale, isPending: isUpdating } = useUpdateSale(saleToEdit?.id ?? '');
	
	const customerOptions = useMemo(
		() =>
			customers.map((customer: Customer) => ({
				value: customer.id,
				label: customer.name,
			})),
		[customers]
	);

	const productOptions = useMemo(
		() =>
			products.map((product: Product) => ({
				value: product.id,
				label: `${product.name} (${product.sku})`,
			})),
		[products]
	);

	const form = useForm<SaleFormValues>({
		initialValues: {
			customerId: '',
			paymentMethod: PaymentMethods.CASH,
			paymentStatus: PaymentStatus.PENDING,
			invoiceDate: getNowAsInputValue(),
			invoiceType: InvoiceType.B,
			saleItems: [createEmptySaleItem()],
		},
		validate: {
			customerId: (value) => (!isEditing && !value ? 'Seleccioná un cliente' : null),
			paymentMethod: (value) => (!value ? 'Seleccioná un método de pago' : null),
			paymentStatus: (value) => (!value ? 'Seleccioná un estado de pago' : null),
			invoiceDate: (value) => (!isEditing && !value ? 'La fecha de factura es obligatoria' : null),
			invoiceType: (value) => (!isEditing && !value ? 'Seleccioná un tipo de comprobante' : null),
			saleItems: (value) => {
				if (isEditing) return null;

				if (!value.length) {
					return 'Agregá al menos un ítem';
				}

				const hasInvalidItem = value.some((item) => !item.productId || Number(item.quantity) <= 0);
				return hasInvalidItem ? 'Completa todos los ítems antes de guardar' : null;
			},
		},
	});
	const { setValues, reset, onSubmit, getInputProps, values } = form;

	useEffect(() => {
		if (opened && saleToEdit) {
			setValues({
				customerId: saleToEdit.customerId || '',
				paymentMethod: saleToEdit.paymentMethod || PaymentMethods.CASH,
				paymentStatus: saleToEdit.paymentStatus || PaymentStatus.PENDING,
				invoiceDate: toInputDateTime(saleToEdit.invoiceDate),
				invoiceType: saleToEdit.invoiceType || InvoiceType.B,
				saleItems:
					saleToEdit.items?.length
						? saleToEdit.items.map((item: SaleItem) => ({
							productId: item.productId,
							quantity: item.quantity,
							discountAmount: item.discountAmount ?? 0,
						}))
						: [createEmptySaleItem()],
			});
			return;
		}

		if (opened && !saleToEdit) {
			reset();
		}
	}, [opened, saleToEdit, reset, setValues]);

	const handleCancelAndClear = () => {
		reset();
		close();
	};

	const handleSubmit = (values: SaleFormValues) => {
		if (isEditing && saleToEdit) {
			const updatePayload: UpdateSaleDTO = {
				paymentMethod: values.paymentMethod as PaymentMethodName,
				paymentStatus: values.paymentStatus as PaymentStatusName,
			};

			updateSale(updatePayload, {
				onSuccess: () => {
					handleCancelAndClear();
					notificationService.entityUpdated('Venta', `Comprobante ${saleToEdit.invoiceNumber}`);
				},
				onError: () => {
					notificationService.updateFailed('venta');
				}
			});
			return;
		}

		const createPayload: CreateSaleDTO = {
			customerId: values.customerId,
			paymentMethod: values.paymentMethod as PaymentMethodName,
			paymentStatus: values.paymentStatus as PaymentStatusName,
			invoiceDate: values.invoiceDate,
			invoiceType: values.invoiceType as InvoiceTypeName,
			saleItems: values.saleItems.map((item) => ({
				productId: item.productId,
				quantity: Number(item.quantity),
				discountAmount: normalizeOptionalAmount(Number(item.discountAmount)),
			})),
		};

		createSale(createPayload, {
			onSuccess: () => {
				handleCancelAndClear();
				notificationService.entityCreated('Venta');
			},
			onError: () => {
				notificationService.creationFailed('venta');
			}
		});
	};

	const addSaleItem = () => {
		setValues({ ...values, saleItems: [...values.saleItems, createEmptySaleItem()] });
	};

	const removeSaleItem = (index: number) => {
		const nextItems = values.saleItems.filter((_, currentIndex) => currentIndex !== index);
		setValues({
			...values,
			saleItems: nextItems.length ? nextItems : [createEmptySaleItem()],
		});
	};

	const selectedCustomer = customers.find((customer: Customer) => customer.id === saleToEdit?.customerId);
	const selectedItems = saleToEdit?.items ?? [];

	return (
		<CrudFormModal
			opened={opened}
			onClose={handleCancelAndClear}
			title={isEditing ? 'Editar Venta' : 'Crear Nueva Venta'}
			isEditing={isEditing}
			isSaving={isCreating || isUpdating}
			modalSize="xl"
			onSubmit={onSubmit(handleSubmit)}
		>
			<Stack gap="md">
				{!isEditing && (
					<SimpleGrid cols={2}>
						<Select
							label="Cliente"
							placeholder="Seleccioná un cliente"
							searchable
							required
							data={customerOptions}
							{...getInputProps('customerId')}
						/>
						<TextInput
							label="Fecha de factura"
							type="datetime-local"
							required
							{...getInputProps('invoiceDate')}
						/>
					</SimpleGrid>
				)}

				<SimpleGrid cols={2}>
					<Select
						label="Método de pago"
						placeholder="Seleccioná un método"
						required
						data={Object.entries(PaymentMethods).map(([value]) => ({
							value,
							label: PaymentMethodLabels[value as PaymentMethodName].label,
						}))}
						{...getInputProps('paymentMethod')}
					/>
					<Select
						label="Estado de pago"
						placeholder="Seleccioná un estado"
						required
						data={Object.entries(PaymentStatus).map(([value]) => ({
							value,
							label: PaymentStatusLabels[value as PaymentStatusName].label,
						}))}
						{...getInputProps('paymentStatus')}
					/>
				</SimpleGrid>

				{!isEditing && (
					<Select
						label="Tipo de comprobante"
						placeholder="Seleccioná un tipo"
						required
						data={Object.entries(InvoiceType).map(([value]) => ({
							value,
							label: InvoiceTypeLabels[value as InvoiceTypeName].label,
						}))}
						{...getInputProps('invoiceType')}
					/>
				)}

				{isEditing && (
					<Paper withBorder p="md" radius="md" bg="gray.0">
						<Stack gap="xs">
							<Text fw={600} size="sm">
								Datos de la venta
							</Text>
							<SimpleGrid cols={2}>
								<Text size="sm">
									Cliente: {selectedCustomer?.name || saleToEdit?.customerId}
								</Text>
								<Text size="sm">
									Fecha: {formatDate(saleToEdit?.invoiceDate)}
								</Text>
							</SimpleGrid>
							<Text size="sm">
								Comprobante: {saleToEdit ? InvoiceTypeLabels[saleToEdit.invoiceType as InvoiceTypeName]?.label || saleToEdit.invoiceType : '-'}
							</Text>
						</Stack>
					</Paper>
				)}

				{!isEditing && (
					<Grid gutter="md">
						<Grid.Col span={{ base: 12, md: 8 }}>
							<Paper withBorder p="md" radius="md">
								<Stack gap="md">
									<Group justify="space-between" align="center">
										<Text fw={600}>Detalle de ítems</Text>
										<Button variant="light" size="xs" leftSection={<IconPlus size={14} />} onClick={addSaleItem}>
											Agregar ítem
										</Button>
									</Group>

									<Stack gap="sm">
										{values.saleItems.map((saleItem, index) => {
											const selectedProduct = products.find((product: Product) => product.id === saleItem.productId);
											const subtotal = selectedProduct
												? Math.max(selectedProduct.price * Number(saleItem.quantity) - Number(saleItem.discountAmount || 0), 0)
												: 0;

											return (
												<Paper key={`${index}-${saleItem.productId || 'new'}`} withBorder p="sm" radius="md">
													<Stack gap="sm">
														<Group justify="space-between" align="flex-start">
															<Text fw={600} size="sm">
																Ítem {index + 1}
															</Text>
															<ActionIcon
																variant="subtle"
																color="red"
																title="Quitar ítem"
																onClick={() => removeSaleItem(index)}
															>
																<IconTrash size={16} />
															</ActionIcon>
														</Group>

														<SimpleGrid cols={2}>
															<Select
																label="Producto"
																placeholder="Seleccioná un producto"
																required
																searchable
																data={productOptions}
																{...getInputProps(`saleItems.${index}.productId`)}
															/>
															<NumberInput
																label="Cantidad"
																required
																min={1}
																decimalScale={0}
																allowDecimal={false}
																{...getInputProps(`saleItems.${index}.quantity`)}
															/>
														</SimpleGrid>

														<SimpleGrid cols={2}>
															<NumberInput
																label="Descuento"
																min={0}
																decimalScale={2}
																allowDecimal
																hideControls
																{...getInputProps(`saleItems.${index}.discountAmount`)}
															/>
															<Paper withBorder p="sm" radius="md" bg="gray.0">
																<Text size="xs" c="dimmed">
																	Subtotal estimado
																</Text>
																<Text fw={600}>{formatCurrency(subtotal)}</Text>
															</Paper>
														</SimpleGrid>
													</Stack>
												</Paper>
											);
										})}
									</Stack>
									{!products.length && (
										<Text size="xs" c="dimmed">
											No hay productos activos disponibles para agregar a la venta.
										</Text>
									)}
								</Stack>
							</Paper>
						</Grid.Col>

						<Grid.Col span={{ base: 12, md: 4 }}>
							<Paper withBorder p="md" radius="md" bg="blue.0" style={{ position: isMobile ? 'relative' : 'sticky', top: isMobile ? 'auto' : 20 }}>
								<Stack gap="sm">
									<Text fw={600} size="sm">
										Resumen de la venta
									</Text>
									<Stack gap={0}>
										{values.saleItems.map((saleItem, index) => {
											const selectedProduct = products.find(
												(product: Product) => product.id === saleItem.productId
											);
											const subtotal = selectedProduct
												? Math.max(
														selectedProduct.price * Number(saleItem.quantity) -
															Number(saleItem.discountAmount || 0),
														0
													)
												: 0;
											return (
												<Group
													key={`${index}-${saleItem.productId || 'new'}`}
													justify="space-between"
													align="center"
												>
													<Text size="sm" c="dimmed">
														Ítem {index + 1}
													</Text>
													<Text size="sm" fw={500}>
														{formatCurrency(subtotal)}
													</Text>
												</Group>
											);
										})}
									</Stack>
									<Divider my="xs" />
									<Group justify="space-between" align="center">
										<Text fw={700} size="md">
											Total
										</Text>
										<Text fw={700} size="md" c="blue.9">
											{formatCurrency(
												values.saleItems.reduce((total, saleItem) => {
													const selectedProduct = products.find(
														(product: Product) => product.id === saleItem.productId
													);
													const subtotal = selectedProduct
														? Math.max(
															selectedProduct.price * Number(saleItem.quantity) -
																Number(saleItem.discountAmount || 0),
															0
														)
														: 0;
													return total + subtotal;
												}, 0)
											)}
										</Text>
									</Group>
								</Stack>
							</Paper>
						</Grid.Col>
					</Grid>
				)}

				{isEditing && selectedItems.length > 0 && (
					<Paper withBorder p="md" radius="md">
						<Stack gap="sm">
							<Text fw={600}>Ítems asociados</Text>
							<Table verticalSpacing="xs">
								<Table.Thead>
									<Table.Tr>
										<Table.Th>Producto</Table.Th>
										<Table.Th ta="center">Cantidad</Table.Th>
										<Table.Th ta="right">Subtotal</Table.Th>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{selectedItems.map((item) => (
										<Table.Tr key={item.id}>
											<Table.Td>
												<Text fw={500} size="sm">
													{item.productName}
												</Text>
												<Text size="xs" c="dimmed">
													{item.productSku}
												</Text>
											</Table.Td>
											<Table.Td ta="center">{item.quantity}</Table.Td>
											<Table.Td ta="right">{formatCurrency(item.subtotalAmount)}</Table.Td>
										</Table.Tr>
									))}
								</Table.Tbody>
							</Table>
						</Stack>
					</Paper>
				)}

				{isEditing && saleToEdit && (
					<Paper withBorder p="md" radius="md" bg="gray.0">
						<Stack gap="xs">
							<Text fw={600} size="sm">
								Resumen actual
							</Text>
							<Group gap="md">
								<Badge variant="light">
									{PaymentMethodLabels[saleToEdit.paymentMethod as PaymentMethodName]?.label || saleToEdit.paymentMethod}
								</Badge>
								<Badge variant="light" color="blue">
									{PaymentStatusLabels[saleToEdit.paymentStatus as PaymentStatusName]?.label || saleToEdit.paymentStatus}
								</Badge>
								<Badge variant="light" color="gray">
									{InvoiceTypeLabels[saleToEdit.invoiceType as InvoiceTypeName]?.label || saleToEdit.invoiceType}
								</Badge>
							</Group>
						</Stack>
					</Paper>
				)}

				<Divider />
			</Stack>
		</CrudFormModal>
	);
};

