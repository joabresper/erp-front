import { useEffect } from 'react';
import { Modal, TextInput, Select, PasswordInput, Button, Group, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCreateUser } from '../useUser';
import { useUpdateUser } from '../useUser';
import { useRoles } from '../../roles/useRoles';
import { useProfile } from '../../auth/useProfile';

interface Props {
  opened: boolean;
  close: () => void;
  userToEdit?: any | null;
}

export const UserFormModal = ({ opened, close, userToEdit }: Props) => {
    const { data: rolesData, isLoading: loadingRoles } = useRoles();
    const { data: currentUser } = useProfile();
    const currentUserRoleLevel = currentUser?.role?.level;
    
    // Aquí habías renombrado mutate a createUser y updateUser
    const { mutate: createUser, isPending: isCreating } = useCreateUser();
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
    
    const isEditing = !!userToEdit;

    const form = useForm({
        initialValues: {
            fullName: '',
            email: '',
            password: '',
            roleId: '',
            phone: '',
            address: '',
        },
        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Email inválido'),
            fullName: (val) => (val.length < 2 ? 'Nombre requerido' : null),
            password: (val) => {
                // Si NO estamos editando, exigimos la contraseña
                if (!isEditing && val.length < 6) return 'Mínimo 6 caracteres';
                return null;
            },
            roleId: (val) => (!isEditing && !val ? 'Debe seleccionar un rol' : null),
            phone: (val) => (val.length > 12 ? 'Máximo 12 caracteres' : null),
        },
    });

    // LA MAGIA: Cuando el modal se abre, revisamos si hay un usuario para editar
    useEffect(() => {
        if (opened && userToEdit) {
            form.setValues({
                fullName: userToEdit.fullName || '',
                email: userToEdit.email || '',
                password: '', // Lo dejamos vacío porque no se muestra
                // Aseguramos que el rol sea un string para el Select
                roleId: userToEdit.roleId?.toString() || userToEdit.role?.id?.toString() || '',
                phone: userToEdit.phone || '',
                address: userToEdit.address || '',
            });
        } else if (opened && !userToEdit) {
            // Si se abre para crear, limpiamos todo
            form.reset();
        }
    }, [opened, userToEdit]);

    const getFilteredRolesOptions = () => {
        if (!rolesData || currentUserRoleLevel === undefined) return [];

        return rolesData
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

    const handleSubmit = (values: typeof form.values) => {
        if (isEditing) {
            const updatePayload = {
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                address: values.address,
            };
            
            updateUser(
                { id: userToEdit.id, data: updatePayload }, 
                { onSuccess: handleCancelAndClear }
            );
        } else {
            const createPayload = {
                ...values,
                roleId: values.roleId
            };
            createUser(createPayload, { onSuccess: handleCancelAndClear });
        }
    };

    const handleCancelAndClear = () => {
        form.reset();
        close();
    };

  return (
    <Modal 
        opened={opened}
        onClose={close}
        closeButtonProps={{ onClick: handleCancelAndClear }}
        title={isEditing ? "Editar Usuario" : "Crear Nuevo Usuario"}
    >
      <form onSubmit={form.onSubmit(handleSubmit, (error) => console.log('Validation Errors:', error))}>
        <TextInput label="Nombre" placeholder="Juan Pérez" required={!isEditing} {...form.getInputProps('fullName')} />
        <TextInput label="Email" mt="sm" placeholder="juan@erp.com" required={!isEditing} {...form.getInputProps('email')} />
        
        {/* CONDICIONAL: Solo mostramos la contraseña si NO estamos editando */}
        {!isEditing && (
            <PasswordInput label="Contraseña" mt="sm" required {...form.getInputProps('password')} />
        )}
        
        <Select 
          label="Rol Asignado" 
          mt="sm"
          placeholder='Seleccione un rol'
          data={getFilteredRolesOptions()}
          disabled={loadingRoles || isEditing}
          allowDeselect={false}
          required={!isEditing}
          {...form.getInputProps('roleId')}
        />

        <TextInput label="Teléfono" mt="sm" placeholder="Opcional" {...form.getInputProps('phone')} />
        <TextInput label="Dirección" mt="sm" placeholder="Opcional" {...form.getInputProps('address')} />
        <Text size="xs" mt="xs" c="gray.8">
            Los campos marcados con * son obligatorios
        </Text>
        
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={handleCancelAndClear}>Cancelar</Button>
          
          <Button type="submit" loading={isCreating || isUpdating}>
              {isEditing ? "Actualizar" : "Guardar"}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};