// components/layout/FilterBar.tsx
import { TextInput, ActionIcon, Tooltip, Group, Select } from '@mantine/core';
import { IconSortAscending, IconSortDescending, IconX } from '@tabler/icons-react';
import type { ReactNode } from 'react';

interface FilterBarProps {
  // Props de busqueda
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
  // Props de ordenamiento
  sortOptions?: { label: string; value: string }[];
  sortField: string | null;
  sortOrder?: 'asc' | 'desc';
  onSortFieldChange: (value: string | null) => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  // Props de otros selects
  children?: ReactNode;
}

export const FilterBar = ({
  searchPlaceholder = "Buscar...",
  searchValue,
  onSearchChange,
  onClear,
  sortOptions,
  sortField,
  sortOrder,
  onSortFieldChange,
  onSortOrderChange,
  children
}: FilterBarProps) => {
  return (
    <Group justify="space-between" mb="md">
      <Group flex={1}>
        <TextInput
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.currentTarget.value)}
          rightSection={searchValue && (
            <ActionIcon variant="transparent" color="gray" onClick={onClear}>
              <IconX size={16} />
            </ActionIcon>
          )}
          style={{ flexGrow: 1, maxWidth: 400 }}
        />
        
        {/* Aquí se inyectan los filtros extra como el Select de Tipo */}
        {children}
      </Group>

      <Group gap="xs">
        <Select
          placeholder="Ordenar por"
          data={sortOptions}
          value={sortField}
          onChange={onSortFieldChange}
          allowDeselect={false}
          w={160}
        />
        
        <Tooltip label={sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}>
          <ActionIcon 
            variant="light" 
            size="lg" 
            color="blue"
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? <IconSortAscending size={20} /> : <IconSortDescending size={20} />}
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  );
};