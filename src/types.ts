export type Token = {
    type: string;
    value?: string;
    line?: number;
    column?: number;
};

export type ASTNode = 
    | { type: "Program"; body: ASTNode[] }
    | { type: "FunctionDeclaration"; name: string; params: string[]; body: ASTNode[] }
    | { type: "WhileStatement"; test: ASTNode; body: ASTNode[] }   
    | { type: "IfStatement"; test: ASTNode; consequent: ASTNode[]; alternate?: ASTNode[] }
    | { type: "BinaryExpression"; left: ASTNode; right: ASTNode; operator: string }
    | { type: "Literal"; value: string | number | boolean } // 🔹 Supports different literals
    | { type: "VariableDeclaration"; name: string; value: ASTNode }
    | { type: "ReturnStatement"; value: ASTNode }
    | { type: "PrintStatement"; value: ASTNode }
    | { type: "CallExpression"; name: string; arguments: ASTNode[] } // ✅ Supports function calls
    | { type: "Identifier"; name: string }
    | { type: "NumberLiteral"; value: number }; 

