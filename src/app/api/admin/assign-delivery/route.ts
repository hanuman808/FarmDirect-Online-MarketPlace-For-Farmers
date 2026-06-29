import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

dbConfig();

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized: Requires Admin Role", success: false }, { status: 403 });
    }

    const { orderId, partnerId } = await req.json();

    if (!orderId || !partnerId) {
        return NextResponse.json({ message: "Order ID and Partner ID are required", success: false }, { status: 400 });
    }

    // Assign the partner and set status to "assigned"
    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { 
            $set: { 
                deliveryPartner: partnerId,
                deliveryStatus: "assigned"
            } 
        },
        { new: true }
    );

    if (!updatedOrder) {
        return NextResponse.json({ message: "Order not found", success: false }, { status: 404 });
    }

    return NextResponse.json({
        success: true,
        message: "Delivery partner assigned successfully",
        order: updatedOrder
    });

  } catch (error) {
    console.error("Assign Delivery Partner Error:", error);
    return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
  }
}
