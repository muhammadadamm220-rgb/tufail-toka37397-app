"use client";

import { useState, useEffect } from "react";
import { Lock, ShieldAlert, KeyRound } from "lucide-react";

const ADMIN_PIN = "7739"; // 4-digit PIN
const PIN_SESSION_KEY = "stf_admin_pin_verified";
const MAX_PIN_ATTEMPTS = 3;
const PIN_LOCKOUT_MINUTES = 30;

const AdminPinGate = ({ children }: { children: React.ReactNode }) => {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if already verified this session
    if (sessionStorage.getItem(PIN_SESSION_KEY) === "true") {
      setUnlocked(true);
    }
    // Check if locked out
    const lockout = localStorage.getItem("pin_lockout");
    if (lockout && Date.now() < Number(lockout)) {
      setLockedUntil(Number(lockout));
    }
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    if (!lockedUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockedUntil(null);
        setAttempts(0);
        localStorage.removeItem("pin_lockout");
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  const checkPin = () => {
    if (lockedUntil) return;

    if (pin === ADMIN_PIN) {
      setUnlocked(true);
      sessionStorage.setItem(PIN_SESSION_KEY, "true");
      setError("");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin("");

      if (newAttempts >= MAX_PIN_ATTEMPTS) {
        const lockTime = Date.now() + PIN_LOCKOUT_MINUTES * 60 * 1000;
        setLockedUntil(lockTime);
        localStorage.setItem("pin_lockout", lockTime.toString());
        setError(`${MAX_PIN_ATTEMPTS} galat attempts. ${PIN_LOCKOUT_MINUTES} minute baad try karein.`);
      } else {
        setError(`Galat PIN. ${MAX_PIN_ATTEMPTS - newAttempts} attempts baqi hain.`);
      }
    }
  };

  // If locked out
  if (lockedUntil) {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] p-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-[2rem] p-12 text-center max-w-md w-full space-y-6">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-red-500/20">
            <ShieldAlert className="text-white" size={40} />
          </div>
          <h2 className="text-3xl font-black text-white">Access Locked</h2>
          <p className="text-red-200/60 font-medium">
            Multiple incorrect attempts. Security lockout active.
          </p>
          <div className="text-6xl font-black text-red-500 font-mono tracking-tighter">
            {mins}:{secs.toString().padStart(2, "0")}
          </div>
          <p className="text-red-200/40 text-xs font-bold uppercase tracking-widest">
            Please wait before trying again
          </p>
        </div>
      </div>
    );
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f172a] p-4">
      <div className="bg-[#1e293b] border border-white/10 rounded-[2.5rem] p-12 text-center max-w-md w-full shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/20">
          <Lock className="text-white" size={32} />
        </div>

        <h2 className="text-2xl font-black text-white mb-2">Admin Verification</h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-10">
          Seth M. Tufail Foundry — Secure Area
        </p>

        <div className="space-y-6">
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
            onKeyDown={e => e.key === "Enter" && checkPin()}
            placeholder="····"
            className="w-full bg-[#0f172a] border border-white/5 rounded-2xl py-6 text-center text-4xl font-black text-white tracking-[0.5em] outline-none focus:border-primary/50 transition-all placeholder:text-gray-800"
            autoFocus
          />

          {error && (
            <p className="text-red-400 text-sm font-bold bg-red-400/10 py-3 rounded-xl border border-red-400/20">
              {error}
            </p>
          )}

          <button
            onClick={checkPin}
            className="w-full bg-primary hover:bg-red-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            <KeyRound size={20} /> Unlock Dashboard
          </button>
        </div>

        <p className="mt-10 text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">
          Registration No: 37397 · Faisalabad
        </p>
      </div>
    </div>
  );
};

export default AdminPinGate;
