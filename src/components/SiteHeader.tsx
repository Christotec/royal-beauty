"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-gold/30">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold flex-shrink-0">
              <Image
                src="/images/logo.jpg?v=2"
                alt="Royal Beauty Unisex Salon logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-xl sm:text-2xl text-burgundy font-semibold tracking-tight">
                Royal Beauty
              </span>
              <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.18em] text-gold-dark">
                Unisex Salon
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm font-semibold text-charcoal hover:text-burgundy transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://wa.me/2347013532484"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-burgundy text-cream px-5 py-2.5 text-sm font-semibold hover:bg-burgundy-dark transition-colors"
            >
              Chat on WhatsApp
            </a>
          </nav>

          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-burgundy"
          >
            {open ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" /></svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gold/30 bg-cream px-5 pb-6 pt-2">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-body text-base font-semibold text-charcoal py-1"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://wa.me/2347013532484"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-full bg-burgundy text-cream px-5 py-3 text-sm font-semibold text-center"
            >
              Chat on WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}