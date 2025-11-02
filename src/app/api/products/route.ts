import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const limit = Number(searchParams.get("limit")) || 0;

    const filter: any = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (tag) filter.tags = { $in: [tag] };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter)
      .populate("category", "name") // ✅ shows category name
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, products },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error fetching products:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
