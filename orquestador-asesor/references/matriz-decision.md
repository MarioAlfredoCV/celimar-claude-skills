# Matriz de decisión de estrategia

Ayuda para el **Paso 1** de la skill: elegir entre **ninguna**, **solo-asesor**, **solo-orquestador** o **combinada**. La regla de oro es del cookbook de Anthropic: *la metodología se adecúa a la tarea, no al revés*. Si delegar no aporta, no delegues.

## Las cuatro salidas y sus señales

| Salida | Señales que la disparan | Señales en contra |
|---|---|---|
| **Ninguna** | Tarea corta o de una sola pieza; poca lectura/procesamiento que repartir; o exige juicio de modelo frontera sobre el material crudo | Hay volumen paralelizable real; o es larga y una buena decisión inicial cambia el resultado |
| **Solo-asesor** | Una sola pieza (un documento, un análisis, una arquitectura), larga o de alto riesgo; el valor está en el plan inicial o en una revisión fuerte | Hay N piezas independientes que podrían correr en paralelo |
| **Solo-orquestador** | N piezas similares e **independientes**; lectura/procesamiento pesado; barridos de código o datos; cobertura (verificar muchos hechos) | Cada pieza necesita juicio sutil que un ejecutor barato perdería |
| **Combinada** | Volumen paralelizable **y** cada pieza se beneficia de un QA fuerte antes de consolidar | El volumen es trivial, o el QA no cambia la calidad final |

## Flujo de decisión (cuatro preguntas)

1. **¿Hay volumen paralelizable?** ¿Puedo partir la tarea en piezas independientes que no dependen unas de otras (varias transcripciones, archivos, fuentes, módulos)?
   - **No** → sigue en 2 (asesor o ninguna).
   - **Sí** → sigue en 3 (orquestador u orquestador+asesor).
2. **(Sin volumen) ¿Es larga o de alto riesgo, donde acertar el plan o una revisión fuerte mueve la aguja?**
   - **Sí** → **solo-asesor**.
   - **No** → **ninguna** (resuélvela directo).
3. **(Con volumen) ¿Cada pieza se beneficia de un QA fuerte antes de consolidar?**
   - **Sí** → **combinada**.
   - **No** → **solo-orquestador**.
4. **Chequeo de "juicio frontera":** ¿la tarea exige análisis sutil del *contenido mismo* (no transformar ni buscar, sino interpretar con finura)? Si es así, un worker barato puede resumir de más lo que importa → considera **ninguna** o sube el modelo del ejecutor y dilo.

## Ejemplos (solicitud → estrategia)

- *"Toma estas 8 transcripciones de reuniones y arma, por cada una, un documento Word y una presentación."* → **Combinada**. Ocho piezas independientes (orquestador) y cada entregable se beneficia de un QA por pieza (asesor). Es el caso del ejemplo de referencia.
- *"Verifica el precio de entrada y la política de reservas de los 10 parques nacionales más grandes contra sus sitios oficiales."* → **Solo-orquestador**. Cobertura: mucha lectura mandatoria, paralelizable; un worker por parque devuelve el dato destilado con su fuente.
- *"Rediseña la arquitectura de este flujo n8n y explícame los trade-offs."* → **Solo-asesor**. Una sola pieza, alto riesgo; el valor está en el plan/consejo de un modelo fuerte, no en repartir.
- *"Redacta un post de LinkedIn a partir de esta idea."* → **Ninguna**. Una pieza corta; delegar solo suma costo fijo de arrancar subagentes.
- *"Barre todo el repositorio y lista dónde se usa la función `foo`."* → **Solo-orquestador** si el repo es grande (varios workers por subárbol devuelven coincidencias destiladas); **ninguna** si es pequeño.
- *"Analiza la ambigüedad ética de este caso y dame tu lectura matizada."* → **Ninguna** o **solo-asesor**: es juicio fino sobre el contenido; no lo repartas entre ejecutores baratos que lo aplanarían.

## Notas que evitan errores comunes

- **Granularidad de los briefs:** dividir de más subió el costo en las pruebas del cookbook (cada subagente tiene un costo fijo de arranque). Busca el punto donde cada brief es sustancial, no atómico. Diez piezas naturales ≠ cincuenta micro-tareas.
- **El estándar solo cubre lo que especificas:** los workers verifican/procesan exactamente lo que dice su brief. Si un criterio de calidad no está escrito, no ocurre.
- **La descomposición también se puede equivocar:** verificar bien cada pieza no sirve si la lista de piezas estaba mal. Si la premisa (qué piezas hay) es dudosa, gasta una delegación en validarla antes de repartir.
- **Cuando dudes entre "ninguna" y una estrategia:** si no puedes nombrar el volumen paralelizable ni el riesgo que justifica un asesor, es "ninguna".
