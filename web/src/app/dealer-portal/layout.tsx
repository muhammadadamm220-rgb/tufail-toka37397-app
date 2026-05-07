"use client";

import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  History, 
  User, 
  LogOut,
  Store,
  Menu,
  X,
  Home
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function DealerLayout({ children }: { children: React.ReactNode }) {
  const { user, userRole, signOut, userData } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (userRole !== "dealer" && userRole !== "admin") {
    redirect("/signin");
  }

  const navItems = [
    { name: "Dashboard", href: "/dealer-portal", icon: LayoutDashboard },
    { name: "Products", href: "/dealer-portal/products", icon: ShoppingBag },
    { name: "My Orders", href: "/dealer-portal/orders", icon: History },
    { name: "Profile", href: "/dealer-portal/profile", icon: User },
    { name: "Back to Home", href: "/", icon: Home },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-slate-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mb-4">
            <Store size={40} />
          </div>
          <h2 className="font-black text-xl text-center">Authorized Dealer</h2>
          <p className="text-primary font-bold text-xs uppercase tracking-widest mt-1">
            {userData?.dealerCode || "DLR-XXXX"}
          </p>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                pathname === item.href 
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon size={22} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-600 hover:bg-red-50 transition-all w-full"
          >
            <LogOut size={22} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <Store className="text-primary" size={28} />
          <span className="font-black text-lg">Dealer Portal</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600">
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}>
          <aside className="w-72 bg-white h-full p-8 space-y-6" onClick={(e) => e.stopPropagation()}>
            <div className="pb-8 border-b border-slate-100">
              <h2 className="font-black text-xl">Authorized Dealer</h2>
              <p className="text-primary font-bold text-xs">{userData?.dealerCode}</p>
            </div>
            <nav className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-xl font-bold ${
                    pathname === item.href ? "bg-primary text-white" : "text-slate-600"
                  }`}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              ))}
              <button 
                onClick={() => signOut()}
                className="flex items-center gap-4 p-4 rounded-xl font-bold text-red-600 w-full"
              >
                <LogOut size={20} />
                Logout
              </button>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:p-12 p-6 pt-28 lg:pt-12">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
