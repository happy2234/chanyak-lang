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
        
        if (!ast.body.some(node => node.type === "FunctionDeclaration" && node.name === "main")) {
            throw new Error("No valid 'main' function found.");
        }
        
        
        // Generate JavaScript
        return generate(ast);
    } catch (error) {
        // Improved error handling with proper type checking
        let errorMessage: string;
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        } else {
            errorMessage = "Unknown compilation error";
        }
        
        // Enhanced error message with potential position info
        if (error instanceof Error && 'line' in error && 'column' in error) {
            throw new Error(`Compilation failed at ${error.line}:${error.column} - ${errorMessage}`);
        } else {
            throw new Error(`Compilation failed: ${errorMessage}`);
        }
    }
}

// Type guard for function declarations
function isFunctionDeclaration(node: ASTNode): node is Extract<ASTNode, { type: 'FunctionDeclaration' }> {
    return node.type === "FunctionDeclaration";
}

// Export for both CLI and module use
export default {
    compileChanyak
};

// CLI handler - only execute if run directly
if (require.main === module) {
    const { program } = require('commander');
    const fs = require('fs');
    const path = require('path');

    program
        .command('compile <file>')
        .action((file: string) => {
            try {
                const code = fs.readFileSync(path.resolve(file), 'utf-8');
                console.log(compileChanyak(code));
            } catch (error) {
                // Improved CLI error handling
                let errorMessage: string;
                if (error instanceof Error) {
                    errorMessage = error.message;
                } else {
                    errorMessage = String(error);
                }
                console.error("Compilation error:", errorMessage);
                process.exit(1);
            }
        });

    program.parse(process.argv);
}