export interface BaseQueryOffsetPagedList {
    searchTerm?: string;
    pageNumber?: number;
    pageSize?: number;
}

export interface BaseQueryLoadMore {
    pageSize?: number;
    searchTerm?: string;
    lastValue?: string;
    lastId?: string;
    isDescending: boolean;
}