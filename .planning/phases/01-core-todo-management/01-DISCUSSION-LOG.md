# Phase 1: Core Todo Management - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-07
**Phase:** 1-Core Todo Management
**Areas discussed:** Output format

---

## Output Format

### Add confirmation

| Option | Description | Selected |
|--------|-------------|----------|
| Echo with index | Prints something like "Added: buy milk (#3)" — shows the item and its new position | |
| Plain confirmation | Prints a simple "Added." or "buy milk" with no index | ✓ |
| Silent | No output on success (Unix-tool style) | |

**User's choice:** Plain confirmation
**Notes:** None

### List display

| Option | Description | Selected |
|--------|-------------|----------|
| Numbered plain | "1. buy milk\n2. call mom" — simple numbered lines | ✓ |
| Numbered with brackets | "[1] buy milk\n[2] call mom" | |
| Checkbox style | "1. [ ] buy milk" | |

**User's choice:** Numbered plain
**Notes:** None

### Empty list message

| Option | Description | Selected |
|--------|-------------|----------|
| Friendly message | "No pending todos." or "Nothing to do — you're all caught up!" | ✓ |
| Nothing | No output at all | |

**User's choice:** Friendly message
**Notes:** None

### Done confirmation

| Option | Description | Selected |
|--------|-------------|----------|
| Echo the item | "Completed: call mom" — confirms which item was marked done | |
| Plain confirmation | "Done." — minimal, no item text repeated | ✓ |
| Silent | No output on success | |

**User's choice:** Plain confirmation
**Notes:** None

---

## Claude's Discretion

- Exact wording/punctuation of plain confirmation messages for `add` and `done`
- Error message wording and behavior for invalid input (out-of-range/non-numeric index, empty add text, missing/corrupt `todos.json`)
- Exact `todos.json` item schema beyond `text` and a done flag
- CLI argument parsing/dispatch structure and unknown/missing command behavior

## Deferred Ideas

None — discussion stayed within phase scope. Other gray areas (Error handling, Todo item data shape, CLI entry & argument parsing) were presented but not selected for discussion; left to Claude's discretion per above.
