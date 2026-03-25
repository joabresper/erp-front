import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changeProductStatus, createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "./api";
import type { ChangeProductStatusDTO, UpdateProductDTO } from "./types";

export const useProducts = () => {
  return useQuery({
	queryKey: ['products'],
	queryFn: getProducts,
	staleTime: 1000 * 60 * 60,
  });
}

export const useProduct = (id: string) => {
  return useQuery({
	queryKey: ['products', id],
	queryFn: () => getProductById(id),
	staleTime: 1000 * 60 * 60,
  });
}

export const useCreateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
		onError: (error) => {
			console.error('Error creating product:', error);
		}
	});
};

interface UpdateProductVariables {
	id: string;
	data: UpdateProductDTO;
};
export const useUpdateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: UpdateProductVariables) => updateProduct(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
		onError: (error) => {
			console.error('Error updating product:', error);
		}
	});
};

interface ChangeProductStatusVariables {
	id: string;
	data: ChangeProductStatusDTO;
}
export const useChangeProductStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: ChangeProductStatusVariables) => changeProductStatus(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
		onError: (error) => {
			console.error('Error changing product status:', error);
		}
	});
};

export const useDeleteProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteProduct(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
		onError: (error) => {
			console.error('Error deleting product:', error);
		}
	});
};

