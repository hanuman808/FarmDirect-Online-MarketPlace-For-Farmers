"use client";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthProvider";

const Component = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();
  const hideFooter = pathname === "/login" || pathname === "/signup";

  return (
    <html lang="en">
      <head>
        <title>Farm Inventory Management System - Direct Farm to Consumer</title>
        <meta
          name="description"
          content="Farm Inventory Management System connects farmers and consumers directly. Manage inventory, track stock, and sell fresh products with real-time tracking."
        />
      </head>
      <body className={`antialiased font-sans`}>
        <Toaster />
        {!hideFooter && <Navbar />}
        <main className="min-h-screen">
          {children}
        </main>
        {!hideFooter && <Footer />}
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
