'use strict';

const fs = require('node:fs');
const path = require('node:path');

function getTodosPath() {
  return path.join(process.cwd(), 'todos.json');
}

function readTodos() {
  const todosPath = getTodosPath();

  if (!fs.existsSync(todosPath)) {
    return [];
  }

  let raw;
  try {
    raw = fs.readFileSync(todosPath, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
    console.error(`Error: could not read ${todosPath} (${err.message})`);
    process.exit(1);
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error(`Error: ${todosPath} is corrupt or not valid JSON.`);
    process.exit(1);
  }

  if (!Array.isArray(parsed)) {
    console.error(`Error: ${todosPath} does not contain a JSON array of todos.`);
    process.exit(1);
  }

  return parsed;
}

function writeTodos(todos) {
  fs.writeFileSync(getTodosPath(), JSON.stringify(todos, null, 2));
}

module.exports = { getTodosPath, readTodos, writeTodos };
