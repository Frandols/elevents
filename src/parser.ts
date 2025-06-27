import Token, { TokenType } from './types/base'
import NodoAST, {
	NodoAsignacion,
	NodoBifurcacion,
	NodoBooleano,
	NodoCadena,
	NodoCaracteres,
	NodoCatch,
	NodoComparacionLogica,
	NodoDato,
	NodoDeclaracion,
	NodoDeclaracionComportamental,
	NodoDeclaracionProcedural,
	NodoDigito,
	NodoIdentificador,
	NodoInstruccion,
	NodoNumero,
	NodoOperacionAritmetica,
	NodoOperacionLogica,
	NodoOperadorAritmetico,
	NodoOperadorLogico,
	NodoProcedimiento,
	NodoPrograma,
	NodoThrow,
	NodoValor,
} from './types/nodes'

export default class Parser {
	private tokens: Token[]
	private current = 0

	constructor(tokens: Token[]) {
		this.tokens = tokens
	}

	private peek(): Token {
		return this.tokens[this.current]
	}

	private consume(type: TokenType): Token {
		const token = this.peek()

		if (!token || token.type !== type) {
			throw new Error(`Se esperaba ${type} y se encontro ${token?.type}`)
		}
		this.current++

		return token
	}

	public parsePrograma(): NodoPrograma {
		const declaraciones: NodoDeclaracion[] = []

		while (this.peek().type !== 'EOF') {
			declaraciones.push(this.parseDeclaracion())
		}

		return { type: 'Programa', declaraciones }
	}

	private parseDeclaracion(): NodoDeclaracion {
		const instruccion = this.parseDeclaracionComportamental()

		return { type: 'Declaracion', instruccion }
	}

	private parseDeclaracionComportamental(): NodoDeclaracionComportamental {
		const token = this.peek()

		if (token.type === 'THROW')
			return {
				type: 'DeclaracionComportamental',
				comportamiento: this.parseThrow(),
			}
		if (token.type === 'CATCH')
			return {
				type: 'DeclaracionComportamental',
				comportamiento: this.parseCatch(),
			}

		throw new Error(`Instrucción inesperado: ${token.type}`)
	}

	private parseThrow(): NodoThrow {
		this.consume('THROW')
		const cadena = this.parseCadena()
		this.consume('SEMICOLON')

		return { type: 'Throw', evento: cadena }
	}

	private parseCatch(): NodoCatch {
		this.consume('CATCH')
		const evento = this.parseCadena()
		const procedimiento = this.parseProcedimiento()
		this.consume('SEMICOLON')

		return { type: 'Catch', evento, procedimiento }
	}

	private parseProcedimiento(): NodoProcedimiento {
		this.consume('LBRACE')

		const declaracion = this.parseDeclaracionProcedural()

		this.consume('RBRACE')

		return {
			type: 'Procedimiento',
			declaracion,
		}
	}

	private parseDeclaracionProcedural(): NodoDeclaracionProcedural {
		const instrucciones: NodoInstruccion[] = []

		while (this.peek().type !== 'RBRACE') {
			instrucciones.push(this.parseInstruccion())
		}

		return { type: 'DeclaracionProcedural', instrucciones }
	}

	private parseInstruccion(): NodoInstruccion {
		const token = this.peek()

		if (token.type === 'IDENTIFIER')
			return {
				type: 'Instruccion',
				tipo: this.parseAsignacion(),
			}
		if (token.type === 'IF')
			return {
				type: 'Instruccion',
				tipo: this.parseBifurcacion(),
			}
		if (token.type === 'CATCH' || token.type === 'THROW')
			return {
				type: 'Instruccion',
				tipo: this.parseDeclaracionComportamental(),
			}

		throw new Error(`Instrucción procedural inesperada: ${token.type}`)
	}

	private parseAsignacion(): NodoAsignacion {
		const id = this.parseIdentificador()
		this.consume('EQUAL')
		const valor = this.parseValor()
		this.consume('SEMICOLON')

		return { type: 'Asignacion', id, valor }
	}

	private parseValor(): NodoValor {
		const tokens: Token[] = []

		let current = this.peek()

		while (current.type !== 'SEMICOLON') {
			this.consume(current.type)

			tokens.push(current)

			current = this.peek()
		}

		if (
			!tokens.some(
				(token) =>
					token.type !== 'EQ' &&
					token.type !== 'LT' &&
					token.type !== 'GT' &&
					token.type !== 'NUMBER' &&
					token.type !== 'IDENTIFIER' &&
					token.type !== 'AND' &&
					token.type !== 'OR' &&
					token.type !== 'STRING' &&
					token.type !== 'BOOLEAN'
			)
		) {
			return {
				type: 'Valor',
				valor: {
					type: 'OperacionLogica',
					valor: this.obtenerValorDeOperacionLogica(tokens),
				},
			}
		}

		if (
			!tokens.some(
				(token) =>
					token.type !== 'PLUS' &&
					token.type !== 'MINUS' &&
					token.type !== 'MUL' &&
					token.type !== 'POW' &&
					token.type !== 'NUMBER' &&
					token.type !== 'IDENTIFIER'
			)
		) {
			const valor = tokens.map((t) => {
				if (t.type === 'NUMBER')
					return {
						type: 'Numero',
						valor:
							t.value.length === 1
								? {
										type: 'Digito',
										valor: t.value[0],
								  }
								: t.value.split('').map((char) => ({
										type: 'Digito',
										valor: char,
								  })),
					} as NodoNumero

				if (t.type === 'IDENTIFIER')
					return {
						type: 'Identificador',
						valor:
							t.value.length === 1
								? {
										type: 'Letra',
										valor: t.value[0],
								  }
								: t.value.split('').map((char) => ({
										type: 'Letra',
										valor: char,
								  })),
					} as NodoIdentificador

				switch (t.type) {
					case 'PLUS':
						return {
							type: 'OperadorAritmetico',
							valor: '+',
						} as NodoOperadorAritmetico
					case 'MINUS':
						return {
							type: 'OperadorAritmetico',
							valor: '-',
						} as NodoOperadorAritmetico
					case 'MUL':
						return {
							type: 'OperadorAritmetico',
							valor: '*',
						} as NodoOperadorAritmetico
					case 'POW':
						return {
							type: 'OperadorAritmetico',
							valor: '^',
						} as NodoOperadorAritmetico
					default:
						throw new Error('Operador aritmetico inesperado')
				}
			})

			return {
				type: 'Valor',
				valor: {
					type: 'OperacionAritmetica',
					valor,
				},
			}
		}

		if (tokens.length > 1) throw new Error('Asignacion invalida')

		return {
			type: 'Valor',
			valor: this.parseDato(),
		}
	}

	private parseDato(): NodoDato {
		const token = this.peek()

		if (token.type === 'NUMBER')
			return {
				type: 'Dato',
				valor: this.parseNumero(),
			}
		if (token.type === 'STRING')
			return {
				type: 'Dato',
				valor: this.parseCadena(),
			}
		if (token.type === 'BOOLEAN')
			return {
				type: 'Dato',
				valor: this.parseBooleano(),
			}

		throw new Error(`Tipo de dato inesperado: ${token.type}`)
	}

	private parseNumero(): NodoNumero {
		const valor = this.consume('NUMBER').value

		return {
			type: 'Numero',
			valor:
				valor.length === 1
					? {
							type: 'Digito',
							valor: valor[0],
					  }
					: valor.split('').map((char) => ({
							type: 'Digito',
							valor: char,
					  })),
		}
	}

	private parseBooleano(): NodoBooleano {
		const evaluacion = Boolean(this.consume('BOOLEAN').value)

		return {
			type: 'Booleano',
			valor: evaluacion ? 'true' : 'false',
		}
	}

	private parseCadena(): NodoCadena {
		return {
			type: 'Cadena',
			caracteres: this.parseCaracteres(),
		}
	}

	private parseCaracteres(): NodoCaracteres {
		const valor = this.consume('STRING').value

		return {
			type: 'Caracteres',
			valor:
				valor.length === 1
					? {
							type: 'Caracter',
							valor: valor[0],
					  }
					: valor.split('').map((char) => ({
							type: 'Caracter',
							valor: char,
					  })),
		}
	}

	private parseIdentificador(): NodoIdentificador {
		const valor = this.consume('IDENTIFIER').value

		return {
			type: 'Identificador',
			valor:
				valor.length === 1
					? {
							type: 'Letra',
							valor: valor[0],
					  }
					: valor.split('').map((char) => ({
							type: 'Letra',
							valor: char,
					  })),
		}
	}

	private parseBifurcacion(): NodoBifurcacion {
		this.consume('IF')

		const condicion = this.parseOperacionLogica()
		const procedimiento = this.parseProcedimiento()

		this.consume('SEMICOLON')

		return { type: 'Bifurcacion', condicion, procedimiento }
	}

	private parseOperacionLogica(): NodoOperacionLogica {
		const tokens: Token[] = []

		let current = this.peek()

		while (current.type !== 'LBRACE') {
			this.consume(current.type)

			tokens.push(current)

			current = this.peek()
		}

		if (
			!tokens.some(
				(token) =>
					token.type !== 'EQ' &&
					token.type !== 'LT' &&
					token.type !== 'GT' &&
					token.type !== 'NUMBER' &&
					token.type !== 'IDENTIFIER' &&
					token.type !== 'AND' &&
					token.type !== 'OR' &&
					token.type !== 'STRING' &&
					token.type !== 'BOOLEAN'
			)
		) {
			return {
				type: 'OperacionLogica',
				valor: this.obtenerValorDeOperacionLogica(tokens),
			}
		} else {
			throw new Error('Operacion logica inesperada')
		}
	}

	private obtenerValorDeOperacionLogica(
		tokens: Token[]
	): NodoOperacionLogica['valor'] {
		const valor: NodoOperacionLogica['valor'] = []

		let comparacion: NodoComparacionLogica['valor'] = []

		tokens.forEach((t, index) => {
			if (t.type === 'NUMBER') {
				comparacion.push({
					type: 'Dato',
					valor: {
						type: 'Numero',
						valor:
							t.value.length === 1
								? {
										type: 'Digito',
										valor: t.value[0],
								  }
								: t.value.split('').map((char) => ({
										type: 'Digito',
										valor: char,
								  })),
					},
				})

				if (index === tokens.length - 1) {
					valor.push({
						type: 'ComparacionLogica',
						valor: comparacion,
					})
				}

				return
			}

			if (t.type === 'STRING') {
				comparacion.push({
					type: 'Dato',
					valor: {
						type: 'Cadena',
						caracteres: {
							type: 'Caracteres',
							valor:
								t.value.length === 1
									? {
											type: 'Caracter',
											valor: t.value[0],
									  }
									: t.value.split('').map((char) => ({
											type: 'Caracter',
											valor: char,
									  })),
						},
					},
				})

				if (index === tokens.length - 1) {
					valor.push({
						type: 'ComparacionLogica',
						valor: comparacion,
					})
				}

				return
			}

			if (t.type === 'BOOLEAN') {
				comparacion.push({
					type: 'Dato',
					valor: {
						type: 'Booleano',
						valor: t.value === 'true' ? 'true' : 'false',
					},
				})

				if (index === tokens.length - 1) {
					valor.push({
						type: 'ComparacionLogica',
						valor: comparacion,
					})
				}

				return
			}

			if (t.type === 'IDENTIFIER') {
				comparacion.push({
					type: 'Identificador',
					valor:
						t.value.length === 1
							? {
									type: 'Letra',
									valor: t.value[0],
							  }
							: t.value.split('').map((char) => ({
									type: 'Letra',
									valor: char,
							  })),
				})

				if (index === tokens.length - 1) {
					valor.push({
						type: 'ComparacionLogica',
						valor: comparacion,
					})
				}

				return
			}

			if (t.type === 'AND' || t.type === 'OR') {
				valor.push({
					type: 'ComparacionLogica',
					valor: comparacion,
				})

				comparacion = []

				switch (t.type) {
					case 'AND':
						valor.push({ type: 'ConectorLogico', valor: 'and' })

						break
					case 'OR':
						valor.push({ type: 'ConectorLogico', valor: 'or' })

						break
					default:
						throw new Error('Conector logico inesperado')
				}

				return
			}

			switch (t.type) {
				case 'EQ':
					comparacion.push({
						type: 'OperadorLogico',
						valor: '==',
					} as NodoOperadorLogico)

					return
				case 'LT':
					comparacion.push({
						type: 'OperadorLogico',
						valor: '<',
					} as NodoOperadorLogico)

					return
				case 'GT':
					comparacion.push({
						type: 'OperadorLogico',
						valor: '>',
					} as NodoOperadorLogico)

					return
				default:
					throw new Error('Operador logico inesperado')
			}
		})

		return valor
	}
}
