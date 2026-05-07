"use client";

import { useState } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, updateDoc, getDoc, setDoc, collection, addDoc, serverTimestamp, deleteDoc, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ShieldCheck, Loader2, AlertTriangle, CheckCircle, Package } from "lucide-react";
import { useRouter } from "next/navigation";

const initialProducts = [
  {
    name: "Seth Muhammad Tufail Toka No.1",
    price: 48500,
    category: "Toka",
    regNo: "37397",
    description: "The original No.1 Toka machine since decades. High performance and durability.",
    images: ["https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop"]
  },
  {
    name: "Tufail Toka",
    price: 42000,
    category: "Toka",
    regNo: "313436",
    description: "Premium Tufail Toka machine for efficient fodder cutting.",
    images: ["https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop"]
  },
  {
    name: "Seth Toka",
    price: 38500,
    category: "Toka",
    regNo: "68828",
    description: "Standard Seth Toka model, reliable and cost-effective.",
    images: ["https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop"]
  },
  {
    name: "Nagin Toka",
    price: 35000,
    category: "Toka",
    regNo: "72654",
    description: "Nagin Toka - Lightweight and high-speed operation.",
    images: ["https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop"]
  },
  {
    name: "Wheat Thresher 5 FT",
    price: 1250000,
    category: "Thresher",
    regNo: "37397",
    description: "Heavy duty wheat thresher for large scale farming operations.",
    images: ["https://images.unsplash.com/photo-1594436841263-0b043236e768?q=80&w=800&auto=format&fit=crop"]
  },
  {
    name: "Rotavator / Rotary Tiller",
    price: 380000,
    category: "Tillage",
    regNo: "37397",
    description: "Premium rotavator for perfect soil preparation.",
    images: ["https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?q=80&w=800&auto=format&fit=crop"]
  }
];

export default function AdminSetupPage() {
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const claimAdminRole = async () => {
    setLoading(true);
    setStatus("idle");
    setMessage("");

    const user = auth.currentUser;
    if (!user) {
      setStatus("error");
      setMessage("Pehle sign in karein! Visit /signin page.");
      setLoading(false);
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      
      // We use setDoc with merge: true so it creates the doc if missing,
      // or updates it if it exists, without overwriting other fields.
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "Admin User",
        role: "admin",
        emailVerified: true,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setStatus("success");
      setMessage("Mubarak ho! Aap ab Admin hain. Ab aap Admin Panel access kar sakte hain.");
      setTimeout(() => router.push("/manage-37397-tufail-secure"), 2000);
    } catch (err: any) {
      setStatus("error");
      setMessage("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const seedProducts = async () => {
    setSeeding(true);
    try {
      for (const product of initialProducts) {
        await addDoc(collection(db, "products"), {
          ...product,
          createdAt: serverTimestamp()
        });
      }
      setStatus("success");
      setMessage("Products seeded successfully! Go to home page to see them.");
    } catch (err: any) {
      setStatus("error");
      setMessage("Error seeding products: " + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const clearProducts = async () => {
    if (!confirm("Are you sure? This will delete all products from the database!")) return;
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "products"));
      const deletePromises = snap.docs.map(document => deleteDoc(doc(db, "products", document.id)));
      await Promise.all(deletePromises);
      setStatus("success");
      setMessage("All products cleared successfully!");
    } catch (err: any) {
      setStatus("error");
      setMessage("Error clearing products: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center space-y-8">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
          <ShieldCheck size={40} />
        </div>
        
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">Admin <span className="text-primary">Setup</span></h1>
          <p className="text-gray-500 mt-2 font-medium">Promote your account to Super Admin</p>
        </div>

        {status === "success" && (
          <div className="bg-green-50 text-green-700 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-green-100">
            <CheckCircle className="shrink-0" />
            <p>{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100">
            <AlertTriangle className="shrink-0" />
            <p>{message}</p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Logged in as:</p>
          <p className="font-bold text-gray-800">{auth.currentUser?.email || "Not Signed In"}</p>
        </div>

        <button
          onClick={claimAdminRole}
          disabled={loading}
          className="w-full bg-primary hover:bg-red-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
          PROMOTE ME TO ADMIN
        </button>

        <div className="pt-4 border-t border-gray-100 space-y-4">
          <button
            onClick={seedProducts}
            disabled={seeding}
            className="w-full bg-black hover:bg-gray-800 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {seeding ? <Loader2 className="animate-spin" /> : <Package size={20} />}
            SEED TOKA MACHINES
          </button>

          <button
            onClick={clearProducts}
            disabled={loading}
            className="w-full bg-white border border-red-200 text-red-500 hover:bg-red-50 font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading && status !== "success" ? <Loader2 className="animate-spin" /> : <AlertTriangle size={18} />}
            CLEAR ALL PRODUCTS
          </button>
        </div>

        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          This is a development tool. Remove this page before production.
        </p>
      </div>
    </div>
  );
}
