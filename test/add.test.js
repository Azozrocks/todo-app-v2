'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const BIN_PATH = path.join(__dirname, '..', 'bin', 'todo.js');

test('add: writes a new todo item to todos.json in the current directory', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-'));

  try {
    const stdout = execFileSync('node', [BIN_PATH, 'add', 'buy milk'], {
      cwd: tempDir,
      encoding: 'utf8',
    });

    assert.match(stdout, /Added/);

    const todosPath = path.join(tempDir, 'todos.json');
    const todos = JSON.parse(fs.readFileSync(todosPath, 'utf8'));

    assert.equal(Array.isArray(todos), true);
    assert.equal(todos.length, 1);
    assert.equal(todos[0].text, 'buy milk');
    assert.equal(todos[0].done, false);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
