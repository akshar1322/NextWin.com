import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  addresses?: {
    label: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  }[];
  role?: "customer" | "admin";
  createdAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phone: String,
    addresses: [
      {
        label: String,
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String,
      },
    ],
    role: { type: String, default: "customer" },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", userSchema);
