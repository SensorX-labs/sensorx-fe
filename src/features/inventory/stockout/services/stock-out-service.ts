import api from "@/shared/configs/axios-config";

export interface StockOutListItem {
    id: string;
    code: string;
    description?: string;
    pickingNoteId: string;
    createdAt: string;
}

export interface StockOutCursorQuery {
    searchTerm?: string;
    pageSize?: number;
    isPrevious?: boolean;
    firstCreatedAt?: string;
    firstId?: string;
    lastCreatedAt?: string;
    lastId?: string;
}

export interface StockOutCursorResult {
    items: StockOutListItem[];
    firstCreatedAt?: string;
    firstId?: string;
    lastCreatedAt?: string;
    lastId?: string;
    hasNext: boolean;
    hasPrevious: boolean;
}

export const StockOutService = {
    create: (pickingNoteId: string) => 
        api.warehouse.post<any, string>("/stockOut/createStockOut", { pickingNoteId }),

    getList: (params: StockOutCursorQuery) => 
        api.warehouse.get<any, StockOutCursorResult>("/stockOut/list", { params }),
};

export default StockOutService;
