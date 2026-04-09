export interface QuoteItem {
    id? : string ;
    productId? : string ;
    productCode : string ;
    productName : string ;
    manufacturer? : string ;
    unit : string ;
    quantity : number ;
    unitPrice : number ;
    taxRate : number ;
    category?: string;
}