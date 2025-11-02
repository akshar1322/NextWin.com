import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  status: "active" | "inactive";
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    image: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

const Category = models.Category || model<ICategory>("Category", categorySchema);
export default Category;
