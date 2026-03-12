import { Group, Title, Button, Card, Table, LoadingOverlay } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { Can } from '../common/Can';

interface Props {
  title: string;
  buttonLabel: string;
  onAddNew: () => void;
  isLoading?: boolean;
  // Encabezados de la tabla
  tableHeaders: ReactNode; 
  // Filas de la tabla
  tableRows: ReactNode; 
  // El modal específico que se inyecta
  modals?: ReactNode;
  requiredCreatePermissions?: string; // Permiso requerido para mostrar el botón de creación
}

export const CrudLayout = ({ 
  title, 
  buttonLabel, 
  onAddNew, 
  isLoading, 
  tableHeaders, 
  tableRows, 
  modals,
  requiredCreatePermissions,
}: Props) => {
  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      {/* Título y Botón Principal */}
      <Group justify="space-between" mb="lg">
        <Title order={2}>{title}</Title>
        <Can permission={requiredCreatePermissions}>
          <Button leftSection={<IconPlus size={14} />} onClick={onAddNew}>
            {buttonLabel}
          </Button>
        </Can>
      </Group>

      {/* Esqueleto de la Tabla */}
      <Card withBorder radius="md" pos="relative">
        <LoadingOverlay visible={!!isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        <Table verticalSpacing="sm" striped highlightOnHover>
          <Table.Thead>
            {tableHeaders}
          </Table.Thead>
          <Table.Tbody>
			{isLoading ? <Table.Tr><Table.Td>Cargando...</Table.Td></Table.Tr> : tableRows}
		  </Table.Tbody>
        </Table>
      </Card>

      {/* Zona para Modales */}
      {modals}
    </div>
  );
};