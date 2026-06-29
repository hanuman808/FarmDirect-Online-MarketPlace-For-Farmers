import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
    try {
        await dbConfig();

        // Auto-fix any existing delivered orders that are still marked as payment pending
        await Order.updateMany(
            { deliveryStatus: "delivered", paymentStatus: "pending" },
            { $set: { paymentStatus: "completed" } }
        );

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
        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role") || decoded.role;

        let query = {};
        if (role === "farmer") {
            query = { farmerId: decoded.id };
        } else if (role === "user") {
            query = { userId: decoded.id };
        }
        // For admin, query remains empty to fetch all orders

        const orders = await Order.find(query)
            .populate("userId", "name email contact address")
            .populate("farmerId", "name email")
            .populate("deliveryPartner", "name email contact vehicleType")
            .populate("products.product")
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Fetch Orders Error:", error);
        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConfig();
        const { cart } = await req.json();
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        if (!cart || cart.length === 0) {
            return NextResponse.json({ message: "Cart is empty", success: false }, { status: 400 });
        }

        // group products by farmer (for simplicity, we assume one farmer per cart from the UI, but let's handle the first one)
        const firstProduct = cart[0].productId;
        const farmerId = firstProduct.ownerId; // We need to ensure ownerId is populated or provided

        let totalPrice = 0;
        const orderProducts = cart.map((item: any) => {
            totalPrice += item.productId.price * item.quantity;
            return {
                product: item.productId._id,
                quantity: item.quantity,
            };
        });

        const newOrder = new Order({
            userId: decoded.id,
            farmerId: farmerId,
            products: orderProducts,
            totalPrice,
        });

        await newOrder.save();

        // Update stock (optional but good)
        for (const item of cart) {
            await Product.findByIdAndUpdate(item.productId._id, {
                $inc: { stock: -item.quantity },
            });
        }

        return NextResponse.json({
            success: true,
            message: "Order placed successfully",
            order: newOrder,
        });

    } catch (error) {
        console.error("Place Order Error:", error);
        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}
// 3. Update Order Status (for Farmer or Admin)
export async function PATCH(req: NextRequest) {
    try {
        await dbConfig();
        const { orderId, deliveryStatus } = await req.json();
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        if (!orderId || !deliveryStatus) {
            return NextResponse.json({ message: "Order ID and Status are required", success: false }, { status: 400 });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json({ message: "Order not found", success: false }, { status: 404 });
        }

        // Authorization: Only Farmer associated with order or Admin can update status
        if (decoded.role === "farmer" && order.farmerId.toString() !== decoded.id) {
            return NextResponse.json({ message: "Forbidden: Not your order", success: false }, { status: 403 });
        }
        
        if (decoded.role !== "admin" && decoded.role !== "farmer") {
            return NextResponse.json({ message: "Forbidden: Unauthorized role", success: false }, { status: 403 });
        }

        order.deliveryStatus = deliveryStatus;
        await order.save({ validateBeforeSave: false });

        return NextResponse.json({
            success: true,
            message: "Order status updated successfully",
            order,
        });

    } catch (error) {
        console.error("Update Order Error:", error);
        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}
