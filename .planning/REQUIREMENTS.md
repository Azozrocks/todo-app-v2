# Requirements: todo-app-v2

**Defined:** 2026-07-07
**Core Value:** A user can add, view, and complete to-do items from the command line with zero setup friction

## v1 Requirements

### Core Commands

- [ ] **CORE-01**: User can add a new todo item via `todo add "<text>"`
- [ ] **CORE-02**: User can list pending todo items via `todo list`, numbered by their position in the pending list
- [ ] **CORE-03**: User can mark an item done via `todo done <n>`, where `<n>` is the position number shown by the most recent `todo list`

### Storage

- [ ] **STOR-01**: Todo items persist to a `todos.json` file in the current working directory
- [ ] **STOR-02**: Completed items are retained in `todos.json` (flagged done) rather than deleted
- [ ] **STOR-03**: `todo list` shows only pending items by default (done items hidden)

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
| CORE-01 | TBD | Pending |
| CORE-02 | TBD | Pending |
| CORE-03 | TBD | Pending |
| STOR-01 | TBD | Pending |
| STOR-02 | TBD | Pending |
| STOR-03 | TBD | Pending |
| DIST-01 | TBD | Pending |
| DIST-02 | TBD | Pending |

**Coverage:**
- v1 requirements: 8 total
- Mapped to phases: 0 (pending roadmap creation)
- Unmapped: 8 ⚠️

---
*Requirements defined: 2026-07-07*
*Last updated: 2026-07-07 after initial definition*
