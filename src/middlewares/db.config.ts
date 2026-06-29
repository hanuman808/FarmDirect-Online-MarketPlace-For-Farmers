import mongoose from "mongoose";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import InventoryLog from "@/models/InventoryLog";
import Negotiation from "@/models/Negotiation";

// Database Connection
const dbConfig = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("Connected to MongoDB (Compass)");
    });

    // Initialize models to ensure they are registered with mongoose
    User;
    Product;
    Order;
    InventoryLog;
    Negotiation;

    connection.on("error", (error) => {
      console.log("MongoDB Connection Error: ", error);
    });
  } catch (error) {
    console.log("Error connecting to Database: ", error);
  }
};

export default dbConfig;
