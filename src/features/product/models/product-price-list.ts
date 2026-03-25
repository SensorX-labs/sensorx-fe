import { BaseModel } from '@/shared/models/base-model';
import { PriceStatus } from './price-status';
import { ProductPriceTier } from './product-price-tier';

export interface ProductPriceList extends BaseModel {
  id: string;
  productId: string;
  status: PriceStatus;
  startDate: string; 
  endDate?: string; 
  tiers: ProductPriceTier[]; 
}
