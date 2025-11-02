import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import AdminUser from "@/models/AdminUser";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Please enter username and password." },
        { status: 400 }
      );
    }

    // Find admin by username or email
    const admin = await AdminUser.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 401 }
      );
    }

    if (!admin.isActive) {
      return NextResponse.json(
        { success: false, message: "Your account is deactivated." },
        { status: 403 }
      );
    }

    // ✅ Check if account is locked
    if (typeof admin.isLocked === "function" && admin.isLocked()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Account locked due to multiple failed attempts. Try again later.",
        },
        { status: 403 }
      );
    }

    // ✅ Verify password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      await admin.incrementLoginAttempts();
      return NextResponse.json(
        { success: false, message: "Invalid password." },
        { status: 401 }
      );
    }

    // ✅ Reset login attempts and update login info
    admin.loginAttempts = 0;
    admin.lockUntil = undefined;
    admin.lastLogin = new Date();
    await admin.save();

    // ✅ Generate JWT
    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    // ✅ Return response
    return NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
