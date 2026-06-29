"use client";

import { useAuth } from "@/context/AuthProvider";
import { Product } from "@/types/Users";
import axios from "axios";
import { IconBasket, IconSearch, IconShoppingCart, IconPlus, IconMinus, IconFilter, IconCategory, IconLeaf, IconTag, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Cart {
  productId: Product;
  quantity: number;
}

const UserBrowsePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [cart, setCart] = useState<Cart[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });
  const [loading, setLoading] = useState(true);

  // Bargain states
  const [bargainProduct, setBargainProduct] = useState<Product | null>(null);
  const [offeredPrice, setOfferedPrice] = useState<number>(0);
  const [bargainQuantity, setBargainQuantity] = useState<number>(1);
  const [submittingBargain, setSubmittingBargain] = useState(false);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/products");
      if (res.data.success) {
        setProducts(res.data.products);
        setFilteredProducts(res.data.products);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.error("Failed to load marketplace");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.productId._id === product._id);

    if (existing) {
      setCart((prev) =>
        prev.map((item) =>
          item.productId._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      toast.success(`${product.name} quantity added!`);
    } else {
      setCart((prev) => [...prev, { productId: product, quantity: 1 }]);
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleBuyNow = (product: Product) => {
    localStorage.setItem("cart", JSON.stringify([{ productId: product, quantity: 1 }]));
    toast.success(`Opening direct checkout!`);
    router.push("/user/checkout");
  };

  const handleOpenBargainModal = (product: Product) => {
    setBargainProduct(product);
    setOfferedPrice(Math.round(product.price * 0.9)); // suggest 90% of price
    setBargainQuantity(1);
  };

  const handleSubmitBargain = async () => {
    if (!bargainProduct) return;
    if (offeredPrice <= 0 || offeredPrice >= bargainProduct.price) {
      toast.error(`Please offer a price below ₹${bargainProduct.price}`);
      return;
    }
    if (bargainQuantity <= 0 || bargainQuantity > bargainProduct.stock) {
      toast.error("Please enter a valid quantity within available stock");
      return;
    }

    try {
      setSubmittingBargain(true);
      const res = await axios.post("/api/negotiations", {
        productId: bargainProduct._id,
        quantity: bargainQuantity,
        offeredPrice
      });
      if (res.data.success) {
        toast.success("Bargain offer sent to the farmer!");
        setBargainProduct(null);
      }
    } catch (err: any) {
      console.error("Submit bargain error:", err);
      toast.error(err.response?.data?.message || "Failed to submit bargain");
    } finally {
      setSubmittingBargain(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(searchLower);
        const descMatch = p.description?.toLowerCase().includes(searchLower);
        return nameMatch || descMatch;
      });
    }

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    setFilteredProducts(filtered);
  }, [search, category, products]);

  if (!user) return null;

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 space-y-12 animate-in fade-in duration-700">
      
      {/* Marketplace Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <IconShoppingCart size={200} className="rotate-[-15deg]" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
             <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Pure & Fresh</p>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none mb-4">Farm Marketplace</h1>
          <p className="text-sm font-bold text-gray-400 max-w-sm lowercase">Directly from farmers to your kitchen table.</p>
        </div>
        
        <Link
          href="/user/cart"
          className="relative z-10 btn btn-primary h-16 px-10 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center gap-4 transition-all hover:scale-105"
        >
          <IconShoppingCart size={22} />
          <span>My Cart</span>
          <span className="bg-white text-primary w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black">{getCartCount()}</span>
        </Link>
      </div>

      {/* Controls: Search & Category */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative group">
          <IconSearch size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Search fresh vegetables, fruits or grains..."
            className="input w-full h-16 pl-16 rounded-[1.5rem] bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-gray-800 placeholder:text-gray-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 px-6 bg-gray-50 rounded-[1.5rem] border border-gray-100 min-w-[250px]">
          <IconFilter size={18} className="text-gray-400" />
          <select
            className="bg-transparent border-none focus:ring-0 w-full h-16 text-sm font-black text-gray-700 cursor-pointer"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Vegetable">Fresh Vegetables</option>
            <option value="Fruit">Seasonal Fruits</option>
            <option value="Grain">Healthy Grains</option>
            <option value="Dairy">Dairy Products</option>
          </select>
        </div>
      </div>

      {/* Product Discovery Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="loading loading-ring loading-lg text-emerald-500"></div>
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Finding fresh products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
          <IconBasket size={80} className="mx-auto text-gray-200 mb-6" />
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Nothing Found</h3>
          <p className="text-xs font-black text-gray-400 mt-4 uppercase tracking-[0.2em]">Try changing your search or category filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col group"
            >
              {/* Product Visual */}
              <div className="h-64 relative bg-gray-50 overflow-hidden border-b border-gray-50">
                <img
                  src={product.imageUrl || "/placeholder.jpg"}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                   <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl shadow-xl border border-white/50">
                      <p className="text-[10px] font-black uppercase text-gray-900 tracking-wider">#{product.category}</p>
                   </div>
                   {product.isOrganic && (
                     <div className="bg-emerald-500 text-white px-3 py-1 rounded-xl shadow-xl flex items-center gap-1.5">
                        <IconLeaf size={12} />
                        <p className="text-[9px] font-black uppercase tracking-widest">Organic</p>
                     </div>
                   )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-8 flex-1 flex flex-col space-y-6">
                <div>
                   <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2 group-hover:text-emerald-600 transition-colors uppercase leading-none">{product.name}</h3>
                   <p className="text-xs font-bold text-gray-400 capitalize line-clamp-2 leading-relaxed opacity-70 italic-none">{product.description}</p>
                </div>

                <div className="flex items-end justify-between">
                   <div>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Price per {product.unit}</p>
                      <p className="text-4xl font-black text-gray-900 tracking-tighter leading-none">₹{product.price}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Availability</p>
                      <p className={`text-sm font-black inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${product.stock > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                         {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
                      </p>
                   </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className="btn btn-outline border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white flex-1 h-12 rounded-xl font-black uppercase text-[10px] tracking-wider flex items-center justify-center gap-2 transition-all transform active:scale-95"
                    >
                      <IconBasket size={16} />
                      Basket
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)}
                      disabled={product.stock === 0}
                      className="btn btn-primary flex-1 h-12 rounded-xl font-black uppercase text-[10px] tracking-wider shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all transform active:scale-95"
                    >
                      <IconPlus size={16} />
                      Buy Now
                    </button>
                  </div>
                  <button
                    onClick={() => handleOpenBargainModal(product)}
                    disabled={product.stock === 0}
                    className="btn bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-100 w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all"
                  >
                    <IconTag size={16} />
                    Bargain Direct
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Helper */}
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <IconLeaf size={240} className="rotate-[-15deg]" />
         </div>
         <div className="relative z-10 text-center md:text-left">
            <h4 className="text-3xl font-black tracking-tight mb-2">Direct From The Source</h4>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No middlemen. Full transparency on the blockchain.</p>
         </div>
         <div className="relative z-10 bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xl">✓</div>
               <div>
                  <p className="text-sm font-black">Quality Guaranteed</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Handpicked products</p>
               </div>
            </div>
         </div>
      </div>

      {/* Bargain Modal */}
      {bargainProduct && (
        <div className="modal modal-open">
          <div className="modal-box bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl relative max-w-md">
            <button 
              onClick={() => setBargainProduct(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 transition"
            >
              <IconX size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <IconTag size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Direct Bargaining</h3>
                <p className="text-[9px] font-black uppercase tracking-widest text-purple-600 mt-0.5">Submit custom price to farmer</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-50">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                  <img src={bargainProduct.imageUrl || "/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-gray-900 uppercase leading-tight">{bargainProduct.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Store Price: ₹{bargainProduct.price} per {bargainProduct.unit}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Available Stock: {bargainProduct.stock}</p>
                </div>
              </div>

              <div className="form-control">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Your Offered Price (₹ / {bargainProduct.unit})</label>
                <input
                  type="number"
                  placeholder="What price per unit will you pay?"
                  className="input h-14 w-full rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:bg-white focus:ring-4 focus:ring-purple-50 transition"
                  value={offeredPrice || ""}
                  onChange={(e) => setOfferedPrice(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="form-control">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Quantity Requested</label>
                <input
                  type="number"
                  placeholder="How many units do you want?"
                  className="input h-14 w-full rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:bg-white focus:ring-4 focus:ring-purple-50 transition"
                  value={bargainQuantity || ""}
                  onChange={(e) => setBargainQuantity(Math.max(1, Math.min(bargainProduct.stock, parseInt(e.target.value) || 1)))}
                />
              </div>

              <button
                onClick={handleSubmitBargain}
                disabled={submittingBargain}
                className="btn btn-block h-14 bg-purple-600 hover:bg-purple-700 text-white border-none rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-purple-200 mt-2 flex items-center justify-center gap-2"
              >
                {submittingBargain ? "Submitting..." : "Send Bargain Offer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBrowsePage;
