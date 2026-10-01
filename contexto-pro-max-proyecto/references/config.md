# Config del proyecto — `contexto-pro-max.config.md`

Vive en la **raíz de la carpeta de trabajo** (`RAIZ`). La skill lo lee al arrancar; si no existe, lo crea preguntando lo mínimo.

## Esquema (ejemplo)

    proyecto: Mi Proyecto
    memoria: Memoria del proyecto.md
    mapa: MAPA-Mi-Proyecto.md
    fuentes:
      - Documentos
      - Investigación
    carpeta_privada: ST
    github:                         # opcional
      repo: MarioAlfredoCV/celimar-memoria-proyectos
      carpeta: Mi-Proyecto          # carpeta destino en el repo (sin espacios)
      token_file: ST/PAT.txt        # ruta del PAT, relativa a RAIZ
    memoria_automatica: false       # true = alinear también la memoria automática de Claude Code

## Campos

- **proyecto** (obligatorio): nombre; se usa en la compuerta y en el nombre por defecto del MAPA.
- **memoria** (obligatorio): nombre exacto del archivo de memoria en la raíz.
- **mapa**: nombre del MAPA (por defecto `MAPA-<proyecto>.md`, **sin espacios**).
- **fuentes** (obligatorio): carpetas a escanear como conocimiento.
- **carpeta_privada**: se **excluye por completo** del escaneo y de la memoria/MAPA (por defecto `ST`); nunca se lee ni se nombra.
- **github** (opcional): activa el Paso 10. El PAT lo usa el script; **nunca se imprime ni se escribe en la memoria**.
- **memoria_automatica** (opcional): si es `true`, alinea los nombres y ubicaciones de la memoria automática de Claude Code (carpeta `~/.claude/projects/<proyecto>/memory/`).

## Preguntas de la primera corrida (si no hay config)

Pregunta solo lo que falte, en lenguaje llano:

1. ¿Cómo se llama el proyecto?
2. ¿Cómo quieres que se llame el archivo de memoria?
3. ¿Qué carpetas contienen el conocimiento a memorizar?
4. ¿Hay alguna carpeta privada o sensible que deba excluir por completo? *(por defecto `ST`)*
5. ¿Quieres respaldo en GitHub? Si sí: repo, carpeta destino y dónde está el PAT.

Guarda las respuestas en `contexto-pro-max.config.md` y confirma el resultado antes de proceder.
