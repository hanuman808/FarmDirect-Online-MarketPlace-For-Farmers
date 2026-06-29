import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import Notification from "@/models/Notification";
import jwt from "jsonwebtoken";

dbConfig();

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const notifications = await Notification.find({ userId: decoded.id })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Fetch Notifications Error:", error);
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
    const { notificationId } = await req.json();

    const updated = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: decoded.id },
      { $set: { isRead: true } },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      notification: updated,
    });
  } catch (error) {
    console.error("Update Notification Error:", error);
    return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
  }
}
