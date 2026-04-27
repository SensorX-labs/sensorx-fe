import { Result } from "@/shared/models/base-response";
import { ProductStatus } from "../enums/product-status";
import { ProductAttribute } from "./common";

export interface GetPageProductDetailResponse {
    id: string;
    code: string;
    name: string;
    manufacture: string;
    categoryId: string;
    categoryName: string;
    unit: string;
    showcase: string | null;
    attributes: ProductAttribute[];
    status: ProductStatus;
    createdAt: Date;
    updatedAt: Date | null;
    images: string[];
    internalPricesSuggestion: InternalPriceDto | null;
}

export interface InternalPriceDto {
    id: string;
    productId: string;
    suggestedPriceAmount: number;
    suggestedPriceCurrency: string;
    floorPriceAmount: number;
    floorPriceCurrency: string;
    priceTiers: PriceTierDto[];
    createdAt: Date;
}

export interface PriceTierDto {
    quantity: number;
    amount: number;
    currency: string;
}

export type GetPageProductDetailResult = Result<GetPageProductDetailResponse>