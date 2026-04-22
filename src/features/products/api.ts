import api from "../../api/axios";
import type { Product } from "../../types/models";
import type { ChangeProductStatusDTO, CreateProductDTO, UpdateProductDTO } from "./types";

interface GetProductsParams {
	isSalable?: boolean;
	active?: boolean;
	includeHistory?: boolean;
}

export const getProducts = async (filters: GetProductsParams = {}): Promise<Product[]> => {
  const { data } = await api.get('/products', {
	params: filters,
  });
  return data;
}

export const getProductById = async (id: string): Promise<Product> => {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

export const createProduct = async (productData: CreateProductDTO): Promise<Product> => {
	const { data } = await api.post('/products', productData);
	return data;
}

export const updateProduct = async (id: string, productData: UpdateProductDTO): Promise<Product> => {
	const { data } = await api.patch(`/products/${id}`, productData);
	return data;
}

export const changeProductStatus = async (id: string, productData: ChangeProductStatusDTO): Promise<Product> => {
	const { data } = await api.patch(`/products/${id}/status`, productData);
	return data;
}

export const deleteProduct = async (id: string): Promise<void> => {
	await api.delete(`/products/${id}`);
}