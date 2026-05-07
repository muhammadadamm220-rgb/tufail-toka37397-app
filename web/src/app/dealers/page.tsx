"use client";

import { useState } from "react";
import { Search, MapPin, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import Leaflet map to avoid SSR issues
const DealerMap = dynamic(() => import("@/components/DealerMap"), { ssr: false });

import { useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function DealersPage() {
  const [dealers, setDealers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "dealer"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDealers(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredDealers = dealers.filter(d => 
    (d.city || d.location || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (d.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-bold">Find an <span className="text-primary">Authorized Dealer</span></h1>
          <p className="text-gray-500 font-urdu text-2xl">اپنے شہر میں سیٹھ محمد طفیل کے با اختیار ڈیلر تلاش کریں</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar / Search */}
          <div className="space-y-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by city or name..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-primary outline-none transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="font-bold">Loading Authorized Dealers...</p>
                </div>
              ) : filteredDealers.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 font-bold">No dealers found in this area.</p>
                </div>
              ) : (
                filteredDealers.map((dealer) => (
                  <div key={dealer.id} className="bg-white p-6 rounded-2xl border-2 border-gray-50 hover:border-primary transition-all shadow-sm group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">
                        {dealer.city || dealer.location || "Authorized Dealer"}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {dealer.businessName || dealer.name}
                    </h3>
                    <div className="space-y-2 text-gray-500 text-sm mb-6">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{dealer.address || dealer.city || "Pakistan"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        <span>{dealer.phone || "Contact through WhatsApp"}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {dealer.phone && (
                        <a 
                          href={`tel:${dealer.phone}`}
                          className="flex-1 bg-primary text-white py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                        >
                          <Phone size={16} /> Call
                        </a>
                      )}
                      <a 
                        href={`https://wa.me/${dealer.phone?.replace(/[^0-9]/g, '') || '92418549185'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={16} /> WhatsApp
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="bg-secondary/10 p-8 rounded-3xl border-2 border-secondary/20">
               <h4 className="text-xl font-bold mb-2">Become a Dealer</h4>
               <p className="text-sm text-gray-600 mb-6">Join our network and grow your business with Pakistan's No.1 machinery brand.</p>
               <Link href="/dealers/apply" className="block w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-neutral-800 transition-all text-center">
                  Apply Now
               </Link>
            </div>
          </div>

          <div className="lg:col-span-2 h-[700px] rounded-3xl overflow-hidden border-4 border-gray-100 shadow-inner sticky top-32">
             <DealerMap dealers={dealers} />
          </div>
        </div>
      </div>
    </div>
  );
}
