import api from "@/shared/configs/axios-config";

export interface StockOutListItem {
    id: string;
    code: string;
    description?: string;
    pickingNoteId: string;
    createdAt: string;
}

export interface StockOutCursorQuery {
    warehouseId?: string;
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
    create: (pickingNoteId: string, note?: string, warehouseId?: string) => {
        const config = warehouseId ? { headers: { "X-Warehouse-Id": warehouseId } } : {};
        return api.warehouse.post<any, string>("/stockOut/createStockOut", { pickingNoteId, note }, config);
    },

    getList: (params: StockOutCursorQuery) => {
        const { warehouseId, ...restParams } = params;
        const config: any = { params: restParams };
        if (warehouseId) {
            config.headers = { "X-Warehouse-Id": warehouseId };
        }
        return api.warehouse.get<any, StockOutCursorResult>("/stockOut/list", config);
    },

    getById: (id: string, warehouseId?: string) => 
        api.warehouse.get<any, any>(`/stockOut/detail/${id}`, warehouseId ? { headers: { "X-Warehouse-Id": warehouseId } } : undefined),

    createStockOut: (data: any, warehouseId?: string) => {
        const config = warehouseId ? { headers: { "X-Warehouse-Id": warehouseId } } : {};
        return api.warehouse.post<any, any>("/stockOut/createStockOut", data, config);
    },
};

export default StockOutService;
