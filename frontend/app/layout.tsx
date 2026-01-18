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
                {/* Primary Meta Tags */}
                <title>ProphetBase | Decentralized Prediction Markets on Base</title>
                <meta name="title" content="ProphetBase | Decentralized Prediction Markets on Base" />
                <meta name="description" content="Trade predictions on crypto, DeFi, politics, and sports with real USDC on Base L2. Decentralized, transparent, and secure prediction markets." />
                <meta name="keywords" content="prediction markets, crypto, DeFi, Base, blockchain, USDC, trading, forecasting" />
                <meta name="author" content="ProphetBase" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="theme-color" content="#2563eb" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://prophetbase.vercel.app/" />
                <meta property="og:title" content="ProphetBase | Decentralized Prediction Markets on Base" />
                <meta property="og:description" content="Trade predictions on crypto, DeFi, politics, and sports with real USDC on Base L2." />
                <meta property="og:image" content="https://prophetbase.vercel.app/og-image.png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:site_name" content="ProphetBase" />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://prophetbase.vercel.app/" />
                <meta property="twitter:title" content="ProphetBase | Decentralized Prediction Markets on Base" />
                <meta property="twitter:description" content="Trade predictions on crypto, DeFi, politics, and sports with real USDC on Base L2." />
                <meta property="twitter:image" content="https://prophetbase.vercel.app/og-image.png" />

                {/* Favicon */}
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" content="/apple-touch-icon.png" />

                {/* Canonical URL */}
                <link rel="canonical" href="https://prophetbase.vercel.app/" />
            </head>
            <body className={`${inter.variable} font-sans antialiased`}>
                <Web3Provider>
                    {children}
                </Web3Provider>
            </body>
        </html>
    );
}
