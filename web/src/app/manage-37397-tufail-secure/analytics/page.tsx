"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, getDocs } from "firebase/firestore";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { TrendingUp, Users, ShoppingCart, Activity } from "lucide-react";

export default function AdminAnalytics() {
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [visitorData, setVisitorData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#CC0000", "#D4AF37", "#1e293b", "#334155", "#475569"];

  useEffect(() => {
    // 1. Fetch Revenue Data (Mocking for now based on orders, usually aggregated)
    const unsubOrders = onSnapshot(collection(db, "orders"), (snap) => {
      const dailyRevenue: any = {};
      snap.docs.forEach(doc => {
        const data = doc.data() as any;
        const date = new Date(data.createdAt?.seconds * 1000).toLocaleDateString("en-PK", { day: '2-digit', month: 'short' });
        if (data.orderStatus === "delivered" || data.orderStatus === "approved") {
          dailyRevenue[date] = (dailyRevenue[date] || 0) + data.totalAmount;
        }
      });
      const formattedRevenue = Object.keys(dailyRevenue).map(date => ({ date, amount: dailyRevenue[date] }));
      setRevenueData(formattedRevenue.slice(-7));
    });

    // 2. Fetch Visitor Data
    const unsubAnalytics = onSnapshot(query(collection(db, "siteAnalytics"), orderBy("date", "desc"), limit(30)), (snap) => {
      const data = snap.docs.map(doc => doc.data()).reverse();
      setVisitorData(data);
    });

    // 3. Top Products (Mock aggregation)
    setTopProducts([
      { name: "Seth Muhammad Tufail Toka", value: 400 },
      { name: "Wheat Thresher 5 FT", value: 300 },
      { name: "Rotavator", value: 200 },
      { name: "Water Pump", value: 100 },
    ]);

    setLoading(false);
    return () => {
      unsubOrders();
      unsubAnalytics();
    };
  }, []);

  const stats = [
    { label: "Total Revenue", value: "Rs. 1.2M", change: "+12%", icon: TrendingUp, color: "text-green-500" },
    { label: "Daily Visitors", value: visitorData[visitorData.length-1]?.totalVisitors || 0, change: "+5%", icon: Activity, color: "text-blue-500" },
    { label: "New Customers", value: "42", change: "+18%", icon: Users, color: "text-purple-500" },
    { label: "Avg. Order Value", value: "Rs. 45k", change: "-2%", icon: ShoppingCart, color: "text-amber-500" },
  ];

  return (
    <div className="space-y-10 bg-[#0f172a] min-h-screen p-8 text-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Business Analytics</h1>
          <p className="text-slate-400">Detailed insights into sales and traffic</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#1e293b] border border-slate-800 rounded-[2rem] p-6 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 bg-slate-900 rounded-2xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-bold ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-[#1e293b] border border-slate-800 rounded-[2.5rem] p-8">
          <h3 className="text-xl font-bold mb-8">Revenue Growth (Daily)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `Rs.${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px" }}
                  itemStyle={{ color: "#fff", fontWeight: "bold" }}
                />
                <Bar dataKey="amount" fill="#CC0000" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Visitor Traffic */}
        <div className="bg-[#1e293b] border border-slate-800 rounded-[2.5rem] p-8">
          <h3 className="text-xl font-bold mb-8">Website Traffic (Last 30 Days)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} hide />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px" }}
                  itemStyle={{ color: "#fff", fontWeight: "bold" }}
                />
                <Line type="monotone" dataKey="totalVisitors" stroke="#D4AF37" strokeWidth={4} dot={false} />
                <Line type="monotone" dataKey="pageViews" stroke="#CC0000" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Products */}
        <div className="bg-[#1e293b] border border-slate-800 rounded-[2.5rem] p-8 lg:col-span-1">
          <h3 className="text-xl font-bold mb-8 text-center">Top Products</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topProducts}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-400">{p.name}</span>
                </div>
                <span className="font-bold">{p.value} units</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-[#1e293b] border border-slate-800 rounded-[2.5rem] p-8 lg:col-span-2">
          <h3 className="text-xl font-bold mb-8">Recent Large Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-xs uppercase tracking-widest border-b border-slate-800">
                  <th className="pb-4 font-black">Entity</th>
                  <th className="pb-4 font-black">Type</th>
                  <th className="pb-4 font-black">Amount</th>
                  <th className="pb-4 font-black">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="group hover:bg-slate-800/50 transition-all">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center font-bold text-xs">A</div>
                        <span className="font-bold">Ahmed Ali</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-slate-400">Dealer</td>
                    <td className="py-4 font-bold text-primary">Rs. 360,000</td>
                    <td className="py-4">
                      <span className="bg-green-500/10 text-green-500 text-[10px] font-black px-3 py-1 rounded-full">VERIFIED</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
