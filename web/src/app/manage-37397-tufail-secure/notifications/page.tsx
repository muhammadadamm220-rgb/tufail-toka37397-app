"use client";

import { useState } from "react";
import { 
  Bell, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Mail,
  Smartphone,
  Trash2,
  Settings,
  ShoppingCart,
  Users
} from "lucide-react";

export default function NotificationsAdmin() {
  const [activeTab, setActiveTab] = useState("all");

  const notifications = [
    {
      id: 1,
      title: "New Order Received",
      message: "Order #7829 for Seth Toka has been placed by Ahmed Khan.",
      type: "order",
      time: "5 mins ago",
      status: "unread",
      priority: "high"
    },
    {
      id: 2,
      title: "Dealer Application",
      message: "Zubair Agricultural Tools applied for a dealer license in Multan.",
      type: "dealer",
      time: "2 hours ago",
      status: "unread",
      priority: "medium"
    },
    {
      id: 3,
      title: "Low Inventory Alert",
      message: "Stock for 'Wheat Thresher 5 FT' is below threshold (2 units left).",
      type: "inventory",
      time: "1 day ago",
      status: "read",
      priority: "critical"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-black">SYSTEM <span className="text-primary">NOTIFICATIONS</span></h1>
          <p className="text-gray-500 font-medium mt-1">Keep track of orders, dealer requests, and system alerts</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all">
            <Settings size={18} />
            Configure Alerts
          </button>
          <button className="bg-black text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/10">
            Mark All Read
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-full md:w-auto">
          {["all", "unread", "orders", "alerts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-gray-400 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search notifications..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-8 flex gap-6 hover:bg-gray-50/50 transition-all cursor-pointer relative group ${
                notif.status === "unread" ? "bg-primary/[0.02]" : ""
              }`}
            >
              {notif.status === "unread" && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
              )}
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                notif.type === "order" ? "bg-blue-50 text-blue-500" :
                notif.type === "dealer" ? "bg-purple-50 text-purple-500" :
                "bg-red-50 text-red-500"
              }`}>
                {notif.type === "order" ? <ShoppingCart size={24} /> :
                 notif.type === "dealer" ? <Users size={24} /> :
                 <AlertCircle size={24} />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-black text-lg ${notif.status === "unread" ? "text-black" : "text-gray-600"}`}>
                    {notif.title}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                      <Clock size={12} />
                      {notif.time}
                    </div>
                    <button className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-500 leading-relaxed max-w-2xl">{notif.message}</p>
                
                <div className="flex items-center gap-4 pt-3">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                    notif.priority === "critical" ? "bg-red-100 text-red-600" :
                    notif.priority === "high" ? "bg-orange-100 text-orange-600" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {notif.priority} Priority
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-primary hover:text-white transition-all">
                      <Mail size={14} />
                    </button>
                    <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-black hover:text-white transition-all">
                      <Smartphone size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State Mockup */}
        {notifications.length === 0 && (
          <div className="py-32 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
              <Bell size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-300 uppercase tracking-tighter">Everything is Quiet</h3>
            <p className="text-gray-400 mt-2">No new notifications for you right now.</p>
          </div>
        )}
      </div>

      {/* Notification Channel Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        <div className="bg-gradient-to-br from-black to-gray-800 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-4">
            <h4 className="text-xl font-bold">Email Alerts Active</h4>
            <p className="text-gray-400 text-sm">All order updates are currently being sent to info@sethmtufail.com</p>
            <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-bold text-xs transition-all backdrop-blur">
              Update Preferences
            </button>
          </div>
          <Mail className="absolute -bottom-6 -right-6 text-white/5 w-40 h-40" />
        </div>
        <div className="bg-gradient-to-br from-primary to-red-700 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="relative z-10 space-y-4">
            <h4 className="text-xl font-bold">SMS Notifications</h4>
            <p className="text-white/80 text-sm">Urgent alerts are sent to +92 (041) 8714167</p>
            <button className="bg-black/20 hover:bg-black/30 text-white px-6 py-3 rounded-2xl font-bold text-xs transition-all backdrop-blur">
              Manage Mobile Numbers
            </button>
          </div>
          <Smartphone className="absolute -bottom-6 -right-6 text-white/5 w-40 h-40" />
        </div>
      </div>
    </div>
  );
}
