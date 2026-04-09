import { PaymentMethod } from "../enums/payment-method";
import { PaymentStatus } from "../enums/payment-status";

export interface Payment {
    id ?: string ;
    invoiceId : string ;
    orderId : string ;
    amount : number ;
    method : PaymentMethod;
    status : PaymentStatus;
    transactionDate ?: string ;
    bankTransactionId ?: string ;
    transferContent : string ;
}