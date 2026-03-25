import { BaseModel } from '@/shared/models/base-model';

export interface ProductImage extends BaseModel {
  id: string;
  productId: string;
  imageUrl: string;
}
