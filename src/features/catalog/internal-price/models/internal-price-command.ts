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

export interface ExtendInternalPriceRequest {
  expiresAt: string;
}
