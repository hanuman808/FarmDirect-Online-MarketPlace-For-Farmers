import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import Review from "@/models/Review";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";

dbConfig();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ message: "Product ID is required", success: false }, { status: 400 });
    }

    const reviews = await Review.find({ productId })
      .populate("userId", "name profileImage")
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    return NextResponse.json({
      success: true,
      reviews,
      avgRating,
    });
  } catch (error) {
    console.error("Fetch Reviews Error:", error);
    return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const { productId, rating, comment, sellerFeedback } = await req.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json({ message: "Missing required fields", success: false }, { status: 400 });
    }

    const review = await Review.create({
      userId: decoded.id,
      productId,
      rating: Number(rating),
      comment,
      sellerFeedback: sellerFeedback || "",
    });

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Create Review Error:", error);
    return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
  }
}
