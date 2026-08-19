import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/config";
import { resolveBaseUrl } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const config = getSiteConfig();
  const generatedAt = config.provenance?.generatedAt;

  return [
    {
      url: `${resolveBaseUrl()}/`,
      lastModified: generatedAt ? new Date(generatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
