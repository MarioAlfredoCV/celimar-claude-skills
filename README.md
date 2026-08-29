# CEliMaR Claude Skills

Colección de [Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview) para Claude, de uso personal de Mario Alfredo Campos (CEliMaR Consulting Team).

## Skills incluidas

- **[`prompt-six-sigma/`](./prompt-six-sigma)** — control de calidad Six Sigma (DMAIC) aplicado a todo prompt y respuesta: evalúa claridad de objetivo, suficiencia de contexto y riesgo de ambigüedad antes de ejecutar, y hace una autorrevisión silenciosa antes de entregar.
- **[`plan-first/`](./plan-first)** — protocolo que obliga a diseñar un plan, identificar supuestos y esperar confirmación explícita del usuario antes de ejecutar cualquier tarea de varios pasos.
- **[`orquestador-asesor/`](./orquestador-asesor)** — emula en Claude Code/Cowork los patrones multiagente documentados por Anthropic (*orchestrator* y *advisor*) usando subagentes: reparte trabajo pesado y paralelizable en workers, y añade una capa de QA con un modelo más fuerte.
- **[`contexto-pro-max-proyecto/`](./contexto-pro-max-proyecto)** — ingeniería de contexto para un proyecto: una **memoria** autosuficiente y un **MAPA** (índice + sub-índice + grafo dirigido) que trabajan en sinergia para que Claude consulte solo lo necesario y ahorre del orden de **80–93% de tokens por consulta**. Corre en Cowork/Claude Code; la Wiki explica cómo llevar el mismo contexto a un proyecto gemelo en Chat.
- **[`humanizer/`](./humanizer)** — detecta y corrige patrones de escritura característicos de IA, en inglés y español (vocabulario delator, muletillas, aperturas genéricas, falso contraste "no es X sino Y", regla de tres, voz pasiva, entre otros), con base en Wikipedia: *Signs of AI writing* e investigación 2025-2026.
- **[`pptx-pro-max/`](./pptx-pro-max)** — sistema de decisión para presentaciones PowerPoint **editables** de alto impacto: convierte cada pedido en decisiones de narrativa, contenido, diseño visual, datos y plantilla (Minto, assertion-evidence, Mayer, Duarte, Knaflic, Tufte, WCAG), con un catálogo de plantillas de negocio y un **validador propio reforzado**. Autónoma.
- **[`deck-studio/`](./deck-studio)** — presentaciones de **máximo impacto visual**: renderiza cada lámina como HTML por navegador (Chromium) y la empaqueta como imagen a pantalla completa en un `.pptx` (no editable), con **8 estilos propios**, decisión código-vs-imagen y motor de render autónomo. Exporta a PDF.
- **[`infographic-studio/`](./infographic-studio)** — infografías de **una sola pieza**: lienzo HTML de ancho fijo y alto variable, renderizado y capturado completo (Chromium, sin recortar) como PNG de alta resolución, con PDF de una página al aceptarse. Reutiliza los 8 estilos propios de `deck-studio`; añade la regla de que todo dato numérico lleva su fuente citada. Autónoma.

## Instalación

Cada carpeta es un skill independiente y autocontenido. Para instalarlo, copia la carpeta completa (con su `SKILL.md` y, si aplica, sus subcarpetas `references/`, `scripts/` y `assets/`) dentro de tu directorio de skills de Claude (`.claude/skills/` en Claude Code, o el directorio equivalente en el Agent SDK).

`pptx-pro-max`, `deck-studio` e `infographic-studio` requieren dependencias (Node + `pptxgenjs` para las dos primeras, Python + `python-pptx`; `deck-studio` e `infographic-studio` además Playwright/Chromium para el render). Cada carpeta lo detalla en su propio `README.md`, incluida la reparación automática de dependencias (`scripts/ensure_engine.mjs` en cada una).

## Licencia

MIT — ver [`LICENSE`](./LICENSE).
