import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import AdminUser from "@/models/AdminUser";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const {
      username,
      email,
      password,
      role = "admin",
      permissions = [],
      profile,
    } = await req.json();

    if (!username || !email || !password || !profile?.firstName || !profile?.lastName) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await AdminUser.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Admin with this username or email already exists" },
        { status: 409 }
      );
    }

    const newAdmin = new AdminUser({
      username,
      email,
      password,
      role,
      permissions,
      profile,
    });

    await newAdmin.save();

    return NextResponse.json(
      {
        success: true,
        message: "Admin created successfully",
        admin: {
          id: newAdmin._id,
          username: newAdmin.username,
          email: newAdmin.email,
          role: newAdmin.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Admin create error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
