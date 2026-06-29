import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
    try {
        await dbConfig();
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!);
        } catch (err) {
            return NextResponse.json({ message: "Invalid or expired token", success: false }, { status: 403 });
        }

        // Only admin can access this
        if (decoded.role !== "admin") {
            return NextResponse.json({ message: "Forbidden - Admin only", success: false }, { status: 403 });
        }

        // Fetch all users
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            users,
        });
    } catch (error: any) {
        console.error("Fetch Users FULL ERROR:", error);
        return NextResponse.json({ 
            message: "Internal server error", 
            success: false,
            error: error.message 
        }, { status: 500 });
    }
}
