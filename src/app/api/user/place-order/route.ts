import dbConfig from "@/middlewares/db.config";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";

dbConfig();

export async function POST(req: NextRequest) {
  const { cart } = await req.json();
  console.log("Cart Data:", cart);

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    const userId = data.id;

    const orderId = "ORDER" + Math.floor(Math.random() * 1000000);

    // Assumes all products are from the same manufacturer/supplier
    const manufacturerId = cart[0].productId.manufacturerId._id;
    const supplierId = cart[0].productId.supplierId;

    // Optional safety check
    const uniqueManufacturers = new Set(
      cart.map((item: any) => item.productId.manufacturerId._id)
    );
    if (uniqueManufacturers.size > 1) {
      return NextResponse.json(
        { message: "Only one manufacturer per order allowed" },
        { status: 400 }
      );
    }

    const products = cart.map((item: any) => ({
      product: item.productId._id,
      quantity: item.quantity,
    }));

    const totalPrice = cart.reduce(
      (acc: number, item: any) => acc + item.productId.price * item.quantity,
      0
    );

    const newOrder = new Order({
      orderId,
      userId,
      manufacturerId,
      supplierId,
      products,
      totalPrice,
      paymentStatus: "pending",
      deliveryStatus: "pending",
    });

    await newOrder.save();

    return NextResponse.json(
      { message: "Order Placed Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Placing Order:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
