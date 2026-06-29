"use client";

import { IconLock, IconEye, IconEyeOff, IconArrowLeft } from "@tabler/icons-react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

const ResetPasswordForm = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("");
    
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const urlToken = searchParams.get("token");
        setToken(urlToken || "");
    }, [searchParams]);

    const handleSubmit = async () => {
        if (!password || !confirmPassword) {
            toast.error("Please fill all the fields");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }
        if (!token) {
            toast.error("Invalid token. Please use the link from your email.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post("/api/auth/resetpassword", { token, password });
            toast.success(response.data.message);
            router.push("/login");
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-white overflow-hidden">
            {/* Left Side: Image */}
            <div className="md:w-1/2 relative hidden md:block group">
                <img 
                    src="https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&q=80&w=1400" 
                    alt="AgriFood" 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                
                <div className="relative h-full flex flex-col justify-between p-12 text-white z-10">
                    <Link href="/login" className="flex items-center gap-2 w-fit group/back">
                        <IconArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-sm">Back to Login</span>
                    </Link>
                    
                    <div className="animate-fade-up">
                        <h2 className="text-6xl font-black leading-tight mb-4">
                            New <br /> Password.
                        </h2>
                        <p className="text-gray-200 text-lg max-w-sm">
                            Create a strong password to keep your account secure.
                        </p>
                    </div>

                    <p className="text-sm font-medium text-gray-300">Helping our farmers grow.</p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white min-h-screen px-6 md:px-20 relative">
                <div className="max-w-md w-full animate-fade-in">
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-5xl font-black text-gray-900 mb-2">Reset</h1>
                        <p className="text-gray-400 font-bold">Enter your new password below</p>
                    </div>

                    <div className="space-y-6">
                        <div className="form-control">
                            <label className="text-xs font-bold text-gray-500 mb-2 block">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    className="input w-full h-14 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 px-5 font-bold text-gray-800"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="text-xs font-bold text-gray-500 mb-2 block">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    className="input w-full h-14 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 px-5 font-bold text-gray-800"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <IconLock size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                            </div>
                        </div>

                        <button
                            className={`btn btn-primary btn-block h-16 rounded-xl text-sm font-bold shadow-lg mt-4 ${loading ? 'loading' : ''}`}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ResetPasswordPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
};

export default ResetPasswordPage;
