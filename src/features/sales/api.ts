import api from "../../api/axios";
import type { CreateSaleDTO, UpdateSaleDTO } from "./types";

export const getSales = async () => {
	const { data } = await api.get('/sales');
	return data;
}

export const getSaleById = async (id: string) => {
	const { data } = await api.get(`/sales/${id}`);
	return data;
}

export const createSale = async (saleData: CreateSaleDTO) => {
	const { data } = await api.post('/sales', saleData);
	return data;
}

export const updateSale = async (id: string, saleData: UpdateSaleDTO) => {
	const { data } = await api.patch(`/sales/${id}`, saleData);
	return data;
}