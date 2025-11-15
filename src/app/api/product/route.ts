import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const products = category
      ? await Product.find({ category })
      : await Product.find();

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    // --- Parse form data ---
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const stock = parseInt(formData.get("stock") as string);
    const files = formData.getAll("images") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    // --- Upload images to Cloudinary ---
    const uploadedImages = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const upload = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "nextwin/products" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(buffer);
      });
      uploadedImages.push((upload as any).secure_url);
    }

    // --- Create product in MongoDB ---
    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images: uploadedImages,
    });

    return NextResponse.json({ message: "Product created", product: newProduct });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
