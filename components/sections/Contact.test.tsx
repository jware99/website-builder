import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fullConfig, minimalConfig } from "@/test/fixtures";
import { Contact } from "./Contact";

describe("Contact", () => {
  it("renders with only a phone number", () => {
    const { container } = render(
      <Contact contact={minimalConfig.contact} businessName="Acme Co" />,
    );
    expect(container.querySelector('a[href="tel:5550102030"]')).not.toBeNull();
    expect(screen.queryByText("Email")).toBeNull();
    expect(screen.queryByText("Address")).toBeNull();
    expect(container.querySelector("iframe")).toBeNull();
  });

  it("renders an email without an address", () => {
    const { container } = render(
      <Contact contact={{ phone: "555", email: "hi@acme.example" }} businessName="Acme Co" />,
    );
    expect(container.querySelector('a[href="mailto:hi@acme.example"]')).not.toBeNull();
    expect(container.querySelector("iframe")).toBeNull();
  });

  it("falls back to the address when mapQuery is absent", () => {
    const { container } = render(
      <Contact
        contact={{ phone: "555", address: "1 Main St, Springfield, IL" }}
        businessName="Acme Co"
      />,
    );
    const iframe = container.querySelector("iframe");
    expect(iframe?.getAttribute("src")).toContain("1%20Main%20St");
  });

  it("renders every row when the config is complete", () => {
    const { container } = render(<Contact contact={fullConfig.contact} businessName="Acme Co" />);
    expect(screen.getByText("Email")).toBeTruthy();
    expect(screen.getByText("Address")).toBeTruthy();
    expect(screen.getByText("Open in Maps")).toBeTruthy();
    expect(container.querySelector("iframe")).not.toBeNull();
  });
});
