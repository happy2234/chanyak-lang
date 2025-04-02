# Chanyak Language Compiler
<!-- cspell:ignore Chanyak -->

[![CI Status](https://github.com/happy2234/chanyak-lang/actions/workflows/ci.yml/badge.svg)](https://github.com/happy2234/chanyak-lang/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/chanyak-compiler)](https://www.npmjs.com/package/chanyak-compiler)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-3178C6.svg)](https://www.typescriptlang.org/)
A modern compiler for the Chanyak programming language, transpiling to efficient JavaScript.
<!-- cspell:ignore Chanyak transpiling -->
A modern compiler for the Chanyak programming language, transpiling to efficient JavaScript.

### Language Syntax

| Feature              | Status |
### Language Syntax
| Feature              | Status |
|----------------------|--------|
| Functions            | ✅     |
| Variables (let)      | ✅     |
| Arithmetic ops       | ✅     |
| Print statements     | ✅     |
| If/else             | 🔜     |
### Compiler Pipeline

| Stage                | Status |

### Compiler Pipeline
| Stage                | Status |
| JS Codegen           | ✅     |
<!-- cspell:ignore Codegen -->
| Lexer                | ✅     |
| Parser               | ✅     |
| AST Generation       | ✅     |
| JS Codegen           | ✅     |
### Installation
| Source Maps          | ❌     |
npm install -g chanyak-compiler
<!-- cspell:ignore chanyak -->
yarn global add chanyak-compiler
<!-- cspell:ignore chanyak -->

### Installation
```bash
npm install -g chanyak-compiler
# or
yarn global add chanyak-compiler


cd chanyak-lang
<!-- cspell:ignore chanyak -->
'''bash
node bin/chanyak.js compile examples/test.chan  

### Development Setup
'''bash
git clone https://github.com/happy2234/chanyak-lang.git
cd chanyak-lang
npm install
npm run build

###  📝 Example Program
'''bash
// examples/test.chan
func add(a, b) => {
  return a + b
}

func main() => {
  print(add(5, 3))
}

###🤝 Contributing

PRs welcome! Please:

    Open an issue first

    Follow the code style

    Add tests for new features

###📜 License
This project is licensed under the Apache License 2.0. 