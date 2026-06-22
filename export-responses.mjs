#!/usr/bin/env node
/**
 * Download QVPlus (and other) question responses for a survey as a ZIP archive.
 *
 * Why this script:
 *   The designer-facing export endpoint `/protected/surveys/:id/exports/respondents.zip`
 *   returns one JSON file per respondent containing the FULL `responseContent`
 *   for every question they answered — including QVPlus `rounds` and
 *   `followupAnswers`. It is gated only by Admin/Designer + collaborator, so
 *   no MongoDB Compass or `respondentsCanViewResults` toggle is required.
 *
 * Usage:
 *   TOKEN=<jwt> node scripts/qvplus/export-responses.mjs export <surveyId> [outputPath]
 *
 * Optional env vars:
 *   API_BASE — override the API base URL (default: http://localhost:6060/api/v1)
 *   STATUS   — filter responses (Complete | Completed | All; default: Complete)
 *   AS_OF    — ISO8601 timestamp; only include responses with derivedAt <= AS_OF
 *
 * Examples:
 *   TOKEN=eyJ... node scripts/qvplus/export-responses.mjs export 6a1814625e91cac1f18c9bb2
 *   TOKEN=eyJ... STATUS=All node scripts/qvplus/export-responses.mjs export 6a18... ./pilot.zip
 *
 * After download, inspect with:
 *   unzip -d pilot/ <outputPath>
 *   cat pilot/<respondent-uuid>.json | jq
 *
 * Requires Node 18+ (uses built-in global fetch + Web Streams).
 */

import { createWriteStream } from 'node:fs';
import { resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const TOKEN = process.env.TOKEN;
const API_BASE = process.env.API_BASE || 'http://localhost:6060/api/v1';
const STATUS = process.env.STATUS || 'Complete';
const AS_OF = process.env.AS_OF;

const USAGE =
  'Usage:\n  TOKEN=<jwt> node scripts/qvplus/export-responses.mjs export <surveyId> [outputPath]';

const [mode, surveyId, outputArg] = process.argv.slice(2);

if (mode !== 'export') {
  console.error('Error: first arg must be "export".');
  console.error(USAGE);
  process.exit(1);
}

if (!surveyId) {
  console.error('Error: export mode requires <surveyId> as the second arg.');
  console.error(USAGE);
  process.exit(1);
}

if (!TOKEN) {
  console.error('Error: TOKEN env var is required.');
  console.error('Hint: in your browser DevTools console run:');
  console.error('  localStorage.getItem("jwt_token")');
  console.error('then copy the value and prefix the command with TOKEN=...');
  process.exit(1);
}

// Build URL with optional query params.
const url = new URL(
  `${API_BASE}/protected/surveys/${surveyId}/exports/respondents.zip`,
);
if (STATUS) url.searchParams.set('status', STATUS);
if (AS_OF) url.searchParams.set('asOf', AS_OF);

// Output path: explicit arg overrides; otherwise a stable per-survey filename.
// (No timestamp by default — re-running just overwrites the prior export.)
const outputPath = resolve(
  outputArg || `qvplus-responses-${surveyId}.zip`,
);

console.log(`GET ${url.toString()}`);
console.log(`  → ${outputPath}`);

const res = await fetch(url, {
  headers: { Authorization: `Bearer ${TOKEN}` },
});

if (!res.ok) {
  // Best-effort error body decode; the server returns JSON for error cases
  // even though success is application/zip.
  const body = await res.text().catch(() => '');
  console.error(`\nFailed: status ${res.status}`);
  console.error(body || '(no body)');
  process.exit(1);
}

if (!res.body) {
  console.error('\nFailed: response had no body.');
  process.exit(1);
}

// Stream the zip directly to disk to avoid buffering large archives in memory.
await pipeline(Readable.fromWeb(res.body), createWriteStream(outputPath));

console.log(`\nSuccess. Saved zip to: ${outputPath}`);
console.log('\nNext steps:');
console.log(`  unzip -d responses/ ${outputPath}`);
console.log('  # then inspect each respondent JSON, e.g.');
console.log('  ls responses/ | head');
console.log('  cat responses/<uuid>.json | jq');