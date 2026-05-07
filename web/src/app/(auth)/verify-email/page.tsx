"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const [verified, setVerified] = useState(false);
  const [sending, setSending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkVerified = setInterval(async () => {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        setVerified(true);
        clearInterval(checkVerified);
        setTimeout(() => router.push("/"), 2000);
      }
    }, 3000);

    return () => clearInterval(checkVerified);
  }, [router]);

  const resendEmail = async () => {
    if (auth.currentUser) {
      setSending(true);
      await sendEmailVerification(auth.currentUser);
      setSending(false);
      alert("Email dubara bhej di gayi hai");
    }
  };

  return (
    <div className="min-h-screen pt-32 flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-12 text-center space-y-8">
        {verified ? (
          <>
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={40} />
            </div>
            <h1 className="text-3xl font-bold">Email Verified!</h1>
            <p className="text-gray-500">Aapka account verify ho gaya hai. Dashboard pe le jaya ja raha hai...</p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
              <Mail size={40} />
            </div>
            <h1 className="text-3xl font-bold text-primary">Verify Your Email</h1>
            <p className="text-gray-500 font-urdu text-lg leading-relaxed">
              Aapki Gmail pe verification link bhej di gayi hai. Link pe click karein taake aapka account activate ho jaye.
            </p>
            <div className="space-y-4 pt-4">
              <button 
                onClick={resendEmail}
                disabled={sending}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                {sending ? <Loader2 className="animate-spin" /> : "Resend Email"}
              </button>
              <button 
                onClick={() => auth.signOut().then(() => router.push("/signin"))}
                className="w-full text-gray-500 font-bold hover:text-black transition-all"
              >
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
