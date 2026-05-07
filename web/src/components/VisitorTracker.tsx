"use client";

import { useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment, setDoc } from "firebase/firestore";

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisitor = async () => {
      const statsRef = doc(db, "site_stats", "counters");
      try {
        await updateDoc(statsRef, {
          totalVisitors: increment(1),
          lastVisit: new Date().toISOString()
        });
      } catch (e) {
        // If doc doesn't exist, create it
        await setDoc(statsRef, {
          totalVisitors: 1,
          lastVisit: new Date().toISOString()
        }, { merge: true });
      }
    };

    trackVisitor();
  }, []);

  return null; // This component doesn't render anything
}
