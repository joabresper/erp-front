import { Group, Title, Button, Card, Table, LoadingOverlay, Box } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks'; // 1. Importamos el hook
import type { ReactNode } from 'react';
import { Can } from '../common/Can';

interface Props {
  title: string;
  buttonLabel: string;
  hideCreateButton?: boolean;
  onAddNew: () => void;
  isLoading?: boolean;
  filterSection?: ReactNode; // Para inyectar el FilterBar u otros filtros
  tableHeaders: ReactNode; 
  tableRows: ReactNode; 
  modals?: ReactNode;
  requiredCreatePermissions?: string;
  // 2. Agregamos la prop para la vista de celular
  mobileView?: ReactNode; 
}

export const CrudLayout = ({ 
  title, 
  buttonLabel,
  hideCreateButton = false,
  onAddNew, 
  isLoading,
  filterSection,
  tableHeaders, 
  tableRows, 
  modals,
  requiredCreatePermissions,
  mobileView
}: Props) => {
  // 3. Detectamos si es celular (768px es el estándar de Mantine para 'sm')
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div style={{ padding: isMobile ? '10px' : '20px', position: 'relative' }}>
      <Group justify="space-between" mb="lg">
        <Title order={isMobile ? 3 : 2}>{title}</Title>
        {!hideCreateButton && (
          <Can permission={requiredCreatePermissions}>
            <Button 
              leftSection={<IconPlus size={14} />} 
              onClick={onAddNew}
              fullWidth={isMobile} // El botón ocupa todo el ancho en celular
            >
              {buttonLabel}
            </Button>
          </Can>
        )}
      </Group>
      
      {/* Sección de filtros */}
      {filterSection && (
        <Box mb="md">
          {filterSection}
        </Box>
      )}

      {/* 4. Contenedor con LoadingOverlay que envuelve ambas vistas */}
      <Box pos="relative">
        <LoadingOverlay visible={!!isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

        {isMobile && mobileView ? (
          /* VISTA MOBILE: Se inyectan las Cards directamente */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {isLoading ? <p>Cargando datos...</p> : mobileView}
          </div>
        ) : (
          /* VISTA DESKTOP: La tabla de siempre dentro de su Card */
          <Card withBorder radius="md">
            <Table verticalSpacing="sm" striped highlightOnHover>
              <Table.Thead>
                {tableHeaders}
              </Table.Thead>
              <Table.Tbody>
                {isLoading ? (
                  <Table.Tr><Table.Td colSpan={10}>Cargando...</Table.Td></Table.Tr>
                ) : (
                  tableRows
                )}
              </Table.Tbody>
            </Table>
          </Card>
        )}
      </Box>

      {modals}
    </div>
  );
};