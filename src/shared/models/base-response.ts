export interface Result<T = void> {
  isSuccess: boolean;
  message?: string;
  value?: T;
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

export interface LoadMorePagedResult<T> {
  items: T[];
  lastValue?: string;
  lastId?: string;
  hasNext: boolean;
}