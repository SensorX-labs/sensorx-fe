import { TransferOrderStatus } from "../enums/transfer-order-status";
import { TransferOrderItem } from "./transfer-order-item";

export interface TransferOrder {
    id ?: string ;
    code ?: string ;
    sourceWarehouseId : string ;
    destinationWarehouseId : string ;
    status : TransferOrderStatus ;
    note ?: string ;
    items : TransferOrderItem[] ;
    supplyRequestId ?: string ;
}
