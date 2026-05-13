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
    warehouseId?: string;
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
    getInventoryList: (params: InventoryCursorQuery) => {
        const { warehouseId, ...restParams } = params;
        const config: any = { params: restParams };
        if (warehouseId && warehouseId !== 'all') {
            config.headers = { "X-Warehouse-Id": warehouseId };
        }
        return api.warehouse.get<any, InventoryCursorResult>("/inventory/list", config);
    },
    getConsolidatedInventory: () => 
        api.master.get<any, { items: InventoryItemListItem[]; totalCount: number }>("/warehouses/inventory/total"),
};

export default InventoryService;
