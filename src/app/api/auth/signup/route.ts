import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConfig from "@/middlewares/db.config";
import User from "@/models/User";

dbConfig();

export async function POST(req: NextRequest) {
  try {
    const { formData } = await req.json();

    if (!formData.email || !formData.password || !formData.name || !formData.role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (formData.password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: formData.email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(formData.password, 10);

    // Clean up data based on role to avoid validation errors
    const userData = { ...formData, password: hashedPassword };
    
    if (userData.role !== "delivery") {
      delete userData.vehicleType;
    } else {
      delete userData.address;
    }

    const newUser = new User(userData);
    await newUser.save();

    const successMessage = (formData.role === "farmer" || formData.role === "delivery")
      ? "Registration successful. Please wait for Admin approval."
      : "User created successfully";

    return NextResponse.json(
      { message: successMessage },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
