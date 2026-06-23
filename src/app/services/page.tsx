import ServiceCard from "@/components/ServiceCard";

// Each service uses a photo. The 4 that were hard to match with stock photos
// now point to local files you place in: public/images/services/
// Just drop a photo with the exact filename shown and it appears here.
// You can do this for ANY service: set its "image" to a local path and drop
// the file in that folder.
const SERVICES = [
  {
    name: "Hydra Facial",
    description: "Deep cleansing, hydrating facial treatment for a refreshed, glowing complexion.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=450&fit=crop",
  },
  {
    name: "Professional Makeup",
    description: "Bridal, event and everyday makeup application by our skilled artists.",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=450&fit=crop",
  },
  {
    name: "Braiding Services",
    description: "All styles of cornrows and braids, neatly and skillfully done.",
    image: "/images/services/braiding.jpg",
  },
  {
    name: "Wig Revamping",
    description: "Bring an old wig back to life: washing, styling, and restoring its shine.",
    image: "/images/services/wig-revamping.jpg",
  },
  {
    name: "Eyelash Extensions",
    description: "Natural or dramatic lash extensions tailored to your look.",
    image: "/images/services/eyelash.jpg",
  },
  {
    name: "Manicure & Pedicure",
    description: "Full nail care and polish for hands and feet.",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=450&fit=crop",
  },
  {
    name: "Barbing",
    description: "Sharp, clean cuts and lineups for men and boys.",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=450&fit=crop",
  },
  {
    name: "Cornrow & Braided Wigs",
    description: "Custom braided wig styles, made to order in all styles.",
    image: "/images/services/cornrow.jpg",
  },
];

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 sm:px-8 py-10 sm:py-16">
      <div className="mb-10 sm:mb-12 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-gold-dark font-semibold mb-3">
          Walk-In Services Available
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-burgundy font-semibold mb-4">
          Salon Services
        </h1>
        <p className="text-charcoal/75 leading-relaxed text-sm sm:text-base">
          Royal Beauty is a full unisex salon. Tap any service below to book
          on WhatsApp, or simply walk in at our Karsana, Abuja location.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {SERVICES.map((service) => (
          <ServiceCard
            key={service.name}
            name={service.name}
            description={service.description}
            image={service.image}
          />
        ))}
      </div>
    </main>
  );
}