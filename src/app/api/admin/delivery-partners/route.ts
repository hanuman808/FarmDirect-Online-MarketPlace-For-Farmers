import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import User from "@/models/User";
import jwt from "jsonwebtoken";

dbConfig();

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized: Requires Admin Role", success: false }, { status: 403 });
    }

    // Fetch all confirmed delivery partners from consolidated User model
    const partners = await User.find({ role: "delivery", isApproved: true }, { password: 0 });

    return NextResponse.json({
        success: true,
        partners,
    });

  } catch (error) {
    console.error("Fetch Delivery Partners Error:", error);
    return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
  }
}
