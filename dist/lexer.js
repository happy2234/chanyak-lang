"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = tokenize;
function tokenize(code) {
    const tokens = [];
    const regex = /\b(func)\b|=>|[a-zA-Z_]\w*|\d+|[+\-*\/=(),]|\s+/g;
    let match;
    let line = 1;
    let column = 1;
    while ((match = regex.exec(code))) {
        const [value] = match;
        const startIndex = match.index;
        if (/\s+/.test(value)) {
            // Handle whitespace
            const newlines = value.split('\n').length - 1;
            if (newlines > 0) {
                line += newlines;
                column = 1;
            }
            else {
                column += value.length;
            }
            continue;
        }
        const type = getTokenType(value);
        tokens.push({
            type,
            value,
            line,
            column
        });
        column += value.length;
    }
    return tokens;
}
function getTokenType(value) {
    if (value === 'func')
        return 'func';
    if (value === '=>')
        return 'arrow';
    if (value === ',')
        return 'comma'; // Add this line
    if (/^[a-zA-Z_]/.test(value))
        return 'identifier';
    if (/^\d/.test(value))
        return 'number';
    if (/^[+\-*\/=]/.test(value))
        return 'operator';
    if (/^[()]/.test(value))
        return 'paren';
    throw new Error(`Unknown token: ${value}`);
}
