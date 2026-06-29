import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import User from "@/models/User";

dbConfig();

export async function POST(req: NextRequest) {
    try {
        const { farmerId, isApproved } = await req.json();

        if (!farmerId) {
            return NextResponse.json(
                { message: "Farmer ID is required", success: false },
                { status: 400 }
            );
        }

        const updateFields: any = { isApproved: isApproved };
        if (isApproved) {
            updateFields.isEmailVerified = true;
        }

        const user = await User.findByIdAndUpdate(
            farmerId,
            { $set: updateFields },
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { message: "Farmer not found", success: false },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: isApproved ? "Farmer approved successfully" : "Farmer status updated",
            user,
        });
    } catch (error) {
        console.error("Approve Farmer Error:", error);
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}
