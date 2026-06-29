import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
    try {
        await dbConfig();
        const { searchParams } = new URL(req.url);
        const ownerId = searchParams.get("ownerId");

        let query = {};
        if (ownerId && ownerId !== "undefined") {
            // Check if ownerId is a valid MongoDB ObjectId
            if (ownerId.match(/^[0-9a-fA-F]{24}$/)) {
                query = { ownerId };
            } else {
                return NextResponse.json(
                    { message: "Invalid Owner ID format", success: false },
                    { status: 400 }
                );
            }
        }

        const products = await Product.find(query).populate("ownerId", "name email");

        return NextResponse.json({
            success: true,
            products,
        });
    } catch (error) {
        console.error("Fetch Products Error:", error);
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConfig();
        const { productData } = await req.json();
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized", success: false },
                { status: 401 }
            );
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!);
        } catch (err) {
            return NextResponse.json({ message: "Invalid or expired token", success: false }, { status: 403 });
        }

        const { name, price, stock, description, category, imageUrl } = productData;

        if (!name || !price || !stock || !description || !category || !imageUrl) {
            return NextResponse.json(
                { message: "All fields are required (Name, Price, Stock, Description, Category, Image)", success: false },
                { status: 400 }
            );
        }

        const newProduct = new Product({
            ...productData,
            ownerId: decoded.id,
        });

        await newProduct.save();

        return NextResponse.json({
            success: true,
            message: "Product added successfully",
            product: newProduct,
        });

    } catch (error) {
        console.error("Add Product Error:", error);
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}
