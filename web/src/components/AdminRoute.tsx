"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/signin";
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Checking Access...</p>
      </div>
    );
  }

  if (!user) return null;

  // Logged in but NOT admin → show fake 404
  if (userRole !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-9xl font-black text-gray-100">404</h1>
        <p className="text-xl text-gray-400 font-bold -mt-8">Page not found</p>
        <button 
          onClick={() => router.push("/")}
          className="mt-8 text-primary font-bold hover:underline"
        >
          Go Home
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
