#!/usr/bin/env node
/**
 * PostToolUse hook: run `eslint --fix` on files Claude just wrote/edited.
 *
 * Implemented in Node (not a jq one-liner) because `jq` is not installed on
 * this machine and Node is guaranteed present. Reads the hook payload as JSON
 * on stdin, extracts the edited file path, and only lints files inside the
 * project's lint scope (src/components except ui, src/pages, Layout.jsx).
 *
 * Always exits 0 — a formatter hook must never block Claude's work.
 */
import { spawnSync } from "node:child_process";

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    // If nothing is piped in, don't hang.
    setTimeout(() => resolve(data), 2000).unref?.();
  });
}

const raw = await readStdin();
let payload = {};
try {
  payload = JSON.parse(raw || "{}");
} catch {
  process.exit(0);
}

const filePath =
  payload?.tool_response?.filePath || payload?.tool_input?.file_path || "";
if (!filePath) process.exit(0);

// Normalize Windows backslashes to forward slashes for matching.
const p = filePath.replace(/\\/g, "/");

const inScope =
  (/\/src\/components\//.test(p) && !/\/src\/components\/ui\//.test(p)) ||
  /\/src\/pages\//.test(p) ||
  /\/Layout\.jsx$/.test(p);

const isLintable = /\.(jsx?|tsx?)$/.test(p);

if (!inScope || !isLintable) process.exit(0);

// `shell: true` so `npx`/`npx.cmd` resolves on both Git Bash and PowerShell.
spawnSync("npx", ["eslint", "--fix", filePath], {
  stdio: "ignore",
  shell: true,
});

process.exit(0);
