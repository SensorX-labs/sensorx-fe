export interface PaginationRequest {
  pageIndex: number;
  pageSize: number;
  searchTerm?: string;
}

export interface PaginationResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
