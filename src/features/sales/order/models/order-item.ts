export interface OrderItem {
    id ?: string ;
    productId : string ;
    productCode : string ;
    manufacturer : string ;
    unit : string ;
    quantity : number ;
    unitPrice : number ;
    taxtRate : number ;
    note ?: string ;
}