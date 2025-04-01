"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = compile;
const lexer_1 = require("./lexer");
const parser_1 = require("./parser");
const generator_1 = require("./generator");
const commander_1 = require("commander");
const compiler_1 = require("./compiler");
function compile(code) {
    try {
        const tokens = (0, lexer_1.tokenize)(code);
        const parser = new parser_1.Parser(tokens);
        const ast = parser.parse();
        return { result: (0, generator_1.generate)(ast) };
    }
    catch (error) {
        return {
            error: error instanceof Error
                ? error.message
                : 'Unknown compilation error'
        };
    }
}
if (require.main === module) {
    commander_1.program
        .command('compile <file>')
        .action((file) => {
        try {
            const fs = require('fs');
            const code = fs.readFileSync(file, 'utf-8');
            console.log((0, compiler_1.compile)(code));
        }
        catch (error) {
            console.error('Error:', error.message);
            process.exit(1);
        }
    });
    commander_1.program.parse(process.argv);
}
e;
// Test case
const chanyakCode = "func add(a, b) => a + b";
const { result, error } = (0, compiler_1.compile)(chanyakCode);
console.log("Input:", chanyakCode);
if (error) {
    console.error("Error:", error);
}
else {
    console.log("Output:", result);
}
