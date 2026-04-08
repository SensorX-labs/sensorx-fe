import { CustomerInfo } from "@/shared/models/customer-info";
import { RfqStatus } from "../constants/rfq-status";
import { RfqItem } from "./rfq-item";

export interface Rfq {
    id : string ;
    code : string ;
    userId : string | null ;
    customerId : string ;
    customerInfo : CustomerInfo ;
    items : RfqItem[] ;
    status : RfqStatus ;
    createdAt : string ;
}