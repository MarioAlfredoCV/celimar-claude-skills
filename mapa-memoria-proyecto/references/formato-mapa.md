# Formato del MAPA (`MAPA-<proyecto>.md`)

Artefacto **derivado** de la memoria; se **regenera después** de ella. Enruta por **título de
encabezado** (Grep), nunca por número de línea. Nodo = código de sección (estable ante ediciones).

## Estructura

    # MAPA-<proyecto> — índice + grafo de relaciones

    > Capa de arranque para enrutar la lectura de <memoria> sin abrirla entera.
    > Cómo enrutar: (1) ubica en el índice la sección; (2) sigue el grafo 1 salto
    > (insumos + impactos); (3) salta por Grep del título exacto; si es ⬛ gigante,
    > usa el sub-índice y lee solo el sub-bloque ####.

    ## 1. ÍNDICE (tema → título exacto)
    - **1** · [Crítico/Normal] · palabras clave → `## 1. Título de sección`
    - **2.1** · [Crítico/Normal] · palabras clave → `### 2.1 Título`
    - **5.1** ⬛ · [Crítico] · palabras clave (sección gigante: usa el Sub-índice) → `### 5.1 Título`
    - … (una entrada por cada `##`/`###`)

    ## 2. SUB-ÍNDICE de secciones gigantes ⬛
    **§5.1 …** — sub-bloques:
    - **5.1.1** · palabras clave → `#### 5.1.1 Título del sub-bloque`
    - … (una entrada por cada `####` de las gigantes)

    ## 3. GRAFO DE RELACIONES (dirigido)
    - **N Título** — Insumos: A · B · Impacta: C · D
    - … (una línea por nodo; 2–4 aristas de alto valor)

    ```mermaid
    graph LR
      n1["1 …"] --> n2["2 …"]
    ```

    *Regenerar desde la skill cuando cambie la estructura de la memoria.*

## Reglas

- **Índice:** una entrada por `##`/`###`, con la marca `Crítico`/`Normal` (de la primera
  línea de la sección) + palabras clave + el **título exacto entre backticks**. Las secciones
  **utilitarias** (un *índice global de archivos*, etc.) se marcan `util`, no Crítico/Normal.
- **Sub-índice:** una entrada por cada `####` de las secciones marcadas ⬛ (gigantes). Si la
  memoria **no tiene** secciones gigantes, deja la sección con una nota «(ninguna)» u omítela.
- **Grafo:** **insumo** = leer antes (aguas arriba); **impacta** = revisar si esto cambia
  (aguas abajo). Máximo 2–4 aristas por nodo (evita el "grafo madeja"). Backbone en Mermaid
  con la columna vertebral (no los 48 nodos).
- **Verificación obligatoria:** cada título-ancla del MAPA debe existir como encabezado real
  en la memoria (prefijo de línea). Si falla, corrige antes de cerrar.
