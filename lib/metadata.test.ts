import type { Metadata } from "next";
import { describe, expect, it } from "vitest";
import { fullConfig, minimalConfig } from "@/test/fixtures";
import { buildMetadata } from "./metadata";

const BASE = "https://acme.example";

// `Metadata["twitter"]` is a union whose variants disagree on `card`.
const twitterCard = (metadata: Metadata) =>
  (metadata.twitter as { card?: string } | undefined)?.card;

describe("buildMetadata", () => {
  it("falls back to the business name when there is no seo block", () => {
    const metadata = buildMetadata(minimalConfig, BASE);
    expect(metadata.title).toBe("Acme Co");
    expect(metadata.description).toBeUndefined();
    expect(metadata.openGraph?.images).toBeUndefined();
    expect(twitterCard(metadata)).toBe("summary");
  });

  it("builds a title from name and tagline when seo.title is absent", () => {
    const config = { ...fullConfig, seo: undefined };
    expect(buildMetadata(config, BASE).title).toBe("Acme Co — We do the thing.");
  });

  it("falls back to the business description", () => {
    const config = { ...fullConfig, seo: { title: "T" } };
    expect(buildMetadata(config, BASE).description).toBe(
      "A longer description of the thing we do.",
    );
  });

  it("prefers seo values and uses a large card when an image exists", () => {
    const metadata = buildMetadata(fullConfig, BASE);
    expect(metadata.title).toBe("Acme Co — Widgets");
    expect(metadata.description).toBe("Widget services in Springfield.");
    expect(metadata.openGraph?.images).toEqual([{ url: "/images/og.svg" }]);
    expect(twitterCard(metadata)).toBe("summary_large_image");
  });

  it("uses the logo as the icon and sets the base url", () => {
    const metadata = buildMetadata(fullConfig, BASE);
    expect(metadata.icons).toEqual({ icon: "/images/logo.svg" });
    expect(metadata.metadataBase?.toString()).toBe(`${BASE}/`);
  });
});
