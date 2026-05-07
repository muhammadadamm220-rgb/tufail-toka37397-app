import { Calendar, Users, Target, Shield } from "lucide-react";

export default function AboutPage() {
  const timeline = [
    { year: "1980", event: "Founded by Seth Muhammad Tufail in Faisalabad.", urdu: "فیصل آباد میں سیٹھ محمد طفیل کی طرف سے بنیاد رکھی گئی۔" },
    { year: "1990", event: "Launch of the first high-capacity Wheat Thresher.", urdu: "پہلے بڑے گندم تھریشر کی لانچ۔" },
    { year: "2005", event: "Nationwide expansion of dealer network.", urdu: "ملک گیر ڈیلر نیٹ ورک کا پھیلاؤ۔" },
    { year: "Today", event: "Pakistan's leading agricultural machinery brand.", urdu: "پاکستان کا صف اول کا زرعی مشینری برانڈ۔" }
  ];

  return (
    <div className="pt-32 pb-20">
      {/* Hero */}
      <section className="bg-primary text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold">Our Legacy</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">Manufacturing excellence since 1980. A family tradition of quality and innovation in Faisalabad.</p>
        </div>
      </section>

      {/* Story & Timeline */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold">The <span className="text-primary">Seth M. Tufail</span> Story</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Starting from a small workshop in Faisalabad, Seth M. Tufail Foundry (Pvt.) Ltd. has grown into a cornerstone of Pakistani agriculture. Our commitment to the farmer's success has driven us to perfect the Chaff Cutter (Toka) and Wheat Thresher over four decades.
            </p>
            
            <div className="space-y-6 relative border-l-2 border-primary/20 pl-8 ml-4">
              {timeline.map((item, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[41px] top-0 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-sm" />
                  <p className="text-primary font-bold">{item.year}</p>
                  <h4 className="text-xl font-bold">{item.event}</h4>
                  <p className="font-urdu text-gray-500 text-lg mt-1">{item.urdu}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-neutral-100 rounded-3xl p-12 border-2 border-secondary/20 space-y-8 shadow-inner">
            <h3 className="text-3xl font-bold text-center">Family Leadership</h3>
            <div className="space-y-12">
              <div className="text-center p-6 bg-white rounded-2xl shadow-md border-t-4 border-primary">
                <Users className="mx-auto text-primary mb-4" size={40} />
                <h4 className="text-2xl font-bold">Seth Muhammad Akbar</h4>
                <p className="text-gray-500">Senior Family Member</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                   <p className="font-bold text-primary">Son: Seth Muhammad Ahmed</p>
                </div>
              </div>
              
              <div className="text-center p-6 bg-white rounded-2xl shadow-md border-t-4 border-primary">
                <Users className="mx-auto text-primary mb-4" size={40} />
                <h4 className="text-2xl font-bold">Seth Muhammad Iftakhar</h4>
                <p className="text-gray-500">Brother of Seth Muhammad Akbar</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                   <p className="font-bold text-primary">Sons: Seth Muhammad Qasim & Seth Muhammad Asim</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-neutral-50 py-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <div className="bg-white p-8 rounded-2xl shadow-sm text-center space-y-4">
              <Shield className="mx-auto text-primary" size={48} />
              <h3 className="text-xl font-bold">Quality First</h3>
              <p className="text-gray-500 text-sm">We never compromise on the strength and durability of our steel.</p>
           </div>
           <div className="bg-white p-8 rounded-2xl shadow-sm text-center space-y-4">
              <Target className="mx-auto text-primary" size={48} />
              <h3 className="text-xl font-bold">Farmer Focused</h3>
              <p className="text-gray-500 text-sm">Every machine is designed to make the farmer's work easier.</p>
           </div>
           <div className="bg-white p-8 rounded-2xl shadow-sm text-center space-y-4">
              <Users className="mx-auto text-primary" size={48} />
              <h3 className="text-xl font-bold">Trusted Network</h3>
              <p className="text-gray-500 text-sm">Over 500 dealers serving farmers across all of Pakistan.</p>
           </div>
           <div className="bg-white p-8 rounded-2xl shadow-sm text-center space-y-4">
              <Calendar className="mx-auto text-primary" size={48} />
              <h3 className="text-xl font-bold">40+ Year Legacy</h3>
              <p className="text-gray-500 text-sm">A brand that has stood the test of time since 1980.</p>
           </div>
        </div>
      </section>
    </div>
  );
}
