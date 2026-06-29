"use client";

import { IconEye, IconEyeOff, IconPlant, IconArrowLeft, IconMail, IconDeviceMobile, IconMapPin, IconLock, IconCheck, IconTruck, IconUser, IconChevronRight } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

const SignUpPage = () => {
  const [disabled, setDisabled] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    role: "user",
    vehicleType: "",
    address: {
      address: "",
      district: "",
      state: "",
      pincode: "",
    },
    profileImage: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData({ ...formData, profileImage: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const { name, role, email, contact, password, address } = formData;

    // Basic validation
    if (!name || !role || !email || !contact || !password) {
      toast.error("Please fill all the fields");
      return;
    }

    // Role specific validation
    if ((role === "user" || role === "farmer") && (!address.address || !address.district || !address.state || !address.pincode)) {
      toast.error("Complete address is required");
      return;
    }

    if (role === "delivery" && !(formData as any).vehicleType) {
      toast.error("Please select a vehicle type");
      return;
    }

    try {
      const response = axios.post("/api/auth/signup", { formData });
      toast.promise(response, {
        loading: "Creating account...",
        success: (data) => {
          router.push("/login");
          return data.data.message;
        },
        error: (err: any) => err.response?.data?.message || "Error creating account",
      });
      await response;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white overflow-hidden font-sans">
      {/* Left Side: Photo Section */}
      <div className="md:w-1/3 relative hidden md:block group overflow-hidden bg-slate-900">
        <img
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=1200"
          alt="Farming"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[15s]"
        />
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative h-full flex flex-col justify-between p-12 text-white z-10">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <IconArrowLeft size={18} />
            <span className="font-bold text-sm">Back to Home</span>
          </Link>

          <div className="animate-fade-up">
            <h2 className="text-5xl font-black mb-6">
              Grow with us.
            </h2>
            <ul className="space-y-4 font-bold text-gray-200">
              <li className="flex items-center gap-2">
                <IconCheck size={18} className="text-primary" />
                <span>Sell directly to people</span>
              </li>
              <li className="flex items-center gap-2">
                <IconCheck size={18} className="text-primary" />
                <span>Get fast payments</span>
              </li>
              <li className="flex items-center gap-2">
                <IconCheck size={18} className="text-primary" />
                <span>Help rural india</span>
              </li>
            </ul>
          </div>

          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Join our community.</p>
        </div>
      </div>

      {/* Right Side: Simple Registration Form */}
      <div className="w-full md:w-2/3 flex flex-col items-center bg-white min-h-screen px-6 md:px-20 py-20 overflow-y-auto no-scrollbar">
        <div className="max-w-xl w-full animate-fade-in relative z-10 pb-10">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-5xl font-black text-gray-900 mb-2 font-black italic">Sign Up</h1>
            <p className="text-gray-400 font-bold italic">Register your account with simple details below</p>
          </div>

          <div className="space-y-8">
            {/* Select Role */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-3 block italic">Select what you do:</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'farmer', label: 'Farmer', icon: IconPlant },
                  { id: 'delivery', label: 'Delivery', icon: IconTruck },
                  { id: 'user', label: 'Customer', icon: IconUser }
                ].map(role => (
                  <button
                    key={role.id}
                    onClick={() => setFormData({ ...formData, role: role.id })}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${formData.role === role.id ? 'border-primary bg-primary/5 text-primary shadow-lg' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                  >
                    <role.icon size={26} className={formData.role === role.id ? 'text-primary' : 'text-gray-300'} />
                    <span className="text-[11px] font-bold mt-2 uppercase tracking-widest">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center justify-center space-y-4 pt-4">
              <label className="text-xs font-bold text-gray-500 block italic">Profile Picture (Optional):</label>
              <div className="relative group cursor-pointer" onClick={() => document.getElementById('profile-upload')?.click()}>
                <div className="w-24 h-24 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 group-hover:bg-primary/5">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <IconUser size={32} className="text-gray-300 group-hover:text-primary/50" />
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 flex items-center justify-center transition-all">
                  <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 uppercase tracking-tighter">Upload</span>
                </div>
              </div>
              <input 
                id="profile-upload"
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
              />
              {imagePreview && (
                <button 
                  onClick={() => { setImagePreview(null); setFormData({...formData, profileImage: ""}) }}
                  className="text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                >
                  Remove Photo
                </button>
              )}
            </div>

            {/* Form Details */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="text-xs font-bold text-gray-500 mb-2 block">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul More"
                    className="input w-full h-14 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 px-5 font-bold text-gray-800"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-control">
                  <label className="text-xs font-bold text-gray-500 mb-2 block">Mobile Number</label>
                  <input
                    type="text"
                    placeholder="10 digit number"
                    className="input w-full h-14 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 px-5 font-bold text-gray-800"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="text-xs font-bold text-gray-500 mb-2 block">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="input w-full h-14 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 px-5 font-bold text-gray-800"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* Logistics Asset Type */}
              {formData.role === "delivery" && (
                <div className="form-control animate-fade-in">
                  <label className="text-xs font-bold text-gray-500 mb-2 block italic italic">Choose vehicle type:</label>
                  <select
                    className="select select-bordered select-primary w-full h-14 rounded-xl font-bold bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all text-gray-700 italic px-5"
                    value={(formData as any).vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value } as any)}
                  >
                    <option value="">Select Transport</option>
                    <option value="bike">Motorcycle / Bike</option>
                    <option value="scooter">Scooter</option>
                    <option value="van">Delivery Van</option>
                    <option value="truck">Mini Truck</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}

              {/* Address Configuration */}
              {(formData.role === "user" || formData.role === "farmer") && (
                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <label className="text-xs font-bold text-gray-500 mb-2 block">Address Details</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="Your street / area name"
                        className="input w-full h-14 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 px-5 font-bold text-gray-800 shadow-sm"
                        value={formData.address.address}
                        onChange={(e) => setFormData({ ...formData, address: { ...formData.address, address: e.target.value } })}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="District"
                      className="input w-full h-14 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 px-5 font-bold text-gray-800 shadow-sm"
                      value={formData.address.district}
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, district: e.target.value } })}
                    />
                    <input
                      type="text"
                      placeholder="State"
                      className="input w-full h-14 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 px-5 font-bold text-gray-800 shadow-sm"
                      value={formData.address.state}
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      className="input w-full h-14 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 px-5 font-bold text-gray-800 shadow-sm"
                      value={formData.address.pincode}
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, pincode: e.target.value } })}
                    />
                  </div>
                </div>
              )}

              <div className="form-control">
                <label className="text-xs font-bold text-gray-500 mb-2 block">Set Master Password</label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 characters"
                    className="input w-full h-14 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 px-5 pr-14 font-bold text-gray-800 shadow-sm"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <IconEyeOff size={22} /> : <IconEye size={22} />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-4 px-2 pt-6">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary w-6 h-6 rounded-lg mt-1"
                  onChange={() => setDisabled(!disabled)}
                />
                <p className="text-xs font-bold text-gray-400 italic">
                  I state that my details are correct and I agree to use this platform.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                className="btn btn-primary btn-block h-16 rounded-xl text-sm font-bold shadow-lg"
                onClick={handleSubmit}
                disabled={disabled}
              >
                Join Account
              </button>

              <div className="pt-8 mt-10 border-t border-gray-50 text-center">
                <p className="text-sm font-bold text-gray-400 mb-4 opacity-60">Already have account?</p>
                <Link href="/login" className="text-primary font-bold hover:underline">
                  Proceed to Login
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-primary transition-colors">
              <IconArrowLeft size={16} /> Marketplace Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
