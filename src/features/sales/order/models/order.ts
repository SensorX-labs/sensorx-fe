import { OrderStatus } from "../enums/order-status";
import { OrderItem } from "./order-item";

export interface Order {
    id ?: string ;
    quoteId : string ;
    code ?: string ;
    
    // thông tin khách hàng
    customerId : string ;
    recipientName : string ;
    recipientPhone : string ;
    companyName : string 
    customerEmail : string ;
    address : string ;
    taxCode : string ;

    // thông tin người gửi
    senderName : string 
    senderEmail : string 

    status : OrderStatus ;
    orderDate : string ;
    orderItems : OrderItem[]
}