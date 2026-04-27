import { Result } from "@/shared/models/base-response";
import { ProductStatus } from "../enums/product-status";
import { ProductAttribute } from "./common";

/**
 * Interface cho API get details
 */
export interface ProductDetail {
  id: string;
  code: string;
  name: string;
  manufacture: string;
  categoryId: string | null;
  categoryName: string | null;
  unit: string;
  showcase?: string;
  attributes: ProductAttribute[];
  status: ProductStatus;
  createdAt: string;
  updatedAt?: string;
  images: string[];
}

export type ProductDetailResult = Result<ProductDetail>
