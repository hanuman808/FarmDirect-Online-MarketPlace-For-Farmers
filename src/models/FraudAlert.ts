import mongoose, { Schema } from "mongoose";

const FraudAlertSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  type: {
    type: String, // "DUPLICATE_ACCOUNT" | "LOGIN_ANOMALY" | "SUSPICIOUS_ORDER"
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  severity: {
    type: String, // "low" | "medium" | "high"
    default: "medium",
  },
  status: {
    type: String, // "active" | "resolved"
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FraudAlert = mongoose.models.FraudAlert || mongoose.model("FraudAlert", FraudAlertSchema);
export default FraudAlert;
