export interface CreateCustomerDTO {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  taxId?: string;
  taxCondition?: string;
}

export interface UpdateCustomerDTO extends Partial<CreateCustomerDTO> {}