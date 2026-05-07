"use client";

import { useAuth } from "@/context/AuthContext";
import { User, Mail, Shield, MapPin, Calendar, Store, Edit, Loader2 } from "lucide-react";

export default function DealerProfile() {
  const { userData, user } = useAuth();

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-black text-black uppercase tracking-tight">Dealer <span className="text-primary">Profile</span></h1>
        <p className="text-gray-500 font-medium">Manage your professional information and credentials</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-primary/10 rounded-[3rem] flex items-center justify-center text-primary mb-6">
              <User size={64} />
            </div>
            <h2 className="text-2xl font-black text-black uppercase">{userData.name || "Dealer Name"}</h2>
            <p className="text-primary font-bold text-sm tracking-[0.2em] mt-2">AUTHORIZED DEALER</p>
            
            <div className="w-full h-px bg-gray-50 my-8" />
            
            <div className="space-y-4 w-full text-left">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <Shield className="text-gold" size={20} />
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dealer Code</p>
                  <p className="font-bold text-gray-900">{userData.dealerCode || "Pending Verification"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-black uppercase tracking-tight">Personal Details</h3>
              <button className="flex items-center gap-2 px-6 py-2 bg-gray-50 text-gray-600 rounded-full text-xs font-black hover:bg-gray-100 transition-all uppercase tracking-widest">
                <Edit size={14} /> Edit Info
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</p>
                <div className="flex items-center gap-3 text-gray-900 font-bold">
                  <User size={18} className="text-primary" />
                  {userData.name}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                <div className="flex items-center gap-3 text-gray-900 font-bold">
                  <Mail size={18} className="text-primary" />
                  {user?.email}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Business Location</p>
                <div className="flex items-center gap-3 text-gray-900 font-bold">
                  <MapPin size={18} className="text-primary" />
                  {userData.location || "Faisalabad, Pakistan"}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Joining Date</p>
                <div className="flex items-center gap-3 text-gray-900 font-bold">
                  <Calendar size={18} className="text-primary" />
                  {userData.createdAt?.toDate ? userData.createdAt.toDate().toLocaleDateString() : 'Active since May 2024'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <h3 className="text-xl font-black uppercase tracking-widest">Official Registration</h3>
              <p className="text-gray-400 font-medium">As a Seth M. Tufail certified dealer, you are authorized to sell genuine machinery under Registration No. <span className="text-gold font-bold">37397</span>.</p>
              <div className="pt-4">
                <span className="px-6 py-2 bg-gold text-black rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Verified Partner</span>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
