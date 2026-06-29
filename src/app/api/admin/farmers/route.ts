import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import User from "@/models/User";

dbConfig();

export async function GET(req: NextRequest) {
    try {
        // Check if requester is admin (optional, can be added with middleware)

        const users = await User.find({ 
            role: { $in: ["farmer", "delivery"] },
            isApproved: false 
        }).select("-password");

        return NextResponse.json({
            success: true,
            users,
        });
    } catch (error) {
        console.error("Fetch Farmers Error:", error);
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}
