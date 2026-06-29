"use client";

import { useAuth } from "@/context/AuthProvider";
import { 
  IconUser, 
  IconMail, 
  IconShieldCheck, 
  IconActivity, 
  IconDeviceLaptop, 
  IconLock,
  IconFingerprint
} from "@tabler/icons-react";
import Link from "next/link";

const AdminProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10 animate-in fade-in duration-700">
      
      {/* Welcome banner */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-200">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <IconFingerprint size={180} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Security Node clearance</p>
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-none mb-4">Profile.</h1>
            <p className="text-sm font-bold text-slate-400 max-w-md">Manage your account credentials, security clearance keys, and environment stats.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Left Side: Account Info Card */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-primary/20 mb-6 relative">
            {user.name?.[0]?.toUpperCase() || "A"}
            <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center border-4 border-white">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{user.name || "System Admin"}</h2>
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1.5">{user.role || "Administrator"}</p>
          
          <div className="w-full border-t border-slate-50 mt-8 pt-8 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <IconMail className="text-slate-300" size={18} />
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Email Address</p>
                <p className="text-xs font-bold text-slate-700 mt-0.5">{user.email || "admin@example.com"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IconShieldCheck className="text-slate-300" size={18} />
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Clearance Status</p>
                <p className="text-xs font-bold text-emerald-600 mt-0.5">Verified Root Node</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Security Clearance & Active Configurations */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Security Credentials</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Cryptographic key details and permission scopes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase">
                  <span>Scope Permission</span>
                  <IconLock size={14} />
                </div>
                <p className="text-base font-black text-slate-800 mt-2">FULL_ACCESS</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Root control over farmers, deliveries, and transactions</p>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase">
                  <span>Authentication</span>
                  <IconFingerprint size={14} />
                </div>
                <p className="text-base font-black text-slate-800 mt-2">JWT_SHA256_SEAL</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Dynamic 24h expiration cookie session tokens</p>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase">
                  <span>Logistics Sync</span>
                  <IconActivity size={14} />
                </div>
                <p className="text-base font-black text-slate-800 mt-2">ON_LOGS_FLOW</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Linked directly with MongoDB inventory triggers</p>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase">
                  <span>System Env</span>
                  <IconDeviceLaptop size={14} />
                </div>
                <p className="text-base font-black text-slate-800 mt-2">production_ready</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Running secure server instances cleanly</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-700">
               <IconShieldCheck size={80} />
            </div>
            <div className="relative z-10 text-center md:text-left">
              <h4 className="text-xl font-black mb-1">Administrative Privileges</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">All system operations are monitored for fraud mitigation audits.</p>
            </div>
            <Link href="/admin/analytics" className="relative z-10 btn btn-primary h-12 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-md">
              Audit Dashboard
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminProfilePage;
