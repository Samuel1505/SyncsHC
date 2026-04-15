import type { Metadata } from "next";
import { Inter, DM_Sans, Geist_Mono } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SyncsHC — Save Smarter. Lock Stronger.",
  description:
    "A decentralized savings protocol on Stacks. Lock STX or SIP-010 tokens for a set duration and earn your financial discipline.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-navy text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
