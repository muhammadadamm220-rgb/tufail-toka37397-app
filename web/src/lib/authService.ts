import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  signInWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { auth, db } from "./firebase";

export const handleSignup = async (name: string, email: string, password: string, phone: string, city: string) => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    
    // 1. Send verification email
    await sendEmailVerification(cred.user);
    
    // 2. Update display name in Auth
    await updateProfile(cred.user, { displayName: name });
    
    // 3. Generate referral code: TUFAIL-NAME-1234
    const firstName = name.split(" ")[0].toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const referralCode = `TUFAIL-${firstName}-${randomNum}`;
    
    // 4. Create user document in Firestore (Persists forever)
    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      name,
      email,
      phone,
      city,
      role: "customer",
      emailVerified: false,
      loyaltyPoints: 0,
      referralCode,
      savedAddresses: [],
      wishlist: [],
      createdAt: serverTimestamp()
    });
    
    // 5. Sign out until verified
    await firebaseSignOut(auth);
    
    return { success: true };
  } catch (err: any) {
    console.error("Signup error:", err);
    throw err;
  }
};

export const handleSignin = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if email is verified
    if (!result.user.emailVerified) {
      await firebaseSignOut(auth);
      throw new Error("Pehle Gmail se email verify karein (Please verify your email first)");
    }
    
    // Sync verification status to Firestore
    await updateDoc(doc(db, "users", result.user.uid), {
      emailVerified: true
    });
    
    // Get role for redirect
    const userSnap = await getDoc(doc(db, "users", result.user.uid));
    return { 
      success: true, 
      role: userSnap.data()?.role || "customer" 
    };
  } catch (err: any) {
    console.error("Signin error:", err);
    throw err;
  }
};
