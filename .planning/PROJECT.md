# todo-app-v2

## What This Is

A Node.js CLI tool for managing personal to-do items from the terminal: `todo add "buy milk"`, `todo list`, `todo done 1`. Items persist to a local `todos.json` file in the current working directory. Built entirely with Node.js built-in modules — no external dependencies.

## Core Value

A user can add, view, and complete to-do items from the command line with zero setup friction — no config, no dependencies to install, just `npm i -g .` and go.

## Requirements

### Validated

- [x] User can add a new todo item via `add "<text>"` — Validated in Phase 1: Core Todo Management (invoked as `node bin/todo.js add`; bare `todo` command arrives with the Phase 2 global install)
- [x] User can list pending todo items via `list`, numbered by their position in the pending list — Validated in Phase 1: Core Todo Management
- [x] User can mark an item done via `done <n>`, where `<n>` is the position number shown by the most recent `list` — Validated in Phase 1: Core Todo Management
- [x] Completed items are retained in `todos.json` (marked done, not deleted) but hidden from default `list` output — Validated in Phase 1: Core Todo Management
- [x] `todos.json` is read/written in the current working directory, so different project folders can have independent todo lists — Validated in Phase 1: Core Todo Management
- [x] Implementation uses only Node.js built-in modules — no npm dependencies — Validated in Phase 1: Core Todo Management (standing constraint, holds going forward)

### Active

- [ ] Tool installs as a global `todo` shell command via npm's `bin` field (shebang script), installable via `npm link` or `npm i -g .` — Phase 2: Global CLI Distribution (DIST-01/DIST-02)

### Out of Scope

- `todo delete <n>` — user explicitly deferred this; not needed for v1
- `todo clear` (bulk wipe) — same, deferred
- Editing existing item text — not requested, keep v1 minimal
- Due dates, priorities, categories/tags — not requested, keep v1 minimal
- Flag to show completed items in `todo list` (e.g. `--all`) — deferred; data model supports it later since done items aren't deleted
- Multi-user, sync, or cloud storage — local single-file storage only

## Context

Personal productivity CLI, greenfield build (no prior version despite the "v2" working title). Target user is a developer comfortable installing a global CLI tool via npm.

**Current state:** Phase 1 (Core Todo Management) complete — `add`/`list`/`done` work end-to-end via `node bin/todo.js`, backed by `lib/storage.js` and a per-cwd `todos.json`. 12/12 tests passing. Global `todo` command (npm `bin` field) is the sole remaining item, scoped to Phase 2.

## Constraints

- **Dependencies**: Node.js built-ins only (e.g. `fs`, `path`) — no npm packages — explicit user requirement
- **Storage**: Local JSON file (`todos.json`) in the current working directory — no database, no global config file

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| `todos.json` stored per-directory (cwd) rather than one global file in home dir | Lets users keep independent todo lists per project folder | Validated in Phase 1 |
| Item reference in commands is a positional index from `todo list`, not a stable ID | Simpler UX for a small personal tool; accepted tradeoff that numbers shift as pending items change | Validated in Phase 1 |
| Completed items are soft-deleted (flagged done) rather than removed from the file | Preserves history and leaves room for a future "show all" view | Validated in Phase 1 |
| Installed as a global npm bin rather than invoked via `node index.js` | Matches real CLI ergonomics (`todo add ...` instead of `node index.js add ...`) | Pending — Phase 2 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-07 after Phase 1: Core Todo Management*
