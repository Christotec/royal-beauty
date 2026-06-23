"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return null;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-gold/30 bg-white">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/admin" className="font-display text-lg text-burgundy font-semibold">
          Royal Beauty Admin
        </Link>
        <nav className="flex items-center gap-5">
          <Link href="/admin" className="text-sm font-semibold text-charcoal hover:text-burgundy transition-colors">
            Products
          </Link>
          <Link href="/admin/products/new" className="text-sm font-semibold text-charcoal hover:text-burgundy transition-colors">
            Add Product
          </Link>
          <Link href="/" className="text-sm font-semibold text-charcoal hover:text-burgundy transition-colors">
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-burgundy hover:text-burgundy-dark transition-colors"
          >
            Log Out
          </button>
        </nav>
      </div>
    </header>
  );
}
