import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Green Compute Oracle | Verifiable Carbon Intelligence",
  description: "Real-time verifiable green compute metrics and cryptographic attestations for sustainable AI inference. Monitor carbon emissions, energy usage, and generate W3C-compliant verifiable credentials.",
  keywords: ["green compute", "carbon tracking", "AI sustainability", "verifiable credentials", "energy monitoring"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
