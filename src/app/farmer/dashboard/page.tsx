"use client";

import { useAuth } from "@/context/AuthProvider";
import { 
  IconPackage, 
  IconShoppingCart, 
  IconCurrencyRupee, 
  IconClock, 
  IconLeaf, 
  IconPlant, 
  IconPlus,
  IconHistory,
  IconChevronRight
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  stock: number;
  price: number;
}

interface Order {
  _id: string;
  totalPrice: number;
  deliveryStatus: string;
  createdAt: string;
}

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);

        const productsRes = await axios.get(`/api/products?ownerId=${user._id}`);
        if (productsRes.data.success) {
          setProducts(productsRes.data.products);
        }

        const ordersRes = await axios.get("/api/orders?role=farmer");
        if (ordersRes.data.success) {
          setOrders(ordersRes.data.orders);

          const totalOrders = ordersRes.data.orders.length;
          const pendingOrders = ordersRes.data.orders.filter(
            (order: Order) => order.deliveryStatus === "pending" || order.deliveryStatus === "assigned"
          ).length;
          
          const totalRevenue = ordersRes.data.orders
            .filter((o: any) => o.paymentStatus === "completed")
            .reduce((sum: number, order: Order) => sum + order.totalPrice, 0);

          setStats({
            totalProducts: productsRes.data.products.length,
            totalOrders,
            totalRevenue,
            pendingOrders,
          });
        }
      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 animate-bounce">
          <IconPlant size={40} />
        </div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Farm Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-10 space-y-12 animate-in fade-in duration-700">
      
      {/* Farmer Welcome */}
      <div className="bg-base-100 p-10 rounded-[2.5rem] border border-base-300 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <IconLeaf size={200} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Farmer Account</p>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-base-content leading-none mb-4">Hello, {user.name.split(' ')[0]}!</h1>
          <p className="text-sm font-bold text-base-content/60 max-w-md">Welcome back to your farm store. Manage your products and orders here.</p>
        </div>
        <div className="relative z-10">
          <Link href="/farmer/add-product" className="btn btn-primary h-14 px-8 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl shadow-primary/30 flex items-center gap-3">
            <IconPlus size={18} /> Add New Product 
          </Link>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "My Products", value: stats.totalProducts, icon: IconPackage, bgClass: "bg-emerald-500/10", textClass: "text-emerald-500" },
          { label: "Total Orders", value: stats.totalOrders, icon: IconShoppingCart, bgClass: "bg-green-500/10", textClass: "text-green-500" },
          { label: "Total Money", value: `₹${stats.totalRevenue}`, icon: IconCurrencyRupee, bgClass: "bg-teal-500/10", textClass: "text-teal-500" },
          { label: "New Orders", value: stats.pendingOrders, icon: IconClock, bgClass: "bg-orange-500/10", textClass: "text-orange-500" }
        ].map((item, i) => (
          <div key={i} className="bg-base-100 rounded-[2rem] p-8 border border-base-300 shadow-sm hover:translate-y-[-5px] transition-all duration-300 group">
            <div className={`w-14 h-14 ${item.bgClass} rounded-2xl flex items-center justify-center ${item.textClass} mb-6 group-hover:scale-110 transition-transform`}>
              <item.icon size={28} strokeWidth={2.5} />
            </div>
            <p className="text-[11px] font-black text-base-content/60 uppercase tracking-widest mb-1">{item.label}</p>
            <h3 className="text-4xl font-black text-base-content tracking-tighter">{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Recent Work */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-base-100 rounded-[2.5rem] p-10 border border-base-300 shadow-sm">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h3 className="text-3xl font-black text-base-content tracking-tight">Recent Orders</h3>
                <div className="text-[11px] font-black text-base-content/60 uppercase tracking-widest mt-2 leading-none flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Orders people placed
                </div>
              </div>
              <Link href="/farmer/orders" className="text-emerald-600 font-black text-[11px] uppercase tracking-widest hover:underline flex items-center gap-1">View All <IconChevronRight size={14} /></Link>
            </div>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="py-20 text-center bg-base-200 rounded-[2rem] border-2 border-dashed border-base-300 flex flex-col items-center">
                  <IconShoppingCart size={48} className="text-gray-200 mb-4" />
                  <p className="text-xs font-black text-base-content/60 uppercase tracking-widest">No orders yet. Keep adding products!</p>
                </div>
              ) : (
                orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-6 bg-base-100 rounded-3xl border border-base-200 hover:bg-base-200 hover:border-emerald-100 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-base-200 rounded-2xl flex flex-col items-center justify-center border border-base-300 group-hover:bg-base-100 transition-colors">
                        <p className="text-[9px] font-black text-base-content/40 uppercase">{new Date(order.createdAt).toLocaleString('default', { month: 'short' })}</p>
                        <p className="text-xl font-black text-base-content leading-tight">{new Date(order.createdAt).getDate()}</p>
                      </div>
                      <div>
                        <p className="text-lg font-black text-base-content tracking-tight mb-0.5">Order #{order._id.slice(-6).toUpperCase()}</p>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                            order.deliveryStatus === 'delivered' ? "bg-emerald-500/10 text-emerald-500" :
                            order.deliveryStatus === 'pending' ? "bg-orange-500/10 text-orange-500" :
                            "bg-primary/10 text-primary"
                          }`}>{order.deliveryStatus.replace('_', ' ')}</span>
                          <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-tighter">Amount: ₹{order.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                    <Link href="/farmer/orders" className="w-12 h-12 rounded-xl bg-base-200 flex items-center justify-center text-base-content/40 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                      <IconChevronRight size={20} />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Links Summary */}
        <div className="space-y-8">
          <Link href="/farmer/orders" className="block bg-primary rounded-[2.5rem] p-10 text-white shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-125 transition-transform duration-700">
               <IconShoppingCart size={100} strokeWidth={1} />
            </div>
            <div className="relative z-10">
              <h4 className="text-2xl font-black tracking-tighter mb-1">Check Orders</h4>
              <p className="text-[11px] font-black text-primary-content/80 uppercase tracking-widest mb-6">See who is buying</p>
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md text-[10px] font-black uppercase tracking-widest">
                Go Now <IconChevronRight size={14} />
              </div>
            </div>
          </Link>

          <Link href="/farmer/inventory-logs" className="block bg-secondary rounded-[2.5rem] p-10 text-white shadow-xl shadow-secondary/20 hover:scale-[1.02] transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-125 transition-transform duration-700">
               <IconHistory size={100} strokeWidth={1} />
            </div>
            <div className="relative z-10">
              <h4 className="text-2xl font-black tracking-tighter mb-1">Stock History</h4>
              <p className="text-[11px] font-black text-secondary-content/80 uppercase tracking-widest mb-6">View seed & crop logs</p>
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md text-[10px] font-black uppercase tracking-widest">
                Check History <IconChevronRight size={14} />
              </div>
            </div>
          </Link>

          <div className="bg-base-100 border border-base-300 rounded-[2.5rem] p-10 text-center">
            <div className="w-16 h-16 bg-base-200 rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6">
              <IconLeaf className="text-emerald-500" size={32} strokeWidth={2.5} />
            </div>
            <h4 className="text-xl font-black text-base-content tracking-tight mb-2">My Growth</h4>
            <p className="text-[10px] font-bold text-base-content/60 uppercase tracking-widest leading-relaxed">Your farm data is safely stored on the blockchain.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FarmerDashboard;
