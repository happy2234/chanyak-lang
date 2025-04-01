"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
class Parser {
    constructor(tokens) {
        this.current = 0;
        this.tokens = tokens;
    }
    parse() {
        return this.parseProgram();
    }
    parseProgram() {
        const body = [];
        while (!this.isAtEnd()) {
            body.push(this.parseFunction());
        }
        return { type: "Program", body };
    }
    parseFunction() {
        this.consume("func");
        const name = this.consume("identifier").value;
        this.consume("paren", "(");
        const params = [];
        if (!this.check("paren", ")")) {
            do {
                params.push(this.consume("identifier").value);
                if (this.check("paren", ")"))
                    break;
                this.consume("comma"); // Changed from checking "operator" to "comma"
            } while (true);
        }
        this.consume("paren", ")");
        this.consume("arrow", "=>");
        const body = this.parseExpression();
        return {
            type: "FunctionDeclaration",
            name,
            params,
            body: [body]
        };
    }
    parseExpression() {
        let left = this.parsePrimary();
        while (this.match("operator", "+") ||
            this.match("operator", "-") ||
            this.match("operator", "*") ||
            this.match("operator", "/")) {
            const operator = this.previous().value;
            const right = this.parsePrimary();
            left = {
                type: "BinaryExpression",
                left,
                right,
                operator
            };
        }
        return left;
    }
    parsePrimary() {
        if (this.match("number")) {
            return { type: "Literal", value: this.previous().value };
        }
        if (this.match("identifier")) {
            return { type: "Literal", value: this.previous().value };
        }
        if (this.match("paren", "(")) {
            const expr = this.parseExpression();
            this.consume("paren", ")");
            return expr;
        }
        throw this.error(this.peek(), "Expected expression");
    }
    // Helper Methods
    match(type, value) {
        if (this.check(type, value)) {
            this.advance();
            return true;
        }
        return false;
    }
    check(type, value) {
        if (this.isAtEnd())
            return false;
        const token = this.peek();
        return token.type === type && (value === undefined || token.value === value);
    }
    advance() {
        if (!this.isAtEnd())
            this.current++;
        return this.previous();
    }
    consume(type, value) {
        if (this.check(type, value))
            return this.advance();
        throw this.error(this.peek(), `Expected ${type}${value ? ` '${value}'` : ''}`);
    }
    isAtEnd() {
        return this.current >= this.tokens.length;
    }
    peek() {
        return this.tokens[this.current];
    }
    previous() {
        return this.tokens[this.current - 1];
    }
    error(token, message) {
        const location = token.line && token.column
            ? `[${token.line}:${token.column}] `
            : '';
        return new Error(`${location}${message}`);
    }
}
exports.Parser = Parser;
