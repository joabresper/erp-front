import { useMemo, useState } from 'react';
import { ActionIcon, Badge, Button, Card, Group, Paper, Stack, Table, Text, TextInput, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconSearch } from '@tabler/icons-react';
import { CrudLayout } from '../../../components/layout/CrudLayout';
import { Can } from '../../../components/common/Can';
import { PERMISSIONS } from '../../../constants/permissions';
import { useSales } from '../useSales';
import { SaleFormModal } from './SaleFormModal';
import { SaleItemsList } from './SaleItemsList';
import {
	InvoiceTypeLabels,
	type InvoiceTypeName,
} from '../../../constants/invoice-types';
import {
	PaymentMethodLabels,
	type PaymentMethodName,
} from '../../../constants/payment-methods';
import {
	PaymentStatusLabels,
	type PaymentStatusName,
} from '../../../constants/payment-status';
import type { Sale } from '../../../types/models';
import { formatCurrency, formatDate } from '../pos-logic.utils';

const getSearchText = (sale: Sale) => {
	const itemsText = (sale.items ?? [])
		.map((item) => `${item.productName} ${item.productSku}`)
		.join(' ');

	return [
		sale.invoiceNumber,
		sale.customer.name,
		sale.paymentMethod,
		sale.paymentStatus,
		sale.invoiceType,
		itemsText,
	]
		.filter(Boolean)
		.join(' ')
		.toLowerCase();
};

export const SalesList = () => {
	const { data: sales = [], isLoading } = useSales();
	const [search, setSearch] = useState('');
	const [opened, { open, close }] = useDisclosure(false);
	const [saleToEdit, setSaleToEdit] = useState<Sale | null>(null);

	const sortedSales = useMemo(() => {
		return [...(sales as Sale[])].sort((a, b) => {
			const leftDate = new Date(a.invoiceDate || a.createdAt).getTime();
			const rightDate = new Date(b.invoiceDate || b.createdAt).getTime();
			return rightDate - leftDate;
		});
	}, [sales]);

	const filteredSales = useMemo(() => {
		const term = search.trim().toLowerCase();
		if (!term) return sortedSales;

		return sortedSales.filter((sale) => getSearchText(sale).includes(term));
	}, [search, sortedSales]);

	const handleCreateNew = () => {
		setSaleToEdit(null);
		open();
	};

	const handleEdit = (sale: Sale) => {
		setSaleToEdit(sale);
		open();
	};

	const paymentStatusColor: Record<PaymentStatusName, string> = {
		PENDING: 'yellow',
		PAID: 'green',
		PARTIALLY_PAID: 'blue',
		CANCELLED: 'gray',
		REFUNDED: 'red',
	};

	const headers = (
		<Table.Tr>
			<Table.Th>Comprobante</Table.Th>
			<Table.Th>Cliente</Table.Th>
			<Table.Th>Pago</Table.Th>
			<Table.Th ta="center">Fecha</Table.Th>
			<Table.Th ta="right">Total</Table.Th>
			<Table.Th ta="center">Ítems</Table.Th>
			<Table.Th ta="center">Acciones</Table.Th>
		</Table.Tr>
	);

	const rows = filteredSales.map((sale) => (
		<Table.Tr key={sale.id}>
			<Table.Td>
				<Text fw={600} size="sm">
					{sale.invoiceNumber}
				</Text>
				<Badge variant="light" mt={4}>
					{InvoiceTypeLabels[sale.invoiceType as InvoiceTypeName]?.label || sale.invoiceType}
				</Badge>
			</Table.Td>

			<Table.Td>
				<Text fw={500} size="sm">
					{sale.customer.name}
				</Text>
				{sale.customer.email && (
					<Text size="xs" c="dimmed">
						{sale.customer.email}
					</Text>
				)}
			</Table.Td>

			<Table.Td>
				<Badge variant="light" color="blue">
					{PaymentMethodLabels[sale.paymentMethod as PaymentMethodName]?.label || sale.paymentMethod}
				</Badge>
				<Text size="xs" c="dimmed" mt={4}>
					{PaymentStatusLabels[sale.paymentStatus as PaymentStatusName]?.label || sale.paymentStatus}
				</Text>
			</Table.Td>

			<Table.Td ta="center">
				<Text size="sm">{formatDate(sale.invoiceDate, true)}</Text>
				<Text size="xs" c="dimmed">
					Creada: {formatDate(sale.createdAt)}
				</Text>
			</Table.Td>

			<Table.Td ta="right">
				<Text fw={700} size="sm">
					{formatCurrency(Number(sale.totalAmount || 0))}
				</Text>
				<Text size="xs" c="dimmed">
					Descuento: {formatCurrency(Number(sale.totalDiscountAmount || 0))}
				</Text>
			</Table.Td>

			<Table.Td ta="center">
				<SaleItemsList items={sale.items} saleNumber={sale.invoiceNumber} />
			</Table.Td>

			<Table.Td>
				<Group gap={0} justify="center">
					<Can permission={PERMISSIONS.SALE_UPDATE}>
						<ActionIcon title="Editar venta" variant="subtle" color="blue" onClick={() => handleEdit(sale)}>
							<IconEdit size={18} />
						</ActionIcon>
					</Can>
				</Group>
			</Table.Td>
		</Table.Tr>
	));

	const mobileCards = filteredSales.map((sale) => (
		<Card key={sale.id} withBorder shadow="sm" radius="md" p="md">
			<Group justify="space-between" align="flex-start" mb="xs">
				<Stack gap={2} style={{ flex: 1 }}>
					<Text fw={700} size="lg" c="blue.9">
						{sale.invoiceNumber}
					</Text>
					<Text size="xs" c="dimmed" fw={500}>
						{sale.customer.name}
					</Text>
				</Stack>
				<Badge color={paymentStatusColor[sale.paymentStatus as PaymentStatusName] || 'gray'} variant="light">
					{PaymentStatusLabels[sale.paymentStatus as PaymentStatusName]?.label || sale.paymentStatus}
				</Badge>
			</Group>

			<Paper withBorder p="sm" radius="md" bg="gray.0">
				<Stack gap={4}>
					<Text size="xs" c="dimmed">
						{InvoiceTypeLabels[sale.invoiceType as InvoiceTypeName]?.label || sale.invoiceType}
					</Text>
					<Text fw={700} size="md">
						{formatCurrency(Number(sale.totalAmount || 0))}
					</Text>
					<Text size="xs" c="dimmed">
						{PaymentMethodLabels[sale.paymentMethod as PaymentMethodName]?.label || sale.paymentMethod}
					</Text>
					<Text size="xs" c="dimmed">
						Fecha: {formatDate(sale.invoiceDate)}
					</Text>
				</Stack>
			</Paper>

			<Group justify="space-between" align="center" mt="sm">
				<Text size="xs" c="dimmed">
					Descuento: {formatCurrency(Number(sale.totalDiscountAmount || 0))}
				</Text>
				<SaleItemsList items={sale.items} saleNumber={sale.invoiceNumber} triggerSize="sm" />
			</Group>

			<Group gap="sm" mt="md" grow>
				<Can permission={PERMISSIONS.SALE_UPDATE}>
					<Button variant="light" color="blue" leftSection={<IconEdit size={16} />} onClick={() => handleEdit(sale)} size="xs">
						Editar
					</Button>
				</Can>
			</Group>
		</Card>
	));

	const modalsContent = <SaleFormModal opened={opened} close={close} saleToEdit={saleToEdit} />;

	return (
		<div style={{ padding: '20px' }}>
			<Title order={2} mb="lg">
				Gestión de Ventas
			</Title>

			<CrudLayout
				title="Ventas registradas"
				buttonLabel="Nueva Venta"
				onAddNew={handleCreateNew}
				isLoading={isLoading}
				requiredCreatePermissions={PERMISSIONS.SALE_CREATE}
				filterSection={(
					<TextInput
						placeholder="Buscar por comprobante, cliente, método o estado..."
						leftSection={<IconSearch size={16} />}
						value={search}
						onChange={(event) => setSearch(event.currentTarget.value)}
					/>
				)}
				tableHeaders={headers}
				tableRows={rows}
				modals={modalsContent}
				mobileView={mobileCards}
			/>
		</div>
	);
};
