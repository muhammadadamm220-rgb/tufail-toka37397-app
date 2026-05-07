import { useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, increment, serverTimestamp } from "firebase/firestore";

export const useAnalytics = () => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const analyticsRef = doc(db, "siteAnalytics", today);
        
        await setDoc(analyticsRef, {
          date: today,
          pageViews: increment(1),
          totalVisitors: increment(1),
          lastUpdated: serverTimestamp()
        }, { merge: true });
      } catch (error) {
        console.error("Error tracking analytics:", error);
      }
    };

    trackVisit();
  }, []);
};
