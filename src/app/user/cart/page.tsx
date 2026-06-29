"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconTrash, IconPlus, IconMinus, IconShoppingCart, IconArrowRight, IconShoppingBag } from "@tabler/icons-react";
import Link from "next/link";

interface CartItem {
    productId: {
        _id: string;
        name: string;
        price: number;
        imageUrl: string;
        stock: number;
    };
    quantity: number;
    negotiationId?: string;
    negotiatedPrice?: number;
}

const CartPage = () => {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>(() => {
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem("cart");
            return savedCart ? JSON.parse(savedCart) : [];
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const updateQuantity = (productId: string, change: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.productId._id === productId
                    ? { ...item, quantity: Math.max(1, Math.min(item.productId.stock, item.quantity + change)) }
                    : item
            )
        );
    };

    const removeItem = (productId: string) => {
        setCart((prev) => prev.filter((item) => item.productId._id !== productId));
    };

    const getTotal = () => {
        return cart.reduce((sum, item) => {
            const itemPrice = item.negotiatedPrice !== undefined ? item.negotiatedPrice : item.productId.price;
            return sum + itemPrice * item.quantity;
        }, 0);
    };

    const proceedToCheckout = () => {
        router.push("/user/checkout");
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 animate-in fade-in duration-700">
                <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mb-8 border border-gray-100">
                    <IconShoppingCart size={48} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2 leading-none text-center">Your Cart is Empty</h2>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-10 text-center">Add some fresh products to get started</p>
                <Link
                    href="/user/browse"
                    className="btn btn-primary h-14 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/30 flex items-center gap-3 transition-all hover:scale-105"
                >
                    Browse Marketplace <IconArrowRight size={18} />
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-10 py-10 space-y-12 animate-in fade-in duration-700">
            
            {/* Header */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <IconShoppingBag size={200} className="rotate-[-10deg]" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Checkout Process</p>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-gray-900 leading-none">Review Basket</h1>
                </div>
                <div className="relative z-10 flex gap-4">
                    <p className="text-sm font-bold text-gray-400 lowercase">Total items: {cart.length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Items List */}
                <div className="lg:col-span-2 space-y-6">
                    {cart.map((item) => (
                        <div
                            key={item.productId._id}
                            className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-center gap-8 group"
                        >
                            <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-gray-50 group-hover:scale-105 transition-transform">
                                <img
                                    src={item.productId.imageUrl || "/placeholder.jpg"}
                                    alt={item.productId.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            <div className="flex-1 text-center md:text-left space-y-1">
                                <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1">{item.productId.name}</h3>
                                {item.negotiatedPrice !== undefined ? (
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">₹{item.negotiatedPrice} per unit</p>
                                        <span className="text-[9px] font-bold text-gray-400 line-through">Original: ₹{item.productId.price}</span>
                                    </div>
                                ) : (
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">₹{item.productId.price} per unit</p>
                                )}
                                <p className="text-[9px] font-bold text-gray-400 uppercase">Available: {item.productId.stock}</p>
                            </div>

                            <div className="flex items-center gap-4 bg-gray-50/50 p-2 rounded-2xl border border-gray-50">
                                <button
                                    onClick={() => updateQuantity(item.productId._id, -1)}
                                    className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-900 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-20"
                                    disabled={item.quantity <= 1}
                                >
                                    <IconMinus size={16} strokeWidth={3} />
                                </button>
                                <span className="text-lg font-black w-8 text-center tabular-nums">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.productId._id, 1)}
                                    className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-900 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-20"
                                    disabled={item.quantity >= item.productId.stock}
                                >
                                    <IconPlus size={16} strokeWidth={3} />
                                </button>
                            </div>

                            <div className="text-center md:text-right px-4">
                                <p className="text-2xl font-black text-gray-900 tracking-tighter">
                                    ₹{(item.negotiatedPrice !== undefined ? item.negotiatedPrice : item.productId.price) * item.quantity}
                                </p>
                                <button
                                    onClick={() => removeItem(item.productId._id)}
                                    className="mt-2 flex items-center gap-2 text-[9px] font-black text-rose-500 uppercase tracking-widest mx-auto md:ml-auto group-hover:scale-105 transition-all"
                                >
                                    <IconTrash size={14} /> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    <Link href="/user/browse" className="flex items-center justify-center gap-3 py-6 border-2 border-dashed border-gray-100 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:border-emerald-200 hover:text-emerald-500 transition-all">
                       <IconPlus size={18} /> Add More Items
                    </Link>
                </div>

                {/* Summary Sidebar */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-8 opacity-50">
                           <span className="w-6 h-1 bg-primary rounded-full"></span>
                           <h3 className="text-[10px] font-black uppercase tracking-widest">Order Summary</h3>
                        </div>
                        
                        <div className="space-y-6 mb-10">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 font-bold text-sm">Subtotal</span>
                                <span className="text-lg font-black tracking-tight tabular-nums">₹{getTotal()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 font-bold text-sm">Logistics Fee</span>
                                <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest">Free Delivery</span>
                            </div>
                            <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                                <span className="text-xl font-black tracking-tight">Total Payment</span>
                                <span className="text-3xl font-black tracking-tighter text-primary tabular-nums leading-none">₹{getTotal()}</span>
                            </div>
                        </div>

                        <button
                            onClick={proceedToCheckout}
                            className="btn btn-primary btn-block h-16 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
                        >
                            Finalize Order <IconArrowRight size={20} />
                        </button>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-8 text-center">
                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2 leading-relaxed">Purchasing fresh products supports local farming families directly.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
