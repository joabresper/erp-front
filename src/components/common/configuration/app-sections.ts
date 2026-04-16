import { ACCESS_LEVELS } from "../../../constants/access-levels";

export const APP_SECTIONS = {
  DASHBOARD: { 
    path: '/dashboard', 
    minLevel: ACCESS_LEVELS.PUBLIC,
    label: 'Inicio'
  },
  USERS: { 
    path: '/users', 
    minLevel: ACCESS_LEVELS.MANAGEMENT,
    label: 'Usuarios'
  },
  ROLES: { 
    path: '/roles', 
    minLevel: ACCESS_LEVELS.MANAGEMENT,
    label: 'Roles'
  },
  PRODUCTS: { 
    path: '/products', 
    minLevel: ACCESS_LEVELS.MANAGEMENT,
    label: 'Productos'
  },
  CUSTOMERS: {
    path: '/customers',
    minLevel: ACCESS_LEVELS.MANAGEMENT,
    label: 'Clientes'
  },
} as const;