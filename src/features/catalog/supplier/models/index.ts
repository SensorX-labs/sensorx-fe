export interface Supplier {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export type SupplierListResult = Supplier[];

export interface CreateSupplierRequest {
  name: string;
  description?: string;
}

export interface UpdateSupplierRequest {
  name: string;
  description?: string;
}
