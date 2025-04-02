"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
class Parser {
    constructor(tokens) {
        this.current = 0;
        this.tokens = tokens;
    }
    parse() {
        console.log("First token:", this.tokens[0]); // 🔍 Debugging: Check first token
        const body = [];
        while (!this.isAtEnd()) {
            try {
                console.log("Current token:", this.peek()); // 🔍 Debugging: Check current token before parsing
                if (this.match("func")) {
                    body.push(this.parseFunction());
                }
                else {
                    this.advance();
                }
            }
            catch (error) {
                const token = this.peek();
                const message = error instanceof Error ? error.message : String(error);
                throw new Error(`[${token.line}:${token.column}] ${message}`);
            }
        }
        return { type: "Program", body };
    }
    parseFunction() {
        // The "func" keyword is already matched in parse(), so we don't consume it here
        const name = this.consume("identifier").value;
        this.consume("paren", "(");
        const params = [];
        // ✅ Parse function parameters
        if (!this.check("paren", ")")) {
            do {
                params.push(this.consume("identifier").value);
                if (this.check("paren", ")"))
                    break;
                this.consume("comma");
            } while (true);
        }
        this.consume("paren", ")");
        this.consume("arrow", "=>"); // ✅ Ensure '=>' syntax
        this.consume("brace", "{"); // ✅ Ensure function body starts with '{'
        const body = [];
        while (!this.check("brace", "}") && !this.isAtEnd()) {
            // ✅ Ensure return statements are properly handled
            if (this.check("return")) {
                body.push(this.parseReturnStatement());
            }
            else {
                body.push(this.parseStatement());
            }
        }
        this.consume("brace", "}"); // ✅ Ensure function body ends with '}'
        return { type: "FunctionDeclaration", name, params, body };
    }
    parseWhileStatement() {
        this.consume("paren", "(");
        const test = this.parseExpression();
        this.consume("paren", ")");
        const body = this.check("brace", "{")
            ? this.parseBlock()
            : [this.parseStatement()];
        return {
            type: "WhileStatement",
            test,
            body
        };
    }
    parseBlock() {
        this.consume("brace", "{");
        const body = [];
        while (!this.check("brace", "}")) {
            body.push(this.parseStatement());
        }
        this.consume("brace", "}");
        return body;
    }
    parseStatement() {
        if (this.check("return")) {
            return this.parseReturnStatement(); // ✅ Handle return statements properly
        }
        if (this.check("print")) {
            this.consume("print");
            this.consume("paren", "(");
            const value = this.parseExpression();
            this.consume("paren", ")");
            this.consume("semicolon"); // ✅ Ensure semicolon is consumed
            return { type: "PrintStatement", value };
        }
        if (this.check("identifier") && this.checkNext("paren", "(")) {
            const expr = this.parseExpression();
            this.consume("semicolon"); // ✅ Ensure function calls end with semicolon
            return expr;
        }
        throw new Error(`Unexpected token ${this.peek().type} at ${this.peek().line}:${this.peek().column}`);
    }
    parseIfStatement() {
        const test = this.parseExpression();
        const consequent = this.check("brace", "{")
            ? this.parseBlock()
            : [this.parseStatement()];
        let alternate;
        if (this.match("else")) {
            alternate = this.check("brace", "{")
                ? this.parseBlock()
                : [this.parseStatement()];
        }
        return { type: "IfStatement", test, consequent, alternate };
    }
    parseVariableDeclaration() {
        const name = this.consume("identifier").value;
        this.consume("operator", "=");
        const value = this.parseExpression();
        this.consume("operator", ";");
        return {
            type: "VariableDeclaration",
            name,
            value
        };
    }
    parseReturnStatement() {
        this.consume("return"); // ✅ Consume 'return' keyword
        // ✅ Parse expressions properly
        const value = this.parseExpression();
        this.consume("semicolon"); // ✅ Ensure semicolon at the end
        return { type: "ReturnStatement", value };
    }
    parsePrintStatement() {
        this.consume("paren", "(");
        const value = this.parseExpression();
        this.consume("paren", ")");
        this.consume("operator", ";");
        return {
            type: "PrintStatement",
            value
        };
    }
    parseExpression() {
        let left = this.parsePrimary(); // Start with a primary expression (identifier, number, etc.)
        while (this.match("operator")) { // ✅ Handle binary operators like '+'
            const operator = this.previous().value;
            const right = this.parsePrimary();
            left = { type: "BinaryExpression", operator, left, right };
        }
        return left;
    }
    parsePrimary() {
        if (this.match("identifier")) {
            const identifier = this.previous().value;
            // Check if it's a function call
            if (this.match("paren", "(")) {
                const args = [];
                if (!this.check("paren", ")")) {
                    do {
                        args.push(this.parseExpression());
                        if (this.check("paren", ")"))
                            break;
                        this.consume("comma");
                    } while (true);
                }
                this.consume("paren", ")"); // Consume closing ')'
                return { type: "CallExpression", name: identifier, arguments: args };
            }
            return { type: "Identifier", name: identifier };
        }
        if (this.match("number")) {
            return { type: "NumberLiteral", value: parseFloat(this.previous().value) };
        }
        throw new Error(`[${this.peek().line}:${this.peek().column}] Unexpected token: '${this.peek().value}'`);
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
        console.log(`Checking token: ${JSON.stringify(token)}, expected type: ${type}`);
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
        throw new Error(`[${this.peek().line}:${this.peek().column}] Expected '${value || type}', found '${this.peek().value}'`);
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
    checkNext(type, value) {
        if (this.current + 1 >= this.tokens.length)
            return false; // No next token
        const next = this.tokens[this.current + 1];
        return next.type === type && (value === undefined || next.value === value);
    }
    error(token, message) {
        const location = token.line && token.column
            ? `[${token.line}:${token.column}] `
            : '';
        return new Error(`${location}${message}`);
    }
}
exports.Parser = Parser;
