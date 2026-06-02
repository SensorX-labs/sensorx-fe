export interface CursorPagedResult<T> {
  items: T[];
  firstCreatedAt?: string;
  firstId?: string;
  lastCreatedAt?: string;
  lastId?: string;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Result<T> {
  isSuccess: boolean;
  value: T;
  error?: string;
}

export type CursorPagedListResult<T> = Result<CursorPagedResult<T>>;
