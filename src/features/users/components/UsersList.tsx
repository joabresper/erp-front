import { Table, Group, Text, ActionIcon, Button, Modal } from '@mantine/core';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { UserFormModal } from './UserFormModal';
import { Roles } from '../../../constants/roles';
import { useDeleteUser, useUsers } from '../useUser';
import { useState } from 'react';
import { RoleBadge } from '../../../components/common/RoleBadge';
import { CrudLayout } from '../../../components/layout/CrudLayout';
import { PERMISSIONS } from '../../../constants/permissions';
import { Can } from '../../../components/common/Can';

export const UsersList = () => {
  const { data: users, isLoading } = useUsers();
  const [opened, { open, close }] = useDisclosure(false);

  const [userToEdit, setUserToEdit] = useState<any | null>(null);
  // Estados para la modal de eliminación
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  // Funcion para abrir el modal de confirmacion de eliminacion
  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    openDelete();
  };
  // Manejador para confirmar y disparar la API
  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id, {
        onSuccess: () => {
          closeDelete();
          setUserToDelete(null); // Limpiamos el estado
        }
      });
    }
  };

  // Función para abrir el modal en modo CREAR
  const handleCreateNew = () => {
    setUserToEdit(null);
    open();
  };

  // Función para abrir el modal en modo EDITAR
  const handleEdit = (user: any) => {
    setUserToEdit(user);
    open();
  };

  const headers = (
    <Table.Tr>
      <Table.Th>Usuario</Table.Th>
      <Table.Th>Rol</Table.Th>
      <Table.Th ta="center" >Acciones</Table.Th>
    </Table.Tr>
  );

  const rows = users?.map((user) => (
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
        <RoleBadge roleName={user.role.name} />
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="center">
          <Can permission={PERMISSIONS.USER_UPDATE} >
            <ActionIcon variant="subtle" color="gray">
              <IconEdit size={16} onClick={() => handleEdit(user)}/>
            </ActionIcon>
          </Can>
          <Can permission={PERMISSIONS.USER_DELETE} >
          {user.role?.name !== Roles.ADMIN && (
            <ActionIcon 
              variant="subtle" 
              color="red" 
              onClick={() => handleDeleteClick(user)}
            >
              <IconTrash size={18} />
            </ActionIcon>
          )}
          </Can>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const modalsContent = (
    <>
      <UserFormModal opened={opened} close={close} userToEdit={userToEdit} />

      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        closeOnClickOutside={false}
        title="Confirmar Eliminación"
        centered
      >
        <Text size="sm" mb="xl">
          ¿Estás seguro de que deseas eliminar al usuario{' '}
          <strong>{userToDelete?.fullName}</strong>?<br />
          Esta acción no se puede deshacer.
        </Text>

        <Group justify="flex-end">
          <Button variant="default" onClick={closeDelete} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button color="red" onClick={handleConfirmDelete} loading={isDeleting}>
            Sí, Eliminar
          </Button>
        </Group>
      </Modal>
    </>
  );

  return (
    <CrudLayout
      title="Gestión de Usuarios"
      buttonLabel="Nuevo Usuario"
      onAddNew={handleCreateNew}
      isLoading={isLoading}
      tableHeaders={headers}
      tableRows={rows}
      modals={modalsContent}
      requiredCreatePermissions={PERMISSIONS.USER_CREATE}
    />
  );
};