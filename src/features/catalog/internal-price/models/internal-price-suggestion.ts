import { InternalPrice } from "./common";
import { Result } from "@/shared/models/base-response";

export interface ProductInternalPriceSuggestionQuery {
    productIds: string[];
}

export type ProductInternalPriceSuggestionResult = Result<InternalPrice[]>