#!/usr/bin/env node
const { compileChanyak } = require('../dist/compiler');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: chanyak compile <filename.chan>');
  process.exit(1);
}

const command = args[0];
const filePath = args[1];

if (command === 'compile' && filePath) {
  try {
    const code = fs.readFileSync(path.resolve(filePath), 'utf-8');
    const jsCode = compileChanyak(code);
    console.log(jsCode);
  } catch (error) {
    console.error('Compilation failed:', error.message);
    process.exit(1);
  }
} else {
  console.error('Invalid command. Usage: chanyak compile <filename.chan>');
  process.exit(1);
}