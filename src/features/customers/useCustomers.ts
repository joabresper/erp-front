import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCustomer, deleteCustomer, getCustomerById, getCustomers, getDeletedCustomers, restoreCustomer, updateCustomer } from "./api";
import type { UpdateCustomerDTO } from "./types";

export const useCustomers = () => {
	return useQuery({
		queryKey: ['customers'],
		queryFn: getCustomers,
		staleTime: 1000 * 60 * 60,
	});
}

export const useDeletedCustomers = () => {
	return useQuery({
		queryKey: ['customers', 'deleted'],
		queryFn: () => getDeletedCustomers(),
		staleTime: 1000 * 60 * 60,
	});
}

export const useCustomer = (id: string) => {
	return useQuery({
		queryKey: ['customers', id],
		queryFn: () => getCustomerById(id),
		staleTime: 1000 * 60 * 60,
	});
}

export const useCreateCustomer = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createCustomer,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['customers'] });
			queryClient.invalidateQueries({ queryKey: ['customers', 'deleted'] });
		},
		onError: (error) => {
			console.error('Error creating customer:', error);
		}
	});
}

interface UpdateCustomerVariables {
	id: string;
	data: UpdateCustomerDTO;
};

export const useUpdateCustomer = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({id, data}: UpdateCustomerVariables) => updateCustomer(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['customers'] });
			queryClient.invalidateQueries({ queryKey: ['customers', 'deleted'] });
		},
		onError: (error) => {
			console.error('Error updating customer:', error);
		}
	});
}

export const useRestoreCustomer = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => restoreCustomer(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['customers'] });
			queryClient.invalidateQueries({ queryKey: ['customers', 'deleted'] });
		},
		onError: (error) => {
			console.error('Error restoring customer:', error);
		}
	});
}

export const useDeleteCustomer = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteCustomer(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['customers'] });
			queryClient.invalidateQueries({ queryKey: ['customers', 'deleted'] });
		},
		onError: (error) => {
			console.error('Error deleting customer:', error);
		}
	});
}

