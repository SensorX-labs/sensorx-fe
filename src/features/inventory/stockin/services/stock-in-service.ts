import api from "@/shared/configs/axios-config";

export interface StockInListItem {
    id: string;
    code: string;
    description?: string;
    createdBy: string;
    createdAt: string;
}

export interface StockInCursorQuery {
    searchTerm?: string;
    pageSize?: number;
    isPrevious?: boolean;
    firstCreatedAt?: string;
    firstId?: string;
    lastCreatedAt?: string;
    lastId?: string;
}

export interface StockInCursorResult {
    items: StockInListItem[];
    firstCreatedAt?: string;
    firstId?: string;
    lastCreatedAt?: string;
    lastId?: string;
    hasNext: boolean;
    hasPrevious: boolean;
}

export const StockInService = {
    getStockIns: (params: StockInCursorQuery) => 
        api.warehouse.get<any, StockInCursorResult>("/stockIn/list", { params }),
        
    getById: (id: string) =>
        api.warehouse.get<any, any>(`/stockIn/${id}`),

    createStockIn: (data: any) => 
        api.warehouse.post<any, string>("/stockIn/createStockIn", data),
};

export default StockInService;
