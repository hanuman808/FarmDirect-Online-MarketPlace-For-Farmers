"use client";

import { IconMail, IconArrowLeft, IconPlant } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email) {
            toast.error("Please enter your email");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post("/api/auth/forgotpassword", { email });
            toast.success(response.data.message);
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
                    src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=1400" 
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
                            Forgot <br /> Password?
                        </h2>
                        <p className="text-gray-200 text-lg max-w-sm">
                            Don't worry, it happens. Enter your email and we'll send you a link to reset it.
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
                        <p className="text-gray-400 font-bold">Enter your registered email address</p>
                    </div>

                    <div className="space-y-8">
                        <div className="form-control">
                            <label className="text-xs font-bold text-gray-500 mb-2 block">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="input w-full h-14 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 px-5 font-bold text-gray-800"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <IconMail size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                            </div>
                        </div>

                        <button
                            className={`btn btn-primary btn-block h-16 rounded-xl text-sm font-bold shadow-lg ${loading ? 'loading' : ''}`}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <div className="pt-8 text-center border-t border-gray-50">
                            <p className="text-sm text-gray-400 mb-4">Remembered your password?</p>
                            <Link href="/login" className="text-primary font-bold hover:underline">
                                Go back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
