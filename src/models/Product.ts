// models/Product.ts
import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string; // changed to string
  brand?: string;
  stock: number;
  sku?: string;
  tags?: string[];
  tag?: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
  rating?: number;
  reviews?: number;
  affiliates?: {
    amazon?: string;
    flipkart?: string;
    myntra?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, index: true },
    category: { type: String, required: true, index: true }, // string instead of ObjectId
    brand: { type: String, index: true },
    stock: { type: Number, default: 0 },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    tags: [{ type: String, index: true }],
    tag: { type: String },
    images: {
      type: [String],
      validate: {
        validator: (arr: string[]) => arr.length >= 1,
        message: "At least one product image is required",
      },
    },
    sizes: [String],
    colors: [String],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    affiliates: {
      amazon: String,
      flipkart: String,
      myntra: String,
    },
  },
  { timestamps: true }
);

// 🔍 Indexes
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ stock: 1 });

// ✅ Force delete old cached model to avoid schema mismatch errors
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

const Product = model<IProduct>("Product", productSchema);
export default Product;

