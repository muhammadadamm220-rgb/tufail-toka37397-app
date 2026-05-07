import type { Metadata } from "next";
import { Poppins, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-urdu",
});

export const metadata: Metadata = {
  title: "Seth M. Tufail Toka | Pakistan's No.1 Agricultural Machinery",
  description: "Official website of Seth M. Tufail Foundry (Pvt.) Ltd. Manufacturing the best Chaff Cutters (Toka), Wheat Threshers, and Rotavators in Pakistan since 1980.",
  keywords: ["Tufail Toka", "Chaff Cutter", "Agricultural Machinery Pakistan", "Wheat Thresher", "Faisalabad Agricultural Machinery"],
  icons: {
    icon: "/logo.png",
  },
};

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";
import AnalyticsTracker from "@/components/AnalyticsTracker";

import VisitorTracker from "@/components/VisitorTracker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${notoNastaliqUrdu.variable} antialiased font-poppins bg-[#fcfcfc]`}
      >
        <AuthProvider>
          <CartProvider>
            <VisitorTracker />
            <AnalyticsTracker />
            <Toaster 
            position="top-right"
            toastOptions={{
              className: 'rounded-2xl font-bold text-sm shadow-2xl border border-gray-100',
              duration: 4000,
            }}
          />
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
