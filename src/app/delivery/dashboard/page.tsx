"use client";

import { useAuth } from "@/context/AuthProvider";
import { 
  IconTruck, 
  IconCheck, 
  IconCurrencyRupee, 
  IconBell, 
  IconClock, 
  IconPackage, 
  IconCalendar,
  IconArrowUpRight
} from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

const DeliveryDashboard = () => {
    const { user } = useAuth();
    const [activeCount, setActiveCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [activeRes, completedRes, notifRes] = await Promise.all([
                axios.get("/api/delivery/orders"),
                axios.get("/api/delivery/orders?status=completed"),
                axios.get("/api/notifications")
            ]);

            if (activeRes.data.success) {
                setActiveCount(activeRes.data.orders.length);
            }
            if (completedRes.data.success) {
                setCompletedCount(completedRes.data.orders.length);
            }
            if (notifRes.data.success) {
                setNotifications(notifRes.data.notifications);
            }
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const markNotificationRead = async (id: string) => {
        try {
            await axios.patch("/api/notifications", { notificationId: id });
            fetchData();
        } catch (error) {
            console.error("Mark read error:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <span className="loading loading-ring loading-lg text-primary"></span>
                <p className="text-xs font-black text-base-content/30 uppercase tracking-widest">Loading logistics metrics...</p>
            </div>
        );
    }

    const greeting = () => {
        const hr = new Date().getHours();
        if (hr < 12) return "Good Morning";
        if (hr < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="bg-base-100 p-10 rounded-[2.5rem] border border-base-300 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <IconTruck size={200} className="rotate-[-10deg] text-primary" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-8 h-1 bg-primary rounded-full"></span>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Logistics Hub</p>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-base-content leading-none mb-4">
                        {greeting()}, <span className="text-primary">{user?.name}!</span>
                    </h1>
                    <p className="text-sm font-bold text-base-content/60 max-w-lg">Welcome back to AgriFood logistics operations. Here is your delivery performance summary for today.</p>
                </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-base-100 p-8 rounded-[2rem] border border-base-300 shadow-sm flex items-center gap-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconClock size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-base-content/60 uppercase tracking-widest leading-none">Active Deliveries</p>
                        <h3 className="text-4xl font-black text-base-content tracking-tighter mt-2">{activeCount}</h3>
                        <Link href="/delivery/deliveries" className="text-[9px] font-black text-primary uppercase tracking-widest inline-flex items-center gap-1 mt-3 hover:underline">
                            View Jobs <IconArrowUpRight size={10} />
                        </Link>
                    </div>
                </div>

                <div className="bg-base-100 p-8 rounded-[2rem] border border-base-300 shadow-sm flex items-center gap-6 hover:shadow-xl hover:border-emerald-100 transition-all duration-300 group">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconCheck size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-base-content/60 uppercase tracking-widest leading-none">Completed Tasks</p>
                        <h3 className="text-4xl font-black text-base-content tracking-tighter mt-2">{completedCount}</h3>
                        <Link href="/delivery/completed" className="text-[9px] font-black text-emerald-600 uppercase tracking-widest inline-flex items-center gap-1 mt-3 hover:underline">
                            View History <IconArrowUpRight size={10} />
                        </Link>
                    </div>
                </div>

                <div className="bg-base-100 p-8 rounded-[2rem] border border-base-300 shadow-sm flex items-center gap-6 hover:shadow-xl hover:border-orange-100 transition-all duration-300 group">
                    <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconCurrencyRupee size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-base-content/60 uppercase tracking-widest leading-none">My Earnings</p>
                        <h3 className="text-4xl font-black text-base-content tracking-tighter mt-2">₹{completedCount * 50}</h3>
                        <p className="text-[9px] font-black text-orange-600/60 uppercase tracking-widest mt-3">₹50 / successful delivery</p>
                    </div>
                </div>
            </div>

            {/* Notifications & Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Logistics alerts / notifications */}
                <div className="bg-base-100 rounded-[2.5rem] border border-base-300 p-8 shadow-sm flex flex-col space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-base-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                <IconBell size={20} />
                            </div>
                            <h4 className="text-base font-black text-base-content uppercase tracking-wider">Logistics Alerts</h4>
                        </div>
                        <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-lg">
                            {notifications.filter(n => !n.isRead).length} New Alerts
                        </span>
                    </div>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                        {notifications.length === 0 ? (
                            <div className="text-center py-16 text-slate-300 flex flex-col items-center">
                                <IconBell size={48} className="stroke-[1.5] mb-3 text-slate-200" />
                                <p className="text-xs font-black uppercase tracking-widest">No active warnings</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div 
                                    key={n._id}
                                    onClick={() => markNotificationRead(n._id)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 items-start ${
                                        n.isRead 
                                            ? "border-base-200 bg-base-200/50 opacity-60" 
                                            : "border-primary/20 bg-primary/5 hover:bg-primary/10"
                                    }`}
                                >
                                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${n.isRead ? "bg-base-300" : "bg-primary animate-ping"}`}></div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-base-content leading-relaxed">{n.message}</p>
                                        <p className="text-[9px] font-bold text-base-content/60 mt-2 flex items-center gap-1.5">
                                            <IconClock size={10} /> {new Date(n.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                             ))
                        )}
                    </div>
                </div>

                {/* Duty Guidelines / Info */}
                <div className="bg-base-100 rounded-[2.5rem] border border-base-300 p-8 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 pb-6 border-b border-base-200 mb-6">
                            <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                                <IconPackage size={20} />
                            </div>
                            <h4 className="text-base font-black text-base-content uppercase tracking-wider">Logistics Guidelines</h4>
                        </div>

                        <div className="space-y-5">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center font-black text-xs shrink-0">1</div>
                                <p className="text-xs font-bold text-base-content/80 leading-relaxed">Ensure you check the freshness status of the crop package with the farmer during collection.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center font-black text-xs shrink-0">2</div>
                                <p className="text-xs font-bold text-base-content/80 leading-relaxed">Always update the transit status immediately upon picking up the package to activate customer radar.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center font-black text-xs shrink-0">3</div>
                                <p className="text-xs font-bold text-base-content/80 leading-relaxed">For Cash on Delivery (COD) shipments, verify physical cash collection before marking delivery complete.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-base-200 p-4 rounded-2xl border border-base-300 flex items-center gap-3 mt-6">
                        <IconCalendar className="text-primary" size={20} />
                        <span className="text-[10px] font-black text-base-content/60 uppercase tracking-wider">Shift logged in as delivery partner</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryDashboard;
