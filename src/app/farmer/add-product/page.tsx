"use client";

import { useAuth } from "@/context/AuthProvider";
import { IconPlant, IconLeaf, IconArrowRight, IconRefresh, IconAlertCircle, IconPlus, IconUpload, IconPhoto } from "@tabler/icons-react";
import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const AddProductPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    stock: 0,
    category: "",
    harvestDate: "",
    expiryDate: "",
    isOrganic: false,
    lowStockThreshold: 10,
    unit: "kg",
    commodity: "",
    state: "",
    minPrice: 0,
    maxPrice: 0,
    suggestedPrice: 0,
  });

  const [predicting, setPredicting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchSuggestedPrice = async () => {
    const { commodity, state, minPrice, maxPrice } = productData;
    if (commodity && state && minPrice > 0 && maxPrice > 0) {
      setPredicting(true);
      try {
        const response = await axios.post("/api/predict-price", {
          Commodity: commodity,
          State: state,
          minPrice: minPrice * 100, // Convert ₹/kg to ₹/Quintal for ML model
          maxPrice: maxPrice * 100, // Convert ₹/kg to ₹/Quintal for ML model
        });
        if (response.data.success) {
          const rawSuggested = response.data.predicted_price;
          // Converted retail price (wholesale price per quintal divided by 100)
          const convertedRetail = Math.round(rawSuggested / 100);

          setProductData((prev) => ({
            ...prev,
            suggestedPrice: convertedRetail,
            price: prev.price === 0 ? convertedRetail : prev.price,
          }));
        }
      } catch (error) {
        console.error("Prediction failed:", error);
      } finally {
        setPredicting(false);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestedPrice();
    }, 1000);
    return () => clearTimeout(timer);
  }, [productData.commodity, productData.state, productData.minPrice, productData.maxPrice]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      setUploading(true);
      try {
        const res = await axios.post("/api/upload", formData);
        if (res.data.path) {
          setProductData((prev) => ({ ...prev, imageUrl: res.data.path }));
          toast.success("Image uploaded!");
        }
      } catch (error) {
        toast.error("Failed to upload image");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleAddProduct = async () => {
    const { name, description, price, imageUrl, stock, category } = productData;

    if (!name || !description || !price || !imageUrl || !stock || !category) {
      toast.error("Please fill all fields and upload an image");
      return;
    }

    try {
      const res = axios.post("/api/products", { productData });

      toast.promise(res, {
        loading: "Saving your product details...",
        success: "Product added successfully!",
        error: "Failed to save. Try again.",
      });

      await res;
      router.push("/farmer/products");
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 space-y-12">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Add New Product</h1>
          <p className="text-sm font-bold text-gray-400 mt-2 lowercase">Add details of what you want to sell today.</p>
        </div>
        <div className="flex items-center gap-4 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 shadow-sm transition-all hover:bg-emerald-100">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
             <IconPlant size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-600/50 uppercase tracking-widest leading-none">Registered Farmer</p>
            <p className="text-base font-black text-emerald-900 mt-1">{user.name}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          {/* AI Helper Card */}
          <div className="bg-emerald-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <IconLeaf size={150} strokeWidth={1} />
            </div>
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                   <IconRefresh className="animate-pulse" size={28} />
                </div>
                <div>
                   <h3 className="text-2xl font-black tracking-tight">Price Guess Helper</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100 mt-1 opacity-80">Use AI to check market rates</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-100 ml-1">Type of Product</label>
                  <input
                    type="text"
                    placeholder="Onion, Potato, Grain..."
                    className="input w-full h-14 bg-white/10 border-white/20 rounded-2xl px-6 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white transition-all text-sm font-bold"
                    value={productData.commodity}
                    onChange={(e) => setProductData({ ...productData, commodity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-100 ml-1">State / Region</label>
                  <input
                    type="text"
                    placeholder="Maharashtra, Delhi..."
                    className="input w-full h-14 bg-white/10 border-white/20 rounded-2xl px-6 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white transition-all text-sm font-bold"
                    value={productData.state}
                    onChange={(e) => setProductData({ ...productData, state: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-100 ml-1">Min Price (₹ / kg or unit)</label>
                  <input
                    type="number"
                    placeholder="e.g. 40"
                    className="input w-full h-14 bg-white/10 border-white/20 rounded-2xl px-6 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white transition-all text-sm font-bold"
                    value={productData.minPrice || ""}
                    onChange={(e) => setProductData({ ...productData, minPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-100 ml-1">Max Price (₹ / kg or unit)</label>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    className="input w-full h-14 bg-white/10 border-white/20 rounded-2xl px-6 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white transition-all text-sm font-bold"
                    value={productData.maxPrice || ""}
                    onChange={(e) => setProductData({ ...productData, maxPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <p className="text-[10px] font-bold text-emerald-100/70 italic-none leading-relaxed mt-2">
                *(Note: Official APMC wholesale rates are typically tracked in Quintals (100 kg), but you can enter your target rates directly per kg or unit here. The system will automatically handle the conversion for AI prediction).*
              </p>

              <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-200/60 mb-1">AI Suggested Listing Price</p>
                  <div className="flex flex-col gap-1">
                    {predicting ? (
                      <div className="loading loading-dots loading-md text-white"></div>
                    ) : (
                      <>
                        <p className="text-4xl font-black text-white tracking-tighter">
                          ₹{productData.suggestedPrice || "0"} <span className="text-xs font-bold text-emerald-200">per {productData.unit}</span>
                        </p>
                        {productData.suggestedPrice > 0 && (
                          <span className="text-[9px] font-bold text-emerald-100/60 uppercase tracking-widest">
                            (Converted from Wholesale: ~₹{productData.suggestedPrice * 100} / Quintal)
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <button 
                  className="btn btn-lg h-14 px-8 bg-white border-none text-emerald-700 hover:bg-emerald-50 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl"
                  onClick={fetchSuggestedPrice}
                >
                  Check Price
                </button>
              </div>
            </div>
          </div>

          {/* Form Block */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-10">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
               <div className="w-1 h-8 bg-emerald-500 rounded-full"></div>
               General Product Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Display Name</label>
                <input
                  type="text"
                  placeholder="What should customers see?"
                  className="input w-full h-14 bg-gray-50 border-gray-100 rounded-2xl px-6 text-gray-800 placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 transition-all font-bold text-sm"
                  value={productData.name}
                  onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Section / Category</label>
                <select
                  className="select w-full h-14 bg-gray-50 border-gray-100 rounded-2xl px-6 text-gray-800 focus:bg-white focus:border-emerald-500 transition-all font-bold text-sm"
                  value={productData.category}
                  onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                >
                  <option value="">Select Type</option>
                  <option value="Vegetable">Green Vegetables</option>
                  <option value="Fruit">Fresh Fruits</option>
                  <option value="Grain">Grains & Rice</option>
                  <option value="Dairy">Dairy Items</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Sale Unit</label>
                <select
                  className="select w-full h-14 bg-gray-50 border-gray-100 rounded-2xl px-6 text-gray-800 focus:bg-white focus:border-emerald-500 transition-all font-bold text-sm"
                  value={productData.unit}
                  onChange={(e) => setProductData({ ...productData, unit: e.target.value })}
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="liters">Liters (L)</option>
                  <option value="pieces">Single Piece</option>
                  <option value="bundles">Bundle</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">I want to Sell for (₹)</label>
                <div className="relative">
                  <input
                    type="number"
                    className="input w-full h-16 bg-white border-2 border-emerald-500 rounded-2xl px-6 text-emerald-700 font-black text-2xl focus:ring-4 focus:ring-emerald-100 transition-all"
                    value={productData.price}
                    onChange={(e) => setProductData({ ...productData, price: parseFloat(e.target.value) || 0 })}
                  />
                  {productData.suggestedPrice > 0 && (
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 text-[9px] font-black text-emerald-600 uppercase">AI Recommended</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Total Weight / Stock</label>
                <input
                  type="number"
                  className="input w-full h-16 bg-gray-50 border-gray-100 rounded-2xl px-6 text-gray-800 font-black text-xl focus:bg-white focus:border-emerald-500 transition-all"
                  value={productData.stock}
                  onChange={(e) => setProductData({ ...productData, stock: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-50">
                <label className="flex items-center gap-4 cursor-pointer group bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-lg checkbox-success rounded-xl"
                    checked={productData.isOrganic}
                    onChange={(e) => setProductData({ ...productData, isOrganic: e.target.checked })}
                  />
                  <div>
                    <span className="text-sm font-black text-gray-900 tracking-tight block">This is Organic Product</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Grown without chemical fertilizers</span>
                  </div>
                </label>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Describe your Product</label>
                <textarea
                  placeholder="Mention freshness, collection time, or details..."
                  className="textarea w-full h-40 bg-gray-50 border-gray-100 rounded-[2rem] p-8 text-gray-800 font-bold text-sm focus:bg-white focus:border-emerald-500 transition-all"
                  value={productData.description}
                  onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8 relative">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Product Photo</h4>
            
            <div className="rounded-[2.5rem] overflow-hidden border-2 border-dashed border-gray-100 p-2 min-h-[300px] flex flex-col items-center justify-center bg-gray-50/30 group hover:border-emerald-200 transition-all relative">
                {productData.imageUrl ? (
                  <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-xl">
                    <img src={productData.imageUrl} className="w-full h-full object-cover" alt="Product" />
                    <button 
                      onClick={() => setProductData({...productData, imageUrl: ""})}
                      className="absolute top-4 right-4 bg-rose-500/90 backdrop-blur-md text-white p-2 rounded-xl shadow-lg hover:scale-110 transition-transform"
                    >
                      <IconPlus className="rotate-45" size={20} />
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center gap-6 cursor-pointer py-12">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-gray-200/50 flex items-center justify-center text-gray-300 group-hover:text-emerald-500 group-hover:scale-110 transition-all">
                       {uploading ? <span className="loading loading-spinner loading-md"></span> : <IconPhoto size={40} />}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-gray-900 tracking-tight">Click to Upload</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">or drag & drop here</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl text-emerald-600 text-[9px] font-black uppercase tracking-widest">
                       <IconUpload size={14} /> Supports JPG, PNG
                    </div>
                  </label>
                )}
            </div>
          </div>

          <button
            className="btn btn-primary w-full h-20 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center justify-center gap-1 group"
            onClick={handleAddProduct}
          >
            Add Product Now <IconArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
             <div className="flex items-center gap-3 mb-4">
                <IconAlertCircle className="text-primary" size={20} />
                <h5 className="text-[10px] font-black uppercase tracking-widest text-white/50">Farmer Tip</h5>
             </div>
             <p className="text-xs font-bold leading-relaxed text-gray-400 italic-none">Accurate product descriptions help you sell faster and build trust with urban customers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
