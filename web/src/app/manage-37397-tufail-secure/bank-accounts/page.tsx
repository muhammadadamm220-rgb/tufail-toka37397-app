"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { Plus, Trash2, CheckCircle2, XCircle, Building2, CreditCard } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminBankAccounts() {
  const [banks, setBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    bankName: "",
    accountTitle: "Seth M. Tufail Foundry",
    accountNumber: "",
    branchCode: "",
    ibanNumber: "",
    isActive: true
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "bankAccounts"), (snap) => {
      setBanks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "bankAccounts"), {
        ...form,
        createdAt: serverTimestamp()
      });
      setForm({ ...form, bankName: "", accountNumber: "", branchCode: "", ibanNumber: "" });
      toast.success("Bank account added!");
    } catch (err) {
      toast.error("Failed to add account.");
    }
  };

  const toggleStatus = async (id: string, current: boolean) => {
    await updateDoc(doc(db, "bankAccounts", id), { isActive: !current });
    toast.success("Status updated!");
  };

  const deleteBank = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await deleteDoc(doc(db, "bankAccounts", id));
      toast.success("Account deleted.");
    }
  };

  return (
    <div className="space-y-8 bg-[#1a1a2e] min-h-screen p-8 text-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bank Accounts</h1>
          <p className="text-gray-400">Manage payment destinations for checkout</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Form */}
        <div className="bg-[#16213e] p-8 rounded-[2rem] border border-gray-800 space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <Plus size={24} />
            <h2 className="text-xl font-bold">Add New Account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Bank Name</label>
              <input 
                required
                className="w-full bg-[#1a1a2e] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-primary"
                placeholder="e.g. HBL, Meezan, UBL"
                value={form.bankName}
                onChange={(e) => setForm({...form, bankName: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Account Title</label>
              <input 
                required
                className="w-full bg-[#1a1a2e] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-primary"
                value={form.accountTitle}
                onChange={(e) => setForm({...form, accountTitle: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Account Number</label>
              <input 
                required
                className="w-full bg-[#1a1a2e] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-primary"
                placeholder="XXXX-XXXX-XXXX"
                value={form.accountNumber}
                onChange={(e) => setForm({...form, accountNumber: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Branch Code</label>
                <input 
                  className="w-full bg-[#1a1a2e] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-primary"
                  placeholder="0123"
                  value={form.branchCode}
                  onChange={(e) => setForm({...form, branchCode: e.target.value})}
                />
              </div>
              <div className="space-y-1 flex items-end">
                <label className="flex items-center gap-2 cursor-pointer select-none py-3">
                  <input 
                    type="checkbox" 
                    checked={form.isActive}
                    onChange={(e) => setForm({...form, isActive: e.target.checked})}
                    className="accent-primary w-5 h-5"
                  />
                  <span className="text-sm font-bold">Active</span>
                </label>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">IBAN Number</label>
              <input 
                className="w-full bg-[#1a1a2e] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-primary"
                placeholder="PKXXHBL0XXXXXXXX"
                value={form.ibanNumber}
                onChange={(e) => setForm({...form, ibanNumber: e.target.value})}
              />
            </div>
            <button className="w-full py-4 bg-primary hover:bg-red-700 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
              Save Bank Account
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {banks.map((bank) => (
            <div key={bank.id} className="bg-[#16213e] p-6 rounded-[2rem] border border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#1a1a2e] text-primary rounded-2xl flex items-center justify-center">
                  <Building2 size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{bank.bankName}</h3>
                  <p className="text-gray-400 font-mono text-sm">{bank.accountNumber}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{bank.accountTitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleStatus(bank.id, bank.isActive)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    bank.isActive ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                  }`}
                >
                  {bank.isActive ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  {bank.isActive ? "ACTIVE" : "INACTIVE"}
                </button>
                <button 
                  onClick={() => deleteBank(bank.id)}
                  className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          {banks.length === 0 && !loading && (
            <div className="py-20 text-center text-gray-600 italic border border-dashed border-gray-800 rounded-[2rem]">
              No bank accounts added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
