"use client";

import React, { useState } from "react";
import { 
  IconUser, 
  IconPlus, 
  IconMessage2, 
  IconTruckDelivery, 
  IconSearch, 
  IconShoppingBag, 
  IconCreditCard, 
  IconRoute, 
  IconClipboardList, 
  IconPlant
} from "@tabler/icons-react";

type Role = "buyer" | "farmer" | "delivery";

export default function HowToUsePage() {
  const [activeRole, setActiveRole] = useState<Role>("buyer");

  const roles = [
    { id: "buyer" as Role, name: "For Buyers", icon: <IconShoppingBag size={20} /> },
    { id: "farmer" as Role, name: "For Farmers", icon: <IconPlant size={20} /> },
    { id: "delivery" as Role, name: "For Delivery Partners", icon: <IconTruckDelivery size={20} /> }
  ];

  return (
    <div className="bg-white min-h-screen pt-28 pb-20 overflow-x-hidden font-sans">
      
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-6 mb-16 text-center animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full mb-4 border border-green-100">
          <IconPlant size={16} className="text-green-700" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-700">Platform Guide</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 leading-none">
          How to Use <span className="text-green-600">Farm-Direct</span>
        </h1>
        <p className="max-w-2xl mx-auto text-sm font-bold text-gray-400 mt-6 lowercase leading-relaxed">
          Learn how to get started on the platform, whether you are buying fresh farm produce, listing crops as a producer, or delivering orders.
        </p>
      </section>

      {/* Role Selector Tabs */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="bg-gray-50 p-2 rounded-2xl border border-gray-100 flex flex-wrap md:flex-nowrap gap-2">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              className={`w-full py-4 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all duration-300 ${
                activeRole === role.id
                  ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                  : "text-gray-500 hover:text-green-600 hover:bg-white"
              }`}
            >
              {role.icon}
              {role.name}
            </button>
          ))}
        </div>
      </section>

      {/* Guide Content Area */}
      <section className="max-w-5xl mx-auto px-6">
        {activeRole === "buyer" && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-black tracking-tight text-gray-900">Buying Fresh Produce</h2>
                <p className="text-sm font-bold text-gray-400 leading-relaxed">
                  Get direct access to certified farm inventories without middle-tier commissions. Follow our simple purchasing workflow.
                </p>
                <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100/50 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-100 rounded-lg text-green-700 shrink-0">
                      <IconSearch size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">1. Browse Crop Directory</h4>
                      <p className="text-xs font-semibold text-gray-500 mt-1">Explore real-time crop listings, filter by categories, organic tags, and farm location.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-100/30">
                <img 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" 
                  alt="Marketplace browsing"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>

            {/* Stepper Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-gray-100">
              <Step 
                num="01" 
                title="Bargain / Make Offer" 
                desc="Propose customized rates & quantities. Discuss deals directly with producers via the bargaining state machine." 
                icon={<IconMessage2 />}
              />
              <Step 
                num="02" 
                title="Secure Checkout" 
                desc="Pay instantly using Razorpay UPI/Cards or Cash-on-Delivery. Backend validations safeguard transaction pricing." 
                icon={<IconCreditCard />}
              />
              <Step 
                num="03" 
                title="Live GPS Tracking" 
                desc="Track shipment milestones inside your orders stepper. Monitor delivery status updates in real-time." 
                icon={<IconRoute />}
              />
            </div>
          </div>
        )}

        {activeRole === "farmer" && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-black tracking-tight text-gray-900">Producer & Sales Management</h2>
                <p className="text-sm font-bold text-gray-400 leading-relaxed">
                  List crops, predict optimal prices using AI, manage inventory, and expand your market reach directly.
                </p>
                <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100/50 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-100 rounded-lg text-green-700 shrink-0">
                      <IconPlus size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">1. Create & Verify Profile</h4>
                      <p className="text-xs font-semibold text-gray-500 mt-1">Register and get approved. List stock items with price, unit, category, and organic tags.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-100/30">
                <img 
                  src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=800" 
                  alt="Farmer listing products"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>

            {/* Stepper Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-gray-100">
              <Step 
                num="01" 
                title="AI Price Predictions" 
                desc="Train models using historical parameters to check suggested prices based on current market trends." 
                icon={<IconPlant />}
              />
              <Step 
                num="02" 
                title="Accept/Counter Offers" 
                desc="Review incoming buyer bargains. Lock proposed rates or response counters using the incoming panel." 
                icon={<IconMessage2 />}
              />
              <Step 
                num="03" 
                title="Logistics & Earnings" 
                desc="Fulfill orders as delivery agents are automatically assigned to pick up stock. Audit settlements on your dashboard." 
                icon={<IconClipboardList />}
              />
            </div>
          </div>
        )}

        {activeRole === "delivery" && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-black tracking-tight text-gray-900">Logistics & Dispatch Operations</h2>
                <p className="text-sm font-bold text-gray-400 leading-relaxed">
                  Support the local ecosystem. Manage pick ups, deliveries, and update route locations to earn commissions.
                </p>
                <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100/50 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-100 rounded-lg text-green-700 shrink-0">
                      <IconUser size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">1. Join as Transport Partner</h4>
                      <p className="text-xs font-semibold text-gray-500 mt-1">Submit your profile and status. Switch availability to 'online' in the system dashboard.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-100/30">
                <img 
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800" 
                  alt="Logistics delivery partner"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>

            {/* Stepper Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-gray-100">
              <Step 
                num="01" 
                title="Automated Assignments" 
                desc="Receive order notifications. System matching handles dispatches based on coordinates." 
                icon={<IconTruckDelivery />}
              />
              <Step 
                num="02" 
                title="Update Statuses" 
                desc="Log milestones (Assigned -> Picked Up -> In Transit -> Delivered) within the driver panel interface." 
                icon={<IconClipboardList />}
              />
              <Step 
                num="03" 
                title="GPS Route Tracker" 
                desc="Share live coordinates with consumers to guarantee transparent, on-time transit." 
                icon={<IconRoute />}
              />
            </div>
          </div>
        )}
      </section>

    </div>
  );
}

function Step({ num, title, desc, icon }: { num: string; title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-4 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-center">
        <span className="text-3xl font-black text-green-600/30 font-mono">{num}</span>
        <div className="text-green-600">{icon}</div>
      </div>
      <h3 className="text-lg font-black text-gray-900 tracking-tight leading-none">{title}</h3>
      <p className="text-xs font-bold text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}
