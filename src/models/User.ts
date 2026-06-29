import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: false,
    default: "",
  },
  address: {
    address: {
      type: String,
      required: false,
    },
    district: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    pincode: {
      type: String,
      required: false,
    },
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "farmer", "user", "delivery"],
    default: "user",
  },
  isApproved: {
    type: Boolean,
    default: function() {
      // Users are approved by default, Farmers and Delivery Partners need admin approval
      return (this as any).role === "user"; 
    },
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  vehicleType: {
    type: String,
    enum: ["bike", "scooter", "truck", "van", "other"],
    expires: 0 // Optional
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  currentLocation: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
