import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadSiteConfig, resolveConfigPath, SiteConfigError } from "./config";

function tempConfig(contents: unknown): string {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "site-config-")), "config.json");
  fs.writeFileSync(file, typeof contents === "string" ? contents : JSON.stringify(contents));
  return file;
}

const minimal = {
  schemaVersion: 1,
  business: { name: "Acme Co" },
  contact: { phone: "(555) 010-2030" },
};

describe("resolveConfigPath", () => {
  it("defaults to site.config.json at the project root", () => {
    expect(resolveConfigPath()).toBe(path.join(process.cwd(), "site.config.json"));
  });

  it("passes absolute paths through", () => {
    expect(resolveConfigPath("/tmp/other.json")).toBe("/tmp/other.json");
  });
});

describe("loadSiteConfig", () => {
  it("accepts a config with only the required fields", () => {
    const config = loadSiteConfig(tempConfig(minimal));
    expect(config.business.name).toBe("Acme Co");
    expect(config.services).toBeUndefined();
  });

  it("loads the committed root config", () => {
    expect(loadSiteConfig("site.config.json").business.name).toBeTruthy();
  });

  it.each(["dental", "salon", "bakery"])("loads the %s example", (name) => {
    const config = loadSiteConfig(path.join("examples", `${name}.json`));
    expect(config.business.name).toBeTruthy();
    expect(config.contact.phone).toBeTruthy();
  });

  it("names every missing required field", () => {
    const file = tempConfig({ schemaVersion: 1, business: {}, contact: {} });
    expect(() => loadSiteConfig(file)).toThrow(SiteConfigError);
    try {
      loadSiteConfig(file);
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toContain("business.name — is required but missing");
      expect(message).toContain("contact.phone — is required but missing");
    }
  });

  it("reports the field path inside an array", () => {
    const file = tempConfig({ ...minimal, services: [{ name: "A", description: "" }] });
    expect(() => loadSiteConfig(file)).toThrow(/services\[0\]\.description/);
  });

  it("rejects unknown keys so generator typos are loud", () => {
    const file = tempConfig({ ...minimal, services: [{ name: "A", description: "B", cost: 5 }] });
    expect(() => loadSiteConfig(file)).toThrow(/Unrecognized key/);
  });

  it("rejects malformed values with a readable message", () => {
    const file = tempConfig({ ...minimal, brand: { primaryColor: "blue" } });
    expect(() => loadSiteConfig(file)).toThrow(/must be a hex color/);
  });

  it("rejects an unsupported schema version", () => {
    const file = tempConfig({ ...minimal, schemaVersion: 99 });
    expect(() => loadSiteConfig(file)).toThrow(/schemaVersion/);
  });

  it("explains a missing file", () => {
    expect(() => loadSiteConfig("/tmp/definitely-absent-config.json")).toThrow(
      /No site config found/,
    );
  });

  it("explains malformed JSON", () => {
    expect(() => loadSiteConfig(tempConfig("{ nope"))).toThrow(/not valid JSON/);
  });
});
