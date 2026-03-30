import { BaseModel } from '@/shared/models/base-model';

export interface ProductPriceTier extends BaseModel {
  id: string;
  productPriceListId: string;
  quantity: number; 
  defaultPrice: number; 
  minPrice: number; 
}
