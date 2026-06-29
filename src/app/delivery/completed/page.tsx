"use client";

import { useAuth } from "@/context/AuthProvider";
import { 
  IconTruck, 
  IconPackage, 
  IconMapPin, 
  IconCheck, 
  IconCalendar, 
  IconLoader2,
  IconCurrencyRupee
} from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";

const CompletedDeliveriesPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCompletedOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/delivery/orders?status=completed");
            if (res.data.success) {
                setOrders(res.data.orders);
            }
        } catch (error) {
            console.error("Fetch completed orders error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCompletedOrders();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <IconLoader2 className="animate-spin text-emerald-500" size={48} />
                <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Accessing historical logs...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <IconCheck size={200} className="rotate-[-10deg] text-emerald-600" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">History Log</p>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none mb-4">Completed Deliveries</h1>
                    <p className="text-sm font-bold text-slate-400 max-w-lg">Here is your verified history of successful food supply chain deliveries.</p>
                </div>
            </div>

            {/* List of completed deliveries */}
            {orders.length === 0 ? (
                <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
                    <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center text-slate-200 mb-6">
                        <IconPackage size={48} />
                    </div>
                    <p className="text-2xl font-black text-slate-900 tracking-tight mb-2">No Deliveries Completed Yet</p>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2 max-w-sm">
                        Start accepting jobs and delivering packages. Your completed history will show up here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    {orders.map((order) => (
                        <div 
                            key={order._id}
                            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-500 overflow-hidden"
                        >
                            <div className="p-8 md:p-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg border border-emerald-100 uppercase tracking-wider">Completed</span>
                                        <p className="text-[11px] font-mono font-bold text-slate-400">Order ID: #{order._id.slice(-6).toUpperCase()}</p>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Farmer Location</p>
                                            <p className="text-sm font-bold text-slate-800 mt-1">{order.farmerId?.name || "Farmer Source"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Customer Delivery Hub</p>
                                            <p className="text-sm font-bold text-slate-800 mt-1">{order.deliveryAddress?.name || order.userId?.name || "Customer Hub"}</p>
                                            <p className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-1.5"><IconMapPin size={12} /> {order.deliveryAddress?.address || order.userId?.address?.address}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 self-stretch lg:self-auto justify-between lg:justify-end border-t lg:border-t-0 border-slate-50 pt-6 lg:pt-0">
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Grand Total</p>
                                        <h3 className="text-3xl font-black text-emerald-600 mt-1">₹{order.totalPrice}</h3>
                                    </div>
                                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
                                        <IconCheck size={28} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompletedDeliveriesPage;
