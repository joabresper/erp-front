import { Modal, Button, Group, Text } from '@mantine/core';
import type { ReactNode, FormEvent } from 'react';

interface Props {
  opened: boolean;
  onClose: () => void;
  title: string;
  isEditing: boolean;
  isSaving: boolean;
  onSubmit: (e?: FormEvent<HTMLFormElement>) => void; // Recibe el submit del useForm
  children: ReactNode; // Aquí van a inyectarse los TextInputs
}

export const CrudFormModal = ({ 
  opened, 
  onClose, 
  title, 
  isEditing, 
  isSaving, 
  onSubmit, 
  children 
}: Props) => {
  return (
    <Modal 
      opened={opened}
      onClose={onClose}
      closeButtonProps={{ onClick: onClose }}
	  closeOnClickOutside={false}
      title={title}
    >
      {/* El formulario envuelve dinámicamente lo que le pases */}
      <form onSubmit={onSubmit}>
        
        {/* Aquí adentro caerán los inputs específicos */}
        {children}
        
        <Text size="xs" mt="md" c="gray.8">
            Los campos marcados con * son obligatorios
        </Text>
        
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={isSaving}>
              {isEditing ? "Actualizar" : "Guardar"}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};