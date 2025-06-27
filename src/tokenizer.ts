import Token, { TokenType } from './types/base'

export default function tokenize(source: string): Token[] {
	const tokens: Token[] = []
	let i = 0

	const isLetter = (c: string) => /[a-zA-Z_]/.test(c)
	const isDigit = (c: string) => /[0-9]/.test(c)
	const isWhitespace = (c: string) => /\s/.test(c)

	const keywords: Record<string, TokenType> = {
		catch: 'CATCH',
		throw: 'THROW',
		if: 'IF',
		true: 'BOOLEAN',
		false: 'BOOLEAN',
		and: 'AND',
		or: 'OR',
	}

	while (i < source.length) {
		const c = source[i]

		// Espacios
		if (isWhitespace(c)) {
			i++
			continue
		}

		// Identificadores o palabras clave
		if (isLetter(c)) {
			let start = i
			while (i < source.length && /[a-zA-Z0-9_]/.test(source[i])) i++
			const value = source.slice(start, i)
			const type = keywords[value] ?? 'IDENTIFIER'
			tokens.push({ type, value })
			continue
		}

		// Números
		if (isDigit(c)) {
			let start = i
			while (i < source.length && isDigit(source[i])) i++
			const value = source.slice(start, i)
			tokens.push({ type: 'NUMBER', value })
			continue
		}

		// Strings entre comillas
		if (c === '"') {
			i++ // saltar la primera comilla
			let start = i
			while (i < source.length && source[i] !== '"') i++
			if (i >= source.length) throw new Error('String sin cerrar')
			const value = source.slice(start, i)
			i++ // saltar comilla de cierre
			tokens.push({ type: 'STRING', value })
			continue
		}

		// Doble igual
		if (source.startsWith('==', i)) {
			tokens.push({ type: 'EQ', value: '==' })
			i += 2
			continue
		}

		// Símbolos individuales
		const singleCharTokens: Record<string, TokenType> = {
			'=': 'EQUAL',
			';': 'SEMICOLON',
			'{': 'LBRACE',
			'}': 'RBRACE',
			'<': 'LT',
			'>': 'GT',
			'+': 'PLUS',
			'-': 'MINUS',
			'*': 'MUL',
			'^': 'POW',
		}

		if (c in singleCharTokens) {
			tokens.push({ type: singleCharTokens[c], value: c })
			i++
			continue
		}

		throw new Error(`Carácter inesperado: '${c}'`)
	}

	tokens.push({ type: 'EOF', value: '' })

	return tokens
}
