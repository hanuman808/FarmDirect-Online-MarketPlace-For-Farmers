"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthProvider";

interface ProductInfo {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface OrderProduct {
  product: ProductInfo;
  quantity: number;
}

interface OrderDetails {
  _id: string;
  totalPrice: number;
  paymentStatus: "pending" | "completed" | "failed";
  deliveryStatus: "pending" | "shipped" | "delivered" | "cancelled";
  products: OrderProduct[];
  createdAt: string;
}

const DetailsPage = () => {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const orderId = searchParams.get("id");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    try {
      if (!orderId) return;
      const res = await axios.get(`/api/orders?id=${orderId}`); // Assuming unified API supports single ID fetch or filter
      if (res.data.success) {
        // Find the specific order from the list or handle if API provides direct object
        const order = Array.isArray(res.data.orders)
          ? res.data.orders.find((o: any) => o._id === orderId)
          : res.data.order;
        setOrderDetails(order);
      }
    } catch (error) {
      console.error("Failed to fetch order details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  if (!user) return (
    <div className="flex items-center justify-center h-screen bg-base-100">
      <h1 className="text-2xl font-bold uppercase tracking-widest opacity-50">Please login to continue</h1>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-10 bg-base-100 min-h-screen">
      <h1 className="text-4xl font-black mb-10 text-center uppercase tracking-tighter text-primary">Order Summary</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : orderDetails ? (
        <div className="bg-base-200 rounded-3xl shadow-2xl p-8 border border-primary/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Status & Info */}
            <div className="space-y-6">
              <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-1">Order Identifier</p>
                <p className="text-lg font-bold font-mono">#{orderDetails._id.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-1">Status</p>
                <div className="flex gap-4">
                  <span className={`badge font-bold px-4 py-3 ${orderDetails.paymentStatus === "completed" ? "badge-success" : "badge-warning"
                    }`}>
                    Payment: {orderDetails.paymentStatus}
                  </span>
                  <span className={`badge font-bold px-4 py-3 ${orderDetails.deliveryStatus === "delivered" ? "badge-success" : "badge-info"
                    }`}>
                    Delivery: {orderDetails.deliveryStatus}
                  </span>
                </div>
              </div>
              <div className="divider opacity-10"></div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-1">Order Date</p>
                <p className="text-lg font-bold">{new Date(orderDetails.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-1">Total Amount</p>
                <p className="text-4xl font-black text-secondary">₹{orderDetails.totalPrice}</p>
              </div>
            </div>

            {/* Product List */}
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-widest opacity-50 border-b border-base-content/10 pb-2">Purchased Items</p>
              {orderDetails.products.map((item) => (
                <div key={item.product._id} className="flex items-center gap-4 bg-base-300/50 p-4 rounded-2xl hover:bg-base-300 transition-colors">
                  <img
                    src={item.product.imageUrl || "/placeholder.jpg"}
                    alt={item.product.name}
                    className="w-16 h-16 object-contain bg-white rounded-xl p-2"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-lg">{item.product.name}</p>
                    <p className="text-sm opacity-50 font-bold tracking-wider">₹{item.product.price} x {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-primary">₹{item.product.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <button className="btn btn-primary px-10 rounded-full font-black uppercase tracking-widest" onClick={() => window.print()}>
              Print Invoice
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-base-200 rounded-3xl">
          <p className="text-2xl font-bold opacity-30 uppercase tracking-widest">Order not discovered</p>
        </div>
      )}
    </div>
  );
};

export default DetailsPage;
