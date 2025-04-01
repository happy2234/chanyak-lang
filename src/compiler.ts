import { generate } from './generator';
import { tokenize } from './lexer';
import { Parser } from './parser';
import { ASTNode } from './types';

/**
 * Compiles Chanyak code to JavaScript
 */
export function compileChanyak(code: string): string {
    try {
        // Tokenize and log tokens for debugging
        const tokens = tokenize(code);
        console.debug("Token Stream:", tokens.map(t => `${t.type}:${t.value}`).join(' '));
        
        // Parse and validate AST
        const parser = new Parser(tokens);
        const ast = parser.parse();
        console.debug("AST:", JSON.stringify(ast, null, 2));
        
        // Validate AST structure
        if (ast.type !== "Program") {
            throw new Error("Invalid program structure");
        }
        
        if (!ast.body.some(isFunctionDeclaration)) {
            throw new Error("No valid function declarations found");
        }
        
        // Generate JavaScript
        return generate(ast);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown compilation error";
        throw new Error(`Compilation failed: ${message}`);
    }
}

// Type guard for function declarations
function isFunctionDeclaration(node: ASTNode): node is Extract<ASTNode, { type: 'FunctionDeclaration' }> {
    return node.type === "FunctionDeclaration";
}

// CLI handler
if (require.main === module) {
    const fs = require('fs');
    const path = require('path');
    
    try {
        const filePath = process.argv[2];
        if (!filePath) {
            console.error("Usage: ts-node compiler.ts <file.chan>");
            process.exit(1);
        }
        
        const code = fs.readFileSync(path.resolve(filePath), 'utf-8');
        const jsCode = compileChanyak(code);
        console.log(jsCode);
    } catch (error) {
        console.error(error instanceof Error ? error.message : "An unknown error occurred");
        process.exit(1);
    }
}