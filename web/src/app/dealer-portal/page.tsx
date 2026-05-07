"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import { 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from "recharts";

export default function DealerDashboard() {
  const { userData, user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    pending: 0,
    delivered: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Fetch dealer specific orders
    const q = query(
      collection(db, "orders"), 
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const orders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      setRecentOrders(orders.slice(0, 5));

      const totals = orders.reduce((acc, curr: any) => {
        acc.totalSales += curr.totalAmount || 0;
        if (curr.orderStatus === "pending") acc.pending++;
        if (curr.orderStatus === "delivered") acc.delivered++;
        return acc;
      }, { totalSales: 0, pending: 0, delivered: 0 });

      setStats({
        totalOrders: orders.length,
        totalSales: totals.totalSales,
        pending: totals.pending,
        delivered: totals.delivered
      });
    });

    return () => unsub();
  }, [user]);

  const statCards = [
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
    { label: "Total Sales", value: `Rs. ${stats.totalSales.toLocaleString()}`, icon: TrendingUp, color: "bg-green-50 text-green-600" },
    { label: "Pending Orders", value: stats.pending, icon: Clock, color: "bg-amber-50 text-amber-600" },
    { label: "Delivered", value: stats.delivered, icon: CheckCircle2, color: "bg-primary/10 text-primary" },
  ];

  const chartData = [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 2000 },
    { name: "Apr", sales: 2780 },
    { name: "May", sales: 1890 },
    { name: "Jun", sales: 2390 },
  ];

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black">Khush Amdeed, {userData?.name}</h1>
          <p className="text-slate-500">Authorized Dealer Dashboard | {userData?.city}</p>
        </div>
        <Link 
          href="/dealer-portal/products" 
          className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
        >
          <ShoppingBag size={20} /> Place New Order
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black">My Sales Performance</h3>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold outline-none">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="sales" fill="#CC0000" radius={[8, 8, 8, 8]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black">Recent Orders</h3>
            <Link href="/dealer-portal/orders" className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="space-y-6">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    order.orderStatus === "delivered" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                  }`}>
                    <ShoppingBag size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{order.orderId}</p>
                    <p className="text-xs text-slate-500">{new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">Rs. {order.totalAmount?.toLocaleString()}</p>
                  <ArrowUpRight size={16} className="ml-auto text-slate-300 group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p className="text-center text-slate-400 italic text-sm py-10">No orders placed yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
