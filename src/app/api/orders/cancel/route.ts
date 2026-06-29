import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/middlewares/db.config";
import Order from "@/models/Order";
import Product from "@/models/Product";
import InventoryLog from "@/models/InventoryLog";
import { verifyToken } from "@/middlewares/verifytoken";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized", success: false },
                { status: 401 }
            );
        }

        const user = await verifyToken(token);
        if (!user) {
            return NextResponse.json(
                { message: "Invalid token", success: false },
                { status: 401 }
            );
        }

        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json(
                { message: "Order ID is required", success: false },
                { status: 400 }
            );
        }

        // Find the order
        const order = await Order.findById(orderId).populate("products.product");

        if (!order) {
            return NextResponse.json(
                { message: "Order not found", success: false },
                { status: 404 }
            );
        }

        // Check if user owns this order
        if (order.userId.toString() !== user._id.toString()) {
            return NextResponse.json(
                { message: "Unauthorized to cancel this order", success: false },
                { status: 403 }
            );
        }

        // Check if order can be cancelled
        if (order.deliveryStatus === "delivered" || order.deliveryStatus === "shipped") {
            return NextResponse.json(
                { message: "Cannot cancel order that is already shipped or delivered", success: false },
                { status: 400 }
            );
        }

        if (order.deliveryStatus === "cancelled") {
            return NextResponse.json(
                { message: "Order is already cancelled", success: false },
                { status: 400 }
            );
        }

        // Start MongoDB transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Restore stock for each product
            for (const item of order.products) {
                const product = await Product.findById(item.product._id).session(session);

                if (!product) {
                    throw new Error(`Product ${item.product._id} not found`);
                }

                const previousStock = product.stock;
                const newStock = previousStock + item.quantity;

                // Atomically restore stock
                await Product.findByIdAndUpdate(
                    item.product._id,
                    {
                        $inc: { stock: item.quantity },
                    },
                    { session }
                );

                // Create inventory log
                await InventoryLog.create(
                    [
                        {
                            productId: item.product._id,
                            farmerId: order.farmerId,
                            type: "ORDER_CANCELLED",
                            quantity: item.quantity,
                            previousStock: previousStock,
                            newStock: newStock,
                            orderId: order._id,
                            reason: `Order cancelled by customer. Order ID: ${order._id}`,
                        },
                    ],
                    { session }
                );
            }

            // Update order status
            order.deliveryStatus = "cancelled";
            order.paymentStatus = "failed";
            await order.save({ session });

            // Commit transaction
            await session.commitTransaction();

            return NextResponse.json({
                success: true,
                message: "Order cancelled successfully and stock restored",
                order,
            });
        } catch (error: any) {
            // Rollback transaction
            await session.abortTransaction();
            console.error("Cancellation Transaction Error:", error);

            return NextResponse.json(
                {
                    message: error.message || "Failed to cancel order",
                    success: false,
                },
                { status: 500 }
            );
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error("Order Cancellation Error:", error);
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}
