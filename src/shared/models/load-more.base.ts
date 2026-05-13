export interface LoadMorePagedQuery {
    pageSize?: number;
    searchTerm?: string;
    lastValue?: string;
    lastId?: string;
    isDescending: boolean;
}

export interface LoadMorePagedResult<T> {
    items: T[];
    lastValue?: string;
    lastId?: string;
    hasNext: boolean;
}