"use client";

import { useAuth } from "@/context/AuthProvider";
import { User } from "@/types/Users";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  IconUserCheck,
  IconUserX,
  IconMail,
  IconPhone,
  IconCircleCheck,
  IconHourglassLow,
} from "@tabler/icons-react";

const ManageApprovalsPage = () => {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/farmers");
      if (res.data.success) {
        setApprovals(res.data.users);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch approvals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApproveStatus = async (userId: string, isApproved: boolean) => {
    try {
      const res = axios.post("/api/admin/approve-farmer", {
        farmerId: userId,
        isApproved,
      });

      toast.promise(res, {
        loading: isApproved ? "Approving account..." : "Rejecting account...",
        success: isApproved ? "Account approved" : "Account rejected",
        error: "Failed to update",
      });

      await res;
      fetchApprovals();
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Approve New Users</h1>
          <p className="text-sm font-bold text-gray-400 mt-2">Approve farmers and delivery boys who want to join.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <IconUserCheck size={20} />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900 leading-none">{approvals.length}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total Requests</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-400 p-6">#</th>
                <th className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-400 p-6">User Name</th>
                <th className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-400 p-6 text-center">Role / Status</th>
                <th className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-400 p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <span className="loading loading-ring loading-lg text-primary"></span>
                    <p className="text-xs font-bold text-gray-400 mt-4">Loading list...</p>
                  </td>
                </tr>
              ) : approvals.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <p className="text-xl font-black text-gray-900">No join requests</p>
                    <p className="text-xs font-bold text-gray-400 mt-2">All users are already approved.</p>
                  </td>
                </tr>
              ) : (
                approvals.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-6 font-black text-gray-400 text-xs">
                      {(index + 1)}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-xl border border-gray-100 overflow-hidden shadow-sm bg-primary/10 flex items-center justify-center text-primary font-black">
                            {item.profileImage ? (
                              <img
                                src={item.profileImage}
                                alt={item.name}
                                className="object-cover h-full w-full"
                              />
                            ) : (
                              <span className="text-lg">{item.name[0].toUpperCase()}</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-base">{item.name}</p>
                          <div className="flex flex-col gap-0.5">
                            <p className="text-[10px] font-medium text-gray-400 uppercase">{item.email}</p>
                            <p className="text-[10px] font-medium text-gray-400 uppercase">{item.contact || "No Phone"}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="mb-2">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${item.role === 'farmer' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                          {item.role === 'farmer' ? 'Farmer' : 'Delivery Boy'}
                        </span>
                      </div>
                      {item.isApproved ? (
                        <span className="text-[10px] font-black uppercase text-green-500 bg-green-50 px-3 py-1 rounded-full">Approved</span>
                      ) : (
                        <span className="text-[10px] font-black uppercase text-orange-500 bg-orange-50 px-3 py-1 rounded-full">Pending</span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      {!item.isApproved ? (
                        <button
                          className="btn btn-primary btn-sm h-10 px-6 rounded-lg font-bold uppercase text-[10px]"
                          onClick={() => handleApproveStatus(item._id!, true)}
                        >
                          Approve Him
                        </button>
                      ) : (
                        <button
                          className="btn btn-error btn-sm h-10 px-6 rounded-lg font-bold uppercase text-[10px] text-white"
                          onClick={() => handleApproveStatus(item._id!, false)}
                        >
                          Remove Him
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageApprovalsPage;
