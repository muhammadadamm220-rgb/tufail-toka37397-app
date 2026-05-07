"use client";

import { useState } from "react";
import { Phone, Lock, ChevronRight } from "lucide-react";

export default function DealerLoginPage() {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to dealer dashboard
    window.location.href = "/dealer-portal";
  };

  return (
    <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10 space-y-2">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold">Dealer <span className="text-primary">Portal</span></h1>
          <p className="text-gray-500 font-urdu text-xl">ڈیلر لاگ ان — با اختیار رسائی</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="tel" 
                    placeholder="e.g. 03001234567"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-primary outline-none transition-all"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Send OTP <ChevronRight size={20} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in">
              <div className="space-y-2 text-center">
                <p className="text-gray-500 text-sm">OTP sent to <span className="font-bold text-black">{phone}</span></p>
                <div className="flex justify-center gap-2 mt-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <input 
                      key={i}
                      type="text" 
                      maxLength={1}
                      className="w-10 h-12 text-center text-xl font-bold rounded-lg border-2 border-gray-100 focus:border-primary outline-none"
                      onChange={(e) => {
                        if (e.target.value && i < 6) {
                          // Logic to move to next input
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg"
              >
                Verify & Login
              </button>
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-gray-400 text-sm font-bold hover:text-primary transition-colors"
              >
                Change Phone Number
              </button>
            </form>
          )}
        </div>

        <p className="mt-8 text-center text-gray-400 text-sm">
          Not an authorized dealer? <a href="/dealers" className="text-primary font-bold hover:underline">Apply Here</a>
        </p>
      </div>
    </div>
  );
}
