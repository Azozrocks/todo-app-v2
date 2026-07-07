# Phase 1: Core Todo Management - Context

**Gathered:** 2026-07-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Users RUN commands (`add`, `list`, `done`) that operate on todo items ORGANIZED in a per-directory `todos.json` file. This phase delivers the core add/list/done loop with per-cwd persistence — invoked via `node` directly (global CLI install is Phase 2). No delete, clear, edit, or `--all` flag; those are explicitly out of scope (see PROJECT.md).

</domain>

<decisions>
## Implementation Decisions

### Output Format
- **D-01:** `todo add "<text>"` prints a plain confirmation on success (e.g. "Added." or similar minimal text) — no index echoed back.
- **D-02:** `todo list` displays pending items as simple numbered plain lines: `1. buy milk`, `2. call mom`. The number is the position used for `done <n>`.
- **D-03:** `todo list` with zero pending items prints a friendly message (e.g. "No pending todos." / "Nothing to do — you're all caught up!") rather than empty output.
- **D-04:** `todo done <n>` prints a plain confirmation on success (e.g. "Done.") — no item text echoed back.

### Claude's Discretion
- Exact wording/punctuation of the plain confirmation messages for `add` and `done` (user chose "Plain confirmation" but didn't specify exact copy).
- Error message wording and exact behavior for invalid input (out-of-range index, non-numeric index, empty add text, missing/corrupt `todos.json`) — not discussed, left to implementation judgment. Should fail gracefully with a clear stderr message and non-zero exit code, consistent with CLI conventions.
- Exact `todos.json` item schema (field names beyond `text` and a done flag) — not discussed; keep minimal per PROJECT.md "keep v1 minimal" guidance, but leave room for the deferred `--all` flag and v2 delete/clear features to work against the same shape.
- CLI argument parsing / dispatch structure and behavior for unknown or missing commands — not discussed, standard Node.js CLI conventions apply (print usage/help on missing or unrecognized command).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project scope and requirements
- `.planning/PROJECT.md` — core value, requirements, constraints (Node built-ins only, per-cwd storage), and key decisions (positional index reference, soft-delete via done flag, global npm bin for Phase 2)
- `.planning/REQUIREMENTS.md` — CORE-01/02/03, STOR-01/02/03 requirement definitions and traceability to this phase
- `.planning/ROADMAP.md` — Phase 1 goal and success criteria

No other external specs/ADRs exist in this project — requirements fully captured in PROJECT.md/REQUIREMENTS.md and the decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

Greenfield project — no source code exists yet (repo contains only `.git`, `.claude`, `.planning`). No reusable assets, established patterns, or integration points to note.

</code_context>

<specifics>
## Specific Ideas

No specific UI/output mockups beyond the decisions above (plain numbered list, plain confirmations, friendly empty-state message).

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. (Reminder: `todo delete`, `todo clear`, item editing, due dates/priorities/tags, and `todo list --all` remain out of scope for v1 per PROJECT.md.)

</deferred>

---

*Phase: 1-Core Todo Management*
*Context gathered: 2026-07-07*
