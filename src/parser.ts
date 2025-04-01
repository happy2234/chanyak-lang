import { Token, ASTNode } from "./types";

export class Parser {
    private tokens: Token[];
    private current = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    parse(): ASTNode {
        console.log("=== STARTING PARSING ===");
        const body: ASTNode[] = [];
        
        // Skip any initial whitespace/comments
        while (this.check("whitespace") || this.check("comment")) {
            this.advance();
        }

        while (!this.isAtEnd()) {
            console.log(`Current token: ${this.peek().type} '${this.peek().value}'`);
            
            if (this.match("func")) {
                console.log("Found function declaration");
                const fn = this.parseFunction();
                console.log("Parsed function:", JSON.stringify(fn, null, 2));
                body.push(fn);
            } else {
                console.log("Skipping non-function token");
                this.advance();
            }

            // Skip whitespace/comments between declarations
            while (this.check("whitespace") || this.check("comment")) {
                this.advance();
            }
        }
        
        console.log("=== PARSING COMPLETE ===");
        console.log(`Found ${body.length} functions`);
        
        if (body.length === 0) {
            throw this.error(this.peek(), "No functions found in the code");
        }
        
        return { type: "Program", body };
    }

    private parseFunction(): ASTNode {
        console.log("Starting function parsing");
        const name = this.consume("identifier").value!;
        console.log(`Function name: ${name}`);
        
        this.consume("paren", "(");
        console.log("Started parameter list");
        
        const params: string[] = [];
        if (!this.check("paren", ")")) {
            do {
                const param = this.consume("identifier").value!;
                params.push(param);
                console.log(`Added parameter: ${param}`);
                
                if (this.check("paren", ")")) break;
                this.consume("comma");
            } while (true);
        }
        
        this.consume("paren", ")");
        console.log("Completed parameter list");
        
        this.consume("arrow", "=>");
        console.log(`Parsing body for function ${name}`);
        
        const body = this.check("brace", "{") 
            ? this.parseBlock()
            : [this.parseExpression()];
        
        console.log(`Completed function ${name}`);
        return {
            type: "FunctionDeclaration",
            name,
            params,
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
        if (this.match("identifier", "let")) {
            return this.parseVariableDeclaration();
        }
        if (this.match("identifier", "return")) {
            return this.parseReturnStatement();
        }
        if (this.match("identifier", "print")) {
            return this.parsePrintStatement();
        }
        return this.parseExpression();
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
        const value = this.parseExpression();
        this.consume("operator", ";");
        return {
            type: "ReturnStatement",
            value
        };
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
        let left = this.parsePrimary();
        
        while (this.match("operator", "+") || 
               this.match("operator", "-") ||
               this.match("operator", "*") ||
               this.match("operator", "/")) {
            const operator = this.previous().value!;
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

    private parsePrimary(): ASTNode {
        if (this.match("number")) {
            return { type: "Literal", value: this.previous().value! };
        }
        if (this.match("identifier")) {
            return { type: "Literal", value: this.previous().value! };
        }
        if (this.match("paren", "(")) {
            const expr = this.parseExpression();
            this.consume("paren", ")");
            return expr;
        }
        
        throw this.error(this.peek(), "Expected expression");
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
        return token.type === type && (value === undefined || token.value === value);
    }

    private advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    private consume(type: string, value?: string): Token {
        if (this.check(type, value)) return this.advance();
        throw this.error(this.peek(), `Expected ${type}${value ? ` '${value}'` : ''}`);
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

    private error(token: Token, message: string): Error {
        const location = token.line && token.column 
            ? `[${token.line}:${token.column}] `
            : '';
        return new Error(`${location}${message}`);
    }
}