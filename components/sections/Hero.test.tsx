import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fullConfig, minimalConfig } from "@/test/fixtures";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders with only the required fields", () => {
    const { container } = render(
      <Hero business={minimalConfig.business} phone={minimalConfig.contact.phone} />,
    );
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Acme Co");
    expect(container.querySelector("img")).toBeNull();
  });

  it("hides the optional lines that are absent", () => {
    render(<Hero business={{ name: "Acme Co", tagline: "We do the thing." }} phone="555" />);
    expect(screen.getByText("We do the thing.")).toBeTruthy();
    expect(screen.queryByText("A longer description of the thing we do.")).toBeNull();
  });

  it("renders the logo, tagline, and description when present", () => {
    const { container } = render(
      <Hero
        business={fullConfig.business}
        brand={fullConfig.brand}
        phone={fullConfig.contact.phone}
      />,
    );
    expect(screen.getByText("We do the thing.")).toBeTruthy();
    expect(screen.getByText("A longer description of the thing we do.")).toBeTruthy();
    expect(container.querySelector("img")).not.toBeNull();
  });

  it("links the phone number for dialing", () => {
    const { container } = render(<Hero business={{ name: "Acme Co" }} phone="(555) 010-2030" />);
    expect(container.querySelector('a[href="tel:5550102030"]')).not.toBeNull();
  });
});
