import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSale, getSaleById, getSales, updateSale } from "./api";
import type { CreateSaleDTO, UpdateSaleDTO } from "./types";

export const useSales = () => {
	return useQuery({
		queryKey: ['sales'],
		queryFn: getSales,
		staleTime: 1000 * 60 * 30, // Cache por 30 minutos
	});
};

export const useSale = (id: string) => {
	return useQuery({
		queryKey: ['sales', id],
		queryFn: () => getSaleById(id),
		staleTime: 1000 * 60 * 30, // Cache por 30 minutos
	});
};

export const useCreateSale = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (saleData: CreateSaleDTO) => createSale(saleData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['sales'] });
		},
		onError: (error) => {
			console.error('Error creating sale:', error);
		}
	});
};

export const useUpdateSale = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (saleData: UpdateSaleDTO) => updateSale(id, saleData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['sales'] });
			queryClient.invalidateQueries({ queryKey: ['sales', id] });
		},
		onError: (error) => {
			console.error('Error updating sale:', error);
		}
	});
};
