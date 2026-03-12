import { useEffect } from 'react';
import { TextInput, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { CrudFormModal } from '../../../components/layout/CrudFormModal';
import { useCreateRole, useUpdateRole } from '../useRoles';

interface Props {
  opened: boolean;
  close: () => void;
  roleToEdit?: any | null;
}

export const RoleFormModal = ({ opened, close, roleToEdit }: Props) => {
  const isEditing = !!roleToEdit;
  const { mutate: createRole, isPending: isCreating } = useCreateRole();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole();

  const form = useForm({
    initialValues: {
      name: '',
      level: 1,
      description: '',
    },
    validate: {
      name: (val) => (val.length < 2 ? 'Nombre requerido' : null),
      level: (val) => (val < 1 ? 'El nivel debe ser mayor a 0' : null),
    },
  });

  useEffect(() => {
    if (opened && roleToEdit) {
      form.setValues({
        name: roleToEdit.name,
        level: roleToEdit.level,
        description: roleToEdit.description || '',
      });
    } else if (opened && !roleToEdit) {
      form.reset();
    }
  }, [opened, roleToEdit]);

  const handleSubmit = (values: typeof form.values) => {
    if (isEditing) {
		const updatePayload = {
			name: values.name,
			description: values.description,
			level: values.level,
		};
		
		updateRole(
			{ id: roleToEdit.id, data: updatePayload }, 
			{ onSuccess: handleCancelAndClear }
		);
	} else {
		const createPayload = {
			...values
		};
		createRole(createPayload, { onSuccess: handleCancelAndClear });
	}
  };

  const handleCancelAndClear = () => {
    form.reset();
    close();
  };

  return (
    <CrudFormModal
      opened={opened}
      onClose={handleCancelAndClear}
      title={isEditing ? "Editar Rol" : "Crear Nuevo Rol"}
      isEditing={isEditing}
      isSaving={isCreating || isUpdating}
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <TextInput label="Nombre del Rol" placeholder="Ej: SUPERVISOR" required {...form.getInputProps('name')} />
      
      <TextInput label="Descripción" mt="sm" placeholder="Opcional" required {...form.getInputProps('description')} />

      <NumberInput label="Nivel de Acceso (1 a 100)" mt="sm" required min={1} max={100} {...form.getInputProps('level')} />
    </CrudFormModal>
  );
};