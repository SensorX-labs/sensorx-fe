import api from "@/shared/configs/axios-config";

export interface InventoryItemListItem {
    id: string;
    productId: string;
    physicalQuantity: number;
    allocatedQuantity: number;
    warehouseName?: string;
    brandZone?: string;
    rackCode?: string;
    createdAt: string;
}

export interface InventoryCursorQuery {
    searchTerm?: string;
    pageSize?: number;
    isPrevious?: boolean;
    firstCreatedAt?: string;
    firstId?: string;
    lastCreatedAt?: string;
    lastId?: string;
}

export interface InventoryCursorResult {
    items: InventoryItemListItem[];
    hasNext: boolean;
    hasPrevious: boolean;
    firstCreatedAt?: string;
    firstId?: string;
    lastCreatedAt?: string;
    lastId?: string;
}

export const InventoryService = {
    getInventoryList: (params: InventoryCursorQuery) => 
        api.warehouse.get<any, InventoryCursorResult>("/inventory/list", { params }),
};

export default InventoryService;
