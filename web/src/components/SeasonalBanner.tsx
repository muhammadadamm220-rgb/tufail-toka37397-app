"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Timer } from "lucide-react";

export default function SeasonalBanner() {
  const [season, setSeason] = useState<"wheat" | "fodder">("wheat");

  useEffect(() => {
    const month = new Date().getMonth();
    // Simplified logic: April-May is wheat season, others fodder
    if (month >= 3 && month <= 4) {
      setSeason("wheat");
    } else {
      setSeason("fodder");
    }
  }, []);

  return (
    <section className="px-4 md:px-8 max-w-7xl mx-auto mb-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className={`rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 ${
          season === "wheat" 
          ? "bg-gradient-to-r from-amber-500 to-amber-700 text-white" 
          : "bg-gradient-to-r from-red-600 to-red-800 text-white"
        }`}
      >
        {/* Background Icons */}
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Zap size={200} />
        </div>

        <div className="flex-1 space-y-6 z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest">
            <Timer size={16} />
            <span>Seasonal Special Offer</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black leading-tight">
            {season === "wheat" 
              ? "WHEAT SEASON IS HERE! GET THE BEST THRESHER" 
              : "PREPARE FOR FODDER! NO.1 TOKA AVAILABLE NOW"}
          </h2>
          
          <p className="text-xl font-urdu leading-relaxed">
            {season === "wheat" 
              ? "گندم کی کٹائی کے سیزن کے لیے بہترین تھریشر اب خاص رعایت پر دستیاب ہے۔" 
              : "ٹوکہ مشین کی خریداری پر بہترین قیمت اور فوری ڈیلیوری۔"}
          </p>

          <button className="bg-white text-black px-10 py-4 rounded-xl font-bold text-lg hover:bg-secondary hover:text-white transition-all shadow-xl">
            Check Availability
          </button>
        </div>

        <div className="flex-1 z-10 flex items-center justify-center">
          <img 
            src="/seasonal-thresher.jpg" 
            alt="Seasonal Product"
            className="w-full h-auto rounded-2xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-bounce-slow"
          />
        </div>
      </motion.div>
    </section>
  );
}
