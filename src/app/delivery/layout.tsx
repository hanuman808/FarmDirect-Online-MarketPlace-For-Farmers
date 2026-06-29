"use client";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import axios from "axios";
import SideNav from "./SideNav";
import { AuthProvider, useAuth } from "@/context/AuthProvider";
import { IconTruck } from "@tabler/icons-react";

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
        <body className="bg-base-100 text-base-content min-h-screen flex flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center gap-6 animate-pulse">
            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 shadow-sm flex items-center justify-center">
              <IconTruck size={64} className="animate-bounce" />
            </div>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl font-black text-base-content tracking-tight">AgriFood Logistics</h2>
              <p className="text-xs font-bold text-base-content/60 uppercase tracking-widest mt-1">Verifying logistics session...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  if (user.role !== "delivery") {
    return (
      <html lang="en">
        <body className="bg-base-100 text-base-content min-h-screen flex items-center justify-center p-4">
          <div className="flex flex-col items-center gap-6 max-w-md text-center p-8 bg-rose-500/10 border border-rose-500/20 rounded-3xl shadow-lg">
            <div className="p-4 bg-rose-500/20 rounded-full text-rose-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-rose-800">Access Denied</h2>
              <p className="text-sm font-bold text-rose-500 uppercase tracking-widest mt-1">RBAC Authorization Failed</p>
              <p className="text-sm text-base-content/60 mt-4 leading-relaxed">
                Your account is registered as a <span className="font-bold capitalize text-rose-600">{user.role}</span>. You do not have permissions to access the Delivery Partner Panel.
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
        <title>AgriFood Logistics - Delivery Partner Panel</title>
        <meta name="description" content="Manage your delivery orders and track shipments" />
      </head>
      <body className="antialiased bg-base-200 text-base-content">
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
