import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DemoBanner } from "@/components/DemoBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MedVault | Patient-Centric Medical Record Vault & Clinical AI",
  description:
    "Secure personal health record vault with automated AI lab biomarker analysis, verified pharmacy dispensary, medication tracking, and granular doctor access sharing.",
  keywords: [
    "Medical Records Vault",
    "Clinical AI Report Analyzer",
    "Health Dashboard",
    "Medicine Delivery",
    "Prescription Refills",
    "Supabase Healthcare",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900`}
      >
        <StoreProvider>
          <DemoBanner />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
