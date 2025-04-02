"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileChanyak = compileChanyak;
const generator_1 = require("./generator");
const lexer_1 = require("./lexer");
const parser_1 = require("./parser");
/**
 * Compiles Chanyak code to JavaScript
 */
function compileChanyak(code) {
    try {
        // Tokenize and log tokens for debugging
        const tokens = (0, lexer_1.tokenize)(code);
        console.debug("Token Stream:", tokens.map(t => `${t.type}:${t.value}`).join(' '));
        // Parse and validate AST
        const parser = new parser_1.Parser(tokens);
        const ast = parser.parse();
        console.debug("AST:", JSON.stringify(ast, null, 2));
        // Validate AST structure
        if (ast.type !== "Program") {
            throw new Error("Invalid program structure");
        }
        if (!ast.body.some(node => node.type === "FunctionDeclaration" && node.name === "main")) {
            throw new Error("No valid 'main' function found.");
        }
        // Generate JavaScript
        return (0, generator_1.generate)(ast);
    }
    catch (error) {
        // Improved error handling with proper type checking
        let errorMessage;
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        else if (typeof error === 'string') {
            errorMessage = error;
        }
        else {
            errorMessage = "Unknown compilation error";
        }
        // Enhanced error message with potential position info
        if (error instanceof Error && 'line' in error && 'column' in error) {
            throw new Error(`Compilation failed at ${error.line}:${error.column} - ${errorMessage}`);
        }
        else {
            throw new Error(`Compilation failed: ${errorMessage}`);
        }
    }
}
// Type guard for function declarations
function isFunctionDeclaration(node) {
    return node.type === "FunctionDeclaration";
}
// Export for both CLI and module use
exports.default = {
    compileChanyak
};
// CLI handler - only execute if run directly
if (require.main === module) {
    const { program } = require('commander');
    const fs = require('fs');
    const path = require('path');
    program
        .command('compile <file>')
        .action((file) => {
        try {
            const code = fs.readFileSync(path.resolve(file), 'utf-8');
            console.log(compileChanyak(code));
        }
        catch (error) {
            // Improved CLI error handling
            let errorMessage;
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            else {
                errorMessage = String(error);
            }
            console.error("Compilation error:", errorMessage);
            process.exit(1);
        }
    });
    program.parse(process.argv);
}
