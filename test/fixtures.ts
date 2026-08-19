import type { SiteConfig } from "@/lib/site-config-schema";

/** Only the two required fields — the floor a generator must always hit. */
export const minimalConfig: SiteConfig = {
  schemaVersion: 1,
  business: { name: "Acme Co" },
  contact: { phone: "(555) 010-2030" },
};

/** Every optional section populated. */
export const fullConfig: SiteConfig = {
  schemaVersion: 1,
  business: {
    name: "Acme Co",
    tagline: "We do the thing.",
    description: "A longer description of the thing we do.",
    industry: "widgets",
  },
  brand: {
    primaryColor: "#123456",
    accentColor: "#abcdef",
    logoUrl: "/images/logo.svg",
    headingFont: "Georgia, serif",
  },
  contact: {
    phone: "(555) 010-2030",
    email: "hi@acme.example",
    address: "1 Main St, Springfield, IL",
    mapQuery: "1 Main St, Springfield, IL",
    hours: [
      { day: "monday", open: "09:00", close: "17:00" },
      { day: "tuesday", open: "09:00", close: "17:00" },
      { day: "saturday", open: "10:00", close: "14:00" },
    ],
  },
  services: [
    { name: "Widget Tuning", description: "We tune widgets.", price: "From $50" },
    { name: "Widget Repair", description: "We repair widgets." },
  ],
  about: {
    story: "Founded in a garage.",
    staff: [
      { name: "Dana Reed", role: "Owner", photoUrl: "/images/staff/person-1.svg", bio: "Runs it." },
      { name: "Sam Fox", role: "Technician" },
    ],
  },
  booking: { type: "link", value: "https://acme.example/book" },
  gallery: [
    { src: "/images/gallery/shop-front.svg", alt: "The storefront", caption: "Out front" },
    { src: "/images/gallery/service-bay.svg", alt: "The work area" },
  ],
  seo: {
    title: "Acme Co — Widgets",
    description: "Widget services in Springfield.",
    ogImage: "/images/og.svg",
  },
  provenance: {
    sourceUrls: ["https://example.com/acme"],
    generatedAt: "2026-01-15T12:00:00.000Z",
    reviewedByHuman: true,
  },
};
