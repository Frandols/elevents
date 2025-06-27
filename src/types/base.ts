export type TokenType =
	| 'CATCH'
	| 'THROW'
	| 'IF'
	| 'IDENTIFIER'
	| 'STRING'
	| 'NUMBER'
	| 'BOOLEAN'
	| 'EQUAL'
	| 'SEMICOLON'
	| 'LBRACE'
	| 'RBRACE'
	| 'AND'
	| 'OR'
	| 'NOT'
	| 'EQ'
	| 'LT'
	| 'GT'
	| 'PLUS'
	| 'MINUS'
	| 'MUL'
	| 'POW'
	| 'EOF'

export default interface Token {
	type: TokenType
	value: string
}
