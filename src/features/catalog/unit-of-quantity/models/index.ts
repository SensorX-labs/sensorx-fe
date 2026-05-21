export interface UnitOfQuantity {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export type UnitOfQuantityListResult = UnitOfQuantity[];

export interface CreateUnitOfQuantityRequest {
  name: string;
  description?: string;
}

export interface UpdateUnitOfQuantityRequest {
  name: string;
  description?: string;
}
