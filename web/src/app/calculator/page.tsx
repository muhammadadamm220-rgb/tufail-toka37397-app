"use client";

import { useState, useEffect } from "react";
import { 
  Calculator, 
  Minus, 
  Plus, 
  Download, 
  MessageCircle, 
  ShoppingCart,
  ChevronDown
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const cities = ["Faisalabad", "Lahore", "Multan", "Sargodha", "Sahiwal", "Rahim Yar Khan", "Sukkur", "Hyderabad"];

export default function PriceCalculator() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [city, setCity] = useState("Faisalabad");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
        if (data.length > 0) {
          setSelectedProduct(data[0]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Products...</p>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">No products available in the inventory.</p>
      </div>
    );
  }

  const subtotal = (selectedProduct?.price || 0) * quantity;

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Assalam o Alaikum! I want to inquire about:\n` +
      `Product: ${selectedProduct.name}\n` +
      `Quantity: ${quantity}\n` +
      `Delivery City: ${city}\n` +
      `Total Quote: Rs. ${subtotal.toLocaleString()}`
    );
    window.open(`https://wa.me/92418714167?text=${msg}`, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 space-y-12">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-6">
          <Calculator size={40} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-black">Price <span className="text-primary">Calculator</span></h1>
        <p className="text-gray-500 font-urdu text-xl leading-relaxed">فوری کوٹیشن حاصل کریں اور اپنے بجٹ کے مطابق بہترین مشینری کا انتخاب کریں</p>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Inputs */}
        <div className="p-8 md:p-12 space-y-8 bg-gray-50/50">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Machinery</label>
            <div className="relative">
              <select 
                className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 outline-none focus:border-primary appearance-none font-bold text-lg cursor-pointer"
                value={selectedProduct?.id}
                onChange={(e) => setSelectedProduct(products.find(p => p.id === e.target.value))}
              >
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantity</label>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                <Minus size={20} />
              </button>
              <div className="flex-1 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-2xl font-black">
                {quantity}
              </div>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your City (For Delivery Est.)</label>
            <div className="relative">
              <select 
                className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 outline-none focus:border-primary appearance-none font-bold text-lg cursor-pointer"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>
        </div>

        {/* Right Side: Total Summary */}
        <div className="p-8 md:p-12 bg-black text-white space-y-10 flex flex-col justify-center">
          <div className="space-y-6">
            <div className="flex justify-between items-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              <span>Description</span>
              <span>Amount</span>
            </div>
            
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <p className="text-lg font-bold">{selectedProduct.name}</p>
                <p className="text-xs text-primary font-bold tracking-widest uppercase">Reg: 37397</p>
              </div>
              <p className="text-xl font-bold whitespace-nowrap">Rs. {selectedProduct.price.toLocaleString()}</p>
            </div>

            <div className="flex justify-between items-center py-4 border-y border-white/10">
              <span className="text-gray-400">Quantity</span>
              <span className="text-xl font-black">× {quantity}</span>
            </div>

            <div className="pt-4 flex justify-between items-end">
              <span className="text-2xl font-black">Total Quote</span>
              <div className="text-right">
                <p className="text-4xl font-black text-primary">Rs. {subtotal.toLocaleString()}</p>
                <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-2">PKR Currency</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => toast.success("Quote PDF Downloaded (Simulator)")}
              className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3 border border-white/10"
            >
              <Download size={18} /> Download Quote PDF
            </button>
            <button 
              onClick={() => router.push("/order/checkout")}
              className="w-full py-4 bg-primary hover:bg-red-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
            >
              <ShoppingCart size={18} /> Order This Now
            </button>
            <button 
              onClick={handleWhatsApp}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3"
            >
              <MessageCircle size={18} /> WhatsApp Inquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
