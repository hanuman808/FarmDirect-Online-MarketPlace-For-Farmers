"use client";

import { useAuth } from "@/context/AuthProvider";
import { IconPackage, IconFilter, IconDownload, IconPlus, IconMinus, IconRefresh, IconArrowRight, IconLayoutList } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface InventoryLog {
    _id: string;
    productId: {
        _id: string;
        name: string;
        imageUrl: string;
    };
    type: string;
    quantity: number;
    previousStock: number;
    newStock: number;
    orderId?: string;
    reason: string;
    createdAt: string;
}

const InventoryLogsPage = () => {
    const { user } = useAuth();
    const [logs, setLogs] = useState<InventoryLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<InventoryLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<string>("all");

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/inventory-logs");
            if (res.data.success) {
                setLogs(res.data.logs);
                setFilteredLogs(res.data.logs);
            }
        } catch (error) {
            console.error("Fetch logs error:", error);
            toast.error("Failed to load history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchLogs();
        }
    }, [user]);

    useEffect(() => {
        if (filterType === "all") {
            setFilteredLogs(logs);
        } else {
            setFilteredLogs(logs.filter((log) => log.type === filterType));
        }
    }, [filterType, logs]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "STOCK_ADDED":
                return <IconPlus size={18} className="text-emerald-500" strokeWidth={3} />;
            case "STOCK_REDUCED":
            case "ORDER_PLACED":
                return <IconMinus size={18} className="text-rose-500" strokeWidth={3} />;
            case "STOCK_RESTORED":
            case "ORDER_CANCELLED":
                return <IconRefresh size={18} className="text-primary" strokeWidth={3} />;
            default:
                return <IconPackage size={18} className="text-base-content/40" strokeWidth={3} />;
        }
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            STOCK_ADDED: "New Stock Added",
            STOCK_REDUCED: "Manual Reduction",
            STOCK_RESTORED: "Stock Restored",
            ORDER_PLACED: "Item Sold",
            ORDER_CANCELLED: "Order Cancelled",
        };
        return labels[type] || type;
    };

    const exportToCSV = () => {
        const headers = ["Date", "Product", "Activity", "Quantity", "Old Stock", "New Stock", "Note"];
        const rows = filteredLogs.map((log) => [
            new Date(log.createdAt).toLocaleString("en-IN"),
            log.productId.name,
            getTypeLabel(log.type),
            log.quantity,
            log.previousStock,
            log.newStock,
            log.reason,
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `farm-stock-history-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        toast.success("History downloaded!");
    };

    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 space-y-12 animate-in fade-in duration-700">
            
            {/* Header section */}
            <div className="bg-base-100 p-10 rounded-[2.5rem] border border-base-300 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <IconLayoutList size={200} className="rotate-[-10deg]" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Storage Logs</p>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-base-content leading-none mb-4">Stock History</h1>
                    <p className="text-sm font-bold text-base-content/60 max-w-lg lowercase">Keep track of every product that enters or leaves your farm storage.</p>
                </div>
                <div className="relative z-10">
                    <button
                        onClick={exportToCSV}
                        className="btn btn-primary h-14 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/30 flex items-center gap-3 transition-all hover:scale-[1.05]"
                    >
                        <IconDownload size={18} /> Download Excel
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-base-100 p-6 rounded-[2rem] border border-base-300 shadow-sm">
                <div className="flex items-center gap-3 px-6 py-2 bg-base-200 rounded-xl border border-base-300">
                    <IconFilter size={18} className="text-base-content/40" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-base-content/40">Filter By:</span>
                    <select
                        className="bg-transparent border-none focus:ring-0 text-sm font-black text-base-content cursor-pointer min-w-[150px]"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">All Activities</option>
                        <option value="STOCK_ADDED">Products Added</option>
                        <option value="ORDER_PLACED">Products Sold</option>
                        <option value="STOCK_REDUCED">Inventory Reduction</option>
                        <option value="ORDER_CANCELLED">Cancelled Sales</option>
                    </select>
                </div>
                <div className="ml-auto text-[10px] font-black text-base-content/30 uppercase tracking-widest">
                    Showing {filteredLogs.length} Events
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="loading loading-ring loading-lg text-emerald-500"></div>
                    <p className="font-black text-base-content/30 uppercase tracking-widest text-xs">Accessing farm records...</p>
                </div>
            ) : filteredLogs.length === 0 ? (
                <div className="text-center py-32 bg-base-200 rounded-[3rem] border-2 border-dashed border-base-300 flex flex-col items-center">
                    <div className="w-24 h-24 bg-base-100 rounded-3xl shadow-sm flex items-center justify-center text-base-content/20 mb-6">
                        <IconPackage size={48} />
                    </div>
                    <p className="text-2xl font-black text-base-content tracking-tight">No History Found</p>
                    <p className="text-xs font-black text-base-content/40 uppercase tracking-widest mt-2">Try changing your filters or add some products first.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredLogs.map((log) => (
                        <div
                            key={log._id}
                            className="group bg-base-100 rounded-[2rem] p-6 border border-base-200 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-8">
                                {/* Product Thumb */}
                                <div className="w-20 h-20 bg-base-200 rounded-2xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                                    <img
                                        src={log.productId.imageUrl || "/placeholder.jpg"}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Activity Info */}
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center">
                                            {getTypeIcon(log.type)}
                                        </div>
                                        <h3 className="text-xl font-black text-base-content tracking-tight">{log.productId.name}</h3>
                                        <span className={`px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                                            log.type.includes('ADDED') || log.type.includes('RESTORED') ? "bg-emerald-500/10 text-emerald-500" :
                                            log.type.includes('PLACED') || log.type.includes('REDUCED') ? "bg-rose-500/10 text-rose-500" : "bg-primary/10 text-primary"
                                        }`}>
                                            {getTypeLabel(log.type)}
                                        </span>
                                    </div>
                                    <p className="text-sm font-bold text-base-content/60 capitalize">{log.reason}</p>
                                    <div className="flex items-center gap-2">
                                        <IconRefresh size={12} className="text-base-content/30" />
                                        <span className="text-[10px] font-black text-base-content/40 uppercase">
                                            {new Date(log.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>

                                {/* Stock Big Data */}
                                <div className="bg-base-200/50 px-8 py-4 rounded-3xl border border-base-200 flex items-center gap-8 min-w-[280px] justify-between">
                                    <div className="text-center">
                                        <p className="text-[9px] font-black text-base-content/40 uppercase tracking-widest mb-1">Before</p>
                                        <p className="text-2xl font-black text-base-content/40 tabular-nums">{log.previousStock}</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                         <p className={`text-[10px] font-black uppercase mb-1 ${log.quantity > 0 ? "text-emerald-500" : "text-rose-500"}`}>
                                           {log.quantity > 0 ? "+" : ""}{log.quantity}
                                         </p>
                                         <IconArrowRight size={18} className="text-base-content/20" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">After</p>
                                        <p className={`text-4xl font-black tabular-nums tracking-tighter ${
                                            log.newStock > log.previousStock ? "text-emerald-500" : "text-rose-500"
                                        }`}>{log.newStock}</p>
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

export default InventoryLogsPage;
