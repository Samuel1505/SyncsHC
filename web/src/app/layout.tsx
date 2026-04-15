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
  other: {
    "talentapp:project_verification":
      "3aa63f6d8e5b065d53dcd18b62c8aee397bb04468d7546f772629c1a1ff77a30f912ef244a186c4772c6f74b85a4888bbfda0d90ad641bb88bf90fd21860c0de",
  },
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
