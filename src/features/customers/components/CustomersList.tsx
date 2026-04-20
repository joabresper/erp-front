import { useEffect, useMemo, useState } from 'react';
import { ActionIcon, Badge, Group, Tabs, Table, Text, TextInput, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconEdit, IconRefresh, IconSearch, IconTrash } from '@tabler/icons-react';
import { notificationService } from '../../../utils/notificationService';
import type { Customer } from '../../../types/models';
import { CrudLayout } from '../../../components/layout/CrudLayout';
import { Can } from '../../../components/common/Can';
import { PERMISSIONS } from '../../../constants/permissions';
import { useCustomers, useDeletedCustomers, useDeleteCustomer, useRestoreCustomer } from '../useCustomers';
import { CustomerFormModal } from './CustomerFormModal';
import { useDisclosure } from '@mantine/hooks';
import { useHasPermission } from '../../../hooks/useHasPermission';

export const CustomersList = () => {
	const canViewActiveCustomers = useHasPermission(PERMISSIONS.CUSTOMER_VIEW);
	const canViewDeletedCustomers = useHasPermission(PERMISSIONS.CUSTOMER_VIEW_DELETED);
	const { data: activeCustomers = [], isLoading: isLoadingActiveCustomers } = useCustomers();
	const { data: deletedCustomers = [], isLoading: isLoadingDeletedCustomers } = useDeletedCustomers();
	const { mutateAsync: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();
	const { mutateAsync: restoreCustomer } = useRestoreCustomer();

	const [activeTab, setActiveTab] = useState<string | null>(
		canViewActiveCustomers ? 'active' : canViewDeletedCustomers ? 'deleted' : null
	);
	const [search, setSearch] = useState('');
	const [opened, { open, close }] = useDisclosure(false);
	const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);

	useEffect(() => {
		if (canViewActiveCustomers && activeTab === null) {
			setActiveTab('active');
			return;
		}

		if (!canViewActiveCustomers && canViewDeletedCustomers && activeTab !== 'deleted') {
			setActiveTab('deleted');
			return;
		}

		if (canViewActiveCustomers && !canViewDeletedCustomers && activeTab !== 'active') {
			setActiveTab('active');
			return;
		}

		if (!canViewActiveCustomers && !canViewDeletedCustomers && activeTab !== null) {
			setActiveTab(null);
		}
	}, [activeTab, canViewActiveCustomers, canViewDeletedCustomers]);

	const currentCustomers = activeTab === 'deleted' ? deletedCustomers : activeCustomers;
	const isLoading = activeTab === 'deleted' ? isLoadingDeletedCustomers : isLoadingActiveCustomers;
	const isActiveTab = activeTab === 'active';

	const filteredCustomers = useMemo(() => {
		const term = search.trim().toLowerCase();

		return currentCustomers.filter((customer: Customer) => {
			if (!term) return true;

			const matchesSearch = [
				customer.name,
				customer.email,
				customer.phone,
				customer.address,
				customer.city,
				customer.postalCode,
				customer.taxId,
				customer.taxCondition,
			]
				.filter(Boolean)
				.some((value) => String(value).toLowerCase().includes(term));

			return matchesSearch;
		});
	}, [currentCustomers, search]);

	const handleCreateNew = () => {
		setCustomerToEdit(null);
		open();
	};

	const handleEdit = (customer: Customer) => {
		setCustomerToEdit(customer);
		open();
	};

	const handleDelete = (customer: Customer) => {
		modals.openConfirmModal({
			title: 'Eliminar cliente',
			centered: true,
			children: (
				<Text size="sm">
					¿Estás seguro de que querés eliminar a <b>{customer.name}</b>? La acción se podrá revertir desde la pestaña de eliminados.
				</Text>
			),
			labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
			confirmProps: { color: 'red', loading: isDeleting },
			onConfirm: async () => {
				try {
					await deleteCustomer(customer.id);
					notificationService.entityDeleted('Cliente', customer.name);
				} catch {
					notificationService.deletionFailed('cliente');
				}
			},
		});
	};

	const handleRestore = async (customer: Customer) => {
		try {
			await restoreCustomer(customer.id);
			notificationService.entityRestored('Cliente', customer.name);
		} catch {
			notificationService.restorationFailed('cliente');
		}
	};

	const headers = (
		<Table.Tr>
			<Table.Th>Cliente</Table.Th>
			<Table.Th>Contacto</Table.Th>
			<Table.Th>Ubicación</Table.Th>
			<Table.Th>Fiscal</Table.Th>
			<Table.Th ta="center">Estado</Table.Th>
			<Table.Th ta="center">Acciones</Table.Th>
		</Table.Tr>
	);

	const rows = filteredCustomers.map((customer: Customer) => (
		<Table.Tr key={customer.id}>
			<Table.Td>
				<Text fw={500} size="sm">
					{customer.name}
				</Text>
			</Table.Td>

			<Table.Td>
				<Text size="sm">{customer.email}</Text>
				{customer.phone && (
					<Text size="xs" c="dimmed">
						{customer.phone}
					</Text>
				)}
			</Table.Td>

			<Table.Td>
				<Text size="sm">{customer.address || '-'}</Text>
				<Text size="xs" c="dimmed">
					{[customer.city, customer.postalCode].filter(Boolean).join(' - ') || 'Sin ubicación cargada'}
				</Text>
			</Table.Td>

			<Table.Td>
				<Text size="sm">{customer.taxId || '-'}</Text>
				<Text size="xs" c="dimmed">
					{customer.taxCondition || 'Sin condición fiscal'}
				</Text>
			</Table.Td>

			<Table.Td ta="center">
				<Badge color={customer.active ? 'green' : 'gray'} variant="light">
					{customer.active ? 'Activo' : 'Inactivo'}
				</Badge>
			</Table.Td>

			<Table.Td>
				<Group gap={0} justify="center">
					{isActiveTab ? (
						<>
							<Can permission={PERMISSIONS.CUSTOMER_UPDATE}>
								<ActionIcon title="Editar" variant="subtle" color="blue" onClick={() => handleEdit(customer)}>
									<IconEdit size={18} />
								</ActionIcon>
							</Can>
							<Can permission={PERMISSIONS.CUSTOMER_DELETE}>
								<ActionIcon title="Eliminar" variant="subtle" color="red" onClick={() => handleDelete(customer)}>
									<IconTrash size={18} />
								</ActionIcon>
							</Can>
						</>
					) : (
						<Can permission={PERMISSIONS.CUSTOMER_RESTORE}>
							<ActionIcon title="Restaurar" variant="subtle" color="green" onClick={() => handleRestore(customer)}>
								<IconRefresh size={18} />
							</ActionIcon>
						</Can>
					)}
				</Group>
			</Table.Td>
		</Table.Tr>
	));

	const modalsContent = (
		<CustomerFormModal opened={opened} close={close} customerToEdit={customerToEdit} />
	);

	const currentTitle = isActiveTab ? 'Clientes activos' : 'Clientes eliminados';

	return (
		<div style={{ padding: '20px' }}>
			<Title order={2} mb="lg">
				Gestión de Clientes
			</Title>

			<Tabs value={activeTab} onChange={setActiveTab} variant="outline" radius="md">
				<Tabs.List mb="md">
					<Can permission={PERMISSIONS.CUSTOMER_VIEW}>
						<Tabs.Tab value="active">Activos</Tabs.Tab>
					</Can>
					<Can permission={PERMISSIONS.CUSTOMER_VIEW_DELETED}>
						<Tabs.Tab value="deleted">Eliminados</Tabs.Tab>
					</Can>
				</Tabs.List>

				<Tabs.Panel value="active">
					<Can permission={PERMISSIONS.CUSTOMER_VIEW}>
						<CrudLayout
							title={currentTitle}
							buttonLabel="Nuevo Cliente"
							onAddNew={handleCreateNew}
							isLoading={isLoading}
							requiredCreatePermissions={PERMISSIONS.CUSTOMER_CREATE}
							filterSection={(
								<TextInput
									placeholder="Buscar por nombre, email, teléfono o CUIT..."
									leftSection={<IconSearch size={16} />}
									value={search}
									onChange={(event) => setSearch(event.currentTarget.value)}
								/>
							)}
							tableHeaders={headers}
							tableRows={rows}
							modals={modalsContent}
						/>
					</Can>
				</Tabs.Panel>

				<Tabs.Panel value="deleted">
					<Can permission={PERMISSIONS.CUSTOMER_VIEW_DELETED}>
						<CrudLayout
							title={currentTitle}
							buttonLabel="Nuevo Cliente"
							onAddNew={handleCreateNew}
							isLoading={isLoading}
							hideCreateButton
							filterSection={(
								<TextInput
									placeholder="Buscar por nombre, email, teléfono o CUIT..."
									leftSection={<IconSearch size={16} />}
									value={search}
									onChange={(event) => setSearch(event.currentTarget.value)}
								/>
							)}
							tableHeaders={headers}
							tableRows={rows}
							modals={modalsContent}
						/>
					</Can>
				</Tabs.Panel>
			</Tabs>
		</div>
	);
};

