import { Sprout, Wrench, Calendar, PhoneCall } from "lucide-react";

export default function KisaanCornerPage() {
  const tips = [
    {
      title: "Wheat Season Preparation",
      urdu: "گندم کے سیزن کی تیاری",
      content: "Ensure your thresher blades are sharpened and the verm is lubricated before the harvest starts.",
      urduContent: "کٹائی شروع ہونے سے پہلے اپنے تھریشر کے بلیڈ تیز کریں اور ورم کو تیل لگائیں۔"
    },
    {
      title: "Toka Machine Maintenance",
      urdu: "ٹوکہ مشین کی دیکھ بھال",
      content: "Regularly clean the gears and check for any loose bolts to ensure maximum efficiency.",
      urduContent: "گیئرز کی باقاعدگی سے صفائی کریں اور ڈھیلے بولٹس کو چیک کریں تاکہ مشین بہتر کام کرے۔"
    }
  ];

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-bold">Kisaan <span className="text-primary">Corner</span></h1>
          <p className="text-gray-500 font-urdu text-3xl">کسان بھائیوں کے لیے رہنمائی اور مفید مشورے</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Maintenance Guide */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 border-b-4 border-secondary w-fit pb-2">
              <Wrench className="text-primary" size={32} />
              <h2 className="text-3xl font-bold uppercase tracking-tight">Maintenance Guides</h2>
            </div>
            
            <div className="space-y-6">
              {tips.map((tip, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border-2 border-gray-100 hover:border-primary transition-all shadow-sm">
                  <h3 className="text-xl font-bold mb-1">{tip.title}</h3>
                  <p className="font-urdu text-primary text-2xl mb-4">{tip.urdu}</p>
                  <p className="text-gray-600 mb-4">{tip.content}</p>
                  <p className="font-urdu text-gray-500 text-xl leading-relaxed bg-neutral-50 p-4 rounded-xl">
                    {tip.urduContent}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Seasonal Calendar & Helpline */}
          <div className="space-y-12">
            <section className="space-y-8">
              <div className="flex items-center gap-4 border-b-4 border-secondary w-fit pb-2">
                <Calendar className="text-primary" size={32} />
                <h2 className="text-3xl font-bold uppercase tracking-tight">Crop Calendar</h2>
              </div>
              <div className="bg-primary text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <Sprout className="absolute -right-8 -bottom-8 opacity-20" size={160} />
                <div className="space-y-4 relative z-10">
                  <h3 className="text-2xl font-bold">Current Season: <span className="text-secondary">Wheat Harvest</span></h3>
                  <p className="font-urdu text-xl opacity-90">گندم کی کٹائی کا وقت قریب ہے۔ بہترین نتائج کے لیے اپنے تھریشر کی بکنگ ابھی کروائیں۔</p>
                  <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold hover:bg-secondary hover:text-white transition-all">
                    View Full Calendar
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-neutral-900 text-white p-10 rounded-3xl border-4 border-primary/30">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center animate-pulse">
                     <PhoneCall size={32} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-bold">24/7 Kisaan Helpline</h3>
                     <p className="text-primary font-bold">(041) 8714167</p>
                  </div>
               </div>
               <p className="text-gray-400 mb-8">Have a technical issue or need advice on which machine to buy? Our experts are here to help you 24 hours a day.</p>
               <div className="grid grid-cols-2 gap-4">
                  <a href="tel:0418714167" className="bg-primary py-4 rounded-xl text-center font-bold hover:bg-red-700 transition-all">Call Expert</a>
                  <a href="https://wa.me/923001234567" className="bg-green-600 py-4 rounded-xl text-center font-bold hover:bg-green-700 transition-all">WhatsApp</a>
               </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
