import { Modal, Button, Group, Select, Text, Stack, LoadingOverlay } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useRoles } from '../../roles/useRoles';
import { useChangeUserRole } from '../useUser';
import { useProfile } from '../../auth/useProfile';

interface Props {
  opened: boolean;
  close: () => void;
  user: any | null;
}

export const ChangeRoleModal = ({ opened, close, user }: Props) => {
  const { data: roles, isLoading: loadingRoles } = useRoles();
  const { mutate: changeRole, isPending } = useChangeUserRole();
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  // Sincronizamos el select con el rol actual del usuario al abrir
  useEffect(() => {
    if (user?.role?.id) {
      setSelectedRoleId(user.role.id);
    }
  }, [user]);

  const handleSave = () => {
    if (user && selectedRoleId) {
      changeRole({ userId: user.id, newRoleId: { roleId: selectedRoleId } }, {
        onSuccess: () => {
          close();
        }
      });
    }
  };

  const { data: currentUser } = useProfile();
  const currentUserRoleLevel = currentUser?.role?.level;
  const getFilteredRolesOptions = () => {
        if (!roles || currentUserRoleLevel === undefined) return [];

        return roles
        .filter(role => {
            const userLvl = Number(currentUserRoleLevel);
            const roleLvl = Number(role.level);
            if (userLvl <= roleLvl) return false; 
            return true; 
        })
        .map(role => ({
            value: role.id.toString(), 
            label: role.name,          
        }));
    };

  return (
    <Modal 
      opened={opened} 
      onClose={close} 
      title={<Text fw={700}>Cambiar Rol de Usuario</Text>}
      centered
      size="sm"
    >
      <LoadingOverlay visible={isPending || loadingRoles} />
      
      <Stack>
        <Text size="sm">
          Estás cambiando el nivel de acceso para: <strong>{user?.name}</strong>
        </Text>

        <Select
          label="Selecciona el nuevo rol"
          placeholder="Elegí un rol"
          data={getFilteredRolesOptions()}
          value={selectedRoleId}
          onChange={setSelectedRoleId}
          allowDeselect={false}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={close}>Cancelar</Button>
          <Button 
            color="blue" 
            onClick={handleSave} 
            disabled={selectedRoleId === user?.role?.id} // Bloqueamos si es el mismo
          >
            Actualizar Rol
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};