import { Table, Group, Text, ActionIcon, Button, Badge, Card, Title, Modal } from '@mantine/core';
import { IconTrash, IconEdit, IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { UserFormModal } from './UserFormModal';
import { Roles } from '../../../constants/roles';
import { useDeleteUser, useUsers } from '../useUser';
import { useState } from 'react';

export const UsersList = () => {
  const { data: users, isLoading } = useUsers();
  const [opened, { open, close }] = useDisclosure(false);

  const [userToEdit, setUserToEdit] = useState<any | null>(null);
  // Eliminacion
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

  // Mapeo de colores para los badges
  const roleColors: Record<string, string> = {
    [Roles.ADMIN]: 'red',
    [Roles.GERENTE]: 'blue',
    [Roles.USER]: 'green',
  };

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
        <Badge color={roleColors[user.role.name] || 'gray'}>
          {user.role.name}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon variant="subtle" color="gray">
            <IconEdit size={16} onClick={() => handleEdit(user)}/>
          </ActionIcon>
          {user.role?.name !== Roles.ADMIN && (
            <ActionIcon 
              variant="subtle" 
              color="red" 
              onClick={() => handleDeleteClick(user)}
            >
              <IconTrash size={18} />
            </ActionIcon>
          )}
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div style={{ padding: '20px' }}>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Usuarios del Sistema</Title>
        <Button leftSection={<IconPlus size={14} />} onClick={handleCreateNew}>
          Nuevo Usuario
        </Button>
      </Group>

      <Card withBorder radius="md">
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Usuario</Table.Th>
              <Table.Th>Rol</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{isLoading ? <Table.Tr><Table.Td>Cargando...</Table.Td></Table.Tr> : rows}</Table.Tbody>
        </Table>
      </Card>

      <UserFormModal opened={opened} close={close} userToEdit={userToEdit} />

      <Modal
        opened={deleteOpened} // Tu estado de apertura
        onClose={closeDelete} // Tu función para cerrar
        title="Confirmar Eliminación"
        centered
      >
        <Text size="sm" mb="xl">
          ¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete?.fullName}</strong>? 
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
    </div>
  );
};