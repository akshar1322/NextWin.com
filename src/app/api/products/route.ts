  import { NextResponse } from "next/server";
  import Product from "@/models/Product";
  import connectDB from "@/lib/dbConnect";
  import cloudinary from "@/lib/cloudinary";

  export const runtime = "nodejs";

  export async function POST(req: Request) {
    try {
      await connectDB();

      const formData = await req.formData();
      const images = formData.getAll("images") as File[];

      if (!images || images.length === 0) {
        return NextResponse.json({ success: false, error: "At least one product image is required" }, { status: 400 });
      }

      // ✅ Upload images to Cloudinary
      const uploadedImages: string[] = [];
      for (const image of images) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const base64 = buffer.toString("base64");
        const result = await cloudinary.uploader.upload(`data:${image.type};base64,${base64}`, {
          folder: "products",
        });
        uploadedImages.push(result.secure_url);
      }

      // ✅ Process tags (comma-separated string to array)
      const tagsInput = formData.get("tags") as string;
      const tags = tagsInput ? tagsInput.split(",").map(tag => tag.trim()).filter(tag => tag) : [];

      // ✅ Process sizes and colors (multiple select)
      const sizes = formData.getAll("sizes") as string[];
      const colors = formData.getAll("colors") as string[];

      // ✅ Process affiliate links
      const affiliates = {
        amazon: formData.get("affiliates[amazon]") as string || undefined,
        flipkart: formData.get("affiliates[flipkart]") as string || undefined,
        myntra: formData.get("affiliates[myntra]") as string || undefined,
      };

      // ✅ Create product document according to model
      const product = await Product.create({
        name: formData.get("name"),
        description: formData.get("description"),
        price: Number(formData.get("price")),
        category: formData.get("category"),
        brand: formData.get("brand") || undefined,
        stock: Number(formData.get("stock")) || 0,
        sku: formData.get("sku") || undefined,
        tags: tags,
        sizes: sizes.length > 0 ? sizes : undefined,
        colors: colors.length > 0 ? colors : undefined,
        rating: Number(formData.get("rating")) || 0,
        reviews: Number(formData.get("reviews")) || 0,
        affiliates: Object.values(affiliates).some(val => val) ? affiliates : undefined,
        images: uploadedImages,
      });

      return NextResponse.json({ success: true, product }, { status: 201 });
    } catch (err: any) {
      console.error("Error creating product:", err);

      // Handle duplicate SKU error
      if (err.code === 11000 && err.keyPattern?.sku) {
        return NextResponse.json(
          { success: false, error: "SKU already exists" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: false, error: err.message || "Failed to create product" },
        { status: 500 }
      );
    }
  }

  export async function GET(req: Request) {
    try {
      await connectDB();

      // ✅ Handle query parameters for filtering
      const { searchParams } = new URL(req.url);
      const category = searchParams.get('category');
      const search = searchParams.get('search');
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const skip = (page - 1) * limit;

      // ✅ Build filter object
      const filter: any = {};

      if (category) {
        filter.category = category;
      }

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }

      // ✅ Get products with filters
      const products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      // ✅ Get total count for pagination
      const total = await Product.countDocuments(filter);
      const totalPages = Math.ceil(total / limit);

      return NextResponse.json({
        success: true,
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }, { status: 200 });
    } catch (err: any) {
      console.error("Error fetching products:", err);
      return NextResponse.json(
        { success: false, error: "Failed to fetch products" },
        { status: 500 }
      );
    }
  }
