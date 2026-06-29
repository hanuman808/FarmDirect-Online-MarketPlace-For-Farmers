import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { message: "Order Id is required" },
      { status: 500 }
    );
  }
  try {
    const order = await Order.findById(id)
      .populate("userId")
      .populate("supplierId")
      .populate("manufacturerId")
      .populate("transporterId");
    const centralKey = generateOrderKey(order);
    order.centralKey = centralKey;
    order.save();
    return NextResponse.json(centralKey, { status: 200 });
  } catch (error) {
    console.log("Oops! An error occurred", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
const generateOrderKey = (order: any) => {
  const orderString = JSON.stringify(order);
  return crypto.createHash("sha256").update(orderString).digest("hex");
};
