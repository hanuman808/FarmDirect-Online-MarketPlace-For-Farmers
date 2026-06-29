"use client";

import { useAuth } from "@/context/AuthProvider";
import axios from "axios";
import { 
  IconMessage2, 
  IconCheck, 
  IconX, 
  IconClock, 
  IconShoppingCart, 
  IconArrowRight, 
  IconTag 
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

const UserNegotiationsPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [negotiations, setNegotiations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNegotiations = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/negotiations");
      if (res.data.success) {
        setNegotiations(res.data.negotiations);
      }
    } catch (err) {
      console.error("Fetch negotiations error:", err);
      toast.error("Failed to load negotiations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNegotiations();
  }, []);

  const handleUpdateStatus = async (id: string, status: "accepted" | "declined") => {
    try {
      const res = await axios.patch(`/api/negotiations/${id}`, { status });
      if (res.data.success) {
        toast.success(res.data.message || `Offer ${status}`);
        fetchNegotiations();
      }
    } catch (err: any) {
      console.error("Update negotiation error:", err);
      toast.error(err.response?.data?.message || "Failed to update offer");
    }
  };

  const handleAddToCart = (neg: any) => {
    const agreedPrice = neg.counterPrice || neg.offeredPrice;
    const cartItem = {
      productId: {
        _id: neg.productId._id,
        name: neg.productId.name,
        price: neg.productId.price, // original price reference
        imageUrl: neg.productId.imageUrl,
        stock: neg.productId.stock
      },
      quantity: neg.quantity,
      negotiationId: neg._id,
      negotiatedPrice: agreedPrice
    };

    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      let cartList = savedCart ? JSON.parse(savedCart) : [];
      // Remove any existing entry for this product to prevent price mismatch conflicts
      cartList = cartList.filter((item: any) => item.productId._id !== neg.productId._id);
      cartList.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(cartList));
      
      toast.success("Bargain rate items added to basket!");
      router.push("/user/cart");
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-10 py-10 space-y-12 animate-in fade-in duration-700">
      
      {/* Page Header */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <IconMessage2 size={200} className="rotate-[-10deg]" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Bargaining Dashboard</p>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-gray-900 leading-none">Bargains & Offers</h1>
          <p className="text-sm font-bold text-gray-400 mt-4 lowercase">Review counter-offers and add accepted negotiations directly to cart.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="loading loading-spinner loading-lg text-emerald-600"></div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-4">Retrieving active negotiations...</p>
        </div>
      ) : negotiations.length === 0 ? (
        <div className="min-h-[40vh] bg-white rounded-[2.5rem] border border-gray-100 flex flex-col items-center justify-center p-10 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mb-6 border border-gray-100">
            <IconTag size={36} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2">No Active Bargains</h3>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">You haven't initiated any price negotiations yet</p>
          <Link href="/user/browse" className="btn btn-primary h-14 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2">
            Explore Marketplace <IconArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {negotiations.map((neg) => {
            const product = neg.productId || {};
            const isFarmer = neg.farmerId || {};
            
            return (
              <div 
                key={neg._id} 
                className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    <img 
                      src={product.imageUrl || "/placeholder.jpg"} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600">
                      Farmer: {isFarmer.name || "Unknown"}
                    </span>
                    <h3 className="text-lg font-black text-gray-900 tracking-tight leading-tight pt-1">
                      {product.name || "Deleted Product"}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400">
                      Quantity Requested: {neg.quantity} {product.unit || "units"}
                    </p>
                  </div>
                </div>

                {/* Price Comparisons */}
                <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-50 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-1">Store Rate</p>
                    <p className="text-base font-black text-gray-500 line-through">₹{neg.originalPrice}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-1">Your Offer</p>
                    <p className="text-base font-black text-emerald-600">₹{neg.offeredPrice}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-1">Farmer Counter</p>
                    <p className="text-base font-black text-purple-600">
                      {neg.counterPrice ? `₹${neg.counterPrice}` : "-"}
                    </p>
                  </div>
                </div>

                {/* Status and Action Buttons */}
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
                  {/* Status Badge */}
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Deal Status</p>
                    {neg.status === "pending" && (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-500 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                        <IconClock size={12} /> Pending
                      </span>
                    )}
                    {neg.status === "accepted" && (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                        <IconCheck size={12} strokeWidth={3} /> Accepted
                      </span>
                    )}
                    {neg.status === "countered" && (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
                        <IconTag size={12} /> Counter Offered
                      </span>
                    )}
                    {neg.status === "declined" && (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                        <IconX size={12} strokeWidth={3} /> Declined
                      </span>
                    )}
                    {neg.status === "purchased" && (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <IconShoppingCart size={12} /> Purchased
                      </span>
                    )}
                  </div>

                  {/* Context Actions */}
                  <div className="flex gap-2">
                    {neg.status === "countered" && (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(neg._id, "accepted")}
                          className="btn btn-sm h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase text-[9px] tracking-widest border-none"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(neg._id, "declined")}
                          className="btn btn-sm h-10 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl font-bold uppercase text-[9px] tracking-widest"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {neg.status === "accepted" && (
                      <button 
                        onClick={() => handleAddToCart(neg)}
                        className="btn btn-sm h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase text-[9px] tracking-widest border-none flex items-center gap-2"
                      >
                        <IconShoppingCart size={14} /> Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserNegotiationsPage;
