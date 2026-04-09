export interface InvoiceItem {
    id ?: string ;
    productId : string ;
    productName : string ;
    unit : string ;
    quantity : string ;
    unitPrice : number ; 
    taxtRate : number ;
    lineAmount : number 
    taxtAmount : number ; 
    totalLineAmount : number ;
}