import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Modal,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure, useHotkeys, useMediaQuery } from '@mantine/hooks';
import { IconBackspace, IconTrash, IconX } from '@tabler/icons-react';
import { useProducts } from '../features/products/useProducts';
import { useCreateSale } from '../features/sales/useSales';
import { QuantitySelectorDrawer } from '../features/sales/components/QuantitySelectorDrawer';
import type { Product } from '../types/models';
import { PaymentMethodLabels, PaymentMethods, type PaymentMethodName } from '../constants/payment-methods';
import { PaymentStatus } from '../constants/payment-status';
import { InvoiceType } from '../constants/invoice-types';
import { UnitMeasure, UnitMeasureTags } from '../constants/unit-measure';
import { notificationService } from '../utils/notificationService';
import { useDefaultCustomer } from '../features/customers/useCustomers';
import type { TicketItem } from '../features/sales/types';
import { calculateQuantityFromAmount, formatQuantity, getNowAsInputValue, getProductSubtotal, getShortcutRows, getTileTone, resolveQuantity } from '../features/sales/pos-logic.utils';
import { POS_PAYMENT_METHODS, CURRENCY } from '../features/sales/pos.constants';
import { usePosTicket } from '../features/sales/useTicket';

const MOBILE_FOOTER_HEIGHT = 210;

export const PosPage = () => {
  // Hooks UI/Data
  const isMobile = useMediaQuery('(max-width: 48em)');
  const [mobileItemsOpened, { open: openMobileItems, close: closeMobileItems }] = useDisclosure(false);
  const { data: products = [], isLoading: loadingProducts } = useProducts({ isSalable: true, active: true });

  const {
    ticket,
    ticketItems,
    total,
    itemAmountDrafts,
    lastAmountInputRef,
    lastIdAdded,
    addToTicket,
    updateItemQuantity,
    removeItem,
    clearTicket,
    handleAmountDraftChange,
    applyAmountToItem
  } = usePosTicket();
  
  const [quantityDrawerOpened, { open: openQuantityDrawer, close: closeQuantityDrawer }] = useDisclosure(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { data: defaultCustomer } = useDefaultCustomer();
  const defaultCustomerId = defaultCustomer?.id ?? '';

  useHotkeys([
    ['Enter', () => handleCharge()],
    ['Tab', (event) => {
      event.preventDefault();
      const currentIndex = POS_PAYMENT_METHODS.indexOf(paymentMethod);
      const nextIndex = (currentIndex + 1) % POS_PAYMENT_METHODS.length;
      setPaymentMethod(POS_PAYMENT_METHODS[nextIndex]);
    }],
  ]);
  
  const { mutate: createSale, isPending: isCreatingSale } = useCreateSale();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodName>(PaymentMethods.CASH);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [numpadValue, setNumpadValue] = useState('');
  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;

    return products.filter((product: Product) =>
      [product.name, product.sku, product.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }, [products, search]);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const addProductAsQuantity = (product: Product, quantity: number) => {
    addToTicket(product, quantity);
  };

  const addProductAsAmount = (product: Product, amount: number) => {
    const quantity = calculateQuantityFromAmount(product, amount);

    if (quantity === null) {
      notificationService.error('Monto inválido', 'El monto no genera una cantidad válida.');
      return;
    }

    addToTicket(product, quantity);
  };

  const openNumpad = (item: TicketItem) => {
    setEditingProductId(item.product.id);
    setNumpadValue(formatQuantity(item));
  };

  const appendNumpadChar = (char: string) => {
    if (!editingProductId) return;

    const current = ticket[editingProductId];
    if (!current) return;

    const allowsDecimal = current.product.unit !== UnitMeasure.UNIT;
    if (char === '.' && (!allowsDecimal || numpadValue.includes('.'))) return;

    setNumpadValue((prev) => {
      if (prev === '0' && char !== '.') return char;
      return `${prev}${char}`;
    });
  };

  const backspaceNumpad = () => {
    setNumpadValue((prev) => prev.slice(0, -1));
  };

  const confirmNumpad = () => {
    if (!editingProductId) return;

    const current = ticket[editingProductId];
    if (!current) return;

    const parsedQty = resolveQuantity(current.product, numpadValue);
    if (parsedQty <= 0) {
      removeItem(editingProductId);
      setEditingProductId(null);
      setNumpadValue('');
      return;
    }

    updateItemQuantity(editingProductId, parsedQty);

    setEditingProductId(null);
    setNumpadValue('');
  };

  useEffect(() => {
    if (lastIdAdded && lastAmountInputRef.current) {
      lastAmountInputRef.current.focus();
      // Opcional: lastAmountInputRef.current.select();
    }
  }, [lastIdAdded, ticketItems.length]);

  const handleCharge = () => {
    if (!ticketItems.length) {
      notificationService.error('Ticket vacío', 'Agregá al menos un producto para cobrar.');
      return;
    }

    if (!defaultCustomerId) {
      notificationService.error('Configuración faltante', 'No hay cliente por defecto para registrar la venta.');
      return;
    }

    createSale(
      {
        customerId: defaultCustomerId,
        paymentMethod,
        paymentStatus: PaymentStatus.PAID,
        invoiceDate: getNowAsInputValue(),
        invoiceType: InvoiceType.TICKET,
        saleItems: ticketItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          discountAmount: 0,
        })),
      },
      {
        onSuccess: () => {
          notificationService.success('Venta cobrada', 'Operación registrada correctamente.');
          clearTicket();
          closeMobileItems();
        },
        onError: () => {
          notificationService.error('Error al cobrar', 'No se pudo registrar la venta.');
        },
      }
    );
  };

  const numpadItem = editingProductId ? ticket[editingProductId] : null;

  const desktopProductTiles = (
    <SimpleGrid cols={isMobile ? 2 : { base: 2, md: 3, xl: 4 }} spacing="sm" verticalSpacing="sm">
      {filteredProducts.map((product: Product) => {
        const tone = getTileTone(product);
        const quickButtonRows = getShortcutRows(product.unit);

        return (
          <Card
            key={product.id}
            withBorder
            radius="md"
            onClick={() => addToTicket(product)}
            style={{
              minHeight: isMobile ? 142 : 168,
              cursor: 'pointer',
              background: tone.bg,
              borderColor: tone.border,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: isMobile ? 10 : 12,
            }}
          >
            <Text fw={800} ta="center" style={{ fontSize: isMobile ? '0.84rem' : '0.9rem', lineHeight: 1.05 }}>
              {product.name.toUpperCase()}
            </Text>

            <Group justify="space-between" align="center" gap={4} mt={4}>
              <Text size="10px" c="dimmed" fw={600}>
                {UnitMeasureTags[product.unit]}
              </Text>
              <Text fw={800} size={isMobile ? 'xs' : 'sm'} c="dark.8">
                {CURRENCY.format(Number(product.price || 0))}
              </Text>
            </Group>

            <Stack gap={6} mt="xs">
              {quickButtonRows.map((row, rowIndex) => (
                <SimpleGrid key={`${product.id}-row-${rowIndex}`} cols={row.length} spacing={6}>
                  {row.map((shortcut) => (
                    <Button
                      key={`${product.id}-${shortcut.value}`}
                      size={isMobile ? 'compact-xs' : 'sm'}
                      fullWidth
                      variant="filled"
                      color="dark"
                      onClick={(event) => {
                        event.stopPropagation();
                        addToTicket(product, shortcut.value);
                      }}
                      styles={{
                        root: {
                          minHeight: isMobile ? 28 : 38,
                          paddingLeft: isMobile ? 4 : 8,
                          paddingRight: isMobile ? 4 : 8,
                        },
                        label: {
                          fontSize: isMobile ? '0.74rem' : '0.85rem',
                          fontWeight: 600,
                        },
                      }}
                    >
                      {shortcut.label}
                    </Button>
                  ))}
                </SimpleGrid>
              ))}
            </Stack>
          </Card>
        );
      })}
    </SimpleGrid>
  );

  const mobileProductTiles = (
    <SimpleGrid cols={2} spacing="sm" verticalSpacing="sm">
      {filteredProducts.map((product: Product) => {
        const tone = getTileTone(product);

        return (
          <Card
            key={product.id}
            withBorder
            radius="md"
            onClick={() => {
              setSelectedProduct(product);
              openQuantityDrawer();
            }}
            style={{
              minHeight: 90,
              cursor: 'pointer',
              background: tone.bg,
              borderColor: tone.border,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 10,
            }}
          >
            <Text fw={800} ta="center" mt="sm" style={{ fontSize: '0.86rem', lineHeight: 1.08 }}>
              {product.name.toUpperCase()}
            </Text>

            <Group justify="space-between" align="center" gap={4} mt={4}>
              <Text size="10px" c="dimmed" fw={600}>
                {UnitMeasureTags[product.unit]}
              </Text>
              <Text fw={800} size="xs" c="dark.8">
                {CURRENCY.format(Number(product.price || 0))}
              </Text>
            </Group>
          </Card>
        );
      })}
    </SimpleGrid>
  );

  const ticketItemsList = (
    <Stack gap="xs">
      {ticketItems.map((item) => {
        const lastItem = item.product.id === lastIdAdded ? lastAmountInputRef : null;
      return (
        <Paper key={item.product.id} withBorder p="sm" radius="md">
          <Group justify="space-between" align="start" wrap="nowrap">
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Text fw={700} truncate>
                {item.product.name}
              </Text>
              <Text size="xs" c="dimmed">
                {CURRENCY.format(Number(item.product.price || 0))} x {formatQuantity(item)} {UnitMeasureTags[item.product.unit]}
              </Text>
            </Box>

            <Stack gap={6} align="end">
              <Button
                size="xs"
                variant="light"
                color="dark"
                onClick={() => openNumpad(item)}
              >
                {formatQuantity(item)}
              </Button>
              <Text fw={800}>{CURRENCY.format(getProductSubtotal(item))}</Text>
            </Stack>
          </Group>

          <TextInput
            mt="xs"
            label="Monto manual"
            size="xs"
            ref={lastItem}
            value={itemAmountDrafts[item.product.id] ?? getProductSubtotal(item).toFixed(2)}
            onChange={(event) => handleAmountDraftChange(item.product.id, event.currentTarget.value)}
            onFocus={(event) => {
              if (!isMobile) {
                event.currentTarget.select();
              }
            }}
            onClick={(event) => {
              if (!isMobile) {
                event.currentTarget.select();
              }
            }}
            onBlur={() => applyAmountToItem(item.product.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                applyAmountToItem(item.product.id);
                event.currentTarget.blur();
              }
            }}
          />

          <Group justify="end" mt={4}>
            <ActionIcon variant="subtle" color="red" onClick={() => removeItem(item.product.id)}>
              <IconX size={14} />
            </ActionIcon>
          </Group>
        </Paper>
      )})}

      {!ticketItems.length && (
        <Text c="dimmed" ta="center" py="lg">
          Todavía no hay productos en el ticket.
        </Text>
      )}
    </Stack>
  );

  const ticketSummary = (
    <Stack h="100%" gap={0} style={{ overflow: 'hidden' }}> 
      <Box p="md" pb="xs">
        <Group justify="space-between" mb="xs">
          <Title order={3}>Ticket Activo</Title>
        </Group>
        <Divider mb="sm" />
      </Box>

      <Box style={{ flex: 1, minHeight: 0 }}>
        <ScrollArea h="100%" p="md" pt={0} offsetScrollbars>
          {ticketItemsList}
        </ScrollArea>
      </Box>

      <Box p="md" pt="xs" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
        <Stack gap="sm">
          <Group justify="space-between">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Total</Text>
            <ActionIcon 
              size="lg" 
              variant="light" 
              color="red" 
              onClick={clearTicket} 
              disabled={!ticketItems.length}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Group>
          
          <Title order={1} style={{ fontSize: '2.5rem', lineHeight: 1 }}>
            {CURRENCY.format(total)}
          </Title>

          <Group grow>
            {POS_PAYMENT_METHODS.map((method) => (
              <Button
                key={method}
                variant={paymentMethod === method ? 'filled' : 'light'}
                color={paymentMethod === method ? 'dark' : 'gray'}
                onClick={() => setPaymentMethod(method)}
              >
                {PaymentMethodLabels[method].label}
              </Button>
            ))}
          </Group>

          <Button
            size="xl"
            color="green"
            fullWidth
            onClick={handleCharge}
            loading={isCreatingSale}
            disabled={!ticketItems.length || !defaultCustomerId}
          >
            COBRAR
          </Button>
        </Stack>
      </Box>
    </Stack>
  );

  const mobileFooterSummary = (
    <Stack gap="xs" style={{ height: '100%' }}>
      <Group justify="space-between">
        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
          Total
        </Text>
		<Group>
			<Button
				size="xs"
				variant="light"
				color="red"
				onClick={clearTicket}
				disabled={!ticketItems.length}
			>
				<IconTrash size={18} />
			</Button>
			<Button variant="light" size="xs" color="dark" onClick={openMobileItems}>
			Ver Detalle
			</Button>
		</Group>
      </Group>

      <Title order={2} style={{ fontSize: '1.7rem', lineHeight: 1 }}>
        {CURRENCY.format(total)}
      </Title>

      <SimpleGrid cols={3} spacing={6}>
        {POS_PAYMENT_METHODS.map((method) => (
          <Button
            key={method}
            variant={paymentMethod === method ? 'filled' : 'light'}
            color={paymentMethod === method ? 'dark' : 'gray'}
            onClick={() => setPaymentMethod(method)}
            size="xs"
            styles={{ label: { fontSize: '0.72rem', fontWeight: 700 } }}
          >
            {PaymentMethodLabels[method].label}
          </Button>
        ))}
      </SimpleGrid>

      <Button
        size="md"
        color="green"
        fullWidth
        onClick={handleCharge}
        loading={isCreatingSale}
        disabled={!ticketItems.length || !defaultCustomerId}
        styles={{ root: { minHeight: 46, fontWeight: 800, letterSpacing: 0.4 } }}
      >
        COBRAR
      </Button>
    </Stack>
  );

return (
    <Box
      style={{
        // 2. Ocupamos todo el alto disponible restando el header
        height: 'calc(100dvh - var(--app-shell-header-height) - 32px)', 
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        // 3. Ancho responsivo nivel Pro usando variables de Mantine
        ...(isMobile ? { 
          marginLeft: 'calc(var(--mantine-spacing-md) * -1)', 
          marginRight: 'calc(var(--mantine-spacing-md) * -1)',
          width: 'calc(100% + (var(--mantine-spacing-md) * 2))'
        } : { 
          padding: 'var(--mantine-spacing-md)' 
        }),
      }}
    >
      {isMobile ? (
        // --- LAYOUT MOBILE ---
        // Usamos un contenedor Flex para que el footer y el scroll convivan
        <Stack gap={0} h="100%">
          {/* A. Área de búsqueda y título fijo arriba */}
          <Box p="sm" style={{ backgroundColor: 'white', zIndex: 5 }}>
            <Title order={4} mb="xs">Punto de Venta</Title>
            <TextInput
              ref={searchInputRef}
              placeholder="Buscar producto..."
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              size="md"
            />
          </Box>

          {/* B. Área de productos con flex: 1 para que ocupe el resto */}
          <ScrollArea 
            style={{ flex: 1 }} 
            scrollbarSize={4} 
            offsetScrollbars
          >
            <Box p="sm">
              {mobileProductTiles}
              
              {!loadingProducts && !filteredProducts.length && (
                <Paper p="lg" mt="sm" withBorder radius="md">
                  <Text c="dimmed" ta="center">No hay productos.</Text>
                </Paper>
              )}
            </Box>
          </ScrollArea>

          {/* C. Footer Resumen (YA NO ES ABSOLUTE) */}
          {/* Al estar al final del Stack, el ScrollArea termina justo aquí */}
          <Paper
            withBorder
            radius={0}
            p="sm"
            style={{
              height: MOBILE_FOOTER_HEIGHT,
              borderTop: '1px solid var(--mantine-color-gray-3)',
              backgroundColor: 'white',
              boxShadow: '0 -4px 12px rgba(0,0,0,0.05)'
            }}
          >
            {mobileFooterSummary}
          </Paper>
        </Stack>
      ) : (
        // --- LAYOUT DESKTOP ---
        <Grid gutter="md" h="100%" m={0} align="stretch">
          <Grid.Col span={{ base: 12, lg: 8, md: 8 }} h="calc(100vh - var(--app-shell-header-height))">
            <Paper h="100%" p="md" radius="md" withBorder style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Stack gap="sm" mb="sm">
                <Title order={2}>Punto de Venta</Title>
                <TextInput
                  ref={searchInputRef}
                  placeholder="Buscar producto..."
                  value={search}
                  onChange={(event) => setSearch(event.currentTarget.value)}
                  size="lg"
                />
              </Stack>

              <ScrollArea style={{ flex: 1, minHeight: 0 }} offsetScrollbars>
                {desktopProductTiles}
              </ScrollArea>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 4, md: 4 }} h="calc(100vh - var(--app-shell-header-height))">
            <Paper h="100%" p="md" radius="md" withBorder style={{ display: 'flex', flexDirection: 'column' }}>
              {ticketSummary}
            </Paper>
          </Grid.Col>
        </Grid>
      )}

      <Modal
        opened={mobileItemsOpened}
        onClose={closeMobileItems}
        title="Detalle de venta"
        fullScreen={isMobile}
        centered
      >
        <Box h={isMobile ? 'calc(100vh - 92px)' : 460}>
          <Box h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
            {ticketSummary}
          </Box>
        </Box>
      </Modal>

      <QuantitySelectorDrawer
        opened={quantityDrawerOpened}
        product={selectedProduct}
        onClose={() => {
          closeQuantityDrawer();
          setSelectedProduct(null);
        }}
        onAddQuantity={addProductAsQuantity}
        onAddAmount={addProductAsAmount}
      />

      <Modal
        opened={!!numpadItem}
        onClose={() => {
          setEditingProductId(null);
          setNumpadValue('');
        }}
        title={numpadItem ? `Cantidad: ${numpadItem.product.name}` : 'Cantidad'}
        centered
        size="xs"
      >
        <Stack>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Text fw={700} size="lg">
                {numpadValue || '0'}
              </Text>
              <ActionIcon variant="light" color="gray" onClick={backspaceNumpad}>
                <IconBackspace size={18} />
              </ActionIcon>
            </Group>
          </Paper>

          <SimpleGrid cols={3}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'C'].map((value) => (
              <Button
                key={value}
                variant="light"
                color="dark"
                size="lg"
                onClick={() => {
                  if (value === 'C') {
                    setNumpadValue('');
                    return;
                  }
                  appendNumpadChar(value);
                }}
              >
                {value}
              </Button>
            ))}
          </SimpleGrid>

          <Button color="green" size="md" onClick={confirmNumpad}>
            Aceptar
          </Button>
        </Stack>
      </Modal>
    </Box>
  );
};