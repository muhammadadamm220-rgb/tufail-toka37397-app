"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

const videos = [
  {
    id: "PVrBaUDwxC4",
    title: "Seth M. Tufail Factory Tour & Machine Demo",
    urduTitle: "سیٹھ ایم طفیل فیکٹری ٹور اور مشین ڈیمو",
    category: "Factory Tour"
  },
  {
    id: "LRjBUYxTjXQ",
    title: "Rotavator Performance Test",
    urduTitle: "روٹا ویٹر کی کارکردگی کا ٹیسٹ",
    category: "Product Demo"
  }
];

export default function VideoGallery() {
  return (
    <section className="py-24 bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">See Our <span className="text-primary">Machines in Action</span></h2>
          <p className="text-gray-400 font-urdu text-xl">ہماری مشینوں کی کارکردگی اور فیکٹری کا نظارہ کریں</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {videos.map((video, index) => (
            <motion.div 
              key={video.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group"
            >
              <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                
                {/* Play Overlay (Visible before interaction) */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none group-hover:bg-black/20 transition-all">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play size={40} fill="white" />
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <p className="text-primary font-bold uppercase tracking-widest text-xs">{video.category}</p>
                <h3 className="text-2xl font-bold">{video.title}</h3>
                <p className="font-urdu text-gray-400 text-lg">{video.urduTitle}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a 
            href="https://www.youtube.com/@sethmtufail" 
            target="_blank"
            className="inline-flex items-center gap-3 bg-red-600 px-8 py-4 rounded-full font-bold hover:bg-red-700 transition-all"
          >
            <Play fill="white" /> Visit Our YouTube Channel
          </a>
        </div>
      </div>
    </section>
  );
}
