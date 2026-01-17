'use client'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/Web3Provider";
import { useState, useEffect } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Note: Metadata export must be removed when using 'use client'
// Move metadata to a separate metadata.ts file if needed

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by only rendering Web3Provider on client
  if (!mounted) {
    return (
      <html lang="en">
        <head>
          <title>ProphetBase | Crypto Prediction Markets on Base</title>
          <meta name="description" content="Trade predictions on crypto events with real USDC on Base L2" />
        </head>
        <body className={`${inter.variable} font-sans antialiased`}>
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <title>ProphetBase | Crypto Prediction Markets on Base</title>
        <meta name="description" content="Trade predictions on crypto events with real USDC on Base L2" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
