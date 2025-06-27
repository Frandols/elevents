import NodoAST from './types/nodes'

export default function visitarNodo(nodo: NodoAST, indent: number = 0): string {
	const espacio = '  '.repeat(indent)

	let resultado = `\n${espacio}${nodo.type}`

	switch (nodo.type) {
		case 'Programa':
			resultado += nodo.declaraciones
				.map((d) => visitarNodo(d, indent + 1))
				.join('')
			break
		case 'Declaracion':
			resultado += visitarNodo(nodo.instruccion, indent + 1)
			break
		case 'DeclaracionComportamental':
			resultado += visitarNodo(nodo.comportamiento, indent + 1)
			break
		case 'Throw':
			resultado += visitarNodo(nodo.evento, indent + 1)

			break
		case 'Catch':
			resultado += visitarNodo(nodo.evento, indent + 1)
			resultado += visitarNodo(nodo.procedimiento, indent + 1)
			break
		case 'Procedimiento':
			resultado += visitarNodo(nodo.declaracion, indent + 1)
			break
		case 'DeclaracionProcedural':
			resultado += nodo.instrucciones
				.map((inst) => visitarNodo(inst, indent + 1))
				.join('')
			break
		case 'Instruccion':
			resultado += visitarNodo(nodo.tipo, indent + 1)
			break
		case 'Asignacion':
			resultado += visitarNodo(nodo.id, indent + 1)
			resultado += visitarNodo(nodo.valor, indent + 1)

			break
		case 'Bifurcacion':
			resultado += visitarNodo(nodo.condicion, indent + 1)
			resultado += visitarNodo(nodo.procedimiento, indent + 1)
			break
		case 'Caracteres':
			if ('length' in nodo.valor) {
				resultado += nodo.valor.map((n) => visitarNodo(n, indent + 1)).join('')

				break
			}

			resultado += visitarNodo(nodo.valor)
			break
		case 'Caracter':
			resultado += `: "${nodo.valor}"`

			break
		case 'Valor':
			resultado += visitarNodo(nodo.valor, indent + 1)

			break
		case 'Dato':
			resultado += visitarNodo(nodo.valor, indent + 1)

			break
		case 'Numero':
			if ('length' in nodo.valor) {
				resultado += nodo.valor.map((n) => visitarNodo(n, indent + 1)).join('')

				break
			}

			resultado += visitarNodo(nodo.valor, indent + 1)
			break
		case 'Digito':
			resultado += `: "${nodo.valor}"`

			break
		case 'OperacionAritmetica':
			resultado += nodo.valor.map((n) => visitarNodo(n, indent + 1)).join('')

			break
		case 'Identificador':
			if ('length' in nodo.valor) {
				resultado += nodo.valor.map((n) => visitarNodo(n, indent + 1)).join('')

				break
			}

			resultado += visitarNodo(nodo.valor, indent + 1)

			break
		case 'Letra':
			resultado += `: "${nodo.valor}"`

			break
		case 'OperadorAritmetico':
			resultado += `: "${nodo.valor}"`

			break
		case 'OperacionLogica':
			if ('length' in nodo.valor) {
				resultado += nodo.valor.map((n) => visitarNodo(n, indent + 1)).join('')

				break
			}

			resultado += visitarNodo(nodo.valor, indent + 1)

			break
		case 'ComparacionLogica':
			resultado += nodo.valor.map((n) => visitarNodo(n, indent + 1)).join('')

			break
		case 'OperadorLogico':
			resultado += `: "${nodo.valor}"`

			break
		case 'Cadena':
			resultado += visitarNodo(nodo.caracteres, indent + 1)

			break
		case 'ConectorLogico':
			resultado += `: "${nodo.valor}"`

			break
		case 'Booleano':
			resultado += `: "${nodo.valor}"`

			break
		default:
			throw new Error(
				`Un nodo no reconocido fue encontrado ${JSON.stringify(nodo)}`
			)
	}

	return resultado
}
