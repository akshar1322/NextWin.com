import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";

// 🟢 GET — Single category
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();

    const category = await Category.findById(id);
    if (!category)
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error("GET error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// 🟡 PUT — Update category
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // ✅ FIXED — await params
    const body = await req.json();
    await dbConnect();

    const updated = await Category.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// 🔴 DELETE — Delete category
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // ✅ FIXED — await params
    await dbConnect();

    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted)
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error: any) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
