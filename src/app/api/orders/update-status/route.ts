import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

dbConfig();

export async function POST(req: NextRequest) {
    try {
        const { orderId, deliveryStatus } = await req.json();
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        if (decoded.role !== "farmer") {
            return NextResponse.json({ message: "Only Farmers can update order status", success: false }, { status: 403 });
        }

        if (!orderId || !deliveryStatus) {
            return NextResponse.json({ message: "Missing order ID or status", success: false }, { status: 400 });
        }

        const order = await Order.findOneAndUpdate(
            { _id: orderId, farmerId: decoded.id },
            { deliveryStatus },
            { new: true }
        );

        if (!order) {
            return NextResponse.json({ message: "Order not found or not belongs to you", success: false }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `Order status updated to ${deliveryStatus}`,
            order,
        });

    } catch (error) {
        console.error("Update Order Status Error:", error);
        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}
