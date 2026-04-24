export type PriceTier = {
  quantity: number;
  price: number;
};

export type InternalPriceStatus = 'Active' | 'Inactive' | 'ExpiringSoon' | 'Expired';

export interface InternalPrice {
  id: string;
  productId: string;
  productName: string;
  suggestedPrice: number;
  floorPrice: number;
  status: InternalPriceStatus;
  createdAt: string;
  expiryDate: string;
  priceTiers: PriceTier[];
}

export interface ProductPriceAssignment {
  id: string;
  code: string;
  name: string;
  brand: string;
  unit: string;
}
