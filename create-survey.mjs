#!/usr/bin/env node
/**
 * Build a whole survey's worth of questions from ONE minimal survey file.
 *
 * The survey file can be either:
 *   - a .json file  (classic — but HTML needs \" and markdown needs \n), or
 *   - a .mjs file   (recommended — `export default { ... }`; write multi-line
 *                    HTML/markdown inside backticks ` ` with NO escaping).
 * The script auto-detects by file extension; both produce the same payloads.
 *
 * Design goal (reliability): the FIXED structure of each question type lives in
 * this script as defaults. Your survey file only carries the TEXT you actually
 * edit (titles, descriptions, option labels). Add another Likert / Selection /
 * Text Block by copying a block from scripts/qvplus/templates/ and filling text.
 * (templates/ is reference-only — the script never reads it.)
 *
 * Question order = array order. Each question is POSTed SEQUENTIALLY because the
 * backend appends every new question to the end of survey.questions; sending in
 * order is what makes the survey order come out right.
 *
 * Prerequisites:
 *   - Backend server running (defaults to http://localhost:6060)
 *   - A valid JWT token from a logged-in Designer/Admin
 *     (grab it in the browser DevTools console: localStorage.getItem('jwt_token'))
 *   - The surveyId in your survey file already exists
 *
 * Usage (works the same for a .json or .mjs file):
 *   # Preview the payloads WITHOUT sending anything (recommended first):
 *   node scripts/qvplus/create-survey.mjs preview scripts/qvplus/survey.mjs
 *
 *   # Create every question in order:
 *   TOKEN=<jwt> node scripts/qvplus/create-survey.mjs create scripts/qvplus/survey.mjs
 *
 * Optional env vars:
 *   API_BASE — override the API base URL (default: http://localhost:6060/api/v1)
 *
 * Requires Node 18+ (built-in global fetch).
 *
 * ---- survey file shape (minimal — you only fill text) ----------------------
 * .mjs form (recommended — keys can be unquoted, strings can use backticks):
 * export default {
 *   surveyId: "....",
 *   questions: [
 *     { type: "text",   content: `<p>介紹文字</p>` },   // multi-line HTML ok
 *     { type: "single", question: "題目", options: ["A","B","C"] },
 *     { type: "multi",  question: "題目", options: ["A","B","C"] },
 *     { type: "textinput", question: "題目" },
 *     { type: "likert", question: "題目", points: 5, minLabel: "左端", maxLabel: "右端" },
 *     { type: "qv", question: "...", description: "...",
 *       setting: { totalCredits, version, sampleOption, ... }, options: [ ... ] },
 *     { type: "qvplus", question: "...", description: "...",
 *       setting: { ...full rounds... }, options: [ ... ] },
 *   ],
 * };
 * .json form is identical but every key/string needs double quotes, and any
 * HTML quote must be \" and every newline must be \n. See survey.example.mjs.
 *
 * Notes per type (everything not listed is filled by the defaults below):
 *   text      → content (HTML allowed). Optional: newPage (default true).
 *   single    → question, options[]. Optional: description, required (default true),
 *               displayControl ("radio" | "dropdown", default "radio").
 *   multi     → question, options[]. Optional: description, required (default true),
 *               minSelections, maxSelections (renders as checkboxes).
 *   textinput → question (free-text answer). Optional: description,
 *               multiline (default false = single line; true = paragraph),
 *               maxLength.
 *   likert    → question, minLabel, maxLabel. Optional: description, points
 *               (number of scale points, e.g. 5; default 6) or scale (an
 *               explicit array of labels, which overrides points).
 *   qv        → block (question, description, setting, options). setting needs
 *               totalCredits, version, sampleOption (questionType is forced to
 *               'qv'); each option needs a non-empty description. No rounds.
 *   qvplus    → full block (question, description, setting, options) —
 *               copy from scripts/qvplus/survey.example.mjs.
 *
 * options[] accepts plain strings ("選項A") or objects ({ optionName: "...",
 * description: "...", isExclusive: true }).
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const TOKEN = process.env.TOKEN;
const API_BASE = process.env.API_BASE || 'http://localhost:6060/api/v1';
const LIKERT_DEFAULT_POINTS = 6; // default 6-point scale (override per question with "points")

const USAGE = [
  'Usage:',
  '  node scripts/qvplus/create-survey.mjs preview <survey.json>',
  '  TOKEN=<jwt> node scripts/qvplus/create-survey.mjs create <survey.json>',
].join('\n');

const [mode, payloadPath] = process.argv.slice(2);

if (!['preview', 'create'].includes(mode)) {
  console.error('Error: first arg must be "preview" or "create".');
  console.error(USAGE);
  process.exit(1);
}
if (!payloadPath) {
  console.error('Error: survey JSON path is required.');
  console.error(USAGE);
  process.exit(1);
}

// ---- load + validate the survey file --------------------------------------

let survey;
try {
  const fullPath = resolve(payloadPath);
  if (/\.(mjs|js)$/.test(fullPath)) {
    // .mjs / .js → import 它的 default export（可用反引號寫多行 HTML/markdown）
    const mod = await import(pathToFileURL(fullPath).href);
    survey = mod.default;
  } else {
    // .json → 照舊讀檔 + 解析（舊檔案不受影響）
    const raw = await readFile(fullPath, 'utf-8');
    survey = JSON.parse(raw);
  }
} catch (err) {
  console.error(`Failed to read or parse ${payloadPath}:`, err.message);
  process.exit(1);
}

if (!survey.surveyId || survey.surveyId.startsWith('PUT_')) {
  console.error('Error: set a real "surveyId" at the top of the JSON.');
  process.exit(1);
}
if (!Array.isArray(survey.questions) || survey.questions.length === 0) {
  console.error('Error: "questions" must be a non-empty array.');
  process.exit(1);
}

// ---- normalize each minimal question into a full API payload ---------------

/** "選項A" | {optionName,...} → {optionName, description?, isExclusive?} */
function normalizeOption(opt) {
  if (typeof opt === 'string') return { optionName: opt };
  const out = { optionName: opt.optionName };
  if (opt.description) out.description = opt.description;
  if (opt.isExclusive) out.isExclusive = true;
  return out;
}

/** Map one minimal question to { endpoint, payload }. Throws on bad input. */
function buildQuestion(q, index, surveyId) {
  const where = `questions[${index}] (type: ${q.type})`;
  switch (q.type) {
    case 'text': {
      if (!q.content) throw new Error(`${where}: "content" is required.`);
      return {
        endpoint: 'text-block',
        payload: {
          surveyId,
          content: q.content,
          newPage: q.newPage ?? true,
        },
      };
    }
    case 'single': {
      if (!q.question) throw new Error(`${where}: "question" is required.`);
      if (!Array.isArray(q.options) || q.options.length < 1)
        throw new Error(`${where}: "options" must have at least 1 item.`);
      return {
        endpoint: 'selection',
        payload: {
          surveyId,
          question: q.question,
          ...(q.description ? { description: q.description } : {}),
          selectionMode: 'single',
          displayControl: q.displayControl ?? 'radio',
          required: q.required ?? true,
          options: q.options.map(normalizeOption),
        },
      };
    }
    case 'multi': {
      if (!q.question) throw new Error(`${where}: "question" is required.`);
      if (!Array.isArray(q.options) || q.options.length < 1)
        throw new Error(`${where}: "options" must have at least 1 item.`);
      return {
        endpoint: 'selection',
        payload: {
          surveyId,
          question: q.question,
          ...(q.description ? { description: q.description } : {}),
          selectionMode: 'multi',
          // multi always renders as checkboxes (backend forces this anyway)
          displayControl: q.displayControl ?? 'checkbox',
          required: q.required ?? true,
          ...(typeof q.minSelections === 'number'
            ? { minSelections: q.minSelections }
            : {}),
          ...(typeof q.maxSelections === 'number'
            ? { maxSelections: q.maxSelections }
            : {}),
          options: q.options.map(normalizeOption),
        },
      };
    }
    case 'textinput': {
      if (!q.question) throw new Error(`${where}: "question" is required.`);
      return {
        endpoint: 'text',
        payload: {
          surveyId,
          type: 'text',
          question: q.question,
          ...(q.description ? { description: q.description } : {}),
          // false = single-line input, true = paragraph textarea
          multiline: q.multiline ?? false,
          ...(typeof q.maxLength === 'number' ? { maxLength: q.maxLength } : {}),
        },
      };
    }
    case 'likert': {
      if (!q.question) throw new Error(`${where}: "question" is required.`);
      // Scale: an explicit "scale" array wins; otherwise generate 1..N from the
      // "points" number; if neither is given, fall back to the default points.
      let scale;
      if (Array.isArray(q.scale)) {
        scale = q.scale.map(String);
      } else {
        const points = q.points ?? LIKERT_DEFAULT_POINTS;
        if (!Number.isInteger(points) || points < 2 || points > 11)
          throw new Error(`${where}: "points" must be an integer between 2 and 11.`);
        scale = Array.from({ length: points }, (_, n) => String(n + 1));
      }
      return {
        endpoint: 'likert',
        payload: {
          type: 'likert',
          surveyId,
          question: q.question,
          ...(q.description ? { description: q.description } : {}),
          scale,
          ...(q.minLabel ? { minLabel: q.minLabel } : {}),
          ...(q.maxLabel ? { maxLabel: q.maxLabel } : {}),
        },
      };
    }
    case 'qv': {
      if (!q.question || !q.setting || !Array.isArray(q.options))
        throw new Error(`${where}: needs "question", "setting", and "options".`);
      return {
        endpoint: 'qv',
        payload: {
          surveyId,
          type: 'qv',
          // QV options require a non-empty description (backend QVOption DTO)
          question: q.question,
          description: q.description ?? '',
          // backend QVSettings.questionType must match 'qv' — force it so a
          // leftover "qvplus" in the JSON can't break the request
          setting: { ...q.setting, questionType: 'qv' },
          options: q.options,
        },
      };
    }
    case 'qvplus': {
      if (!q.question || !q.setting || !Array.isArray(q.options))
        throw new Error(`${where}: needs "question", "setting", and "options".`);
      return {
        endpoint: 'qvplus',
        payload: {
          surveyId,
          type: 'qvplus',
          question: q.question,
          ...(q.description ? { description: q.description } : {}),
          setting: q.setting,
          options: q.options,
        },
      };
    }
    default:
      throw new Error(
        `${where}: unknown type. Use text | single | multi | textinput | likert | qv | qvplus.`,
      );
  }
}

let built;
try {
  built = survey.questions.map((q, i) =>
    buildQuestion(q, i, survey.surveyId),
  );
} catch (err) {
  console.error(`\nValidation error: ${err.message}`);
  process.exit(1);
}

// ---- preview mode ----------------------------------------------------------

if (mode === 'preview') {
  console.log(`Survey: ${survey.surveyId}`);
  console.log(`Questions: ${built.length}\n`);
  built.forEach(({ endpoint, payload }, i) => {
    const label =
      payload.question ||
      (payload.content
        ? `${payload.content.replace(/<[^>]+>/g, '').slice(0, 30)}…`
        : '(no title)');
    console.log(`[${i + 1}] → POST .../questions/${endpoint}`);
    console.log(`      ${label}`);
    if (payload.options) {
      console.log(
        `      options: ${payload.options.map((o) => o.optionName).join(' / ')}`,
      );
    }
  });
  console.log('\nLooks good? Re-run with: TOKEN=<jwt> ... create <file>');
  process.exit(0);
}

// ---- create mode (sequential — order matters) ------------------------------

if (!TOKEN) {
  console.error('Error: TOKEN env var is required for create.');
  console.error('Hint: in browser DevTools console: localStorage.getItem("jwt_token")');
  process.exit(1);
}

console.log(`Creating ${built.length} questions in survey ${survey.surveyId}\n`);

const createdIds = [];
for (let i = 0; i < built.length; i++) {
  const { endpoint, payload } = built[i];
  const url = `${API_BASE}/protected/questions/${endpoint}`;
  const label = payload.question || payload.content?.slice(0, 30) || endpoint;

  process.stdout.write(`[${i + 1}/${built.length}] ${endpoint}: ${label} ... `);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => null);

  if (res.status !== 201) {
    console.log('FAILED');
    console.error(`\nStopped at question ${i + 1} (status ${res.status}).`);
    console.error(JSON.stringify(body, null, 2));
    console.error(`\n${i} question(s) were created before this failure:`);
    createdIds.forEach((id, n) => console.error(`  [${n + 1}] ${id}`));
    process.exit(1);
  }

  console.log(`ok (${body?._id})`);
  createdIds.push(body?._id);
}

console.log(`\nSuccess. Created ${createdIds.length} questions in order:`);
createdIds.forEach((id, n) => console.log(`  [${n + 1}] ${id}`));
process.exit(0);
