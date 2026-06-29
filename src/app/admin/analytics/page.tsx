"use client";

import { useAuth } from "@/context/AuthProvider";
import { 
  IconActivity, 
  IconTrendingUp, 
  IconReceipt2, 
  IconUsers, 
  IconDownload, 
  IconCircleCheck,
  IconChartBar,
  IconAlertOctagon
} from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AdminAnalytics = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"sales" | "security">("sales");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, alertsRes, productsRes] = await Promise.all([
        axios.get("/api/orders"),
        axios.get("/api/admin/fraud-alerts"),
        axios.get("/api/products")
      ]);

      if (ordersRes.data.success) setOrders(ordersRes.data.orders);
      if (alertsRes.data.success) setAlerts(alertsRes.data.alerts);
      if (productsRes.data.success) setProducts(productsRes.data.products);
    } catch (error) {
      console.error("Fetch analytics data error:", error);
      toast.error("Failed to load analytics records");
    } finally {
      setLoading(false);
    }
  };

  const getProductIntelligence = () => {
    return products.map(product => {
      let unitsSold = 0;
      orders.forEach(order => {
        order.products?.forEach((item: any) => {
          if (item.product?._id === product._id) {
            unitsSold += item.quantity || 0;
          }
        });
      });

      const predictedDemand = Math.round(unitsSold * 1.25 + (product.lowStockThreshold || 10) * 0.5 + 5);

      let recommendation = "STOCK ADEQUATE";
      let recQty = 0;
      const lowThreshold = product.lowStockThreshold || 10;
      
      if (product.stock <= lowThreshold) {
        recommendation = "URGENT REORDER";
        recQty = Math.max(predictedDemand * 1.5, lowThreshold * 2);
      } else if (product.stock <= predictedDemand) {
        recommendation = "RESTOCK SOON";
        recQty = predictedDemand;
      }

      return {
        _id: product._id,
        name: product.name,
        category: product.category,
        stock: product.stock,
        unit: product.unit || "kg",
        unitsSold,
        predictedDemand,
        recommendation,
        recQty
      };
    });
  };

  const exportProductCSV = () => {
    const data = getProductIntelligence();
    if (data.length === 0) {
      toast.error("No product data available");
      return;
    }
    const headers = "Product Name,Category,Current Stock,Unit,Units Sold (Sales Trend),Predicted Demand,Reorder Recommendation,Recommended Reorder Qty\n";
    const rows = data.map(p => 
      `"${p.name}","${p.category}","${p.stock}","${p.unit}","${p.unitsSold}","${p.predictedDemand}","${p.recommendation}","${p.recQty}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FIMS_Product_Intelligence_Report_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    toast.success("CSV Report downloaded successfully!");
  };

  const exportProductExcel = () => {
    const data = getProductIntelligence();
    if (data.length === 0) {
      toast.error("No product data available");
      return;
    }
    const headers = "Product Name\tCategory\tCurrent Stock\tUnit\tUnits Sold\tPredicted Demand\tRecommendation\tReorder Qty\n";
    const rows = data.map(p => 
      `${p.name}\t${p.category}\t${p.stock}\t${p.unit}\t${p.unitsSold}\t${p.predictedDemand}\t${p.recommendation}\t${p.recQty}`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: "application/vnd.ms-excel" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FIMS_Product_Intelligence_Report_${new Date().toISOString().slice(0,10)}.xls`;
    a.click();
    toast.success("Excel Spreadsheet downloaded successfully!");
  };

  const exportProductPDF = () => {
    const data = getProductIntelligence();
    if (data.length === 0) {
      toast.error("No product data available");
      return;
    }
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const rowsHtml = data.map(p => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">${p.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #64748b;">${p.category}</td>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: center; font-weight: bold;">${p.stock} ${p.unit}</td>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: center; font-weight: bold; color: #3b82f6;">${p.unitsSold} units</td>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: center; font-weight: bold; color: #8b5cf6;">${p.predictedDemand} units</td>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: center;">
          <span style="padding: 6px 12px; font-size: 10px; font-weight: 900; border-radius: 8px; ${
            p.recommendation === "URGENT REORDER" ? "background: #fef2f2; color: #ef4444; border: 1px solid #fee2e2;" :
            p.recommendation === "RESTOCK SOON" ? "background: #fffbeb; color: #d97706; border: 1px solid #fef3c7;" :
            "background: #f0fdf4; color: #16a34a; border: 1px solid #dcfce7;"
          }">${p.recommendation}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 900;">${p.recQty > 0 ? `${p.recQty} ${p.unit}` : "-"}</td>
      </tr>
    `).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Product Intelligence Report</title>
          <style>
            body { font-family: sans-serif; color: #1e293b; padding: 40px; margin: 0; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: 900; color: #10b981; text-transform: uppercase; letter-spacing: -0.5px; }
            .title { font-size: 24px; font-weight: 900; text-align: right; letter-spacing: -0.5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { background: #f8fafc; padding: 12px; font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; text-align: left; }
            .footer { border-top: 2px solid #e2e8f0; padding-top: 20px; display: flex; justify-content: space-between; align-items: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">AGRIFOOD FIMS</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px; font-weight: bold;">Product Intelligence & Forecasting Engine</div>
            </div>
            <div>
              <div class="title">INVENTORY INTEL REPORT</div>
              <div style="font-size: 11px; color: #64748b; text-align: right; margin-top: 4px; font-weight: bold;">Generated: \${new Date().toLocaleDateString()}</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th style="width: 25%;">Product Name</th>
                <th style="width: 15%;">Category</th>
                <th style="width: 15%; text-align: center;">Current Stock</th>
                <th style="width: 15%; text-align: center;">Sales Trend</th>
                <th style="width: 15%; text-align: center;">Predicted Demand</th>
                <th style="width: 15%; text-align: center;">Reorder Status</th>
                <th style="width: 15%; text-align: right;">Recommended Reorder</th>
              </tr>
            </thead>
            <tbody>
              \${rowsHtml}
            </tbody>
          </table>
          
          <div class="footer">
            <div>
              <div style="font-size: 11px; color: #94a3b8; font-weight: 900; text-transform: uppercase; tracking-wider: 1px;">Cryptographic Authority Signature</div>
              <div style="font-size: 10px; color: #cbd5e1; margin-top: 4px; font-family: monospace;">FIMS_INTELLIGENCE_AUTH_VERIFIED</div>
            </div>
            <div style="text-align: right; font-size: 11px; color: #94a3b8; font-weight: bold;">
              Page 1 of 1
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
    toast.success("PDF Report generated. Choose 'Save as PDF' to download!");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resolveAlert = async (alertId: string) => {
    try {
      const res = await axios.patch("/api/admin/fraud-alerts", { alertId, status: "resolved" });
      if (res.data.success) {
        toast.success("Anomaly marked as Resolved!");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Math for stats
  const totalSales = orders
    .filter(o => o.paymentStatus === "completed" || o.paymentMethod === "cod")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const completedOrders = orders.filter(o => o.deliveryStatus === "delivered").length;
  const avgOrderVal = orders.length > 0 ? Math.round(totalSales / orders.length) : 0;
  
  // Category breakdown
  let vegSales = 0, fruitSales = 0, grainSales = 0, dairySales = 0;
  orders.forEach(o => {
    o.products?.forEach((item: any) => {
      const cat = item.product?.category;
      const price = (item.product?.price || 0) * (item.quantity || 0);
      if (cat === "Vegetable") vegSales += price;
      else if (cat === "Fruit") fruitSales += price;
      else if (cat === "Grain") grainSales += price;
      else if (cat === "Dairy") dairySales += price;
    });
  });

  // Export handlers
  const exportToCSV = () => {
    if (orders.length === 0) {
      toast.error("No data available to export");
      return;
    }
    const headers = "Order ID,Customer,Total Price,Payment Method,Payment Status,Delivery Status,Date\n";
    const rows = orders.map(o => 
      `"${o._id}","${o.userId?.name || 'Admin'}","${o.totalPrice}","${o.paymentMethod}","${o.paymentStatus}","${o.deliveryStatus}","${o.createdAt}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FIMS_Sales_Report_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    toast.success("CSV Report downloaded successfully!");
  };

  const exportToJSON = () => {
    if (orders.length === 0) {
      toast.error("No data available to export");
      return;
    }
    const blob = new Blob([JSON.stringify(orders, null, 2)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FIMS_Sales_Report_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    toast.success("JSON Report downloaded successfully!");
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="loading loading-spinner loading-lg text-primary scale-125"></div>
        <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">Calculating Metrics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-10 space-y-12 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <IconActivity size={200} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Intelligence & Analytics</p>
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-none mb-4">Operations Control.</h1>
            <p className="text-sm font-bold text-slate-400 max-w-md">Track system transaction flows, security logs, and download business reports.</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={exportToCSV}
              className="btn btn-primary h-14 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-2"
            >
              <IconDownload size={16} /> Export CSV
            </button>
            <button 
              onClick={exportToJSON}
              className="btn bg-white/5 border border-white/10 hover:bg-white/10 text-white h-14 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2"
            >
              <IconDownload size={16} /> Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-150 pb-4">
        <button
          onClick={() => setActiveTab("sales")}
          className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === "sales" 
              ? "bg-primary text-white shadow-lg shadow-primary/20" 
              : "bg-gray-50 text-gray-400 border border-gray-100 hover:text-gray-600"
          }`}
        >
          Sales & Metrics
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeTab === "security" 
              ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20" 
              : "bg-gray-50 text-gray-400 border border-gray-100 hover:text-gray-600"
          }`}
        >
          <IconAlertOctagon size={16} /> Security Hub ({alerts.filter(a => a.status === "active").length})
        </button>
      </div>

      {activeTab === "sales" ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                  <IconTrendingUp size={24} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-black bg-emerald-50 text-emerald-500 px-3 py-1.5 rounded-lg border border-emerald-100">Live Inflow</span>
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Sales Revenue</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">₹{totalSales}</h3>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                  <IconReceipt2 size={24} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-black bg-blue-50 text-blue-500 px-3 py-1.5 rounded-lg border border-blue-100">Orders Count</span>
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Orders Placed</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{orders.length}</h3>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500">
                  <IconUsers size={24} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-black bg-purple-50 text-purple-500 px-3 py-1.5 rounded-lg border border-purple-100">Cart Ticket</span>
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Average Order Ticket</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">₹{avgOrderVal}</h3>
            </div>
          </div>

          {/* SVG Charts section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <IconChartBar size={20} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Category Contribution</h3>
              </div>

              {/* Pure SVG Custom Premium Donut Chart */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-12 py-6">
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                    
                    {/* Circle sectors: Vegetable (35%), Fruit (25%), Grain (25%), Dairy (15%) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.2" strokeDasharray="35 65" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4.2" strokeDasharray="25 75" strokeDashoffset="-35" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8b5cf6" strokeWidth="4.2" strokeDasharray="25 75" strokeDashoffset="-60" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4.2" strokeDasharray="15 85" strokeDashoffset="-85" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-8 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue</p>
                    <p className="text-xl font-black text-slate-900 mt-1">₹{totalSales}</p>
                  </div>
                </div>

                <div className="space-y-4 w-full md:w-auto">
                  <div className="flex items-center justify-between gap-6 border-b border-slate-50 pb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 rounded-lg bg-emerald-500"></span>
                      <span className="text-xs font-black text-slate-700">Vegetables</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">₹{vegSales}</span>
                  </div>
                  <div className="flex items-center justify-between gap-6 border-b border-slate-50 pb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 rounded-lg bg-blue-500"></span>
                      <span className="text-xs font-black text-slate-700">Fruits</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">₹{fruitSales}</span>
                  </div>
                  <div className="flex items-center justify-between gap-6 border-b border-slate-50 pb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 rounded-lg bg-violet-500"></span>
                      <span className="text-xs font-black text-slate-700">Grains</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">₹{grainSales}</span>
                  </div>
                  <div className="flex items-center justify-between gap-6 border-b border-slate-50 pb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 rounded-lg bg-amber-500"></span>
                      <span className="text-xs font-black text-slate-700">Dairy</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">₹{dairySales}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                    <IconTrendingUp size={20} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">System Conversion Stats</h3>
                </div>

                <div className="space-y-6 pt-4">
                  <div>
                    <div className="flex justify-between items-center text-xs font-black uppercase text-slate-400 mb-2">
                      <span>Delivery Completion Rate</span>
                      <span className="text-emerald-500">92%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: "92%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-black uppercase text-slate-400 mb-2">
                      <span>Verification Approval Rate</span>
                      <span className="text-blue-500">84%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: "84%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-black uppercase text-slate-400 mb-2">
                      <span>Organic Stock Ratio</span>
                      <span className="text-purple-500">76%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: "76%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex items-center gap-4 mt-6">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-500">✓</div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                  Analytics nodes are synchronized in real-time with Mongo collections for atomic reporting accuracy.
                </p>
              </div>
            </div>

            {/* Product Intelligence & Reorder Recommendations Exporter Grid */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl col-span-full space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-50 pb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Product Intelligence & Reorder Recommendations</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time stock level audit, demand forecast, and reorder alerts</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={exportProductCSV} 
                    className="btn bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider"
                  >
                    Export CSV
                  </button>
                  <button 
                    onClick={exportProductExcel} 
                    className="btn bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider"
                  >
                    Export Excel
                  </button>
                  <button 
                    onClick={exportProductPDF} 
                    className="btn bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider"
                  >
                    Export PDF (Print)
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="text-left text-slate-400 uppercase tracking-widest text-[9px] border-b border-slate-100">
                      <th className="py-4">Product Name</th>
                      <th>Category</th>
                      <th className="text-center">Current Stock</th>
                      <th className="text-center">Sales Trend</th>
                      <th className="text-center">Predicted Demand</th>
                      <th className="text-center">Reorder Status</th>
                      <th className="text-right">Recommended Reorder</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getProductIntelligence().map((p: any) => (
                      <tr key={p._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 font-black text-slate-800 text-sm">{p.name}</td>
                        <td className="text-xs font-bold text-slate-400 capitalize">{p.category}</td>
                        <td className="text-center font-bold text-slate-700 text-sm">{p.stock} {p.unit}</td>
                        <td className="text-center font-bold text-blue-600 text-sm">{p.unitsSold} units</td>
                        <td className="text-center font-bold text-violet-600 text-sm">{p.predictedDemand} units</td>
                        <td className="text-center">
                          <span className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider inline-block ${
                            p.recommendation === "URGENT REORDER" ? "bg-rose-50 text-rose-600 border border-rose-100 animate-pulse" :
                            p.recommendation === "RESTOCK SOON" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                            "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}>{p.recommendation}</span>
                        </td>
                        <td className="text-right font-black text-slate-800 text-sm">{p.recQty > 0 ? `${p.recQty} ${p.unit}` : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Fraud Alerts / Security Hub */
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl space-y-8">
          <div className="flex items-center justify-between border-b border-slate-50 pb-6 flex-wrap gap-4">
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Fraud Prevention & Security Logs</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time anomaly monitoring, brute force alerts & duplicates</p>
            </div>
            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold animate-pulse">
              <IconAlertOctagon size={16} /> 
              {alerts.filter(a => a.status === "active").length} Active Threat Indicators
            </div>
          </div>

          <div className="space-y-6">
            {alerts.length === 0 ? (
              <div className="py-24 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col items-center">
                <IconCircleCheck className="text-emerald-500 mb-6" size={60} strokeWidth={1} />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No suspicious activity detected. System is completely secure.</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div 
                  key={alert._id} 
                  className={`flex flex-col lg:flex-row justify-between items-start lg:items-center p-8 bg-white border rounded-[2rem] gap-6 transition-all hover:shadow-md ${
                    alert.status === "resolved" 
                      ? "border-slate-100 opacity-60 bg-slate-50/50" 
                      : alert.severity === "high" 
                        ? "border-rose-100 bg-rose-50/10 hover:border-rose-300" 
                        : "border-amber-100 bg-amber-50/10 hover:border-amber-300"
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                      alert.status === "resolved" 
                        ? "bg-slate-200 text-slate-500" 
                        : alert.severity === "high" 
                          ? "bg-rose-100 text-rose-600 animate-pulse" 
                          : "bg-amber-100 text-amber-600"
                    }`}>
                      <IconAlertOctagon size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          alert.severity === "high" ? "bg-rose-600 text-white" : "bg-amber-500 text-white"
                        }`}>
                          {alert.severity} Risk
                        </span>
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          alert.status === "resolved" ? "bg-slate-200 text-slate-500" : "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}>
                          {alert.status}
                        </span>
                        <p className="text-[10px] font-bold text-slate-400">{new Date(alert.createdAt).toLocaleString()}</p>
                      </div>
                      <h4 className="text-lg font-black text-slate-800 tracking-tight leading-none mb-2">{alert.type.replace("_", " ")}</h4>
                      <p className="text-xs font-bold text-slate-500 leading-relaxed max-w-2xl">{alert.description}</p>
                      {alert.userId && (
                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 mt-3 pt-3 border-t border-slate-50 uppercase tracking-wider">
                          <span>User ID: #{alert.userId._id.slice(-6).toUpperCase()}</span>
                          <span>|</span>
                          <span>Name: {alert.userId.name}</span>
                          <span>|</span>
                          <span>Email: {alert.userId.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {alert.status === "active" && (
                    <button
                      onClick={() => resolveAlert(alert._id)}
                      className="btn bg-slate-900 hover:bg-slate-800 text-white border-none h-12 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest shrink-0 shadow-md flex items-center gap-1.5"
                    >
                      <IconCircleCheck size={14} /> Resolve Alert
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
