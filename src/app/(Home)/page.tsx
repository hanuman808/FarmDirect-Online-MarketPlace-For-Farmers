"use client";

import { IconChevronRight, IconPackage, IconShieldCheck, IconTruckDelivery, IconUsers, IconLeaf, IconChartBar, IconDatabase } from "@tabler/icons-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000"
            alt="Green Farm Field"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-20 animate-fade-up">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-6">
              <IconLeaf size={18} className="text-green-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-green-700">Farm to Consumer Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-tight mb-6">
              Farm Inventory <br />
              <span className="text-green-600">Management System</span>
            </h1>
            <p className="max-w-2xl text-lg md:text-xl font-medium text-gray-600 mb-10 leading-relaxed">
              Complete platform for farmers to manage inventory, track stock, and sell products directly to customers. Real-time stock tracking with automated inventory management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="btn bg-green-600 text-white hover:bg-green-700 border-none btn-lg rounded-lg px-10 text-base font-medium group">
                Get Started
                <IconChevronRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link href="#features" className="btn btn-outline border-green-600 text-green-600 hover:bg-green-50 border-2 btn-lg rounded-lg px-10 text-base font-medium">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-70">
            <TrustBadge icon={<IconShieldCheck size={24} />} text="100% Secure" />
            <TrustBadge icon={<IconDatabase size={24} />} text="Real-time Tracking" />
            <TrustBadge icon={<IconUsers size={24} />} text="Direct Trading" />
            <TrustBadge icon={<IconTruckDelivery size={24} />} text="Easy Delivery" />
            <TrustBadge icon={<IconPackage size={24} />} text="Stock Management" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-green-700 font-bold uppercase tracking-wider text-sm mb-4">Key Features</h2>
            <p className="text-4xl md:text-5xl font-bold text-gray-900">
              Complete Inventory <span className="text-green-600">Solution</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<IconPackage size={32} />}
              title="Stock Management"
              desc="Track your inventory in real-time. Get alerts when stock is low. Automatic updates when orders are placed."
            />
            <FeatureCard
              icon={<IconChartBar size={32} />}
              title="Sales Analytics"
              desc="View detailed reports of your sales. Track revenue, popular products, and customer orders all in one place."
            />
            <FeatureCard
              icon={<IconDatabase size={32} />}
              title="Order Tracking"
              desc="Manage all customer orders easily. Track delivery status and payment details with complete transparency."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-green-700 font-bold uppercase tracking-wider text-sm mb-4">Simple Process</h2>
            <p className="text-4xl md:text-5xl font-bold text-gray-900">
              How It <span className="text-green-600">Works</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Register as Farmer"
              desc="Create your account and get approved by admin to start selling your products."
            />
            <StepCard
              number="2"
              title="Add Products"
              desc="List your products with details like price, stock, harvest date, and organic certification."
            />
            <StepCard
              number="3"
              title="Manage & Sell"
              desc="Track inventory, receive orders, and manage your farm business all from one dashboard."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Managing Your Farm Inventory?
          </h2>
          <p className="text-xl mb-10 text-green-100">
            Join our platform today and take control of your farm business with smart inventory management.
          </p>
          <Link
            href="/signup"
            className="btn bg-white text-green-600 hover:bg-gray-100 border-none btn-lg rounded-lg px-12 text-lg font-medium"
          >
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Farm Inventory System</h3>
              <p className="text-sm">
                Complete platform for managing farm inventory and selling products directly to customers.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">For Farmers</h4>
              <ul className="space-y-2 text-sm">
                <li>Stock Management</li>
                <li>Order Tracking</li>
                <li>Sales Reports</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 Farm Inventory Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TrustBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-green-600">{icon}</div>
      <span className="font-bold text-gray-700 text-sm">{text}</span>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function StepCard({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="relative">
      <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6">
        {number}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}
