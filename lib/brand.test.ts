import { describe, expect, it } from "vitest";
import { brandStyle } from "./brand";

describe("brandStyle", () => {
  it("emits nothing when there is no brand block", () => {
    expect(brandStyle(undefined)).toEqual({});
    expect(brandStyle({})).toEqual({});
  });

  it("emits only the properties that are set", () => {
    expect(brandStyle({ primaryColor: "#123456" })).toEqual({ "--brand-primary": "#123456" });
  });

  it("maps every brand field", () => {
    expect(
      brandStyle({
        primaryColor: "#123456",
        accentColor: "#abcdef",
        headingFont: "Georgia, serif",
        logoUrl: "/images/logo.svg",
      }),
    ).toEqual({
      "--brand-primary": "#123456",
      "--brand-accent": "#abcdef",
      "--brand-heading-font": "Georgia, serif",
    });
  });
});
