export interface OffsetPagedQuery {
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface OffsetPagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}