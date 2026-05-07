"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { ShoppingCart, Search, Plus, Minus, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function DealerProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const addToCart = (product: any, qty: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + qty } : item);
      }
      return [...prev, { ...product, quantity: qty }];
    });
    toast.success(`Added ${product.name} to bulk order`);
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.nameUrdu?.includes(searchTerm)
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black">Bulk Products Catalog</h1>
          <p className="text-slate-500">Authorized Dealer Wholesale Pricing</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Products Grid */}
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
              <div className="relative aspect-square mb-6 overflow-hidden rounded-2xl bg-slate-50">
                <img 
                  src={product.images?.[0] || `https://placehold.co/400x300/CC0000/white?text=${product.name}`} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.featured && (
                  <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    Hot Seller
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
                <p className="text-sm text-slate-400 font-urdu">{product.nameUrdu}</p>
                <p className="text-primary font-black text-xl">Rs. {Number(product.price).toLocaleString()}</p>
              </div>

              <button 
                onClick={() => addToCart(product, 1)}
                className="mt-6 w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-primary transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Add to Order
              </button>
            </div>
          ))}
        </div>

        {/* Floating Cart / Order Summary */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 sticky top-32 shadow-2xl shadow-slate-200/50">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <ShoppingCart className="text-primary" /> Order Summary
            </h3>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-6 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-bold line-clamp-1">{item.name}</p>
                    <p className="text-xs text-slate-400">Rs. {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 px-3 py-1 rounded-lg">
                    <button onClick={() => updateCartQty(item.id, -1)} className="text-slate-400 hover:text-primary"><Minus size={14} /></button>
                    <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                    <button onClick={() => updateCartQty(item.id, 1)} className="text-slate-400 hover:text-primary"><Plus size={14} /></button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="py-10 text-center text-slate-400 text-sm italic">
                  Select products to start building your bulk order.
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold uppercase text-xs">Total Bill</span>
                <span className="text-2xl font-black text-primary">Rs. {totalAmount.toLocaleString()}</span>
              </div>
              
              <Link 
                href="/order/checkout" 
                className={`w-full py-5 rounded-2xl font-black text-center flex items-center justify-center gap-3 transition-all ${
                  cart.length > 0 ? "bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                Proceed to Checkout <Check size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
