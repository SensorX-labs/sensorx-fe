import { CustomerInfo } from "@/shared/models/customer-info";
import { RfqStatus } from "../constants/rfq-status";

export interface Rfq {
    id : string ;
    code : string ;
    userId : string | null ;
    customerId : string ;
    customerInfo : CustomerInfo ;
    status : RfqStatus ;
}