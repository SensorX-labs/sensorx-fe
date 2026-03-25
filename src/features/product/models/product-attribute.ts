import { BaseModel } from '@/shared/models/base-model';

export interface ProductAttribute extends BaseModel {
  id: string;
  productId: string;
  name: string;
  value: string;
}
