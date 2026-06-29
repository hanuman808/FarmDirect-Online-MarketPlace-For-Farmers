"use client";

import { useAuth } from "@/context/AuthProvider";
import axios from "axios";
import { 
  IconMessage2, 
  IconCheck, 
  IconX, 
  IconClock, 
  IconArrowRight, 
  IconTag, 
  IconUser, 
  IconPhone, 
  IconSend 
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

const FarmerNegotiationsPage = () => {
  const { user } = useAuth();
  const [negotiations, setNegotiations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Counter Offer States
  const [activeCounterId, setActiveCounterId] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(0);
  const [submittingCounter, setSubmittingCounter] = useState(false);

  const fetchNegotiations = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/negotiations");
      if (res.data.success) {
        setNegotiations(res.data.negotiations);
      }
    } catch (err) {
      console.error("Fetch negotiations error:", err);
      toast.error("Failed to load bargains");
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
      console.error("Update status error:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleSendCounter = async (id: string) => {
    if (counterPrice <= 0) {
      toast.error("Please enter a valid counter price");
      return;
    }
    
    try {
      setSubmittingCounter(true);
      const res = await axios.patch(`/api/negotiations/${id}`, { 
        status: "countered",
        counterPrice 
      });
      if (res.data.success) {
        toast.success("Counter-offer sent to the buyer!");
        setActiveCounterId(null);
        setCounterPrice(0);
        fetchNegotiations();
      }
    } catch (err: any) {
      console.error("Counter offer error:", err);
      toast.error(err.response?.data?.message || "Failed to submit counter offer");
    } finally {
      setSubmittingCounter(false);
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
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Farmer Operations</p>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-gray-900 leading-none">Incoming Bargains</h1>
          <p className="text-sm font-bold text-gray-400 mt-4 lowercase">Review incoming buyer counter-offers, accept details, or respond with counter rates.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="loading loading-spinner loading-lg text-emerald-600"></div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-4">Retrieving incoming offers...</p>
        </div>
      ) : negotiations.length === 0 ? (
        <div className="min-h-[40vh] bg-white rounded-[2.5rem] border border-gray-100 flex flex-col items-center justify-center p-10 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mb-6 border border-gray-100">
            <IconTag size={36} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2">No Bargains Yet</h3>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Buyers have not sent any price counter-offers yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {negotiations.map((neg) => {
            const product = neg.productId || {};
            const buyer = neg.buyerId || {};
            
            return (
              <div 
                key={neg._id} 
                className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
              >
                <div className="flex gap-6">
                  {/* Product Thumbnail */}
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    <img 
                      src={product.imageUrl || "/placeholder.jpg"} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Offer Info */}
                  <div className="space-y-1">
                    <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-purple-50 text-purple-600">
                      Buyer: {buyer.name || "Unknown"}
                    </span>
                    <h3 className="text-lg font-black text-gray-900 tracking-tight leading-tight pt-1">
                      {product.name || "Deleted Product"}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400">
                      Quantity: {neg.quantity} {product.unit || "units"}
                    </p>
                  </div>
                </div>

                {/* Contact Info (if accepted or pending) */}
                <div className="border-t border-b border-gray-50 py-4 space-y-2 text-xs font-bold text-gray-500">
                  <div className="flex items-center gap-2">
                    <IconUser size={14} className="text-emerald-500" />
                    <span>Email: {buyer.email || "No email"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconPhone size={14} className="text-emerald-500" />
                    <span>Contact: {buyer.contact || "No contact"}</span>
                  </div>
                </div>

                {/* Price Matrix */}
                <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-50 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-1">Your Store Rate</p>
                    <p className="text-base font-black text-gray-400 line-through">₹{neg.originalPrice}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-1">Buyer Offered</p>
                    <p className="text-base font-black text-purple-600">₹{neg.offeredPrice}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-1">Active Counter</p>
                    <p className="text-base font-black text-emerald-600">
                      {neg.counterPrice ? `₹${neg.counterPrice}` : "-"}
                    </p>
                  </div>
                </div>

                {/* Counter Input Row */}
                {activeCounterId === neg._id && (
                  <div className="flex items-center gap-3 bg-purple-50/50 p-3 rounded-2xl border border-purple-100">
                    <input 
                      type="number" 
                      placeholder="Counter Price (₹)"
                      className="input input-sm h-11 w-full bg-white border-none rounded-xl px-4 text-xs font-bold text-gray-800"
                      value={counterPrice || ""}
                      onChange={(e) => setCounterPrice(parseFloat(e.target.value) || 0)}
                    />
                    <button 
                      onClick={() => handleSendCounter(neg._id)}
                      disabled={submittingCounter}
                      className="btn btn-sm h-11 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl border-none flex items-center justify-center gap-1.5"
                    >
                      <IconSend size={14} />
                    </button>
                  </div>
                )}

                {/* Status and Action Panel */}
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
                  {/* Status Badge */}
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Status</p>
                    {neg.status === "pending" && (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-500 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                        <IconClock size={12} /> Pending Response
                      </span>
                    )}
                    {neg.status === "accepted" && (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                        <IconCheck size={12} strokeWidth={3} /> Deal Accepted
                      </span>
                    )}
                    {neg.status === "countered" && (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
                        <IconTag size={12} /> Countered by You
                      </span>
                    )}
                    {neg.status === "declined" && (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                        <IconX size={12} strokeWidth={3} /> Declined
                      </span>
                    )}
                    {neg.status === "purchased" && (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        Deal Purchased
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {(neg.status === "pending" || neg.status === "countered") && (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(neg._id, "accepted")}
                          className="btn btn-sm h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase text-[9px] tracking-widest border-none"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => {
                            if (activeCounterId === neg._id) {
                              setActiveCounterId(null);
                            } else {
                              setActiveCounterId(neg._id);
                              setCounterPrice(Math.round((neg.originalPrice + neg.offeredPrice) / 2));
                            }
                          }}
                          className="btn btn-sm h-10 px-4 bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-100 rounded-xl font-bold uppercase text-[9px] tracking-widest"
                        >
                          {activeCounterId === neg._id ? "Cancel" : "Counter"}
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(neg._id, "declined")}
                          className="btn btn-sm h-10 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl font-bold uppercase text-[9px] tracking-widest"
                        >
                          Decline
                        </button>
                      </>
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

export default FarmerNegotiationsPage;
