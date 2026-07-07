'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const BIN_PATH = path.join(__dirname, '..', 'bin', 'todo.js');

function seedTodos(tempDir, todos) {
  fs.writeFileSync(path.join(tempDir, 'todos.json'), JSON.stringify(todos, null, 2));
}

test('list: prints only pending items, numbered from 1 in array order', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-'));

  try {
    seedTodos(tempDir, [
      { text: 'buy milk', done: false },
      { text: 'call mom', done: false },
    ]);

    const stdout = execFileSync('node', [BIN_PATH, 'list'], {
      cwd: tempDir,
      encoding: 'utf8',
    });

    const lines = stdout.trim().split('\n');
    assert.equal(lines[0], '1. buy milk');
    assert.equal(lines[1], '2. call mom');
    assert.equal(lines.length, 2);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('list: hides done items and renumbers pending-only from 1', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-'));

  try {
    seedTodos(tempDir, [
      { text: 'a', done: true },
      { text: 'b', done: false },
    ]);

    const stdout = execFileSync('node', [BIN_PATH, 'list'], {
      cwd: tempDir,
      encoding: 'utf8',
    });

    const lines = stdout.trim().split('\n');
    assert.equal(lines.length, 1);
    assert.equal(lines[0], '1. b');
    assert.doesNotMatch(stdout, /\ba\b/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('list: empty/all-done todos.json prints a friendly non-empty message and exits 0', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-'));

  try {
    seedTodos(tempDir, []);

    const stdout = execFileSync('node', [BIN_PATH, 'list'], {
      cwd: tempDir,
      encoding: 'utf8',
    });

    assert.notEqual(stdout.trim(), '');
    assert.match(stdout, /[a-zA-Z]/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('list: all items done also prints a friendly non-empty message', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-'));

  try {
    seedTodos(tempDir, [{ text: 'a', done: true }]);

    const stdout = execFileSync('node', [BIN_PATH, 'list'], {
      cwd: tempDir,
      encoding: 'utf8',
    });

    assert.notEqual(stdout.trim(), '');
    assert.doesNotMatch(stdout, /^\d/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
