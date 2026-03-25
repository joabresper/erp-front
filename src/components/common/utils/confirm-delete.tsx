import { modals } from '@mantine/modals';
import { Text } from '@mantine/core';

export const confirmDelete = (itemName: string, onConfirm: () => void) => {
  modals.openConfirmModal({
    title: 'Confirmar eliminación',
    centered: true,
    children: (
      <Text size="sm">
        ¿Estás seguro de que querés eliminar <b>{itemName}</b>? Esta acción es irreversible.
      </Text>
    ),
    labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
    confirmProps: { color: 'red' },
    onConfirm,
  });
};