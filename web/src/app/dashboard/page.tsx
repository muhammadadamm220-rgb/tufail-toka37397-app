"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { 
  Package, 
  MessageCircle, 
  Download, 
  Clock, 
  Star, 
  Copy,
  ChevronRight,
  LogOut
} from "lucide-react";
import { toast } from "react-hot-toast";
import { generateInvoice } from "@/lib/pdfService";

export default function UserDashboard() {
  const { user, userData, signOut } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "orders"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      setOrders(data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const sendWhatsAppReminder = (order: any) => {
    const msg = encodeURIComponent(
      `Assalam o Alaikum!\n\n` +
      `Mera naam: ${userData.name}\n` +
      `Order ID: ${order.orderId}\n\n` +
      `Mera order 24 ghante se zyada se pending hai.\n` +
      `Payment screenshot submit kar di thi.\n` +
      `Kripya confirm karein.\n\n` +
      `Seth M. Tufail Foundry Website`
    );
    window.open(`https://wa.me/923008549185?text=${msg}`, "_blank");
  };

  const isPendingLongerThan24h = (timestamp: any) => {
    if (!timestamp) return false;
    const orderDate = timestamp.seconds * 1000;
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    return orderDate <= twentyFourHoursAgo;
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(userData?.referralCode || "");
    toast.success("Referral code copied!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Profile Header */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-primary text-white rounded-3xl flex items-center justify-center text-3xl font-black shadow-xl shadow-primary/20">
            {userData?.name?.[0]}
          </div>
          <div>
            <h1 className="text-3xl font-black text-black">{userData?.name}</h1>
            <p className="text-gray-500 font-medium">{userData?.email}</p>
            <div className="flex gap-4 mt-2">
              <span className="text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-widest border border-primary/10">
                {userData?.role}
              </span>
              <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-widest border border-gray-100">
                {userData?.city}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 relative z-10 w-full md:w-auto">
          <div className="flex-1 md:w-48 bg-gray-50 rounded-3xl p-6 border border-gray-100 text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Loyalty Points</p>
            <div className="flex items-center justify-center gap-2 text-primary">
              <Star size={18} fill="currentColor" />
              <span className="text-3xl font-black">{userData?.loyaltyPoints || 0}</span>
            </div>
          </div>
          <button 
            onClick={() => signOut()}
            className="w-16 h-full bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-3xl border border-gray-100 transition-all flex items-center justify-center"
          >
            <LogOut size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Referral Box */}
        <div className="bg-secondary rounded-[2rem] p-8 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <Copy size={80} />
          </div>
          <h3 className="text-xl font-bold mb-2">Invite & Earn</h3>
          <p className="text-white/70 text-sm mb-6">Share your code with other farmers and get bonus points on their first order!</p>
          <div className="bg-white/10 rounded-2xl p-4 flex items-center justify-between border border-white/10">
            <code className="text-lg font-black tracking-widest">{userData?.referralCode}</code>
            <button onClick={copyReferral} className="p-2 hover:bg-white/10 rounded-lg transition-all">
              <Copy size={20} />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 flex items-center gap-6">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Package size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase">Total Orders</p>
              <p className="text-2xl font-black">{orders.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 flex items-center gap-6">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
              <Star size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase">Points Status</p>
              <p className="text-2xl font-black">Platinum</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">My Order History</h2>
          <button className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View All <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-[2rem] border border-gray-100 p-6 md:p-8 hover:shadow-lg transition-all group">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{order.orderId}</span>
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      order.orderStatus === "pending" ? "bg-yellow-100 text-yellow-600" :
                      order.orderStatus === "approved" ? "bg-blue-100 text-blue-600" :
                      order.orderStatus === "delivered" ? "bg-green-100 text-green-600" :
                      "bg-red-100 text-red-600"
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-lg group-hover:text-primary transition-colors">
                      {order.items.map((it: any) => it.name).join(", ")}
                    </h4>
                    <p className="text-gray-500 text-sm">Placed on {new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                  </div>

                  {order.orderStatus === "pending" && isPendingLongerThan24h(order.createdAt) && (
                    <div className="bg-red-50 p-4 rounded-2xl border border-red-100 space-y-3">
                      <p className="text-red-600 text-sm font-urdu font-bold leading-relaxed">
                        آپ کا آرڈر 24 گھنٹے سے زیادہ وقت سے زیر التواء ہے — اگر ابھی تک approve نہیں ہوا تو براہ کرم WhatsApp پر رابطہ کریں
                      </p>
                      <button 
                        onClick={() => sendWhatsAppReminder(order)}
                        className="flex items-center gap-2 text-red-600 font-bold text-sm hover:underline"
                      >
                        <MessageCircle size={18} /> Send WhatsApp Reminder
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8 lg:pl-12">
                  <div className="text-right">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-2xl font-black text-black">
                      <span className="text-sm font-medium mr-1">Rs.</span>
                      {order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => generateInvoice(order)}
                    className="flex items-center gap-2 bg-gray-50 hover:bg-primary hover:text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-inner"
                  >
                    <Download size={16} /> PDF Invoice
                  </button>
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && !loading && (
            <div className="py-24 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
              <Clock size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-400 font-medium">No orders found yet. Time to get some machinery!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
