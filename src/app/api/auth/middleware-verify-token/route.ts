import dbConfig from "@/middlewares/db.config";
import { User as UserType } from "@/types/Users";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token) {
    return NextResponse.json({ error: "No token found" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!) as UserType;
    if (!data) {
      return NextResponse.json({ error: "Invalid token" });
    }
    return NextResponse.json({ data, status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 401 });
  }
}
