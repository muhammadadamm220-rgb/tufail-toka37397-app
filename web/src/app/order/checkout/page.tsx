"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { db, storage } from "@/lib/firebase";
import { collection, query, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useDropzone } from "react-dropzone";
import { 
  Building2, 
  CreditCard, 
  Copy, 
  UploadCloud, 
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  ShoppingBag
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { user, userData, userRole } = useAuth();
  const { cart, totalAmount, clearCart } = useCart();
  const router = useRouter();
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [activeBank, setActiveBank] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/products");
    }
  }, [cart, router]);

  useEffect(() => {
    const fetchBanks = async () => {
      const q = query(collection(db, "bankAccounts"));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter((b: any) => b.isActive);
      setBankAccounts(data);
      if (data.length > 0) setActiveBank(data[0]);
    };
    fetchBanks();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': [] },
    multiple: false 
  });

  const handleCheckout = async () => {
    if (!screenshot) {
      toast.error("Pehle payment screenshot upload karein!");
      return;
    }

    setUploading(true);
    const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // 1. Upload Screenshot to Storage
      const storageRef = ref(storage, `payment-screenshots/${orderId}/${screenshot.name}`);
      await uploadBytes(storageRef, screenshot);
      const screenshotURL = await getDownloadURL(storageRef);

      // 2. Create Order in Firestore
      await addDoc(collection(db, "orders"), {
        orderId,
        userId: user?.uid || "guest",
        userRole: userRole || "customer",
        dealerId: (userRole === "dealer" && userData?.dealerCode) ? userData.dealerCode : null,
        customerName: userData?.name || user?.displayName || "Unknown Customer",
        customerPhone: userData?.phone || "",
        customerCity: userData?.city || "",
        customerEmail: userData?.email || user?.email || "No Email",
        items: cart,
        totalAmount,
        deliveryAddress: userData?.address || userData?.savedAddresses?.[0] || userData?.city || "Will call",
        paymentMethod: "bank_transfer",
        paymentScreenshotURL: screenshotURL,
        paymentStatus: "screenshot_submitted",
        orderStatus: "pending",
        whatsappReminderSent: false,
        createdAt: serverTimestamp(),
        statusHistory: [{
          status: "pending",
          timestamp: new Date().toISOString(),
          note: "Order submitted with payment proof"
        }]
      });

      toast.success("Order submitted successfully!");
      clearCart();
      router.push(userRole === "dealer" ? "/dealer-portal/orders" : "/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Checkout failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left Side: Payment Instructions */}
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-black">
            {userRole === "dealer" ? "Dealer " : ""}Complete Your <span className="text-primary">Payment</span>
          </h1>
          <p className="text-gray-500 font-urdu text-xl">براہ کرم بینک ٹرانسفر کے بعد اسکرین شاٹ اپ لوڈ کریں</p>
          {userRole === "dealer" && (
            <span className="inline-block bg-gold/10 text-gold px-4 py-1 rounded-full text-xs font-black border border-gold/20 uppercase tracking-widest">
              Authorized Dealer Order
            </span>
          )}
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-primary p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 size={24} />
              <span className="font-bold tracking-widest uppercase text-sm">Select Bank Account</span>
            </div>
          </div>
          
          <div className="p-2 flex gap-2 overflow-x-auto bg-gray-50">
            {bankAccounts.map((bank) => (
              <button 
                key={bank.id}
                onClick={() => setActiveBank(bank)}
                className={`flex-shrink-0 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeBank?.id === bank.id ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {bank.bankName}
              </button>
            ))}
          </div>

          {activeBank && (
            <div className="p-8 space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
                <div className="flex justify-between items-center group">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Title</p>
                    <p className="text-lg font-bold">{activeBank.accountTitle}</p>
                  </div>
                  <button onClick={() => copyToClipboard(activeBank.accountTitle)} className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white rounded-lg transition-all">
                    <Copy size={16} />
                  </button>
                </div>
                
                <div className="flex justify-between items-center group">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Number</p>
                    <p className="text-2xl font-black tracking-tighter">{activeBank.accountNumber}</p>
                  </div>
                  <button onClick={() => copyToClipboard(activeBank.accountNumber)} className="p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20">
                    <Copy size={20} />
                  </button>
                </div>

                {activeBank.ibanNumber && (
                  <div className="flex justify-between items-center group pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">IBAN Number</p>
                      <p className="text-xs font-mono">{activeBank.ibanNumber}</p>
                    </div>
                    <button onClick={() => copyToClipboard(activeBank.ibanNumber)} className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white rounded-lg transition-all">
                      <Copy size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <ShieldCheck className="text-blue-600 shrink-0" size={24} />
                <p className="text-blue-800 text-sm leading-relaxed font-urdu">
                  اپنا آرڈر ID بینک ٹرانزیکشن کی تفصیل میں لازمی لکھیں۔
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Upload & Order Summary */}
      <div className="space-y-8">
        <div className="bg-black text-white rounded-[2rem] p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
          <h2 className="text-2xl font-black relative z-10 flex items-center gap-2">
            <ShoppingBag className="text-primary" /> Order Summary
          </h2>
          <div className="space-y-4 relative z-10 max-h-48 overflow-y-auto pr-4 custom-scrollbar">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">{item.name} × {item.quantity}</span>
                <span className="font-bold">Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-white/10 flex justify-between items-center relative z-10">
            <span className="text-xl font-bold">Grand Total</span>
            <span className="text-3xl font-black text-primary">Rs. {totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <UploadCloud className="text-primary" />
            <h3 className="text-lg font-bold">Upload Payment Screenshot</h3>
          </div>

          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-[2rem] p-10 text-center transition-all cursor-pointer ${
              isDragActive ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            {preview ? (
              <div className="space-y-4">
                <img src={preview} className="mx-auto h-32 w-32 object-cover rounded-2xl border-4 border-white shadow-lg" alt="Preview" />
                <p className="text-primary font-bold text-sm">File Selected: {screenshot?.name}</p>
                <button onClick={(e) => { e.stopPropagation(); setScreenshot(null); setPreview(null); }} className="text-xs text-red-500 font-bold underline">Remove</button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <UploadCloud size={32} />
                </div>
                <p className="text-gray-500 text-sm">Drop your screenshot here or <span className="text-primary font-bold underline">browse</span></p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Supports JPG, PNG</p>
              </div>
            )}
          </div>

          <button 
            onClick={handleCheckout}
            disabled={uploading || !screenshot}
            className="w-full py-5 bg-primary hover:bg-red-700 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Processing Order..." : "Confirm & Submit Order"}
            <ChevronRight size={24} />
          </button>
          
          <p className="text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            Safe & Secure Bank Transfer Verification
          </p>
        </div>
      </div>
    </div>
  );
}
