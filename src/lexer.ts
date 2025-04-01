import { Token } from "./types";export function tokenize(code: string): Token[] {
    const tokens: Token[] = [];
    const tokenPatterns = [
        { type: "comment", pattern: /^\/\/.*|\/\*[\s\S]*?\*\//, skip: true },
        { type: "whitespace", pattern: /^\s+/, skip: true },
        { type: "func", pattern: /^func\b/ },
        { type: "arrow", pattern: /^=>/ },
        { type: "comma", pattern: /^,/ },
        { type: "paren", pattern: /^[()]/ },
        { type: "brace", pattern: /^[{}]/ },
        { type: "operator", pattern: /^[+\-*/=]/ },
        { type: "number", pattern: /^\d+/ },
        { type: "identifier", pattern: /^[a-zA-Z_]\w*/ },
        { type: "unknown", pattern: /^./ } // Catch-all for debugging
    ];

    let remaining = code;
    let line = 1;
    let column = 1;

    while (remaining.length > 0) {
        let matched = false;

        for (const { type, pattern, skip } of tokenPatterns) {
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
                const lines = match[0].split('\n');
                if (lines.length > 1) {
                    line += lines.length - 1;
                    column = lines[lines.length - 1].length + 1;
                } else {
                    column += match[0].length;
                }

                remaining = remaining.slice(match[0].length);
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
function getTokenType(value: string): string {
    if (value === 'func') return 'func';
    if (value === '=>') return 'arrow';
    if (value === ',') return 'comma';  // Add this line
    if (/^[a-zA-Z_]/.test(value)) return 'identifier';
    if (/^\d/.test(value)) return 'number';
    if (/^[+\-*\/=]/.test(value)) return 'operator';
    if (/^[()]/.test(value)) return 'paren';
    throw new Error(`Unknown token: ${value}`);
    if (/^\d/.test(value)) return 'number';
    return 'operator';

}
// In src/lexer.ts, update the token patterns:
const TOKEN_SPEC = [
    { type: "comment", pattern: /^\/\/.*|\/\*[\s\S]*?\*\//, skip: true }, // Skip comments
    { type: "func", pattern: /^func\b/ },
    { type: "identifier", pattern: /^[a-zA-Z_]\w*/ },
    { type: "number", pattern: /^\d+/ },
    { type: "operator", pattern: /^[+\-*/=]/ },
    { type: "paren", pattern: /^[()]/ },
    { type: "brace", pattern: /^[{}]/ },  // Add braces
    { type: "arrow", pattern: /^=>/ },
    { type: "comment", pattern: /^\/\/.*|\/\*[\s\S]*?\*\//, skip: true },
    { type: "whitespace", pattern: /^\s+/, skip: true },
    { type: "func", pattern: /^func\b/ },
    { type: "whitespace", pattern: /^\s+/, skip: true }
  ];