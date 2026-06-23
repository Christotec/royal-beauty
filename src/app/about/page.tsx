export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 sm:px-8 py-12 sm:py-16">
      <p className="text-xs uppercase tracking-[0.22em] text-gold-dark font-semibold mb-3">
        Your Beauty, Our Pride
      </p>
      <h1 className="font-display text-3xl sm:text-4xl text-burgundy font-semibold mb-6">
        About Royal Beauty
      </h1>
      <p className="text-charcoal/80 leading-relaxed mb-10 text-sm sm:text-base max-w-2xl">
        Royal Beauty Unisex Salon is built on one simple promise: quality you
        can trust, beauty you&apos;ll love. From 100% human hair extensions
        and wigs to bags, shoes, and a full range of salon services, every
        product and service is chosen and delivered with care.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        <div className="rounded-2xl border border-gold/30 bg-white p-6">
          <h2 className="font-display text-lg text-burgundy font-semibold mb-3">
            Visit Our Salon
          </h2>
          <p className="text-charcoal/75 text-sm leading-relaxed">
            Shop 5, New York Plaza,<br />
            Efab Metropolis Estate,<br />
            Karsana, Abuja
          </p>
        </div>

        <div className="rounded-2xl border border-gold/30 bg-white p-6">
          <h2 className="font-display text-lg text-burgundy font-semibold mb-3">
            Order or Book an Appointment
          </h2>
          <div className="flex flex-col gap-2 text-sm">
            <a href="https://wa.me/2347013532484" target="_blank" rel="noopener noreferrer" className="text-burgundy font-semibold hover:text-gold-dark transition-colors">
              WhatsApp: 0701 353 2484
            </a>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-blush p-6 sm:p-8">
        <h2 className="font-display text-lg text-burgundy font-semibold mb-4">
          Why Choose Us
        </h2>
        <ul className="grid sm:grid-cols-2 gap-3 text-sm text-charcoal/85">
          <li className="flex gap-2"><span className="text-gold-dark">&#10003;</span> Quality Service</li>
          <li className="flex gap-2"><span className="text-gold-dark">&#10003;</span> Affordable Prices</li>
          <li className="flex gap-2"><span className="text-gold-dark">&#10003;</span> Fast &amp; Reliable Delivery</li>
          <li className="flex gap-2"><span className="text-gold-dark">&#10003;</span> Trusted by Many Satisfied Clients</li>
          <li className="flex gap-2"><span className="text-gold-dark">&#10003;</span> Money Back Guarantee on 100% Human Hair</li>
          <li className="flex gap-2"><span className="text-gold-dark">&#10003;</span> Walk-In Services Available</li>
        </ul>
      </div>

      <div className="mt-10 text-center">
        <p className="text-charcoal/60 text-sm mb-2">Follow us on social media</p>
        <p className="font-display text-burgundy text-lg">@RoyalHairBeautyPalace</p>
      </div>
    </main>
  );
}