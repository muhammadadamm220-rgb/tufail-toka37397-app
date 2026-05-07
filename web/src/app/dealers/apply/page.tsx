"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, ChevronRight, CheckCircle, Store, User, MapPin, ClipboardList, Camera } from "lucide-react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function DealerApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    city: "",
    area: "",
    previousExperience: "no",
    cnicFront: null as File | null,
    cnicBack: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "cnicFront" | "cnicBack") => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let cnicFrontUrl = "";
      let cnicBackUrl = "";

      if (formData.cnicFront) {
        const frontRef = ref(storage, `dealer_applications/${Date.now()}_front_${formData.cnicFront.name}`);
        const snap = await uploadBytes(frontRef, formData.cnicFront);
        cnicFrontUrl = await getDownloadURL(snap.ref);
      }

      if (formData.cnicBack) {
        const backRef = ref(storage, `dealer_applications/${Date.now()}_back_${formData.cnicBack.name}`);
        const snap = await uploadBytes(backRef, formData.cnicBack);
        cnicBackUrl = await getDownloadURL(snap.ref);
      }

      await addDoc(collection(db, "dealer_applications"), {
        ...formData,
        cnicFront: cnicFrontUrl,
        cnicBack: cnicBackUrl,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center space-y-6"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-bold">Application Received!</h2>
          <p className="text-gray-500">Thank you for your interest. Our team will review your information and contact you within 3-5 business days.</p>
          <button 
            onClick={() => router.push("/")}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-neutral-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Join Our <span className="text-primary">Dealer Network</span></h1>
          <p className="text-gray-500">Apply to become an authorized representative of Seth M. Tufail Foundry.</p>
        </div>

        {/* Progress bar */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  step >= s ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {s}
                </div>
                {s < 3 && <div className={`w-8 h-1 rounded-full ${step > s ? "bg-primary" : "bg-gray-100"}`} />}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-8">
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 text-primary mb-2">
                <User size={24} />
                <h3 className="text-xl font-bold">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 ml-1">Full Name</label>
                  <input 
                    required
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 ml-1">Father's Name</label>
                  <input 
                    required
                    type="text"
                    placeholder="Father's name"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary outline-none transition-all"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 ml-1">City</label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g. Faisalabad"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary outline-none transition-all"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 ml-1">Area / Tehsill</label>
                  <input 
                    required
                    type="text"
                    placeholder="Business area"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary outline-none transition-all"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  />
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all shadow-lg"
              >
                Next Step <ChevronRight size={20} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3 text-primary mb-2">
                <Camera size={24} />
                <h3 className="text-xl font-bold">Identity Verification</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-600 block text-center">CNIC Front Side</label>
                  <div className="relative group cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "cnicFront")}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className={`aspect-[1.6/1] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${
                      formData.cnicFront ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50 group-hover:bg-gray-100"
                    }`}>
                      {formData.cnicFront ? (
                        <>
                          <CheckCircle className="text-green-500" size={32} />
                          <span className="text-xs font-bold text-green-600">{formData.cnicFront.name}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="text-gray-400" size={32} />
                          <span className="text-sm font-bold text-gray-500">Click to Upload</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-600 block text-center">CNIC Back Side</label>
                  <div className="relative group cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "cnicBack")}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className={`aspect-[1.6/1] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${
                      formData.cnicBack ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50 group-hover:bg-gray-100"
                    }`}>
                      {formData.cnicBack ? (
                        <>
                          <CheckCircle className="text-green-500" size={32} />
                          <span className="text-xs font-bold text-green-600">{formData.cnicBack.name}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="text-gray-400" size={32} />
                          <span className="text-sm font-bold text-gray-500">Click to Upload</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  Back
                </button>
                <button 
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-[2] bg-black text-white py-4 rounded-2xl font-bold hover:bg-neutral-800 transition-all shadow-lg"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3 text-primary mb-2">
                <ClipboardList size={24} />
                <h3 className="text-xl font-bold">Additional Details</h3>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-600 block">Have you ever held a dealership before?</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, previousExperience: "yes" })}
                    className={`py-4 rounded-2xl font-bold border-2 transition-all ${
                      formData.previousExperience === "yes" 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-gray-100 bg-gray-50 text-gray-500"
                    }`}
                  >
                    Yes, I have
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, previousExperience: "no" })}
                    className={`py-4 rounded-2xl font-bold border-2 transition-all ${
                      formData.previousExperience === "no" 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-gray-100 bg-gray-50 text-gray-500"
                    }`}
                  >
                    No, I haven't
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 italic">By submitting this application, you agree that all information provided is accurate and truthful. Providing false information will lead to immediate rejection of the dealership application.</p>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  Back
                </button>
                <button 
                  disabled={loading}
                  type="submit"
                  className="flex-[2] bg-primary text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
}
