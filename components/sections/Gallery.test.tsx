import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fullConfig } from "@/test/fixtures";
import { Gallery } from "./Gallery";

describe("Gallery", () => {
  it("hides itself when there are no images", () => {
    expect(render(<Gallery />).container.firstChild).toBeNull();
    expect(render(<Gallery images={[]} />).container.firstChild).toBeNull();
  });

  it("renders an image without a caption", () => {
    render(<Gallery images={[{ src: "/images/gallery/service-bay.svg", alt: "The work area" }]} />);
    expect(screen.getByAltText("The work area")).toBeTruthy();
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("renders captions only where they exist", () => {
    render(<Gallery images={fullConfig.gallery} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Out front")).toBeTruthy();
  });
});
