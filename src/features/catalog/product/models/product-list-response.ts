export interface ProductAttribute {
  attributeName: string;
  attributeValue: string;
}

export interface ProductShowcase {
  summary: string;
  body: string;
}

export interface ProductListItem {
  id: string;
  code: string;
  name: string;
  manufacture: string;
  unit: string;
  status: number;
  categoryId: string;
  categoryName: string;
  showcase: ProductShowcase;
  images: string[];
  attributes: ProductAttribute[];
  createdAt: string;
  updatedAt: string;
}