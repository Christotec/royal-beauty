import type { Metadata } from "next";
import { Playfair_Display, Mulish } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const bodyFont = Mulish({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Royal Beauty Unisex Salon | Your Beauty, Our Pride",
  description:
    "Royal Beauty Unisex Salon, Abuja. 100% human hair extensions, wigs, bundles, closures, frontals, hair accessories, bags, shoes and full unisex salon services. Quality you can trust, beauty you'll love.",
  keywords: [
    "Royal Beauty Salon",
    "human hair extensions Abuja",
    "wigs Abuja",
    "unisex salon Karsana",
    "hair bundles Nigeria",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} font-body antialiased bg-cream text-charcoal`}
      >
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
