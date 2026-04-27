import { ProductAttribute } from "./common";

/**
 * Interface cho API create/update product
 */
export interface ProductCommand {
  name: string;
  manufacture: string;
  categoryId: string | null;
  unit: string;
  showcase?: string;
  images: string[];
  attributes: ProductAttribute[];
}
