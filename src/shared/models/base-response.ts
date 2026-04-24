export interface Result<T = void> {
  isSuccess: boolean;
  isFailure: boolean;
  message?: string;
  value: T;
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
