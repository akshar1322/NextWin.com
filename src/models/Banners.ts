import mongoose, { Schema, Document } from "mongoose";

export interface IBanner extends Document {
  title: string;
  link: string;
  tags: string[];
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);
