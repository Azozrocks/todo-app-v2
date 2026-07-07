# Phase 1: Core Todo Management - Pattern Map

**Mapped:** 2026-07-07
**Files analyzed:** 4 (estimated, see below)
**Analogs found:** 0 / 4

## Greenfield Notice

This repository contains **no source code**. A filesystem scan of the project root confirmed only `.git`, `.claude`, `.planning`, and a stray `.DS_Store` file exist — no `src/`, no `package.json`, no prior CLI, no reusable modules. There is nothing to reverse-engineer patterns from.

Consequently, **every file in this phase is a "No Analog Found" file.** This PATTERNS.md exists to give the planner a concrete file classification and a set of conventions to establish as the *first* precedent, rather than to point at existing code. All conventions below are proposed defaults based on standard Node.js CLI conventions (per CONTEXT.md's "Claude's Discretion" section), not extracted from the codebase.

## File Classification

Based on CONTEXT.md decisions (D-01 through D-04) and the `add` / `list` / `done` command set, the following files are anticipated for this phase. Exact filenames are the planner's/implementer's call — this is a role/data-flow breakdown, not a mandated file tree.

| New File (anticipated) | Role | Data Flow | Closest Analog | Match Quality |
|-------------------------|------|-----------|-----------------|---------------|
| CLI entry point (e.g. `bin/todo.js` or `index.js`) | controller (CLI dispatch) | request-response (argv in, stdout/exit code out) | none | no analog |
| Command handlers (e.g. `commands/add.js`, `commands/list.js`, `commands/done.js`) — may be inline in entry point given minimal scope | controller | CRUD (mutate/read todos.json) | none | no analog |
| Storage/persistence module (e.g. `lib/storage.js`) | service / model | file-I/O | none | no analog | 
| `package.json` | config | — (npm manifest) | none | no analog |
| Test file(s) (if tests are in scope for this phase — confirm against REQUIREMENTS.md) | test | CRUD (exercises storage + commands) | none | no analog |

**Data model note (from CONTEXT.md discretion):** `todos.json` item schema is left to implementer judgment — minimal shape, at least `text` (string) and a `done` flag (boolean), structured to remain compatible with the deferred `--all` flag and v2 delete/clear features. Recommend an array of `{ text: string, done: boolean }` objects, with position (1-based index into the pending-items view) used as the `done <n>` reference per D-02.

## Pattern Assignments

No pattern assignments possible — no analog files exist to extract imports, auth, core-pattern, error-handling, or validation excerpts from.

## Shared Patterns

None extracted (no codebase to mine). The following are **proposed conventions**, derived directly from CONTEXT.md decisions and standard Node.js CLI practice, for the planner to treat as the seed patterns for this phase and beyond:

### CLI Dispatch
- Use `process.argv.slice(2)` to get command + args; no external arg-parsing library (Node built-ins only, per project constraint).
- Unknown/missing command prints usage/help to stdout or stderr and exits non-zero (per CONTEXT.md discretion note).

### Storage (file-I/O)
- Use `fs` (sync or promises API — implementer's call, but be consistent) + `path` to resolve `todos.json` in `process.cwd()`.
- Missing `todos.json` should be treated as "no todos yet" (auto-initialize), not an error.
- Corrupt/unparseable `todos.json` should fail gracefully with a clear stderr message and non-zero exit code (per CONTEXT.md discretion note).

### Output Formatting (per CONTEXT.md D-01 through D-04)
- `add`: plain confirmation, no index echoed (D-01).
- `list`: numbered plain lines for pending items only, `1. buy milk` format, number = position for `done <n>` (D-02).
- `list` with zero pending items: friendly message, not empty output (D-03).
- `done <n>`: plain confirmation, no item text echoed (D-04).
- Invalid input (out-of-range/non-numeric index, empty add text): clear stderr message + non-zero exit code.

### Error Handling
- No established project convention exists yet. Recommend: validation errors and I/O errors both surface via `console.error(...)` + `process.exit(1)`, keeping success paths on `console.log(...)` + implicit exit 0. This is the first precedent for the project — subsequent phases should follow whatever pattern this phase actually implements.

## No Analog Found

All anticipated files lack an analog, because none exist in the repository.

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| CLI entry point | controller | request-response | Greenfield repo — no prior CLI code |
| `add` command handler | controller | CRUD | Greenfield repo — no prior CLI code |
| `list` command handler | controller | CRUD | Greenfield repo — no prior CLI code |
| `done` command handler | controller | CRUD | Greenfield repo — no prior CLI code |
| Storage module | service | file-I/O | Greenfield repo — no prior persistence code |
| `package.json` | config | — | Greenfield repo — no manifest exists |

## Metadata

**Analog search scope:** entire repository root (`/Users/zezn/Projects/todo-app-v2`), excluding `.git`, `.planning`, `.claude`
**Files scanned:** 1 (`.DS_Store`, not source code — excluded from analysis)
**Pattern extraction date:** 2026-07-07
**Recommendation for planner:** Since no analogs exist, treat this phase's own implementation as the pattern-setting precedent for Phase 2 and beyond. Keep the CLI entry point, command handlers, and storage module structurally simple and consistent (e.g., one clear module boundary between "CLI/argv parsing" and "todos.json read/write") so future phases have something concrete to copy from.
