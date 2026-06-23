import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5">
      <p className="text-xs uppercase tracking-[0.22em] text-gold-dark font-semibold mb-3">
        404
      </p>
      <h1 className="font-display text-3xl text-burgundy font-semibold mb-4">
        We couldn&apos;t find that page
      </h1>
      <p className="text-charcoal/70 text-sm mb-8 max-w-sm">
        The page you&apos;re looking for may have moved or no longer exists.
      </p>
      <Link
        href="/"
        className="rounded-full bg-burgundy text-cream px-7 py-3 text-sm font-semibold hover:bg-burgundy-dark transition-colors"
      >
        Back to Home
      </Link>
    </main>
  );
}
