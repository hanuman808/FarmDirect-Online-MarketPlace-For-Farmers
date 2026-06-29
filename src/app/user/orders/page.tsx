"use client";

import { useAuth } from "@/context/AuthProvider";
import axios from "axios";
import { 
  IconClock, 
  IconPackage, 
  IconArrowRight, 
  IconShoppingBag, 
  IconTruckDelivery, 
  IconCreditCard, 
  IconStar,
  IconDownload,
  IconMessage2
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const UserOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [sellerFeedback, setSellerFeedback] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/orders?role=user");
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDownloadInvoice = (order: any) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const itemsHtml = order.products.map((item: any) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">${item.product?.name || "Product"}</td>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: right;">₹${item.product?.price || 0}</td>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: bold;">₹${(item.product?.price || 0) * item.quantity}</td>
      </tr>
    `).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - Order #${order._id.slice(-6).toUpperCase()}</title>
          <style>
            body { font-family: sans-serif; color: #1e293b; padding: 40px; margin: 0; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: 900; color: #10b981; text-transform: uppercase; letter-spacing: -0.5px; }
            .title { font-size: 28px; font-weight: 900; text-align: right; letter-spacing: -1px; }
            .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .details div { width: 48%; }
            .details h3 { font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { background: #f8fafc; padding: 12px; font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; text-align: left; }
            .footer { border-top: 2px solid #e2e8f0; padding-top: 20px; display: flex; justify-content: space-between; align-items: center; }
            .total { font-size: 32px; font-weight: 900; color: #10b981; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">AGRIFOOD STORE</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px; font-weight: bold;">Verified Direct Supply Chain Node</div>
            </div>
            <div>
              <div class="title">INVOICE</div>
              <div style="font-size: 12px; color: #64748b; text-align: right; margin-top: 4px; font-weight: bold;">Order ID: #${order._id.toUpperCase()}</div>
            </div>
          </div>
          
          <div class="details">
            <div>
              <h3>Billed To</h3>
              <div style="font-size: 14px; font-weight: bold;">${order.deliveryAddress?.name || order.userId?.name || "Customer"}</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px; line-height: 1.5; font-weight: bold;">
                ${order.deliveryAddress?.address || order.userId?.address?.address || "Address Detail"}<br/>
                ${order.deliveryAddress?.district || order.userId?.address?.district || "District"}, ${order.deliveryAddress?.state || order.userId?.address?.state || "State"} - ${order.deliveryAddress?.pincode || order.userId?.address?.pincode || "Pincode"}<br/>
                Phone: ${order.deliveryAddress?.phone || order.userId?.contact || "No phone"}
              </div>
            </div>
            <div style="text-align: right;">
              <h3>Transaction Summary</h3>
              <div style="font-size: 12px; color: #64748b; line-height: 1.5; font-weight: bold;">
                Date: ${new Date(order.createdAt).toLocaleDateString()}<br/>
                Payment Method: <span style="text-transform: uppercase; font-weight: bold; color: #3b82f6;">${order.paymentMethod}</span><br/>
                Payment Status: <span style="text-transform: uppercase; font-weight: bold; color: #10b981;">${order.paymentStatus}</span>
              </div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th style="width: 50%;">Produce Item</th>
                <th style="width: 15%; text-align: center;">Qty</th>
                <th style="width: 15%; text-align: right;">Rate</th>
                <th style="width: 20%; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div class="footer">
            <div>
              <div style="font-size: 11px; color: #94a3b8; font-weight: 900; text-transform: uppercase; tracking-wider: 1px;">Cryptographic Seal</div>
              <div style="font-size: 10px; color: #cbd5e1; margin-top: 4px; font-family: monospace;">BLOCKCHAIN_VERIFIED_TX_OK</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Grand Total</div>
              <div class="total">₹${order.totalPrice}</div>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleOpenReviewModal = (product: any) => {
    setSelectedProduct(product);
    setRating(5);
    setComment("");
    setSellerFeedback("");
  };

  const handleSubmitReview = async () => {
    if (!comment) {
      toast.error("Please fill in your review comment");
      return;
    }
    try {
      setSubmittingReview(true);
      const res = await axios.post("/api/products/reviews", {
        productId: selectedProduct._id,
        rating,
        comment,
        sellerFeedback,
      });

      if (res.data.success) {
        toast.success("Review submitted! Thank you!");
        setSelectedProduct(null);
      }
    } catch (error) {
      toast.error("Failed to post review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 space-y-12 animate-in fade-in duration-700">
      
      {/* Page Header */}
      <div className="bg-base-100 p-10 rounded-[2.5rem] border border-base-300 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <IconShoppingBag size={200} className="rotate-[-10deg]" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-1 bg-primary rounded-full"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Purchase Records</p>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-base-content leading-none">Order History</h1>
          <p className="text-sm font-bold text-base-content/40 mt-4 lowercase max-w-sm">Track every product you have ever bought from our farm marketplace.</p>
        </div>
        <div className="relative z-10">
           <Link href="/user/browse" className="btn btn-primary h-14 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/30 flex items-center gap-3 transition-all hover:scale-105">
              Shop More <IconArrowRight size={18} />
           </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="loading loading-ring loading-lg text-primary"></div>
          <p className="font-black text-base-content/30 uppercase tracking-widest text-xs">Accessing storage records...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-32 bg-base-200 rounded-[3rem] border-2 border-dashed border-base-300 flex flex-col items-center">
          <IconPackage size={80} className="text-base-content/20 mb-6" />
          <p className="text-2xl font-black text-base-content tracking-tight">No Purchases Found</p>
          <p className="text-xs font-black text-base-content/40 uppercase tracking-widest mt-4">Start shopping to fill your history.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {orders.map((order: any) => (
            <div
              key={order._id}
              className="bg-base-100 rounded-[3rem] border border-base-200 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group"
            >
              <div className="p-8 md:p-12 flex flex-col lg:flex-row gap-12">
                
                {/* Meta Section */}
                <div className="lg:w-1/4 space-y-8">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-2 leading-none">Order Tracking</h4>
                    <p className="text-2xl font-black text-base-content tracking-tighter tabular-nums">#{order._id.slice(-6).toUpperCase()}</p>
                    <div className="flex items-center gap-2 mt-3">
                       <IconClock size={12} className="text-base-content/30" />
                       <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-tight">{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                      order.paymentStatus === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                    }`}>
                      <IconCreditCard size={14} /> 
                      Payment {order.paymentStatus}
                    </div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                      order.deliveryStatus === 'delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-base-200 text-base-content/40 border-base-300'
                    }`}>
                      <IconTruckDelivery size={14} />
                      {order.deliveryStatus.replace('_', ' ')}
                    </div>
                  </div>

                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-2 leading-none">Total Payment</p>
                     <p className="text-5xl font-black text-primary tracking-tighter tabular-nums leading-none">₹{order.totalPrice}</p>
                  </div>
                </div>

                {/* Items Section */}
                <div className="flex-1 space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-4 pb-2 border-b border-base-200">Produce Items</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {order.products.map((item: any) => (
                      <div key={item.product?._id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-base-200/50 rounded-2xl border border-base-200 hover:bg-base-100 hover:border-primary/30 transition-all group/item gap-4">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-base-100 rounded-2xl overflow-hidden border border-base-200 shadow-sm group-hover/item:scale-105 transition-transform">
                            <img src={item.product?.imageUrl || '/placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-lg font-black text-base-content tracking-tight leading-none mb-1.5">{item.product?.name}</p>
                            <div className="flex items-center gap-3">
                               <p className="text-[10px] font-black text-primary uppercase tracking-widest">Quantity: {item.quantity}</p>
                               <span className="text-gray-200">|</span>
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">₹{item.product?.price} / unit</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 self-end md:self-auto">
                          <p className="text-2xl font-black text-base-content tracking-tighter">₹{item.product?.price * item.quantity}</p>
                          {order.deliveryStatus === "delivered" && (
                            <button 
                              onClick={() => handleOpenReviewModal(item.product)}
                              className="btn btn-outline hover:bg-amber-500 hover:text-white border-amber-500 text-amber-500 h-10 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5"
                            >
                              <IconMessage2 size={12} /> Rate & Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logistics Source */}
                <div className="lg:w-1/4 lg:border-l border-base-200 lg:pl-10 space-y-8">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-base-content/40 mt-2 mb-6">Producer Info</h4>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-neutral rounded-2xl flex items-center justify-center text-neutral-content font-black text-xl shadow-sm">
                        {order.farmerId?.name?.[0]?.toUpperCase() || "F"}
                      </div>
                      <div>
                        <p className="text-lg font-black text-base-content tracking-tight leading-none mb-1.5">{order.farmerId?.name}</p>
                        <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Verified Farmer</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-base-200 p-6 rounded-[2rem] border border-base-300 space-y-4">
                     <p className="text-[9px] font-bold text-base-content/40 uppercase leading-relaxed text-center">Need any assistance regarding this order?</p>
                     
                     <button 
                       onClick={() => handleDownloadInvoice(order)}
                       className="btn btn-primary btn-block h-12 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md flex items-center justify-center gap-2"
                     >
                       <IconDownload size={14} /> Download Invoice
                     </button>
                     
                     <button className="btn btn-outline btn-block h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 hover:bg-slate-900 hover:text-white transition-all">
                       Support Desk
                     </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Star Ratings & Review Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 border border-slate-100 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300 relative">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 hover:bg-slate-200 transition-colors"
            >
              ✕
            </button>

            <div>
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-2">Verified Feedback</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Review product</h3>
              <p className="text-sm font-bold text-slate-400 mt-2">Rate your purchase of <span className="text-slate-800 capitalize">"{selectedProduct.name}"</span>.</p>
            </div>

            <div className="space-y-6">
              {/* Star selector */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Star Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => setRating(star)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        rating >= star ? "bg-amber-500 text-white shadow-md shadow-amber-500/20" : "bg-slate-50 text-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      <IconStar size={24} fill={rating >= star ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment input */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Product Review</label>
                <textarea
                  className="textarea w-full rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-amber-100 transition-all font-bold text-gray-800 placeholder:text-gray-300 p-5 min-h-[100px]"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product's quality, freshness, and packaging..."
                />
              </div>

              {/* Seller Feedback */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Feedback for Farmer (Optional)</label>
                <input
                  type="text"
                  className="input h-14 w-full rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-amber-100 transition-all font-bold text-gray-800 placeholder:text-gray-300 px-5"
                  value={sellerFeedback}
                  onChange={(e) => setSellerFeedback(e.target.value)}
                  placeholder="e.g. Prompt dispatch, helpful messaging..."
                />
              </div>

              <button
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="btn bg-amber-500 hover:bg-amber-600 border-none text-white btn-block h-16 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                {submittingReview ? (
                  <>Submitting <span className="loading loading-spinner loading-xs"></span></>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrdersPage;
