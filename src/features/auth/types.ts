import type { UserWithRole } from "../../types/models";

export interface AuthResponse {
  token: string;
  user: UserWithRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}