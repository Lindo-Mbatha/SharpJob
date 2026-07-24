import fs from "node:fs";

function readCoverage(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw);

  if (!parsed.total) {
    throw new Error(`Missing total coverage block in ${filePath}`);
  }

  return parsed.total;
}

function pct(value) {
  return Number((value ?? 0).toFixed(2));
}

const [basePath, currentPath] = process.argv.slice(2);

if (!basePath || !currentPath) {
  console.error("Usage: node scripts/compareCoverageBaseline.mjs <base-summary.json> <current-summary.json>");
  process.exit(2);
}

const base = readCoverage(basePath);
const current = readCoverage(currentPath);

const metrics = ["statements", "branches", "functions", "lines"];
const regressions = [];

for (const metric of metrics) {
  const basePct = pct(base[metric]?.pct);
  const currentPct = pct(current[metric]?.pct);

  if (currentPct < basePct) {
    regressions.push({ metric, basePct, currentPct });
  }
}

if (regressions.length > 0) {
  console.error("Coverage regression detected against moving baseline:");
  for (const item of regressions) {
    console.error(`- ${item.metric}: base=${item.basePct}% current=${item.currentPct}%`);
  }
  process.exit(1);
}

console.log("Coverage meets or exceeds moving baseline for statements/branches/functions/lines.");
