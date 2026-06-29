"use client";

import { useAuth } from "@/context/AuthProvider";
import { Product } from "@/types/Users";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IconPlant, IconPackage, IconPlus, IconShoppingCart } from "@tabler/icons-react";
import Link from "next/link";

const FarmerProductsPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const res = await axios.get(`/api/products?ownerId=${user._id}`);
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load your crops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchProducts();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-10">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Products</h1>
          <p className="text-sm font-bold text-gray-400 mt-2 lowercase">List of all items you are selling to people.</p>
        </div>
        <Link 
          href="/farmer/add-product" 
          className="btn btn-primary h-12 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 group transition-all"
        >
          <IconPlus size={16} /> Add New Product
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="loading loading-ring loading-lg text-emerald-500"></div>
          <p className="text-xs font-black text-gray-300 uppercase tracking-[0.2em]">Checking Storefront...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-200 mb-6">
            <IconPackage size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your shop is empty</h2>
          <p className="text-sm font-bold text-gray-400 mt-2 mb-8 uppercase tracking-widest">Start selling by adding your first product today!</p>
          <Link href="/farmer/add-product" className="btn btn-primary px-8 rounded-xl font-black uppercase text-[10px] tracking-widest">Post My First Product</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col"
            >
              <div className="h-56 bg-gray-50 p-6 flex items-center justify-center relative overflow-hidden group-hover:bg-emerald-50 transition-colors">
                <img
                  src={product.imageUrl || "/placeholder.jpg"}
                  alt={product.name}
                  className="object-contain w-full h-full transform transition-transform duration-700 group-hover:scale-110 z-10"
                />
                <IconPlant className="absolute -bottom-4 -right-4 text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors" size={150} />
              </div>
              
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    {product.category}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                    <IconPackage size={12} /> Stock: {product.stock}
                  </div>
                </div>

                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2 group-hover:text-emerald-600 transition-colors">
                  {product.name}
                </h2>
                
                <p className="text-sm font-bold text-gray-400 leading-relaxed mb-6 flex-grow line-clamp-2">
                  {product.description}
                </p>

                <div className="pt-6 border-t border-gray-50 flex justify-between items-center mt-auto">
                  <div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Sale Price</p>
                    <p className="text-3xl font-black text-gray-900 tracking-tighter">₹{product.price}</p>
                  </div>
                  <button className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                    <IconShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerProductsPage;
