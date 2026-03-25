// components/layout/FilterBar.tsx
import { SimpleGrid, TextInput, ActionIcon, Tooltip, Group } from '@mantine/core';
import { IconSearch, IconFilterOff } from '@tabler/icons-react';
import type { ReactNode } from 'react';

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
  children?: ReactNode; // Aquí irán los Selects o DatePickers específicos
}

export const FilterBar = ({
  searchPlaceholder = "Buscar...",
  searchValue,
  onSearchChange,
  onClear,
  children
}: FilterBarProps) => {
  return (
    <Group align="flex-end" gap="xs">
      <SimpleGrid 
        cols={{ base: 1, sm: 2, md: 4 }} // Se adapta solo a mobile/desktop
        spacing="sm" 
        style={{ flex: 1 }}
      >
        {/* El buscador casi siempre es obligatorio */}
        <TextInput
          placeholder={searchPlaceholder}
          leftSection={<IconSearch size={16} />}
          value={searchValue}
          onChange={(e) => onSearchChange(e.currentTarget.value)}
        />

        {/* Aquí caen los filtros extra que le pases (Selects, etc.) */}
        {children}
      </SimpleGrid>

      {/* Botón de limpiar siempre a mano */}
      <Tooltip label="Limpiar filtros">
        <ActionIcon 
          variant="light" 
          color="gray" 
          size="lg" 
          onClick={onClear}
          disabled={!searchValue && !children} // Opcional: lógica de habilitación
        >
          <IconFilterOff size={20} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};