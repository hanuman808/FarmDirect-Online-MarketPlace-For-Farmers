import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: "rzp_test_cXJvckaWoN0JQx",
  key_secret: "NuVVc8bnNeu4YA2bZ7Eymf39",
});

export async function POST(req: NextRequest) {
  const serachParams = req.nextUrl.searchParams;
  const orderId = serachParams.get("orderId");
  if (!orderId) {
    return NextResponse.json(
      { message: "Order ID is required" },
      { status: 400 }
    );
  }
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    if (order.paymentStatus === "Paid") {
      return NextResponse.json(
        { message: "Order already paid" },
        { status: 400 }
      );
    }
    const amount = order.totalPrice * 100;
    const currency = "INR";
    const options = {
      amount: amount,
      currency: currency,
      receipt: "rcp1",
    };
    const response = await razorpay.orders.create(options);
    if (!response) {
      return NextResponse.json(
        { message: "Failed to create order" },
        { status: 500 }
      );
    }
    order.paymentStatus = "completed";
    await order.save();
    return NextResponse.json(
      {
        orderId: response.id,
        currency: response.currency,
        amount: response.amount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
