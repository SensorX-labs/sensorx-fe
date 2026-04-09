import { InvoiceStatus } from "../enums/invoice-status";
import { InvoiceItem } from "./invoice-item";
import { Payment } from "./payment";

export interface Invoice {
    id?: string ;
    code ?: string ;
    orderId : string ;

    // billing info 
    companyName : string ; 
    taxtCode : string ;
    address : string ;
    email : string ;

    invoiceSymbol : string ;
    invoiceNumber : string ;
    taxAuthorityCode : string ;
    issueAt : string ;
    subTotal : number ; 
    taxAmount : number ; 
    grandTotal : number ; 
    amountPaid : number ;
    status : InvoiceStatus

    items : InvoiceItem[]
    payments : Payment[]
}