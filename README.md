# CEliMaR Claude Skills

Colección de [Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview) para Claude, de uso personal de Mario Alfredo Campos (CEliMaR Consulting Team).

## Skills incluidas

- **[`prompt-six-sigma/`](./prompt-six-sigma)** — control de calidad Six Sigma (DMAIC) aplicado a todo prompt y respuesta: evalúa claridad de objetivo, suficiencia de contexto y riesgo de ambigüedad antes de ejecutar, y hace una autorrevisión silenciosa antes de entregar.
- **[`plan-first/`](./plan-first)** — protocolo que obliga a diseñar un plan, identificar supuestos y esperar confirmación explícita del usuario antes de ejecutar cualquier tarea de varios pasos.
- **[`orquestador-asesor/`](./orquestador-asesor)** — emula en Claude Code/Cowork los patrones multiagente documentados por Anthropic (*orchestrator* y *advisor*) usando subagentes: reparte trabajo pesado y paralelizable en workers, y añade una capa de QA con un modelo más fuerte.
- **[`humanizer/`](./humanizer)** — detecta y corrige patrones de escritura característicos de IA, en inglés y español (vocabulario delator, muletillas, aperturas genéricas, falso contraste "no es X sino Y", regla de tres, voz pasiva, entre otros), con base en Wikipedia: *Signs of AI writing* e investigación 2025-2026 (Juzek & Ward, Kobak et al., The Economist, Juzek 2026).

## Instalación

Cada carpeta es un skill independiente y autocontenido. Para instalarlo, copia la carpeta completa (con su `SKILL.md` y, si aplica, su subcarpeta `references/`) dentro de tu directorio de skills de Claude (`.claude/skills/` en Claude Code, o el directorio equivalente en el Agent SDK).

## Licencia

MIT — ver [`LICENSE`](./LICENSE).

## Presentaciones

- **pptx-pro-max/** — sistema de decisión para presentaciones PPTX **editables** de alto impacto (narrativa, diseño, datos, catálogo de plantillas) con validador propio reforzado.
- **deck-studio/** — presentaciones de **máximo impacto visual** (HTML→imagen→PPTX, no editables) con 8 estilos propios y motor de render autónomo.
