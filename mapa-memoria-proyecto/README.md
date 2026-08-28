# mapa-memoria-proyecto

Ingeniería de contexto para proyectos de Claude en **Cowork** o **Claude Code**: una **memoria** de proyecto autosuficiente + un **MAPA** (índice + sub-índice + grafo dirigido) que trabajan en sinergia para que Claude consulte **solo lo necesario** y ahorre del orden de **80–93% de tokens por consulta** frente a leer la memoria completa.

## Qué hace

- Crea (bootstrap) o actualiza una memoria de proyecto **autosuficiente**, con cada sección clasificada `Crítico`/`Normal`.
- Regenera el **MAPA** que enruta la lectura por **título de sección** (nunca por número de línea): índice, sub-índice de secciones gigantes y grafo dirigido de relaciones.
- Genera el texto de la **instrucción de arranque** para que lo pegues en la configuración del proyecto (sin eso, el enrutamiento no se activa).

## Requisitos

- **Cowork o Claude Code** (necesita herramientas de archivo + `Grep`). No corre en Chat.
- Un archivo `mapa-memoria.config.md` en la raíz del proyecto. Si no existe, la skill lo crea preguntando lo mínimo.

## Instalación

Copia esta carpeta completa (`SKILL.md` + `references/`) dentro del directorio de skills de Claude: `.claude/skills/` en Claude Code, o el equivalente en Cowork.

## Uso

Pídele a Claude *"monta la memoria y el MAPA de este proyecto"* (o *"actualízalos"*). La primera vez, pega la instrucción de arranque que la skill te entregue.

## Llevarlo al móvil (avanzado)

La [Wiki](https://github.com/MarioAlfredoCV/celimar-claude-skills/wiki/mapa-memoria-proyecto) explica cómo replicar el mismo contexto en un **proyecto gemelo en Claude Chat** (repositorio privado de GitHub + memoria y MAPA como base de conocimiento), y las buenas prácticas de la llave de acceso. No forma parte de la skill base.

## Licencia

MIT.
