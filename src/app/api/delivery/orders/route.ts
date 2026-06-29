import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

dbConfig();

// 1. Fetch Assigned Orders for Delivery Partner
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== "delivery") {
        return NextResponse.json({ message: "Unauthorized: Requires Delivery Role", success: false }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status");

    let query: any = { deliveryPartner: decoded.id };
    if (statusParam === "completed") {
        query.deliveryStatus = "delivered";
    } else {
        query.deliveryStatus = { $nin: ["delivered", "cancelled"] };
    }

    // Fetch orders based on status query
    const orders = await Order.find(query)
    .populate("userId", "name email contact address")
    .populate("farmerId", "name contact address")
    .populate("products.product", "name imageUrl price");

    return NextResponse.json({
        success: true,
        orders,
    });

  } catch (error) {
    console.error("Fetch Delivery Orders Error:", error);
    return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
  }
}

// 2. Update Order Status or Live Location
export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== "delivery") {
        return NextResponse.json({ message: "Unauthorized: Requires Delivery Role", success: false }, { status: 403 });
    }

    const { orderId, deliveryStatus, trackingLocation } = await req.json();

    if (!orderId) {
        return NextResponse.json({ message: "Order ID is required", success: false }, { status: 400 });
    }

    const updateFields: any = {};
    if (deliveryStatus) updateFields.deliveryStatus = deliveryStatus;
    if (trackingLocation) updateFields.trackingLocation = trackingLocation;

    const order = await Order.findOne({ _id: orderId, deliveryPartner: decoded.id });

    if (!order) {
        return NextResponse.json({ message: "Order not found or not assigned to you", success: false }, { status: 404 });
    }

    if (deliveryStatus) {
        order.deliveryStatus = deliveryStatus;
        // If order is successfully delivered and payment was Cash on Delivery (COD),
        // mark the payment status as completed automatically.
        if (deliveryStatus === "delivered" && order.paymentMethod === "cod") {
            order.paymentStatus = "completed";
        }
    }
    if (trackingLocation) {
        order.trackingLocation = trackingLocation;
    }

    await order.save({ validateBeforeSave: false });

    return NextResponse.json({
        success: true,
        message: "Order updated successfully",
        order
    });

  } catch (error) {
    console.error("Update Delivery Status Error:", error);
    return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
  }
}
