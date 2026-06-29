"use client";

import Link from "next/link";
import { IconPlant, IconMenu2 } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass-morphism py-2 shadow-md" : "bg-transparent py-4"
      }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <IconPlant size={28} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-primary">
              AGRI<span className="text-secondary">FOOD</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">Pure & Simple</span>
          </div>
        </Link>

        {/* Desktop Links - Simplified */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-sm font-bold text-gray-700 hover:text-primary transition-colors">Our Benefits</Link>
          <Link href="/how-to-use" className="text-sm font-bold text-gray-700 hover:text-primary transition-colors">How to Use</Link>
          <Link href="/about-us" className="text-sm font-bold text-gray-700 hover:text-primary transition-colors">About Us</Link>
        </div>

        {/* Auth Actions - Green Theme */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-primary hover:bg-primary/10 px-4 py-2 rounded-xl transition-all">
            Login
          </Link>
          <Link href="/signup" className="btn btn-primary rounded-xl px-6 text-sm font-bold shadow-lg shadow-primary/20">
            Join Now
          </Link>
          {/* Mobile Menu Icon */}
          <button className="md:hidden p-2 text-primary">
            <IconMenu2 />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
