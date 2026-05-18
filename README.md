# 🧪 testrunner-mini

> A zero-dependency test runner for Node.js that prints beautiful terminal output.

[![CI](https://img.shields.io/github/actions/workflow/status/yourusername/testrunner-mini/ci.yml?style=for-the-badge)](https://github.com/yourusername/testrunner-mini/actions)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](./LICENSE)
[![Codespace Ready](https://img.shields.io/badge/Codespace-Ready-green?style=for-the-badge&logo=github)](https://codespaces.new/yourusername/testrunner-mini)

---

## 🚀 What is testrunner-mini?

`testrunner-mini` is a lightweight, zero-dependency Node.js test runner. No config, no setup — just write test files and run them. Gets out of your way with clean output, fast execution, and human-readable failures.

```javascript
// math.test.js
const { test, expect } = require('testrunner-mini');

test('adds two numbers', () => {
  expect(1 + 1).toBe(2);
});

test('handles strings', () => {
  expect('hello'.toUpperCase()).toBe('HELLO');
});

test('async works fine', async () => {
  const result = await Promise.resolve(42);
  expect(result).toBe(42);
});
```

```bash
# Run all test files
testrunner-mini

# Run specific file
testrunner-mini src/math.test.js

# Watch mode
testrunner-mini --watch

# JSON output for CI
testrunner-mini --reporter json
```

---

## ✨ Features

- ⚡ Zero dependencies — uses only Node.js built-ins
- 🎨 Beautiful colored terminal output
- ⏱️ Per-test and total execution timing
- 🔄 Watch mode with debounced re-runs
- 📊 Pass/fail/skip summary with percentages
- 🧩 `test`, `it`, `describe`, `beforeEach`, `afterEach`
- 📋 JSON and TAP reporters for CI pipelines
- 💬 Detailed diff output on assertion failures

---

## 📊 Sample Output

```
🧪 testrunner-mini

  math.test.js
    ✅ adds two numbers           (0.3ms)
    ✅ handles strings            (0.1ms)
    ✅ async works fine           (2.1ms)

  auth.test.js
    ✅ validates email format     (0.4ms)
    ❌ rejects weak passwords     (1.2ms)
       Expected: true
       Received: false

─────────────────────────────────────
  Tests:  4 passed, 1 failed (5 total)
  Time:   4.1ms
```

---

## 🏆 GitHub Achievement Scripts

```bash
bash scripts/setup.sh
bash scripts/unlock-all.sh
bash scripts/quickdraw.sh
bash scripts/yolo.sh
bash scripts/publicist.sh
bash scripts/pull-shark.sh 2
bash scripts/pair-extraordinaire.sh "Name" "email@example.com"
node src/achievement-tracker.js
```

---

## 🤝 Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md)
