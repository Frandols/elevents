import * as fs from 'fs'
import * as path from 'path'
import Parser from './parser'
import tokenize from './tokenizer'
import visitarNodo from './visitor'

function obtenerInputsDeCasos(): Record<string, string> {
	const resultados: Record<string, string> = {}

	for (let i = 1; i <= 8; i++) {
		const ruta = path.join('casos-de-prueba', i.toString(), 'input.txt')
		try {
			const contenido = fs.readFileSync(ruta, 'utf-8')
			resultados[i.toString()] = contenido
		} catch (err) {
			console.error(`❌ Error al leer el archivo en el caso ${i}:`)
		}
	}

	return resultados
}

function escribirSalidasEnCasos(
	salidas: string[],
	nombreArchivo = 'output.txt'
) {
	if (salidas.length !== 8) {
		throw new Error('El arreglo debe tener exactamente 8 elementos.')
	}

	for (let i = 0; i < salidas.length; i++) {
		const carpeta = path.join('casos-de-prueba', (i + 1).toString())
		const archivo = path.join(carpeta, nombreArchivo)

		try {
			fs.writeFileSync(archivo, salidas[i], 'utf-8')
			console.log(`✅ Escrito en ${archivo}`)
		} catch (err) {
			console.error(`❌ Error escribiendo en ${archivo}:`)
		}
	}
}

function test() {
	try {
		const inputs = obtenerInputsDeCasos()

		const outputs = Object.values(inputs).map((value) => {
			try {
				const tokens = tokenize(value)

				const parser = new Parser(tokens)

				const programa = parser.parsePrograma()

				const arbol = visitarNodo(programa)

				return arbol
			} catch (error: any) {
				if (error instanceof Error) {
					return error.message
				}

				throw new Error('Error desconocido')
			}
		})

		escribirSalidasEnCasos(outputs)
	} catch (error) {
		if (error instanceof Error) {
			console.log(error.message)
		}
	}
}

test()
