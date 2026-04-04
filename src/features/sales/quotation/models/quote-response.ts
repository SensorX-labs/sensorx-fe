import { PaymentMethod } from "../constants/payment-method";
import { PaymentTern } from "../constants/payment-term";
import { QuoteResponseStatus } from "../constants/quote-response-status";

export interface QuoteResponse {
    responseType : QuoteResponseStatus
    paymentMethod : PaymentMethod
    paymentTerm : PaymentTern
    shippingAddress : string ;
    feedback : string ;
}