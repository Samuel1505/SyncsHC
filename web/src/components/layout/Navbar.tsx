"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Menu, X } from "lucide-react";
import WalletButton from "@/components/shared/WalletButton";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Create", href: "/create" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-navy/80 backdrop-blur-lg border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center group-hover:bg-accent/25 transition-colors">
                <ShieldCheck size={16} className="text-accent" />
              </div>
              <span className="text-lg font-bold font-display tracking-tight">
                Syncs<span className="text-accent">HC</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href) && !link.href.includes("#");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-accent"
                        : "text-muted hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: wallet + mobile toggle */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <WalletButton />
              </div>
              <button
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-muted hover:text-white transition-colors"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-navy-700/95 backdrop-blur-xl border-b border-white/10 md:hidden"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-muted hover:text-white hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-white/10 mt-2">
                <WalletButton />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
