import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  status: "active" | "inactive";
  productCount?: number;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true, index: true },
    description: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    productCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Category = models.Category || model<ICategory>("Category", categorySchema);
export default Category;
