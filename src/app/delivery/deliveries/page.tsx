"use client";

import { useAuth } from "@/context/AuthProvider";
import { 
  IconTruck, 
  IconPackage, 
  IconMapPin, 
  IconPhone, 
  IconCheck, 
  IconExternalLink, 
  IconArrowRight, 
  IconClock, 
  IconLoader2 
} from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ActiveDeliveriesPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/delivery/orders");
            if (res.data.success) {
                setOrders(res.data.orders);
            }
        } catch (error) {
            console.error("Fetch active orders error:", error);
            toast.error("Error loading active orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const updateStatus = async (orderId: string, status: string) => {
        try {
            const res = await axios.patch("/api/delivery/orders", { orderId, deliveryStatus: status });
            if (res.data.success) {
                toast.success(`Marked as ${status.replace('_', ' ')}!`);
                fetchOrders(); 
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <IconLoader2 className="animate-spin text-primary" size={48} />
                <p className="text-xs font-black text-base-content/30 uppercase tracking-widest">Checking active duty queue...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="bg-base-100 p-10 rounded-[2.5rem] border border-base-300 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <IconTruck size={200} className="rotate-[-10deg] text-primary" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-8 h-1 bg-primary rounded-full"></span>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Transit Duty</p>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-base-content leading-none mb-4">Active Deliveries</h1>
                    <p className="text-sm font-bold text-base-content/60 max-w-lg">Manage your currently assigned deliveries, pickups, and transit operations below.</p>
                </div>
            </div>

            {/* List of active duties */}
            {orders.length === 0 ? (
                <div className="text-center py-32 bg-base-200 rounded-[3rem] border-2 border-dashed border-base-300 flex flex-col items-center">
                    <div className="w-24 h-24 bg-base-100 rounded-3xl shadow-sm flex items-center justify-center text-base-content/20 mb-6">
                        <IconPackage size={48} />
                    </div>
                    <p className="text-2xl font-black text-base-content tracking-tight mb-2">No Active Deliveries</p>
                    <p className="text-xs font-black text-base-content/40 uppercase tracking-widest mt-2 max-w-sm">
                        Everything is delivered! Once the Admin assigns new orders, they will show up here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {orders.map((order) => (
                        <div 
                            key={order._id} 
                            className="bg-base-100 rounded-[2.5rem] border border-base-200 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 overflow-hidden flex flex-col"
                        >
                            {/* Card Top / Header */}
                            <div className="p-8 md:p-10 border-b border-base-200 flex justify-between items-start bg-base-200/30">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-lg uppercase tracking-wider">Order ID</span>
                                        <p className="text-[11px] font-mono font-black text-base-content/60">#{order._id.slice(-6).toUpperCase()}</p>
                                    </div>
                                    <h4 className="text-3xl font-black text-base-content mt-2">₹{order.totalPrice}</h4>
                                </div>
                                <span className={`px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                    order.deliveryStatus === "in_transit" ? "bg-primary text-white animate-pulse" :
                                    order.deliveryStatus === "ready_for_pickup" ? "bg-orange-500 text-white" :
                                    "bg-secondary text-white"
                                }`}>
                                    {order.deliveryStatus.replace("_", " ")}
                                </span>
                            </div>

                            {/* Shipment Info details */}
                            <div className="p-8 md:p-10 flex-1 space-y-8">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 mt-1 shadow-sm border border-orange-500/20">
                                            <IconPackage size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase text-base-content/40 mb-0.5 tracking-wider">Pickup From (Farmer)</p>
                                            <p className="text-base font-black text-base-content leading-tight">{order.farmerId?.name}</p>
                                            <p className="text-xs font-bold text-base-content/50 mt-1 flex items-center gap-1.5"><IconPhone size={12} /> {order.farmerId?.contact || "No number shared"}</p>
                                            <p className="text-[10px] font-bold text-base-content/60 mt-2 bg-base-200 px-2.5 py-1 rounded-lg border border-base-300 w-fit">
                                                Item: {order.products[0]?.product?.name || "Crop Package"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 pb-6 border-b border-base-200">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1 shadow-sm border border-primary/20">
                                            <IconMapPin size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[9px] font-black uppercase text-base-content/40 mb-0.5 tracking-wider">Deliver To (Customer)</p>
                                            <p className="text-base font-black text-base-content leading-tight">{order.deliveryAddress?.name || order.userId?.name || "Customer"}</p>
                                            <p className="text-sm font-bold text-base-content/80 mt-1.5 leading-relaxed">
                                                {order.deliveryAddress?.address || order.userId?.address?.address || "Address details missing"}
                                            </p>
                                            <div className="flex items-center gap-2 mt-4">
                                                <a 
                                                    href={`tel:${order.deliveryAddress?.phone || order.userId?.contact}`} 
                                                    className="flex items-center gap-2 text-[10px] font-black text-primary bg-primary/10 hover:bg-primary/20 transition-colors px-3 py-1.5 rounded-xl border border-primary/20 uppercase tracking-wider"
                                                >
                                                    <IconPhone size={12} /> Call: {order.deliveryAddress?.phone || order.userId?.contact}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Interactive Transit Action Buttons */}
                            <div className="px-8 py-6 bg-base-200/30 border-t border-base-200 flex gap-4">
                                {order.deliveryStatus === "assigned" && (
                                    <button 
                                        onClick={() => updateStatus(order._id, "ready_for_pickup")}
                                        className="btn flex-1 h-14 bg-base-100 border-base-300 hover:bg-base-200 text-base-content rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-sm flex items-center justify-center gap-2"
                                    >
                                        Accept Request <IconArrowRight size={14} />
                                    </button>
                                )}

                                {order.deliveryStatus === "ready_for_pickup" && (
                                    <button 
                                        onClick={() => updateStatus(order._id, "picked")}
                                        className="btn flex-1 h-14 bg-primary border-none hover:bg-primary/90 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-md flex items-center justify-center gap-2"
                                    >
                                        I have Picked Up <IconCheck size={14} />
                                    </button>
                                )}

                                {order.deliveryStatus === "picked" && (
                                    <button 
                                        onClick={() => updateStatus(order._id, "in_transit")}
                                        className="btn flex-1 h-14 bg-secondary border-none hover:bg-secondary/90 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-md flex items-center justify-center gap-2 animate-pulse"
                                    >
                                        Start Transit <IconTruck size={14} />
                                    </button>
                                )}

                                {order.deliveryStatus === "in_transit" && (
                                    <button 
                                        onClick={() => updateStatus(order._id, "delivered")}
                                        className="btn flex-1 h-14 bg-green-600 border-none hover:bg-green-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-md flex items-center justify-center gap-2"
                                    >
                                        Confirm Delivery <IconCheck size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActiveDeliveriesPage;
