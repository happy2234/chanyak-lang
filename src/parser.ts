import { Token, ASTNode } from "./types";

export class Parser {
    private tokens: Token[];
    private current = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    parse(): ASTNode {
        console.log("First token:", this.tokens[0]);  // 🔍 Debugging: Check first token
        const body: ASTNode[] = [];
        
        while (!this.isAtEnd()) {
            try {
                console.log("Current token:", this.peek());  // 🔍 Debugging: Check current token before parsing
                
                if (this.match("func")) {
                    body.push(this.parseFunction());
                } else {
                    this.advance();
                }
            } catch (error) {
                const token = this.peek();
                const message = error instanceof Error ? error.message : String(error);
                throw new Error(`[${token.line}:${token.column}] ${message}`);
            }
        }
        
        return { type: "Program", body };
    }
    
    private parseFunction(): ASTNode {
        // The "func" keyword is already matched in parse(), so we don't consume it here
        const name = this.consume("identifier").value!;
        
        this.consume("paren", "(");
        const params: string[] = [];
    
        // ✅ Parse function parameters
        if (!this.check("paren", ")")) {
            do {
                params.push(this.consume("identifier").value!);
                if (this.check("paren", ")")) break;
                this.consume("comma");
            } while (true);
        }
        this.consume("paren", ")");
    
        this.consume("arrow", "=>"); // ✅ Ensure '=>' syntax
        this.consume("brace", "{");  // ✅ Ensure function body starts with '{'
    
        const body: ASTNode[] = [];
        while (!this.check("brace", "}") && !this.isAtEnd()) {
            // ✅ Ensure return statements are properly handled
            if (this.check("return")) {
                body.push(this.parseReturnStatement());
            } else {
                body.push(this.parseStatement());
            }
        }
    
        this.consume("brace", "}"); // ✅ Ensure function body ends with '}'
    
        return { type: "FunctionDeclaration", name, params, body };
    }
    
    
    

    private parseWhileStatement(): ASTNode {
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
    private parseBlock(): ASTNode[] {
        this.consume("brace", "{");
        const body: ASTNode[] = [];
        
        while (!this.check("brace", "}")) {
            body.push(this.parseStatement());
        }
        
        this.consume("brace", "}");
        return body;
    }

    private parseStatement(): ASTNode {
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
    

    private parseIfStatement(): ASTNode {
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

    private parseVariableDeclaration(): ASTNode {
        const name = this.consume("identifier").value!;
        this.consume("operator", "=");
        const value = this.parseExpression();
        this.consume("operator", ";");
        return {
            type: "VariableDeclaration",
            name,
            value
        };
    }

    private parseReturnStatement(): ASTNode {
        this.consume("return"); // ✅ Consume 'return' keyword
    
        // ✅ Parse expressions properly
        const value = this.parseExpression(); 
    
        this.consume("semicolon"); // ✅ Ensure semicolon at the end
        return { type: "ReturnStatement", value };
    }
    

    private parsePrintStatement(): ASTNode {
        this.consume("paren", "(");
        const value = this.parseExpression();
        this.consume("paren", ")");
        this.consume("operator", ";");
        return {
            type: "PrintStatement",
            value
        };
    }
    private parseExpression(): ASTNode {
        let left = this.parsePrimary(); // Start with a primary expression (identifier, number, etc.)
    
        while (this.match("operator")) { // ✅ Handle binary operators like '+'
            const operator = this.previous().value!;
            const right = this.parsePrimary();
            left = { type: "BinaryExpression", operator, left, right };
        }
    
        return left;
    }
    
    private parsePrimary(): ASTNode {
        if (this.match("identifier")) {
            const identifier = this.previous().value!;
    
            // Check if it's a function call
            if (this.match("paren", "(")) {
                const args: ASTNode[] = [];
    
                if (!this.check("paren", ")")) {
                    do {
                        args.push(this.parseExpression());
                        if (this.check("paren", ")")) break;
                        this.consume("comma");
                    } while (true);
                }
                this.consume("paren", ")"); // Consume closing ')'
                return { type: "CallExpression", name: identifier, arguments: args };

            }
    
            return { type: "Identifier", name: identifier };
        }
    
        if (this.match("number")) {
            return { type: "NumberLiteral", value: parseFloat(this.previous().value!) };
        }
    
        throw new Error(`[${this.peek().line}:${this.peek().column}] Unexpected token: '${this.peek().value}'`);
    }
    
    

    // Helper Methods
    private match(type: string, value?: string): boolean {
        if (this.check(type, value)) {
            this.advance();
            return true;
        }
        return false;
    }

    private check(type: string, value?: string): boolean {
        if (this.isAtEnd()) return false;
        const token = this.peek();
        console.log(`Checking token: ${JSON.stringify(token)}, expected type: ${type}`);
        return token.type === type && (value === undefined || token.value === value);
    }
    

    private advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    private consume(type: string, value?: string): Token {
        if (this.check(type, value)) return this.advance();
        throw new Error(
            `[${this.peek().line}:${this.peek().column}] Expected '${value || type}', found '${this.peek().value}'`
        );
    }

    private isAtEnd(): boolean {
        return this.current >= this.tokens.length;
    }

    private peek(): Token {
        return this.tokens[this.current];
    }

    private previous(): Token {
        return this.tokens[this.current - 1];
    }
    private checkNext(type: string, value?: string): boolean {
        if (this.current + 1 >= this.tokens.length) return false; // No next token
        const next = this.tokens[this.current + 1];
        return next.type === type && (value === undefined || next.value === value);
    }
    

    private error(token: Token, message: string): Error {
        const location = token.line && token.column 
            ? `[${token.line}:${token.column}] `
            : '';
        return new Error(`${location}${message}`);
    }
}
