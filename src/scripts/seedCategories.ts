// scripts/seedCategories.ts
import mongoose from "mongoose";
import Category from "../models/Category"; // adjust path

const MONGO_URI = process.env.MONGODB_URI!;

const defaultCategories = [
  { name: "Men", description: "Clothing and accessories for men" },
  { name: "Women", description: "Clothing and accessories for women" },
  { name: "Kids", description: "Apparel and accessories for kids" },
  { name: "Unisex", description: "Gender-neutral apparel" },
  { name: "Accessories", description: "Bags, belts, hats, etc." },
  { name: "Footwear", description: "Shoes and sandals" },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create(cat);
        console.log(`✅ Created category: ${cat.name}`);
      } else {
        console.log(`⚪ Already exists: ${cat.name}`);
      }
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  }
}

seed();
