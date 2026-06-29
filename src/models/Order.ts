import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    farmerId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Farmer is a User with role 'farmer'
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    deliveryStatus: {
      type: String,
      enum: ["pending", "assigned", "ready_for_pickup", "picked", "in_transit", "delivered", "cancelled"],
      default: "pending",
    },
    refundStatus: {
      type: String,
      enum: ["none", "requested", "processed", "rejected"],
      default: "none",
    },
    deliveryPartner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    trackingLocation: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    deliveryAddress: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      enum: ["online", "cod"],
      default: "online",
    },
    razorpayOrderId: {
      type: String,
      default: null,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

OrderSchema.pre("save", function (next) {
  if (this.deliveryStatus === "delivered") {
    this.paymentStatus = "completed";
  }
  next();
});

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Order;
}

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;
