export interface CreateUserDTO {
  email: string;
  fullName: string;
  password: string;
  address?: string;
  phone?: string;
  roleId: string;
}

// Omitimos password para actualizaciones, usualmente es un endpoint aparte
export interface UpdateUserDTO extends Partial<Omit<CreateUserDTO, 'password' | 'roleId'>> {}