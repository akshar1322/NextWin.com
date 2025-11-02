import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: mongoose.Types.ObjectId;
  brand?: string;
  stock: number;
  sku?: string;
  inventoryId?: mongoose.Types.ObjectId;
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
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    brand: { type: String, index: true },
    stock: { type: Number, default: 0 },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    inventoryId: {
      type: Schema.Types.ObjectId,
      ref: "Inventory",
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

// 🔍 Compound indexes
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ stock: 1 });

const Product = models.Product || model<IProduct>("Product", productSchema);
export default Product;
