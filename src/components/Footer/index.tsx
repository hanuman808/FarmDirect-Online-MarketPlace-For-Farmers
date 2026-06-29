"use client";

import Link from "next/link";
import { IconPlant, IconBrandTwitter, IconBrandFacebook, IconBrandInstagram, IconMail, IconPhone, IconMapPin } from "@tabler/icons-react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 pt-20 pb-10 text-white">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Brand */}
                <div className="md:col-span-1">
                    <Link href="/" className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-green-600 rounded-xl">
                            <IconPlant size={24} className="text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">
                            Farm Inventory
                        </span>
                    </Link>
                    <p className="text-sm text-gray-400 font-medium leading-relaxed">
                        Helping farmers sell directly to you. Fresh, healthy, and honest food for everyone.
                    </p>
                    <div className="flex gap-4 mt-8">
                        <a href="#" className="p-2 bg-gray-800 rounded-lg hover:text-primary transition-colors"><IconBrandTwitter size={20} /></a>
                        <a href="#" className="p-2 bg-gray-800 rounded-lg hover:text-primary transition-colors"><IconBrandFacebook size={20} /></a>
                        <a href="#" className="p-2 bg-gray-800 rounded-lg hover:text-primary transition-colors"><IconBrandInstagram size={20} /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-8 underline decoration-secondary decoration-2 underline-offset-8">Links</h3>
                    <ul className="space-y-4 text-sm font-bold text-gray-400">
                        <li><Link href="/#features" className="hover:text-primary transition-colors">Our Benefits</Link></li>
                        <li><Link href="/how-to-use" className="hover:text-primary transition-colors">How to Use</Link></li>
                        <li><Link href="/about-us" className="hover:text-primary transition-colors">About Us</Link></li>
                        <li><Link href="/login" className="hover:text-primary transition-colors">Farmer Login</Link></li>
                    </ul>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-8 underline decoration-secondary decoration-2 underline-offset-8">What we Sell</h3>
                    <ul className="space-y-4 text-sm font-bold text-gray-400">
                        <li><Link href="/user/browse" className="hover:text-primary transition-colors">Fresh Vegetables</Link></li>
                        <li><Link href="/user/browse" className="hover:text-primary transition-colors">Fresh Fruits</Link></li>
                        <li><Link href="/user/browse" className="hover:text-primary transition-colors">Organic Grains</Link></li>
                        <li><Link href="/user/browse" className="hover:text-primary transition-colors">Farm Milk</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-8 underline decoration-secondary decoration-2 underline-offset-8">Contact</h3>
                    <ul className="space-y-4 text-sm font-bold text-gray-400">
                        <li className="flex items-center gap-3">
                            <IconMail size={18} className="text-primary" />
                            <span>support@farminventory.com</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <IconPhone size={18} className="text-primary" />
                            <span>+91 98765 43210</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <IconMapPin size={18} className="text-primary" />
                            <span>Pune, Maharashtra, India</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-gray-800 flex flex-col md:row justify-between items-center gap-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    © {new Date().getFullYear()} Farm Inventory Management System. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
