export interface StockOutItem {
    id ?: string ;
    productId : string ;
    productCode : string ;
    productName : string ;
    unit : string ; 
    quantity : number ;
    manufacturerName : string ;
    note ?: string ;
    stockOutId ?: string ;
}