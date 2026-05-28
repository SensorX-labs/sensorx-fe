import { OffsetPagedQuery, OffsetPagedResult } from '@/shared/models/offset-page.base';

export interface Supplier {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export type SupplierListResult = Supplier[];
export type SupplierPageListResult = OffsetPagedResult<Supplier>;

export interface SupplierPageListQuery extends OffsetPagedQuery {
  name?: string;
  description?: string;
  hasDescription?: boolean;
  isUpdated?: boolean;
  createdFrom?: string;
  createdTo?: string;
}

export interface CreateSupplierRequest {
  name: string;
  description?: string;
}

export interface UpdateSupplierRequest {
  name: string;
  description?: string;
}
