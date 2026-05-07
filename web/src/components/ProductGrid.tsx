"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Star, ShoppingCart, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const FALLBACK_IMAGE = "https://placehold.co/400x300/CC0000/white?text=Seth+Tufail+Toka";
function ProductCard({ product }: { product: any }) {
    const router = useRouter();
    const { addToCart } = useCart();
    const [imgSrc, setImgSrc] = useState(product.images?.[0] || FALLBACK_IMAGE);
  
    const handleAddToCart = () => {
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
    };

    const handleBuyNow = () => {
      addToCart(product);
      router.push("/order/checkout");
    };
  
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img 
            src={imgSrc} 
            alt={product.name}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
            Reg: {product.regNo || "37397"}
          </div>
        </div>
        
        <div className="p-6 space-y-4 flex flex-col flex-1">
          <div className="flex-1">
            <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-1">{product.category}</p>
            <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
            <p className="text-gray-400 text-xs mt-2 line-clamp-2">{product.description}</p>
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <p className="text-2xl font-black text-black">
              <span className="text-sm font-medium text-gray-400 mr-1">Rs.</span>
              {product.price.toLocaleString()}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={handleBuyNow}
                className="px-4 h-12 bg-black text-white rounded-2xl flex items-center justify-center hover:bg-primary transition-all shadow-lg font-bold text-xs uppercase tracking-widest active:scale-95"
              >
                Buy Now
              </button>
              <button 
                onClick={handleAddToCart}
                className="w-12 h-12 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-inner active:scale-95"
                title="Add to Cart"
              >
                <ShoppingCart size={18} />
              </button>
              <button 
                onClick={() => router.push(`/products/detail?id=${product.id}`)}
                className="w-12 h-12 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-inner active:scale-95"
                title="View Details"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
}

export default function ProductGrid({ limit, category }: { limit?: number, category?: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(category || "All");
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ["All", ...new Set(products.map(p => p.category))];
  
  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const displayProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Catalog...</p>
      </div>
    );
  }

  return (
    <section id="products" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold">Our <span className="text-primary">Machinery</span></h2>
          <p className="text-gray-500 font-urdu text-xl leading-relaxed">پاکستان کی بہترین زرعی مشینری — اعلیٰ کوالٹی اور پائیداری</p>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl overflow-x-auto max-w-full custom-scrollbar">
          {categories.map((cat: any) => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeCategory === cat ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {displayProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-[3rem] py-24 text-center border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <ShoppingCart size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-400">No products found in this category</h3>
          <button onClick={() => setActiveCategory("All")} className="mt-4 text-primary font-bold underline">Show all products</button>
        </div>
      )}
    </section>
  );
}
