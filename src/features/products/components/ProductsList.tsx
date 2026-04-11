import { ActionIcon, Badge, Button, Card, Divider, Group, Select, Stack, Table, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconTrash, IconCheck, IconX } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useChangeProductStatus, useDeleteProduct, useProducts } from "../useProducts";
import { CrudLayout } from "../../../components/layout/CrudLayout";
import { ProductFormModal } from "./ProductFormModal";
import { PERMISSIONS } from "../../../constants/permissions";
import { Can } from "../../../components/common/Can";
import {
  UnitMeasureTags,
  type UnitMeasureName,
} from "../../../constants/unit-measure";
import {
  ProductTypeLabels,
} from "../../../constants/product-types";
import { FilterBar } from "../../../components/layout/FilterBar";
import type { CreateProductDTO } from "../types";

export const ProductsList = () => {
  const { data: products = [], isLoading } = useProducts();
  const { mutateAsync: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const { mutateAsync: changeProductStatus } = useChangeProductStatus();

  // Estados para el Modal de Formulario (Crear/Editar)
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    open();
  };

  const handleChangeStatus = (product: any) => {
    changeProductStatus({ id: product.id, data: { active: !product.active } });
  };

  const handleAddNew = () => {
    setSelectedProduct(null); // Limpiamos para que sea "Crear"
    open();
  };
  
  // Filtro de búsqueda
  const [ search, setSearch ] = useState("");
  const [ type, setType ] = useState<string | null>(null);
  // Filtro de ordenamiento
  const [sortField, setSortField] = useState<string | null>('name'); // Ordenamos por nombre por defecto
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleClear = () => {
    setSearch('');
    setType(null);
    setSortOrder('asc');
    setSortField('name');
  };

  const filteredProducts = useMemo(() => {
    // 1. Aplicamos tu lógica de filtrado actual
    const filtered = products.filter((product: any) => {
      const searchTerm = search.toLowerCase().trim();
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm) || 
        product.sku.toLowerCase().includes(searchTerm);

      const matchesType = type ? product.type === type : true;

      return matchesSearch && matchesType;
    });

    // 2. Aplicamos el ordenamiento sobre el resultado filtrado
    if (!sortField) return filtered;

    // Creamos una copia ([...filtered]) para no mutar el array original
    return [...filtered].sort((a, b) => {
      const valA = a[sortField as keyof CreateProductDTO];
      const valB = b[sortField as keyof CreateProductDTO];

      // Gestión de nulos: los enviamos al final de la lista
      if (valA == null) return 1;
      if (valB == null) return -1;

      let comparison = 0;

      // Diferenciamos lógica según el tipo de dato
      if (typeof valA === 'string' && typeof valB === 'string') {
        // localeCompare con 'numeric: true' es clave para que "SKU-2" venga antes que "SKU-10"
        comparison = valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
      } else {
        // Para números (precio, stock, etc.)
        comparison = Number(valA) - Number(valB);
      }

      // Si es descendente, invertimos el resultado
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [products, search, type, sortField, sortOrder]);

  // Filtro
  const filterSection = (
    <FilterBar
      searchPlaceholder="Buscar por SKU o Nombre..."
      searchValue={search}
      onSearchChange={setSearch}
      onClear={handleClear}
      sortOptions={[
        { label: "Nombre", value: "name" },
        { label: "SKU", value: "sku" },
        { label: "Precio", value: "price" },
      ]}
      sortField={sortField}
      sortOrder={sortOrder}
      onSortFieldChange={setSortField}
      onSortOrderChange={setSortOrder}
    >
      {/* Filtro específico de Productos */}
      <Select
        placeholder="Tipo de producto"
        data={Object.entries(ProductTypeLabels).map(([v, l]) => ({ value: v, label: l.label }))}
        value={type}
        onChange={setType}
        clearable
      />
    </FilterBar>
  );

  // Lógica de Eliminación Real
  const confirmDelete = (product: any) => {
    modals.openConfirmModal({
      title: "Eliminar producto",
      centered: true,
      children: (
        <Text size="sm">
          ¿Estás seguro de que querés eliminar <b>{product.name}</b>? Esto
          registrará el cambio en el sistema de Mónica Panificados.
        </Text>
      ),
      labels: { confirm: "Eliminar", cancel: "Cancelar" },
      confirmProps: { color: "red", loading: isDeleting },
      onConfirm: async () => {
        try {
          await deleteProduct(product.id);
          notifications.show({
            title: "Producto eliminado",
            message: `${product.name} fue quitado del catálogo.`,
            color: "green",
            icon: <IconCheck size={18} />,
          });
        } catch (error) {
          notifications.show({
            title: "Error al eliminar",
            message: "No se pudo eliminar el producto. Intentalo de nuevo.",
            color: "red",
            icon: <IconX size={18} />,
          });
        }
      },
    });
  };

  // 4. Encabezados
  const tableHeaders = (
    <Table.Tr>
      <Table.Th ta="left">Nombre</Table.Th>
      <Table.Th ta="center" w="10%">
        SKU
      </Table.Th>
      <Table.Th ta="center" w="20%">
        Tipo
      </Table.Th>
      <Table.Th w="10%" ta="center">
        Modificado
      </Table.Th>
      <Table.Th w="10%" ta="center">
        Precio
      </Table.Th>
      <Table.Th w="10%" ta="center">
        Estado
      </Table.Th>
      <Table.Th w="13%" ta="center">
        Acciones
      </Table.Th>
    </Table.Tr>
  );

  // 5. Filas dinámicas
  const tableRows = filteredProducts.map((product: any) => (
    <Table.Tr key={product.id}>
      <Table.Td ta="left">
        <Text fw={500} size="sm">
          {product.name}
        </Text>
        {product.description && (
          <Text size="xs" c="dimmed" lineClamp={2}>
            {product.description}
          </Text>
        )}
      </Table.Td>
      <Table.Td ta="center">
        <Text fw={500} size="sm">
          {product.sku}
        </Text>
      </Table.Td>
      <Table.Td ta="center">
        <Badge 
			variant="light"
			h="auto"
			py={5}
			style={{ 
				whiteSpace: 'normal',
				wordBreak: 'break-word',
				textAlign: 'center'
			}}>
          <Text span visibleFrom="md" size="sm">
            {ProductTypeLabels[product.type as keyof typeof ProductTypeLabels]
              .label || product.type}
          </Text>
          <Text span hiddenFrom="md">
            {ProductTypeLabels[product.type as keyof typeof ProductTypeLabels]
              .short || product.type}
          </Text>
        </Badge>
      </Table.Td>
      <Table.Td ta="center">
        <Text size="sm">
          {new Date(product.updatedAt).toLocaleDateString("es-AR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </Text>
      </Table.Td>
      <Table.Td ta="center">
        <Text size="sm">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(product.price)}
          <Text span size="xs" c="dimmed">
            {" "}
            / {UnitMeasureTags[product.unit as UnitMeasureName] || product.unit}
          </Text>
        </Text>
      </Table.Td>
      <Table.Td ta="center">
        <Badge color={product.active ? "green" : "gray"} variant="light">
          {product.active ? "Activo" : "Inactivo"}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="center">
          <Can permission={PERMISSIONS.PRODUCT_UPDATE}>
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => handleEdit(product)}
            >
              <IconEdit size={18} />
            </ActionIcon>
          </Can>
          <Can permission={PERMISSIONS.PRODUCT_CHANGE_STATUS}>
            <ActionIcon
			  title={product.active ? "Desactivar producto" : "Activar producto"}
              variant="subtle"
              color={!product.active ? "green" : "gray"}
              onClick={() => handleChangeStatus(product)}
            >
				{product.active ? (
					<IconX size={18} /> // Icono para "dar de baja"
				) : (
					<IconCheck size={18} /> // Icono para "dar de alta"
				)}
            </ActionIcon>
          </Can>
          <Can permission={PERMISSIONS.PRODUCT_DELETE}>
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => confirmDelete(product)}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Can>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const modalsContent = (
    <ProductFormModal
      opened={opened}
      close={close}
      productToEdit={selectedProduct}
    />
  );

  const mobileCards = filteredProducts.map((product: any) => (
    <Card key={product.id} withBorder shadow="sm" radius="md" mb="md" p="md">
      {/* Cabecera: Nombre y Estado */}
      <Group justify="space-between" align="flex-start" mb="xs">
        <Stack gap={2} style={{ flex: 1 }}>
          <Text fw={700} size="lg" c="blue.9">
            {product.name}
          </Text>
          <Text size="xs" c="dimmed" fw={500}>
            SKU: {product.sku}
          </Text>
        </Stack>
        <Badge color={product.active ? "green" : "gray"} variant="light">
          {product.active ? "Activo" : "Inactivo"}
        </Badge>
      </Group>

      {/* Descripción (si existe) */}
      {product.description && (
        <Text size="sm" c="dimmed" mb="sm" lineClamp={2}>
          {product.description}
        </Text>
      )}

      <Divider my="sm" variant="dashed" />

      {/* Información de Negocio */}
      <Group justify="space-between" mb={4}>
        <Stack gap={0}>
          <Text size="xs" c="dimmed">
            Tipo
          </Text>
          <Badge variant="dot" size="sm">
            {/* En mobile usamos el short directamente para ahorrar espacio */}
            {ProductTypeLabels[product.type as keyof typeof ProductTypeLabels]
              .short || product.type}
          </Badge>
        </Stack>

        <Stack gap={0} align="flex-end">
          <Text size="xs" c="dimmed">
            Precio
          </Text>
          <Text fw={700} size="md">
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(product.price)}
            <Text span size="xs" c="dimmed" fw={400}>
              {" "}
              /{" "}
              {UnitMeasureTags[product.unit as UnitMeasureName] || product.unit}
            </Text>
          </Text>
        </Stack>
      </Group>

      <Text size="xs" c="dimmed" mt="xs">
        Últ. act: {new Date(product.updatedAt).toLocaleDateString("es-AR")}
      </Text>

      {/* Acciones: Botones más grandes para el dedo */}
      <Group gap="sm" mt="md" grow>
        <Can permission={PERMISSIONS.PRODUCT_UPDATE}>
          <Button
            variant="light"
            color="blue"
            leftSection={<IconEdit size={16} />}
            onClick={() => handleEdit(product)}
            size="xs"
          >
            Editar
          </Button>
        </Can>

        <Can permission={PERMISSIONS.PRODUCT_CHANGE_STATUS}>
          <Button
            variant="light"
            color={!product.active ? "green" : "gray"}
            onClick={() => handleChangeStatus(product)}
            size="xs"
			w="80%"
          >
            {product.active ? "Suspender" : "Activar"}
          </Button>
        </Can>

        <Can permission={PERMISSIONS.PRODUCT_DELETE}>
          <ActionIcon
            variant="light"
            color="red"
            size="lg" // ActionIcon un poco más grande para facilitar el toque
            onClick={() => confirmDelete(product)}
          >
            <IconTrash size={18} />
          </ActionIcon>
        </Can>
      </Group>
    </Card>
  ));
  console.log('Busqueda:', search);
  console.log('Productos Originales:', products.length);
  console.log('Productos Filtrados:', filteredProducts.length);

  return (
    <CrudLayout
      title="Gestión de Productos"
      buttonLabel="Nuevo Producto"
      onAddNew={handleAddNew}
      isLoading={isLoading}
      filterSection={filterSection}
      tableHeaders={tableHeaders}
      tableRows={tableRows}
      requiredCreatePermissions={PERMISSIONS.PRODUCT_CREATE}
      modals={modalsContent}
      mobileView={mobileCards}
    />
  );
};
