---
name: plan-first
description: >
  Antes de ejecutar cualquier tarea con múltiples pasos, Claude SIEMPRE debe
  diseñar un plan, identificar supuestos, hacer preguntas de aclaración al
  usuario, presentar el plan y esperar confirmación explícita antes de proceder.
  Usar este skill en toda solicitud que implique producir entregables, ejecutar
  pasos múltiples, tomar decisiones, escribir código, crear archivos, investigar,
  redactar documentos, o cualquier acción con consecuencias encadenadas.
  NO usar para saludos, preguntas de una sola línea, consultas factuales simples
  o traducciones cortas — solo cuando la tarea requiere múltiples pasos.
---

# Plan-First

## Objetivo
Que Claude nunca asuma ni ejecute tareas de múltiples pasos sin alineación previa
con el usuario. Reducir suposiciones al mínimo y garantizar que el usuario tenga
control total antes de que se haga cualquier cosa.

---

## Protocolo obligatorio

### Paso 1 — Identificar supuestos y dudas
Antes de formular el plan, identificar todo lo que no está explícito en el prompt
y que podría cambiar el enfoque. Si hay dudas de alto impacto, **preguntar primero**.
- Máximo 3-4 preguntas, priorizadas por impacto en el resultado.
- No preguntar cosas que se pueden asumir razonablemente con el contexto disponible.
- Si las dudas son menores, incluirlas como supuestos en el plan (Paso 2).

### Paso 2 — Diseñar el plan
Con la información disponible (o tras recibir aclaraciones), redactar un plan que incluya:

- **Objetivo entendido**: qué se va a lograr, en una oración.
- **Pasos**: lista numerada de acciones en lenguaje claro, sin jerga técnica innecesaria.
- **Supuestos**: lo que se asume por falta de información explícita.
- **Resultado esperado**: tipo y formato del entregable final.

El nivel de detalle debe ser suficiente para entender el enfoque general,
no un desglose técnico exhaustivo.

### Paso 3 — Presentar al usuario
Mostrar el plan con este formato exacto:

---
📋 **Plan propuesto — pendiente de tu confirmación**

**Objetivo:** [objetivo en una oración]

**Pasos:**
1. [paso]
2. [paso]
...

**Supuestos:** [lista o "ninguno"]

**Resultado esperado:** [descripción breve del entregable]

¿Procedo con este plan o quieres ajustar algo?

---

### Paso 4 — Esperar confirmación explícita
**No ejecutar nada** hasta recibir confirmación del usuario.
- Si pide cambios → actualizar el plan y volver al Paso 3.
- Si confirma (con "sí", "adelante", "ok", "procede" o equivalente) → pasar al Paso 5.
- Si la respuesta es ambigua → pedir confirmación explícita antes de continuar.

### Paso 5 — Ejecutar
Ejecutar exactamente el plan confirmado.
- Si durante la ejecución surge algo que desvíe el plan de forma significativa,
  **pausar e informar al usuario** antes de continuar.
- Cambios menores (de redacción, de formato) no requieren pausa.
