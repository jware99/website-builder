import type { Metadata } from "next";
import type { SiteConfig } from "./site-config-schema";

const FALLBACK_BASE_URL = "http://localhost:3000";

/**
 * Absolute URLs for Open Graph and the sitemap. Not part of the config
 * contract, because the same config should deploy to a staging and a
 * production host without being edited.
 */
export function resolveBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? FALLBACK_BASE_URL;
}

/** Derives page metadata from `seo`, falling back to `business` when absent. */
export function buildMetadata(config: SiteConfig, baseUrl = resolveBaseUrl()): Metadata {
  const { business, seo, brand } = config;

  const title =
    seo?.title ?? (business.tagline ? `${business.name} — ${business.tagline}` : business.name);
  const description = seo?.description ?? business.description ?? business.tagline;
  const images = seo?.ogImage ? [{ url: seo.ogImage }] : undefined;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    applicationName: business.name,
    alternates: { canonical: "/" },
    icons: brand?.logoUrl ? { icon: brand.logoUrl } : undefined,
    openGraph: {
      type: "website",
      siteName: business.name,
      title,
      description,
      url: "/",
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title,
      description,
      images,
    },
  };
}
