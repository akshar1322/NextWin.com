// app/api/inventory/meta/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Inventory from "@/models/Inventory";

export async function GET() {
  try {
    await connectDB();
    const meta = await Inventory.findOne().select("categories tags sizes colors -_id").lean();
    return NextResponse.json(meta || {});
  } catch (error) {
    console.error("Error fetching inventory metadata:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
