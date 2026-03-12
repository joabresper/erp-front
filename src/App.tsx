import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Router';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

// Configuración del cliente de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false, // En un ERP a veces molesta que recargue solo al cambiar de ventana
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Notifications position="top-right" zIndex={2077} />
        <RouterProvider router={router} />
      </MantineProvider>
    </QueryClientProvider>
  );
}