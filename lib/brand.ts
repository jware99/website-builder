import type { CSSProperties } from "react";
import type { Brand } from "./site-config-schema";

/**
 * Maps the `brand` config onto the CSS custom properties declared in
 * `globals.css`. Absent values are omitted so the stylesheet fallbacks apply,
 * which is why a config with no `brand` block still renders in the house style.
 */
export function brandStyle(brand?: Brand): CSSProperties {
  const style: Record<string, string> = {};
  if (brand?.primaryColor) style["--brand-primary"] = brand.primaryColor;
  if (brand?.accentColor) style["--brand-accent"] = brand.accentColor;
  if (brand?.headingFont) style["--brand-heading-font"] = brand.headingFont;
  return style as CSSProperties;
}
