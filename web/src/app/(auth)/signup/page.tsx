"use client";

import { useState } from "react";
import { 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const cities = [
    "Faisalabad", "Lahore", "Karachi", "Islamabad", "Multan", 
    "Sargodha", "Gujranwala", "Sialkot", "Peshawar", "Quetta"
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords match nahi kar rahe");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password kam az kam 8 characters ka hona chahiye");
      setLoading(false);
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      await sendEmailVerification(result.user);
      
      await setDoc(doc(db, "users", result.user.uid), {
        name: name,
        email: email,
        phone: phone,
        city: city,
        role: "customer",
        emailVerified: false,
        createdAt: serverTimestamp()
      });

      setMessage("Gmail pe verification email bhej di gayi hai. Pehle verify karein.");
      setTimeout(() => router.push("/verify-email"), 3000);
      
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Yeh email pehle se registered hai");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await setDoc(doc(db, "users", result.user.uid), {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
        role: "customer",
        emailVerified: true,
        createdAt: serverTimestamp()
      }, { merge: true });
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Create Account</h1>
          <p className="text-gray-500 mt-2">Naya account banayein</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">{error}</div>}
        {message && <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 text-sm font-medium">{message}</div>}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-all"
              placeholder="Apna naam likhein"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <input 
              required
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-all"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
              <input 
                required
                type="tel" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-all"
                placeholder="03001234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
              <select 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-all bg-white"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">Select City</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input 
              required
              type={showPassword ? "text" : "password"} 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[38px] text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Confirm Password</label>
            <input 
              required
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-all"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button 
            type="button"
            onClick={googleSignIn}
            className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>

          <p className="text-center text-gray-500 mt-6">
            Already have account? <Link href="/signin" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
