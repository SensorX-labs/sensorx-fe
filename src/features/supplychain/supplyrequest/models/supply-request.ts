import { TransferOrder } from "../../transferorder/models/transfer-order";
import { SupplyRequestStatus } from "../enums/supply-request-status";
import { PurchaseOption } from "./purchase-option";
import { SupplyRequestItem } from "./supply-request-item";

export interface SupplyRequest {
    id ?: string ;
    warehouseId : string ;
    status : SupplyRequestStatus ;
    items : SupplyRequestItem[] ;
    note ?: string ;

    // thông tin cung ứng
    purchaseOptions : PurchaseOption[] ;
    transferOrders : TransferOrder[] ;
}