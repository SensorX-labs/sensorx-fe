import { DeliveryInfo } from "../../picking-note/models/delivery-info";

export interface StockOut {
    id ?:string ; 
    code ?: string ;
    warehouseId: string ;
    pickingNoteId?: string ;
    description ?: string ;
    deliveryInfo ?: DeliveryInfo;
}