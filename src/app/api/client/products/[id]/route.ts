import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectDB from "@/lib/dbConnect";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching single product:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
