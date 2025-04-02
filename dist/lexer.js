"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = tokenize;
const TOKEN_SPEC = [
    { type: "comment", pattern: /^\/\/.*|\/\*[\s\S]*?\*\//, skip: true },
    { type: "whitespace", pattern: /^\s+/, skip: true },
    { type: "if", pattern: /^if\b/ },
    { type: "else", pattern: /^else\b/ },
    { type: "return", pattern: /^return\b/ },
    { type: "print", pattern: /^print\b/ },
    { type: "let", pattern: /^let\b/ },
    { type: "number", pattern: /^\d+/ },
    { type: "string", pattern: /^"[^"]*"/ },
    { type: "arrow", pattern: /^=>/ },
    { type: "comma", pattern: /^,/ },
    { type: "paren", pattern: /^[()]/ },
    { type: "brace", pattern: /^[{}]/ },
    { type: "operator", pattern: /^[+\-*/=<>!]=?/ },
    { type: "semicolon", pattern: /^;/ },
    { type: "colon", pattern: /^:/ }, // ✅ Added this for type annotations
    { type: "func", pattern: /^func\b/ },
    { type: "while", pattern: /^while\b/ },
    { type: "identifier", pattern: /^[a-zA-Z_][a-zA-Z0-9_]*/ },
];
function tokenize(code) {
    const tokens = [];
    let remaining = code;
    let line = 1;
    let column = 1;
    while (remaining.length > 0) {
        let matched = false;
        for (const { type, pattern, skip } of TOKEN_SPEC) {
            const match = pattern.exec(remaining);
            if (match && match.index === 0) {
                if (!skip) {
                    tokens.push({
                        type,
                        value: match[0],
                        line,
                        column
                    });
                }
                // Update position tracking
                const text = match[0];
                const newlines = text.split('\n').length - 1;
                if (newlines > 0) {
                    line += newlines;
                    column = text.length - text.lastIndexOf('\n');
                }
                else {
                    column += text.length;
                }
                remaining = remaining.slice(text.length);
                matched = true;
                break;
            }
        }
        if (!matched) {
            throw new Error(`Unknown token at ${line}:${column}: '${remaining[0]}'`);
        }
    }
    return tokens;
}
