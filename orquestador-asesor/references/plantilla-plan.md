# Plantilla de la sección "Organización" del plan

Esto es lo que la skill **inyecta** en el plan que plan-first presenta al usuario, cuando la estrategia es distinta de "ninguna". No repitas aquí el resto del plan (objetivo, supuestos, pasos): eso ya lo maneja plan-first. Rellena los siete elementos; el séptimo es obligatorio y va **por adelantado**.

## Molde

```
### Organización del trabajo (multiagente)

1. Estrategia: <ninguna | solo-asesor | solo-orquestador | combinada>
   Por qué: <1-2 frases ancladas a las señales de la tarea>

2. Agente líder: <yo / hilo principal>
   Hará: planificar, redactar los briefs, delegar, sintetizar.
   [En orquestación pura y combinada] No procesaré el material crudo.

3. Roster de modelos:
   - Hilo principal (líder/ejecutor) — modelo de la SESIÓN: <recomendado Fable 5 / Sonnet 5>.
     ⚠️ No puedo cambiarlo yo; correré al modelo que tengas seleccionado ahora. Si no
     coincide con el recomendado, te sugiero cambiarlo tú (en esta sesión o en otra)
     antes de aprobar. Los subagentes de abajo sí los fijo yo.
   - Subagentes (los fijo yo): ejecutores <Sonnet 5 / Opus 5> (×N), asesor <Fable 5 / —>

4. Subagentes y descomposición: <N> workers.
   - Worker 1 → <pieza / sub-tarea>
   - Worker 2 → <pieza / sub-tarea>
   - ...

5. Briefs (una línea cada uno):
   - Worker k recibe <insumo>, entrega <resultado destilado> bajo <estándar>.

6. QA / asesor: <quién revisa a quién, con qué modelo, en qué momento>.

7. Ronda de revisiones (por adelantado): cuando entregue la v1 y me pidas
   cambios, re-delegaré con esta misma organización; decidiré como líder si
   los cambios ameritan reactivar al asesor o basta con el worker; si un
   asesor falla, el worker me entrega igual su parte destilada, me avisa y yo
   hago una revisión crítica mayor antes de consolidar.
```

## Ejemplo rellenado (caso combinado: 8 transcripciones)

```
### Organización del trabajo (multiagente)

1. Estrategia: combinada.
   Por qué: 8 transcripciones independientes (volumen paralelizable) y cada
   par documento+presentación se beneficia de un QA fuerte antes de consolidar.

2. Agente líder: yo (hilo principal).
   Hará: planificar, redactar los briefs, delegar las 8 piezas, integrar y
   entregar. No leeré las transcripciones crudas; solo veré lo destilado.

3. Roster de modelos:
   - Hilo principal (líder) — modelo de la SESIÓN: recomendado Fable 5.
     ⚠️ No puedo cambiarlo yo; si esta sesión no está en Fable 5, te sugiero cambiarlo
     (en esta sesión o en otra) antes de aprobar. Los subagentes sí los fijo yo.
   - Subagentes (los fijo yo): ejecutores Sonnet 5 (×8), asesor Fable 5 (QA por pieza)

4. Subagentes y descomposición: 8 workers, uno por transcripción.
   - Worker 1 → transcripción 1 → Word + presentación
   - ... (2 a 8, igual)

5. Briefs:
   - Worker k recibe la transcripción k y la plantilla/estilo acordados,
     entrega el .docx y el .pptx finales + una nota destilada (decisiones
     tomadas, dudas), bajo el estándar de formato y fidelidad convenido.

6. QA / asesor: antes de entregarme su parte, cada worker comisiona a un
   asesor Fable 5 que revisa su borrador (fidelidad a la transcripción,
   formato, coherencia). El worker incorpora y me entrega solo lo destilado;
   el detalle del QA no llega a mi contexto.

7. Ronda de revisiones (por adelantado): si tras ver la v1 pides ajustes a
   algún archivo, re-delego esa pieza a su worker; decido si el cambio amerita
   reactivar al asesor (cambios de fondo) o si basta el worker (ajustes
   menores); si el asesor falla, el worker me entrega igual lo destilado, me
   avisa, y reviso yo con mayor rigor. Vuelvo a entregarte para tu aprobación.
```

Ajusta el roster si la tarea lo pide (por ejemplo, subir el asesor a Opus 5 en piezas de alto riesgo) y **dilo** en el punto 3.
