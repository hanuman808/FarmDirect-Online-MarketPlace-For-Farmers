"use client";

import { IconEye, IconEyeOff, IconPlant, IconArrowLeft, IconMail, IconLock, IconChevronRight } from "@tabler/icons-react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    role: "user",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!formData.role || !formData.email || !formData.password) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
        const response = axios.post("/api/auth/login", { formData });
        toast.promise(response, {
          loading: "Signing in...",
          success: (data: AxiosResponse) => {
            router.push(data.data.route);
            return data.data.message;
          },
          error: (err: any) => {
            console.log(err);
            return err.response?.data?.message || "Login failed";
          },
        });
    } catch (e) {
        console.error(e);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white overflow-hidden">
        {/* Left Side: Image */}
        <div className="md:w-1/2 relative hidden md:block group">
          <img 
            src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1400" 
            alt="AgriFood" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="relative h-full flex flex-col justify-between p-12 text-white z-10">
            <Link href="/" className="flex items-center gap-2 w-fit group/back">
                <IconArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-sm">Back to Home</span>
            </Link>
            
            <div className="animate-fade-up">
              <h2 className="text-6xl font-black leading-tight mb-4">
                Fresh Farm <br /> Products.
              </h2>
              <p className="text-gray-200 text-lg max-w-sm">
                We connect farmers directly to you for fresh and healthy food.
              </p>
            </div>

            <p className="text-sm font-medium text-gray-300">Helping our farmers grow.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white min-h-screen px-6 md:px-20 relative">
          <div className="max-w-md w-full animate-fade-in">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-5xl font-black text-gray-900 mb-2">Login</h1>
              <p className="text-gray-400 font-bold">Welcome back to your account</p>
            </div>

            <div className="space-y-8">
              {/* Role Select */}
              <div>
                <label className="text-xs font-bold text-gray-500 mb-3 block">Select your role:</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {id: 'admin', label: 'Admin'},
                    {id: 'farmer', label: 'Farmer'},
                    {id: 'delivery', label: 'Delivery'},
                    {id: 'user', label: 'Customer'}
                  ].map(role => (
                    <button 
                      key={role.id}
                      onClick={() => setFormData({...formData, role: role.id})}
                      className={`h-14 rounded-xl text-xs font-bold border-2 transition-all ${formData.role === role.id ? 'bg-primary border-primary text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="form-control">
                  <label className="text-xs font-bold text-gray-500 mb-2 block">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input w-full h-14 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 px-5 font-bold text-gray-800"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-control">
                  <label className="text-xs font-bold text-gray-500 mb-2 block">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="input w-full h-14 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 px-5 pr-14 font-bold text-gray-800"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary btn-block h-16 rounded-xl text-sm font-bold shadow-lg"
                onClick={handleSubmit}
              >
                Sign In
              </button>

              <div className="pt-8 text-center border-t border-gray-50">
                <p className="text-sm text-gray-400 mb-4">Don't have an account?</p>
                <Link href="/signup" className="text-primary font-bold hover:underline">
                    Create New Account
                </Link>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default LoginPage;
