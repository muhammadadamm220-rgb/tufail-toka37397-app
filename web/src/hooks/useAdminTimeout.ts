"use client";

import { useEffect, useRef, useCallback } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "react-hot-toast";

const TIMEOUT_MINUTES = 30;

export const useAdminTimeout = () => {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback(async () => {
    try {
      sessionStorage.removeItem("stf_admin_pin_verified");
      await signOut(auth);
      toast.error("30 minute se inactive rahe — security ke liye logout ho gaye.", {
        duration: 6000,
        icon: "🛡️"
      });
      window.location.href = "/signin";
    } catch (err) {
      console.error("Auto logout error:", err);
    }
  }, []);

  const resetTimer = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(handleLogout, TIMEOUT_MINUTES * 60 * 1000);
  }, [handleLogout]);

  useEffect(() => {
    const events = [
      "mousedown", 
      "mousemove", 
      "keypress", 
      "scroll", 
      "touchstart", 
      "click"
    ];
    
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer(); // Start timer on mount
    
    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [resetTimer]);
};
