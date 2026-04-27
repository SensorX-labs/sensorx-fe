import { Result } from "@/shared/models/base-response";
import { InternalPrice } from "./common";

export interface ProductInternalPriceHistory {
  productId: string;
  productCode: string;
  productName: string;
  internalPrices: InternalPrice[];
}

export type ProductInternalPriceHistoryResult = Result<ProductInternalPriceHistory>
