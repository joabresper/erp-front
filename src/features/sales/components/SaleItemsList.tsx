import { Badge, Button, Modal, Paper, Stack, Table, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { SaleItem } from '../../../types/models';

interface Props {
	items?: SaleItem[];
	saleNumber?: string;
	triggerSize?: 'xs' | 'sm' | 'md';
	triggerVariant?: 'light' | 'subtle' | 'filled' | 'outline' | 'transparent' | 'default';
}

const formatCurrency = (value: number) =>
	new Intl.NumberFormat('es-AR', {
		style: 'currency',
		currency: 'ARS',
	}).format(value);

export const SaleItemsList = ({
	items = [],
	saleNumber,
	triggerSize = 'xs',
	triggerVariant = 'light',
}: Props) => {
	const [opened, { open, close }] = useDisclosure(false);
	const hasItems = items.length > 0;

	return (
		<>
			<Button
				size={triggerSize}
				variant={triggerVariant}
				disabled={!hasItems}
				onClick={open}
			>
				{items.length}
			</Button>

			<Modal opened={opened} onClose={close} title={`Productos de la venta${saleNumber ? ` ${saleNumber}` : ''}`} size="lg" centered>
				<Stack gap="md">
					{hasItems ? (
						<Table verticalSpacing="xs" highlightOnHover>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Producto</Table.Th>
									<Table.Th ta="center">Cantidad</Table.Th>
									<Table.Th ta="right">P. unitario</Table.Th>
									<Table.Th ta="right">Descuento</Table.Th>
									<Table.Th ta="right">Subtotal</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{items.map((item) => (
									<Table.Tr key={item.id}>
										<Table.Td>
											<Text fw={600} size="sm">
												{item.productName}
											</Text>
											<Text size="xs" c="dimmed">
												SKU: {item.productSku}
											</Text>
										</Table.Td>
										<Table.Td ta="center">
											<Badge variant="light">{item.quantity}</Badge>
										</Table.Td>
										<Table.Td ta="right">{formatCurrency(Number(item.unitPrice || 0))}</Table.Td>
										<Table.Td ta="right">{formatCurrency(Number(item.discountAmount || 0))}</Table.Td>
										<Table.Td ta="right">
											<Text fw={700}>{formatCurrency(Number(item.subtotalAmount || 0))}</Text>
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					) : (
						<Paper withBorder p="md" radius="md">
							<Text size="sm" c="dimmed">
								ERROR - Esta venta no tiene productos cargados. Revisar...
							</Text>
						</Paper>
					)}
				</Stack>
			</Modal>
		</>
	);
};
