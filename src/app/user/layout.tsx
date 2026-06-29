"use client";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import axios from "axios";
import SideNav from "./SideNav";
import { AuthProvider, useAuth } from "@/context/AuthProvider";
import { IconPlant } from "@tabler/icons-react";
import Script from "next/script";

const Component = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user, setUser } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/verifytoken");
        if (response.data) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Auth Error:", error);
      }
    };
    if (!user) {
      fetchUser();
    }
  }, [user, setUser]);

  if (!user) {
    return (
      <html lang="en">
        <body className="bg-white min-h-screen flex items-center justify-center text-primary">
          <div className="flex flex-col items-center gap-6 animate-pulse">
            <div className="p-4 bg-primary/10 rounded-full">
              <IconPlant size={64} className="animate-bounce" />
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Marketplace</h2>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Preparing your store...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  if (user.role !== "user") {
    return (
      <html lang="en">
        <body className="bg-white min-h-screen flex items-center justify-center p-4">
          <div className="flex flex-col items-center gap-6 max-w-md text-center p-8 bg-rose-50 border border-rose-100 rounded-3xl shadow-lg">
            <div className="p-4 bg-rose-100/50 rounded-full text-rose-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-rose-800">Access Denied</h2>
              <p className="text-sm font-bold text-rose-500 uppercase tracking-widest mt-1">RBAC Authorization Failed</p>
              <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                Your account is registered as a <span className="font-bold capitalize text-rose-600">{user.role}</span>. You do not have permissions to access the Consumer Marketplace.
              </p>
            </div>
            <button onClick={() => window.location.href = `/${user.role}/dashboard`} className="btn bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-8 font-black uppercase text-[10px] tracking-widest py-3 mt-2 shadow-md border-none">
              Go to my Dashboard
            </button>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <title>Quality Farm Marketplace - Pure & Fresh</title>
        <meta name="description" content="Directly from local farmers to your kitchen" />
      </head>
      <body className="antialiased bg-base-200 text-base-content selection:bg-primary/10">
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
        <Toaster />
        <SideNav>{children}</SideNav>
      </body>
    </html>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <Component>{children}</Component>
    </AuthProvider>
  );
}
