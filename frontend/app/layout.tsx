import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/Web3Provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ProphetBase | Crypto Prediction Markets on Base",
  description: "Trade predictions on crypto events with real USDC on Base L2. Decentralized prediction markets for the crypto community.",
  keywords: ["prediction markets", "crypto", "Base", "USDC", "DeFi", "blockchain", "trading"],
  authors: [{ name: "ProphetBase" }],
  creator: "ProphetBase",
  publisher: "ProphetBase",
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://prophetbase.vercel.app',
    title: 'ProphetBase | Crypto Prediction Markets on Base',
    description: 'Trade predictions on crypto events with real USDC on Base L2',
    siteName: 'ProphetBase',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ProphetBase - Crypto Prediction Markets',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProphetBase | Crypto Prediction Markets on Base',
    description: 'Trade predictions on crypto events with real USDC on Base L2',
    images: ['/og-image.png'],
    creator: '@prophetbase',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
