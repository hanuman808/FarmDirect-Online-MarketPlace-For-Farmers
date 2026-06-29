"use client";

import { useAuth } from "@/context/AuthProvider";
import { 
  IconPackage, 
  IconUser, 
  IconMapPin, 
  IconPhone, 
  IconMail, 
  IconClock, 
  IconLeaf,
  IconChevronRight,
  IconArrowRight,
  IconCurrencyRupee,
  IconShoppingCart
} from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    contact: string;
    address: {
      address: string;
      district: string;
      state: string;
      pincode: string;
    };
  };
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
  paymentStatus: string;
  createdAt: string;
  deliveryPartner?: {
    name: string;
    vehicleType: string;
    contact: string;
  };
}

const FarmerOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/orders?role=farmer");
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error("Orders fetch error:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 space-y-12 animate-in fade-in duration-700">
      
      {/* Header section */}
      <div className="bg-base-100 p-10 rounded-[2.5rem] border border-base-300 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <IconShoppingCart size={200} className="rotate-[-10deg]" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Sales Dashboard</p>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-base-content leading-none mb-4">Customer Orders</h1>
          <p className="text-sm font-bold text-base-content/60 max-w-lg lowercase">Check who is buying your products and manage their shipments here.</p>
        </div>
        <div className="relative z-10 flex gap-4">
          <div className="bg-emerald-500/10 px-6 py-4 rounded-3xl border border-emerald-500/20 flex items-center gap-3">
            <IconPackage className="text-emerald-500" size={24} />
            <div>
              <p className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest leading-none">Total Sales</p>
              <p className="text-xl font-black text-base-content mt-1">{orders.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="loading loading-ring loading-lg text-emerald-500"></div>
          <p className="font-black text-base-content/30 uppercase tracking-widest text-xs">Checking system for orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-32 bg-base-200 rounded-[3rem] border-2 border-dashed border-base-300 flex flex-col items-center">
          <div className="w-24 h-24 bg-base-100 rounded-3xl shadow-sm flex items-center justify-center text-base-content/20 mb-6">
            <IconPackage size={48} />
          </div>
          <p className="text-2xl font-black text-base-content tracking-tight mb-2">No Orders Yet</p>
          <p className="text-xs font-black text-base-content/40 uppercase tracking-widest mt-2 max-w-sm">
            Once people start buying your products, they will show up here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10">
          {orders.map((order) => (
            <div
              key={order._id}
              className="group bg-base-100 rounded-[2.5rem] border border-base-200 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 overflow-hidden"
            >
              <div className="p-8 md:p-12 flex flex-col space-y-10">
                
                {/* Status Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-base-200">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-base-content/40">Order ID</p>
                    <p className="text-3xl font-black text-base-content tracking-tighter">#{order._id.slice(-6).toUpperCase()}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <IconClock size={12} className="text-base-content/30" />
                       <span className="text-[10px] font-bold text-base-content/40 uppercase">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                      order.deliveryStatus === "delivered" ? "bg-emerald-500/10 text-emerald-500" :
                      order.deliveryStatus === "pending" ? "bg-orange-500/10 text-orange-500" :
                      "bg-primary/10 text-primary"
                    }`}>
                      {order.deliveryStatus.replace('_', ' ')}
                    </div>
                    <div className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                      order.paymentStatus === "completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    }`}>
                      Payment {order.paymentStatus}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  
                  {/* Customer Info & Live Tracker */}
                  <div className="bg-base-200/50 rounded-[2rem] p-8 space-y-8 border border-base-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-base-100 rounded-xl shadow-sm flex items-center justify-center text-primary">
                         <IconUser size={20} strokeWidth={2.5} />
                      </div>
                      <h4 className="text-sm font-black text-base-content uppercase tracking-widest">Buyer & Transit Details</h4>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-base-100 flex items-center justify-center text-base-content/30">
                          <IconUser size={16} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-base-content/40 uppercase tracking-widest mb-0.5">Full Name</p>
                          <p className="text-base font-black text-base-content">{order.userId.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-base-100 flex items-center justify-center text-base-content/30">
                          <IconPhone size={16} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-base-content/40 uppercase tracking-widest mb-0.5">Contact</p>
                          <p className="text-base font-black text-base-content">{order.userId.contact}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 pb-6 border-b border-base-300">
                        <div className="w-8 h-8 rounded-lg bg-base-100 flex items-center justify-center text-base-content/30">
                          <IconMapPin size={16} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-base-content/40 uppercase tracking-widest mb-0.5">Address</p>
                          <p className="text-sm font-bold text-base-content/80 leading-relaxed">
                            {order.userId.address ? (
                              <>
                                {order.userId.address.address}, {order.userId.address.district}
                                <br />
                                {order.userId.address.state} - {order.userId.address.pincode}
                              </>
                            ) : "Not shared"}
                          </p>
                        </div>
                      </div>
                      
                      {/* Delivery boy info */}
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-3 block">Logistics Partner</p>
                        {order.deliveryPartner ? (
                          <div className="bg-base-100 p-4 rounded-2xl border border-base-200 shadow-sm space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-black text-base-content">{order.deliveryPartner.name}</span>
                              <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-lg capitalize border border-emerald-500/20">{order.deliveryPartner.vehicleType}</span>
                            </div>
                            <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider flex items-center gap-1.5"><IconPhone size={10} /> Call: {order.deliveryPartner.contact}</p>
                          </div>
                        ) : (
                          <p className="text-xs font-bold text-base-content/40 uppercase tracking-wider bg-base-100 p-4 rounded-2xl border border-base-200">Waiting for delivery assignment...</p>
                        )}
                      </div>

                      {/* Visual tracking timeline stepper */}
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-4 block">Real-time Order Tracker</p>
                        <div className="relative pl-6 border-l-2 border-base-300 ml-3 space-y-6">
                          {[
                            { step: "placed", title: "Order Placed", desc: "Customer placed the order.", active: true },
                            { step: "prepared", title: "Prepared for Pickup", desc: "Farmer marked crop ready.", active: ["ready_for_pickup", "picked", "in_transit", "delivered"].includes(order.deliveryStatus) },
                            { step: "transit", title: "In Transit", desc: "Delivery boy is on the move.", active: ["picked", "in_transit", "delivered"].includes(order.deliveryStatus) },
                            { step: "delivered", title: "Delivered", desc: "Food safely reached table.", active: order.deliveryStatus === "delivered" }
                          ].map((milestone, idx) => (
                            <div key={idx} className="relative">
                              <div className={`absolute -left-[31px] top-0 w-[14px] h-[14px] rounded-full border-4 border-base-100 shadow-sm flex items-center justify-center ${
                                milestone.active ? "bg-emerald-500" : "bg-base-300"
                              }`}></div>
                              <div>
                                <h5 className={`text-xs font-black leading-none ${milestone.active ? "text-base-content" : "text-base-content/40"}`}>{milestone.title}</h5>
                                <p className="text-[9px] font-bold text-base-content/40 mt-1">{milestone.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Live GPS Route Tracker Map (Vector) */}
                      {["ready_for_pickup", "picked", "in_transit"].includes(order.deliveryStatus) && (
                        <div className="bg-base-100 p-5 rounded-2xl border border-base-200 shadow-sm mt-6 space-y-4 animate-in fade-in zoom-in-95 duration-500">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-base-content/40">Live GPS Radar</span>
                            <span className="flex items-center gap-1.5 text-[9px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 uppercase tracking-wider animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span> Live Tracking
                            </span>
                          </div>
                          
                          {/* Animated vector map */}
                          <div className="h-32 bg-slate-950 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-800">
                            {/* Grid backdrop */}
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]"></div>
                            
                            <svg className="w-full h-full px-6" viewBox="0 0 200 100">
                              {/* Path */}
                              <path d="M 20 50 Q 100 20 180 50" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                              
                              {/* Farmer node */}
                              <circle cx="20" cy="50" r="5" fill="#10b981" />
                              <circle cx="20" cy="50" r="10" fill="none" stroke="#10b981" strokeWidth="1" className="animate-ping" />
                              
                              {/* Customer node */}
                              <circle cx="180" cy="50" r="5" fill="#f59e0b" />
                            </svg>
                            
                            {/* Moving Delivery Icon */}
                            <div className="absolute left-[20%] top-[40%] bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-base-100 animate-bounce text-xs">
                              🚚
                            </div>
                            
                            {/* Live coordinates display */}
                            <div className="absolute bottom-2 left-3 right-3 bg-base-300/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-base-content/10 flex justify-between text-[8px] font-mono text-base-content/60">
                              <span>Lat: 18.5204° N</span>
                              <span>Lng: 73.8567° E</span>
                              <span className="text-emerald-500 font-bold">Speed: 42 km/h</span>
                            </div>
                          </div>
                          
                          <div className="bg-base-200 p-4 rounded-xl border border-base-300 text-center">
                            <p className="text-[9px] font-black text-base-content/40 uppercase tracking-wider leading-none">Status</p>
                            <p className="text-xs font-bold text-base-content/85 mt-2 capitalize">Logistics partner is dispatched and moving to customer hub.</p>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Product List */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em] ml-2">Items people bought</h4>
                    <div className="space-y-4">
                      {order.products.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-6 p-4 rounded-3xl bg-base-100 border border-base-200 group/item hover:border-primary/20 transition-all">
                          <div className="w-16 h-16 bg-base-200 rounded-2xl overflow-hidden group-hover/item:scale-105 transition-transform">
                             <img src={item.product.imageUrl || "/placeholder.jpg"} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="flex-1">
                             <p className="text-base font-black text-base-content mb-0.5 tracking-tight">{item.product.name}</p>
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-emerald-500 uppercase">Qty: {item.quantity}</span>
                                <span className="text-base-content/20">|</span>
                                <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-tighter">₹{item.product.price} / unit</span>
                             </div>
                          </div>
                          <p className="text-lg font-black text-base-content tracking-tighter">₹{item.product.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-base-200 flex items-center justify-between">
                       <div>
                          <p className="text-[10px] font-black text-base-content/30 uppercase tracking-widest">Grand Total</p>
                          <h4 className="text-5xl font-black text-primary tracking-tighter">₹{order.totalPrice}</h4>
                       </div>
                       
                       {order.deliveryStatus === "pending" && (
                         <button 
                           onClick={async () => {
                             try {
                               await axios.patch("/api/orders", {
                                 orderId: order._id,
                                 deliveryStatus: "ready_for_pickup",
                               });
                               toast.success("Ready for Pickup!");
                               fetchOrders();
                             } catch (error) {
                               toast.error("Failed update");
                             }
                           }}
                           className="btn btn-primary h-16 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/30 flex items-center gap-3 transition-all hover:scale-[1.05]"
                         >
                           Prepare for Pickup <IconArrowRight size={18} />
                         </button>
                       )}

                       {order.deliveryStatus === "ready_for_pickup" && (
                         <div className="flex items-center gap-3 bg-primary/10 text-primary px-6 py-4 rounded-2xl border border-primary/20 animate-in slide-in-from-right duration-500">
                           <IconClock className="animate-pulse" size={20} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Pickup Pending</span>
                         </div>
                       )}
                    </div>
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

export default FarmerOrdersPage;
