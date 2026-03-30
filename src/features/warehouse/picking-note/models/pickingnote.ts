import { DeliveryInfo } from "./delivery-info";
import { DocumentReference } from "./document-references";
import { PickingNoteStatus } from "./picking-status";

export interface PickingNote {
    id? : string ; 
    code ?: string ;
    warehouseId : string ;
    sourceDocumment ?: DocumentReference ;
    status : PickingNoteStatus ;
    description ?: string ;
    deliveryInfo : DeliveryInfo ;
}