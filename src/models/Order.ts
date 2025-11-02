import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: string;
  orderStatus: "pending" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    total: Number,
    paymentStatus: { type: String, default: "pending" },
    paymentMethod: { type: String, default: "cod" },
    orderStatus: { type: String, default: "pending" },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
  },
  { timestamps: true }
);

export default models.Order || model<IOrder>("Order", orderSchema);
