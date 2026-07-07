# Walking Skeleton — todo-app-v2

**Phase:** 1
**Generated:** 2026-07-07

## Capability Proven End-to-End

> One sentence: the smallest user-visible capability that exercises the full stack.

A command-line user can run `node bin/todo.js add "buy milk"` in any directory and have the item persisted to a `todos.json` file in that directory — proving argv dispatch → storage read → storage write → on-disk JSON round-trips through the real stack.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Runtime | Node.js (built-in modules only: `fs`, `path`, `process`, `os`, `child_process`) | Hard project constraint (CLAUDE.md, DIST-02) — no npm runtime deps |
| Module system | CommonJS (`require` / `module.exports`), no `"type": "module"` | Simplest for a small CLI; broad Node compatibility; no build step |
| Test runner | Node's built-in test runner (`node --test`, `node:test` + `node:assert/strict`) | Zero devDependencies; keeps the "no npm packages" constraint even for tests |
| Storage | Single `todos.json` per working directory, resolved via `path.join(process.cwd(), 'todos.json')` | Per-cwd persistence (STOR-01); independent lists per directory (Success Criteria #5) |
| Storage schema | JSON array of `{ text: string, done: boolean }` | Minimal per "keep v1 minimal"; `done` flag enables soft-delete (STOR-02) and stays compatible with deferred `--all` / delete / clear |
| Item reference | 1-based positional index into the pending (done===false) view, in array order | Per pre-phase decision + D-02; `done <n>` maps position → array element |
| Directory layout | `bin/todo.js` (entry/dispatch), `lib/storage.js` (file I/O), `test/*.test.js` | Clear boundary between CLI/argv parsing and persistence; sets precedent for Phase 2 |
| Entry invocation | `node bin/todo.js <cmd>` (with `#!/usr/bin/env node` shebang present) | Phase 1 runs via `node`; the `bin` field + global `todo` command is Phase 2 (DIST-01) |

## Stack Touched in Phase 1

- [x] Project scaffold — `package.json` (no deps), `node --test` test script
- [x] Routing — argv command dispatch in `bin/todo.js` (`add` / `list` / `done` / unknown→usage)
- [x] Storage — real read (`readTodos`) AND real write (`writeTodos`) against `todos.json`
- [x] "UI" — CLI interaction: stdout confirmations, numbered pending list, stderr errors + exit codes
- [x] Run — documented local full-stack run: `node bin/todo.js add "…"`, `node bin/todo.js list`, `node bin/todo.js done <n>`; `node --test` exercises all three end-to-end

## Out of Scope (Deferred to Later Slices)

> Anything that is *not* in the skeleton. Explicit to prevent future phases re-litigating Phase 1's minimalism.

- Global `todo` shell command / `bin` field registration / `npm link` / `npm i -g .` — **Phase 2 (DIST-01)**
- `todo delete <n>`, `todo clear`, `todo list --all` — **v2, deferred** (REQUIREMENTS.md CMD-01/02/03)
- Editing item text, due dates, priorities, tags/categories — **out of scope** (REQUIREMENTS.md)
- Multi-user, sync, cloud storage, global config file — **out of scope**
- Stable item IDs — not needed; reference is positional (pre-phase decision)

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering its architectural decisions:

- **Phase 2: Global CLI Distribution** — add the `bin` field mapping `todo` → `bin/todo.js` so `npm link` / `npm i -g .` install a global `todo` command runnable from any directory, still zero npm dependencies (DIST-01, DIST-02). No storage or command-logic changes.
