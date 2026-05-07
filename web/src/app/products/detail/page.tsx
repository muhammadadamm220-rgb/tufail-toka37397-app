"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { 
  ShoppingCart, 
  CheckCircle, 
  ShieldCheck, 
  Truck, 
  Award,
  ChevronLeft,
  Loader2,
  Star,
  Info,
  Layers
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";

export default function ProductDetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const snap = await getDoc(doc(db, "products", id as string));
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Fetching Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-4xl font-black mb-4">Machine Not Found</h2>
        <button onClick={() => router.push("/products")} className="text-primary font-bold underline text-lg">Back to Catalog</button>
      </div>
    );
  }

  const handleBuyNow = () => {
    addToCart(product);
    router.push("/order/checkout");
  };

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-8">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors font-bold uppercase tracking-widest text-xs mb-12"
      >
        <ChevronLeft size={16} /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Images */}
        <div className="space-y-6">
          <div className="aspect-[4/3] rounded-[3rem] overflow-hidden bg-gray-100 border border-gray-100 shadow-2xl relative">
             <img 
               src={product.images?.[activeImage] || "https://placehold.co/800x600/CC0000/white?text=Seth+Tufail+Toka"} 
               className="w-full h-full object-cover"
               alt={product.name}
             />
             <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-md text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-white/20">
               Reg: {product.regNo || "37397"}
             </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {product.images?.map((img: string, i: number) => (
              <button 
                key={i} 
                onClick={() => setActiveImage(i)}
                className={`w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all shrink-0 ${
                  activeImage === i ? "border-primary scale-95 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-10">
          <div className="space-y-4">
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-block border border-primary/20">
              {product.category}
            </span>
            <h1 className="text-5xl font-black text-black leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex text-yellow-500">
                {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <span className="text-gray-400 font-bold text-sm">(5.0 Rating)</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 relative overflow-hidden group">
            <div className="relative z-10 space-y-2">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Current Market Price</p>
              <p className="text-5xl font-black text-primary">Rs. {product.price.toLocaleString()}</p>
              <p className="text-green-600 font-bold text-sm flex items-center gap-2">
                <CheckCircle size={16} /> Inclusive of all Govt Taxes
              </p>
            </div>
            <Award className="absolute -bottom-6 -right-6 text-gray-100 w-40 h-40 group-hover:scale-110 transition-transform" />
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <button 
                onClick={handleBuyNow}
                className="flex-[2] py-6 bg-black text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <ShoppingCart size={22} /> Order This Now
              </button>
              <button 
                onClick={() => window.open(`https://wa.me/923008549185?text=Inquiry about ${product.name}`, "_blank")}
                className="flex-1 py-6 bg-green-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-green-600 transition-all flex items-center justify-center gap-2"
              >
                WhatsApp
              </button>
            </div>
          </div>

          <div className="space-y-8 border-t border-gray-100 pt-10">
             <div className="space-y-4">
                <h3 className="font-black text-lg flex items-center gap-2">
                  <Info className="text-primary" /> Product Details
                </h3>
                <p className="text-gray-500 leading-relaxed">{product.description}</p>
                <p className="text-gray-800 font-urdu text-3xl leading-relaxed mt-4 border-l-4 border-primary pl-6 py-2">
                  {product.urduDescription}
                </p>
             </div>

             {product.features?.length > 0 && (
               <div className="space-y-4">
                  <h3 className="font-black text-lg flex items-center gap-2">
                    <CheckCircle className="text-primary" /> Key Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.features.map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="font-bold text-gray-700">{f}</span>
                      </div>
                    ))}
                  </div>
               </div>
             )}

             {product.specifications && (
               <div className="space-y-4">
                  <h3 className="font-black text-lg flex items-center gap-2">
                    <Layers className="text-primary" /> Technical Specs
                  </h3>
                  <div className="bg-gray-100 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center md:text-left">
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">Power Req.</p>
                      <p className="text-xl font-black">{product.specifications.power || "N/A"}</p>
                    </div>
                    <div className="text-center md:text-left border-l border-gray-200 pl-0 md:pl-8">
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">Capacity</p>
                      <p className="text-xl font-black">{product.specifications.capacity || "N/A"}</p>
                    </div>
                    <div className="text-center md:text-left border-l border-gray-200 pl-0 md:pl-8">
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">Total Weight</p>
                      <p className="text-xl font-black">{product.specifications.weight || "N/A"}</p>
                    </div>
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 pt-20 border-t border-gray-100">
         <div className="flex items-center gap-6 group">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
               <ShieldCheck size={32} />
            </div>
            <div>
               <h4 className="font-black uppercase tracking-widest text-sm">Official Warranty</h4>
               <p className="text-gray-400 text-xs mt-1">100% Genuine product warranty</p>
            </div>
         </div>
         <div className="flex items-center gap-6 group">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
               <Truck size={32} />
            </div>
            <div>
               <h4 className="font-black uppercase tracking-widest text-sm">Safe Shipping</h4>
               <p className="text-gray-400 text-xs mt-1">Insured delivery across Pakistan</p>
            </div>
         </div>
         <div className="flex items-center gap-6 group">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
               <Award size={32} />
            </div>
            <div>
               <h4 className="font-black uppercase tracking-widest text-sm">Govt Registered</h4>
               <p className="text-gray-400 text-xs mt-1">Certified by Trade Mark 37397</p>
            </div>
         </div>
      </div>
    </div>
  );
}
