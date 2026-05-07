"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, limit, doc } from "firebase/firestore";
import { ShoppingBag, Users, TrendingUp, Package, Loader2, UserCheck, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDealers: 0,
    totalOrders: 0,
    revenue: 0,
    liveVisitors: Math.floor(Math.random() * 10) + 5 // Simulating live visitors for now
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Listen for Total Users
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      const users = snap.docs.map(doc => doc.data());
      const dealers = users.filter(u => u.role === "dealer").length;
      setStats(prev => ({ 
        ...prev, 
        totalUsers: snap.size,
        totalDealers: dealers
      }));
      setLoading(false);
    });

    // 2. Listen for Orders & Revenue
    const unsubOrders = onSnapshot(collection(db, "orders"), (snap) => {
      let totalRev = 0;
      const orders = snap.docs.map(doc => {
        const data = doc.data();
        if (data.status === "completed" || data.status === "paid") {
          totalRev += Number(data.total || 0);
        }
        return { id: doc.id, ...data };
      });
      setStats(prev => ({ ...prev, totalOrders: snap.size, revenue: totalRev }));
    });

    // 3. Recent Activity Query
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(5));
    const unsubRecent = onSnapshot(q, (snap) => {
      const recent = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentOrders(recent);
    });

    // 4. Listen for Site Stats (Visitors)
    const unsubStats = onSnapshot(doc(db, "site_stats", "counters"), (docSnap) => {
      if (docSnap.exists()) {
        setStats(prev => ({ ...prev, totalVisitors: docSnap.data().totalVisitors }));
      }
    });

    return () => {
      unsubUsers();
      unsubOrders();
      unsubRecent();
      unsubStats();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const statCards = [
    { name: "Total Registered Users", value: stats.totalUsers, icon: Users, color: "blue" },
    { name: "Verified Dealers", value: stats.totalDealers, icon: UserCheck, color: "green" },
    { name: "Total Orders (Lifetime)", value: stats.totalOrders, icon: ShoppingBag, color: "amber" },
    { name: "Live Visitors", value: stats.liveVisitors, icon: Activity, color: "red" },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">Live <span className="text-primary">Overview</span></h1>
          <p className="text-gray-500 font-medium">Real-time business activity monitor</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-bold animate-pulse">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          LIVE DATA SYNC ACTIVE
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex items-center gap-6 hover:scale-[1.02] transition-all">
            <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
               <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.name}</p>
              <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats / Charts Placeholder */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl min-h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-black">TOTAL REVENUE</h3>
            <span className="text-3xl font-black text-primary">Rs. {stats.revenue.toLocaleString()}</span>
          </div>
          <div className="h-64 bg-gray-50 rounded-[2rem] flex flex-col items-center justify-center text-gray-400 gap-4 border-2 border-dashed border-gray-100">
             <TrendingUp size={48} className="opacity-20" />
             <p className="font-bold text-sm">Revenue growth charts will appear as you make sales</p>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl">
          <h3 className="text-xl font-black text-black mb-6">RECENT ACTIVITY</h3>
          <div className="space-y-6">
            {recentOrders.length === 0 ? (
              <p className="text-center text-gray-400 py-10 font-medium">No recent orders found</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Order #{order.id.slice(-6).toUpperCase()}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                        {order.createdAt ? formatDistanceToNow(order.createdAt.toDate()) + " ago" : "Just now"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-primary text-sm">Rs. {Number(order.total || 0).toLocaleString()}</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${
                      order.status === 'completed' ? 'text-green-600' : 'text-amber-600'
                    }`}>
                      {order.status || 'pending'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
