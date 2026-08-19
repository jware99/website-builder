import fs from "node:fs";
import path from "node:path";
import type { ZodError } from "zod";
import { siteConfigSchema, type SiteConfig } from "./site-config-schema";

const DEFAULT_CONFIG_FILE = "site.config.json";

export class SiteConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SiteConfigError";
  }
}

/** `SITE_CONFIG_PATH` lets the preview script point at an example config. */
export function resolveConfigPath(configPath?: string): string {
  const target = configPath ?? process.env.SITE_CONFIG_PATH ?? DEFAULT_CONFIG_FILE;
  // The config is read while prerendering, never at request time, so the
  // bundler does not need to trace the project for it.
  return path.isAbsolute(target) ? target : path.join(/* turbopackIgnore: true */ process.cwd(), target);
}

function formatFieldPath(segments: readonly PropertyKey[]): string {
  if (segments.length === 0) return "(root)";
  return segments.reduce<string>((acc, segment) => {
    if (typeof segment === "number") return `${acc}[${segment}]`;
    return acc === "" ? String(segment) : `${acc}.${String(segment)}`;
  }, "");
}

function valueAt(data: unknown, segments: readonly PropertyKey[]): unknown {
  return segments.reduce<unknown>((acc, segment) => {
    if (acc === null || typeof acc !== "object") return undefined;
    return (acc as Record<PropertyKey, unknown>)[segment];
  }, data);
}

function describeIssues(error: ZodError, data: unknown): string {
  return error.issues
    .map((issue) => {
      const field = formatFieldPath(issue.path);
      const isMissing =
        issue.code === "invalid_type" && valueAt(data, issue.path) === undefined;
      return `  • ${field} — ${isMissing ? "is required but missing" : issue.message}`;
    })
    .join("\n");
}

/** Reads and validates a config file, bypassing the cache. */
export function loadSiteConfig(configPath?: string): SiteConfig {
  const file = resolveConfigPath(configPath);

  let raw: string;
  try {
    raw = fs.readFileSync(file, "utf8");
  } catch {
    throw new SiteConfigError(
      `No site config found at ${file}. Create one, or set SITE_CONFIG_PATH to point at an example.`,
    );
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new SiteConfigError(`${file} is not valid JSON: ${detail}`);
  }

  const result = siteConfigSchema.safeParse(data);
  if (!result.success) {
    throw new SiteConfigError(
      `${file} does not match the site config schema:\n${describeIssues(result.error, data)}`,
    );
  }

  return result.data;
}

const cache = new Map<string, SiteConfig>();

/** Reads the config once per path and reuses it for the rest of the process. */
export function getSiteConfig(configPath?: string): SiteConfig {
  const file = resolveConfigPath(configPath);
  const cached = cache.get(file);
  if (cached) return cached;

  const config = loadSiteConfig(file);
  cache.set(file, config);
  return config;
}
