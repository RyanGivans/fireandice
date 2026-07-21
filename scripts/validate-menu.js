#!/usr/bin/env node

const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const files = [
  'assets/js/menu-data-dinner.js',
  'assets/js/menu-data-lunch.js',
  'assets/js/menu-data-drinks-a.js',
  'assets/js/menu-data-drinks-b.js'
];
const context = { window: {} };
vm.createContext(context);

for (const file of files) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}

const menus = context.window.FI_MENU_DATA;
const required = ['dinner', 'lunch', 'drinks'];
const errors = [];

for (const key of required) {
  const menu = menus?.[key];
  if (!menu) {
    errors.push(`Missing ${key} menu.`);
    continue;
  }
  if (!Array.isArray(menu.categories) || menu.categories.length === 0) {
    errors.push(`${key}: no categories.`);
    continue;
  }
  let entries = 0;
  for (const category of menu.categories) {
    if (!category.title || !Array.isArray(category.items)) {
      errors.push(`${key}: malformed category.`);
      continue;
    }
    entries += category.items.length;
    for (const item of category.items) {
      if (!item.heading && !item.name) errors.push(`${key}/${category.title}: item has no name.`);
    }
  }
  console.log(`PASS ${key}: ${menu.categories.length} categories, ${entries} entries`);
}

if (errors.length) {
  console.error('\nMENU VALIDATION FAILED');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\nPASS: all menu datasets loaded and validated.');
