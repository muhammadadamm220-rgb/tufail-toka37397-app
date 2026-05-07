"use client";

import { useState } from "react";
import { 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 60 * 60 * 1000; // 1 hour

  const checkLoginAllowed = () => {
    const blockedUntil = localStorage.getItem("login_blocked_until");
    if (blockedUntil && Date.now() < Number(blockedUntil)) {
      const minsLeft = Math.ceil((Number(blockedUntil) - Date.now()) / 60000);
      return { allowed: false, minsLeft };
    }
    return { allowed: true };
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { allowed, minsLeft } = checkLoginAllowed();
    if (!allowed) {
      setError(`Zyada galat attempts. ${minsLeft} minute baad try karein.`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Reset attempts on success
      localStorage.removeItem("login_attempts");
      localStorage.removeItem("login_blocked_until");

      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (!userDoc.exists()) {
         setError("User profile not found in Firestore.");
         setLoading(false);
         return;
      }

      const role = userDoc.data()?.role;
      if (role === "admin") {
        router.push("/manage-37397-tufail-secure");
      } else if (role === "dealer") {
        router.push("/dealer-portal");
      } else {
        router.push("/");
      }
      
    } catch (err: any) {
      const current = Number(localStorage.getItem("login_attempts") || 0) + 1;
      localStorage.setItem("login_attempts", current.toString());

      if (current >= MAX_LOGIN_ATTEMPTS) {
        const blockUntil = Date.now() + LOCKOUT_DURATION;
        localStorage.setItem("login_blocked_until", blockUntil.toString());
        setError("5 galat attempts — 1 ghante ke liye block ho gaye.");
      } else {
        setError(`Email ya password ghalat hai. (${MAX_LOGIN_ATTEMPTS - current} attempts baqi)`);
      }
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Reset attempts on success
      localStorage.removeItem("login_attempts");
      localStorage.removeItem("login_blocked_until");

      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", result.user.uid), {
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
          role: "customer",
          emailVerified: true,
          createdAt: serverTimestamp()
        });
      }
      
      const role = (userDoc.exists() ? userDoc.data()?.role : "customer");
      if (role === "admin") {
        router.push("/manage-37397-tufail-secure");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Sign In</h1>
          <p className="text-gray-500 mt-2">Apne account mein login karein</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">{error}</div>}

        <form onSubmit={handleSignin} className="space-y-6">
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

          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-bold text-gray-700">Password</label>
              <Link href="/forgot-password" className="text-xs text-primary font-bold hover:underline">
                Forgot Password?
              </Link>
            </div>
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
              className="absolute right-4 top-[34px] text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
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

          <p className="text-center text-gray-500 mt-8">
            New here? <Link href="/signup" className="text-primary font-bold hover:underline">Create Account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
