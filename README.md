# Elevents

**Autores:**  
Francisco De Los Santos, Theo Echeverría, Cesar Raúl Huici, Ignacio Gauto  
**Universidad Nacional del Nordeste**  
**Materia:** Teoría de la Computación

---

## 🧠 Resumen

_Elevents_ es un **analizador sintáctico** construido como parte del trabajo integrador de la materia Teoría de la Computación. El objetivo principal es implementar un parser recursivo que procese una secuencia de tokens generada por un analizador léxico y construya un **árbol de sintaxis abstracta (AST)** para un lenguaje de programación orientado a eventos.

El lenguaje permite construir estructuras como `throw`, `catch`, `if`, asignaciones, y expresiones aritméticas y lógicas. Además, se exploran técnicas de análisis descendente recursivo y diseño de gramáticas en BNF.

---

## 🎯 Introducción

Este proyecto se centra en el diseño e implementación de un analizador sintáctico para un lenguaje de programación basado en eventos. La idea principal es permitir a los usuarios definir objetos que puedan **lanzar** y **capturar** eventos, lo que habilita un modelo de ejecución reactivo, ideal para videojuegos, interfaces gráficas y sistemas embebidos.

A diferencia de lenguajes tradicionales centrados en funciones u objetos, **Elevents** pone en el centro al flujo de eventos.

---

## 📐 Gramática del Lenguaje

La gramática está expresada en notación BNF:

```bnf
<programa> ::= <declaracion>
<declaracion> ::= <declaracion_comportamental> | <declaracion_comportamental> <declaracion>
<declaracion_comportamental> ::= <catch> | <throw>
<throw> ::= "throw" <cadena> ";"
<catch> ::= "catch" <cadena> <procedimiento> ";"
<procedimiento> ::= "{" <declaracion_procedural> "}"
<declaracion_procedural> ::= <instruccion> | <instruccion> <declaracion_procedural>
<instruccion> ::= <asignacion> | <bifurcacion> | <declaracion_comportamental>
<asignacion> ::= <identificador> "=" <valor> ";"
<identificador> ::= <letra> | <letra> <identificador>
<valor> ::= <dato> | <operacion_aritmetica> | <operacion_logica>
<dato> ::= <numero> | <booleano> | <cadena>
<numero> ::= <digito> | <digito> <numero>
<operacion_aritmetica> ::= <sentencia_aritmetica> | <sentencia_aritmetica> <operador_aritmetico> <operacion_aritmetica>
<sentencia_aritmetica> ::= <numero> <operador_aritmetico> <numero> | <numero> <operador_aritmetico> <identificador> | <identificador> <operador_aritmetico> <numero>
<operador_aritmetico> ::= "+" | "-" | "*" | "^"
<booleano> ::= "true" | "false"
<cadena> ::= "\"" <caracteres> "\""
<caracteres> ::= <caracter> | <caracter> <caracteres>
<caracter> ::= cualquier carácter excepto comillas dobles
<bifurcacion> ::= "if" <operacion_logica> <procedimiento> ";"
<operacion_logica> ::= <comparacion> | <comparacion> <conector_logico> <operacion_logica>
<comparacion> ::= <identificador> <operador_logico> <identificador> | <identificador> <operador_logico> <dato> | <dato> <operador_logico> <identificador>
<operador_logico> ::= "==" | "<" | ">"
<conector_logico> ::= "and" | "or"
```

---

## 🧪 Elección del tipo de parser

Se eligió un **parser recursivo descendente** escrito manualmente en **TypeScript**. Este enfoque consiste en crear una función por cada producción de la gramática, lo que permite recorrer los tokens de forma controlada, detectando errores sintácticos con claridad.

El parser valida la estructura del programa y construye un AST que representa jerárquicamente las instrucciones del lenguaje.

---

## ⚙️ Arquitectura del proyecto

El analizador sintáctico fue implementado en TypeScript. La arquitectura se divide en:

* `tokenizer.ts`: convierte el texto fuente en una lista de tokens.
* `parser.ts`: convierte los tokens en un AST.
* `visitor.ts`: recorre el AST y genera una representación legible del árbol.
* `tipos.ts`: define los tipos de nodos del AST.
* `casos-de-prueba/`: contiene entradas de prueba divididas por carpeta.

### Ejemplo de ejecución

```ts
const tokens = tokenize(input)
const parser = new Parser(tokens)
const programa = parser.parsePrograma()
const resultado = visitarNodo(programa)
console.log(resultado)
```

---

## 📁 Casos de prueba

Los casos de prueba se encuentran en la carpeta [`casos-de-prueba`](./casos-de-prueba), estructurados en subdirectorios numerados del 1 al 8.

Ejemplo:

* [`casos-de-prueba/1/input.txt`](./casos-de-prueba/1/input.txt): ejemplo básico con `catch` y `throw`.
* [`casos-de-prueba/3/input.txt`](./casos-de-prueba/3/input.txt): ejemplo de operaciones aritméticas y condicionales.

---

## 🧠 Lecciones aprendidas

* Aprendimos a implementar un parser paso a paso desde una gramática BNF.
* Entendimos cómo un error de sintaxis es interpretado y reportado por el analizador.
* Comprendimos a fondo la relación entre tokens, reglas gramaticales y estructuras de árbol (AST).
* Experimentamos con errores de forma deliberada para verificar la robustez del parser.

---

## 🧩 Conclusión

*Elevents* es una demostración práctica de cómo implementar un analizador sintáctico para un lenguaje nuevo. Logramos definir una gramática sólida, implementar su procesamiento en TypeScript y probar su comportamiento con múltiples entradas.

El lenguaje puede evolucionar en futuras versiones para incluir:

* Ciclos (`while`, `for`)
* Funciones y procedimientos
* Tipos de datos compuestos
* Sistema de tipos estático

Este trabajo nos permitió conectar los fundamentos teóricos con la práctica de implementación real de un parser.

---

## 📚 Bibliografía

1. M. Sipser, *Introduction to the Theory of Computation*, 3rd ed., Cengage, 2012.
2. J. E. Hopcroft, R. Motwani, J. D. Ullman, *Teoría de Autómatas, Lenguajes y Computación*, 3ra ed., Pearson, 2007.
3. J. G. Brookshear, *Teoría de la Computación*, 1ra ed., 1993.
4. Anónimo, *Temas de Teoría de la Computación*, Licencia CC BY-SA 3.0.
