import { QuoteStatus } from "../constants/quote-status";
import { CustomerInfo } from "../../../../shared/models/customer-info";
import { QuoteResponse } from "./quote-response";
import { QuoteItem } from "./quote-item";

export interface Quote {
    id : string ;
    parentId : string | null ;
    code : string ;
    REQId : string ;
    customerId : string ;
    customerInfo : CustomerInfo ;
    items : QuoteItem[] ;
    note : string | null ;
    status : QuoteStatus ;
    response : QuoteResponse | null ;
    quoteDate : string ;
}