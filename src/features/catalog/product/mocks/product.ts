import { ProductStatus } from "../enums/product-status";

export interface ProductImage {
  imageUrl: string;
}

export interface ProductDetailAttribute {
  attributeName: string;
  attributeValue: string;
}

export interface ProductShowcase {
  id: string;
  summary: string;
  body: string;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  manufacturer: string;
  category: ProductCategory;
  status: ProductStatus;
  unit: string;
  productImages: ProductImage[];
  productAttributes: ProductDetailAttribute[];
  productShowcases?: ProductShowcase[];
}
