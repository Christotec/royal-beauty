"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const TABS = [
  { href: "/admin", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/services", label: "Services" },
];

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
      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-3 flex flex-col sm:flex-row sm:h-16 sm:items-center sm:justify-between gap-3">
        <Link href="/admin" className="font-display text-lg text-burgundy font-semibold">
          Royal Beauty Admin
        </Link>
        <nav className="flex items-center flex-wrap gap-x-5 gap-y-2">
          {TABS.map((tab) => {
            const active =
              tab.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`text-sm font-semibold transition-colors ${
                  active ? "text-burgundy" : "text-charcoal hover:text-burgundy"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
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