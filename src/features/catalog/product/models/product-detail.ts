import { ProductStatus } from "../enums/product-status";
import { ProductAttribute } from "./common";

export interface ProductDetail {
  id: string;
  code: string;
  name: string;
  supplierId: string | null;
  supplierName: string;
  categoryId: string | null;
  categoryName: string | null;
  unitOfQuantityId: string | null;
  unitOfQuantityName: string;
  showcase?: string;
  attributes: ProductAttribute[];
  status: ProductStatus;
  createdAt: string;
  updatedAt?: string;
  images: string[];
}

export type ProductDetailResult = ProductDetail;
