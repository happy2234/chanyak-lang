import { ASTNode } from "./types";

export function generate(ast: ASTNode): string {
    switch (ast.type) {
        case "Program":
            return ast.body.map(generate).join("\n");
        
        case "FunctionDeclaration":
            const body = ast.body.map(generate).join("\n");
            return `function ${ast.name}(${ast.params.join(", ")}) {\n${body}\n}`;
        
        case "BinaryExpression":
            return `(${generate(ast.left)} ${ast.operator} ${generate(ast.right)})`;
        
        case "Literal":
            return ast.value;
        
        case "VariableDeclaration":
            return `let ${ast.name} = ${generate(ast.value)};`;
        
        case "ReturnStatement":
            return `return ${generate(ast.value)};`;
        
        case "PrintStatement":
            return `print(${generate(ast.value)});`;
        
        default:
            throw new Error(`Unknown AST node type: ${(ast as any).type}`);
    }
}