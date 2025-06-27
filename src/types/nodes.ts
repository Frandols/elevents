type NodoAST =
	| NodoPrograma
	| NodoDeclaracion
	| NodoDeclaracionComportamental
	| NodoThrow
	| NodoCatch
	| NodoProcedimiento
	| NodoDeclaracionProcedural
	| NodoInstruccion
	| NodoAsignacion
	| NodoValor
	| NodoNumero
	| NodoDigito
	| NodoOperacionAritmetica
	| NodoOperadorAritmetico
	| NodoBooleano
	| NodoCadena
	| NodoCaracter
	| NodoBifurcacion
	| NodoOperacionLogica
	| NodoComparacionLogica
	| NodoOperadorLogico
	| NodoConectorLogico
	| NodoCaracteres
	| NodoCaracter
	| NodoDato
	| NodoIdentificador
	| NodoLetra

export default NodoAST

export interface NodoPrograma {
	type: 'Programa'
	declaraciones: NodoDeclaracion[]
}

export interface NodoDeclaracion {
	type: 'Declaracion'
	instruccion: NodoDeclaracionComportamental
}

export interface NodoDeclaracionComportamental {
	type: 'DeclaracionComportamental'
	comportamiento: NodoThrow | NodoCatch
}

export interface NodoThrow {
	type: 'Throw'
	evento: NodoCadena
}

export interface NodoCatch {
	type: 'Catch'
	evento: NodoCadena
	procedimiento: NodoProcedimiento
}

export interface NodoProcedimiento {
	type: 'Procedimiento'
	declaracion: NodoDeclaracionProcedural
}

export interface NodoDeclaracionProcedural {
	type: 'DeclaracionProcedural'
	instrucciones: NodoInstruccion[]
}

export interface NodoInstruccion {
	type: 'Instruccion'
	tipo: NodoAsignacion | NodoBifurcacion | NodoDeclaracionComportamental
}

export interface NodoAsignacion {
	type: 'Asignacion'
	id: NodoIdentificador
	valor: NodoValor
}

export interface NodoIdentificador {
	type: 'Identificador'
	valor: NodoLetra | NodoLetra[]
}

export interface NodoLetra {
	type: 'Letra'
	valor: string
}

export interface NodoValor {
	type: 'Valor'
	valor: NodoDato | NodoOperacionAritmetica | NodoOperacionLogica
}

export interface NodoDato {
	type: 'Dato'
	valor: NodoNumero | NodoBooleano | NodoCadena
}

export interface NodoNumero {
	type: 'Numero'
	valor: NodoDigito | NodoDigito[]
}

export interface NodoDigito {
	type: 'Digito'
	valor: string
}

export interface NodoOperacionAritmetica {
	type: 'OperacionAritmetica'
	valor: (NodoNumero | NodoOperadorAritmetico | NodoIdentificador)[]
}

export interface NodoOperadorAritmetico {
	type: 'OperadorAritmetico'
	valor: '+' | '-' | '*' | '^'
}

export interface NodoBooleano {
	type: 'Booleano'
	valor: 'true' | 'false'
}

export interface NodoCadena {
	type: 'Cadena'
	caracteres: NodoCaracteres
}

export interface NodoCaracteres {
	type: 'Caracteres'
	valor: NodoCaracter | NodoCaracter[]
}

export interface NodoCaracter {
	type: 'Caracter'
	valor: string
}

export interface NodoBifurcacion {
	type: 'Bifurcacion'
	condicion: NodoOperacionLogica
	procedimiento: NodoProcedimiento
}

export interface NodoOperacionLogica {
	type: 'OperacionLogica'
	valor: (NodoComparacionLogica | NodoConectorLogico)[]
}

export interface NodoComparacionLogica {
	type: 'ComparacionLogica'
	valor: (NodoDato | NodoOperadorLogico | NodoIdentificador)[]
}

export interface NodoOperadorLogico {
	type: 'OperadorLogico'
	valor: '==' | '<' | '>'
}

export interface NodoConectorLogico {
	type: 'ConectorLogico'
	valor: 'and' | 'or'
}
