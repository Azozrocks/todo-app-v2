---
phase: 01-core-todo-management
reviewed: 2026-07-07T00:00:00Z
depth: standard
files_reviewed: 7
files_reviewed_list:
  - .gitignore
  - bin/todo.js
  - lib/storage.js
  - package.json
  - test/add.test.js
  - test/done.test.js
  - test/list.test.js
findings:
  critical: 1
  warning: 3
  info: 3
  total: 7
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-07-07T00:00:00Z
**Depth:** standard
**Files Reviewed:** 7
**Status:** issues_found

## Summary

Reviewed the CLI entrypoint (`bin/todo.js`), the storage layer (`lib/storage.js`), package metadata, and the integration test suite for the `add`/`list`/`done` commands. The core add/list/done logic (positional numbering over the pending view, soft-delete via `done: true`, input validation on `done <n>`) is correctly implemented and well covered by integration tests, which all pass.

However, `package.json` is missing the `bin` field required for the tool's stated Core Value ("just `npm i -g .` and go") to actually work — a global install currently produces no `todo` executable at all. This is a functional blocker. Additionally, the storage layer has an inconsistency in error handling between reads (defensive, user-friendly errors) and writes (no error handling, raw exceptions), no atomicity guarantee on write, and no validation of individual todo item shape after parsing, which can cause silently-wrong behavior on malformed/hand-edited `todos.json` files.

## Critical Issues

### CR-01: `package.json` is missing the `bin` field — global install does not create the `todo` command

**File:** `package.json:1-9`
**Issue:** The project's stated Core Value (per `.claude/CLAUDE.md`) is "A user can add, view, and complete to-do items from the command line with zero setup friction — no config, no dependencies to install, just `npm i -g .` and go." `bin/todo.js` has a correct shebang and is executable (`chmod +x` verified), but `package.json` has no `"bin"` field mapping a command name to that script. Without it, `npm i -g .` installs the package into the global `node_modules` but creates **no** `todo` executable on the user's `PATH` — the CLI is entirely unusable as documented. This is not a hypothetical: it's the literal install path called out as the project's core value proposition, and it does not work.
**Fix:**
```json
{
  "name": "todo-app-v2",
  "version": "0.1.0",
  "private": true,
  "description": "A command-line to-do list manager that persists items to a local todos.json file per working directory.",
  "bin": {
    "todo": "./bin/todo.js"
  },
  "scripts": {
    "test": "node --test"
  }
}
```

## Warnings

### WR-01: `writeTodos()` has no error handling, unlike `readTodos()`

**File:** `lib/storage.js:44-46`
**Issue:** `readTodos()` wraps every filesystem/parse operation in try/catch and exits with a friendly, actionable message (lines 17-26, 28-34). `writeTodos()` calls `fs.writeFileSync` directly with no error handling at all. If the write fails (read-only filesystem, disk full, permission denied, directory deleted mid-run, etc.), the user gets a raw unhandled Node exception and stack trace instead of the same style of friendly error the rest of the tool uses — inconsistent UX and a rough edge for a "zero setup friction" CLI.
**Fix:**
```javascript
function writeTodos(todos) {
  try {
    fs.writeFileSync(getTodosPath(), JSON.stringify(todos, null, 2));
  } catch (err) {
    console.error(`Error: could not write ${getTodosPath()} (${err.message})`);
    process.exit(1);
  }
}
```

### WR-02: Non-atomic write risks corrupting `todos.json`

**File:** `lib/storage.js:44-46`
**Issue:** `writeTodos()` writes directly to the live `todos.json` path with a single `writeFileSync` call. If the process is killed mid-write (crash, `Ctrl+C`, power loss) or two `todo` invocations run concurrently in the same directory, `todos.json` can end up truncated or interleaved, and the next `readTodos()` call will report it as corrupt (losing all prior data, not just the in-flight change). A temp-file-plus-rename pattern makes the write atomic at the filesystem level.
**Fix:**
```javascript
function writeTodos(todos) {
  const todosPath = getTodosPath();
  const tmpPath = `${todosPath}.${process.pid}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(todos, null, 2));
  fs.renameSync(tmpPath, todosPath);
}
```

### WR-03: No validation of individual todo item shape after parsing

**File:** `lib/storage.js:36-39`, `bin/todo.js:30`
**Issue:** `readTodos()` only validates that the top-level parsed JSON is an array (line 36-39); it never validates that each element has the expected `{ text: string, done: boolean }` shape. `handleList()` then filters with the strict check `t.done === false` (`bin/todo.js:30`). Any item missing a `done` key (e.g., hand-edited file, future schema change, partially-written record) has `done === undefined`, which fails the `=== false` check and is silently treated as "not pending" — it disappears from `list` and from the `done <n>` positional numbering with no warning to the user that data was skipped. This is silent, hard-to-diagnose data loss from the user's perspective (the item is still in the file, but effectively invisible and unreachable via the CLI).
**Fix:** Validate/normalize each item on read, e.g.:
```javascript
return parsed.map((item, i) => {
  if (typeof item !== 'object' || item === null || typeof item.text !== 'string') {
    console.error(`Error: ${todosPath} contains an invalid todo entry at index ${i}.`);
    process.exit(1);
  }
  return { text: item.text, done: item.done === true };
});
```

## Info

### IN-01: `done <n>` silently ignores extra arguments

**File:** `bin/todo.js:42-43`
**Issue:** `handleDone` reads only `rest[0]`. Running `todo done 1 2` (a likely typo for wanting to mark two items done) silently marks only item 1 and drops the `2` with no feedback, which can mask user error.
**Fix:** Reject extra arguments explicitly:
```javascript
function handleDone(rest) {
  if (rest.length > 1) {
    console.error('Error: done takes exactly one position number, e.g. todo done 1');
    process.exit(1);
  }
  const n = Number(rest[0]);
  ...
```

### IN-02: `lib/storage.js` corrupt-JSON and non-array-JSON branches are untested

**File:** `lib/storage.js:28-34`, `lib/storage.js:36-39`
**Issue:** The catch block that reports "corrupt or not valid JSON" (lines 31-34) and the "does not contain a JSON array" branch (lines 36-39) have no corresponding test in `test/add.test.js`, `test/list.test.js`, or `test/done.test.js`. These are the two most likely real-world failure modes for a hand-edited local JSON file, and neither is currently exercised by the suite.
**Fix:** Add coverage, e.g. a `test/storage.test.js` that seeds a `todos.json` with `"not json"` and with `{"not":"an array"}` and asserts `todo list` exits non-zero with the expected message.

### IN-03: `package.json` has no `engines` field

**File:** `package.json:1-9`
**Issue:** The codebase relies on `node:fs`/`node:path`/`node:test` (the `node:` prefix requires Node ≥14.18/16, and the built-in test runner is only stable from Node 20). Without an `engines` field, users on older Node versions get no upfront signal and instead hit confusing runtime failures.
**Fix:**
```json
"engines": {
  "node": ">=18"
}
```

---

_Reviewed: 2026-07-07T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
