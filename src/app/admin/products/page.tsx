"use client";

import { IconPackage, IconSearch, IconLoader2, IconCircleCheck, IconLayoutCards, IconList, IconCoins, IconArchive, IconTag, IconArrowRight, IconUserCircle } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";

const AdminProductHub = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<"grid" | "list">("grid");
    const [search, setSearch] = useState("");

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/products");
            if (res.data.success) {
                setProducts(res.data.products);
            }
        } catch (error) {
            console.error("Fetch products error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.category?.toLowerCase().includes(search.toLowerCase()) || 
        p.ownerId?.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="relative">
                   <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                   <IconPackage size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
                </div>
                <div className="text-center">
                    <p className="text-xl font-black text-gray-900 tracking-tight">Syncing Inventory</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Connecting to blockchain storage...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-screen-2xl mx-auto px-4 md:px-10 py-10 space-y-12 animate-in fade-in duration-700">
            
            {/* Command Header */}
            <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <IconPackage size={240} className="rotate-[-15deg] text-white" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                    <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-primary/30">
                        <IconArchive size={40} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                           <span className="w-8 h-1 bg-primary rounded-full"></span>
                           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Commerce Hub</p>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-3">Product Inventory</h1>
                        <p className="text-gray-400 font-bold text-sm max-w-lg lowercase">Keep track of every item added by farmers to the marketplace.</p>
                    </div>
                </div>
                <div className="relative z-10 flex flex-col gap-4 w-full lg:w-auto">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-md flex items-center gap-6 min-w-[280px]">
                        <div className="flex-1">
                            <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest leading-none mb-2">Active SKUs</p>
                            <p className="text-4xl font-black text-white tracking-tighter tabular-nums">{products.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary">
                            <IconTag size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/30 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex-1 w-full max-w-2xl relative group">
                    <IconSearch size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search products, brands, or producers..." 
                        className="input h-16 w-full pl-16 rounded-[1.5rem] bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-[1.5rem]">
                   <button 
                     onClick={() => setView("grid")}
                     className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${view === "grid" ? "bg-white shadow-xl text-primary" : "text-gray-400 hover:text-gray-600"}`}
                   >
                     <IconLayoutCards size={20} />
                   </button>
                   <button 
                     onClick={() => setView("list")}
                     className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${view === "list" ? "bg-white shadow-xl text-primary" : "text-gray-400 hover:text-gray-600"}`}
                   >
                     <IconList size={20} />
                   </button>
                </div>
            </div>

            {/* Inventory Display */}
            <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10" : "space-y-6"}>
                {filtered.length === 0 ? (
                    <div className="col-span-full py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
                        <IconArchive className="mx-auto text-gray-200 mb-6" size={80} />
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">Empty Inventory</h3>
                        <p className="text-xs font-black text-gray-400 mt-4 uppercase tracking-[0.2em]">No products match your search query</p>
                    </div>
                ) : (
                    filtered.map((product) => (
                        <div key={product._id} className={`bg-white group overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                            view === "grid" ? "rounded-[3rem] flex flex-col" : "rounded-[2.5rem] flex items-center p-8 gap-8"
                        }`}>
                            {/* Visual Asset */}
                            <div className={`${view === "grid" ? "h-64" : "h-32 w-32"} relative shrink-0 overflow-hidden bg-gray-50 border-b border-gray-50`}>
                                <img 
                                    src={product.imageUrl || "/placeholder.jpg"} 
                                    alt={product.name} 
                                    className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/50 shadow-xl">
                                        <span className="text-[10px] font-black uppercase text-gray-900 tracking-wider font-mono">{product.category}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Catalog Data */}
                            <div className={`p-8 flex-1 flex flex-col ${view === "list" ? "p-0" : ""}`}>
                                <div className="mb-6">
                                    <h4 className="text-2xl font-black text-gray-900 tracking-tighter leading-none mb-3 group-hover:text-primary transition-colors">{product.name}</h4>
                                    <div className="flex items-center gap-2">
                                       <IconUserCircle size={14} className="text-gray-300" />
                                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.ownerId?.name || "Verified Producer"}</p>
                                    </div>
                                </div>

                                <p className="text-sm font-bold text-gray-400 line-clamp-2 mb-8 leading-relaxed opacity-70 italic-none">
                                    {product.description || "No product summary provided by the farmer."}
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-50 group-hover:bg-white transition-colors">
                                        <div className="flex items-center gap-2 mb-2">
                                           <IconCoins size={14} className="text-primary" />
                                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</p>
                                        </div>
                                        <p className="text-2xl font-black text-gray-900 tracking-tighter tabular-nums leading-none">₹{product.price}</p>
                                    </div>
                                    <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-50 group-hover:bg-white transition-colors">
                                        <div className="flex items-center gap-2 mb-2">
                                           <IconArchive size={14} className="text-primary" />
                                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Units Left</p>
                                        </div>
                                        <p className="text-2xl font-black text-gray-900 tracking-tighter tabular-nums leading-none">{product.stock}</p>
                                    </div>
                                </div>

                                <button className="btn btn-primary h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all hover:gap-6 group/btn">
                                    Inspect Item <IconArrowRight size={16} className="transition-all" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminProductHub;
