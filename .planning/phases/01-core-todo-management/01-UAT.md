---
status: testing
phase: 01-core-todo-management
source: [01-01-SUMMARY.md, 01-02-SUMMARY.md]
started: 2026-07-08T05:48:13Z
updated: 2026-07-08T05:48:13Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: -
name: Coverage confirmation (all deliverables auto-covered)
expected: |
  All 9 Phase 1 deliverables are covered by passing automated tests (e2e / manual-procedural, all recorded pass in SUMMARY.md). No items require human judgment.
awaiting: user response

## Tests

### 1. add creates/updates todos.json with new item (done:false)
expected: "`node bin/todo.js add \"buy milk\"` creates/updates ./todos.json with the new item, done:false"
result: pass
source: automated
coverage_id: 01-01/D1

### 2. Per-cwd storage isolation
expected: "todos.json is resolved per-cwd, so two different directories get independent files"
result: pass
source: automated
coverage_id: 01-01/D2

### 3. add rejects empty/whitespace text
expected: "add with empty/whitespace text fails with exit 1 and a stderr message, writes nothing"
result: pass
source: automated
coverage_id: 01-01/D3

### 4. add handles corrupt todos.json gracefully
expected: "Corrupt/non-JSON todos.json fails gracefully (stderr message + exit 1), no crash/stack dump"
result: pass
source: automated
coverage_id: 01-01/D4

### 5. list shows only pending items, numbered from 1
expected: "`todo list` shows only pending (done===false) items, numbered from 1 in array order"
result: pass
source: automated
coverage_id: 01-02/D1

### 6. list shows friendly empty-state
expected: "`todo list` with zero pending items (empty or all-done) prints a friendly non-empty message and exits 0"
result: pass
source: automated
coverage_id: 01-02/D2

### 7. done soft-deletes by position, retains item
expected: "`todo done <n>` marks the nth pending item done, retaining it in todos.json (soft-delete, done:true) rather than removing it"
result: pass
source: automated
coverage_id: 01-02/D3

### 8. done maps position over pending view, not raw array index
expected: "done <n> maps the 1-based positional index over the pending view, not the raw array index, so a leading done item doesn't shift the target"
result: pass
source: automated
coverage_id: 01-02/D4

### 9. done rejects invalid index, leaves file unchanged
expected: "Invalid done index (0, out-of-range, non-numeric, or missing) fails with non-zero exit and leaves todos.json byte-for-byte unchanged"
result: pass
source: automated
coverage_id: 01-02/D5

## Summary

total: 9
passed: 9
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]
