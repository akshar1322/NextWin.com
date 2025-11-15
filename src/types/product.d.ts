// src/types/product.d.ts
export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  brand?: string;
  stock: number;
  sku?: string;
  tags?: string[];
  sizes?: string[];
  colors?: string[];
  rating?: number;
  reviews?: number;
  images: string[];
  tag?: string; // optional badge
  affiliates?: {
    amazon?: string;
    flipkart?: string;
    myntra?: string;
  };
}
