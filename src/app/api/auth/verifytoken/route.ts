import dbConfig from "@/middlewares/db.config";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function GET(req: NextRequest) {
  try {
    await dbConfig();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    if (!data || !data.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Handle Admin fix
    if (data.id === "admin") {
      return NextResponse.json({
        user: {
          id: "admin",
          role: "admin",
          email: process.env.ADMIN_EMAIL,
          name: "Admin",
          isApproved: true
        },
        status: 200
      });
    }

    // Fetch user from database
    const user = await User.findById(data.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If farmer, double check approval status
    if (user.role === "farmer" && !user.isApproved) {
      return NextResponse.json({ error: "Account pending approval" }, { status: 403 });
    }

    return NextResponse.json({ user, status: 200 });

  } catch (err) {
    console.error("Token Verification Error:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
