import { BaseModel } from '@/shared/models/base-model';
import { ProductCategory } from './product-category';
import { UnitOfMeasure } from './unit-of-measure';
import { ProductStatus } from './product-status';
import { ProductAttribute } from './product-attribute';
import { ProductImage } from './product-image';
import { ProductPriceList } from './product-price-list';

export interface Product extends BaseModel {
  id: string;
  code: string;
  name: string;
  manufacture: string;
  categoryId: string;
  category?: ProductCategory;
  status: ProductStatus;
  unit?: UnitOfMeasure;
  
  priceList?: ProductPriceList; // Danh sách giá

  attributes? : ProductAttribute[];
  images ?: ProductImage [];
}