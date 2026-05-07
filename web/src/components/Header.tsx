"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, MapPin, Globe, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState("ur");
  const { user, userRole, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLang = () => {
    setLang(lang === "en" ? "ur" : "en");
    // In a real app, this would trigger i18n logic
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Bar */}
      <div className="bg-black text-white py-1 px-4 text-sm hidden md:flex justify-between items-center">
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <Phone size={14} className="text-secondary" />
            <span>(041) 8714167</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-secondary" />
            <span>Samundri Road, Faisalabad</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-secondary text-black px-2 py-0.5 rounded font-bold text-xs">
            Govt Reg: 37397
          </span>
          <button 
            onClick={toggleLang}
            className="flex items-center gap-1 hover:text-secondary transition-colors"
          >
            <Globe size={14} />
            <span>{lang === "en" ? "اردو" : "English"}</span>
          </button>
        </div>
      </div>

      {/* Main Nav */}
      <nav className={`px-4 md:px-8 py-4 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg py-2" : "bg-transparent md:bg-white/90 md:backdrop-blur-md"
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-4 group">
            <img 
              src="/trademark-logo.png" 
              alt="Seth M. Tufail Trademark" 
              className="h-16 w-auto drop-shadow-md hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <h1 className="text-primary font-black text-2xl leading-none group-hover:tracking-tight transition-all">
                SETH M. <span className="text-black">TUFAIL</span>
              </h1>
              <p className="text-secondary text-[11px] font-black tracking-[0.25em] leading-none mt-1">
                FOUNDRY (PVT) LTD.
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-bold">
            <Link href="/" className="text-gray-600 hover:text-primary transition-colors text-sm uppercase tracking-wider">Home</Link>
            <Link href="/products" className="text-gray-600 hover:text-primary transition-colors text-sm uppercase tracking-wider">Products</Link>
            <Link href="/calculator" className="text-gray-600 hover:text-primary transition-colors text-sm uppercase tracking-wider">Calculator</Link>
            <Link href="/dealers" className="text-gray-600 hover:text-primary transition-colors text-sm uppercase tracking-wider">Dealers</Link>
            <Link href="/about" className="text-gray-600 hover:text-primary transition-colors text-sm uppercase tracking-wider">About Us</Link>
            
            <div className="h-6 w-px bg-gray-200 mx-2" />

            {!user ? (
              <div className="flex items-center gap-4">
                <Link href="/signin" className="text-gray-600 hover:text-primary transition-colors text-sm uppercase tracking-wider">Sign In</Link>
                <Link href="/signup" className="bg-primary text-white px-8 py-3 rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-primary/20 text-sm">
                  Join Now
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {userRole === "admin" ? (
                  <Link 
                    href="/manage-37397-tufail-secure" 
                    className="bg-primary text-white px-6 py-3 rounded-2xl hover:bg-red-700 transition-all text-xs font-black shadow-lg shadow-primary/20 border border-primary"
                  >
                    ADMIN PANEL
                  </Link>
                ) : userRole === "dealer" ? (
                  <Link 
                    href="/dealer-portal" 
                    className="bg-secondary text-black px-6 py-3 rounded-2xl hover:bg-yellow-500 transition-all text-xs font-black shadow-lg shadow-secondary/20 border border-secondary"
                  >
                    DEALER PORTAL
                  </Link>
                ) : (
                  <Link 
                    href="/dashboard" 
                    className="bg-gray-50 text-gray-900 px-6 py-3 rounded-2xl hover:bg-primary hover:text-white transition-all text-xs border border-gray-100 shadow-inner font-bold"
                  >
                    MY DASHBOARD
                  </Link>
                )}
                
                <button 
                  onClick={signOut}
                  className="p-3 text-gray-400 hover:text-red-600 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 flex flex-col p-8 md:hidden">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
              <img 
                src="/trademark-logo.png" 
                alt="Seth M. Tufail Trademark" 
                className="h-12 w-auto"
              />
              <div className="flex flex-col">
                <span className="text-primary font-black leading-none">SETH M. TUFAIL</span>
                <span className="text-secondary text-[8px] font-black tracking-widest leading-none mt-0.5">FOUNDRY (PVT) LTD.</span>
              </div>
            </Link>
            <button onClick={() => setIsMenuOpen(false)}>
              <X size={32} />
            </button>
          </div>
          <div className="flex flex-col gap-6 text-xl font-semibold">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>
            <Link href="/dealers" onClick={() => setIsMenuOpen(false)}>Find Dealer</Link>
            <Link href="/kisaan-corner" onClick={() => setIsMenuOpen(false)}>Kisaan Corner</Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            <Link href="/order-tracking" onClick={() => setIsMenuOpen(false)} className="text-primary">
              Track Order
            </Link>
            <button 
              onClick={() => { toggleLang(); setIsMenuOpen(false); }}
              className="flex items-center gap-2 text-secondary"
            >
              <Globe /> {lang === "en" ? "اردو" : "English"}
            </button>
          </div>
          <div className="mt-auto pb-8 border-t pt-8">
            <p className="text-gray-500 text-sm">Call Us: (041) 8714167</p>
            <p className="text-gray-500 text-sm">Samundri Road, Faisalabad</p>
          </div>
        </div>
      )}
    </header>
  );
}
