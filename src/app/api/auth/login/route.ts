import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import FraudAlert from "@/models/FraudAlert";

dbConfig();

const generateToken = (data: object) => {
  return jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: "1d" });
};

const setTokenCookie = (response: NextResponse, token: string) => {
  response.cookies.set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: "/",
  });
};

export async function POST(req: NextRequest) {
  try {
    const { formData } = await req.json();

    if (!formData.email || !formData.password || !formData.role) {
      return NextResponse.json(
        { message: "Please fill all the fields", success: false },
        { status: 400 }
      );
    }

    // 1. Check for Default Admin Login
    if (
      formData.email === process.env.ADMIN_EMAIL &&
      formData.password === process.env.ADMIN_PASSWORD
    ) {
      if (formData.role !== "admin") {
        return NextResponse.json(
          { message: "Invalid role selected for this account", success: false },
          { status: 403 }
        );
      }
      const data = {
        id: "admin",
        role: "admin",
        email: process.env.ADMIN_EMAIL,
        name: "Admin",
        isApproved: true,
      };
      const token = generateToken(data);
      const response = NextResponse.json({
        message: "Admin Login Success",
        success: true,
        route: `/admin/dashboard`,
        user: data,
      });
      setTokenCookie(response, token);
      return response;
    }

    // 2. Check Database for User/Farmer/Admin
    const user = await User.findOne({ email: formData.email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // Role-based validation
    if (user.role !== formData.role) {
      await FraudAlert.create({
        userId: user._id,
        type: "LOGIN_ANOMALY",
        description: `Failed login: Role mismatch. User requested role: ${formData.role}, but account role is: ${user.role}.`,
        severity: "high"
      });
      return NextResponse.json(
        { message: "Invalid role selected for this account", success: false },
        { status: 403 }
      );
    }

    // Verify Password
    const isMatch = await bcryptjs.compare(formData.password, user.password);
    if (!isMatch) {
      await FraudAlert.create({
        userId: user._id,
        type: "LOGIN_ANOMALY",
        description: `Failed login attempt for email: ${user.email} with role: ${formData.role}. Invalid password.`,
        severity: "medium"
      });
      return NextResponse.json(
        { message: "Invalid credentials", success: false },
        { status: 401 }
      );
    }

    // Check for Email Verification (Farmer & Delivery) - Approved accounts bypass this check
    if ((user.role === "farmer" || user.role === "delivery") && !user.isEmailVerified && !user.isApproved) {
      return NextResponse.json(
        {
          message: "Please verify your email address before logging in.",
          success: false,
          needsEmailVerification: true,
          email: user.email
        },
        { status: 403 }
      );
    }

    // 3. Check for Approval (Farmer & Delivery)
    if ((user.role === "farmer" || user.role === "delivery") && !user.isApproved) {
      return NextResponse.json(
        {
          message: "Your account is pending Admin approval. Please try again later.",
          success: false
        },
        { status: 403 }
      );
    }

    // 4. Successful Login
    const tokenData = {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
    };

    const token = generateToken(tokenData);

    // Determine route based on role
    let route = `/${user.role}/dashboard`;
    if (user.role === "admin") route = `/admin/dashboard`;
    if (user.role === "delivery") route = `/delivery/dashboard`;

    const response = NextResponse.json({
      message: "Login Success",
      success: true,
      route: route,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      },
    });

    setTokenCookie(response, token);
    return response;

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}
