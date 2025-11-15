import { NextResponse } from "next/server";
import Category from "@/models/Category";
import dbConnect from "@/lib/dbConnect";

// 🔹 GET — Get all categories
export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, categories });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// 🔹 POST — Create a new category
export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const category = new Category(data);
    await category.save();
    return NextResponse.json({ success: true, category });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
