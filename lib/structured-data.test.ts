import { describe, expect, it } from "vitest";
import { fullConfig, minimalConfig } from "@/test/fixtures";
import { buildLocalBusinessJsonLd, serializeJsonLd } from "./structured-data";

const BASE = "https://acme.example";

describe("buildLocalBusinessJsonLd", () => {
  it("omits every absent field rather than emitting it empty", () => {
    const data = buildLocalBusinessJsonLd(minimalConfig, BASE);
    expect(data).toEqual({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Acme Co",
      url: BASE,
      telephone: "(555) 010-2030",
    });
  });

  it("emits one opening hours entry per configured day", () => {
    const data = buildLocalBusinessJsonLd(fullConfig, BASE);
    expect(data.openingHoursSpecification).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "https://schema.org/Monday",
        opens: "09:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "https://schema.org/Tuesday",
        opens: "09:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "https://schema.org/Saturday",
        opens: "10:00",
        closes: "14:00",
      },
    ]);
  });

  it("makes local image paths absolute and keeps remote ones", () => {
    const config = {
      ...fullConfig,
      gallery: [{ src: "https://cdn.example/a.jpg", alt: "Remote" }],
    };
    expect(buildLocalBusinessJsonLd(config, BASE).image).toEqual([
      `${BASE}/images/og.svg`,
      "https://cdn.example/a.jpg",
    ]);
  });
});

describe("serializeJsonLd", () => {
  it("escapes angle brackets so config text cannot close the script tag", () => {
    const serialized = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(serialized).not.toContain("</script>");
    expect(serialized).toContain("\\u003c/script>");
  });

  it("still parses back to the original value", () => {
    const value = { name: "A < B" };
    expect(JSON.parse(serializeJsonLd(value))).toEqual(value);
  });
});
