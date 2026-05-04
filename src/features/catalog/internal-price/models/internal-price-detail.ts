import { InternalPriceStatus, PriceTier } from ".";

export interface InternalPriceDetail {
    id?: string;
    productId: string;
    productName?: string;
    productCode?: string;
    suggestedPriceAmount: number;
    suggestedPriceCurrency: string;
    floorPriceAmount: number;
    floorPriceCurrency: string;
    status?: InternalPriceStatus;
    createdAt: string;
    expiresAt?: string;
    priceTiers: PriceTier[];
}