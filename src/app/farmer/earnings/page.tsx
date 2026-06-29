"use client";

import { useAuth } from "@/context/AuthProvider";
import { 
  IconCurrencyRupee, 
  IconCircleCheck, 
  IconClock, 
  IconReceipt2, 
  IconCreditCard, 
  IconCash, 
  IconArrowRight 
} from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

interface Transaction {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  totalPrice: number;
  paymentMethod: "online" | "cod";
  paymentStatus: "pending" | "completed" | "failed";
  deliveryStatus: string;
  createdAt: string;
}

const FarmerEarningsPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/orders?role=farmer");
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error("Fetch earnings error:", error);
      toast.error("Failed to load earnings dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEarningsData();
    }
  }, [user]);

  // Statistics
  const totalRevenue = orders
    .filter(o => o.paymentStatus === "completed" || o.paymentMethod === "cod")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const settledEarnings = orders
    .filter(o => o.paymentStatus === "completed" && o.deliveryStatus === "delivered")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const pendingSettlement = totalRevenue - settledEarnings;

  const codCollections = orders
    .filter(o => o.paymentMethod === "cod")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="loading loading-spinner loading-lg text-emerald-500"></div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Opening Ledger Books...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-10 space-y-12 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="bg-base-100 p-10 rounded-[2.5rem] border border-base-300 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <IconCurrencyRupee size={200} className="rotate-[-10deg] text-emerald-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Financial Ledger</p>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-base-content leading-none mb-4">Earnings Hub</h1>
          <p className="text-sm font-bold text-base-content/60 max-w-lg lowercase">Track your sales cash flows, payment settlements, and transaction histories.</p>
        </div>
        <div className="relative z-10">
           <Link href="/farmer/orders" className="btn btn-primary h-14 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/30 flex items-center gap-3 transition-all hover:scale-105">
              Review Orders <IconArrowRight size={18} />
           </Link>
        </div>
      </div>

      {/* Financial Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Gross Money Flow", value: `₹${totalRevenue}`, icon: IconCurrencyRupee, bgClass: "bg-emerald-500/10", textClass: "text-emerald-500", trend: "Total Sales" },
          { label: "Settled Payouts", value: `₹${settledEarnings}`, icon: IconCircleCheck, bgClass: "bg-green-500/10", textClass: "text-green-500", trend: "Cleared in Bank" },
          { label: "Pending Clearing", value: `₹${pendingSettlement}`, icon: IconClock, bgClass: "bg-amber-500/10", textClass: "text-amber-500", trend: "Processing" },
          { label: "COD Collections", value: `₹${codCollections}`, icon: IconCash, bgClass: "bg-teal-500/10", textClass: "text-teal-500", trend: "Paid in Cash" }
        ].map((item, i) => (
          <div key={i} className="bg-base-100 rounded-[2rem] p-8 border border-base-200 shadow-sm hover:translate-y-[-5px] transition-all duration-300 group">
            <div className={`w-14 h-14 ${item.bgClass} rounded-2xl flex items-center justify-center ${item.textClass} mb-6 group-hover:scale-110 transition-transform`}>
              <item.icon size={28} strokeWidth={2.5} />
            </div>
            <p className="text-[11px] font-black text-base-content/60 uppercase tracking-widest mb-1">{item.label}</p>
            <h3 className="text-4xl font-black text-base-content tracking-tighter mb-2">{item.value}</h3>
            <span className="text-[9px] font-black bg-base-200 text-base-content/50 border border-base-300 px-2.5 py-1 rounded-lg uppercase tracking-wider">{item.trend}</span>
          </div>
        ))}
      </div>

      {/* Transaction History Table */}
      <div className="bg-base-100 rounded-[2.5rem] p-10 border border-base-300 shadow-sm space-y-8">
        <div>
          <h3 className="text-2xl font-black text-base-content tracking-tight">Ledger Settlements List</h3>
          <p className="text-xs font-bold text-base-content/60 uppercase tracking-widest mt-1">Detailed list of individual payouts and settlement status</p>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="border-b border-base-200 bg-base-200/50">
                <th className="bg-transparent text-[10px] font-black uppercase tracking-widest text-base-content/40 p-6">Order ID</th>
                <th className="bg-transparent text-[10px] font-black uppercase tracking-widest text-base-content/40 p-6">Customer</th>
                <th className="bg-transparent text-[10px] font-black uppercase tracking-widest text-base-content/40 p-6 text-center">Method</th>
                <th className="bg-transparent text-[10px] font-black uppercase tracking-widest text-base-content/40 p-6 text-center">Payment Status</th>
                <th className="bg-transparent text-[10px] font-black uppercase tracking-widest text-base-content/40 p-6 text-center">Settlement</th>
                <th className="bg-transparent text-[10px] font-black uppercase tracking-widest text-base-content/40 p-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-xs font-black text-base-content/40 uppercase tracking-widest">
                    No transactions found in this ledger cycle.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-base-200 transition-colors">
                    <td className="p-6 font-black text-base-content/40 text-xs">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="p-6">
                      <p className="font-bold text-base-content text-sm">{order.userId?.name || "Customer"}</p>
                      <p className="text-[10px] font-medium text-base-content/50 uppercase">{order.userId?.email}</p>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        order.paymentMethod === "online" ? "bg-primary/10 text-primary border border-primary/20" : "bg-secondary/10 text-secondary border border-secondary/20"
                      }`}>
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        order.paymentStatus === "completed" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      {order.deliveryStatus === "delivered" ? (
                        <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-white px-3 py-1 rounded-lg shadow-sm">Settled</span>
                      ) : (
                        <span className="text-[9px] font-black uppercase tracking-widest bg-amber-500 text-white px-3 py-1 rounded-lg shadow-sm">Escrow Pending</span>
                      )}
                    </td>
                    <td className="p-6 text-right font-black text-base-content text-base">
                      ₹{order.totalPrice}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FarmerEarningsPage;
