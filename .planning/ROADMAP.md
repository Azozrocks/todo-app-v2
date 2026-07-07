# Roadmap: todo-app-v2

## Overview

A zero-dependency Node.js CLI for managing personal to-do items. The build ships in two natural slices: first the core todo management loop (add, list, done, with per-directory persistence), verifiable by running the tool directly with `node`; then the distribution slice that turns it into a real global `todo` command installable via `npm i -g .` or `npm link`, with no external dependencies to install. Together these two phases deliver the full core value: add, view, and complete todos from the command line with zero setup friction.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Core Todo Management** - Add, list, and complete todos with persistent per-directory storage (completed 2026-07-07)
- [ ] **Phase 2: Global CLI Distribution** - Install and run the tool as a dependency-free global `todo` command

## Phase Details

### Phase 1: Core Todo Management

**Goal**: Users can add, view, and complete to-do items, with data persisted independently per working directory
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: CORE-01, CORE-02, CORE-03, STOR-01, STOR-02, STOR-03
**Success Criteria** (what must be TRUE):

  1. User can add a new todo item via `add "<text>"` and it is saved to `todos.json` in the current working directory
  2. User can list pending todo items via `list`, numbered by their position in the pending list
  3. User can mark an item done via `done <n>`, using the position number shown by the most recent `list`, and it no longer appears in the pending list
  4. Completed items remain stored in `todos.json` (flagged done, not deleted) rather than being removed
  5. Running the tool from different directories produces independent todo lists, since each directory has its own `todos.json`

**Plans**: 2/2 plans complete
**Wave 1**

- [x] 01-01-PLAN.md — Walking Skeleton: scaffold + storage module + `add` slice (end-to-end)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02-PLAN.md — `list` + `done` slices (view pending, complete via positional soft-delete)

### Phase 2: Global CLI Distribution

**Goal**: Users can install the tool as a global `todo` command and run it from anywhere with zero external dependencies to install
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: DIST-01, DIST-02
**Success Criteria** (what must be TRUE):

  1. Running `npm link` or `npm i -g .` installs a global `todo` shell command (via the package's `bin` field and shebang script)
  2. User can run `todo add`, `todo list`, and `todo done` from any directory without prefixing `node` or a file path
  3. Installing the package pulls in no npm runtime dependencies — implementation relies solely on Node.js built-in modules

**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Core Todo Management | 2/2 | Complete   | 2026-07-07 |
| 2. Global CLI Distribution | 0/TBD | Not started | - |
