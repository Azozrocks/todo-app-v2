'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const BIN_PATH = path.join(__dirname, '..', 'bin', 'todo.js');

function seedTodos(tempDir, todos) {
  const content = JSON.stringify(todos, null, 2);
  fs.writeFileSync(path.join(tempDir, 'todos.json'), content);
  return content;
}

function runTodo(args, cwd) {
  return execFileSync('node', [BIN_PATH, ...args], { cwd, encoding: 'utf8' });
}

function runTodoExpectFailure(args, cwd) {
  try {
    execFileSync('node', [BIN_PATH, ...args], { cwd, encoding: 'utf8' });
    return null;
  } catch (err) {
    return err;
  }
}

test('done: marks the nth pending item done, retains it in todos.json (soft-delete)', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-'));

  try {
    seedTodos(tempDir, [
      { text: 'a', done: false },
      { text: 'b', done: false },
    ]);

    const stdout = runTodo(['done', '1'], tempDir);
    assert.match(stdout, /Done\./);

    const todos = JSON.parse(fs.readFileSync(path.join(tempDir, 'todos.json'), 'utf8'));
    assert.equal(todos.length, 2);
    assert.equal(todos[0].text, 'a');
    assert.equal(todos[0].done, true);
    assert.equal(todos[1].done, false);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('done: completed item no longer appears in a subsequent list', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-'));

  try {
    seedTodos(tempDir, [
      { text: 'a', done: false },
      { text: 'b', done: false },
    ]);

    runTodo(['done', '1'], tempDir);
    const listOut = runTodo(['list'], tempDir);

    const lines = listOut.trim().split('\n');
    assert.equal(lines.length, 1);
    assert.equal(lines[0], '1. b');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('done: maps positional index over the pending view, not raw array index', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-'));

  try {
    seedTodos(tempDir, [
      { text: 'already-done', done: true },
      { text: 'first-pending', done: false },
      { text: 'second-pending', done: false },
    ]);

    runTodo(['done', '1'], tempDir);

    const todos = JSON.parse(fs.readFileSync(path.join(tempDir, 'todos.json'), 'utf8'));
    assert.equal(todos[0].done, true);
    assert.equal(todos[0].text, 'already-done');
    assert.equal(todos[1].done, true);
    assert.equal(todos[1].text, 'first-pending');
    assert.equal(todos[2].done, false);
    assert.equal(todos[2].text, 'second-pending');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

for (const args of [['done', '0'], ['done', '99'], ['done', 'abc'], ['done']]) {
  test(`done: invalid index ${JSON.stringify(args)} exits non-zero and leaves todos.json unchanged`, () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-'));

    try {
      const seedContent = seedTodos(tempDir, [
        { text: 'a', done: false },
        { text: 'b', done: false },
      ]);

      const err = runTodoExpectFailure(args, tempDir);
      assert.notEqual(err, null, 'expected non-zero exit');
      assert.notEqual(err.status, 0);

      const afterContent = fs.readFileSync(path.join(tempDir, 'todos.json'), 'utf8');
      assert.equal(afterContent, seedContent);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
}
