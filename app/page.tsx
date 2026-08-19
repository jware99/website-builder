import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SiteNav, type NavItem } from "@/components/chrome/SiteNav";
import { About } from "@/components/sections/About";
import { BookingCta } from "@/components/sections/BookingCta";
import { Contact } from "@/components/sections/Contact";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Hours } from "@/components/sections/Hours";
import { Services } from "@/components/sections/Services";
import { brandStyle } from "@/lib/brand";
import { getSiteConfig } from "@/lib/config";
import { resolveBaseUrl } from "@/lib/metadata";
import { buildLocalBusinessJsonLd, serializeJsonLd } from "@/lib/structured-data";

export default function Home() {
  const config = getSiteConfig();
  const { business, brand, contact, services, about, booking, gallery } = config;
  const jsonLd = serializeJsonLd(buildLocalBusinessJsonLd(config, resolveBaseUrl()));

  const hasServices = Boolean(services?.length);
  const hasAbout = Boolean(about?.story || about?.staff?.length);
  const hasHours = Boolean(contact.hours?.length);
  const hasGallery = Boolean(gallery?.length);

  // Section order is fixed, but which ones appear comes from the config, so
  // striping has to be computed over the sections that actually render.
  const striped = [
    hasServices && "services",
    hasAbout && "about",
    hasHours && "hours",
    hasGallery && "gallery",
    "contact",
  ].filter((value): value is string => Boolean(value));

  const toneFor = (id: string): "plain" | "surface" =>
    striped.indexOf(id) % 2 === 0 ? "surface" : "plain";

  const navItems: NavItem[] = [
    hasServices && { href: "#services", label: "Services" },
    hasAbout && { href: "#about", label: "About" },
    hasHours && { href: "#hours", label: "Hours" },
    hasGallery && { href: "#gallery", label: "Gallery" },
    booking && { href: "#booking", label: "Book" },
    { href: "#contact", label: "Contact" },
  ].filter((value): value is NavItem => Boolean(value));

  return (
    <div style={brandStyle(brand)} className="flex flex-1 flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <SiteNav businessName={business.name} phone={contact.phone} items={navItems} />

      <main className="flex-1">
        <Hero business={business} brand={brand} phone={contact.phone} />
        <Services services={services} tone={toneFor("services")} />
        <About about={about} businessName={business.name} tone={toneFor("about")} />
        <Hours hours={contact.hours} tone={toneFor("hours")} />
        <Gallery images={gallery} tone={toneFor("gallery")} />
        <BookingCta booking={booking} businessName={business.name} />
        <Contact contact={contact} businessName={business.name} tone={toneFor("contact")} />
      </main>

      <SiteFooter businessName={business.name} contact={contact} />
    </div>
  );
}
