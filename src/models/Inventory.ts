import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IInventory extends Document {
  productId?: mongoose.Types.ObjectId;
  sku: string;
  warehouse?: string;
  quantity: number;
  reserved?: number;
  damaged?: number;
  lowStockThreshold: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  lastUpdated?: Date;

  // Global metadata
  categories?: string[];
  tags?: string[];
  sizes?: string[];
  colors?: string[];
}

const inventorySchema = new Schema<IInventory>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", index: true },
    sku: { type: String, required: true, unique: true, index: true },
    warehouse: { type: String, default: "Main Warehouse" },
    quantity: { type: Number, required: true, default: 0 },
    reserved: { type: Number, default: 0 },
    damaged: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    status: {
      type: String,
      enum: ["in-stock", "low-stock", "out-of-stock"],
      default: "in-stock",
      index: true,
    },
    lastUpdated: { type: Date, default: Date.now },

    categories: [String],
    tags: [String],
    sizes: [String],
    colors: [String],
  },
  { timestamps: true }
);

const Inventory = models.Inventory || model<IInventory>("Inventory", inventorySchema);
export default Inventory;
