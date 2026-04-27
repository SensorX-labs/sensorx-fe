import { PriceTier } from ".";

export interface InternalPriceDetail {
    id ?: string ;
    productId : string ;
    suggestedPriceAmount : number ;
    suggestedPriceCurrency : string ;
    floorPriceAmount : number ;
    floorPriceCurrency : string ;
    createdAt : string ;
    priceTiers : PriceTier[]
}