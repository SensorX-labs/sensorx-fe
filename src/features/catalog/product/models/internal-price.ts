import {PriceTier} from "./price-tier";

export interface InternalPrice {
    id?: string;
    productId: string;
    suggestedPrice: number;
    floorPrice: number;
    priceTiers: PriceTier[]
}
