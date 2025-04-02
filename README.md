# Chanyak Language Compiler

[![CI Status](https://img.shields.io/github/actions/workflow/status/happy2234/chanyak-lang/ci.yml)](https://github.com/happy2234/chanyak-lang/actions)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm version](https://img.shields.io/npm/v/chanyak-compiler)](https://npmjs.com/package/chanyak-compiler)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)](https://www.typescriptlang.org/)

A modern compiler for the Chanyak programming language, transpiling to optimized JavaScript.

## Features

### Language Features
- ✅ Functions with parameters
- ✅ Variable declarations (`let`)
- ✅ Arithmetic operations
- ✅ Print statements
- 🚧 If/else conditionals (in progress)
- 🔜 Loops and iteration
- 🔜 Type system

### Compiler Architecture
- 🏗️ Lexical analysis
- ✨ Syntax parsing
- 📊 AST generation
- ⚡ JavaScript code generation
- 🔜 Optimization passes
- 🔜 Source maps

## Installation

```bash
# Install globally
npm install -g chanyak-compiler

# Or use via npx
npx chanyak-compiler compile example.chan
```

## Development Setup

```bash
git clone https://github.com/happy2234/chanyak-lang.git
cd chanyak-lang
npm install
npm run build
```

## 📝 Example Program

```javascript
// examples/test.chan
func add(a, b) => {
  return a + b
}

func main() => {
  print(add(5, 3))
}
```

## 🤝 Contributing

PRs welcome! Please:

1. Open an issue first.
2. Follow the code style.
3. Add tests for new features.

## 📜 License

This project is licensed under the Apache License 2.0.