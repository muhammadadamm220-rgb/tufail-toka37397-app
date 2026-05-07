"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import { ChevronLeft, Mail, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link aapki email pe bhej di gayi hai.");
    } catch (err: any) {
      setError("Is email ka user nahi mila");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 space-y-8">
        <div>
          <Link href="/signin" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors mb-6">
            <ChevronLeft size={16} /> Back to Sign In
          </Link>
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-gray-500 mt-2">Enter your email to receive a reset link</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">{error}</div>}
        {message && <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                required
                type="email" 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-all"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
