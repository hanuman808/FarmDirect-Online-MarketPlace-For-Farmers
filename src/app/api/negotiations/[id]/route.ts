import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import Negotiation from "@/models/Negotiation";
import jwt from "jsonwebtoken";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await req.json();
    const { status, counterPrice } = body;

    if (!status) {
      return NextResponse.json({ message: "Status is required", success: false }, { status: 400 });
    }

    const negotiation = await Negotiation.findById(id);
    if (!negotiation) {
      return NextResponse.json({ message: "Negotiation not found", success: false }, { status: 404 });
    }

    // Role-based validations
    if (decoded.role === "farmer") {
      // Farmer updates incoming negotiation
      if (negotiation.farmerId.toString() !== decoded.id) {
        return NextResponse.json({ message: "You are not authorized to update this negotiation", success: false }, { status: 403 });
      }

      if (status === "countered") {
        if (!counterPrice || counterPrice <= 0) {
          return NextResponse.json({ message: "Valid counter price is required", success: false }, { status: 400 });
        }
        negotiation.status = "countered";
        negotiation.counterPrice = counterPrice;
      } else if (status === "accepted") {
        negotiation.status = "accepted";
      } else if (status === "declined") {
        negotiation.status = "declined";
      } else {
        return NextResponse.json({ message: "Invalid status update for farmer", success: false }, { status: 400 });
      }
    } else if (decoded.role === "user") {
      // Buyer updates counter offer or cancels negotiation
      if (negotiation.buyerId.toString() !== decoded.id) {
        return NextResponse.json({ message: "You are not authorized to update this negotiation", success: false }, { status: 403 });
      }

      if (status === "accepted") {
        // Buyer accepts farmer's counter offer
        if (negotiation.status !== "countered") {
          return NextResponse.json({ message: "No active counter offer to accept", success: false }, { status: 400 });
        }
        negotiation.status = "accepted";
      } else if (status === "declined") {
        negotiation.status = "declined";
      } else {
        return NextResponse.json({ message: "Invalid status update for buyer", success: false }, { status: 400 });
      }
    } else {
      return NextResponse.json({ message: "Unauthorized role", success: false }, { status: 403 });
    }

    await negotiation.save();

    return NextResponse.json({
      message: `Offer updated to ${status} successfully`,
      success: true,
      negotiation
    });

  } catch (error: any) {
    console.error("Update negotiation error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error", success: false }, { status: 500 });
  }
}
