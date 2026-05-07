"use client";

import { motion } from "framer-motion";

export default function HadithBlock() {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pakistani-border bg-white text-center shadow-lg"
        >
          <div className="py-8 px-4 md:px-12 space-y-6">
            <div className="w-16 h-1 bg-secondary mx-auto mb-4" />
            <p className="font-urdu text-3xl md:text-5xl text-primary leading-relaxed md:leading-[1.8]">
              "جو شخص حلال روزی کماتا ہے، اللہ تعالیٰ اس کے رزق میں برکت عطا فرماتا ہے۔"
            </p>
            <div className="w-16 h-1 bg-secondary mx-auto mt-4" />
            <p className="text-gray-500 font-medium tracking-widest text-sm">SETTING THE STANDARDS SINCE 1980</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
