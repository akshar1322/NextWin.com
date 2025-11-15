import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Order from "@/models/Order"; // ✅ use your model, not inline schema

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Validate
    if (!body.productId || !body.email || !body.addressLine1) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Create new order entry
    const order = await Order.create({
      userId: body.userId || null, // Optional if not logged in
      items: [
        {
          productId: body.productId,
          name: body.productName,
          quantity: body.quantity || 1,
          price: body.price,
        },
      ],
      total: body.price * (body.quantity || 1),
      paymentStatus: "pending",
      paymentMethod: "cod", // Or dynamic later
      orderStatus: "pending",
      shippingAddress: {
        street: `${body.addressLine1}${body.addressLine2 ? ", " + body.addressLine2 : ""}`,
        city: body.city,
        state: body.country || "",
        pincode: body.postcode,
      },
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (err: any) {
    console.error("Error creating order:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Optional: Admin GET route
export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).populate("items.productId");
    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
