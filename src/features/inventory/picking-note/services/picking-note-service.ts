import api from "@/shared/configs/axios-config";

export interface PickingNoteListItem {
    id: string;
    code: string;
    description?: string;
    status: string;
    createdAt: string;
}

export interface PickingNoteDetail extends PickingNoteListItem {
    warehouseId: string;
    deliveryInfo: {
        receiverName: string;
        receiverPhone: string;
        deliveryAddress: string;
        companyName: string;
        taxCode: string;
    };
    items: {
        productId: string;
        productCode: string;
        productName: string;
        unit: string;
        quantity: number;
        manufactureName: string;
        note?: string;
    }[];
    transferOrderCode?: string;
    linkedTransferOrderId?: string;
    sourceDocumentId?: string;
    sourceDocumentType?: number;
}

export interface PickingNoteCursorQuery {
    warehouseId?: string;
    searchTerm?: string;
    pageSize?: number;
    isPrevious?: boolean;
    firstCreatedAt?: string;
    firstId?: string;
    lastCreatedAt?: string;
    lastId?: string;
}

export interface PickingNoteCursorResult {
    items: PickingNoteListItem[];
    firstCreatedAt?: string;
    firstId?: string;
    lastCreatedAt?: string;
    lastId?: string;
    hasNext: boolean;
    hasPrevious: boolean;
}

export const PickingNoteService = {
    createPickingNote: (data: any) => 
        api.warehouse.post<any, string>("/pickingNote/createPickingNote", data),

    startPicking: (id: string) => 
        api.warehouse.post<any, string>("/pickingNote/startPicking", { pickingNoteId: id }),

    completePicking: (id: string) => 
        api.warehouse.post<any, string>("/pickingNote/completePicking", { pickingNoteId: id }),

    cancelPicking: (id: string, reason?: string) => 
        api.warehouse.post<any, string>("/pickingNote/cancelPicking", { pickingNoteId: id, reason }),

    getById: (id: string) => 
        api.warehouse.get<any, PickingNoteDetail>(`/pickingNote/getPickingNote/${id}`),

    getList: (params: PickingNoteCursorQuery) => {
        const { warehouseId, ...restParams } = params;
        const config: any = { params: restParams };
        if (warehouseId) {
            config.headers = { "X-Warehouse-Id": warehouseId };
        }
        return api.warehouse.get<any, PickingNoteCursorResult>("/pickingNote/getPickingNotes", config);
    },
};

export default PickingNoteService;
