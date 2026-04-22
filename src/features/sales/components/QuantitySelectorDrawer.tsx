import { useEffect, useState } from 'react';
import { Button, Drawer, Group, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import type { Product } from '../../../types/models';
import { UnitMeasure, UnitMeasureTags } from '../../../constants/unit-measure';
import { QuantityNumpad } from './QuantityNumpad';
import { getShortcutRows } from '../pos-logic.utils';
import { CURRENCY } from '../pos.constants';

interface Props {
  opened: boolean;
  product: Product | null;
  onClose: () => void;
  onAddQuantity: (product: Product, quantity: number) => void;
  onAddAmount: (product: Product, amount: number) => void;
}

const parseValue = (value: string) => {
  const normalized = value.trim().replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : NaN;
};

export const QuantitySelectorDrawer = ({ opened, product, onClose, onAddQuantity, onAddAmount }: Props) => {
  const isUnitProduct = product?.unit === UnitMeasure.UNIT;
  const shortcutRows = product ? getShortcutRows(product.unit) : [];

  const [value, setValue] = useState('');

  useEffect(() => {
    if (opened) setValue('');
  }, [opened, product?.id]);

  const handleAddQuantity = () => {
    if (!product) return;
    const parsed = parseValue(value);
    if (!(parsed > 0)) return;

    const quantityToAdd = product.unit === UnitMeasure.KILOGRAM ? parsed / 1000 : parsed;

    if (!(quantityToAdd > 0)) return;

    onAddQuantity(product, quantityToAdd);
    onClose();
  };

  const handleAddAmount = () => {
    if (!product) return;
    const parsed = parseValue(value);
    if (!(parsed > 0)) return;
    onAddAmount(product, parsed);
    onClose();
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      size="92%"
      title={product ? 'Seleccionar cantidad' : 'Seleccionar producto'}
      padding="md"
      withCloseButton
      styles={{
        content: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
      }}
    >
      {!product ? null : (
        <Stack gap="md">
          <Paper withBorder p="md" radius="md">
            <Stack gap={2}>
              <Title order={4}>{product.name}</Title>
              <Text size="sm" c="dimmed">
                {CURRENCY.format(Number(product.price || 0))} por {UnitMeasureTags[product.unit]}
              </Text>
            </Stack>
          </Paper>

          <Stack gap="xs">
            {shortcutRows.map((row, rowIndex) => (
              <SimpleGrid key={`shortcut-row-${rowIndex}`} cols={row.length} spacing="xs">
                {row.map((shortcut) => (
                  <Button
                    key={`${shortcut.mode}-${shortcut.label}-${shortcut.value}`}
                    variant="filled"
                    color="dark"
                    size="lg"
                    onClick={() => {
                      if (shortcut.mode === 'quantity') {
                        onAddQuantity(product, shortcut.value);
                      } else {
                        onAddAmount(product, shortcut.value);
                      }
                      onClose();
                    }}
                  >
                    {shortcut.label}
                  </Button>
                ))}
              </SimpleGrid>
            ))}
          </Stack>

          <QuantityNumpad
            value={value}
            allowDecimal={!isUnitProduct}
            onInput={(char) => setValue((previous) => `${previous}${char}`)}
            onBackspace={() => setValue((previous) => previous.slice(0, -1))}
            onClear={() => setValue('')}
          />

          <Group grow>
            <Button
              variant="filled"
              color="dark"
              size="lg"
              styles={{ root: { minHeight: 56 }, label: { fontWeight: 700 } }}
              onClick={handleAddQuantity}
            >
              Cantidad
            </Button>
            <Button
              variant="filled"
              color="green"
              size="lg"
              styles={{ root: { minHeight: 56 }, label: { fontWeight: 700 } }}
              onClick={handleAddAmount}
            >
              Monto ($)
            </Button>
          </Group>
        </Stack>
      )}
    </Drawer>
  );
};