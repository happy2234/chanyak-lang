"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
function generate(ast) {
    switch (ast.type) {
        case "Program":
            return ast.body.map(generate).join("\n");
        case "FunctionDeclaration":
            const body = ast.body.map(generate).join("\n");
            return `function ${ast.name}(${ast.params.join(", ")}) {\n${body}\n}`;
        case "CallExpression":
            return `${ast.name}(${ast.arguments.map(generate).join(", ")})`;
        case "IfStatement":
            const consequent = ast.consequent.map(generate).join("\n");
            const alternate = ast.alternate
                ? `else {\n${ast.alternate.map(generate).join("\n")}\n}`
                : "";
            return `if (${generate(ast.test)}) {\n${consequent}\n}${alternate}`;
        case "BinaryExpression":
            return `(${generate(ast.left)} ${ast.operator} ${generate(ast.right)})`;
        case "Literal":
            return JSON.stringify(ast.value); // Fix: Ensure proper string formatting
        case "VariableDeclaration":
            return `let ${ast.name} = ${generate(ast.value)};`;
        case "NumberLiteral": // ✅ Fix: Added this case
            return String(ast.value);
        case "ReturnStatement":
            // Remove extra parentheses for simple expressions
            const value = generate(ast.value);
            return /^[\w\d]+$/.test(value)
                ? `return ${value};` // Simple identifier/number
                : `return (${value});`; // Complex expression
        case "PrintStatement":
            return `console.log(${generate(ast.value)});`; // Keep the semicolon // No semicolon
        case "WhileStatement":
            return `while (${generate(ast.test)}) {\n${ast.body.map(generate).join("\n")}\n}`;
        case "Identifier":
            return ast.name; // ✅ Fix: Use ast.name instead of (Node as any).name
        default:
            throw new Error(`Unknown AST node type: ${ast.type}`);
    }
}
