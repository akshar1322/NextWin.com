import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";

// GET user's cart
export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const cart = await Cart.findOne({ userId }).populate("items.productId");
  return NextResponse.json(cart || { items: [], total: 0 });
}

// POST add to cart
export async function POST(req: Request) {
  await dbConnect();
  const { userId, productId, quantity, price } = await req.json();

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [], total: 0 });
  }

  const itemIndex = cart.items.findIndex(
    (item: any) => item.productId.toString() === productId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity, price });
  }

  cart.total = cart.items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  await cart.save();

  return NextResponse.json(cart);
}

// DELETE cart item
export async function DELETE(req: Request) {
  await dbConnect();
  const { userId, productId } = await req.json();

  const cart = await Cart.findOne({ userId });
  if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  cart.items = cart.items.filter(
    (item: any) => item.productId.toString() !== productId
  );

  cart.total = cart.items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  await cart.save();

  return NextResponse.json(cart);
}
