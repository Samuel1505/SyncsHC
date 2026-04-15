"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Copy, Check, Code2, X, BookOpen, MessageCircle } from "lucide-react";
import { CONTRACT_ADDRESS } from "@/lib/utils";
import toast from "react-hot-toast";

const SOCIAL_LINKS = [
  { icon: Code2, label: "GitHub", href: "https://github.com" },
  { icon: X, label: "Twitter/X", href: "https://twitter.com" },
  { icon: MessageCircle, label: "Discord", href: "https://discord.com" },
  { icon: BookOpen, label: "Docs", href: "#" },
];

const FOOTER_LINKS = [
  { label: "Documentation", href: "#" },
  { label: "GitHub", href: "https://github.com" },
  { label: "Audits", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Privacy", href: "#" },
];

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const copyContract = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    toast.success("Contract address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="bg-navy-800 border-t border-white/[0.06] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top row */}
        <div className="flex flex-col md:flex-row gap-8 justify-between mb-10">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
                <ShieldCheck size={16} className="text-accent" />
              </div>
              <span className="text-lg font-bold font-display">
                Syncs<span className="text-accent">HC</span>
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              A decentralized savings protocol on Stacks. Lock. Save. Earn your discipline.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social */}
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-muted hover:text-white transition-all"
                aria-label={label}
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Contract address */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-8">
          <span className="text-xs text-subtle uppercase tracking-widest font-medium shrink-0">
            Contract
          </span>
          <code className="text-xs text-muted font-mono break-all flex-1">
            {CONTRACT_ADDRESS}
          </code>
          <button
            onClick={copyContract}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-accent/10 border border-white/10 hover:border-accent/30 text-xs text-muted hover:text-accent transition-all shrink-0"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.06]">
          <p className="text-xs text-subtle">
            © 2026 SyncsHC. All rights reserved.
          </p>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <span className="w-3 h-3 rounded-sm bg-[#F7931A] inline-block" />
            <span className="text-xs text-muted">Built on Stacks</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
