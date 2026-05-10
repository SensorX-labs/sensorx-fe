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
        api.warehouse.post<any, string>("/stockAdjustment/create", data),

    approve: (id: string) => 
        api.warehouse.post<any, string>("/stockAdjustment/approve", { id }),

    reject: (id: string, reason: string) => 
        api.warehouse.post<any, string>("/stockAdjustment/reject", { id, reason }),

    getById: (id: string) => 
        api.warehouse.get<any, StockAdjustmentDetail>(`/stockAdjustment/detail/${id}`),

    getList: (params: StockAdjustmentCursorQuery) => 
        api.warehouse.get<any, StockAdjustmentCursorResult>("/stockAdjustment/list", { params }),
};

export default StockAdjustmentService;
