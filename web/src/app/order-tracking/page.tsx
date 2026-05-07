"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react";

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState<any>(null);

  const handleTrack = () => {
    // Mock status for demo
    setStatus({
      id: orderId || "ORD-786",
      customer: "Muhammad Ahmed",
      product: "Seth Tufail Toka (37397)",
      currentStep: 2,
      steps: [
        { label: "Order Placed", date: "Oct 24, 2023", icon: Clock },
        { label: "Processing", date: "Oct 25, 2023", icon: Package },
        { label: "Dispatched", date: "In Progress", icon: Truck },
        { label: "Delivered", date: "Pending", icon: CheckCircle },
      ]
    });
  };

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-bold">Track Your <span className="text-primary">Order</span></h1>
          <p className="text-gray-500 font-urdu text-2xl">اپنے آرڈر کی صورتحال معلوم کریں</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border-4 border-gray-100 shadow-xl mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Enter Order ID (e.g. ORD-786)"
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-primary outline-none transition-all"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
            <button 
              onClick={handleTrack}
              className="bg-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg"
            >
              Track Now
            </button>
          </div>
        </div>

        {status && (
          <div className="bg-neutral-50 rounded-3xl p-8 md:p-12 border-2 border-primary/10 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4 pb-8 border-b">
              <div>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Order Details</p>
                <h2 className="text-3xl font-bold">{status.id}</h2>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Customer</p>
                <p className="text-xl font-bold">{status.customer}</p>
              </div>
            </div>

            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200 md:left-0 md:right-0 md:top-8 md:h-1 md:w-full" />
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                {status.steps.map((step: any, i: number) => {
                  const Icon = step.icon;
                  const isActive = i <= status.currentStep;
                  const isCompleted = i < status.currentStep;

                  return (
                    <div key={i} className="flex md:flex-col items-center gap-6 md:gap-4 text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-all ${
                        isActive ? "bg-primary text-white scale-110" : "bg-gray-200 text-gray-400"
                      }`}>
                        <Icon size={28} />
                      </div>
                      <div>
                        <h4 className={`font-bold text-lg ${isActive ? "text-black" : "text-gray-400"}`}>{step.label}</h4>
                        <p className="text-sm text-gray-500">{step.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-16 p-6 bg-white rounded-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                     <Package size={24} />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-gray-400">Product</p>
                     <p className="font-bold">{status.product}</p>
                  </div>
               </div>
               <button className="text-primary font-bold hover:underline">View Full Details</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
