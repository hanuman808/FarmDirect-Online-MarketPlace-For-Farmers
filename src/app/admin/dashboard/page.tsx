"use client";

import {
  IconUsers,
  IconPlant,
  IconReceipt2,
  IconChevronRight,
  IconTruck,
  IconCircleCheck,
  IconClock,
  IconActivity,
  IconPackage,
  IconShieldCheck,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    totalDeliveries: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingApprovals: 0,
  });
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const usersRes = await axios.get("/api/admin/users");
        const allUsers = usersRes.data.users || [];

        const customers = allUsers.filter((u: any) => u.role === "user");
        const allFarmers = allUsers.filter((u: any) => u.role === "farmer");
        const allDeliveries = allUsers.filter((u: any) => u.role === "delivery");
        
        const pendingQueue = allUsers.filter((u: any) => (u.role === "farmer" || u.role === "delivery") && !u.isApproved);

        const productsRes = await axios.get("/api/products");
        const totalProducts = productsRes.data.products?.length || 0;

        const ordersRes = await axios.get("/api/orders");
        const totalOrders = ordersRes.data.orders?.length || 0;

        setStats({
          totalUsers: customers.length,
          totalFarmers: allFarmers.length,
          totalDeliveries: allDeliveries.length,
          totalProducts,
          totalOrders,
          pendingApprovals: pendingQueue.length,
        });

        setPendingApprovals(pendingQueue.slice(0, 5));
      } catch (error: any) {
        console.error("Dashboard Fetch Error:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="loading loading-spinner loading-lg text-primary scale-125"></div>
        <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">Syncing Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-10 space-y-12 animate-in fade-in duration-700">
      
      {/* Dynamic Welcome Header */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-200">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <IconActivity size={200} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">System Administrator</p>
            </div>
            <h1 className="text-6xl font-black tracking-tighter leading-none mb-4">Admin Home.</h1>
            <p className="text-sm font-bold text-slate-400 max-w-md">Manage your users, product supply, and delivery partners from one place.</p>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="/admin/manage-farmers" className="btn btn-primary h-14 px-8 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl shadow-primary/30 flex items-center gap-3">
              Approve People ({stats.pendingApprovals})
            </Link>
            <div className="flex items-center gap-3 text-emerald-400 text-xs font-bold bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
              Systen Online & Linked
            </div>
          </div>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Our Customers", value: stats.totalUsers, icon: IconUsers, color: "sky", trend: "+12%" },
          { label: "Total Farmers", value: stats.totalFarmers, icon: IconPlant, color: "emerald", trend: "+5%" },
          { label: "Delivery Boys", value: stats.totalDeliveries, icon: IconTruck, color: "orange", trend: "+8%" },
          { label: "Total Orders", value: stats.totalOrders, icon: IconReceipt2, color: "violet", trend: "+15%" }
        ].map((item, i) => (
          <div key={i} className="group bg-base-100 rounded-[2rem] p-8 border border-base-300 shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden relative">
            <div className={`absolute top-0 left-0 w-1 h-full bg-${item.color}-500/10 group-hover:w-full transition-all duration-700`}></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <div className={`w-14 h-14 bg-${item.color}-50 rounded-2xl flex items-center justify-center text-${item.color}-500 group-hover:scale-110 transition-transform`}>
                  <item.icon size={28} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-black bg-emerald-50 text-emerald-500 px-3 py-1.5 rounded-lg border border-emerald-100">{item.trend}</span>
              </div>
              <p className="text-[11px] font-black text-base-content/60 uppercase tracking-widest mb-1">{item.label}</p>
              <h3 className="text-4xl font-black text-base-content tracking-tighter">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Waiting List */}
        <div className="lg:col-span-2">
          <div className="bg-base-100 rounded-[2.5rem] p-10 border border-base-300 shadow-2xl">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h3 className="text-3xl font-black text-base-content tracking-tight">Waiting for Approval</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                  <p className="text-[10px] font-black text-base-content/60 uppercase tracking-widest leading-none">Review and confirm accounts</p>
                </div>
              </div>
              <Link href="/admin/manage-farmers" className="text-primary font-black text-[11px] uppercase tracking-widest hover:underline flex items-center gap-2">View Full List <IconChevronRight size={14} /></Link>
            </div>
            
            <div className="space-y-4">
              {pendingApprovals.length === 0 ? (
                <div className="py-24 text-center bg-base-200 rounded-[2rem] border-2 border-dashed border-base-300 flex flex-col items-center">
                    <IconCircleCheck className="text-emerald-500 mb-6" size={60} strokeWidth={1} />
                    <p className="text-xs font-black text-base-content/60 uppercase tracking-widest">Everything is clean. All users approved.</p>
                </div>
              ) : (
                pendingApprovals.map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-base-100 rounded-3xl border border-base-200 hover:bg-base-200 hover:border-primary/20 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center font-black text-2xl text-primary group-hover:scale-110 transition-transform">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-lg font-black text-base-content tracking-tight mb-1">{user.name}</p>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${user.role === 'farmer' ? "bg-emerald-50 text-emerald-500" : "bg-orange-50 text-orange-500"}`}>{user.role}</span>
                          <span className="text-[10px] font-bold text-base-content/50">{user.email}</span>
                        </div>
                      </div>
                    </div>
                    <Link href="/admin/manage-farmers" className="btn btn-primary h-12 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest border-none shadow-lg shadow-primary/20">
                      Approve account
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* System Summary Activity */}
        <div className="space-y-8">
          <div className="bg-primary rounded-[2.5rem] p-10 text-white shadow-2xl shadow-primary/30 relative overflow-hidden group min-h-[450px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                <IconActivity size={120} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black tracking-tighter leading-tight mb-2">Live Status</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-8">System node counts</p>
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-1 p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/15 transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Inventory</span>
                      <IconPackage size={16} className="text-white/40" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black">{stats.totalProducts}</span>
                      <span className="text-[10px] font-bold text-white/40 uppercase">Products</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/15 transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Flow</span>
                      <IconReceipt2 size={16} className="text-white/40" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black">{stats.totalOrders}</span>
                      <span className="text-[10px] font-bold text-white/40 uppercase">Orders</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-8 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <IconClock size={18} className="text-white/60" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Last Update</p>
                    <p className="text-xs font-bold">2 minutes ago</p>
                  </div>
                </div>
              </div>
          </div>

          <div className="bg-base-100 border border-base-300 rounded-[2.5rem] p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-base-200 rounded-2xl shadow-xl flex items-center justify-center mb-6">
              <IconShieldCheck size={32} className="text-primary" strokeWidth={2.5} />
            </div>
            <h4 className="text-xl font-black text-base-content tracking-tight mb-2">Security Hub</h4>
            <p className="text-[10px] font-bold text-base-content/60 uppercase tracking-widest leading-relaxed">Admin panel is fully linked with blockchain nodes for verified logistics.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
