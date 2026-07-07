#!/usr/bin/env node
'use strict';

const { readTodos, writeTodos } = require('../lib/storage');

function printUsage() {
  console.error('Usage: todo <command> [args]');
  console.error('Commands:');
  console.error('  add <text>   Add a new todo item');
  console.error('  list         List pending todo items');
  console.error('  done <n>     Mark item <n> as done');
}

function handleAdd(rest) {
  const text = rest.join(' ').trim();

  if (!text) {
    console.error('Error: add requires non-empty text, e.g. todo add "buy milk"');
    process.exit(1);
  }

  const todos = readTodos();
  todos.push({ text, done: false });
  writeTodos(todos);
  console.log('Added.');
}

function handleList() {
  const todos = readTodos();
  const pending = todos.filter((t) => t.done === false);

  if (pending.length === 0) {
    console.log("No pending todos. You're all caught up!");
    return;
  }

  pending.forEach((todo, i) => {
    console.log(`${i + 1}. ${todo.text}`);
  });
}

function main() {
  const [cmd, ...rest] = process.argv.slice(2);

  switch (cmd) {
    case 'add':
      handleAdd(rest);
      break;
    case 'list':
      handleList();
      break;
    default:
      printUsage();
      process.exit(1);
  }
}

main();
