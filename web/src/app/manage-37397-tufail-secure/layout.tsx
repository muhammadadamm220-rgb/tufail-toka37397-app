"use client";

import AdminRoute from "@/components/AdminRoute";
import AdminPinGate from "@/components/AdminPinGate";
import { useAdminTimeout } from "@/hooks/useAdminTimeout";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  MapPin, 
  Bell, 
  Star,
  LogOut,
  ChevronRight,
  TrendingUp,
  Settings,
  Home
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useAdminTimeout();
  const pathname = usePathname();
  const { signOut, userData } = useAuth();

  const BASE_PATH = "/manage-37397-tufail-secure";

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: BASE_PATH },
    { name: "Orders", icon: ShoppingCart, path: `${BASE_PATH}/orders` },
    { name: "Products", icon: Package, path: `${BASE_PATH}/products` },
    { name: "Users", icon: Users, path: `${BASE_PATH}/users` },
    { name: "Dealers", icon: MapPin, path: `${BASE_PATH}/dealers` },
    { name: "Analytics", icon: TrendingUp, path: `${BASE_PATH}/analytics` },
    { name: "Reviews", icon: Star, path: `${BASE_PATH}/reviews` },
    { name: "Settings", icon: Settings, path: `${BASE_PATH}/bank-accounts` },
    { name: "Back to Home", icon: Home, path: "/" },
  ];

  return (
    <AdminRoute>
      <AdminPinGate>
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
          {/* Sidebar: Dark Navy #0f172a */}
          <aside className="w-72 bg-[#0f172a] text-white flex flex-col shadow-2xl relative z-30">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-xl font-black">S</span>
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tighter leading-none">SETH TUFAIL</h2>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Foundry Admin</span>
                </div>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link 
                      key={item.name} 
                      href={item.path}
                      className={`flex items-center justify-between group px-5 py-4 rounded-2xl font-bold transition-all ${
                        isActive 
                          ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" 
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <item.icon size={20} className={isActive ? "text-white" : "text-gray-500 group-hover:text-primary transition-colors"} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      {isActive && <ChevronRight size={16} />}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mt-auto p-8 border-t border-white/5 space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-black font-black">
                  {userData?.name?.charAt(0) || "A"}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold truncate">{userData?.name || "Admin User"}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Super Admin</p>
                </div>
              </div>
              
              <button 
                onClick={signOut}
                className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
              >
                <LogOut size={16} /> Sign Out System
              </button>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 relative z-20">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-black text-black">
                  {menuItems.find(m => m.path === pathname)?.name || "Dashboard"}
                </h1>
                <div className="h-6 w-[2px] bg-gray-100 mx-2" />
                <p className="text-gray-400 text-sm font-medium">Welcome back, Seth Sahab!</p>
              </div>

              <div className="flex items-center gap-6">
                <button className="relative p-2 text-gray-400 hover:text-primary transition-colors">
                  <Bell size={22} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white" />
                </button>
                <div className="h-8 w-[1px] bg-gray-100" />
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">Status</p>
                    <p className="text-sm font-bold text-green-500">System Live</p>
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1 p-10 overflow-y-auto bg-[#f8fafc] custom-scrollbar">
              {children}
            </main>
          </div>
        </div>
      </AdminPinGate>
    </AdminRoute>
  );
}
