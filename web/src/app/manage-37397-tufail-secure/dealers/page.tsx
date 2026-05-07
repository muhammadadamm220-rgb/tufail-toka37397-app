"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit,
  serverTimestamp
} from "firebase/firestore";
import { 
  Store, 
  Plus, 
  Search, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  UserPlus,
  Eye,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminDealers() {
  const [dealers, setDealers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newDealer, setNewDealer] = useState({
    name: "",
    phone: "",
    city: "Faisalabad",
    address: "",
  });

  const pakistanCities = [
    "Faisalabad", "Lahore", "Karachi", "Islamabad", "Multan", 
    "Sialkot", "Gujranwala", "Peshawar", "Quetta", "Sargodha",
    "Bahawalpur", "Sahiwal", "Okara", "Jhang", "Sheikhupura"
  ];

  useEffect(() => {
    const q = query(collection(db, "dealers"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setDealers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleAddDealer = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Creating dealer account...");

    try {
      // 1. Generate Dealer Code
      const dealerCode = `DLR-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // 2. Create the dealer doc in Firestore
      // NOTE: In a real production app, this would trigger a Cloud Function 
      // to create the Firebase Auth user account.
      const dealerId = dealerCode.toLowerCase();
      
      await setDoc(doc(db, "dealers", dealerId), {
        ...newDealer,
        dealerCode,
        createdAt: serverTimestamp(),
        totalOrders: 0,
        totalSales: 0,
        isActive: true,
        assignedBy: auth.currentUser?.uid
      });

      // 3. Create a placeholder user entry with role 'dealer'
      // The dealer will use this code to log in or link their account.
      await setDoc(doc(db, "users", dealerId), {
        name: newDealer.name,
        phone: newDealer.phone,
        city: newDealer.city,
        role: "dealer",
        dealerCode,
        createdAt: serverTimestamp(),
      });

      toast.success(`Dealer ${dealerCode} created successfully!`, { id: loadingToast });
      setShowAddModal(false);
      setNewDealer({ name: "", phone: "", city: "Faisalabad", address: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create dealer.", { id: loadingToast });
    }
  };

  const filteredDealers = dealers.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.dealerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 bg-[#0f172a] min-h-screen p-8 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Store className="text-primary" /> Dealer Network
          </h1>
          <p className="text-slate-400">Manage authorized distributors and sales performance</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search code, name, city..." 
              className="w-full pl-10 pr-4 py-2 bg-[#1e293b] border border-slate-700 rounded-xl outline-none focus:border-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary hover:bg-red-700 px-6 py-2 rounded-xl font-bold transition-all whitespace-nowrap"
          >
            <UserPlus size={20} /> Add Dealer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDealers.map((dealer) => (
          <div key={dealer.id} className="bg-[#1e293b] border border-slate-800 rounded-3xl p-6 hover:border-slate-600 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Store size={24} />
              </div>
              <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full tracking-widest">
                {dealer.dealerCode}
              </span>
            </div>

            <h3 className="text-lg font-bold mb-1">{dealer.name}</h3>
            <div className="space-y-2 mb-6">
              <p className="text-slate-400 text-sm flex items-center gap-2">
                <MapPin size={14} className="text-slate-500" /> {dealer.city}
              </p>
              <p className="text-slate-400 text-sm flex items-center gap-2">
                <Phone size={14} className="text-slate-500" /> {dealer.phone}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Orders</p>
                <p className="font-bold">{dealer.totalOrders || 0}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Total Sales</p>
                <p className="font-bold text-primary">Rs. {(dealer.totalSales || 0).toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 bg-slate-800 hover:bg-slate-700 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                <Eye size={14} /> View History
              </button>
              <button className={`p-2 rounded-xl border ${dealer.isActive ? "border-green-500/20 text-green-500" : "border-red-500/20 text-red-500"}`}>
                {dealer.isActive ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Dealer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1e293b] w-full max-w-lg rounded-[2.5rem] p-8 border border-slate-700 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Add New Authorized Dealer</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <XCircle size={28} />
              </button>
            </div>

            <form onSubmit={handleAddDealer} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Dealer Full Name</label>
                <input 
                  required
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-primary transition-all"
                  placeholder="Enter dealer name"
                  value={newDealer.name}
                  onChange={(e) => setNewDealer({...newDealer, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label>
                  <input 
                    required
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-primary transition-all"
                    placeholder="03XX-XXXXXXX"
                    value={newDealer.phone}
                    onChange={(e) => setNewDealer({...newDealer, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">City</label>
                  <select 
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-primary transition-all"
                    value={newDealer.city}
                    onChange={(e) => setNewDealer({...newDealer, city: e.target.value})}
                  >
                    {pakistanCities.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Area / Address</label>
                <textarea 
                  required
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-primary transition-all h-32 resize-none"
                  placeholder="Specific shop address or area..."
                  value={newDealer.address}
                  onChange={(e) => setNewDealer({...newDealer, address: e.target.value})}
                />
              </div>

              <button className="w-full bg-primary hover:bg-red-700 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                <Store size={24} /> Create Dealer Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
