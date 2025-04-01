"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
function generate(ast) {
    switch (ast.type) {
        case "Program":
            return ast.body.map(generate).join("\n");
        case "FunctionDeclaration":
            return `function ${ast.name}(${ast.params.join(", ")}) {\n  return ${generate(ast.body[0])};\n}`;
        case "BinaryExpression":
            return `(${generate(ast.left)} ${ast.operator} ${generate(ast.right)})`;
        case "Literal":
            return ast.value;
        default:
            throw new Error(`Unknown AST node type: ${ast.type}`);
    }
}
