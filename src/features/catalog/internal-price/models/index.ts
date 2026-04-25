import { BaseQueryOffsetPagedList } from "@/shared/models/base-query-page-list";
import { OffsetPagedResult, Result } from "@/shared/models/base-response";

// Api /api/catalog/internalPrices/list
export type InternalPriceStatus = 'Active' | 'ExpiringSoon' | 'Expired';
export interface PriceTier {
  quantity: number;
  price: number;
  currency: string;
}
export interface InternalPrice {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  suggestedPrice: number;
  suggestedPriceCurrency: string;
  floorPrice: number;
  floorPriceCurrency: string;
  status: InternalPriceStatus;
  createdAt: string;
  expiresAt: string;
  priceTiers: PriceTier[];
}
export type InternalPriceListResult = Result<OffsetPagedResult<InternalPrice>>
export interface GetPageListInternalPriceQuery extends BaseQueryOffsetPagedList {
  status?: InternalPriceStatus;
}

// Api /api/catalog/internalPrices/stats
// response
export interface InternalPriceStats {
  totalCount: number;
  activeCount: number;
  expiringSoonCount: number;
  expiredCount: number;
}
export type InternalPriceStatsResult = Result<InternalPriceStats>

// Api /api/catalog/internalPrices/create
export interface PriceTierOfCreate {
  quantity: number;
  price: number;
}
export interface CreateInternalPriceRequest {
  productId: string;
  suggestedPrice: number;
  floorPrice: number;
  expiresAt: string | null;
  isInfinite: boolean;
  priceTiers: PriceTierOfCreate[];
}

// API /api/catalog/internalPrices/product/{productId}/history
export interface ProductInternalPriceHistory {
  productId: string,
  productCode: string,
  productName: string,
  internalPrices: InternalPrice[]
}

export type ProductInternalPriceHistoryResult = Result<ProductInternalPriceHistory>
