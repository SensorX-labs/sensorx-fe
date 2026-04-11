import { ProductCategory } from "../../category/models/product-category";
import { ProductStatus } from "../enums/product-status";
import { ProductAttribute } from "./product-attribute";
import { ProductImage } from "./product-image";
import { ProductShowcase } from "./product-showcase";

export interface Product {
    id?: string ;
    code ?: string ;
    name : string ;
    manufacturer ?: string ;
    category : ProductCategory ;
    status : ProductStatus ;
    unit ?: string ;
    

    // trường thông tin thêm 
    productShowcases ?: ProductShowcase[] ;
    productImages ?: ProductImage[] ;
    productAttributes ?: ProductAttribute[] ;
}