export interface OrderItem {
    id ?: string ;
    productId : string ;
    productCode : string ;
    productName ?: string ;
    manufacturer : string ;
    unit : string ;
    quantity : number ;
    unitPrice : number ;
    taxRate : number ;
    note ?: string ;
    lineAmount ?: number ;
    taxAmount ?: number ;
    totalLineAmount ?: number ;
}
