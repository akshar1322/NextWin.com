import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IBanner extends Document {
  title: string;
  image: string;
  link?: string;
  active: boolean;
}

const bannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    link: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Banner || model<IBanner>("Banner", bannerSchema);
