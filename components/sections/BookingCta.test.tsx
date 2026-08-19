import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BookingCta } from "./BookingCta";

describe("BookingCta", () => {
  it("hides itself when there is no booking block", () => {
    expect(render(<BookingCta businessName="Acme Co" />).container.firstChild).toBeNull();
  });

  it("dials the number for phone booking", () => {
    const { container } = render(
      <BookingCta booking={{ type: "phone", value: "(555) 010-2030" }} businessName="Acme Co" />,
    );
    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe("tel:5550102030");
    expect(link?.getAttribute("target")).toBeNull();
    expect(screen.getByText("Call (555) 010-2030")).toBeTruthy();
  });

  it("opens an external booking link in a new tab", () => {
    const { container } = render(
      <BookingCta
        booking={{ type: "link", value: "https://acme.example/book" }}
        businessName="Acme Co"
      />,
    );
    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe("https://acme.example/book");
    expect(link?.getAttribute("target")).toBe("_blank");
    expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("embeds the booking form when the type is embed", () => {
    const { container } = render(
      <BookingCta
        booking={{ type: "embed", value: "https://acme.example/embed" }}
        businessName="Acme Co"
      />,
    );
    const iframe = container.querySelector("iframe");
    expect(iframe?.getAttribute("src")).toBe("https://acme.example/embed");
    expect(iframe?.getAttribute("title")).toBe("Booking form for Acme Co");
    expect(container.querySelector("a")).toBeNull();
  });
});
