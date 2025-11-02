import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

// GET all orders for a user
export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const orders = await Order.find({ userId }).sort({ createdAt: -1 });
  return NextResponse.json(orders);
}

// POST place a new order
export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();
  const order = await Order.create(data);
  return NextResponse.json(order, { status: 201 });
}
