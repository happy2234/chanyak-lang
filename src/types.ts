export type Token = {
    type: string;
    value?: string;
    line?: number;
    column?: number;
};

export type ASTNode = 
    | { type: "Program"; body: ASTNode[] }
    | { type: "FunctionDeclaration"; name: string; params: string[]; body: ASTNode[] }
    | { type: "BinaryExpression"; left: ASTNode; right: ASTNode; operator: string }
    | { type: "Literal"; value: string }
    | { type: "VariableDeclaration"; name: string; value: ASTNode }
    | { type: "ReturnStatement"; value: ASTNode }
    | { type: "PrintStatement"; value: ASTNode };