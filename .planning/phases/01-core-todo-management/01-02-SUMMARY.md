---
phase: 01-core-todo-management
plan: 02
subsystem: cli
tags: [node, cli, node-test, fs, json-storage]

# Dependency graph
requires:
  - phase: 01-core-todo-management (plan 01)
    provides: "lib/storage.js (readTodos/writeTodos), bin/todo.js dispatch skeleton + add, todos.json shape { text, done }"
provides:
  - "bin/todo.js: list command (pending-only, numbered from 1, friendly empty-state)"
  - "bin/todo.js: done <n> command (soft-delete by 1-based positional index over the pending view)"
  - "test/list.test.js: pending-only + hides-done + empty-state coverage"
  - "test/done.test.js: soft-delete/retention + positional mapping + invalid-index coverage"
affects: [phase-02-cli-distribution]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CommonJS modules, Node built-ins only (fs, path, process, child_process, os) — unchanged from 01-01"
    - "node --test + node:assert/strict for end-to-end CLI tests (spawn real child process)"
    - "Positional-index commands (done <n>) map over the filtered pending view, not the raw todos array index, so done items never shift the mapping"
    - "Soft-delete: done handler mutates the referenced array element (target.done = true) rather than splicing — item is retained, not removed"

key-files:
  created: [test/list.test.js, test/done.test.js]
  modified: [bin/todo.js]

key-decisions:
  - "Empty/all-done friendly message wording: \"No pending todos. You're all caught up!\" (D-03 discretion, exact copy left to implementer)"
  - "done handler validates via Number.isInteger(n) && n >= 1 before touching the file; out-of-range checked separately against pending.length so the file is never written on invalid input"

patterns-established:
  - "Pattern 3: positional-index command handlers filter todos to the same view they operate against (pending = todos.filter(t => t.done === false)) so list numbering and done targeting stay consistent"

requirements-completed: [CORE-02, CORE-03, STOR-02, STOR-03]

coverage:
  - id: D1
    description: "`todo list` shows only pending (done===false) items, numbered from 1 in array order"
    requirement: "CORE-02"
    verification:
      - kind: e2e
        ref: "test/list.test.js#list: prints only pending items, numbered from 1 in array order"
        status: pass
      - kind: e2e
        ref: "test/list.test.js#list: hides done items and renumbers pending-only from 1"
        status: pass
    human_judgment: false
  - id: D2
    description: "`todo list` with zero pending items (empty or all-done) prints a friendly non-empty message and exits 0"
    requirement: "STOR-03"
    verification:
      - kind: e2e
        ref: "test/list.test.js#list: empty/all-done todos.json prints a friendly non-empty message and exits 0"
        status: pass
      - kind: e2e
        ref: "test/list.test.js#list: all items done also prints a friendly non-empty message"
        status: pass
    human_judgment: false
  - id: D3
    description: "`todo done <n>` marks the nth pending item done, retaining it in todos.json (soft-delete, done:true) rather than removing it"
    requirement: "STOR-02"
    verification:
      - kind: e2e
        ref: "test/done.test.js#done: marks the nth pending item done, retains it in todos.json (soft-delete)"
        status: pass
      - kind: e2e
        ref: "test/done.test.js#done: completed item no longer appears in a subsequent list"
        status: pass
    human_judgment: false
  - id: D4
    description: "done <n> maps the 1-based positional index over the pending (done===false) view, not the raw array index, so a leading done item doesn't shift the target"
    requirement: "CORE-03"
    verification:
      - kind: e2e
        ref: "test/done.test.js#done: maps positional index over the pending view, not raw array index"
        status: pass
    human_judgment: false
  - id: D5
    description: "Invalid done index (0, out-of-range, non-numeric, or missing) fails with non-zero exit and leaves todos.json byte-for-byte unchanged"
    verification:
      - kind: e2e
        ref: "test/done.test.js#done: invalid index [\"done\",\"0\"]/[\"done\",\"99\"]/[\"done\",\"abc\"]/[\"done\"] exits non-zero and leaves todos.json unchanged"
        status: pass
    human_judgment: false

duration: 2min
completed: 2026-07-07
status: complete
---

# Phase 01 Plan 02: List and Done Commands Summary

**Added `list` (pending-only, numbered, friendly empty-state) and `done <n>` (soft-delete by pending-view positional index) to bin/todo.js, completing the core add/list/done loop with 12/12 tests green.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-07-07T20:15:45Z
- **Completed:** 2026-07-07T20:17:19Z
- **Tasks:** 2 completed
- **Files modified:** 3 (bin/todo.js, test/list.test.js, test/done.test.js)

## Accomplishments
- Implemented `list`: filters `todos` to `done === false`, prints `N. <text>` numbered from 1 in array order; zero pending items prints a friendly non-empty message and exits 0 (D-02, D-03, CORE-02, STOR-03)
- Implemented `done <n>`: validates the index is a positive integer within the pending count, maps the 1-based position over the same pending view `list` prints, sets `done = true` on the underlying array element (soft-delete — retained, not spliced), and writes back (D-04, CORE-03, STOR-02)
- Verified the positional mapping is over the pending view (not raw array index) with a leading-done-item test case, so a completed item never shifts `done <n>`'s target
- Verified invalid input (`done 0`, `done 99`, `done abc`, bare `done`) exits 1 with a stderr message and leaves `todos.json` completely unchanged
- Manual end-to-end smoke matched the plan's verification section exactly: `add a`, `add b`, `list` -> `1. a`/`2. b`, `done 1` -> `Done.`, `list` -> `1. b`, `todos.json` retains `a` with `done:true`; `done 5` on 1 remaining pending item -> exit 1, stderr message, file unchanged

## Task Commits

Each task followed the TDD RED -> GREEN cycle with atomic commits:

1. **Task 1: Implement the list command (view pending, numbered)**
   - `4369516` (test) - RED: failing test/list.test.js (4 cases)
   - `4740117` (feat) - GREEN: list handler implementation
2. **Task 2: Implement the done command (soft-delete by positional index)**
   - `dc718cd` (test) - RED: failing test/done.test.js (7 cases)
   - `c187511` (feat) - GREEN: done handler implementation

**Plan metadata:** _(final docs commit follows this summary)_

_Note: No REFACTOR commits were needed — both GREEN implementations required no cleanup._

## Files Created/Modified
- `bin/todo.js` - added `handleList()` and `handleDone(rest)`, both wired into the existing argv dispatch switch alongside `add`
- `test/list.test.js` - e2e tests (spawns the CLI via `execFileSync`): pending-only numbered output, done-item hiding/renumbering, empty and all-done friendly-message states
- `test/done.test.js` - e2e tests: soft-delete + retention, list round-trip after done, pending-view positional mapping with a leading done item, and 4 invalid-index cases (0, out-of-range, non-numeric, missing) all leaving `todos.json` byte-for-byte unchanged

## Decisions Made
- Friendly empty-state message wording: `"No pending todos. You're all caught up!"` — D-03 explicitly left exact copy to implementer discretion; chosen text is non-empty, human-readable, and distinct from the numbered-list format so tests can assert on it unambiguously
- `done` validates `Number.isInteger(n) && n >= 1` before reading/filtering todos, and checks `n > pending.length` only after computing the pending view — both invalid paths exit before any `writeTodos` call, guaranteeing the file is untouched on failure

## Deviations from Plan

None - plan executed exactly as written. Both tasks followed the plan's TDD action steps precisely: test file structure, handler logic (filter -> map/validate -> mutate reference -> write), and error-handling behavior all match the plan's `<action>` and `<behavior>` blocks without modification.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Full Phase 1 CLI surface is complete: `add <text>`, `list`, `done <n>` all implemented and tested (12/12 `node --test` passing across add/list/done suites)
- All 5 Phase 1 ROADMAP success criteria are satisfied: add persists items, list shows pending numbered with friendly empty-state, done soft-deletes by positional index, completed items retained in `todos.json`, per-cwd storage confirmed in 01-01
- Ready for Phase 2 (CLI distribution — global npm `bin` install via `npm link`/`npm i -g .`); no blockers or concerns from this plan
- `.planning/config.json` was touched by tooling during this run (added `_auto_chain_active: false` under `workflow`) — unrelated to this plan's scope, left uncommitted/out of scope per the deviation rules' scope boundary

---
*Phase: 01-core-todo-management*
*Completed: 2026-07-07*

## Self-Check: PASSED

All created/modified files verified present on disk (bin/todo.js, test/list.test.js, test/done.test.js, this SUMMARY.md). All task commits verified in git log (4369516, 4740117, dc718cd, c187511).
