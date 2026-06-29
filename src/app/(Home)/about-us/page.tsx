"use client";

import React from "react";
import { 
  IconShieldCheck, 
  IconMessage2, 
  IconPlant, 
  IconUsers, 
  IconAward, 
  IconHeart 
} from "@tabler/icons-react";

export default function AboutUsPage() {
  return (
    <div className="bg-white min-h-screen pt-28 pb-20 overflow-x-hidden font-sans">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 mb-20 text-center animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full mb-4 border border-green-100">
          <IconHeart size={16} className="text-green-700" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-700">Our Story</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 leading-none">
          Bridging the Gap Between <br />
          <span className="text-green-600">Farms & Dining Tables</span>
        </h1>
        <p className="max-w-2xl mx-auto text-sm font-bold text-gray-400 mt-6 lowercase leading-relaxed">
          Farm-Direct is an AI-powered agricultural ecosystem designed to eliminate middle-tier commissions, guarantee fair pricing, and ensure transparency.
        </p>
      </section>

      {/* Image and Description Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl shadow-gray-200/50">
            <img 
              src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=1200" 
              alt="Farmers together"
              className="w-full h-[450px] object-cover"
            />
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">Empowering Producers & Enriching Consumers</h2>
              <p className="text-sm font-bold text-gray-400 leading-relaxed lowercase">
                In traditional supply chains, intermediaries capture the majority of agricultural trade margins, leaving farmers with minimal profits and consumers paying inflated rates.
              </p>
              <p className="text-sm font-semibold text-gray-500 leading-relaxed">
                By integrating a real-time bargaining state machine with advanced Machine Learning price forecasting, Farm-Direct builds a fair, digital marketplace. Farmers get suggestions based on real market trends, list their crops, and interact directly with consumers.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="border-l-4 border-green-600 pl-4 space-y-1">
                <h4 className="text-2xl font-black text-gray-900">100%</h4>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Direct Trading</p>
              </div>
              <div className="border-l-4 border-green-600 pl-4 space-y-1">
                <h4 className="text-2xl font-black text-gray-900">₹0</h4>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Middlemen Cuts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-4">Values We Live By</h2>
            <p className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              What Drives <span className="text-green-600">Farm-Direct</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
              icon={<IconPlant size={32} />}
              title="Farmer First"
              desc="We believe in increasing farm margins. Giving producers direct control over pricing and customer connections."
            />
            <ValueCard 
              icon={<IconShieldCheck size={32} />}
              title="Secure Operations"
              desc="From hashed credential management to dynamic bargain validations, we ensure every transaction is protected."
            />
            <ValueCard 
              icon={<IconMessage2 size={32} />}
              title="P2P Bargaining"
              desc="Replicating natural market dynamics online through custom, multi-step bargaining state locks."
            />
          </div>
        </div>
      </section>

      {/* Meet the Vision section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <IconAward size={48} className="text-green-600 mx-auto" />
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">Join the Agri-Tech Transformation</h2>
          <p className="text-sm font-semibold text-gray-500 leading-relaxed">
            We are dedicated to building sustainable agricultural networks. By simplifying logistics, optimizing pricing with data science, and securing checkouts, we ensure fresh products arrive safely at your door.
          </p>
        </div>
      </section>

    </div>
  );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 space-y-6">
      <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 border border-green-100">
        {icon}
      </div>
      <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none">{title}</h3>
      <p className="text-xs font-semibold text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}
