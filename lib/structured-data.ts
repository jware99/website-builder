import { mapSearchHref } from "./format";
import type { DayOfWeek, SiteConfig } from "./site-config-schema";

const SCHEMA_DAYS: Record<DayOfWeek, string> = {
  monday: "https://schema.org/Monday",
  tuesday: "https://schema.org/Tuesday",
  wednesday: "https://schema.org/Wednesday",
  thursday: "https://schema.org/Thursday",
  friday: "https://schema.org/Friday",
  saturday: "https://schema.org/Saturday",
  sunday: "https://schema.org/Sunday",
};

function absolute(baseUrl: string, ref: string): string {
  return ref.startsWith("http://") || ref.startsWith("https://") ? ref : `${baseUrl}${ref}`;
}

/**
 * LocalBusiness markup, which is what populates Google's business panel.
 * Every property is omitted rather than emitted empty when its config field is
 * absent, since partial markup outranks wrong markup.
 */
export function buildLocalBusinessJsonLd(
  config: SiteConfig,
  baseUrl: string,
): Record<string, unknown> {
  const { business, contact, brand, seo, gallery } = config;

  const images = [
    ...(seo?.ogImage ? [seo.ogImage] : []),
    ...(gallery?.map((image) => image.src) ?? []),
  ].map((ref) => absolute(baseUrl, ref));

  const mapQuery = contact.mapQuery ?? contact.address;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    ...(business.description ? { description: business.description } : {}),
    ...(business.tagline ? { slogan: business.tagline } : {}),
    url: baseUrl,
    telephone: contact.phone,
    ...(contact.email ? { email: contact.email } : {}),
    ...(contact.address ? { address: contact.address } : {}),
    ...(mapQuery ? { hasMap: mapSearchHref(mapQuery) } : {}),
    ...(brand?.logoUrl ? { logo: absolute(baseUrl, brand.logoUrl) } : {}),
    ...(images.length ? { image: images } : {}),
    ...(contact.hours?.length
      ? {
          openingHoursSpecification: contact.hours.map((entry) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: SCHEMA_DAYS[entry.day],
            opens: entry.open,
            closes: entry.close,
          })),
        }
      : {}),
  };
}

/**
 * Config values originate from scraped pages, so they are treated as
 * untrusted: escaping `<` prevents a `</script>` sequence from breaking out of
 * the JSON-LD block.
 */
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
