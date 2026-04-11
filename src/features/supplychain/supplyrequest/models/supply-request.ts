import { SupplyRequestStatus } from "../enums/supply-request-status";
import { SupplyRequestItem } from "./supply-request-item";

export interface SupplyRequest {
    id ?: string ;
    warehouseId : string ;
    status : SupplyRequestStatus ;
    items : SupplyRequestItem[] ;
    note ?: string ;
}