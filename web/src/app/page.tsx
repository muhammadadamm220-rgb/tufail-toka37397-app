import Hero from "@/components/Hero";
import HadithBlock from "@/components/HadithBlock";
import ProductGrid from "@/components/ProductGrid";
import SeasonalBanner from "@/components/SeasonalBanner";
import VideoGallery from "@/components/VideoGallery";
import YouTubeEmbed from "@/components/YouTubeEmbed";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero / Splash Section */}
      <Hero />

      {/* 2. Islamic Touch - Hadith Block */}
      <HadithBlock />
      <YouTubeEmbed />

      {/* 3. Seasonal Promotion Banner */}
      <SeasonalBanner />

      {/* 4. Products Catalog Preview */}
      <ProductGrid limit={6} />

      {/* 5. Video Gallery Section */}
      <VideoGallery />

      {/* 6. Quick Action / CTA */}
      <section className="bg-primary py-16 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold font-urdu">اج ہی رابطہ کریں اور با اعتماد مشینری حاصل کریں</h2>
          <p className="text-xl opacity-90">Become a part of the Seth M. Tufail family today. Quality you can trust.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="tel:0418714167" className="bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-secondary hover:text-white transition-all">
              Call Now: (041) 8714167
            </a>
            <a href="https://wa.me/923001234567" className="bg-green-600 text-white px-8 py-4 rounded-full font-bold hover:bg-green-700 transition-all flex items-center gap-2">
              WhatsApp Inquiry
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
