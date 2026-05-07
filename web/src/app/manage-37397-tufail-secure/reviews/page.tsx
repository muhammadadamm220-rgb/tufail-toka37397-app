"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Star, MessageSquare, User, Calendar, Loader2, ShieldCheck } from "lucide-react";

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-black">PRODUCT <span className="text-primary">REVIEWS</span></h1>
          <p className="text-gray-500 font-medium mt-1">Manage customer feedback and ratings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-2xl flex items-center justify-center">
            <Star fill="currentColor" />
          </div>
          <div>
            <p className="text-2xl font-black text-black">4.8</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Average Rating</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
            <MessageSquare />
          </div>
          <div>
            <p className="text-2xl font-black text-black">{reviews.length}</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Total Reviews</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
            <ShieldCheck />
          </div>
          <div>
            <p className="text-2xl font-black text-black">98%</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Verified Buyers</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Rating</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Comment</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                          <User size={20} />
                        </div>
                        <p className="font-bold text-black">{review.userName || "Anonymous"}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                        {review.productName || "General"}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1 text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-gray-500 text-sm italic line-clamp-2 max-w-xs">"{review.comment}"</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={14} />
                        <span className="text-xs font-medium">
                          {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : "Just now"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-400">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare size={40} />
                    </div>
                    <p className="font-bold uppercase tracking-widest text-xs">No reviews found yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
