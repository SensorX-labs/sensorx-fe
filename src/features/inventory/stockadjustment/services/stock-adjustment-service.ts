import api from "@/shared/configs/axios-config";

export interface StockAdjustmentListItem {
    id: string;
    code: string;
    reason: string;
    status: string;
    createdAt: string;
}

export interface StockAdjustmentDetail extends StockAdjustmentListItem {
    description?: string;
    items: {
        productId: string;
        productCode: string;
        productName: string;
        unit: string;
        adjustedQuantity: number;
        note?: string;
    }[];
}

export interface StockAdjustmentCursorQuery {
    searchTerm?: string;
    pageSize?: number;
    isPrevious?: boolean;
    firstCreatedAt?: string;
    firstId?: string;
    lastCreatedAt?: string;
    lastId?: string;
}

export interface StockAdjustmentCursorResult {
    items: StockAdjustmentListItem[];
    firstCreatedAt?: string;
    firstId?: string;
    lastCreatedAt?: string;
    lastId?: string;
    hasNext: boolean;
    hasPrevious: boolean;
}

export const StockAdjustmentService = {
    create: (data: any) => 
        api.warehouse.post<any, string>("/stockOut/createStockOut", { ...data, isAdjustment: true }),

    approve: (id: string) => 
        api.warehouse.post<any, string>("/stockOut/approve", { id }), // Assuming there's an approve endpoint or similar logic

    reject: (id: string, reason: string) => 
        api.warehouse.post<any, string>("/stockOut/reject", { id, reason }),

    getById: (id: string) => 
        api.warehouse.get<any, StockAdjustmentDetail>(`/stockOut/detail/${id}`),

    getList: (params: StockAdjustmentCursorQuery) => 
        api.warehouse.get<any, StockAdjustmentCursorResult>("/stockOut/list", { params: { ...params, isAdjustmentOnly: true } }),
};

export default StockAdjustmentService;
