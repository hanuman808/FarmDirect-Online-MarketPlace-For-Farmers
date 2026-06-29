import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import Negotiation from "@/models/Negotiation";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
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
      return NextResponse.json({ message: "Invalid token", success: false }, { status: 403 });
    }

    const body = await req.json();
    const { productId, quantity, offeredPrice } = body;

    if (!productId || !quantity || !offeredPrice) {
      return NextResponse.json({ message: "Missing required fields", success: false }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ message: "Product not found", success: false }, { status: 404 });
    }

    // Check if buyer is trying to negotiate on their own product
    if (product.ownerId.toString() === decoded.id) {
      return NextResponse.json({ message: "You cannot negotiate on your own product", success: false }, { status: 400 });
    }

    // Check if there is an active negotiation already
    const existing = await Negotiation.findOne({
      buyerId: decoded.id,
      productId: productId,
      status: { $in: ["pending", "countered", "accepted"] }
    });

    if (existing) {
      return NextResponse.json({ message: "You already have an active offer for this product", success: false }, { status: 400 });
    }

    const negotiation = await Negotiation.create({
      buyerId: decoded.id,
      farmerId: product.ownerId,
      productId,
      quantity,
      originalPrice: product.price,
      offeredPrice,
      status: "pending",
    });

    return NextResponse.json({
      message: "Offer submitted successfully",
      success: true,
      negotiation
    });

  } catch (error: any) {
    console.error("Create negotiation error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error", success: false }, { status: 500 });
  }
}

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
      return NextResponse.json({ message: "Invalid token", success: false }, { status: 403 });
    }

    let query = {};
    if (decoded.role === "farmer") {
      query = { farmerId: decoded.id };
    } else if (decoded.role === "user") {
      query = { buyerId: decoded.id };
    } else {
      // Admins can see all negotiations
      query = {};
    }

    const negotiations = await Negotiation.find(query)
      .populate("buyerId", "name email contact")
      .populate("farmerId", "name email contact")
      .populate("productId", "name imageUrl price unit stock")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      negotiations
    });

  } catch (error: any) {
    console.error("Fetch negotiations error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error", success: false }, { status: 500 });
  }
}
