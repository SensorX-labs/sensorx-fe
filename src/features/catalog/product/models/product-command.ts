import { ProductAttribute } from "./common";

export interface ProductCommand {
  name: string;
  supplierId: string | null;
  categoryId: string | null;
  unitOfQuantityId: string | null;
  showcase?: string;
  images: string[];
  attributes: ProductAttribute[];
}
