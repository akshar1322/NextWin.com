import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectDB from "@/lib/dbConnect";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = context.params; // ✅ Access params safely

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // 🧹 Optionally delete images from Cloudinary
    if (product.images?.length) {
      for (const url of product.images) {
        const publicId = url.split("/").pop()?.split(".")[0];
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(`products/${publicId}`);
          } catch (err) {
            console.warn(`Cloudinary delete failed for ${url}`);
          }
        }
      }
    }

    await Product.findByIdAndDelete(id);
    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error deleting product:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}


/**
 * ✏️ PUT /api/products/[id]
 * Update product info
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;
    const formData = await req.formData();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    // ✅ Handle images
    const images = formData.getAll("images") as File[];
    const uploadedImages: string[] = [...(product.images || [])];

    // If new images are uploaded, push them to Cloudinary
    for (const image of images) {
      if (image instanceof File && image.size > 0) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const base64 = buffer.toString("base64");
        const result = await cloudinary.uploader.upload(`data:${image.type};base64,${base64}`, {
          folder: "products",
        });
        uploadedImages.push(result.secure_url);
      }
    }

    // ✅ Handle optional fields
    const tagsInput = formData.get("tags") as string;
    const tags = tagsInput ? tagsInput.split(",").map(t => t.trim()).filter(Boolean) : [];

    const sizes = formData.getAll("sizes") as string[];
    const colors = formData.getAll("colors") as string[];

    const affiliates = {
      amazon: formData.get("affiliates[amazon]") as string || undefined,
      flipkart: formData.get("affiliates[flipkart]") as string || undefined,
      myntra: formData.get("affiliates[myntra]") as string || undefined,
    };

    // ✅ Update fields
    product.name = formData.get("name") as string;
    product.description = formData.get("description") as string;
    product.price = Number(formData.get("price"));
    product.category = formData.get("category") as string;
    product.brand = (formData.get("brand") as string) || product.brand;
    product.stock = Number(formData.get("stock")) || 0;
    product.sku = (formData.get("sku") as string) || product.sku;
    product.tags = tags;
    product.sizes = sizes.length > 0 ? sizes : [];
    product.colors = colors.length > 0 ? colors : [];
    product.rating = Number(formData.get("rating")) || 0;
    product.reviews = Number(formData.get("reviews")) || 0;
    product.affiliates = Object.values(affiliates).some(val => val) ? affiliates : undefined;
    product.images = uploadedImages;

    await product.save();

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (err: any) {
    console.error("Error updating product:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to update product" }, { status: 500 });
  }
}
