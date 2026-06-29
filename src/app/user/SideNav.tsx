"use client";
import ThemeToggler from "@/components/Navbar/ThemeToggler";
import { SideNavItem } from "@/types/types";
import { SIDENAV_ITEMS } from "./constant";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import {
  IconChevronDown,
  IconChevronRight,
  IconMenu,
  IconPlant,
  IconLeaf,
  IconBasket,
} from "@tabler/icons-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthProvider";

const SideNav = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user } = useAuth();
  const handleLogout = async () => {
    const res = axios.get("/api/auth/logout");
    toast.promise(res, {
      loading: "Logging out...",
      success: "Logged out successfully",
      error: "Error logging out",
    });
    router.push("/");
  };
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  if (!user) return null;

  return (
    <>
      <div className="drawer lg:drawer-open max-h-screen">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col bg-base-200">
          {/* Top Navbar */}
          <div className="navbar justify-between bg-base-100 border-b border-base-300 w-full px-4 lg:px-10 h-20">
            <div className="flex items-center gap-4">
              <div className="lg:hidden">
                <label
                  htmlFor="my-drawer-3"
                  aria-label="open sidebar"
                  className="btn btn-square btn-ghost text-base-content"
                >
                  <IconMenu className="h-6 w-6" />
                </label>
              </div>
              <div className="hidden lg:flex items-center space-x-2 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                <span>Consumer Portal</span>
                <IconChevronRight size={14} />
                {pathSegments.map((segment, index) => (
                  <React.Fragment key={index}>
                    <Link href={`/${pathSegments.slice(0, index + 1).join("/")}`}>
                      <span className="text-primary hover:text-primary/70 transition capitalize">
                        {segment.replace(/-/g, " ")}
                      </span>
                    </Link>
                    {index < pathSegments.length - 1 && <IconChevronRight size={14} />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <ThemeToggler />
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="flex items-center gap-3 hover:bg-base-200 p-2 rounded-2xl transition-colors">
                  <div className="flex flex-col items-end hidden md:flex">
                    <span className="text-sm font-black text-base-content leading-none">{user.name}</span>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Consumer</span>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden shadow-sm bg-primary flex items-center justify-center text-white font-black">
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt="Avatar"
                        width={40}
                        height={40}
                        className="object-cover h-full w-full"
                      />
                    ) : (
                      <span className="text-sm">{user.name[0].toUpperCase()}</span>
                    )}
                  </div>
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-2xl z-[1] w-64 p-4 shadow-xl border border-base-300 mt-4 space-y-2">
                  <div className="flex items-center gap-4 p-2 mb-2">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-base-content">{user.name}</p>
                      <p className="text-xs font-bold text-base-content/60">{user.email}</p>
                    </div>
                  </div>
                  <hr className="border-base-200" />
                  <li><Link href="/user/profile" className="font-bold text-base-content hover:bg-base-200 rounded-xl py-3">My account</Link></li>
                  <li><button onClick={handleLogout} className="font-bold text-red-500 hover:bg-red-50/10 rounded-xl py-3 text-left w-full">Logout</button></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <main className="overflow-y-auto h-[calc(100vh-5rem)] p-6 lg:p-10 text-base-content">
            {children}
          </main>
        </div>

        {/* Sidebar */}
        <div className="drawer-side z-40">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <div className="bg-base-100 border-r border-base-300 w-80 min-h-full p-6 flex flex-col">
            <Link href="/user/dashboard" className="flex items-center gap-3 px-4 mb-12">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <IconPlant size={24} />
              </div>
              <h1 className="text-2xl font-black tracking-tighter">
                <span className="text-primary">AGRI</span>
                <span className="text-base-content">FOOD</span>
              </h1>
            </Link>

            <div className="flex-1 space-y-2">
              <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-base-content/40 mb-6">Shopping Menu</p>
              {SIDENAV_ITEMS.map((item, idx) => (
                <MenuItem key={idx} item={item} />
              ))}
            </div>

            <div className="mt-auto pt-6">
              <div className="bg-accent/10 rounded-[2rem] p-6 text-center border border-accent/20">
                <IconBasket className="mx-auto text-accent mb-3" size={32} />
                <p className="text-sm font-black text-base-content mb-1">Local & Fresh</p>
                <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-widest leading-relaxed">You are supporting 14 direct-to-consumer farms.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  const baseClasses =
    "flex w-full flex-row items-center justify-between rounded-xl p-3 transition-all duration-200 font-bold";
  const activeClasses = "bg-primary text-white shadow-lg shadow-primary/20";
  const inactiveClasses =
    "text-gray-500 hover:text-primary hover:bg-primary/5";

  return (
    <div className="px-2">
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`${baseClasses} ${pathname.includes(item.path) ? activeClasses : inactiveClasses
              }`}
          >
            <div className="flex flex-row items-center space-x-4">
              {item.icon}
              <span className="text-sm tracking-tight">{item.title}</span>
            </div>

            <div
              className={`transition-transform duration-200 ${subMenuOpen ? "rotate-180" : ""
                } flex`}
            >
              <IconChevronDown width="20" height="20" />
            </div>
          </button>

          {subMenuOpen && (
            <div className="mt-2 ml-10 flex flex-col space-y-1">
              {item.subMenuItems?.map((subItem, idx) => (
                <Link
                  key={idx}
                  href={subItem.path}
                  className={`block rounded-xl p-3 text-xs font-bold transition-colors ${subItem.path === pathname
                    ? "text-primary bg-primary/10"
                    : "text-gray-400 hover:text-primary hover:bg-primary/5"
                    }`}
                >
                  <span>{subItem.title}</span>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`${baseClasses} ${item.path === pathname ? activeClasses : inactiveClasses
            }`}
        >
          <div className="flex flex-row items-center space-x-4">
            {item.icon}
            <span className="text-sm tracking-tight">{item.title}</span>
          </div>
        </Link>
      )}
    </div>
  );
};

export default SideNav;
