import React from 'react';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconTrash, IconRefresh, IconExclamationCircle } from '@tabler/icons-react';

const autoCloseTime = 2000;

export const notificationService = {
  // Success notifications
  success: (title: string, message: string) => {
    notifications.show({
      title,
      message,
      color: 'green',
      icon: <IconCheck size={18} />,
      autoClose: autoCloseTime,
    });
  },

  // Error notifications
  error: (title: string, message: string) => {
    notifications.show({
      title,
      message,
      color: 'red',
      icon: <IconExclamationCircle size={18} />,
      autoClose: autoCloseTime,
    });
  },

  // Entity-specific notifications
  entityCreated: (entityName: string, displayName?: string) => {
    notificationService.success(
      `${entityName} creado`,
      displayName
        ? `${displayName} fue agregado al sistema.`
        : `El ${entityName} fue creado correctamente.`
    );
  },

  entityUpdated: (entityName: string, displayName?: string) => {
    notificationService.success(
      `${entityName} actualizado`,
      displayName
        ? `${displayName} fue modificado correctamente.`
        : `El ${entityName} fue actualizado.`
    );
  },

  entityDeleted: (entityName: string, displayName?: string) => {
    notifications.show({
      title: `${entityName} eliminado`,
      message: displayName
        ? `${displayName} fue enviado a la papelera.`
        : `El ${entityName} fue eliminado del sistema.`,
      color: 'green',
      icon: <IconTrash size={18} />,
      autoClose: autoCloseTime,
    });
  },

  entityRestored: (entityName: string, displayName?: string) => {
    notifications.show({
      title: `${entityName} restaurado`,
      message: displayName
        ? `${displayName} volvió a estar activo.`
        : `El ${entityName} fue restaurado correctamente.`,
      color: 'green',
      icon: <IconRefresh size={18} />,
      autoClose: autoCloseTime,
    });
  },

  deletionFailed: (entityName: string) => {
    notificationService.error(
      `Error al eliminar`,
      `No se pudo eliminar el ${entityName}. Intentá de nuevo.`
    );
  },

  restorationFailed: (entityName: string) => {
    notificationService.error(
      `Error al restaurar`,
      `No se pudo restaurar el ${entityName}. Intentá de nuevo.`
    );
  },

  creationFailed: (entityName: string) => {
    notificationService.error(
      `Error al crear`,
      `No se pudo crear el ${entityName}. Intentá de nuevo.`
    );
  },

  updateFailed: (entityName: string) => {
    notificationService.error(
      `Error al actualizar`,
      `No se pudo actualizar el ${entityName}. Intentá de nuevo.`
    );
  },

  changeStatusFailed: (entityName: string) => {
    notificationService.error(
      `Error al cambiar estado`,
      `No se pudo cambiar el estado del ${entityName}. Intentá de nuevo.`
    );
  },
};
