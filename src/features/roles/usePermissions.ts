import { useQuery } from "@tanstack/react-query";
import { getPermissions } from "./api";

export const usePermissions = () => {
	return useQuery({
		queryKey: ['permissions'],
		queryFn: getPermissions,
		staleTime: 1000 * 60 * 60, // Los permisos también son bastante estáticos, cache por 1 hora
	});
};