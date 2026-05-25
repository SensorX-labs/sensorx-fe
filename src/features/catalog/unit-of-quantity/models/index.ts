import { OffsetPagedQuery, OffsetPagedResult } from '@/shared/models/offset-page.base';

export interface UnitOfQuantity {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export type UnitOfQuantityListResult = UnitOfQuantity[];
export type UnitOfQuantityPageListResult = OffsetPagedResult<UnitOfQuantity>;

export interface UnitOfQuantityPageListQuery extends OffsetPagedQuery {
  name?: string;
  description?: string;
  hasDescription?: boolean;
  isUpdated?: boolean;
  createdFrom?: string;
  createdTo?: string;
}

export interface CreateUnitOfQuantityRequest {
  name: string;
  description?: string;
}

export interface UpdateUnitOfQuantityRequest {
  name: string;
  description?: string;
}
