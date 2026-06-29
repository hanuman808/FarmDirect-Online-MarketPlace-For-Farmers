import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/middlewares/db.config";
import InventoryLog from "@/models/InventoryLog";
import { verifyToken } from "@/middlewares/verifytoken";

// GET - Fetch inventory logs for a farmer
export async function GET(req: NextRequest) {
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
        if (!user || user.role !== "farmer") {
            return NextResponse.json(
                { message: "Access denied", success: false },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");
        const type = searchParams.get("type");
        const limit = parseInt(searchParams.get("limit") || "50");

        let query: any = { farmerId: user._id };

        if (productId) {
            query.productId = productId;
        }

        if (type) {
            query.type = type;
        }

        const logs = await InventoryLog.find(query)
            .populate("productId", "name imageUrl")
            .populate("orderId", "_id")
            .sort({ createdAt: -1 })
            .limit(limit);

        return NextResponse.json({
            success: true,
            logs,
        });
    } catch (error) {
        console.error("Fetch Inventory Logs Error:", error);
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}

// POST - Create inventory log (internal use)
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { productId, farmerId, type, quantity, previousStock, newStock, orderId, reason } = body;

        if (!productId || !farmerId || !type || quantity === undefined || previousStock === undefined || newStock === undefined || !reason) {
            return NextResponse.json(
                { message: "Missing required fields", success: false },
                { status: 400 }
            );
        }

        const log = await InventoryLog.create({
            productId,
            farmerId,
            type,
            quantity,
            previousStock,
            newStock,
            orderId,
            reason,
        });

        return NextResponse.json({
            success: true,
            log,
        });
    } catch (error) {
        console.error("Create Inventory Log Error:", error);
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}
