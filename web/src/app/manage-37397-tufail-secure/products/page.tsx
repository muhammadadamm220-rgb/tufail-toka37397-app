"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { 
  Package, 
  Plus, 
  Trash2, 
  Edit2, 
  Upload, 
  X, 
  Check,
  Tag,
  Hash,
  Info,
  Layers,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    regNo: "",
    category: "Chaff Cutter",
    description: "",
    urduDescription: "",
    features: [""],
    specifications: {
      power: "",
      capacity: "",
      weight: ""
    }
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const snap = await getDocs(collection(db, "products"));
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = () => setFormData({ ...formData, features: [...formData.features, ""] });
  const handleRemoveFeature = (idx: number) => setFormData({ 
    ...formData, 
    features: formData.features.filter((_, i) => i !== idx) 
  });

  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadProgress(0);

    try {
      let imageUrls: string[] = [];
      
      console.log("Starting product save. Selected files:", selectedFiles.length);

      // Upload Images with Progress
      if (selectedFiles.length > 0) {
        const totalFiles = selectedFiles.length;
        for (let i = 0; i < totalFiles; i++) {
          const file = selectedFiles[i];
          const fileRef = ref(storage, `products/${Date.now()}_${file.name}`);
          
          console.log(`Uploading file ${i + 1}/${totalFiles}: ${file.name}`);
          
          const uploadTask = uploadBytesResumable(fileRef, file);
          
          await new Promise((resolve, reject) => {
            uploadTask.on('state_changed', 
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                const totalProgress = ((i / totalFiles) * 100) + (progress / totalFiles);
                setUploadProgress(Math.round(totalProgress));
              }, 
              (error) => {
                console.error("Upload error:", error);
                reject(error);
              }, 
              async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                imageUrls.push(url);
                resolve(true);
              }
            );
          });
        }
      }

      console.log("Images uploaded. Saving to Firestore...");

      const productData = {
        ...formData,
        price: Number(formData.price),
        images: imageUrls.length > 0 ? imageUrls : (isEditing ? products.find(p => p.id === isEditing).images : []),
        updatedAt: serverTimestamp(),
        createdAt: isEditing ? undefined : serverTimestamp()
      };

      if (isEditing) {
        await updateDoc(doc(db, "products", isEditing), productData);
        toast.success("Product updated!");
      } else {
        await addDoc(collection(db, "products"), productData);
        toast.success("Product added!");
      }

      console.log("Save successful!");
      setShowModal(false);
      setIsEditing(null);
      resetForm();
      fetchProducts();
    } catch (err: any) {
      console.error("Full error details:", err);
      toast.error(`Operation failed: ${err.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      regNo: "",
      category: "Chaff Cutter",
      description: "",
      urduDescription: "",
      features: [""],
      specifications: { power: "", capacity: "", weight: "" }
    });
    setSelectedFiles([]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-4xl font-black text-black">Machine <span className="text-primary">Inventory</span></h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Manage Seth Tufail Foundry Products</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-primary/20 scale-100 active:scale-95"
        >
          <Plus size={20} /> Add New Machine
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-[2rem]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group relative">
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                  {product.category}
                </div>
                <div className="absolute top-4 right-4 bg-primary text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg">
                  Rs. {product.price.toLocaleString()}
                </div>
              </div>

              <div className="p-8 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black text-black group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-widest">Reg No: {product.regNo}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => { setIsEditing(product.id); setFormData(product); setShowModal(true); }}
                    className="flex-1 bg-gray-50 hover:bg-black hover:text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-black">{isEditing ? "Edit" : "Add New"} <span className="text-primary">Machine</span></h2>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Fill details accurately for customers</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto custom-scrollbar space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Machine Name</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-gray-100 focus:border-primary px-6 py-4 rounded-2xl font-bold outline-none transition-all"
                      placeholder="e.g. Seth Muhammad Tufail Toka No.1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Retail Price (Rs)</label>
                      <input 
                        required
                        type="number"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                        className="w-full bg-gray-50 border-2 border-gray-100 focus:border-primary px-6 py-4 rounded-2xl font-bold outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Reg No</label>
                      <input 
                        required
                        value={formData.regNo}
                        onChange={e => setFormData({...formData, regNo: e.target.value})}
                        className="w-full bg-gray-50 border-2 border-gray-100 focus:border-primary px-6 py-4 rounded-2xl font-bold outline-none transition-all"
                        placeholder="37397"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-gray-100 focus:border-primary px-6 py-4 rounded-2xl font-bold outline-none transition-all appearance-none"
                    >
                      <option>Chaff Cutter</option>
                      <option>Wheat Thresher</option>
                      <option>Rotavator</option>
                      <option>Spare Parts</option>
                    </select>
                  </div>
                </div>

                {/* Descriptions */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Description (English)</label>
                    <textarea 
                      rows={3}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-gray-100 focus:border-primary px-6 py-4 rounded-2xl font-medium outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 font-urdu">Description (Urdu)</label>
                    <textarea 
                      rows={3}
                      dir="rtl"
                      value={formData.urduDescription}
                      onChange={e => setFormData({...formData, urduDescription: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-gray-100 focus:border-primary px-6 py-4 rounded-2xl font-urdu outline-none transition-all text-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-gray-50 p-8 rounded-[2rem] space-y-6">
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                  <Layers size={14} className="text-primary" /> Technical Specifications
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <input placeholder="Power (HP)" value={formData.specifications.power} onChange={e => setFormData({...formData, specifications: {...formData.specifications, power: e.target.value}})} className="bg-white px-6 py-4 rounded-xl border border-gray-200 outline-none focus:border-primary font-bold text-sm" />
                  <input placeholder="Capacity" value={formData.specifications.capacity} onChange={e => setFormData({...formData, specifications: {...formData.specifications, capacity: e.target.value}})} className="bg-white px-6 py-4 rounded-xl border border-gray-200 outline-none focus:border-primary font-bold text-sm" />
                  <input placeholder="Weight" value={formData.specifications.weight} onChange={e => setFormData({...formData, specifications: {...formData.specifications, weight: e.target.value}})} className="bg-white px-6 py-4 rounded-xl border border-gray-200 outline-none focus:border-primary font-bold text-sm" />
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Machine Features</label>
                  <button type="button" onClick={handleAddFeature} className="text-primary text-xs font-black uppercase tracking-widest">+ Add Feature</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        value={feature}
                        onChange={e => {
                          const newFeatures = [...formData.features];
                          newFeatures[idx] = e.target.value;
                          setFormData({...formData, features: newFeatures});
                        }}
                        className="flex-1 bg-gray-50 border-2 border-gray-100 focus:border-primary px-6 py-3 rounded-xl font-bold outline-none transition-all text-sm"
                        placeholder="Feature name..."
                      />
                      <button type="button" onClick={() => handleRemoveFeature(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Upload Machine Photos</label>
                <div className="flex flex-wrap gap-4">
                  {selectedFiles.map((file, i) => (
                    <div key={i} className="w-24 h-24 bg-gray-100 rounded-2xl relative overflow-hidden group">
                      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                      <button onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  <label className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary cursor-pointer transition-all">
                    <Plus size={24} />
                    <span className="text-[8px] font-black uppercase tracking-widest mt-1">Add Photo</span>
                    <input type="file" multiple className="hidden" onChange={e => setSelectedFiles([...selectedFiles, ...Array.from(e.target.files || [])])} />
                  </label>
                </div>
              </div>

              <div className="pt-8 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-5 bg-gray-100 text-gray-600 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit"
                  disabled={uploading}
                  className="flex-[2] py-5 bg-primary text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-primary/20 hover:bg-red-700 transition-all flex items-center justify-center gap-3 relative overflow-hidden disabled:opacity-70"
                >
                  {uploading && (
                    <div 
                      className="absolute inset-y-0 left-0 bg-black/20 transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  )}
                  <span className="relative z-10">
                    {uploading ? `Saving ${uploadProgress}%` : (isEditing ? "Update Machine" : "Launch Product")}
                  </span>
                  {!uploading && <Check size={20} className="relative z-10" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
