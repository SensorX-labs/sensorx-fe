import { InternalPrice } from "./common";

export interface ProductInternalPriceSuggestionQuery {
    productIds: string[];
}

export type ProductInternalPriceSuggestionResult = InternalPrice[]