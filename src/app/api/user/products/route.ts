import dbConfig from "@/middlewares/db.config";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";
dbConfig();
export async function GET(request: NextRequest) {
  const products = await Product.find().populate("manufacturerId");
  return NextResponse.json(products);
}
