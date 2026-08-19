#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const EXAMPLES_DIR = path.join(process.cwd(), "examples");

function availableExamples() {
  if (!existsSync(EXAMPLES_DIR)) return [];
  return readdirSync(EXAMPLES_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => path.basename(file, ".json"))
    .sort();
}

function usage(message) {
  const examples = availableExamples();
  console.error(`${message}\n`);
  console.error("Usage: npm run preview <example>\n");
  console.error(examples.length ? `Available: ${examples.join(", ")}` : "No examples found.");
  console.error("Pass 'default' to preview the root site.config.json.");
  process.exit(1);
}

const name = process.argv[2];
if (!name) usage("Which example do you want to preview?");

const configPath =
  name === "default" ? "site.config.json" : path.join("examples", `${name}.json`);

if (!existsSync(path.join(process.cwd(), configPath))) {
  usage(`No config at ${configPath}.`);
}

console.log(`Previewing ${configPath}\n`);

const child = spawn("npx", ["next", "dev", ...process.argv.slice(3)], {
  stdio: "inherit",
  env: { ...process.env, SITE_CONFIG_PATH: configPath },
});

child.on("exit", (code) => process.exit(code ?? 0));
