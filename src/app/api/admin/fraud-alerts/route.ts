import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import FraudAlert from "@/models/FraudAlert";
import jwt from "jsonwebtoken";

dbConfig();

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized: Requires Admin Role", success: false }, { status: 403 });
    }

    const alerts = await FraudAlert.find({})
      .populate("userId", "name email contact role")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      alerts,
    });
  } catch (error) {
    console.error("Fetch Fraud Alerts Error:", error);
    return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized: Requires Admin Role", success: false }, { status: 403 });
    }

    const { alertId, status } = await req.json();

    const updatedAlert = await FraudAlert.findByIdAndUpdate(
      alertId,
      { $set: { status } },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      alert: updatedAlert,
    });
  } catch (error) {
    console.error("Update Fraud Alert Error:", error);
    return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
  }
}
