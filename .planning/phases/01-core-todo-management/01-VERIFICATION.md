---
phase: 01-core-todo-management
verified: 2026-07-07T20:25:45Z
status: passed
score: 9/9 must-haves verified
behavior_unverified: 0
overrides_applied: 0
mvp_mode_note: "ROADMAP.md Phase 1 Goal field is not in User-Story format despite Mode: mvp; PLAN 01-01/01-02 both carry a correctly formatted User Story ('As a command-line user, I want to add, view, and complete to-do items that persist per working directory, so that I can track tasks from any folder with zero setup.') that matches the ROADMAP goal in substance. Verified `gsd_run query user-story.validate` against both strings: ROADMAP goal -> false, PLAN goal -> true. Used the PLAN's story for User Flow Coverage rather than refusing verification outright, since the story text is unambiguous and specific to this phase. Recommend running /gsd mvp-phase 1 to sync ROADMAP.md's Goal field for consistency (non-blocking)."
---

# Phase 1: Core Todo Management Verification Report

**Phase Goal:** Users can add, view, and complete to-do items, with data persisted independently per working directory
**User Story (from PLAN.md, mode: mvp):** As a command-line user, I want to add, view, and complete to-do items that persist per working directory, so that I can track tasks from any folder with zero setup.
**Verified:** 2026-07-07T20:25:45Z
**Status:** passed
**Re-verification:** No — initial verification

## User Flow Coverage

| Step | Expected | Evidence | Status |
|------|----------|----------|--------|
| Add a todo | `node bin/todo.js add "buy milk"` prints "Added." and persists `{text:"buy milk", done:false}` to `./todos.json` | `bin/todo.js` `handleAdd` (lines 12-21); `test/add.test.js` (passes); manual run confirmed `Added.` + file contents | ✓ |
| View pending todos | `node bin/todo.js list` prints numbered pending items (`1. buy milk`) | `bin/todo.js` `handleList` (lines 23-32); `test/list.test.js` (4/4 pass) | ✓ |
| Complete a todo | `node bin/todo.js done 1` prints "Done.", item disappears from `list` but stays in `todos.json` with `done:true` | `bin/todo.js` `handleDone` (lines 34-52); `test/done.test.js` (7/7 pass, includes leading-done-item positional mapping test) | ✓ |
| Track tasks from any folder, zero setup (outcome) | Two independent working directories each get their own `todos.json`; no config file or install step required to run the commands (via `node`) | `lib/storage.js` `getTodosPath()` = `path.join(process.cwd(), 'todos.json')`; manual smoke: two temp dirs each retained only their own item | ✓ |

All four user-flow steps confirmed directly (automated tests + a live manual run of `add`/`list`/`done` across two temp directories), not merely inferred from SUMMARY.md claims.

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `add "<text>"` saves item to `todos.json` in cwd (SC1, CORE-01) | ✓ VERIFIED | `test/add.test.js` passes; manual run: `Added.` + `todos.json` = `[{"text":"buy milk","done":false}]` |
| 2 | Newly added item stored with `done === false` | ✓ VERIFIED | Same evidence as #1; `handleAdd` pushes `{ text, done: false }` |
| 3 | `list` shows only pending items, numbered from 1 (SC2, CORE-02, STOR-03) | ✓ VERIFIED | `test/list.test.js` — 2 tests cover pending-only + hides-done-and-renumbers; both pass |
| 4 | `list` with zero pending items prints a friendly non-empty message, exit 0 (D-03) | ✓ VERIFIED | `test/list.test.js` — 2 tests (empty array, all-done) both pass; message = "No pending todos. You're all caught up!" |
| 5 | `done <n>` marks nth pending item done, item no longer appears in `list` (SC3, CORE-03) | ✓ VERIFIED | `test/done.test.js` — soft-delete test + subsequent-list test both pass |
| 6 | Completed item remains in `todos.json` flagged `done:true`, not deleted (SC4, STOR-02) | ✓ VERIFIED | `test/done.test.js` asserts array length unchanged, `done:true` on the target element |
| 7 | `done <n>` maps 1-based index over the **pending view**, not raw array index (a leading done item doesn't shift the target) | ✓ VERIFIED | `test/done.test.js` "maps positional index over the pending view" — seeds a leading `done:true` item, confirms `done 1` targets the first pending item |
| 8 | `done` with non-numeric/out-of-range/missing index fails non-zero + stderr, file unchanged (D-04 discretion) | ✓ VERIFIED | `test/done.test.js` parametrized over `["0"], ["99"], ["abc"], []` — all 4 assert non-zero exit and byte-for-byte unchanged `todos.json` |
| 9 | Running the tool from two different directories produces independent `todos.json` files (SC5, STOR-01) | ✓ VERIFIED | `getTodosPath()` = `path.join(process.cwd(), 'todos.json')` (no shared/global state); manual smoke in two separate `mktemp -d` dirs — dir A got only "task in A", dir B got only "task in B" |

Additional plan-level truth confirmed manually (not a numbered ROADMAP SC but part of PLAN 01-01 must_haves):
- `add` with empty/whitespace-only text fails with exit 1 + stderr, writes nothing — confirmed via manual run (`add ""` and `add "   "` both exit 1 with `Error: add requires non-empty text...`, no `todos.json` write attempted).
- Corrupt `todos.json` (`{not json`) → `add` exits 1 with a clear stderr message, not a raw stack trace — confirmed via manual run.

**Score:** 9/9 truths verified (0 present-but-behavior-unverified)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `package.json` | No `dependencies`/`devDependencies`/`bin`/`type` keys; `scripts.test` = `"node --test"` | ✓ VERIFIED | Confirmed by direct read — exactly `name`, `version`, `private`, `description`, `scripts.test`. `bin` correctly absent (Phase 2 scope per CONTEXT.md) |
| `lib/storage.js` | Exports `getTodosPath`, `readTodos`, `writeTodos` | ✓ VERIFIED | All three exported via `module.exports`; `readTodos` handles missing file (`[]`), corrupt JSON (exit 1), non-array (exit 1) |
| `bin/todo.js` | `#!/usr/bin/env node` shebang, argv dispatch (`add`/`list`/`done`, default usage+exit 1) | ✓ VERIFIED | Shebang on line 1; `switch(cmd)` dispatch with all three commands + default `printUsage()` + `process.exit(1)` |
| `test/add.test.js` | E2E test for `add` happy path | ✓ VERIFIED | Spawns real child process via `execFileSync`, asserts stdout + `todos.json` contents; passes |
| `test/list.test.js` | Pending-only + empty-state coverage | ✓ VERIFIED | 4 tests: numbered order, hides-done, empty message, all-done message; all pass |
| `test/done.test.js` | Soft-delete + retention + invalid-index coverage | ✓ VERIFIED | 7 tests: soft-delete, list-after-done, pending-view mapping, 4x invalid-index cases; all pass |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `getTodosPath()` | filesystem path | `path.join(process.cwd(), 'todos.json')` | ✓ WIRED | Verified in source and by two-directory manual smoke test — no hardcoded path, no shared global state |
| `handleAdd` | `readTodos()` -> push -> `writeTodos()` | argv text -> array push `{text, done:false}` -> file write | ✓ WIRED | Traced in `bin/todo.js` lines 12-21; confirmed by passing `add` test and manual run |
| `handleList` | `readTodos()` -> filter -> `console.log` | `todos.filter(t => t.done === false)` then numbered print | ✓ WIRED | Traced in `bin/todo.js` lines 23-32; confirmed by 4 passing `list` tests |
| `handleDone` | `readTodos()` -> filter -> mutate reference -> `writeTodos()` | `pending[n-1].done = true` (reference into original array, not a copy) | ✓ WIRED | Traced in `bin/todo.js` lines 34-52; confirmed by "retains item, length unchanged" test and "leading done item" positional-mapping test |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|---------------------|--------|
| `handleList` output | `pending` (filtered from `readTodos()`) | Real `fs.readFileSync` + `JSON.parse` against the cwd's actual `todos.json`, not a static/mocked value | Yes — seeded test files with distinct content produce distinct, matching output | ✓ FLOWING |
| `handleAdd` write | `todos` array (read, pushed, written) | Real `fs.writeFileSync` round-trip; verified content matches input across two independent temp dirs | Yes | ✓ FLOWING |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| CORE-01 | 01-01 | Add a todo via `todo add "<text>"` | ✓ SATISFIED | `test/add.test.js` passes; manual run confirms persisted item |
| CORE-02 | 01-02 | List pending todos, numbered by position | ✓ SATISFIED | `test/list.test.js` passes |
| CORE-03 | 01-02 | Mark item done via `todo done <n>` (position from most recent `list`) | ✓ SATISFIED | `test/done.test.js` passes, including pending-view positional mapping |
| STOR-01 | 01-01 | Todos persist to `todos.json` in cwd | ✓ SATISFIED | `getTodosPath()` = per-cwd path; two-directory manual smoke confirms independence |
| STOR-02 | 01-02 | Completed items retained (flagged), not deleted | ✓ SATISFIED | `test/done.test.js` asserts array length unchanged post-`done` |
| STOR-03 | 01-02 | `list` shows only pending items by default | ✓ SATISFIED | `test/list.test.js` "hides done items" test |

No orphaned requirements: REQUIREMENTS.md maps exactly these 6 IDs to Phase 1 (all marked Complete), and both plans' `requirements:` frontmatter declare exactly this set — nothing declared in REQUIREMENTS.md for Phase 1 is missing from a plan, and nothing claimed by a plan is missing from REQUIREMENTS.md. `DIST-01`/`DIST-02` are correctly scoped to Phase 2 (not claimed here, and rightly absent from this phase's implementation — no `bin` field, no global install).

### Anti-Patterns Found

No `TBD`/`FIXME`/`XXX`/`TODO`/`HACK`/`PLACEHOLDER` markers in any phase-modified file (`bin/todo.js`, `lib/storage.js`, `test/*.js`, `package.json`) — grep returned zero matches, so the debt-marker gate does not fire.

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `lib/storage.js` | 44-46 | `writeTodos()` has no error handling (unlike `readTodos()`) — raw exception on write failure | ℹ️ Info (from 01-REVIEW.md WR-01) | Edge case (disk full/permission denied); does not affect the happy-path or tested must-haves for Phase 1 |
| `lib/storage.js` | 44-46 | Non-atomic write (no temp-file+rename) | ℹ️ Info (from 01-REVIEW.md WR-02) | Theoretical corruption risk on crash mid-write; not a Phase 1 must-have |
| `lib/storage.js` / `bin/todo.js` | 36-39 / 30 | No per-item shape validation after parsing `todos.json` — a hand-edited item missing `done` silently vanishes from `list`/`done` targeting | ℹ️ Info (from 01-REVIEW.md WR-03) | Not exercised by any Phase 1 must-have (all test fixtures use well-formed items); noted as pre-existing quality debt, not a phase-goal blocker |
| `package.json` | 1-9 | Missing `bin` field | ℹ️ Info (flagged CRITICAL in 01-REVIEW.md, but is explicitly Phase 2 scope) | CONTEXT.md's Phase Boundary explicitly states "invoked via `node` directly (global CLI install is Phase 2)" and PLAN 01-01 explicitly instructs "No `bin` field yet (that is Phase 2 / DIST-01)." Correctly out of scope for Phase 1 — **not a Phase 1 gap** |

None of these rise to a Phase-1 blocker: they are either explicitly out of Phase 1's scope (bin field / DIST-01) or edge-case robustness gaps that don't affect any declared must-have, ROADMAP success criterion, or requirement ID for this phase. They are documented in 01-REVIEW.md and remain valid follow-up items (recommend tracking WR-01/02/03 against Phase 2 or a hardening pass).

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Full suite passes | `node --test` | `# tests 12 / # pass 12 / # fail 0` | ✓ PASS |
| `add` persists item | `node bin/todo.js add "buy milk"` in temp dir | `Added.` + `todos.json` = `[{"text":"buy milk","done":false}]` | ✓ PASS |
| Two-directory independence | `add` in temp dir A, `add` in temp dir B | dir A `todos.json` contains only "task in A"; dir B contains only "task in B" | ✓ PASS |
| Empty-text validation | `add ""` and `add "   "` | Both exit 1, stderr message, no file mutation | ✓ PASS |
| Corrupt-file handling | seed `{not json`, then `add "x"` | Exit 1, clear stderr message (no raw stack trace as primary output) | ✓ PASS |

### Probe Execution

Step 7c: SKIPPED (no runnable probe scripts declared or found under `scripts/*/tests/probe-*.sh`; not referenced by any Phase 1 PLAN/SUMMARY — not applicable to this CLI phase).

### Human Verification Required

None. All observable truths were confirmed via passing automated tests plus direct manual execution of the CLI by the verifier (not inferred from SUMMARY.md narrative). No visual, real-time, or external-service behavior exists in this phase to require human judgment.

### Gaps Summary

No gaps. All 9 observable truths (covering all 5 ROADMAP Success Criteria plus 4 additional PLAN-level must-haves) are verified against the actual codebase: `package.json`, `lib/storage.js`, `bin/todo.js` all exist, are substantive (no stubs), and are wired end-to-end (argv → storage → filesystem → stdout). `node --test` passes 12/12. Manual smoke tests independently reproduced the two-directory persistence isolation and both validation-failure paths (empty add text, corrupt `todos.json`) that the automated suite does not directly cover for `add`. Requirements CORE-01/02/03 and STOR-01/02/03 are all satisfied with no orphans.

One process note (non-blocking): ROADMAP.md's Phase 1 `Goal:` field is not phrased as a User Story despite `Mode: mvp`, while both PLAN files under this phase correctly carry a User-Story-formatted "Phase Goal" that matches the ROADMAP goal's substance. Recommend running `/gsd mvp-phase 1` to sync ROADMAP.md for consistency in future phases/audits — this is a documentation-format issue only and does not affect the functional verdict.

The code-review-flagged CRITICAL issue (CR-01, missing `package.json` `bin` field) is **not** a Phase 1 gap — it is explicitly Phase 2 scope (DIST-01) per 01-CONTEXT.md's Phase Boundary and PLAN 01-01's own instructions. It should be tracked for Phase 2, not this phase.

---

_Verified: 2026-07-07T20:25:45Z_
_Verifier: Claude (gsd-verifier)_
