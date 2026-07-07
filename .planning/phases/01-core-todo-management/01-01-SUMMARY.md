---
phase: 01-core-todo-management
plan: 01
subsystem: cli
tags: [node, cli, node-test, fs, json-storage]

# Dependency graph
requires: []
provides:
  - "package.json manifest (zero dependencies, node --test script)"
  - "lib/storage.js: getTodosPath/readTodos/writeTodos against per-cwd todos.json"
  - "bin/todo.js: argv dispatch entry point with working add command"
  - "test/add.test.js: end-to-end add test via child_process"
  - "Storage schema: array of { text: string, done: boolean }"
affects: [01-02, phase-02-cli-distribution]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CommonJS modules, Node built-ins only (fs, path, process, child_process, os)"
    - "node --test + node:assert/strict for end-to-end CLI tests (spawn real child process)"
    - "Storage module boundary: lib/storage.js owns all todos.json read/write; bin/todo.js owns argv dispatch only"
    - "Error convention: validation/IO errors -> console.error + process.exit(1); success -> console.log + implicit exit 0"

key-files:
  created: [package.json, lib/storage.js, bin/todo.js, test/add.test.js, .gitignore]
  modified: []

key-decisions:
  - "readTodos() exits process on corrupt/non-array todos.json rather than throwing, per CONTEXT.md discretion note on graceful CLI failure"
  - "Added .gitignore for todos.json and node_modules/ (Rule 2 - prevents runtime data file from being accidentally committed if the CLI is ever run from the repo root)"

patterns-established:
  - "Pattern 1: CLI dispatch via process.argv.slice(2) switch statement in bin/todo.js, one case per command"
  - "Pattern 2: All todos.json I/O centralized in lib/storage.js; command handlers never touch fs directly"

requirements-completed: [CORE-01, STOR-01]

coverage:
  - id: D1
    description: "`node bin/todo.js add \"buy milk\"` creates/updates ./todos.json with the new item, done:false"
    requirement: "CORE-01"
    verification:
      - kind: e2e
        ref: "test/add.test.js#add: writes a new todo item to todos.json in the current directory"
        status: pass
    human_judgment: false
  - id: D2
    description: "todos.json is resolved per-cwd (path.join(process.cwd(), 'todos.json')), so two different directories get independent files"
    requirement: "STOR-01"
    verification:
      - kind: manual_procedural
        ref: "Manual check: ran add in two separate temp dirs, confirmed each todos.json contained only its own item"
        status: pass
    human_judgment: false
  - id: D3
    description: "add with empty/whitespace text fails with exit 1 and a stderr message, writes nothing"
    verification:
      - kind: manual_procedural
        ref: "Manual check: `node bin/todo.js add \"\"` exits 1, prints to stderr, no todos.json write"
        status: pass
    human_judgment: false
  - id: D4
    description: "Corrupt/non-JSON todos.json fails gracefully (stderr message + exit 1), no crash/stack dump as primary output"
    verification:
      - kind: manual_procedural
        ref: "Manual check: wrote '{not json' to todos.json, ran add, got clean stderr message + exit 1"
        status: pass
    human_judgment: false

duration: 1min
completed: 2026-07-07
status: complete
---

# Phase 01 Plan 01: Walking Skeleton (add command) Summary

**Node CLI walking skeleton — CommonJS `bin/todo.js` argv dispatch wired to `lib/storage.js` file I/O, proving a full add -> read -> write -> todos.json round-trip with zero npm dependencies.**

## Performance

- **Duration:** 1 min
- **Started:** 2026-07-07T20:11:38Z
- **Completed:** 2026-07-07T20:12:47Z
- **Tasks:** 2 completed
- **Files modified:** 5 (package.json, lib/storage.js, bin/todo.js, test/add.test.js, .gitignore)

## Accomplishments
- Established the project scaffold: `package.json` with zero dependencies and `node --test` as the test script
- Built `lib/storage.js`, the single module owning all `todos.json` read/write, with per-cwd path resolution and corrupt-file handling
- Built `bin/todo.js`, the CLI entry point with argv dispatch and a working `add` command (D-01: plain "Added." confirmation, no index echoed)
- Proved the full stack end-to-end with `test/add.test.js`, an e2e test that spawns the CLI as a real child process and asserts on the resulting `todos.json`

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold package.json and write the failing end-to-end add test (RED)** - `9e13c5b` (test)
2. **Task 2: Implement storage module and CLI entry with add (GREEN)** - `8287555` (feat)

**Plan metadata:** _(final docs commit follows this summary)_

_Note: This plan followed the TDD RED -> GREEN cycle as a single feature (Task 1 = RED, Task 2 = GREEN); no REFACTOR commit was needed since the GREEN implementation required no cleanup._

## Files Created/Modified
- `package.json` - npm manifest: name, version, private, description, `scripts.test = "node --test"`; no dependencies/devDependencies/bin/type fields
- `lib/storage.js` - `getTodosPath()`, `readTodos()`, `writeTodos()`; resolves `todos.json` in `process.cwd()`, treats missing file as `[]`, exits 1 on corrupt/non-array content
- `bin/todo.js` - CLI entry with `#!/usr/bin/env node` shebang; argv dispatch; `add` handler wired to storage; unknown/missing command prints usage to stderr and exits 1
- `test/add.test.js` - end-to-end test: spawns `bin/todo.js add "buy milk"` in a fresh temp dir via `execFileSync`, asserts stdout and the resulting `todos.json` contents
- `.gitignore` - excludes `todos.json` (runtime data) and `node_modules/` from version control

## Decisions Made
- `readTodos()` treats a corrupt or non-array `todos.json` as a hard failure (stderr message + `process.exit(1)`) rather than attempting recovery, matching CONTEXT.md's "fail gracefully with clear stderr message" discretion note
- Added `.gitignore` (not explicitly in the plan's file list) to prevent the runtime `todos.json` from being accidentally tracked — see Deviations below

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added .gitignore excluding todos.json and node_modules/**
- **Found during:** Task 2 (manual verification of add command)
- **Issue:** While manually verifying the add command against acceptance criteria, a `todos.json` was transiently created in the project root itself (an artifact of manual verification, not the automated test suite). Nothing in the plan prevented this runtime data file from being tracked by git if a developer ever runs the CLI from the repo root.
- **Fix:** Added `.gitignore` with `todos.json` and `node_modules/` entries. Removed the stray `todos.json` from the repo root before committing.
- **Files modified:** `.gitignore` (new)
- **Verification:** `git status --short` confirmed no `todos.json` is tracked or staged after the fix
- **Committed in:** `8287555` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical / hygiene)
**Impact on plan:** No scope creep — purely a safety net around the storage mechanism just implemented. Zero behavioral changes to `add`, `lib/storage.js`, or `bin/todo.js`.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Storage module and CLI dispatch pattern are established and proven end-to-end; plan 01-02 can add `list` and `done` handlers to `bin/todo.js` following the same convention (argv dispatch -> storage read -> storage write -> console output)
- `todos.json` schema (`{ text: string, done: boolean }`) is fixed and ready for `list` (filter on `done === false`) and `done <n>` (flip `done` to `true` by position)
- No blockers or concerns

---
*Phase: 01-core-todo-management*
*Completed: 2026-07-07*

## Self-Check: PASSED

All created files verified present on disk (package.json, lib/storage.js, bin/todo.js, test/add.test.js, .gitignore, this SUMMARY.md). All task commits verified in git log (9e13c5b, 8287555, c40946c).
