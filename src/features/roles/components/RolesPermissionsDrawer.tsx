import { useState, useEffect } from 'react';
import { Drawer, Button, Group, Checkbox, Stack, Text, LoadingOverlay, Box, ScrollArea } from '@mantine/core';
import { usePermissions } from '../usePermissions';
import { useUpdateRolePermissions } from '../useRoles';
import type { Permission } from '../types';

interface Props {
  opened: boolean;
  close: () => void;
  role: any | null; // Recibimos el rol con sus permisos actuales
}

export const RolePermissionsDrawer = ({ opened, close, role }: Props) => {
  // Todos los permisos disponibles en la BD
  const { data: allPermissions, isLoading: loadingPerms } = usePermissions();
  
  const { mutate: updatePermissions, isPending: isUpdating } = useUpdateRolePermissions();

  // Guardamos un arreglo con los IDs de los permisos que el usuario va tildando
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Cuando se abre el drawer, pre-cargamos los permisos que el rol YA TIENE
  useEffect(() => {
    if (opened && role) {
      const currentIds = role.permissions?.map((p: Permission) => p.id) || [];
      setSelectedIds(currentIds);
    }
  }, [opened, role]);

  const handleSave = () => {
    if (!role) return;
    
    // Llamamos al método que actualiza los permisos enviando el arreglo limpio
    updatePermissions(
      { roleId: role.id, permissionIds: selectedIds },
      { onSuccess: close }
    );
    close(); // Borrar esto cuando habilites la mutación
  };

  // Transformamos el array plano en un objeto tipo: { USER: [...], ROLE: [...] }
  const groupedPermissions = allPermissions?.reduce((acc, perm) => {
    // Extraemos el recurso (ej: de "USER:CREATE" sacamos "USER")
    const [resource] = perm.name.split(':');
    
    // Si es la primera vez que vemos este recurso, creamos el array
    if (!acc[resource]) {
      acc[resource] = [];
    }
    
    // Metemos el permiso en su array
    acc[resource].push(perm);
    return acc;
  }, {} as Record<string, typeof allPermissions>) || {};

  return (
    <Drawer
      opened={opened}
      onClose={close}
      title={<Text fw={700}>Permisos: {role?.name}</Text>}
      position="right" // Se desliza desde la derecha
      size="md" // Ancho del panel
	  styles={{
        body: {
          height: 'calc(100vh - 60px)', // Alto total de la pantalla menos el título del Drawer
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <LoadingOverlay visible={loadingPerms} />
      
	  <Box mb="md">
        <Text size="sm" fw={500}>Selecciona los permisos para este rol</Text>
        <Text size="xs" c="dimmed">
          Los cambios afectarán a todos los usuarios con este rol.
        </Text>
      </Box>

	  <ScrollArea style={{ flex: 1 }} type="scroll">
      {/* Checkbox.Group maneja automáticamente el arreglo de IDs */}
      <Checkbox.Group
        value={selectedIds}
        onChange={setSelectedIds}
      >
        {Object.entries(groupedPermissions).map(([resource, perms]) => (
          <Box key={resource} mb="md">
            <Text fw={700} size="xs" c="dimmed" mb="xs" tt="uppercase" style={{ borderBottom: '1px solid #eee' }}>
              {resource}
            </Text>
            <Stack mt="md" gap="sm">
              {perms.map((perm: Permission) => (
                <Checkbox 
                  key={perm.id} 
                  value={perm.id} 
                  label={perm.name.split(':')[1]} // Mostrar solo la acción (ej: "CREATE" en vez
                  description={perm.description}
                />
              ))}
            </Stack>
          </Box>
        ))}
      </Checkbox.Group>
	  </ScrollArea>

      <Box pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
        <Group justify="flex-end">
          <Button variant="default" onClick={close}>
            Cancelar
          </Button>
          <Button onClick={handleSave} loading={isUpdating}>
            Guardar Cambios
          </Button>
        </Group>
      </Box>
    </Drawer>
  );
};