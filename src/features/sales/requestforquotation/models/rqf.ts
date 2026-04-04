import { CustomerInfo } from "@/shared/models/customer-info";
import { RfqStatus } from "../constants/rfq-status";

export interface Rfq {
    id : string ;
    code : String ;
    userId : string ;
    customerId : string ;
    customerInfo : CustomerInfo ;
    status : RfqStatus ;
}