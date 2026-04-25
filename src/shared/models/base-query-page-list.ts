export interface BaseQueryOffsetPagedList {
    searchTerm?: string;
    pageNumber?: number;
    pageSize?: number;
}

export interface BaseQueryKeysetPagedList {
    searchTerm?: string;
    pageSize: number;
    lastCreatedAt?: string;
    lastId?: string;
    firstCreatedAt?: string;
    firstId?: string;
    isPrevious: boolean;
}