import { useState } from 'react';
import { Table, Group, ActionIcon, Modal, Button, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconTrash, IconUserCog } from '@tabler/icons-react';
import { useDeleteRole, useRoles } from '../useRoles';
import { RoleBadge } from '../../../components/common/RoleBadge';
import { CrudLayout } from '../../../components/layout/CrudLayout';
import { RoleFormModal } from './RoleFormModal';
import { RolePermissionsDrawer } from './RolesPermissionsDrawer';
import { PERMISSIONS } from '../../../constants/permissions';
import { Can } from '../../../components/common/Can';

export const RolesList = () => {
  const { data: roles, isLoading } = useRoles();
  
  // Estados para el Modal
  const [opened, { open, close }] = useDisclosure(false);
  const [roleToEdit, setRoleToEdit] = useState<any | null>(null);

  // Estados para la modal de eliminación
	const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
	const [roleToDelete, setRoleToDelete] = useState<any | null>(null);

  // Estados para el drawer de permisos
  const [permissionsOpened, { open: openPermissions, close: closePermissions }] = useDisclosure(false);
  const [roleForPermissions, setRoleForPermissions] = useState<any | null>(null);

	const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole();
	// Funcion para abrir el modal de confirmacion de eliminacion
	const handleDeleteClick = (role: any) => {
		setRoleToDelete(role);
		openDelete();
	};
	// Manejador para confirmar y disparar la API
	const handleConfirmDelete = () => {
		if (roleToDelete) {
		deleteRole(roleToDelete.id, {
			onSuccess: () => {
			closeDelete();
			setRoleToDelete(null); // Limpiamos el estado
			}
		});
		}
	};

  const handleCreateNew = () => {
    setRoleToEdit(null);
    open();
  };

  const handleEdit = (role: any) => {
    setRoleToEdit(role);
    open();
  };

  const handleOpenPermissions = (role: any) => {
    setRoleForPermissions(role);
    openPermissions();
  };

  // 1. Definimos los Encabezados específicos para Roles
  const headers = (
    <Table.Tr>
      <Table.Th>Rol</Table.Th>
	  <Table.Th>Descripción</Table.Th>
      <Table.Th>Nivel (Jerarquía)</Table.Th>
      <Table.Th ta="center" >Acciones</Table.Th>
    </Table.Tr>
  );

  // 2. Mapeamos las Filas específicas para Roles
  const rows = roles?.map((role) => (
    <Table.Tr key={role.id}>
      <Table.Td>
        <RoleBadge roleName={role.name} />
      </Table.Td>
	  <Table.Td>{role.description}</Table.Td>
      <Table.Td>{role.level}</Table.Td>
      <Table.Td>
        <Group gap={0} justify="center">
          <Can permission={PERMISSIONS.ROLE_UPDATE_PERMISSIONS} >
            <ActionIcon
              title="Gestionar Permisos"
              variant="subtle"
              color="darkblue"
              onClick={() => handleOpenPermissions(role)} >
              <IconUserCog size={16} />
            </ActionIcon>
          </Can>
          <Can permission={PERMISSIONS.ROLE_UPDATE} >
            <ActionIcon
              title="Editar Rol"
              variant="subtle"
              color="gray"
              onClick={() => handleEdit(role)} >
              <IconEdit size={16} />
            </ActionIcon>
          </Can>
          <Can permission={PERMISSIONS.ROLE_DELETE} >
            <ActionIcon
            title="Eliminar Rol"
            variant="subtle"
            color="red"
            onClick={() => handleDeleteClick(role)} >
              <IconTrash size={18} />
            </ActionIcon>
          </Can>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const modalsContent = (
	  <>
		<RoleFormModal opened={opened} close={close} roleToEdit={roleToEdit} />

    <RolePermissionsDrawer 
        opened={permissionsOpened} 
        close={closePermissions} 
        role={roleForPermissions} 
    />
  
		<Modal
		  opened={deleteOpened}
		  onClose={closeDelete}
		  closeOnClickOutside={false}
		  title="Confirmar Eliminación"
		  centered
		>
		  <Text size="sm" mb="xl">
			¿Estás seguro de que deseas eliminar el rol{' '}
			<strong>{roleToDelete?.name}</strong>?<br />
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
      title="Gestión de Roles"
      buttonLabel="Nuevo Rol"
      onAddNew={handleCreateNew}
      isLoading={isLoading}
      tableHeaders={headers}
      tableRows={rows}
      modals={modalsContent}
      requiredCreatePermissions={PERMISSIONS.ROLE_CREATE}
    />
  );
};