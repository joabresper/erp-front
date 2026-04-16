import api from "../../api/axios";
import type { CreateCustomerDTO, UpdateCustomerDTO } from "./types";

export const getCustomers = async () => {
  const { data } = await api.get('/customers');
  return data;
}

export const getDeletedCustomers = async () => {
  const { data } = await api.get('/customers/deleted');
  return data;
}

export const getCustomerById = async (id: string) => {
  const { data } = await api.get(`/customers/${id}`);
  return data;
}

export const createCustomer = async (customerData: CreateCustomerDTO) => {
	const { data } = await api.post('/customers', customerData);
	return data;
}

export const updateCustomer = async (id: string, customerData: UpdateCustomerDTO) => {
	const { data } = await api.patch(`/customers/${id}`, customerData);
	return data;
}

export const restoreCustomer = async (id: string) => {
	const { data } = await api.patch(`/customers/${id}/restore`);
	return data;
}

export const deleteCustomer = async (id: string) => {
	await api.delete(`/customers/${id}`);
}