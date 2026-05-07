import ProductGrid from "@/components/ProductGrid";
import { Search, Filter } from "lucide-react";

export default function ProductsPage() {
  return (
    <div className="pt-32 pb-20">
      {/* Header Section */}
      <section className="bg-neutral-50 py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left space-y-2">
              <h1 className="text-5xl font-bold">Product <span className="text-primary">Catalog</span></h1>
              <p className="text-gray-500 font-urdu text-2xl">سیٹھ محمد طفیل کی تمام مصنوعات — معیار میں بے مثال</p>
            </div>
            
            <div className="w-full md:w-1/2 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search machines... (Toka, Thresher...)"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-primary outline-none transition-all shadow-sm"
                />
              </div>
              <button className="bg-white p-4 rounded-xl border-2 border-gray-100 hover:border-primary transition-all shadow-sm">
                <Filter size={24} className="text-primary" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog */}
      <ProductGrid />

      {/* Trust Badges */}
      <section className="py-20 border-t">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-50 text-primary rounded-full flex items-center justify-center mx-auto">
              <Award size={32} />
            </div>
            <h3 className="text-xl font-bold">Govt Reg: 37397</h3>
            <p className="text-gray-500">Official registered manufacturer with proven quality standards.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-50 text-primary rounded-full flex items-center justify-center mx-auto">
              <Truck size={32} />
            </div>
            <h3 className="text-xl font-bold">Nationwide Delivery</h3>
            <p className="text-gray-500">Fast and secure delivery across all cities in Pakistan.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-50 text-primary rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold">Maintenance Support</h3>
            <p className="text-gray-500">24/7 technical support and genuine spare parts availability.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Award, Truck, ShieldCheck } from "lucide-react";
