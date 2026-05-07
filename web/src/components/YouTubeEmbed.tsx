"use client";

import React from "react";

const YouTubeEmbed = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <div className="text-center mb-10">
      <h2 className="text-primary font-bold text-3xl md:text-4xl mb-4 font-urdu">
        ہماری کمپنی — ویڈیو دیکھیں
      </h2>
      <p className="text-gray-600">Explore the manufacturing process and quality standards at Seth M. Tufail Foundry.</p>
    </div>
    
    <div className="relative w-full aspect-video group">
      <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] blur-2xl group-hover:bg-primary/10 transition-all duration-700" />
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-[2rem] shadow-2xl border-4 border-white relative z-10"
        src="https://www.youtube.com/embed/PVrBaUDwxC4"
        title="Seth M. Tufail Foundry"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
    <div className="mt-8 text-center">
      <p className="text-secondary font-bold tracking-widest uppercase text-sm">
        Seth M. Tufail Foundry (Pvt.) Ltd. — Faisalabad
      </p>
    </div>
  </div>
);

export default YouTubeEmbed;
