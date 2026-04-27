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
