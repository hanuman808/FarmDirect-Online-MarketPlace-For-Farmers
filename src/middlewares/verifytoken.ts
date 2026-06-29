import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConfig from "@/middlewares/db.config";

export async function verifyToken(token: string) {
  try {
    await dbConfig();
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded || !decoded.id) {
      return null;
    }
    
    // Check fallback admin credentials
    if (decoded.id === "admin" && decoded.role === "admin") {
      return {
        _id: "admin",
        id: "admin",
        role: "admin",
        email: decoded.email,
        name: "Admin",
        isApproved: true,
        isEmailVerified: true
      };
    }
    
    const user = await User.findById(decoded.id);
    return user;
  } catch (error) {
    console.error("verifyToken error:", error);
    return null;
  }
}
