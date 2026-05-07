"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Award } from "lucide-react";

export default function Hero() {
  const month = new Date().getMonth() + 1; // 1-12
  const seasonalText = 
    month >= 3 && month <= 5 ? "Wheat Thresher Season is Here! — Book Now for Best Rates" :
    month >= 10 && month <= 12 ? "Original Toka Machine Season — Reg 37397" :
    "Seth M. Tufail Foundry — Pakistan's No.1 Agricultural Machinery";

  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex items-center">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform origin-top-right -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-secondary/5 skew-x-12 transform origin-bottom-left -z-10" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm border border-primary/10">
              <Award size={18} />
              <span className="uppercase tracking-widest text-[10px]">{seasonalText}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black leading-tight text-black">
              Seth M. Tufail <br />
              <span className="text-primary italic">Foundry</span> (Pvt.) Ltd.
            </h1>

            
            <p className="text-lg text-gray-500 font-medium max-w-xl">
              Join thousands of farmers across Pakistan using our original, award-winning agricultural tools. Durable, efficient, and trusted since 1980.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/signup" 
                className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-red-700 transition-all shadow-2xl shadow-primary/20"
              >
                Join Now <ChevronRight size={24} />
              </Link>
              <Link 
                href="/products" 
                className="bg-white text-gray-900 border border-gray-100 px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
              >
                Explore Products
              </Link>
            </div>
          </motion.div>

          {/* Image/Product Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-2xl mx-auto">
              {/* Main Product Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl overflow-hidden border-2 border-white shadow-2xl">
                <div className="flex items-center justify-center h-full">
                  {/* We would use an actual image here, but for now a placeholder */}
                  <div className="text-center space-y-4">
                    <img 
                      src="/toka-machine.jpg" 
                      alt="Seth M. Tufail Toka"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Badge */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary rounded-full flex items-center justify-center border-4 border-white shadow-xl rotate-12">
                <div className="text-center">
                  <p className="text-xs font-bold text-black uppercase">Original</p>
                  <p className="text-2xl font-black text-black">REG</p>
                  <p className="text-lg font-bold text-black">37397</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
