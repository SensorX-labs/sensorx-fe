import { QuoteStatus } from "../constants/quote-status";
import { CustomerInfo } from "../../../../shared/models/customer-info";
import { QuoteResponse } from "./quote-response";

export interface Quote {
    id : string ;
    parentId : string | null ;
    code : String ;
    REQId : string ;
    customerId : string ;
    customerInfo : CustomerInfo ;
    note : string | null ;
    status : QuoteStatus ;
    response : QuoteResponse | null ;
    quoteDate : string ;
}