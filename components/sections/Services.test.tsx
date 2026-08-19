import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fullConfig } from "@/test/fixtures";
import { Services } from "./Services";

describe("Services", () => {
  it("hides itself when there are no services", () => {
    expect(render(<Services />).container.firstChild).toBeNull();
    expect(render(<Services services={[]} />).container.firstChild).toBeNull();
  });

  it("renders a service without a price", () => {
    render(<Services services={[{ name: "Widget Repair", description: "We repair widgets." }]} />);
    expect(screen.getByText("Widget Repair")).toBeTruthy();
    expect(screen.queryByText(/From \$/)).toBeNull();
  });

  it("renders every service, showing prices only where set", () => {
    render(<Services services={fullConfig.services} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("From $50")).toBeTruthy();
  });
});
