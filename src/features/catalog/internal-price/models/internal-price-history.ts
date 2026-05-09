import { InternalPrice } from "./common";

export interface ProductInternalPriceHistory {
  productId: string;
  productCode: string;
  productName: string;
  internalPrices: InternalPrice[];
}

export type ProductInternalPriceHistoryResult = ProductInternalPriceHistory
