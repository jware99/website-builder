import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fullConfig } from "@/test/fixtures";
import { About } from "./About";

describe("About", () => {
  it("hides itself when there is no story and no staff", () => {
    expect(render(<About businessName="Acme Co" />).container.firstChild).toBeNull();
    expect(render(<About about={{}} businessName="Acme Co" />).container.firstChild).toBeNull();
  });

  it("renders with a story alone", () => {
    render(<About about={{ story: "Founded in a garage." }} businessName="Acme Co" />);
    expect(screen.getByText("Founded in a garage.")).toBeTruthy();
    expect(screen.queryByRole("listitem")).toBeNull();
  });

  it("renders with staff alone", () => {
    render(
      <About about={{ staff: [{ name: "Dana Reed", role: "Owner" }] }} businessName="Acme Co" />,
    );
    expect(screen.getByText("Dana Reed")).toBeTruthy();
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("renders story and staff, omitting absent photos and bios", () => {
    const { container } = render(<About about={fullConfig.about} businessName="Acme Co" />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("About Acme Co");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(container.querySelectorAll("img")).toHaveLength(1);
    expect(screen.queryByText("Sam Fox")).toBeTruthy();
  });
});
