"use client";

import { useAuth } from "@/context/AuthProvider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { IconMapPin, IconUser, IconPhone, IconCreditCard, IconCash, IconArrowRight, IconShieldCheck, IconShoppingBag } from "@tabler/icons-react";

declare global {
    interface Window {
        Razorpay: any;
    }
}

const CheckoutPage = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [cart, setCart] = useState<any[]>(() => {
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem("cart");
            return savedCart ? JSON.parse(savedCart) : [];
        }
        return [];
    });
    const [loading, setLoading] = useState(false);

    const [deliveryAddress, setDeliveryAddress] = useState({
        name: user?.name || "",
        phone: "",
        address: "",
        district: "",
        state: "",
        pincode: "",
    });

    const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");

    const getTotal = () => {
        return cart.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
    };

    const handlePlaceOrder = async () => {
        if (!deliveryAddress.name || !deliveryAddress.phone || !deliveryAddress.address ||
            !deliveryAddress.district || !deliveryAddress.state || !deliveryAddress.pincode) {
            toast.error("Complete your address first");
            return;
        }

        if (cart.length === 0) {
            toast.error("Basket is empty");
            return;
        }

        setLoading(true);

        try {
            if (paymentMethod === "cod") {
                const res = await axios.post("/api/orders/cod", {
                    cart,
                    deliveryAddress,
                });

                if (res.data.success) {
                    toast.success("Order successful!");
                    localStorage.removeItem("cart");
                    router.push("/user/orders");
                }
            } else {
                if (typeof window === 'undefined' || !(window as any).Razorpay) {
                    const script = document.createElement('script');
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    script.async = true;
                    await new Promise((resolve) => {
                        script.onload = resolve;
                        document.body.appendChild(script);
                    });
                }

                const orderRes = await axios.post("/api/payment/create-order", {
                    cart,
                });

                const { orderId, amount } = orderRes.data;

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount,
                    currency: "INR",
                    name: "Farm Fresh Store",
                    description: "Produce Order Payment",
                    order_id: orderId,
                    handler: async function (response: any) {
                        try {
                            const verifyRes = await axios.post("/api/payment/verify", {
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                                cart,
                                deliveryAddress,
                            });

                            if (verifyRes.data.success) {
                                toast.success("Payment Received!");
                                localStorage.removeItem("cart");
                                router.push("/user/orders");
                            }
                        } catch (error: any) {
                            console.error("Verification error:", error);
                            toast.error("Failed verification");
                        }
                    },
                    prefill: {
                        name: deliveryAddress.name,
                        email: user?.email || "",
                        contact: deliveryAddress.phone,
                    },
                    theme: {
                        color: "#10b981",
                    },
                };

                const razorpay = new (window as any).Razorpay(options);
                razorpay.open();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Internal error");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 space-y-12 animate-in fade-in duration-700">
            
            {/* Page Header */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <IconShieldCheck size={200} className="rotate-[-10deg]" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Final Step</p>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-gray-900 leading-none">Order Confirmation</h1>
                    <p className="text-sm font-bold text-gray-400 mt-4 lowercase">Provide your shipping details and select a payment method.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Side: Forms */}
                <div className="lg:col-span-2 space-y-10">
                    
                    {/* Shipping Form */}
                    <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-10">
                        <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                <IconMapPin size={24} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Delivery Address</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block ml-2">Receiver Full Name</label>
                                <input
                                    type="text"
                                    className="input h-16 w-full rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                                    value={deliveryAddress.name}
                                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, name: e.target.value })}
                                    placeholder="e.g. Rahul Sharma"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block ml-2">Contact Number</label>
                                <input
                                    type="tel"
                                    className="input h-16 w-full rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                                    value={deliveryAddress.phone}
                                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })}
                                    placeholder="Enter active phone number"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block ml-2">House & Street Address</label>
                                <textarea
                                    className="textarea w-full rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-gray-800 placeholder:text-gray-300 p-6 min-h-[120px]"
                                    value={deliveryAddress.address}
                                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, address: e.target.value })}
                                    placeholder="Door no, Area, Landmark"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block ml-2">City / District</label>
                                <input
                                    type="text"
                                    className="input h-16 w-full rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                                    value={deliveryAddress.district}
                                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, district: e.target.value })}
                                    placeholder="City Name"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block ml-2">State</label>
                                <input
                                    type="text"
                                    className="input h-16 w-full rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                                    value={deliveryAddress.state}
                                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                                    placeholder="Enter State"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block ml-2">Postal Pincode</label>
                                <input
                                    type="text"
                                    className="input h-16 w-full rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                                    value={deliveryAddress.pincode}
                                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })}
                                    placeholder="6 digit Pincode"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Selector */}
                    <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center">
                                <IconCreditCard size={20} />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Payment Option</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { id: "online", title: "Online Transfer", desc: "Cards, UPI or Netbanking", icon: IconCreditCard },
                                { id: "cod", title: "Handover Cash", desc: "Pay when food arrives", icon: IconCash }
                            ].map((method) => (
                                <label 
                                  key={method.id} 
                                  className={`relative flex items-center gap-6 p-8 rounded-[2rem] border-2 cursor-pointer transition-all ${
                                    paymentMethod === method.id ? "border-emerald-500 bg-emerald-50/30" : "border-gray-50 bg-gray-50/30 grayscale hover:grayscale-0 hover:border-gray-100"
                                  }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        className="hidden"
                                        checked={paymentMethod === method.id}
                                        onChange={() => setPaymentMethod(method.id as any)}
                                    />
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${paymentMethod === method.id ? "bg-emerald-500 text-white" : "bg-white text-gray-300"}`}>
                                        <method.icon size={28} />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 leading-none">{method.title}</p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">{method.desc}</p>
                                    </div>
                                    {paymentMethod === method.id && (
                                       <div className="absolute top-4 right-4 text-emerald-500">
                                         <IconShieldCheck size={20} />
                                       </div>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order Summary Sidebar */}
                <div className="space-y-8">
                    <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden sticky top-8">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <IconShoppingBag size={200} className="rotate-[-10deg]" />
                        </div>

                        <div className="relative z-10 flex items-center gap-2 mb-8 opacity-50">
                            <span className="w-6 h-1 bg-primary rounded-full"></span>
                            <h3 className="text-[10px] font-black uppercase tracking-widest">Selected Items</h3>
                        </div>

                        <div className="relative z-10 space-y-6 mb-10 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={item.productId._id} className="flex gap-4 group">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/5">
                                        <img
                                            src={item.productId.imageUrl || "/placeholder.jpg"}
                                            alt=""
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black text-sm tracking-tight leading-tight mb-1">{item.productId.name}</p>
                                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <span>Qty: {item.quantity}</span>
                                            <span className="text-white font-black tracking-normal">₹{item.productId.price * item.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="relative z-10 space-y-6 pt-10 border-t border-white/10 uppercase font-black tracking-widest">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-[10px]">Cart Value</span>
                                <span className="text-sm">₹{getTotal()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-[10px]">Tax & Handling</span>
                                <span className="text-[9px] text-emerald-500">Free</span>
                            </div>
                            <div className="pt-8 border-t border-white/20 flex justify-between items-end">
                                <div>
                                    <p className="text-gray-500 text-[10px] mb-2">Final Amount</p>
                                    <p className="text-5xl font-black text-primary tracking-tighter leading-none tabular-nums">₹{getTotal()}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="relative z-10 mt-10 btn btn-primary btn-block h-16 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 transition-all hover:scale-[1.02]"
                        >
                            {loading ? (
                                <>Processing <div className="loading loading-spinner loading-xs text-white"></div></>
                            ) : (
                                <>Pay & Confirm <IconArrowRight size={20} /></>
                            )}
                        </button>
                        
                        <div className="relative z-10 mt-6 flex items-center justify-center gap-2 opacity-30 group cursor-default">
                           <IconShieldCheck size={14} />
                           <p className="text-[9px] font-black uppercase tracking-widest">Secure Commerce Layer</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
