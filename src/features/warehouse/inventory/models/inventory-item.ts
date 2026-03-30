import { WarehouseItemLocation } from "./warehouse-item-location";

export interface InventoryItem {
    id ?: string ;
    productId: string;
    location : WarehouseItemLocation ;
    physicalQuantity: number;
    allocatedQuantity: number;
}