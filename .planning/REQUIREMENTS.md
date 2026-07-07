# Requirements: todo-app-v2

**Defined:** 2026-07-07
**Core Value:** A user can add, view, and complete to-do items from the command line with zero setup friction

## v1 Requirements

### Core Commands

- [x] **CORE-01**: User can add a new todo item via `todo add "<text>"`
- [x] **CORE-02**: User can list pending todo items via `todo list`, numbered by their position in the pending list
- [x] **CORE-03**: User can mark an item done via `todo done <n>`, where `<n>` is the position number shown by the most recent `todo list`

### Storage

- [x] **STOR-01**: Todo items persist to a `todos.json` file in the current working directory
- [x] **STOR-02**: Completed items are retained in `todos.json` (flagged done) rather than deleted
- [x] **STOR-03**: `todo list` shows only pending items by default (done items hidden)

### Distribution

- [ ] **DIST-01**: Tool installs as a global `todo` shell command via npm's `bin` field, installable via `npm link` or `npm i -g .`
- [ ] **DIST-02**: Implementation uses only Node.js built-in modules — no npm dependencies

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Extended Commands

- **CMD-01**: User can delete an item via `todo delete <n>` without marking it done
- **CMD-02**: User can clear all items via `todo clear`
- **CMD-03**: User can view completed items via `todo list --all`

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Editing existing item text | Not requested; keep v1 minimal |
| Due dates, priorities, categories/tags | Not requested; keep v1 minimal |
| Multi-user, sync, or cloud storage | Local single-file storage only, per project constraint |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01 | Phase 1 | Complete |
| CORE-02 | Phase 1 | Complete |
| CORE-03 | Phase 1 | Complete |
| STOR-01 | Phase 1 | Complete |
| STOR-02 | Phase 1 | Complete |
| STOR-03 | Phase 1 | Complete |
| DIST-01 | Phase 2 | Pending |
| DIST-02 | Phase 2 | Pending |

**Coverage:**

- v1 requirements: 8 total
- Mapped to phases: 8 (Phase 1: 6, Phase 2: 2)
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-07*
*Last updated: 2026-07-07 after roadmap creation*
