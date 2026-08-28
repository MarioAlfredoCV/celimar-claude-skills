# Config del proyecto — `contexto-pro-max.config.md`

Vive en la **raíz del proyecto**. La skill lo lee al arrancar. Si no existe, lo crea preguntando lo mínimo.

## Esquema (ejemplo)

    proyecto: Mi Proyecto
    memoria: Memoria del proyecto.md
    mapa: MAPA-Mi-Proyecto.md
    fuentes:
      - Documentos
      - Investigación
    carpeta_privada: ST

## Campos

- **proyecto** (obligatorio): nombre; se usa en la compuerta de ambiente y en el nombre por defecto del MAPA.
- **memoria** (obligatorio): nombre exacto del archivo de memoria en la raíz.
- **mapa**: nombre del MAPA (por defecto `MAPA-<proyecto>.md`, **sin espacios**).
- **fuentes** (obligatorio): lista de carpetas raíz a escanear como conocimiento.
- **carpeta_privada**: carpeta a **excluir por completo** del escaneo y de la memoria/MAPA (por
  defecto `ST`). Útil para material sensible o llaves de acceso; **nunca se escanea ni se nombra**.

## Preguntas de la 1ª corrida (si no hay config)

Pregunta solo lo que falte, en lenguaje llano:

1. ¿Cómo se llama el proyecto?
2. ¿Cómo quieres que se llame el archivo de memoria?
3. ¿Qué carpetas contienen el conocimiento a memorizar?
4. ¿Hay alguna carpeta privada o sensible que deba excluir por completo? *(por defecto `ST`)*

Guarda las respuestas en `contexto-pro-max.config.md` y confirma el resultado antes de proceder.
