import api from "@/shared/configs/axios-config";

export interface StockInListItem {
    id: string;
    code: string;
    description?: string;
    createdBy: string;
    createdAt: string;
}

export interface StockInCursorQuery {
    warehouseId?: string;
    searchTerm?: string;
    status?: string;
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
    getStockIns: (params: StockInCursorQuery) => {
        const { warehouseId, ...restParams } = params;
        const config: any = { params: restParams };
        if (warehouseId) {
            config.headers = { "X-Warehouse-Id": warehouseId };
        }
        return api.warehouse.get<any, StockInCursorResult>("/stockIn/list", config);
    },
        
    getById: (id: string) =>
        api.warehouse.get<any, any>(`/stockIn/${id}`),

    createStockIn: (data: any) => 
        api.warehouse.post<any, string>("/stockIn/createStockIn", data),
};

export default StockInService;
