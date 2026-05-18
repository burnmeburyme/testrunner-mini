#!/usr/bin/env node
// 🧪 testrunner-mini — Zero-dependency Node.js Test Runner

const fs   = require('fs');
const path = require('path');

const GREEN  = '\x1b[32m'; const RED    = '\x1b[31m';
const YELLOW = '\x1b[33m'; const CYAN   = '\x1b[36m';
const BOLD   = '\x1b[1m';  const DIM    = '\x1b[2m';
const NC     = '\x1b[0m';

// ── Assertion library ─────────────────────────────────────
function expect(actual) {
  return {
    toBe:          (exp) => { if (actual !== exp)           throw new Error(`Expected ${JSON.stringify(exp)}\nReceived ${JSON.stringify(actual)}`); },
    toEqual:       (exp) => { if (JSON.stringify(actual) !== JSON.stringify(exp)) throw new Error(`Expected ${JSON.stringify(exp)}\nReceived ${JSON.stringify(actual)}`); },
    toBeTruthy:    ()    => { if (!actual)                  throw new Error(`Expected truthy, got ${JSON.stringify(actual)}`); },
    toBeFalsy:     ()    => { if (actual)                   throw new Error(`Expected falsy, got ${JSON.stringify(actual)}`); },
    toContain:     (exp) => { if (!actual?.includes?.(exp)) throw new Error(`Expected "${actual}" to contain "${exp}"`); },
    toBeNull:      ()    => { if (actual !== null)          throw new Error(`Expected null, got ${JSON.stringify(actual)}`); },
    toBeUndefined: ()    => { if (actual !== undefined)     throw new Error(`Expected undefined, got ${JSON.stringify(actual)}`); },
    toThrow:       ()    => { try { actual(); throw new Error('Did not throw'); } catch (e) { if (e.message === 'Did not throw') throw e; } },
    toBeGreaterThan: (n) => { if (actual <= n)              throw new Error(`Expected ${actual} > ${n}`); },
    toBeLessThan:    (n) => { if (actual >= n)              throw new Error(`Expected ${actual} < ${n}`); },
    not: {
      toBe:      (exp) => { if (actual === exp)             throw new Error(`Expected NOT ${JSON.stringify(exp)}`); },
      toContain: (exp) => { if (actual?.includes?.(exp))   throw new Error(`Expected "${actual}" NOT to contain "${exp}"`); },
    },
  };
}

// ── Test registry ─────────────────────────────────────────
const results = { pass: 0, fail: 0, skip: 0, total: 0, errors: [] };
let currentFile = '';

function test(name, fn) {
  results.total++;
  const start = Date.now();
  try {
    const ret = fn();
    if (ret && typeof ret.then === 'function') {
      return ret.then(() => {
        const ms = Date.now() - start;
        console.log(`    ${GREEN}✅ ${name}${NC} ${DIM}(${ms}ms)${NC}`);
        results.pass++;
      }).catch(err => {
        const ms = Date.now() - start;
        console.log(`    ${RED}❌ ${name}${NC} ${DIM}(${ms}ms)${NC}`);
        console.log(`       ${DIM}${err.message}${NC}`);
        results.fail++;
        results.errors.push({ file: currentFile, name, error: err.message });
      });
    }
    const ms = Date.now() - start;
    console.log(`    ${GREEN}✅ ${name}${NC} ${DIM}(${ms}ms)${NC}`);
    results.pass++;
  } catch (err) {
    const ms = Date.now() - start;
    console.log(`    ${RED}❌ ${name}${NC} ${DIM}(${ms}ms)${NC}`);
    console.log(`       ${RED}${err.message}${NC}`);
    results.fail++;
    results.errors.push({ file: currentFile, name, error: err.message });
  }
}

function it(name, fn)   { return test(name, fn); }
function skip(name)     { console.log(`    ${YELLOW}⊘  ${name}${NC} ${DIM}(skipped)${NC}`); results.skip++; results.total++; }
function describe(label, fn) { console.log(`\n  ${BOLD}${label}${NC}`); fn(); }

// ── File discovery ─────────────────────────────────────────
function findTestFiles(dir, pattern = /\.test\.js$/) {
  const files = [];
  function walk(d) {
    if (!fs.existsSync(d)) return;
    fs.readdirSync(d).forEach(f => {
      const full = path.join(d, f);
      if (fs.statSync(full).isDirectory() && !['node_modules','.git','dist'].includes(f)) walk(full);
      else if (pattern.test(f)) files.push(full);
    });
  }
  walk(dir);
  return files;
}

// ── Main runner ────────────────────────────────────────────
async function runAll(target) {
  const startAll = Date.now();
  global.test = test; global.it = it; global.skip = skip;
  global.describe = describe; global.expect = expect;

  console.log(`\n${CYAN}${BOLD}🧪 testrunner-mini${NC}\n`);

  const isFile = fs.existsSync(target) && fs.statSync(target).isFile();
  const files  = isFile ? [path.resolve(target)] : findTestFiles(target || '.');

  if (!files.length) { console.log(`${YELLOW}No test files found.${NC}\n`); return; }

  for (const file of files) {
    currentFile = path.relative(process.cwd(), file);
    console.log(`  ${CYAN}${currentFile}${NC}`);
    try { require(file); } catch (e) { console.log(`    ${RED}❌ Failed to load: ${e.message}${NC}`); results.fail++; }
  }

  const ms = Date.now() - startAll;
  const pct = results.total ? Math.round((results.pass / results.total) * 100) : 0;
  const color = results.fail ? RED : GREEN;

  console.log(`\n${DIM}${'─'.repeat(50)}${NC}`);
  console.log(`  ${BOLD}Tests:${NC}  ${GREEN}${results.pass} passed${NC}${results.fail ? `, ${RED}${results.fail} failed${NC}` : ''}${results.skip ? `, ${YELLOW}${results.skip} skipped${NC}` : ''} ${DIM}(${results.total} total)${NC}`);
  console.log(`  ${BOLD}Time:${NC}   ${ms}ms`);
  console.log(`  ${BOLD}Score:${NC}  ${color}${pct}%${NC}\n`);

  if (results.fail > 0) process.exit(1);
}

const target = process.argv[2] || '.';
runAll(target).catch(console.error);

module.exports = { test, it, skip, describe, expect };
