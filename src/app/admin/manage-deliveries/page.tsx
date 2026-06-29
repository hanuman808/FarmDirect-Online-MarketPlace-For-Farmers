"use client";

import { IconTruck, IconPackage, IconUser, IconChevronRight, IconLoader2, IconCircleCheck, IconCircleX, IconLayoutCards, IconList, IconMapPin, IconPhone, IconShieldCheck, IconAlertCircle } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ManageDeliveriesPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [partners, setPartners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<"grid" | "list">("grid");

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ordersRes, partnersRes] = await Promise.all([
                axios.get("/api/orders"),
                axios.get("/api/admin/delivery-partners")
            ]);

            if (ordersRes.data.success) setOrders(ordersRes.data.orders);
            if (partnersRes.data.success) setPartners(partnersRes.data.partners);
        } catch (error) {
            console.error("Fetch management data error:", error);
            toast.error("Failed to load delivery data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const assignPartner = async (orderId: string, partnerId: string) => {
        if (!partnerId) return;
        try {
            const res = await axios.post("/api/admin/assign-delivery", { orderId, partnerId });
            if (res.data.success) {
                toast.success("Delivery Boy Assigned!");
                fetchData(); // Refresh
            }
        } catch (error) {
            toast.error("Assignment failed");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="loading loading-spinner loading-lg text-primary"></div>
                <p className="text-sm font-bold text-gray-400">Loading order list...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-10 space-y-10">
            {/* Header */}
            <div className="bg-base-100 p-8 rounded-3xl border border-base-300 shadow-sm">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-base-content leading-none">Manage Deliveries</h1>
                        <p className="text-sm font-bold text-base-content/60 mt-2">Assign delivery boys to orders and check delivery status.</p>
                    </div>
                </div>
            </div>

            {/* Content List */}
            <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" : "space-y-6"}>
                {orders.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-base-100 rounded-3xl border border-base-300">
                        <IconShieldCheck className="mx-auto text-emerald-500 mb-4" size={56} />
                        <h3 className="text-2xl font-black text-base-content">No New Orders</h3>
                        <p className="text-xs font-bold text-base-content/40 mt-2">All orders are currently handled.</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order._id} className={`bg-base-100 overflow-hidden border border-base-200 shadow-sm transition-all hover:shadow-md ${
                            view === "grid" ? "rounded-3xl flex flex-col" : "rounded-2xl flex items-center p-8 gap-8"
                        }`}>
                            
                            {/* Card Top */}
                            <div className={`p-8 bg-base-200/50 relative overflow-hidden ${view === "list" ? "bg-transparent p-0 flex-1 border-none" : "border-b border-base-200"}`}>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex flex-col">
                                        <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">Order Number</p>
                                        <p className="text-xl font-black text-base-content">#{order._id.slice(-6).toUpperCase()}</p>
                                    </div>
                                    <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                                        order.deliveryStatus === "pending" ? "bg-orange-500 text-white shadow-sm" : "bg-primary text-white shadow-sm"
                                    }`}>
                                        {order.deliveryStatus}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl font-black text-base-content">₹{order.totalPrice}</p>
                                        <p className="text-[9px] font-bold text-base-content/40 uppercase tracking-widest">Billing Amount</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center text-[10px] font-black text-base-content/60">+{order.products?.length || 0}</div>
                                </div>
                            </div>

                            {/* Delivery Path */}
                            <div className={`p-8 space-y-6 ${view === "list" ? "p-0 flex-[2]" : ""}`}>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-5 h-5 rounded-full bg-emerald-500 border-4 border-base-100 shadow-sm flex items-center justify-center shrink-0 mt-1"></div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase text-base-content/40 mb-0.5 tracking-wider">Pickup Point (Farmer)</p>
                                            <p className="text-base font-bold text-base-content leading-tight">{order.farmerId?.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-5 h-5 rounded-full bg-primary border-4 border-base-100 shadow-sm flex items-center justify-center shrink-0 mt-1"></div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase text-base-content/40 mb-0.5 tracking-wider">Deliver Hub (Customer)</p>
                                            <p className="text-base font-bold text-base-content leading-tight">{order.userId?.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Assign Delivery Boy */}
                            <div className={`p-8 bg-base-200/30 border-t border-base-200 ${view === "list" ? "p-0 border-none bg-transparent flex-[1.5]" : ""}`}>
                                {order.deliveryPartner ? (
                                    <div className="space-y-4">
                                        <div className="bg-base-100 p-5 rounded-2xl border border-primary/20 shadow-sm space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                    <IconShieldCheck size={22} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-black uppercase text-base-content/40 mb-1 tracking-wider">Assigned Boy</p>
                                                    <p className="text-sm font-bold text-base-content leading-none">{order.deliveryPartner.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-bold text-base-content/40 uppercase tracking-widest pt-2 border-t border-base-200">
                                                <span className="flex items-center gap-1"><IconPhone size={12} /> {order.deliveryPartner.contact}</span>
                                                <span className="bg-base-200 px-2 py-0.5 rounded-lg text-base-content">{order.deliveryPartner.vehicleType}</span>
                                            </div>
                                        </div>

                                        {/* Dropdown to change partner */}
                                        <div className="pt-2">
                                            <label className="text-[9px] font-black uppercase text-base-content/40 tracking-widest block mb-2 px-1">Reassign Partner</label>
                                            <select 
                                                className="select h-10 w-full rounded-xl bg-base-100 border border-base-300 focus:border-primary transition-all font-bold text-[10px] px-3 text-base-content"
                                                value=""
                                                onChange={(e) => assignPartner(order._id, e.target.value)}
                                            >
                                                <option value="" disabled>Change Delivery Boy</option>
                                                {partners.filter(p => p.isApproved && p._id !== order.deliveryPartner?._id).map(p => (
                                                    <option key={p._id} value={p._id}>{p.name} ({p.vehicleType})</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <IconAlertCircle className="text-orange-500" size={14} />
                                            <p className="text-[10px] font-black uppercase text-orange-500 tracking-widest">Assign Delivery Boy</p>
                                        </div>
                                        <select 
                                            className="select h-12 w-full rounded-xl bg-base-100 border-2 border-base-200 focus:border-primary transition-all font-bold text-[11px] px-4 text-base-content"
                                            value=""
                                            onChange={(e) => assignPartner(order._id, e.target.value)}
                                        >
                                            <option value="" disabled>Choose Delivery Boy</option>
                                            {partners.filter(p => p.isApproved).map(p => (
                                                <option key={p._id} value={p._id}>{p.name} ({p.vehicleType})</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageDeliveriesPage;
