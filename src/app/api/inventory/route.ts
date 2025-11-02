import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Inventory from "@/models/Inventory";

export async function GET() {
  try {
    await connectDB();
    const inventory = await Inventory.find().sort({ lastUpdated: -1 }).lean();

    return NextResponse.json({
      success: true,
      inventory,
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
