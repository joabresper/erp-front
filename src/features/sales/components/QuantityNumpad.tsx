import { Button, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconBackspace } from '@tabler/icons-react';

interface Props {
  value: string;
  allowDecimal?: boolean;
  onInput: (char: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'BACKSPACE'],
];

export const QuantityNumpad = ({ value, allowDecimal = true, onInput, onBackspace, onClear }: Props) => {
  return (
    <Stack gap="sm">
      <Paper withBorder p="md" radius="md">
        <Text fw={800} size="xl" ta="center" style={{ lineHeight: 1.1 }}>
          {value || '0'}
        </Text>
      </Paper>

      <SimpleGrid cols={3} spacing="xs">
        {KEYS.flatMap((row) => row).map((key) => {
          if (key === 'BACKSPACE') {
            return (
              <Button key={key} variant="light" color="dark" size="lg" onClick={onBackspace} leftSection={<IconBackspace size={16} />}>
                Borrar
              </Button>
            );
          }

          if (key === '.') {
            return (
              <Button
                key={key}
                variant="light"
                color="dark"
                size="lg"
                onClick={() => {
                  if (allowDecimal) onInput('.');
                }}
                disabled={!allowDecimal}
              >
                .
              </Button>
            );
          }

          return (
            <Button key={key} variant="light" color="dark" size="lg" onClick={() => onInput(key)}>
              {key}
            </Button>
          );
        })}
      </SimpleGrid>

      <Button variant="filled" color="dark" onClick={onClear}>
        Limpiar
      </Button>
    </Stack>
  );
};