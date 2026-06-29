"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { IconCircleCheck, IconCircleX, IconLoader2, IconLockOpen, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

const VerifyEmailContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("Verifying your email address, please hold on...");

  const performVerification = async () => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token discovered in page query parameters.");
      return;
    }

    try {
      const res = await axios.post("/api/auth/verify-email", { token });
      if (res.data.success) {
        setStatus("success");
        setMessage(res.data.message);
      } else {
        setStatus("error");
        setMessage(res.data.message || "Email verification failed.");
      }
    } catch (error: any) {
      console.error("Verification page error:", error);
      setStatus("error");
      setMessage(error.response?.data?.message || "An unexpected verification error occurred.");
    }
  };

  useEffect(() => {
    performVerification();
  }, [token]);

  return (
    <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-2xl text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {status === "verifying" && (
        <div className="space-y-6">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto animate-spin">
            <IconLoader2 size={40} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Verifying Email</h2>
            <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest">Security Clearance</p>
            <p className="text-sm text-slate-500 mt-4 leading-relaxed">{message}</p>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-6">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto">
            <IconCircleCheck size={44} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Verified!</h2>
            <p className="text-sm font-bold text-emerald-500 mt-2 uppercase tracking-widest">Onboarding Cleared</p>
            <p className="text-sm text-slate-500 mt-4 leading-relaxed">{message}</p>
          </div>
          <Link href="/login" className="btn btn-primary btn-block h-16 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
            Proceed to Login <IconArrowRight size={16} />
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-6">
          <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mx-auto">
            <IconCircleX size={44} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-rose-800 tracking-tight">Failed</h2>
            <p className="text-sm font-bold text-rose-500 mt-2 uppercase tracking-widest">Onboarding Denied</p>
            <p className="text-sm text-rose-600 mt-4 leading-relaxed bg-rose-50/50 p-4 rounded-xl border border-rose-100 font-bold">{message}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/signup" className="btn btn-primary btn-block h-16 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2">
              Register Again
            </Link>
            <Link href="/" className="btn btn-outline btn-block h-14 rounded-xl font-black uppercase text-[10px] tracking-widest">
              Back to Home
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};

const VerifyEmailPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50/40 p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      <Suspense fallback={
        <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto animate-spin">
            <IconLoader2 size={40} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Preparing Page...</h2>
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
};

export default VerifyEmailPage;
