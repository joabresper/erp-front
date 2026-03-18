import { Table, Group, Text, ActionIcon, Button, Modal, Tooltip, Tabs, Title } from '@mantine/core';
import { IconTrash, IconEdit, IconUsersGroup, IconRefresh, IconUserCheck } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { UserFormModal } from './UserFormModal';
import { Roles } from '../../../constants/roles';
import { useDeleteUser, useRestoreUser, useUsers, useUsersDeleted } from '../useUser';
import { useState } from 'react';
import { RoleBadge } from '../../../components/common/RoleBadge';
import { CrudLayout } from '../../../components/layout/CrudLayout';
import { PERMISSIONS } from '../../../constants/permissions';
import { Can } from '../../../components/common/Can';
import { ChangeRoleModal } from './ChangeRolModal';
import type { UserWithRole } from '../../../types/models';

export const UsersList = () => {
  // 1. Hooks de datos
  const { data: activeUsers, isLoading: loadingActive } = useUsers();
  const { data: deletedUsers, isLoading: loadingDeleted } = useUsersDeleted();
  
  // 2. Estados de UI
  const [activeTab, setActiveTab] = useState<string | null>('active');
  const [opened, { open, close }] = useDisclosure(false);
  const [userToEdit, setUserToEdit] = useState<any | null>(null);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [roleModalOpened, { open: openRoleModal, close: closeRoleModal }] = useDisclosure(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // 3. Mutaciones
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutate: restoreUser } = useRestoreUser();

  // --- LÓGICA DE SELECCIÓN DE DATA ---
  const currentData = activeTab === 'active' ? activeUsers : deletedUsers;
  const currentLoading = activeTab === 'active' ? loadingActive : loadingDeleted;

  const handleCreateNew = () => {
    setUserToEdit(null);
    open();
  };

  const handleEdit = (user: any) => {
    setUserToEdit(user);
    open();
  };

  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    openDelete();
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id, {
        onSuccess: () => {
          closeDelete();
          setUserToDelete(null);
        }
      });
    }
  };

  const handleOpenRoleModal = (user: any) => {
    setSelectedUser(user);
    openRoleModal();
  };

  const headers = (
    <Table.Tr>
      <Table.Th>Usuario</Table.Th>
      <Table.Th>
        {activeTab === 'active' ? 'Rol' : 'Fecha de Eliminación'}
      </Table.Th>
      <Table.Th ta="center">Acciones</Table.Th>
    </Table.Tr>
  );

  const rows = currentData?.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>
        <Group gap="sm">
          <div>
            <Text size="sm" fw={500}>{user.fullName}</Text>
            <Text size="xs" c="dimmed">{user.email}</Text>
          </div>
        </Group>
      </Table.Td>

      <Table.Td>
        {activeTab === 'active' ? (
          <RoleBadge roleName={(user as UserWithRole).role?.name} />
        ) : (
          <Text size="sm">
            {user.deletedAt 
              ? new Date(user.deletedAt).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) 
              : 'Desconocida'}
          </Text>
        )}
      </Table.Td>
      
      <Table.Td>
        <Group gap={0} justify="center">
          {/* VISTA ACTIVOS */}
          {activeTab === 'active' && (user as UserWithRole).role?.name !== Roles.ADMIN && (
            <>
              <Can permission={PERMISSIONS.USER_UPDATE_ROLE}>
                <ActionIcon title="Cambiar Rol" variant="subtle" color="darkblue" onClick={() => handleOpenRoleModal(user)}>
                  <IconUsersGroup size={16} />
                </ActionIcon>
              </Can>
              <Can permission={PERMISSIONS.USER_UPDATE}>
                <ActionIcon title="Editar" variant="subtle" color="gray" onClick={() => handleEdit(user)}>
                  <IconEdit size={16} />
                </ActionIcon>
              </Can>
              <Can permission={PERMISSIONS.USER_DELETE}>
                <ActionIcon title="Eliminar" variant="subtle" color="red" onClick={() => handleDeleteClick(user)}>
                  <IconTrash size={18} />
                </ActionIcon>
              </Can>
            </>
          )}

          {/* VISTA ELIMINADOS */}
          {activeTab === 'deleted' && (
            <Can permission={PERMISSIONS.USER_RESTORE}>
              <Tooltip label="Restaurar Usuario" withArrow>
                <ActionIcon
                  variant="subtle"
                  color="green"
                  onClick={() => restoreUser(user.id)}
                >
                  <IconRefresh size={20} />
                </ActionIcon>
              </Tooltip>
            </Can>
          )}
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const modalsContent = (
    <>
      <UserFormModal opened={opened} close={close} userToEdit={userToEdit} />

      <Modal opened={deleteOpened} onClose={closeDelete} closeOnClickOutside={false} title="Confirmar Eliminación" centered>
        <Text size="sm" mb="xl">
          ¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete?.fullName}</strong>?<br />
          Esta acción se puede revertir desde la papelera.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={closeDelete} disabled={isDeleting}>Cancelar</Button>
          <Button color="red" onClick={handleConfirmDelete} loading={isDeleting}>Sí, Eliminar</Button>
        </Group>
      </Modal>

      <ChangeRoleModal opened={roleModalOpened} close={closeRoleModal} user={selectedUser} />
    </>
  );

  return (
    <div style={{ padding: '20px' }}>
      <Title order={2} mb="lg">Gestión de Usuarios</Title>
      
      <Tabs value={activeTab} onChange={setActiveTab} variant="outline" radius="md">
        <Tabs.List mb="md">
          <Can permission={PERMISSIONS.USER_VIEW}>
            <Tabs.Tab value="active" leftSection={<IconUserCheck size={16} />}>Activos</Tabs.Tab>
          </Can>
          <Can permission={PERMISSIONS.USER_VIEW_DELETED}>
            <Tabs.Tab value="deleted" color="red" leftSection={<IconTrash size={16} />}>Eliminados</Tabs.Tab>
          </Can>
        </Tabs.List>
        <Tabs.Panel value="active">
          <Can permission={PERMISSIONS.USER_VIEW}>
            <CrudLayout
              title={activeTab === 'active' ? "Usuarios Activos" : "Usuarios Eliminados"}
              buttonLabel="Nuevo Usuario"
              onAddNew={handleCreateNew}
              isLoading={currentLoading} // 👈 Usamos la variable unificada
              tableHeaders={headers}
              tableRows={rows}
              modals={modalsContent}
              requiredCreatePermissions={PERMISSIONS.USER_CREATE}
              hideCreateButton={activeTab === 'deleted'}
            />
          </Can>
        </Tabs.Panel>
        <Tabs.Panel value="deleted">
          <Can permission={PERMISSIONS.USER_VIEW_DELETED}>
            <CrudLayout
              title={activeTab === 'active' ? "Usuarios Activos" : "Usuarios Eliminados"}
              buttonLabel="Nuevo Usuario"
              onAddNew={handleCreateNew}
              isLoading={currentLoading} // 👈 Usamos la variable unificada
              tableHeaders={headers}
              tableRows={rows}
              modals={modalsContent}
              requiredCreatePermissions={PERMISSIONS.USER_CREATE}
              hideCreateButton={activeTab === 'deleted'}
            />
          </Can>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};