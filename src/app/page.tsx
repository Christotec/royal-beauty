import Image from "next/image";
import Link from "next/link";
import { getActiveProducts } from "@/lib/products";
import { CATEGORY_LIST, CATEGORY_LABELS, type Category } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60;

// Temporary stock photos for the category tiles. Replace these with the
// client's real product photos when she has them, just swap the URL string
// for each category below.
const CATEGORY_IMAGES: Record<Category, string> = {
  "human-hair":
    "https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?w=600&h=750&fit=crop",
  "hair-extensions":
    "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=750&fit=crop",
  "hair-accessories":
    "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=750&fit=crop",
  bags:
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=750&fit=crop",
  shoes:
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop",
};

export default async function HomePage() {
  const products = await getActiveProducts();
  const featured = products.slice(0, 4);

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blush via-cream to-cream">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10 sm:py-24 grid sm:grid-cols-2 gap-6 sm:gap-12 items-center">
          <div className="fade-up order-2 sm:order-1">
            <p className="font-body text-xs uppercase tracking-[0.22em] text-gold-dark mb-3 sm:mb-4">
              Quality You Can Trust, Beauty You&apos;ll Love
            </p>
            <h1 className="font-display text-3xl sm:text-5xl text-burgundy font-semibold leading-[1.1] mb-4 sm:mb-5">
              Your Beauty,<br />Our Pride.
            </h1>
            <p className="text-charcoal/80 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-md">
              100% human hair extensions, wigs, bundles and frontals, plus
              bags, shoes and accessories. Browse the collection, pick what
              you love, and complete your order straight on WhatsApp.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                href="/products"
                className="rounded-full bg-burgundy text-cream px-7 py-3.5 text-sm font-semibold hover:bg-burgundy-dark transition-colors"
              >
                Shop the Collection
              </Link>
              <Link
                href="/services"
                className="rounded-full border-2 border-burgundy text-burgundy px-7 py-3.5 text-sm font-semibold hover:bg-burgundy hover:text-cream transition-colors"
              >
                Salon Services
              </Link>
            </div>
          </div>

          <div className="order-1 sm:order-2 flex justify-center">
            <div className="gold-halo relative w-44 h-44 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-gold shadow-xl">
              <Image
                src="/images/logo.jpg"
                alt="Royal Beauty bridal makeup artistry"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
        <div className="divider-gold" />
      </section>

      {/* AD VIDEO */}
      <section className="bg-cream py-10 sm:py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 grid sm:grid-cols-2 gap-6 sm:gap-10 items-center">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.22em] text-gold-dark mb-3">
              See Us In Action
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-burgundy font-semibold mb-4">
              Inside Royal Beauty
            </h2>
            <p className="text-charcoal/80 leading-relaxed mb-6 max-w-md">
              Take a look at our work, our products, and what makes Royal
              Beauty the choice for quality hair, accessories, and a full
              salon experience.
            </p>
            <Link
              href="/products"
              className="inline-block rounded-full bg-burgundy text-cream px-7 py-3.5 text-sm font-semibold hover:bg-burgundy-dark transition-colors"
            >
              Shop Now
            </Link>
          </div>
          <div className="flex justify-center">
            <video
              className="w-full max-w-[320px] rounded-2xl border-2 border-gold shadow-xl"
              controls
              playsInline
              preload="metadata"
              poster="/images/logo.jpg"
            >
              <source src="/videos/royal-beauty-ad.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-10 sm:py-16">
        <h2 className="font-display text-2xl sm:text-3xl text-burgundy font-semibold text-center mb-2">
          Shop by Category
        </h2>
        <p className="text-center text-charcoal/70 mb-10 text-sm sm:text-base">
          Every piece sourced for quality, softness, and a natural finish.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {CATEGORY_LIST.map((cat) => (
            <Link
              key={cat}
              href={`/products?category=${cat}`}
              className="group relative rounded-2xl overflow-hidden border border-gold/40 aspect-[4/5] hover:border-gold hover:shadow-md transition-all"
            >
              <Image
                src={CATEGORY_IMAGES[cat]}
                alt={CATEGORY_LABELS[cat]}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/80 via-burgundy-dark/10 to-transparent" />
              <span className="absolute bottom-3 left-0 right-0 text-center font-display text-sm sm:text-base text-cream font-semibold px-2 leading-snug">
                {CATEGORY_LABELS[cat]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 sm:px-8 py-10 sm:py-16">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-display text-2xl sm:text-3xl text-burgundy font-semibold">
              New In
            </h2>
            <Link href="/products" className="text-sm font-semibold text-burgundy hover:text-gold-dark transition-colors">
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* WALK-IN SERVICES PROMO */}
      <section className="bg-blush py-10 sm:py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 grid sm:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.22em] text-gold-dark mb-3">
              Walk-In Services Available
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-burgundy font-semibold mb-4">
              Hydra Facials, Braiding, Barbing &amp; More
            </h2>
            <p className="text-charcoal/80 leading-relaxed mb-6 max-w-md">
              Beyond hair and accessories, Royal Beauty is a full unisex
              salon. Walk in for a hydra facial, professional makeup,
              braiding, manicure and pedicure, or barbing, all under one roof.
            </p>
            <Link
              href="/services"
              className="inline-block rounded-full bg-burgundy text-cream px-7 py-3.5 text-sm font-semibold hover:bg-burgundy-dark transition-colors"
            >
              See All Services
            </Link>
          </div>
          <div className="rounded-2xl border border-gold/40 bg-white p-8">
            <ul className="space-y-3 text-sm sm:text-base text-charcoal/85">
              <li className="flex gap-2"><span className="text-gold-dark">&#10003;</span> Quality Service</li>
              <li className="flex gap-2"><span className="text-gold-dark">&#10003;</span> Affordable Prices</li>
              <li className="flex gap-2"><span className="text-gold-dark">&#10003;</span> Fast &amp; Reliable Delivery</li>
              <li className="flex gap-2"><span className="text-gold-dark">&#10003;</span> Trusted by Many Satisfied Clients</li>
              <li className="flex gap-2"><span className="text-gold-dark">&#10003;</span> Money Back Guarantee on 100% Human Hair</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}