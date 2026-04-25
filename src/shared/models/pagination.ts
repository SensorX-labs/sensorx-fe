export interface PaginationRequest {
  pageNumber: number;
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
