import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fullConfig } from "@/test/fixtures";
import { Hours } from "./Hours";

describe("Hours", () => {
  it("hides itself when there are no hours", () => {
    expect(render(<Hours />).container.firstChild).toBeNull();
    expect(render(<Hours hours={[]} />).container.firstChild).toBeNull();
  });

  it("renders a single day", () => {
    render(<Hours hours={[{ day: "sunday", open: "10:00", close: "14:00" }]} />);
    expect(screen.getByText("Sunday")).toBeTruthy();
    expect(screen.getByText("10:00 AM – 2:00 PM")).toBeTruthy();
  });

  it("collapses shared days and keeps the rest separate", () => {
    render(<Hours hours={fullConfig.contact.hours} />);
    expect(screen.getByText("Mon – Tue")).toBeTruthy();
    expect(screen.getByText("Saturday")).toBeTruthy();
    expect(screen.getByText("9:00 AM – 5:00 PM")).toBeTruthy();
  });
});
