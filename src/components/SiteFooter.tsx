"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-burgundy text-cream mt-12 sm:mt-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <h3 className="font-display text-2xl font-semibold mb-2">Royal Beauty</h3>
            <p className="text-sm text-cream/80 leading-relaxed">
              Your Beauty, Our Pride. Quality you can trust, beauty you&apos;ll love.
            </p>
          </div>

          <div>
            <h4 className="font-body text-xs uppercase tracking-[0.18em] text-gold-light mb-3">
              Visit Us
            </h4>
            <p className="text-sm text-cream/80 leading-relaxed">
              Shop 5, New York Plaza,<br />
              Efab Metropolis Estate,<br />
              Karsana, Abuja
            </p>
          </div>

          <div>
            <h4 className="font-body text-xs uppercase tracking-[0.18em] text-gold-light mb-3">
              Order or Book
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <a href="https://wa.me/2347013532484" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-gold-light transition-colors">
                WhatsApp: 0701 353 2484
              </a>
            </div>
            <div className="flex gap-4 mt-4">
              <a href="https://instagram.com/RoyalHairBeautyPalace" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-cream/80 hover:text-gold-light transition-colors">IG</a>
              <a href="https://tiktok.com/@RoyalHairBeautyPalace" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-cream/80 hover:text-gold-light transition-colors">TikTok</a>
              <a href="https://facebook.com/RoyalHairBeautyPalace" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-cream/80 hover:text-gold-light transition-colors">FB</a>
            </div>
          </div>
        </div>

        <div className="divider-gold opacity-40 my-8" />

        <div className="flex flex-col sm:flex-row justify-between gap-3 text-xs text-cream/60">
          <p>&copy; {new Date().getFullYear()} Royal Beauty Unisex Salon. All rights reserved.</p>
          <Link href="/admin" className="hover:text-gold-light transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}