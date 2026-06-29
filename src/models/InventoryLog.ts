import mongoose, { Schema } from "mongoose";

const InventoryLogSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        farmerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: [
                "STOCK_ADDED",
                "STOCK_REDUCED",
                "STOCK_RESTORED",
                "ORDER_PLACED",
                "ORDER_CANCELLED",
            ],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        previousStock: {
            type: Number,
            required: true,
        },
        newStock: {
            type: Number,
            required: true,
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
        },
        reason: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// Index for faster queries
InventoryLogSchema.index({ farmerId: 1, createdAt: -1 });
InventoryLogSchema.index({ productId: 1, createdAt: -1 });

const InventoryLog =
    mongoose.models.InventoryLog ||
    mongoose.model("InventoryLog", InventoryLogSchema);

export default InventoryLog;
