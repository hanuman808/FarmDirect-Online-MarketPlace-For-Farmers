"use client";

import { useAuth } from "@/context/AuthProvider";
import { 
  IconShoppingCart, 
  IconPackage, 
  IconCurrencyRupee, 
  IconClock, 
  IconLeaf,
  IconArrowRight,
  IconLayoutGrid,
  IconHistory,
  IconTruckDelivery
} from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Order {
  _id: string;
  products: Array<{
    product: {
      _id: string;
      name: string;
      imageUrl: string;
      price: number;
    };
    quantity: number;
  }>;
  totalPrice: number;
  deliveryStatus: string;
  createdAt: string;
}

const UserDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/orders?role=user");
        if (res.data.success) {
          const fetchedOrders = res.data.orders;
          setOrders(fetchedOrders);

          const totalOrders = fetchedOrders.length;
          const pendingOrders = fetchedOrders.filter(
            (order: Order) => order.deliveryStatus !== "delivered"
          ).length;
          const totalSpent = fetchedOrders.reduce(
            (sum: number, order: Order) => sum + order.totalPrice,
            0
          );

          setStats({ totalOrders, pendingOrders, totalSpent });
        }
      } catch (error) {
        console.error("Failed fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 space-y-12 animate-in fade-in duration-700">
      
      {/* Welcome Hero */}
      <div className="bg-base-100 p-10 rounded-[2.5rem] border border-base-300 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <IconLayoutGrid size={200} className="rotate-[-10deg]" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-1 bg-primary rounded-full"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Customer Account</p>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-base-content leading-none mb-4">Hello, {user.name.split(' ')[0]}!</h1>
          <p className="text-sm font-bold text-base-content/60 max-w-sm lowercase">Welcome to your farm store. Track your orders and buy fresh products.</p>
        </div>
        <div className="relative z-10 flex gap-4">
          <Link href="/user/browse" className="btn btn-primary h-14 px-8 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl shadow-primary/30 flex items-center gap-3">
             Start Shopping <IconArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { label: "My Orders", value: stats.totalOrders, icon: IconShoppingCart, bgClass: "bg-primary/10", textClass: "text-primary" },
          { label: "Total Spent", value: `₹${stats.totalSpent}`, icon: IconCurrencyRupee, bgClass: "bg-emerald-500/10", textClass: "text-emerald-500" },
          { label: "Active Tracking", value: stats.pendingOrders, icon: IconTruckDelivery, bgClass: "bg-orange-500/10", textClass: "text-orange-500" }
        ].map((item, idx) => (
          <div key={idx} className="bg-base-100 rounded-[2.5rem] p-8 border border-base-300 shadow-sm group hover:border-primary/20 transition-all duration-300">
             <div className="flex items-end justify-between">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/60 mb-2">{item.label}</p>
                    <p className="text-4xl font-black text-base-content tabular-nums tracking-tighter leading-none">{item.value}</p>
                 </div>
                 <div className={`w-14 h-14 ${item.bgClass} rounded-2xl flex items-center justify-center ${item.textClass} group-hover:scale-110 transition-transform`}>
                    <item.icon size={28} />
                 </div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Recent Purchases Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-base-100 rounded-[2.5rem] p-10 border border-base-300 shadow-sm relative overflow-hidden">
             <div className="flex justify-between items-center mb-10">
                <div>
                   <h3 className="text-2xl font-black text-base-content tracking-tight">Recent Purchases</h3>
                   <p className="text-[10px] font-bold text-base-content/60 uppercase tracking-widest mt-2">Items you bought recently</p>
                </div>
                <Link href="/user/orders" className="text-primary font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-1 group">
                   View All <IconArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
                </Link>
             </div>

             {loading ? (
               <div className="flex flex-col items-center justify-center py-20 gap-4">
                 <div className="loading loading-ring loading-lg text-primary"></div>
                  <p className="text-[10px] font-black text-base-content/40 uppercase tracking-widest">Accessing History...</p>
               </div>
             ) : orders.length === 0 ? (
               <div className="py-20 text-center bg-base-200 rounded-[2rem] border-2 border-dashed border-base-300 flex flex-col items-center">
                   <IconShoppingCart size={48} className="text-gray-200 mb-4" />
                   <p className="text-xs font-black text-base-content/60 uppercase tracking-widest mb-6">No purchases yet</p>
                   <Link href="/user/browse" className="btn btn-outline btn-sm rounded-xl px-6 font-black text-[10px] uppercase">Browse Shop</Link>
               </div>
             ) : (
               <div className="space-y-4">
                 {orders.slice(0, 5).map((order) => (
                   <div key={order._id} className="flex items-center justify-between p-6 bg-base-100 rounded-3xl border border-base-200 hover:bg-base-200 hover:border-primary/20 transition-all group">
                     <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-base-200 rounded-2xl flex flex-col items-center justify-center border border-base-300 overflow-hidden group-hover:bg-base-100 transition-colors">
                          <img src={order.products[0]?.product.imageUrl || "/placeholder.jpg"} className="w-full h-full object-cover" alt="" />
                       </div>
                       <div>
                         <p className="text-lg font-black text-base-content tracking-tight leading-none mb-2">
                           {order.products[0]?.product.name}
                           {order.products.length > 1 && <span className="text-xs text-primary ml-2">+{order.products.length - 1} extra</span>}
                         </p>
                         <div className="flex items-center gap-3">
                           <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                             order.deliveryStatus === 'delivered' ? "bg-emerald-500/10 text-emerald-500" :
                             order.deliveryStatus === 'shipped' ? "bg-primary/10 text-primary" :
                             "bg-orange-500/10 text-orange-500"
                           }`}>{order.deliveryStatus}</span>
                           <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-tighter">₹{order.totalPrice}</span>
                         </div>
                       </div>
                     </div>
                     <Link href="/user/orders" className="w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center text-base-content/40 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                       <IconArrowRight size={18} />
                     </Link>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-8">
           <Link href="/user/browse" className="block bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl shadow-slate-200 hover:scale-[1.02] transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                 <IconLeaf size={120} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">New Arrivals</p>
                 <h4 className="text-3xl font-black tracking-tight leading-none mb-6">Explore Farm Fresh</h4>
                 <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md text-[10px] font-black uppercase tracking-widest">
                    Open Catalog <IconArrowRight size={14} />
                 </div>
              </div>
           </Link>

           <div className="bg-base-100 border border-base-300 rounded-[2.5rem] p-10 text-center relative overflow-hidden">
              <div className="w-16 h-16 bg-base-200 rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6">
                 <IconHistory className="text-primary" size={32} />
              </div>
              <h4 className="text-xl font-black text-base-content tracking-tight mb-2">My History</h4>
              <p className="text-[10px] font-bold text-base-content/60 uppercase tracking-widest leading-relaxed mb-6">All your transactions are backed by blockchain.</p>
              <Link href="/user/orders" className="btn btn-primary btn-block h-12 rounded-xl font-black uppercase text-[10px] tracking-widest">Order Logs</Link>
           </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
